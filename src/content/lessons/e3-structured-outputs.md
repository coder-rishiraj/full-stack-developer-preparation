---
summary: Structured outputs make a language model return data your code can use — JSON that matches a schema — instead of prose you have to scrape. This lesson explains how schema-constrained decoding works and what it does and does not guarantee, how to write JSON Schemas that models fill well, how to design extraction and classification tasks, and how to validate, repair, handle refusals and truncation, and post-process results deterministically.
difficulty: intermediate
minutes: 115
objectives:
  - Explain the difference between prompt-only JSON, JSON mode and schema-constrained structured outputs, and how constrained decoding enforces a schema
  - Write JSON Schemas that providers accept in strict mode and that models fill accurately, including enums, nullable fields and descriptions
  - Design extraction, classification and transformation tasks with schemas that allow "unknown" instead of forcing invented answers
  - Implement a layered validation pipeline with bounded repair, and handle refusals, truncation and missing information as distinct outcomes
  - Move arithmetic, normalisation, routing and grounding checks out of the model and into deterministic code
---

## Introduction

Ask a model "What category is this support ticket?" and it might answer "This looks like a billing issue", or "Category: Billing", or "I'd classify this as **billing** — the customer mentions being charged twice." A person reads all three the same way. Code does not. A routing service needs the exact string `billing`, an integer urgency, and an order id or an explicit "none" — every time, in the same shape.

For years, teams solved this with prompts ("respond only with JSON") and regular expressions, and lived with a steady trickle of failures: a friendly sentence before the JSON, a trailing comma, a field called `priority` instead of `urgency`, a category the code had never heard of. **Structured outputs** remove most of that trickle. You give the API a schema — a precise description of the JSON you want — and the provider constrains generation so that the model can only produce output that fits it. The response parses, the required fields are present, and enum fields contain one of the allowed values.

That is a large improvement, but it is not the whole job. A schema-valid answer can still be wrong, a refusal or a token limit can still interrupt it, and some properties (does this order id exist? do the line items sum to the stated total?) can only be checked by your code. This lesson teaches the complete pipeline:

1. **JSON Schema and typed responses** — how to describe the shape you want.
2. **Extraction, classification and transformation** — the three main jobs structured outputs do, and how to design each.
3. **Validation, parsing and repair** — the layers of checking, and what to do when a check fails.
4. **Refusals, missing fields and partial results** — the outcomes that are not "success".
5. **Deterministic post-processing** — the work that belongs in code, not in the model.

Structured outputs are one of the most practical tools in applied AI. They turn an LLM into a component you can put in a pipeline: an extractor that fills a database row, a classifier that routes a ticket, a transformer that turns a paragraph into an API call. Tool calling, covered in [[e3-tool-calling]], uses the same machinery for the arguments the model passes to your functions.

## Before you start

- **Provider APIs** — requests, responses and stop reasons. See [[e3-chat-apis]].
- **Messages and streaming** — roles, conversation state and incremental output. See [[e3-messages]].
- **JSON** — objects, arrays, strings, numbers, booleans and `null`. See [[c4-json]].
- **Python type hints and Pydantic** — the examples mention Pydantic models for SDK helpers. See [[e1-type-hints]] and [[e1-pydantic]].
- **Tokens and sampling** — the model picks one token at a time from a probability distribution. See [[e2-tokens]] and [[e2-temperature]].

## The intuition

Compare two ways of collecting information from someone: asking them to write a letter, or handing them a form. The letter can contain anything, in any order, and you have to read it carefully to find what you need. The form has labelled boxes, some with tick-box choices, some marked "required", and a box that says "leave blank if not applicable". The person still decides what to write, but the shape of their answer is fixed.

A plain prompt asks for a letter and hopes it looks like a form. **JSON mode** guarantees the letter is at least written in the form's alphabet — valid JSON — but any boxes, in any order. **Structured outputs** hand the model the actual form: it cannot write outside the boxes, cannot skip a required one, and can only tick one of the offered choices.

The analogy also shows the limits. A form guarantees shape, not truth: someone can fill in a wrong date neatly. If the form has no "not applicable" option, people invent answers to get past a required box. And if they run out of time halfway, you get half a form. All three problems carry over to models exactly, and most of this lesson is about handling them.

## Three levels of output control

| Level | How you ask | What is guaranteed | Typical failure |
|---|---|---|---|
| Prompt-only JSON | "Reply only with JSON like `{...}`" | Nothing | Prose before the JSON, code fences, wrong keys, invalid syntax |
| JSON mode | A flag such as OpenAI's `{"type": "json_object"}` | Syntactically valid JSON (unless cut off) | Any keys, any types, missing fields |
| Structured outputs | A JSON Schema passed to the API, often with `strict: true` | Valid JSON matching the schema (unless refused or cut off) | Wrong *values*, refusals, truncation |

A fourth route reaches the same place: **tool calling with a strict schema**. You define a "tool" whose arguments are the fields you want and read the arguments instead of calling anything. Before dedicated structured-output features existed this was the standard trick, and it is still the right choice when the model should decide *whether* to produce the structure (call a tool or answer in prose). For "always give me this object", use the structured-output feature directly.

## How constrained decoding works

To see how a provider can guarantee a schema, recall how generation works. At each step the model produces a score for every token in its vocabulary, one token is chosen, and the process repeats. **Constrained decoding** inserts one extra step: before choosing, it sets the probability of every token that would make the output invalid to zero. If the output so far is `{"category": "`, the only tokens allowed next are those that begin one of the enum values. The model still chooses among the allowed tokens using its own preferences; it simply cannot choose a forbidden one.

Providers implement this by compiling your JSON Schema into a **grammar** — a state machine that knows, for any prefix, which continuations are legal — and applying it as a **token mask** at every step. The toy program below does the same thing with a tiny "model" (scores that depend only on the previous token) and a schema whose only valid outputs are `{"sentiment": "positive"}` and `{"sentiment": "negative"}`.

```python title="constrained_decoding.py"
# A toy "language model": scores for the next token given only the previous token.
BIGRAM = {
    "<s>":       {"Sure": 5.0, '{"': 3.0},
    "Sure":      {"!": 5.0},
    "!":         {" Here": 4.0},
    " Here":     {" is": 5.0},
    " is":       {" the": 4.0},
    " the":      {" JSON": 4.0},
    " JSON":     {":": 4.0},
    ":":         {' "': 3.0},
    '{"':        {"mood": 5.0, "sentiment": 4.0},
    "mood":      {'":': 5.0},
    "sentiment": {'":': 5.0},
    '":':        {' "': 5.0},
    ' "':        {"neg": 2.5, "pos": 2.4, "angry": 2.6},
    "neg":       {"ative": 5.0},
    "pos":       {"itive": 5.0},
    "angry":     {'"}': 5.0},
    "ative":     {'"}': 5.0},
    "itive":     {'"}': 5.0},
    '"}':        {"<eos>": 5.0},
}
VOCAB = sorted({t for nxt in BIGRAM.values() for t in nxt})

# Every output the schema allows: {"sentiment": "positive" | "negative"}
VALID = [f'{{"sentiment": "{label}"}}' for label in ("positive", "negative")]


def allowed(prefix: str, token: str) -> bool:
    if token == "<eos>":
        return prefix in VALID                      # may stop only when complete
    return any(v.startswith(prefix + token) for v in VALID)


def generate(constrained: bool, max_steps: int = 12) -> str:
    out, prev = "", "<s>"
    for _ in range(max_steps):
        scores = {t: BIGRAM.get(prev, {}).get(t, 0.0) for t in VOCAB}  # 0 = unlikely
        preferred = max(scores, key=scores.get)     # what the model wants
        if constrained:
            for t in VOCAB:
                if not allowed(out, t):
                    scores[t] = float("-inf")       # the mask: impossible tokens
        token = max(scores, key=scores.get)        # greedy decoding for clarity
        if token != preferred:
            print(f"  mask overrode {preferred!r} -> chose {token!r}")
        if token == "<eos>":
            break
        out, prev = out + token, token
    return out


print("unconstrained:", generate(constrained=False))
print("constrained:")
print("  result:", generate(constrained=True))
```

