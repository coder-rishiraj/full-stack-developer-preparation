import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "tsconfig.json",
  "whatIsIt": "tsconfig.json configures compiler: target, module, strict, paths, include, references. Extends shared configs. Defines what tsc type-checks and emits. Single source of truth for editor and CI.",
  "whyExists": "Without tsconfig, defaults mismatch project needs — strict flags never enabled.",
  "mentalModel": "Project rulebook for compiler and IDE.",
  "how": [
    "npx tsc --init then trim options.",
    "strict: true enables recommended flags bundle.",
    "include: [\"src\"] exclude node_modules.",
    "paths aliases for @/ imports — bundler must mirror.",
    "references for monorepo packages."
  ],
  "callout": {
    "title": "Watch for",
    "text": "paths in tsconfig without vite/tsconfig-paths — imports fail at runtime.",
    "variant": "warning"
  },
  "example": "{\n  \"compilerOptions\": {\n    \"target\": \"ES2022\",\n    \"module\": \"ESNext\",\n    \"moduleResolution\": \"Bundler\",\n    \"strict\": true,\n    \"skipLibCheck\": true,\n    \"outDir\": \"dist\"\n  },\n  \"include\": [\"src\"]\n}",
  "exampleCaption": "Minimal strict tsconfig for modern bundler app",
  "internals": [
    "extends inherits base config from @tsconfig packages.",
    "composite enables project references build graph.",
    "files vs include globs control program scope."
  ],
  "takeaways": [
    "npx tsc --init then trim options.",
    "strict: true enables recommended flags bundle.",
    "paths in tsconfig without vite/tsconfig-paths — imports fail at runtime.",
    "extends inherits base config from @tsconfig packages."
  ],
  "revision": [
    "tsconfig.json: Project rulebook for compiler and IDE.",
    "npx tsc --init then trim options.",
    "strict: true enables recommended flags bundle.",
    "include: [\"src\"] exclude node_modules.",
    "Trap: paths in tsconfig without vite/tsconfig-paths — imports fail at runtime."
  ],
  "flashcards": [
    [
      "tsconfig.json",
      "tsconfig.json configures compiler: target, module, strict, paths, include, references."
    ],
    [
      "Mental model",
      "Project rulebook for compiler and IDE."
    ],
    [
      "Common trap",
      "paths in tsconfig without vite/tsconfig-paths — imports fail at runtime."
    ],
    [
      "npx tsc --init then trim options.",
      "strict: true enables recommended flags bundle."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is tsconfig.json in TypeScript and when do you use it?",
      "answerHint": "tsconfig.json configures compiler: target, module, strict, paths, include, references. Extends shared configs. Defines what tsc type-checks and emits. Single source of truth for editor and CI."
    },
    {
      "level": "intermediate",
      "question": "Explain tsconfig.json with a code example and one pitfall.",
      "answerHint": "npx tsc --init then trim options. strict: true enables recommended flags bundle. include: [\"src\"] exclude node_modules. paths aliases for @/ imports — bundler must mirror. references for monorepo packages. Pitfall: paths in tsconfig without vite/tsconfig-paths — imports fail at runtime."
    },
    {
      "level": "advanced",
      "question": "How would you explain tsconfig.json in a senior frontend interview?",
      "answerHint": "extends inherits base config from @tsconfig packages. composite enables project references build graph. files vs include globs control program scope. {\n  \"compilerOptions\": {\n    \"target\": \"ES2022\",\n    \"module\": \"ESNext\",\n    \"moduleResolution\": \"Bundler\",\n    \"strict\""
    }
  ],
  "pitfalls": [
    "paths in tsconfig without vite/tsconfig-paths — imports fail at runtime."
  ],
  "interview": {
    "expectations": [
      "Explain tsconfig.json with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "extends inherits base config from @tsconfig packages."
    ],
    "commonQuestions": [
      "What is tsconfig.json?",
      "When would you choose tsconfig.json over alternatives?",
      "What is the classic tsconfig.json interview trap?"
    ],
    "traps": [
      "paths in tsconfig without vite/tsconfig-paths — imports fail at runtime."
    ],
    "misconceptions": [
      "Without tsconfig, defaults mismatch project needs — strict flags never enabled."
    ],
    "strongSignals": [
      "Uses tsconfig.json to remove invalid states, not just document them."
    ]
  }
})
