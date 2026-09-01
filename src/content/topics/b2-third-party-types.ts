import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Third-Party Library Types",
  "whatIsIt": "Third-party types come from: bundled types field, separate @types package, local declare module shim, or wrapper typed facade. Evaluate quality before trusting any-heavy defs.",
  "whyExists": "Integration reality — not every lib is typed; know fallback strategies.",
  "mentalModel": "Four ways to get a typed menu for a JS-only cafe.",
  "how": [
    "Check package.json \"types\" entry first.",
    "Install matching @types/* if separate.",
    "Minimal shim: declare module \"x\" { const x: any; export default x; } then tighten.",
    "Wrap untyped SDK in your typed module boundary.",
    "codegen from OpenAPI/GraphQL for APIs."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Shim stays any forever — schedule proper types or zod validation.",
    "variant": "warning"
  },
  "example": "// shim until proper types\ndeclare module 'legacy-widget' {\n  export function mount(el: HTMLElement, opts: { id: string }): void;\n}\nimport { mount } from 'legacy-widget';\nmount(document.body, { id: 'app' });\nconsole.log(mount('demo'));\n// Strict mode catches misuse at compile time",
  "exampleCaption": "Local declare module shim for legacy-widget",
  "internals": [
    "moduleResolution affects which types file loads.",
    "typesVersions in package.json for TS version-specific defs.",
    "Peer dependency @types packages in library publishing."
  ],
  "takeaways": [
    "Check package.json \"types\" entry first.",
    "Install matching @types/* if separate.",
    "Shim stays any forever — schedule proper types or zod validation.",
    "moduleResolution affects which types file loads."
  ],
  "revision": [
    "Third-Party Library Types: Four ways to get a typed menu for a JS-only cafe.",
    "Check package.json \"types\" entry first.",
    "Install matching @types/* if separate.",
    "Minimal shim: declare module \"x\" { const x: any; export default x; } then tighten.",
    "Trap: Shim stays any forever — schedule proper types or zod validation."
  ],
  "flashcards": [
    [
      "Third-Party Library Types",
      "Third-party types come from: bundled types field, separate @types package, local declare module shim, or wrapper typed facade."
    ],
    [
      "Mental model",
      "Four ways to get a typed menu for a JS-only cafe."
    ],
    [
      "Common trap",
      "Shim stays any forever — schedule proper types or zod validation."
    ],
    [
      "Check package.json \"types\" entry first.",
      "Install matching @types/* if separate."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Third-Party Library Types in TypeScript and when do you use it?",
      "answerHint": "Third-party types come from: bundled types field, separate @types package, local declare module shim, or wrapper typed facade. Evaluate quality before trusting any-heavy defs."
    },
    {
      "level": "intermediate",
      "question": "Explain Third-Party Library Types with a code example and one pitfall.",
      "answerHint": "Check package.json \"types\" entry first. Install matching @types/* if separate. Minimal shim: declare module \"x\" { const x: any; export default x; } then tighten. Wrap untyped SDK in your typed module boundary. codegen from OpenAPI/GraphQL for APIs. Pitfall: Shim stays any forever — schedule proper types or zod validation."
    },
    {
      "level": "advanced",
      "question": "How would you explain Third-Party Library Types in a senior frontend interview?",
      "answerHint": "moduleResolution affects which types file loads. typesVersions in package.json for TS version-specific defs. Peer dependency @types packages in library publishing. // shim until proper types\ndeclare module 'legacy-widget' {\n  export function mount(el: HTMLElement, opts: { id: string "
    }
  ],
  "pitfalls": [
    "Shim stays any forever — schedule proper types or zod validation."
  ],
  "interview": {
    "expectations": [
      "Explain Third-Party Library Types with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "moduleResolution affects which types file loads."
    ],
    "commonQuestions": [
      "What is Third-Party Library Types?",
      "When would you choose Third-Party Library Types over alternatives?",
      "What is the classic Third-Party Library Types interview trap?"
    ],
    "traps": [
      "Shim stays any forever — schedule proper types or zod validation."
    ],
    "misconceptions": [
      "Integration reality — not every lib is typed; know fallback strategies."
    ],
    "strongSignals": [
      "Uses Third-Party Library Types to remove invalid states, not just document them."
    ]
  }
})