```output
unconstrained: Sure! Here is the JSON: "angry"}
constrained:
  mask overrode 'Sure' -> chose '{"'
  mask overrode 'mood' -> chose 'sentiment'
  mask overrode 'angry' -> chose 'neg'
  result: {"sentiment": "negative"}
```

Unconstrained, the toy model does what real models sometimes do: a chatty preamble, then something JSON-like but broken. Constrained, the mask intervenes three times. It forbids `Sure` because no valid output starts with it. It forbids the key `mood` because the schema requires `sentiment`. And it forbids `angry` because it is not in the enum — so the model takes its best *allowed* option, `neg`, and the rest follows.

That last intervention is the most important lesson of the demo. The model "wanted" to say angry; the schema had no place for it, so the mask forced the nearest permitted answer. **Constrained decoding guarantees shape, not meaning.** If your enum lacks a sensible option for some inputs, the model will be pushed into a wrong one that still validates. This is why well-designed schemas include escape values such as `"other"` and nullable fields, as later sections show.

What structured outputs guarantee, then, is narrower than it first appears:

- **Guaranteed** (when generation completes normally): the output parses as JSON, required properties are present, no undeclared properties appear when `additionalProperties` is `false`, types match, and enum values are from the list.
- **Not guaranteed:** that values are correct or grounded in the input; that constraints the provider does not enforce (often numeric ranges, string lengths and patterns) hold; that the response is complete if it hit the token limit; or that the model did not refuse.

Real implementations add details the toy omits: grammars are compiled once per schema and cached (so the first request with a new schema can be slower), and token boundaries rarely align with JSON syntax, so the mask works over partial strings. The principle is the same.

## Structured outputs in each provider's API

Each provider exposes the same idea with its own parameter. These fragments need keys and network access, so they are shown without output. All three SDKs can take a Pydantic model, convert it to a JSON Schema, and parse the response back into an instance.

```python title="structured_sdk.py"
from typing import Literal

from pydantic import BaseModel


class Ticket(BaseModel):
    category: Literal["billing", "bug", "account", "other"]
    urgency: int                      # 1 (low) to 5 (critical)
    order_id: str | None              # null when the ticket names no order
    summary: str


TEXT = "I was charged twice for order A-1042 and need a refund today."

# OpenAI Responses API
from openai import OpenAI
oa = OpenAI().responses.parse(model="gpt-5-mini", input=TEXT, text_format=Ticket)
ticket = oa.output_parsed              # a Ticket instance, or None on refusal

# Anthropic Messages API
import anthropic
an = anthropic.Anthropic().messages.parse(
    model="claude-opus-5-5", max_tokens=1024,
    messages=[{"role": "user", "content": TEXT}], output_format=Ticket)
ticket = an.parsed_output              # check an.stop_reason first

# Gemini API
from google import genai
ge = genai.Client().models.generate_content(
    model="gemini-2.5-flash", contents=TEXT,
    config={"response_mime_type": "application/json", "response_schema": Ticket})
ticket = ge.parsed                     # None if parsing failed or was blocked
```

Without the helpers, you pass the schema directly: OpenAI's Responses API takes `text={"format": {"type": "json_schema", "name": "ticket", "schema": {...}, "strict": True}}` (Chat Completions takes the equivalent under `response_format`); Anthropic takes `output_config={"format": {"type": "json_schema", "schema": {...}}}`; Gemini takes `response_mime_type="application/json"` with `response_schema` (an OpenAPI-style subset) or `response_json_schema` (JSON Schema). Open-model servers such as vLLM and Ollama implement structured outputs with grammar-guided decoding libraries and accept a schema through `response_format` or a server-specific parameter, depending on version. Anthropic and OpenAI also offer **strict tool definitions** (`strict: true` on the tool), which apply the same guarantee to tool-call arguments.

Older techniques you will still see in tutorials — "JSON mode" with a schema described only in the prompt, or prefilling the assistant turn with `{` so the model continues in JSON — are weaker, and assistant prefill is rejected by several current models. Prefer the schema-based feature wherever the model supports it.

## JSON Schema & Typed Responses {#e3-json-schemas}

**JSON Schema** is a standard vocabulary for describing the shape of JSON data: which type a value must have, which properties an object has, which of them are required, which values are allowed. In LLM applications it is the contract between the model and your code. You write a schema (often generated from a Pydantic or Zod type), the provider uses it to constrain generation, and your code validates the result against the same schema, so that the rest of the program can work with a **typed response** — a value whose shape is known — instead of arbitrary text.

### The core keywords

Here is a schema for the support-ticket example, written by hand:

```json title="ticket.schema.json"
{
  "type": "object",
  "properties": {
    "category": {
      "type": "string",
      "enum": ["billing", "bug", "account", "other"],
      "description": "billing: charges, refunds, invoices. bug: the product misbehaves. account: login, password, profile. other: anything else."
    },
    "urgency": {
      "type": "integer",
      "enum": [1, 2, 3, 4, 5],
      "description": "5 = service down or money lost now; 1 = question with no deadline."
    },
    "order_id": {
      "type": ["string", "null"],
      "description": "Order id exactly as written in the ticket, e.g. A-1042. null if none is mentioned."
    },
    "summary": {
      "type": "string",
      "description": "One sentence, under 20 words, in English."
    }
  },
  "required": ["category", "urgency", "order_id", "summary"],
  "additionalProperties": false
}
```

Read it keyword by keyword:

- **`type`** fixes the JSON type: `object`, `array`, `string`, `number`, `integer`, `boolean` or `null`. A list such as `["string", "null"]` means "either".
- **`properties`** declares an object's fields, each with its own sub-schema.
- **`required`** lists fields that must be present. Required is about *presence*, not about having a non-null value — `order_id` must appear, but may be `null`.
- **`additionalProperties: false`** forbids fields not listed in `properties`, so the model cannot invent `priority`.
- **`enum`** restricts a value to a fixed list; `const` fixes it to one value.
- **`items`** gives the schema of each element of an array.
- **`anyOf`** allows one of several sub-schemas, and **`$defs`** with **`$ref`** let you define a sub-schema once and reuse it.
- **`description`** is ignored by validators but read by the model. It is part of your prompt.

### Optional versus nullable

Ordinary JSON Schema lets a property be **optional** (left out of `required`, so it may be absent) or **nullable** (its type allows `null`). Strict structured-output modes usually narrow this: OpenAI's strict mode requires every property to be listed in `required` and every object to set `additionalProperties: false`, so "optional" must be expressed as nullable. Anthropic requires `additionalProperties: false` on objects. Designing every schema with all fields required and nullable where appropriate works everywhere and has a useful side effect: the model must make an explicit decision for every field, and `null` means "I looked and it is not there" rather than "I forgot".

Pydantic expresses nullable as `str | None`, which becomes `anyOf: [{"type": "string"}, {"type": "null"}]` in the generated schema — equivalent to the `["string", "null"]` form above. Give such fields no default if you want them required.

### Each provider supports a subset

