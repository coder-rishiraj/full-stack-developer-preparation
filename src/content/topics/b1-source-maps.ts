import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Source Maps Conceptually",
  "whatIsIt": "A source map is JSON mapping generated code (minified/transpiled) back to original files/lines/names. DevTools consumes it to debug TS/JSX as if it ran. //# sourceMappingURL= is the trailer. Production maps can leak source — treat as sensitive. They do not change runtime behavior.",
  "whyExists": "Nobody wants to debug one-line bundles. Maps restore the authoring view without shipping pretty code to users (if you withhold maps).",
  "mentalModel": "A translation dictionary: bundle line 1 col 3048 ↔ src/app.ts:42.",
  "how": [
    "Enable maps in the bundler for development.",
    "Decide whether to publish maps in production.",
    "hidden-source-map uploads to error trackers only.",
    "If a line is ‘wrong,’ the map may be stale — rebuild."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Users with maps in prod can read your original comments and unused code — a source leak.",
    "variant": "warning"
  },
  "example": "// app.js (generated)\nconsole.log('hi');\n//# sourceMappingURL=app.js.map\nconsole.log('runtime does not read the map; DevTools does');\nconst fakeMap = { version: 3, sources: ['app.ts'], mappings: '' };\nconsole.log(fakeMap.version);\n",
  "exampleCaption": "sourceMappingURL comment is for tools, not the engine",
  "internals": [
    "VLQ-encoded mappings in the spec (source-map format).",
    "Engines ignore the comment unless a debugger asks the host to fetch the map.",
    "Error.stack rewriting is debugger/host, not required of the engine."
  ],
  "takeaways": [
    "Enable maps in the bundler for development.",
    "Decide whether to publish maps in production.",
    "Users with maps in prod can read your original comments and unused code — a source leak.",
    "VLQ-encoded mappings in the spec (source-map format)."
  ],
  "revision": [
    "Source Maps Conceptually: A translation dictionary: bundle line 1 col 3048 ↔ src/app.ts:42.",
    "Enable maps in the bundler for development.",
    "Decide whether to publish maps in production.",
    "hidden-source-map uploads to error trackers only.",
    "Trap: Users with maps in prod can read your original comments and unused code — a source leak."
  ],
  "flashcards": [
    [
      "Source Maps Conceptually",
      "A source map is JSON mapping generated code (minified/transpiled) back to original files/lines/names."
    ],
    [
      "Mental model",
      "A translation dictionary: bundle line 1 col 3048 ↔ src/app.ts:42."
    ],
    [
      "Common trap",
      "Users with maps in prod can read your original comments and unused code — a source leak."
    ],
    [
      "Enable maps in the bundler for development.",
      "Decide whether to publish maps in production."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Source Maps Conceptually and where does a beginner first see it?",
      "answerHint": "A source map is JSON mapping generated code (minified/transpiled) back to original files/lines/names. DevTools consumes it to debug TS/JSX as if it ran. //# sourceMappingURL= is the trailer. Production maps can leak source — treat as sensitive. They do not change runtime behavior."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Source Maps Conceptually works and name the main pitfall.",
      "answerHint": "Enable maps in the bundler for development. Decide whether to publish maps in production. hidden-source-map uploads to error trackers only. If a line is ‘wrong,’ the map may be stale — rebuild. Pitfall: Users with maps in prod can read your original comments and unused code — a source leak."
    },
    {
      "level": "advanced",
      "question": "How would you explain Source Maps Conceptually at an interview, including engine/spec details?",
      "answerHint": "VLQ-encoded mappings in the spec (source-map format). Engines ignore the comment unless a debugger asks the host to fetch the map. Error.stack rewriting is debugger/host, not required of the engine."
    }
  ],
  "pitfalls": [
    "Users with maps in prod can read your original comments and unused code — a source leak.",
    "If a line is ‘wrong,’ the map may be stale — rebuild."
  ],
  "interview": {
    "expectations": [
      "Explain Source Maps Conceptually without mixing it up with a nearby B1.33 — Debugging topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "VLQ-encoded mappings in the spec (source-map format)."
    ],
    "commonQuestions": [
      "What is Source Maps Conceptually?",
      "Why does JavaScript source maps conceptually behave this way?",
      "What is the classic Source Maps Conceptually interview trap?"
    ],
    "traps": [
      "Users with maps in prod can read your original comments and unused code — a source leak."
    ],
    "misconceptions": [
      "Nobody wants to debug one-line bundles. Maps restore the authoring view without shipping pretty code to users (if you withhold maps)."
    ],
    "strongSignals": [
      "Separates Source Maps Conceptually from lookalike APIs and can draw the mental model."
    ]
  }
})
