import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Console and Output",
  "whatIsIt": "`console` is a host object (not ECMAScript) for logging: log, warn, error, table, time, group, dir, trace. It is meant for developers, not for showing UI to users. Formatting differs between browsers and Node; objects may be shown live (with later mutations visible) in DevTools.",
  "whyExists": "Debugging needed a standard place to print without `alert`. Hosts standardized a Console API loosely based on Firebug.",
  "mentalModel": "A side channel to the developer tools. It does not return values you should flow through business logic.",
  "how": [
    "Use `console.log` for values, `error` for failures, `table` for arrays of objects.",
    "`console.time` / `timeEnd` for rough durations.",
    "Do not leave noisy logs in hot paths in production.",
    "`JSON.stringify` when you need a snapshot; live object inspectors can lie after mutation."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Logging an object then mutating it: DevTools may display the mutated state, so you think the log was wrong.",
    "variant": "warning"
  },
  "example": "const user = { id: 1, name: 'Ada' };\nconsole.log('user', user);\nconsole.table([{ a: 1 }, { a: 2 }]);\nconsole.time('sum');\nlet s = 0;\nfor (let i = 0; i < 1e5; i++) s += i;\nconsole.timeEnd('sum');\nconsole.log(s);",
  "exampleCaption": "log, table, and time",
  "internals": [
    "console is not required by ECMA-262; engines in unusual embeds may lack it.",
    "Node’s console writes to stdout/stderr streams; browsers buffer to DevTools.",
    "%s %o %c format specifiers are host-defined, not language syntax."
  ],
  "takeaways": [
    "Use `console.log` for values, `error` for failures, `table` for arrays of objects.",
    "`console.time` / `timeEnd` for rough durations.",
    "Logging an object then mutating it: DevTools may display the mutated state, so you think the log was wrong.",
    "console is not required by ECMA-262; engines in unusual embeds may lack it."
  ],
  "revision": [
    "Console and Output: A side channel to the developer tools. It does not return values you should flow through business logic.",
    "Use `console.log` for values, `error` for failures, `table` for arrays of objects.",
    "`console.time` / `timeEnd` for rough durations.",
    "Do not leave noisy logs in hot paths in production.",
    "Trap: Logging an object then mutating it: DevTools may display the mutated state, so you think the log was wrong."
  ],
  "flashcards": [
    [
      "Console and Output",
      "`console` is a host object (not ECMAScript) for logging: log, warn, error, table, time, group, dir, trace."
    ],
    [
      "Mental model",
      "A side channel to the developer tools. It does not return values you should flow through business logic."
    ],
    [
      "Common trap",
      "Logging an object then mutating it: DevTools may display the mutated state, so you think the log was wrong."
    ],
    [
      "Use `console.log` for values, `error` for failures, `table` for arrays of object",
      "`console.time` / `timeEnd` for rough durations."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Console and Output and where does a beginner first see it?",
      "answerHint": "`console` is a host object (not ECMAScript) for logging: log, warn, error, table, time, group, dir, trace. It is meant for developers, not for showing UI to users. Formatting differs between browsers and Node; objects may be shown live (with later mutations visible) in DevTools."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Console and Output works and name the main pitfall.",
      "answerHint": "Use `console.log` for values, `error` for failures, `table` for arrays of objects. `console.time` / `timeEnd` for rough durations. Do not leave noisy logs in hot paths in production. `JSON.stringify` when you need a snapshot; live object inspectors can lie after mutation. Pitfall: Logging an object then mutating it: DevTools may display the mutated state, so you think the log was wrong."
    },
    {
      "level": "advanced",
      "question": "How would you explain Console and Output at an interview, including engine/spec details?",
      "answerHint": "console is not required by ECMA-262; engines in unusual embeds may lack it. Node’s console writes to stdout/stderr streams; browsers buffer to DevTools. %s %o %c format specifiers are host-defined, not language syntax."
    }
  ],
  "pitfalls": [
    "Logging an object then mutating it: DevTools may display the mutated state, so you think the log was wrong.",
    "`JSON.stringify` when you need a snapshot; live object inspectors can lie after mutation."
  ],
  "interview": {
    "expectations": [
      "Explain Console and Output without mixing it up with a nearby B1.1 — JavaScript Foundations topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "console is not required by ECMA-262; engines in unusual embeds may lack it."
    ],
    "commonQuestions": [
      "What is Console and Output?",
      "Why does JavaScript console and output behave this way?",
      "What is the classic Console and Output interview trap?"
    ],
    "traps": [
      "Logging an object then mutating it: DevTools may display the mutated state, so you think the log was wrong."
    ],
    "misconceptions": [
      "Debugging needed a standard place to print without `alert`. Hosts standardized a Console API loosely based on Firebug."
    ],
    "strongSignals": [
      "Separates Console and Output from lookalike APIs and can draw the mental model."
    ]
  }
})