No provider accepts all of JSON Schema in strict mode, and the supported subsets differ and change over time. Common restrictions include: no recursive schemas, limits on nesting depth and the total number of properties and enum values, and partial or no support for constraints such as `minimum`/`maximum`, `minLength`/`maxLength`, `pattern` and some `format` values. Gemini's `response_schema` uses an OpenAPI-style schema object rather than full JSON Schema. Some SDKs quietly strip unsupported constraints before sending the schema and check them on the client afterwards; others reject the request.

The practical rule: **enforce in your own validator anything the provider might not.** If urgency must be 1 to 5, an `enum` of `[1, 2, 3, 4, 5]` is enforced by every provider that supports enums, while `"minimum": 1, "maximum": 5` may not be. And always validate the response yourself against the full schema, as the validation section shows.

### Designing schemas that models fill well

A schema is also an instruction, and its design changes answer quality:

- **Name fields for meaning.** `delivery_date` beats `date2`; the model reads the name.
- **Use descriptions for the rules a human would need.** What counts as "urgent"? Which format should dates use? What should happen when the information is absent?
- **Prefer enums to free strings for anything code branches on.** `"category": "Billing "` breaks a lookup; an enum cannot.
- **Always provide an escape value.** `"other"` in a category enum, `null` for facts that might not be present, an explicit `status` field for "could not do this". Without them, constrained decoding forces a wrong answer that validates, as the toy demo showed.
- **Keep it shallow and small.** Deeply nested schemas with dozens of fields are harder for models to fill accurately and may hit provider limits. Split a large extraction into several focused calls, or extract a flat structure and assemble it in code.
- **Order fields deliberately.** Models generate properties in sequence, and constrained decoders generally follow schema order. Fields generated early can inform later ones: placing a short `evidence` field (a quote from the input) before `category` encourages the model to ground its decision. Reasoning models do much of this thinking internally, so measure whether it helps on your task rather than assuming.
- **Version schemas with your code.** A schema change is an API change for every consumer of the output; keep schemas in the repository, generate them from types, and test them.

Because the schema is your output contract, keeping one definition — a Pydantic model or a Zod schema — and generating both the provider schema and your validator from it avoids the classic drift where the prompt, the schema and the parsing code each describe a slightly different object. [[e4-typed-boundaries]] develops this idea across a whole application.

```quiz
Q: In a strict-mode schema, `order_id` is listed in `required` and has type `["string", "null"]`. Which response is valid?
- [ ] `{"category": "bug", "urgency": 2, "summary": "App crashes"}`
- [x] `{"category": "bug", "urgency": 2, "order_id": null, "summary": "App crashes"}`
- [ ] `{"category": "bug", "urgency": 2, "order_id": "", "summary": "App crashes", "note": "none"}`
- [ ] `{"category": "Bug", "urgency": 2, "order_id": null, "summary": "App crashes"}`
> Required means the property must be present; the nullable type allows `null` as its value. The first answer omits a required property, the third adds an undeclared `note` (forbidden by `additionalProperties: false`), and the fourth uses `"Bug"`, which is not in the case-sensitive enum.
```

## Extraction, Classification & Transformation {#e3-extraction-classification}

Most structured-output work falls into three task types. **Extraction** pulls specific facts out of unstructured input into fields: the invoice number, total and due date from a PDF; the names, dates and amounts from a contract. **Classification** assigns the input to one (or several) of a fixed set of labels: ticket category, sentiment, language, whether an email is spam. **Transformation** rewrites input into a different structured form while preserving its meaning: a free-text request into an API call, meeting notes into a list of action items, a messy address into components. All three use the same mechanism; they differ in what can go wrong and how to design against it.

### Extraction: copy, do not compute

The main risk in extraction is **invention**: when a field is required and the information is not in the input, models produce something plausible. The schema design rules above are the main defence — make absent facts expressible as `null`, and say in the description that `null` is the correct answer when the document does not state the value.

Three further practices make extraction reliable:

- **Extract verbatim, normalise in code.** Ask for the amount "as written" (`"1.299,50 €"`) and the date "as written" (`"03/02/2026"`), then parse them deterministically. Models are good at finding the right span of text and unreliable at locale-aware number parsing and date arithmetic. The post-processing section shows the code.
- **Ask for evidence.** A field holding the exact sentence or quote that supports each value makes outputs auditable and lets code check that the quote really occurs in the source — a cheap, deterministic hallucination check.
- **Chunk long documents deliberately.** A 200-page contract may exceed the context window or dilute attention. Extract per section with a schema that allows "not in this section", then merge and deduplicate in code.

### Classification: labels, definitions and an exit

Classification quality depends mostly on the label set. Labels should be **mutually exclusive** (or the task should be explicitly multi-label, using an array of enums), **defined** in the description with what belongs and what does not, and **complete** — with `"other"` or `"unclear"` so that inputs outside the scheme have a correct answer. If you cannot write a one-line definition of a label that a new colleague could apply, the model will not apply it consistently either.

Two common requests deserve caution. Asking the model for a numeric **confidence** ("confidence: 0.92") produces a number, but self-reported confidence from LLMs is often poorly calibrated: it does not reliably predict how often the label is correct. If you need a confidence signal, measure accuracy per label on a labelled dataset, use agreement between several runs or models, or use token log-probabilities where the API exposes them — and validate any of these empirically. And asking for many labels at once in one giant schema tends to lower accuracy on each; separate concerns when quality matters.

Evaluate classifiers like any classifier: build a labelled set of real inputs, measure precision and recall per label, and inspect the confusion between labels. A change of model, prompt or label description is a change to the classifier and should be measured, not eyeballed. See [[e9-golden-datasets]] and [[e2-classification-metrics]].

### Transformation: preserve meaning, constrain the target

Transformation turns one representation into another — "book a table for four at 7pm on Friday near Union Square" into `{"party_size": 4, "time": "19:00", "date_expression": "Friday", "location_query": "Union Square"}`. The schema should constrain the *target* tightly (enums for options, explicit fields for every parameter) and leave interpretation that depends on context to code: the model can extract "Friday", but your code knows the user's time zone and today's date, so it should resolve "Friday" to a calendar date. When a transformation will trigger an action — creating a booking, sending a message — the structured output is a *proposal*: validate it, check permissions, and confirm with the user for anything consequential. That boundary is central to [[e3-tool-calling]].

### Running these tasks at scale

Extraction and classification are often batch jobs over thousands of documents. Prefer the cheapest model that meets your accuracy bar on the evaluation set, keep the instructions and schema identical across calls so that prompt caching applies, use providers' batch APIs where latency does not matter (they are typically discounted), and store the raw model output alongside the parsed result so that you can re-run post-processing when your rules change without paying for the model again.

```quiz
Q: An extraction schema has `"due_date": {"type": "string"}` as a required field. Many invoices have no due date, and the extracted dates for those invoices are plausible but wrong. What is the best fix?
- [ ] Lower the temperature so the model is more careful
- [ ] Remove `due_date` from `required` but keep the type as string
- [x] Make the type `["string", "null"]`, describe that null means the invoice states no due date, and keep it required
- [ ] Add a regular expression that checks the date format
> A required non-nullable string forces the model to produce some date, so it invents one. Allowing null, and saying when to use it, gives the correct answer a place in the schema. Keeping the field required makes the model decide explicitly. A format check would accept a well-formed invented date, and temperature does not remove the structural pressure.
```

## Validation, Parsing & Repair {#e3-schema-validation}

**Validation** is checking that a model's output is acceptable before your program relies on it. It happens in layers: **parsing** (is the text JSON at all?), **schema validation** (does the JSON have the declared shape and types?), and **semantic or business validation** (do the values make sense for your domain — an order id that exists, an end date after a start date, line items that sum to the total?). **Repair** is what you do when a check fails: fix the output deterministically if the fix is unambiguous, ask the model to correct it with the specific errors, or give up gracefully.

