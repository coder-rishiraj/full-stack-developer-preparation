import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Vite / Build Tooling",
  "whatIsIt": "Vite transpiles TS via esbuild (fast, no type check). Run tsc --noEmit separately or use vite-plugin-checker. HMR works with .tsx. resolve alias mirrors tsconfig paths.",
  "whyExists": "Dev speed separates transpile from typecheck — Vite pattern.",
  "mentalModel": "Fast hot reload; tsc validates in background or CI.",
  "how": [
    "npm create vite@latest — choose react-ts template.",
    "vite.config.ts with resolve.alias for @ paths.",
    "vue/react use .tsx; strict in tsconfig.",
    "Build: vite build; typecheck: tsc -b.",
    "Do not expect Vite to report all type errors alone."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Assuming vite dev shows all type errors — enable checker or watch tsc.",
    "variant": "warning"
  },
  "example": "// vite.config.ts\nimport { defineConfig } from 'vite';\nexport default defineConfig({\n  resolve: { alias: { '@': '/src' } },\n});\n// src/main.ts — Vite serves transpiled TS fast\n// Strict mode catches misuse at compile time\n// Annotations are erased — zero runtime overhead",
  "exampleCaption": "Vite esbuild transpile + separate tsc check",
  "internals": [
    "esbuild strips types without full semantic check.",
    "vite/client types for import.meta.env.",
    "SSR projects add vite-node or custom tsc step."
  ],
  "takeaways": [
    "npm create vite@latest — choose react-ts template.",
    "vite.config.ts with resolve.alias for @ paths.",
    "Assuming vite dev shows all type errors — enable checker or watch tsc.",
    "esbuild strips types without full semantic check."
  ],
  "revision": [
    "Vite / Build Tooling: Fast hot reload; tsc validates in background or CI.",
    "npm create vite@latest — choose react-ts template.",
    "vite.config.ts with resolve.alias for @ paths.",
    "vue/react use .tsx; strict in tsconfig.",
    "Trap: Assuming vite dev shows all type errors — enable checker or watch tsc."
  ],
  "flashcards": [
    [
      "Vite / Build Tooling",
      "Vite transpiles TS via esbuild (fast, no type check)."
    ],
    [
      "Mental model",
      "Fast hot reload; tsc validates in background or CI."
    ],
    [
      "Common trap",
      "Assuming vite dev shows all type errors — enable checker or watch tsc."
    ],
    [
      "npm create vite@latest — choose react-ts template.",
      "vite.config.ts with resolve.alias for @ paths."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Vite / Build Tooling in TypeScript and when do you use it?",
      "answerHint": "Vite transpiles TS via esbuild (fast, no type check). Run tsc --noEmit separately or use vite-plugin-checker. HMR works with .tsx. resolve alias mirrors tsconfig paths."
    },
    {
      "level": "intermediate",
      "question": "Explain Vite / Build Tooling with a code example and one pitfall.",
      "answerHint": "npm create vite@latest — choose react-ts template. vite.config.ts with resolve.alias for @ paths. vue/react use .tsx; strict in tsconfig. Build: vite build; typecheck: tsc -b. Do not expect Vite to report all type errors alone. Pitfall: Assuming vite dev shows all type errors — enable checker or watch tsc."
    },
    {
      "level": "advanced",
      "question": "How would you explain Vite / Build Tooling in a senior frontend interview?",
      "answerHint": "esbuild strips types without full semantic check. vite/client types for import.meta.env. SSR projects add vite-node or custom tsc step. // vite.config.ts\nimport { defineConfig } from 'vite';\nexport default defineConfig({\n  resolve: { alias: { '@': '/src' }"
    }
  ],
  "pitfalls": [
    "Assuming vite dev shows all type errors — enable checker or watch tsc."
  ],
  "interview": {
    "expectations": [
      "Explain Vite / Build Tooling with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "esbuild strips types without full semantic check."
    ],
    "commonQuestions": [
      "What is Vite / Build Tooling?",
      "When would you choose Vite / Build Tooling over alternatives?",
      "What is the classic Vite / Build Tooling interview trap?"
    ],
    "traps": [
      "Assuming vite dev shows all type errors — enable checker or watch tsc."
    ],
    "misconceptions": [
      "Dev speed separates transpile from typecheck — Vite pattern."
    ],
    "strongSignals": [
      "Uses Vite / Build Tooling to remove invalid states, not just document them."
    ]
  }
})
