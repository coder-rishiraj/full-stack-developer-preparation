import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Keywords and Reserved Words",
  "whatIsIt": "Keywords are tokens with fixed meaning: `if`, `const`, `class`, `await`, `yield`, and others. Strict mode and modules reserve additional words (`implements`, `await` at top level). Contextual keywords like `get`, `set`, `static`, `async` are only special in some positions, so they can still be variable names elsewhere.",
  "whyExists": "The parser needs words that always start a construct so grammar is unambiguous. Reserving them prevents `if = 1` from meaning two things.",
  "mentalModel": "Some words are locked doors everywhere; some are locked only in certain hallways (async functions, modules).",
  "how": [
    "Never name bindings `undefined`, `Infinity` as if you could replace them in sloppy mode safely.",
    "Use `item` not `class` / `default` / `new` for variables.",
    "Property names can be keywords: `{ default: 1 }.default`.",
    "Treat `await` and `yield` as reserved in modern code even if a classic script allows them."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Copying a snippet into an ES module where `await` was a variable name in an old script — sudden SyntaxError.",
    "variant": "warning"
  },
  "example": "const obj = { default: 42, class: 'ok' };\nconsole.log(obj.default, obj.class);\nasync function load() {\n  const data = await Promise.resolve(1);\n  return data;\n}\nconsole.log(await load());",
  "exampleCaption": "Keywords as properties vs reserved bindings",
  "internals": [
    "ReservedWord includes Keyword, FutureReservedWord, NullLiteral, BooleanLiteral.",
    "Strict mode adds FutureReservedWord restrictions (let, static, yield in some contexts historically).",
    "await is a Keyword in module code and async contexts; yield in generators."
  ],
  "takeaways": [
    "Never name bindings `undefined`, `Infinity` as if you could replace them in sloppy mode safely.",
    "Use `item` not `class` / `default` / `new` for variables.",
    "Copying a snippet into an ES module where `await` was a variable name in an old script — sudden SyntaxError.",
    "ReservedWord includes Keyword, FutureReservedWord, NullLiteral, BooleanLiteral."
  ],
  "revision": [
    "Keywords and Reserved Words: Some words are locked doors everywhere; some are locked only in certain hallways (async functions, modules).",
    "Never name bindings `undefined`, `Infinity` as if you could replace them in sloppy mode safely.",
    "Use `item` not `class` / `default` / `new` for variables.",
    "Property names can be keywords: `{ default: 1 }.default`.",
    "Trap: Copying a snippet into an ES module where `await` was a variable name in an old script — sudden SyntaxError."
  ],
  "flashcards": [
    [
      "Keywords and Reserved Words",
      "Keywords are tokens with fixed meaning: `if`, `const`, `class`, `await`, `yield`, and others."
    ],
    [
      "Mental model",
      "Some words are locked doors everywhere; some are locked only in certain hallways (async functions, modules)."
    ],
    [
      "Common trap",
      "Copying a snippet into an ES module where `await` was a variable name in an old script — sudden SyntaxError."
    ],
    [
      "Never name bindings `undefined`, `Infinity` as if you could replace them in slop",
      "Use `item` not `class` / `default` / `new` for variables."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Keywords and Reserved Words and where does a beginner first see it?",
      "answerHint": "Keywords are tokens with fixed meaning: `if`, `const`, `class`, `await`, `yield`, and others. Strict mode and modules reserve additional words (`implements`, `await` at top level). Contextual keywords like `get`, `set`, `static`, `async` are only special in some positions, so they can still be variable names elsewhere."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Keywords and Reserved Words works and name the main pitfall.",
      "answerHint": "Never name bindings `undefined`, `Infinity` as if you could replace them in sloppy mode safely. Use `item` not `class` / `default` / `new` for variables. Property names can be keywords: `{ default: 1 }.default`. Treat `await` and `yield` as reserved in modern code even if a classic script allows them. Pitfall: Copying a snippet into an ES module where `await` was a variable name in an old script — sudden SyntaxError."
    },
    {
      "level": "advanced",
      "question": "How would you explain Keywords and Reserved Words at an interview, including engine/spec details?",
      "answerHint": "ReservedWord includes Keyword, FutureReservedWord, NullLiteral, BooleanLiteral. Strict mode adds FutureReservedWord restrictions (let, static, yield in some contexts historically). await is a Keyword in module code and async contexts; yield in generators."
    }
  ],
  "pitfalls": [
    "Copying a snippet into an ES module where `await` was a variable name in an old script — sudden SyntaxError.",
    "Treat `await` and `yield` as reserved in modern code even if a classic script allows them."
  ],
  "interview": {
    "expectations": [
      "Explain Keywords and Reserved Words without mixing it up with a nearby B1.1 — JavaScript Foundations topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "ReservedWord includes Keyword, FutureReservedWord, NullLiteral, BooleanLiteral."
    ],
    "commonQuestions": [
      "What is Keywords and Reserved Words?",
      "Why does JavaScript keywords and reserved words behave this way?",
      "What is the classic Keywords and Reserved Words interview trap?"
    ],
    "traps": [
      "Copying a snippet into an ES module where `await` was a variable name in an old script — sudden SyntaxError."
    ],
    "misconceptions": [
      "The parser needs words that always start a construct so grammar is unambiguous. Reserving them prevents `if = 1` from meaning two things."
    ],
    "strongSignals": [
      "Separates Keywords and Reserved Words from lookalike APIs and can draw the mental model."
    ]
  }
})