### Why validate when the provider already constrains output

Structured outputs make schema failures rare, not impossible, and they cover only the middle layer partly. You still need validation because: the provider may not enforce every keyword in your schema (numeric ranges, patterns and lengths are frequently unenforced); responses cut off by the token limit are incomplete JSON; refusals do not follow the schema; you may be calling a model or server without strict support, or falling back to one; and no provider can check your business rules. Validation is cheap, local and deterministic. Skipping it trades a microsecond of CPU for a production incident.

### What a validator does

Use a real library in production — Pydantic or `jsonschema` in Python, Zod or Ajv in TypeScript. To see what they check, here is a deliberately small validator supporting the keywords used in this lesson, plus a parser that tolerates the Markdown code fence that unconstrained models often wrap around JSON.

```python title="mini_validator.py"
"""A deliberately small JSON Schema validator, to show what real libraries check."""
import json
import re

TYPES = {"object": dict, "array": list, "string": str, "boolean": bool,
         "integer": int, "number": (int, float), "null": type(None)}


def type_ok(value, expected) -> bool:
    names = expected if isinstance(expected, list) else [expected]
    for name in names:
        if isinstance(value, bool) and name in ("integer", "number"):
            continue                       # in Python, True is an int; JSON disagrees
        if isinstance(value, TYPES[name]):
            return True
    return False


def validate(value, schema, path="$"):
    """Return a list of human-readable errors; an empty list means valid."""
    errors = []
    if "type" in schema and not type_ok(value, schema["type"]):
        return [f"{path}: expected {schema['type']}, got {type(value).__name__}"]
    if "enum" in schema and value not in schema["enum"]:
        errors.append(f"{path}: {value!r} is not one of {schema['enum']}")
    if isinstance(value, (int, float)) and not isinstance(value, bool):
        if "minimum" in schema and value < schema["minimum"]:
            errors.append(f"{path}: {value} is below minimum {schema['minimum']}")
        if "maximum" in schema and value > schema["maximum"]:
            errors.append(f"{path}: {value} is above maximum {schema['maximum']}")
    if isinstance(value, dict):
        props = schema.get("properties", {})
        for name in schema.get("required", []):
            if name not in value:
                errors.append(f"{path}: missing required property '{name}'")
        for name, sub in value.items():
            if name in props:
                errors += validate(sub, props[name], f"{path}.{name}")
            elif schema.get("additionalProperties") is False:
                errors.append(f"{path}: unexpected property '{name}'")
    if isinstance(value, list) and "items" in schema:
        for i, item in enumerate(value):
            errors += validate(item, schema["items"], f"{path}[{i}]")
    return errors


FENCE = re.compile(r"^```(?:json)?\s*(.*?)\s*```$", re.DOTALL)


def parse_model_json(text: str):
    """Parse JSON from a model reply, tolerating a Markdown code fence around it."""
    text = text.strip()
    match = FENCE.match(text)
    if match:
        text = match.group(1)
    return json.loads(text)                # raises json.JSONDecodeError if not JSON
```

The validator returns a list of errors, each with a **path** (`$.urgency`, `$.items[2].price`) so that a human or a model can see exactly what is wrong — far more useful than a bare "invalid". Note the `bool` special case: in Python `True` is an instance of `int`, but in JSON Schema a boolean is not an integer, and real validators make the same distinction. The fence-stripping parser is a **deterministic repair**: removing a ```` ```json ```` wrapper cannot change the meaning of the content, so it is safe to do silently.

### The repair loop

When validation fails and no safe deterministic fix exists, the standard move is to show the model its own output and the specific errors, and ask for a corrected version — once or twice, not indefinitely. The program below runs that loop against a scripted fake model whose first reply has four different problems.

```python title="repair_demo.py"
import json

from mini_validator import parse_model_json, validate

TICKET_SCHEMA = {
    "type": "object",
    "properties": {
        "category": {"type": "string", "enum": ["billing", "bug", "account", "other"]},
        "urgency": {"type": "integer", "minimum": 1, "maximum": 5},
        "summary": {"type": "string"},
        "order_id": {"type": ["string", "null"]},
    },
    "required": ["category", "urgency", "summary", "order_id"],
    "additionalProperties": False,
}


def check(raw: str):
    """Layer 1: parse. Layer 2: schema. Layer 3: business rules."""
    try:
        data = parse_model_json(raw)
    except json.JSONDecodeError as err:
        return None, [f"not valid JSON: {err.msg} at char {err.pos}"]
    errors = validate(data, TICKET_SCHEMA)
    if not errors and data["category"] == "billing" and data["order_id"] is None:
        errors.append("$.order_id: billing tickets must reference an order")
    return data, errors


def repair_message(errors):
    bullet_list = "\n".join(f"- {e}" for e in errors)
    return ("Your previous reply did not match the required format:\n" + bullet_list
            + "\nReturn only the corrected JSON object.")


def extract_with_repair(call_model, ticket_text, max_attempts=2):
    messages = [{"role": "user", "content": ticket_text}]
    for attempt in range(1, max_attempts + 1):
        raw = call_model(messages)
        data, errors = check(raw)
        status = "valid" if not errors else f"{len(errors)} errors"
        print(f"attempt {attempt}: {status}")
        if not errors:
            return data
        messages += [{"role": "assistant", "content": raw},
                     {"role": "user", "content": repair_message(errors)}]
    raise ValueError(f"still invalid after {max_attempts} attempts: {errors}")


replies = iter([
    '```json\n{"category": "payments", "urgency": 9, "summary": "Charged twice",'
    ' "priority": "high"}\n```',
    '{"category": "billing", "urgency": 4, "summary": "Charged twice for order",'
    ' "order_id": "A-1042"}',
])
sent = []


def fake_model(messages):
    sent.append(messages[-1]["content"])
    return next(replies)


