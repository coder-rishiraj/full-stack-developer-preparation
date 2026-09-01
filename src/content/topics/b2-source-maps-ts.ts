import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Source Maps & Debugging",
  "whatIsIt": "Source maps link emitted JS back to TS for debugging: sourceMap: true in tsconfig. Browser DevTools and Node --enable-source-maps show original TS lines in stack traces.",
  "whyExists": "Debug transpiled code at authoring line numbers.",
  "mentalModel": "Treasure map from minified JS back to TS source.",
  "how": [
    "sourceMap: true for dev; inlineSources optional.",
    "Node 18+ --enable-source-maps for stack traces.",
    "Bundlers generate combined maps for chunks.",
    "declarationMap helps jump to types in monorepos.",
    "Disable in prod or use hidden-source-map for privacy."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Shipping full source maps publicly — may expose source structure.",
    "variant": "warning"
  },
  "example": "// tsconfig: \"sourceMap\": true\nexport function fail(): never {\n  throw new Error('boom');\n}\n// stack trace points to fail.ts line in DevTools\nconsole.log(fail('demo'));\n// Strict mode catches misuse at compile time\n// Annotations are erased — zero runtime overhead",
  "exampleCaption": "sourceMap maps runtime error to TS line",
  "internals": [
    "VLQ encoding in .map files.",
    "inlineSourceMap embeds in bundle — larger files.",
    "TS resolves paths via map sourcesContent optionally."
  ],
  "takeaways": [
    "sourceMap: true for dev; inlineSources optional.",
    "Node 18+ --enable-source-maps for stack traces.",
    "Shipping full source maps publicly — may expose source structure.",
    "VLQ encoding in .map files."
  ],
  "revision": [
    "Source Maps & Debugging: Treasure map from minified JS back to TS source.",
    "sourceMap: true for dev; inlineSources optional.",
    "Node 18+ --enable-source-maps for stack traces.",
    "Bundlers generate combined maps for chunks.",
    "Trap: Shipping full source maps publicly — may expose source structure."
  ],
  "flashcards": [
    [
      "Source Maps & Debugging",
      "Source maps link emitted JS back to TS for debugging: sourceMap: true in tsconfig."
    ],
    [
      "Mental model",
      "Treasure map from minified JS back to TS source."
    ],
    [
      "Common trap",
      "Shipping full source maps publicly — may expose source structure."
    ],
    [
      "sourceMap: true for dev; inlineSources optional.",
      "Node 18+ --enable-source-maps for stack traces."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Source Maps & Debugging in TypeScript and when do you use it?",
      "answerHint": "Source maps link emitted JS back to TS for debugging: sourceMap: true in tsconfig. Browser DevTools and Node --enable-source-maps show original TS lines in stack traces."
    },
    {
      "level": "intermediate",
      "question": "Explain Source Maps & Debugging with a code example and one pitfall.",
      "answerHint": "sourceMap: true for dev; inlineSources optional. Node 18+ --enable-source-maps for stack traces. Bundlers generate combined maps for chunks. declarationMap helps jump to types in monorepos. Disable in prod or use hidden-source-map for privacy. Pitfall: Shipping full source maps publicly — may expose source structure."
    },
    {
      "level": "advanced",
      "question": "How would you explain Source Maps & Debugging in a senior frontend interview?",
      "answerHint": "VLQ encoding in .map files. inlineSourceMap embeds in bundle — larger files. TS resolves paths via map sourcesContent optionally. // tsconfig: \"sourceMap\": true\nexport function fail(): never {\n  throw new Error('boom');\n}\n// stack trace points to fai"
    }
  ],
  "pitfalls": [
    "Shipping full source maps publicly — may expose source structure."
  ],
  "interview": {
    "expectations": [
      "Explain Source Maps & Debugging with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "VLQ encoding in .map files."
    ],
    "commonQuestions": [
      "What is Source Maps & Debugging?",
      "When would you choose Source Maps & Debugging over alternatives?",
      "What is the classic Source Maps & Debugging interview trap?"
    ],
    "traps": [
      "Shipping full source maps publicly — may expose source structure."
    ],
    "misconceptions": [
      "Debug transpiled code at authoring line numbers."
    ],
    "strongSignals": [
      "Uses Source Maps & Debugging to remove invalid states, not just document them."
    ]
  }
})
