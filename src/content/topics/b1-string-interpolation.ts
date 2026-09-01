import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Interpolation",
  "whatIsIt": "Interpolation is the ${expression} hole inside a template. The expression can be any JS, including nested templates and function calls. It is ToString’d. Side effects in holes run in left-to-right order. It is not sprintf: format specifiers are not built in.",
  "whyExists": "Inserting values into messages is the point of templates. A full expression (not just an identifier) keeps the feature compositional.",
  "mentalModel": "Pause the string, run a tiny program, stringify the result, resume the string.",
  "how": [
    "Keep holes small; compute complex values in a const above.",
    "Call helpers: `${fmt(date)}`.",
    "Do not put assignments in holes.",
    "Remember holes run even if you later discard the string."
  ],
  "callout": {
    "title": "Watch for",
    "text": "`${undefined}` is the string 'undefined', which can leak into UI copy.",
    "variant": "warning"
  },
  "example": "function money(cents) { return '$' + (cents / 100).toFixed(2); }\nconst qty = 2;\nconst raw = 199;\nconsole.log(`${qty} × ${money(raw)} = ${money(qty * raw)}`);\nlet i = 0;\nconsole.log(`${i += 1} then ${i += 1}`);\n",
  "exampleCaption": "Helper calls and left-to-right holes",
  "internals": [
    "Each Expression in a template is evaluated in source order.",
    "ToString throws for symbol values in interpolation.",
    "The result of interpolation is always concatenated as a primitive string in untagged templates."
  ],
  "takeaways": [
    "Keep holes small; compute complex values in a const above.",
    "Call helpers: `${fmt(date)}`.",
    "`${undefined}` is the string 'undefined', which can leak into UI copy.",
    "Each Expression in a template is evaluated in source order."
  ],
  "revision": [
    "Interpolation: Pause the string, run a tiny program, stringify the result, resume the string.",
    "Keep holes small; compute complex values in a const above.",
    "Call helpers: `${fmt(date)}`.",
    "Do not put assignments in holes.",
    "Trap: `${undefined}` is the string 'undefined', which can leak into UI copy."
  ],
  "flashcards": [
    [
      "Interpolation",
      "Interpolation is the ${expression} hole inside a template."
    ],
    [
      "Mental model",
      "Pause the string, run a tiny program, stringify the result, resume the string."
    ],
    [
      "Common trap",
      "`${undefined}` is the string 'undefined', which can leak into UI copy."
    ],
    [
      "Keep holes small; compute complex values in a const above.",
      "Call helpers: `${fmt(date)}`."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Interpolation and where does a beginner first see it?",
      "answerHint": "Interpolation is the ${expression} hole inside a template. The expression can be any JS, including nested templates and function calls. It is ToString’d. Side effects in holes run in left-to-right order. It is not sprintf: format specifiers are not built in."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Interpolation works and name the main pitfall.",
      "answerHint": "Keep holes small; compute complex values in a const above. Call helpers: `${fmt(date)}`. Do not put assignments in holes. Remember holes run even if you later discard the string. Pitfall: `${undefined}` is the string 'undefined', which can leak into UI copy."
    },
    {
      "level": "advanced",
      "question": "How would you explain Interpolation at an interview, including engine/spec details?",
      "answerHint": "Each Expression in a template is evaluated in source order. ToString throws for symbol values in interpolation. The result of interpolation is always concatenated as a primitive string in untagged templates."
    }
  ],
  "pitfalls": [
    "`${undefined}` is the string 'undefined', which can leak into UI copy.",
    "Remember holes run even if you later discard the string."
  ],
  "interview": {
    "expectations": [
      "Explain Interpolation without mixing it up with a nearby B1.7 — Strings topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Each Expression in a template is evaluated in source order."
    ],
    "commonQuestions": [
      "What is Interpolation?",
      "Why does JavaScript interpolation behave this way?",
      "What is the classic Interpolation interview trap?"
    ],
    "traps": [
      "`${undefined}` is the string 'undefined', which can leak into UI copy."
    ],
    "misconceptions": [
      "Inserting values into messages is the point of templates. A full expression (not just an identifier) keeps the feature compositional."
    ],
    "strongSignals": [
      "Separates Interpolation from lookalike APIs and can draw the mental model."
    ]
  }
})