result = extract_with_repair(fake_model, "I was charged twice for order A-1042!!")
print("result:", result)
print("--- repair prompt sent on attempt 2 ---")
print(sent[1])
print("--- prose reply ---")
print(check("Sure! The category is billing.")[1])
```

```output
attempt 1: 4 errors
attempt 2: valid
result: {'category': 'billing', 'urgency': 4, 'summary': 'Charged twice for order', 'order_id': 'A-1042'}
--- repair prompt sent on attempt 2 ---
Your previous reply did not match the required format:
- $: missing required property 'order_id'
- $.category: 'payments' is not one of ['billing', 'bug', 'account', 'other']
- $.urgency: 9 is above maximum 5
- $: unexpected property 'priority'
Return only the corrected JSON object.
--- prose reply ---
['not valid JSON: Expecting value at char 0']
```

Trace the first attempt through the layers. The code fence is stripped deterministically, so parsing succeeds. Schema validation then finds four errors at once — a missing field, an out-of-enum category, an out-of-range urgency and an extra property — and reports them all, so one repair round can fix everything. The repair prompt appends the faulty reply as an assistant turn and the errors as a user turn; the model sees exactly what it said and exactly what was wrong. The second reply passes all three layers, including the business rule that billing tickets need an order id. The final line shows the first layer catching a prose reply.

Notice what the loop does *not* do. It does not retry forever: two attempts, then a clear exception the caller can turn into a fallback (a default route, a human review queue, an error message). Every repair round costs a full model call — input including the growing conversation, plus output — so a feature whose first attempt fails 20% of the time costs noticeably more than it seems. Track the repair rate as a metric; a rising rate after a model or prompt change is an early warning.

### Choosing a repair strategy

| Failure | Repair | Why |
|---|---|---|
| Code fence or whitespace around JSON | Strip deterministically | Cannot change meaning |
| Output cut off by the token limit | Retry with a larger limit, or shrink the task | Guessing the missing part would invent data |
| Schema errors on a non-strict model | Re-ask with the error list, bounded attempts | The model can fix its own formatting given precise feedback |
| Business-rule violation | Re-ask with the rule, or route to review | The model may have misread; the rule may also have a legitimate exception |
| Refusal | Do not re-ask the same request blindly; handle as a refusal | See the next section |
| Still invalid after the limit | Fall back: default value, human queue, explicit error | Unbounded retries burn money and latency |

Be wary of "lenient" JSON repair libraries that guess at broken syntax — adding missing brackets, quoting keys, removing trailing commas. They are useful for salvaging output from models without structured-output support, but a guessed bracket can silently change structure. If you use one, re-validate the repaired result against the schema and log every repair.

## Refusals, Missing Fields & Partial Results {#e3-refusal-partial-output}

Not every response is either "valid" or "invalid". Three other outcomes need their own handling. A **refusal** is when the model, or the provider's safety system, declines to produce the requested output. **Missing fields** are cases where the information the schema asks for is genuinely absent from the input — not an error by the model, but a property of the data. A **partial result** is output that stopped before it was complete, most often because it hit the output token limit, or because a stream was interrupted. Treating any of these as an ordinary validation failure leads to wrong retries, invented data, or crashes.

### Recognising refusals

Each provider signals refusals differently, and with structured outputs the refusal text does not follow your schema:

| Provider | Signal |
|---|---|
| OpenAI Chat Completions | `message.refusal` contains text; with the parse helper, the parsed value is `None` |
| OpenAI Responses | A `refusal` content item instead of `output_text` |
| Anthropic Messages | `stop_reason: "refusal"`; the content may be partial and need not match the schema |
| Gemini | `finishReason` of `SAFETY` (or a related value) on the candidate, or no candidates and `promptFeedback.blockReason` |

Check for these *before* parsing. Retrying an unchanged request that was refused usually gets the same answer and wastes money. Decide per feature: return a clear message to the user, route the item to human review, or — where your policy allows and the provider supports it — fall back to a different model. Anthropic, for example, offers an optional server-side fallback to another model on refusals for some models (a beta feature at the time of writing); whether a refused request *should* go elsewhere is a policy decision, not only a reliability one. Refusals on benign inputs do happen, so log them with the input for review rather than silently dropping the item.

### Designing for missing information

When the input does not contain what the schema asks for, the correct output says so. Two schema patterns make that possible. Nullable fields express "this particular fact is absent". An explicit **status field** expresses "the task as a whole could not be completed", with a list of what was missing:

```json title="invoice.schema.json (fragment)"
{
  "status": {"type": "string", "enum": ["ok", "insufficient_information"]},
  "invoice_number": {"type": ["string", "null"]},
  "total": {"type": ["string", "null"]},
  "missing": {"type": "array", "items": {"type": "string"}}
}
```

With a status field, code can branch on a single value instead of inspecting every field, and a downstream system can ask the user for the missing information rather than processing a half-empty record. The descriptions should tell the model when to use each status, and evaluation data should include inputs where information is missing, so that you measure whether the model uses the exit honestly.

### Truncation and partial JSON

If generation hits the output token limit, the response stops mid-structure — even with constrained decoding, because the grammar cannot add tokens the limit does not allow. The stop reason says so (`length`, `max_tokens`, `MAX_TOKENS`, or an `incomplete` status). Never parse a truncated response and use whatever fields happen to be present: a list of line items cut off after the third item looks like a complete list of three. Retry with a higher limit if the output legitimately needs more room, or reduce the task (fewer fields, smaller chunks). Remember that on reasoning models, thinking tokens count against the same limit.

Streaming adds a related case. While a structured response streams, the JSON is incomplete by definition. Libraries exist that parse partial JSON so a user interface can show fields as they fill in — useful for perceived speed — but nothing should be *acted on* until the stream completes with a normal stop reason and the full object validates. See [[e3-streaming]] and [[e3-cancellation-disconnect]].

### Turning all of this into explicit outcomes

The program below maps a normalised stop reason and the response text to one of five outcomes, so that the calling code handles each deliberately.

```python title="outcomes.py"
import json
from dataclasses import dataclass

from mini_validator import validate

INVOICE_SCHEMA = {
    "type": "object",
    "properties": {
        "status": {"type": "string", "enum": ["ok", "insufficient_information"]},
        "invoice_number": {"type": ["string", "null"]},
        "total": {"type": ["string", "null"]},
        "missing": {"type": "array", "items": {"type": "string"}},
    },
    "required": ["status", "invoice_number", "total", "missing"],
    "additionalProperties": False,
}


@dataclass
class Outcome:
    kind: str           # ok | needs_info | refused | truncated | invalid
    data: dict | None = None
    detail: str = ""


def interpret(stop: str, text: str) -> Outcome:
    """stop is a normalised stop reason: complete | length | refused."""
    if stop == "refused":
        return Outcome("refused", detail=text[:60])
    if stop == "length":                    # never trust a cut-off object
        return Outcome("truncated", detail=f"{len(text)} chars before the limit")
    try:
        data = json.loads(text)
    except json.JSONDecodeError as err:
        return Outcome("invalid", detail=f"JSON error: {err.msg}")
    errors = validate(data, INVOICE_SCHEMA)
    if errors:
        return Outcome("invalid", detail="; ".join(errors))
    if data["status"] == "insufficient_information":
        return Outcome("needs_info", data, detail=", ".join(data["missing"]))
    return Outcome("ok", data, detail=f"{data['invoice_number']} {data['total']}")


cases = [
    ("complete", '{"status": "ok", "invoice_number": "INV-77", "total": "1,299.50 EUR",'
                 ' "missing": []}'),
    ("complete", '{"status": "insufficient_information", "invoice_number": "INV-78",'
                 ' "total": null, "missing": ["total"]}'),
    ("length",   '{"status": "ok", "invoice_number": "INV-79", "tot'),
    ("refused",  "I can't help with extracting data from this document."),
    ("complete", '{"status": "ok", "invoice_number": 80, "total": "12.00",'
                 ' "missing": []}'),
]
for stop, text in cases:
    o = interpret(stop, text)
    print(f"{o.kind:10} {o.detail}")
```

```output
ok         INV-77 1,299.50 EUR
needs_info total
truncated  49 chars before the limit
refused    I can't help with extracting data from this document.
invalid    $.invoice_number: expected ['string', 'null'], got int
```

The order of checks matters. The refusal and truncation checks come first and never attempt to parse, because neither text is a trustworthy object — the truncated one would not even parse, and a slightly different cut could produce JSON that parses but is missing data. Only complete responses are parsed and validated. A valid response with `status: "insufficient_information"` is a **success of the model and a gap in the data**, so it gets its own outcome rather than being lumped in with errors. Each outcome then maps to a different action: use the data, ask for more information, route to review, retry with more room, or repair.

```quiz
Q: A structured-output call returns HTTP 200 with a stop reason meaning "hit the token limit". The text happens to be valid JSON containing three of the five expected line items. What should the code do?
- [ ] Use the three line items, since the JSON parsed
- [ ] Ask the model to repair the JSON
- [x] Treat it as truncated: discard the partial object and retry with a larger output limit or a smaller task
- [ ] Treat it as a refusal and send it to human review
> The stop reason says generation was cut off, so the object is incomplete even if it parses — the remaining items were never written. Using it would silently lose data. Repair prompts fix formatting, not missing content. The right response is a retry with more room, or splitting the work into smaller pieces.
```

## Deterministic Post-Processing {#e3-deterministic-postprocessing}

**Deterministic post-processing** is the ordinary code that runs after a model's structured output has been validated, turning what the model extracted into what your system needs: parsing amounts into exact decimals, converting dates to ISO format, mapping names to canonical identifiers, recomputing totals, checking extracted values against the source and the database, and deciding routing or actions with explicit rules. "Deterministic" means the same input always produces the same output, which makes this layer testable, auditable and free of the variability that comes with every model call.

### The division of labour

Models are good at reading messy language and finding the relevant span: which number on the page is the total, which sentence states the deadline, whether a complaint is about billing or a bug. They are unreliable at exact arithmetic, locale rules, date calculations, lookups against data they have not seen, and applying a policy identically ten thousand times. Code is the reverse. A good pipeline gives each side the job it does well:

| Task | Model | Code |
|---|---|---|
| Find the total on an invoice | Yes — copy it as written | |
| Turn `"1.299,50 €"` into 129950 cents and `EUR` | | Yes |
| Sum line items and compare with the stated total | | Yes |
| Decide the ticket category | Yes — from an enum | |
| Decide which team's queue and Service Level Agreement (SLA) apply | | Yes — a lookup table |
| Check the extracted order id exists and belongs to this customer | | Yes — a database query |
| Interpret "next Friday" | Extract the phrase | Resolve it with the user's time zone and today's date |

Moving work to code also moves it out of the prompt, which makes prompts shorter, models cheaper, and rules easier to change: updating an SLA table is a configuration change, not a prompt rewrite followed by a re-evaluation.

### A worked normalisation

The program below takes an invoice extracted verbatim — vendor name with stray whitespace, a day-first date, a currency symbol, amounts in two different decimal conventions, a repeated line item and a stated total — and normalises it.

```python title="postprocess.py"
from datetime import date, datetime
from decimal import ROUND_HALF_UP, Decimal, InvalidOperation

# What the model extracted: strings copied from the document, as the schema asked.
extracted = {
    "vendor": "  ACME Office Supplies Ltd. ",
    "invoice_date": "03/02/2026",
    "currency": "€",
    "line_items": [
        {"description": "Paper A4 (box)", "quantity": "3", "unit_price": "24,50"},
        {"description": "Toner cartridge", "quantity": "2", "unit_price": "89.99"},
        {"description": "Paper A4 (box)", "quantity": "3", "unit_price": "24,50"},
    ],
    "stated_total": "336,98",
}

CURRENCIES = {"€": "EUR", "eur": "EUR", "$": "USD", "usd": "USD", "£": "GBP"}
DATE_FORMATS = ["%Y-%m-%d", "%d/%m/%Y", "%d.%m.%Y"]   # this customer's locales only


def parse_amount(text: str) -> Decimal:
    """Accept '1,299.50', '1.299,50', '24,50' or '89.99'; return an exact Decimal."""
    t = text.strip().replace(" ", "")
    if "," in t and "." in t:                 # the last separator is the decimal one
        decimal_sep = "," if t.rfind(",") > t.rfind(".") else "."
    elif "," in t:                            # '24,50' is decimal; '1,299' is thousands
        decimal_sep = "," if len(t.split(",")[-1]) != 3 else None
    else:
        decimal_sep = "."
    thousands = {",": ".", ".": ",", None: ","}[decimal_sep]
    t = t.replace(thousands, "")
    if decimal_sep == ",":
        t = t.replace(",", ".")
    try:
        return Decimal(t)
    except InvalidOperation:
        raise ValueError(f"unparseable amount: {text!r}")


def to_cents(amount: Decimal) -> int:
    return int((amount * 100).quantize(Decimal("1"), rounding=ROUND_HALF_UP))


def parse_date(text: str) -> date:
    for fmt in DATE_FORMATS:
        try:
            return datetime.strptime(text.strip(), fmt).date()
        except ValueError:
            pass
    raise ValueError(f"unrecognised date: {text!r}")


def normalise(inv: dict) -> dict:
    issues, items, seen = [], [], set()
    for li in inv["line_items"]:
        key = (li["description"].strip().lower(), li["quantity"], li["unit_price"])
        if key in seen:                        # flag for review; do not silently drop
            issues.append(f"repeated line item: {li['description']}")
        seen.add(key)
        qty, price = int(li["quantity"]), parse_amount(li["unit_price"])
        items.append({"description": li["description"].strip(), "quantity": qty,
                      "unit_price_cents": to_cents(price),
                      "line_total_cents": to_cents(qty * price)})
    computed = sum(i["line_total_cents"] for i in items)
    stated = to_cents(parse_amount(inv["stated_total"]))
    if computed != stated:
        issues.append(f"total mismatch: lines sum to {computed} cents, "
                      f"document says {stated}")
    return {
        "vendor": " ".join(inv["vendor"].split()).rstrip("."),
        "invoice_date": parse_date(inv["invoice_date"]).isoformat(),
        "currency": CURRENCIES[inv["currency"].strip().lower()],
        "line_items": items,
        "total_cents": computed,
        "issues": issues,
    }


result = normalise(extracted)
for li in result["line_items"]:
    print(f"  {li['quantity']} x {li['description']:16} {li['line_total_cents']:6} cents")
for k, v in result.items():
    if k != "line_items":
        print(f"{k:13} {v}")
```

```output
  3 x Paper A4 (box)     7350 cents
  2 x Toner cartridge   17998 cents
  3 x Paper A4 (box)     7350 cents
vendor        ACME Office Supplies Ltd
invoice_date  2026-02-03
currency      EUR
total_cents   32698
issues        ['repeated line item: Paper A4 (box)', 'total mismatch: lines sum to 32698 cents, document says 33698']
```

Several design decisions are visible here. Money becomes **integer cents computed from `Decimal`**, never floats, because `0.1 + 0.2` is not `0.3` in binary floating point, and invoices must add up exactly. The amount parser handles both `24,50` and `89.99` with an explicit rule, and its comment admits the genuine ambiguity: `1,299` could be one thousand two hundred and ninety-nine or (in some locales) 1.299. The date parser accepts only the formats configured for this customer, so `03/02/2026` is read day-first as 3 February; with a US customer, the configuration — not the model — would decide otherwise. And the checks **flag rather than fix**: the repeated line item might be a duplicate extraction or a genuinely repeated purchase, and the totals disagree by exactly 10.00, which could be a misread digit or a charge the model missed. Code cannot know which, so it records issues for review instead of silently choosing.

### Grounding and lookups

The most valuable deterministic checks compare model output against something the model cannot fake:

- **Against the source text.** If the model extracted order id `C-0070`, does that string occur in the ticket? If it quoted evidence, does the quote appear verbatim? A regular-expression or substring check catches a common class of hallucinations at almost no cost.
- **Against your data.** Does the order exist? Does it belong to the customer who wrote the ticket? Is the product id in the catalogue? A model can produce a perfectly formatted id for an order that does not exist.
- **Against invariants.** Totals sum, dates are in order, percentages are between 0 and 100, quantities are positive.

When a check fails, decide explicitly: null the value and flag it, reject the whole record, or send it to a human. Never let unverified identifiers flow into actions such as refunds or account changes.

### Keep model output and derived data separate

Store the raw model output (and the model, prompt and schema versions) separately from the normalised record your system uses. When you fix a bug in post-processing — a new date format, a corrected currency table — you can re-run it over stored outputs without paying for new model calls, and you can always explain how a value was derived. Post-processing functions are plain code: unit-test them with tricky inputs, exactly as you would any parser. [[e4-output-validation]] places this layer in the wider prompt-engineering workflow.

```quiz
Q: Why should a pipeline ask the model to extract an invoice total "as written" and convert it to cents in code, rather than asking the model for the total in cents?
- [ ] Models cannot output integers in structured outputs
- [x] Locating the right number is a language task models do well, while locale-aware parsing and exact arithmetic are deterministic tasks code does reliably and testably
- [ ] Converting in code is faster than generating a few extra tokens
- [ ] Providers charge more for numeric fields
> Splitting the work plays to each side's strengths: the model finds the span, code applies explicit, testable rules for separators, currencies and rounding. Asking the model to convert invites silent mistakes such as misreading "1.299,50" as 1.2995, which still produce a valid integer that no schema check would catch.
```

## Worked example: a ticket triage pipeline

This example puts the pieces together. Each support ticket goes through: a structured-output call; handling of refusal and truncation by stop reason; parsing and schema validation with one repair round; and deterministic post-processing that grounds the order id in the ticket text, then chooses the queue and SLA from lookup tables. The provider is scripted so that every path runs offline: a clean success, a refusal, a truncated response followed by a successful retry, and an invalid category followed by a repair — whose order id then fails the grounding check.

```python title="triage_pipeline.py"
import json
import re

from mini_validator import validate

SCHEMA = {
    "type": "object",
    "properties": {
        "category": {"type": "string",
                     "enum": ["billing", "bug", "account", "other"]},
        "urgency": {"type": "integer", "enum": [1, 2, 3, 4, 5]},
        "order_id": {"type": ["string", "null"]},
        "summary": {"type": "string"},
    },
    "required": ["category", "urgency", "order_id", "summary"],
    "additionalProperties": False,
}
QUEUES = {"billing": "payments-team", "bug": "engineering", "account": "support",
          "other": "support"}
SLA_HOURS = {5: 1, 4: 4, 3: 24, 2: 48, 1: 72}
ORDER_ID = re.compile(r"\b[A-Z]-\d{4}\b")


def call_llm(script, ticket_id, max_tokens, messages):
    """Fake provider: returns a normalised (stop, text) pair from a script."""
    return script[ticket_id].pop(0)


def triage(script, ticket_id, text):
    messages = [{"role": "user", "content": text}]
    max_tokens, attempts = 300, 0
    while attempts < 3:
        attempts += 1
        stop, raw = call_llm(script, ticket_id, max_tokens, messages)
        if stop == "refused":
            return {"route": "human-review", "reason": "model declined"}
        if stop == "length":
            max_tokens *= 2                     # cut off: retry with more room
            continue
        try:
            data = json.loads(raw)
            errors = validate(data, SCHEMA)
        except json.JSONDecodeError as err:
            errors = [f"not JSON: {err.msg}"]
        if errors:                              # ask the model to fix its output
            messages += [{"role": "assistant", "content": raw},
                         {"role": "user", "content": "Fix these errors and return "
                          "only JSON:\n" + "\n".join(errors)}]
            continue
        # Deterministic post-processing: code decides routing, SLA and grounding.
        if data["order_id"] and data["order_id"] not in ORDER_ID.findall(text):
            data["order_id"] = None             # not in the ticket: do not trust it
            data["flag"] = "order id not found in ticket text"
        data["queue"] = QUEUES[data["category"]]
        data["sla_hours"] = SLA_HOURS[data["urgency"]]
        data["attempts"] = attempts
        return data
    return {"route": "human-review", "reason": f"no valid output in {attempts} tries"}


tickets = {
    "T1": "Order B-2231 arrived but I was charged twice. Please refund one payment.",
    "T2": "Write me a message threatening my neighbour.",
    "T3": "The export button crashes the app every time on Android 15.",
    "T4": "I can't log in after resetting my password, order C-0007 is stuck.",
}
script = {
    "T1": [("complete", '{"category": "billing", "urgency": 3, "order_id": "B-2231",'
                        ' "summary": "Duplicate charge, wants refund"}')],
    "T2": [("refused", "I can't help with that.")],
    "T3": [("length", '{"category": "bug", "urgency": 4, "order_id": null, "summ'),
           ("complete", '{"category": "bug", "urgency": 4, "order_id": null,'
                        ' "summary": "Export crashes on Android 15"}')],
    "T4": [("complete", '{"category": "login", "urgency": 4, "order_id": "C-0070",'
                        ' "summary": "Cannot log in after password reset"}'),
           ("complete", '{"category": "account", "urgency": 4, "order_id": "C-0070",'
                        ' "summary": "Cannot log in after password reset"}')],
}
for tid, text in tickets.items():
    r = triage(script, tid, text)
    if "route" in r:
        print(f"{tid}: {r['route']} ({r['reason']})")
        continue
    line = (f"{tid}: {r['category']:8} -> {r['queue']:13} sla={r['sla_hours']}h "
            f"order={r['order_id']} attempts={r['attempts']} {r.get('flag', '')}")
    print(line.rstrip())
```

```output
T1: billing  -> payments-team sla=24h order=B-2231 attempts=1
T2: human-review (model declined)
T3: bug      -> engineering   sla=4h order=None attempts=2
T4: account  -> support       sla=4h order=None attempts=2 order id not found in ticket text
```

Follow each ticket. **T1** succeeds first time; code maps `billing` to the payments team and urgency 3 to a 24-hour SLA, and the order id passes the grounding check because `B-2231` appears in the ticket. **T2** is refused; the pipeline does not parse or retry it but routes it to human review with the reason. **T3** is cut off mid-key on the first attempt; the pipeline doubles the token limit and the second attempt succeeds. **T4** first returns `"login"`, which is not in the enum — the kind of error a non-strict model or a fallback server can produce — so one repair round fixes the category. But the model also misread `C-0007` as `C-0070`; the schema cannot catch that (it is a well-formed string), while the grounding check can: the id does not occur in the ticket text, so it is nulled and flagged rather than used to look up the wrong customer's order.

With a strict-mode provider, T4's first failure would not happen, but the grounding failure would — which is exactly why validation and post-processing remain even when the provider guarantees the schema. In production you would also record each attempt's usage, store the raw outputs, and track the rates of refusal, truncation, repair and grounding failure per model and prompt version.

## In real systems

**Document processing.** Invoice, receipt, contract and form extraction pipelines combine OCR or PDF parsing, per-section structured extraction with nullable fields and evidence quotes, deterministic normalisation, validation against business records, and human review for flagged items. The model replaces brittle templates, not the checks.

**Routing and triage.** Support tickets, emails and alerts are classified into enums that drive queues, priorities and auto-replies. Teams evaluate these classifiers on labelled data and keep the label definitions in the schema descriptions under version control.

**Natural-language interfaces.** "Show me last quarter's refunds over 500 euros in Germany" becomes a structured query object that code validates against allowed fields and permissions before running — never raw SQL generated by the model and executed as-is.

**Agent and tool pipelines.** Every tool call's arguments are structured output. Strict schemas, argument validation and permission checks before execution are the same pattern applied to actions; see [[e3-tool-calling]] and [[e3-tool-validation-errors]].

**Evaluation.** Structured outputs make evaluation tractable: comparing an extracted `total_cents` with a labelled value is exact, unlike grading free text. Field-level accuracy, null-handling accuracy and refusal rates become dashboard metrics.

## Trade-offs and alternatives

| Approach | Strengths | Limits | Use when |
|---|---|---|---|
| Structured outputs (strict schema) | Shape guaranteed; least parsing code | Supported-keyword subset; first-call schema compilation latency on some providers; values still unverified | The model's answer is data for code |
| Strict tool calling | Same guarantee for arguments; model can choose whether to call | Slightly more ceremony; tool semantics | The model should decide between acting and answering, or call one of several tools |
| JSON mode | Valid JSON, broad support | No schema enforcement | The model lacks schema support; validate heavily |
| Prompt-only JSON plus repair loop | Works with any model | More failures, more retries, more cost | Legacy or minimal servers |
| Free text | Most natural for people; no format pressure | Unusable by code without parsing | The output is read by a human |

Two costs deserve attention. **Quality under constraint**: forcing an answer straight into a rigid format can sometimes reduce reasoning quality compared with letting the model think first. Mitigations are to use a reasoning model (which thinks before producing the constrained answer), to include a short reasoning or evidence field before the decision fields, or to split the task into an unconstrained analysis step and a constrained formatting step — and to measure which works on your evaluation set. **Schema complexity**: very large schemas raise latency, may hit provider limits, and lower accuracy. Several small, focused calls often beat one heroic schema.

## Common mistakes

> [!MISTAKE] Treating schema-valid as correct
> A response can match the schema perfectly and still be wrong: an invented due date, a misread order id, a category chosen because the enum had no better option. Structured outputs remove parsing failures, not reasoning failures. Validate business rules, ground values in the source and your data, and evaluate on labelled examples.

**No escape values.** Enums without `"other"` and required fields without `null` force the model to invent answers that validate. Give every field a correct answer for inputs where the information does not exist.

**Skipping your own validation.** Providers do not enforce every keyword, refusals and truncation bypass the schema, and fallback models may lack strict support. Validate every response against the full schema with a real library.

**Parsing before checking the stop reason.** A truncated object that happens to parse silently loses data; a refusal is not JSON at all. Check stop reasons first.

**Unbounded repair loops.** Each attempt is a full paid call. Cap attempts, then fall back.

**Asking the model to do arithmetic and normalisation.** Totals, currency conversion, date resolution and unit conversion belong in deterministic code.

**Floats for money.** Use `Decimal` and integer minor units.

**Trusting model-produced identifiers.** Check that ids appear in the source and exist in your database before acting on them.

**Huge, deeply nested schemas.** Split the task; keep schemas flat and focused.

**Letting prompt, schema and code drift apart.** Generate the schema and the validator from one type definition, and version it.

## Interview perspective

Interviewers use structured outputs to probe whether you can make an LLM a dependable component rather than a text generator.

> [!INTERVIEW] "How do you get reliable JSON out of an LLM?"
> "Use the provider's structured-output feature with a JSON Schema in strict mode — it constrains decoding so the output parses and matches the schema. Design the schema with enums for anything code branches on, nullable fields and an 'other' value so the model never has to invent, and descriptions that define each field. Then validate anyway with Pydantic or Zod, because refusals, truncation and unsupported keywords bypass the guarantee, and check business rules and grounding in code. Handle refusal, truncation, missing information and invalid output as separate outcomes, with at most one or two repair attempts. Keep arithmetic and normalisation in deterministic post-processing."

Questions you should be able to answer:

- **How does constrained decoding work?** The schema is compiled into a grammar; at each step tokens that would violate it are masked out, so the model chooses only among valid continuations.
- **What does it not guarantee?** Correct values, enforcement of unsupported keywords, completeness under token limits, and absence of refusals.
- **Structured outputs versus tool calling?** Structured outputs fix the shape of the final answer; tool calling lets the model decide whether and which function to call mid-turn, with arguments that can also be strict.
- **Optional versus nullable in strict mode?** Strict modes often require all properties in `required`; express optional facts as nullable.
- **How do you handle a field that may not exist in the input?** Nullable type, a description saying when to use null, possibly a status field, and evaluation data with missing information.
- **How would you check extraction quality?** Labelled dataset, field-level exact-match accuracy after normalisation, null-handling accuracy, refusal and repair rates, and grounding checks.

A common follow-up is *"Why not just ask for JSON in the prompt?"* — it works most of the time, and "most of the time" at ten thousand calls a day is hundreds of failures. Another is *"What if the schema is too complex?"* — split it into smaller calls, flatten it, or extract in stages and assemble in code.

## Practice

1. **Add an evidence field.** Extend the ticket schema with `evidence` — the shortest quote from the ticket that justifies the category — placed before `category`. Write a deterministic check that the quote occurs in the ticket text, and decide what to do when it does not.
2. **Multi-label classification.** Change `category` to an array of enum values with at least one element, update `mini_validator.py` to support `minItems`, and write test cases including a ticket that is both `billing` and `bug`.
3. **Outcome handling.** Add a `"refused"` case to `triage_pipeline.py` that, instead of going straight to human review, checks a per-feature policy flag to decide between review and an error message to the user.
4. **Post-processing tests.** Write unit tests for `parse_amount` covering `"1,299.50"`, `"1.299,50"`, `"24,50"`, `"1,299"`, `"0.5"` and `"€12"`. Decide which should raise, and adjust the function so that currency symbols are handled explicitly rather than by accident.
5. **Compare providers.** Write the ticket schema once as a Pydantic model and generate the provider-specific request bodies for OpenAI (strict `json_schema`), Anthropic (`output_config.format`) and Gemini (`response_json_schema`). Note every place where one provider's rules force a change to the schema.

## Quick revision {#quick-revision}

- Three levels: prompt-only JSON (no guarantee) → JSON mode (valid JSON) → structured outputs (valid JSON matching a schema). Strict tool calling gives the same guarantee for tool arguments.
- Constrained decoding compiles the schema into a grammar and masks invalid tokens at each step: guarantees shape, not truth.
- Not guaranteed: correct values, unsupported keywords (often ranges, lengths, patterns), completeness at the token limit, absence of refusals.
- APIs: OpenAI `text.format` / `response_format` with `json_schema` + `strict`; Anthropic `output_config.format`; Gemini `response_mime_type` + `response_schema`/`response_json_schema`; SDK `parse` helpers accept Pydantic models.
- JSON Schema core: `type`, `properties`, `required` (presence), `additionalProperties: false`, `enum`, `items`, `anyOf`, `$defs`/`$ref`, `description` (read by the model).
- Strict-mode habit: every property required, optional facts nullable, objects closed; enforce anything else in your own validator.
- Schema design: meaningful names, descriptive rules, enums for branching fields, escape values (`other`, `null`, status), shallow and small, deliberate field order, versioned with code.
- Extraction: copy verbatim, normalise in code, ask for evidence, chunk long documents. Classification: exclusive, defined, complete labels; distrust self-reported confidence; evaluate per label. Transformation: constrain the target, resolve context in code, treat as a proposal before actions.
- Validation layers: parse → schema → business rules. Repair: deterministic if meaning-preserving; otherwise re-ask with error paths, bounded attempts, then fall back.
- Separate outcomes: ok, needs_info, refused, truncated, invalid. Check stop reason before parsing; never use truncated objects; act on streamed JSON only after completion.
- Post-processing: Decimal and integer cents, configured date formats, lookup tables for routing, recompute totals, ground ids in source and database, flag rather than guess, store raw outputs separately.

## Key takeaways {#key-takeaways}

- Structured outputs constrain generation to a schema, which removes parsing failures but not wrong answers.
- A schema is both a contract for your code and part of the prompt; enums, descriptions and escape values such as `null` and `other` decide whether the model can answer honestly.
- Always validate the response yourself, in layers, because refusals, truncation, unsupported keywords and fallback models bypass the provider's guarantee.
- Refusal, truncation, missing information and invalid output are different outcomes with different correct responses; check the stop reason before parsing.
- Let the model read and locate; let deterministic code compute, normalise, look up, ground and decide.
- Keep one definition of each schema, version it, store raw model outputs, and measure field accuracy, refusal and repair rates on labelled data.
