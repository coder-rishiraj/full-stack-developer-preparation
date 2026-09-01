import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Compiling with tsc",
  "whatIsIt": "The TypeScript compiler (tsc) parses .ts/.tsx, type-checks, and emits JavaScript per tsconfig targets (module, target, outDir). It can also --noEmit for type-check only. tsc handles declaration files (.d.ts), source maps, and incremental builds. Bundlers often use esbuild/swc for speed and tsc for verification.",
  "whyExists": "A single official compiler ensures consistent behavior across editors, CI, and docs. Emit + check separation lets teams optimize pipelines.",
  "mentalModel": "tsc is a factory: raw TS enters, two products leave — JS for machines, .d.ts blueprints for other TS files.",
  "how": [
    "npx tsc --init scaffolds tsconfig.json.",
    "Set \"target\" and \"module\" to match your runtime.",
    "Use \"include\"/\"exclude\" to scope compilation.",
    "composite + project references split monorepos.",
    "CI: tsc --noEmit; dev: Vite HMR with esbuild transform."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Running tsc without reading tsconfig — defaults may emit CommonJS to wrong folder.",
    "variant": "warning"
  },
  "example": "// tsconfig.json excerpt\n// { \"compilerOptions\": { \"target\": \"ES2020\", \"module\": \"ESNext\", \"strict\": true, \"outDir\": \"dist\" } }\nconst add = (a: number, b: number) => a + b;\nexport default add;\n// emits dist/index.js — types stripped\n// Strict mode catches misuse at compile time\n// Annotations are erased — zero runtime overhead\n// Enable \"strict\": true in tsconfig.json",
  "exampleCaption": "Source TS becomes plain JS in outDir",
  "internals": [
    "Scanner → parser → binder → checker → emitter pipeline.",
    "Incremental builds cache .tsbuildinfo graph deltas.",
    "isolatedModules ensures each file transpiles independently for bundlers."
  ],
  "takeaways": [
    "npx tsc --init scaffolds tsconfig.json.",
    "Set \"target\" and \"module\" to match your runtime.",
    "Running tsc without reading tsconfig — defaults may emit CommonJS to wrong folder.",
    "Scanner → parser → binder → checker → emitter pipeline."
  ],
  "revision": [
    "Compiling with tsc: tsc is a factory: raw TS enters, two products leave — JS for machines, .d.ts blueprints for other TS files.",
    "npx tsc --init scaffolds tsconfig.json.",
    "Set \"target\" and \"module\" to match your runtime.",
    "Use \"include\"/\"exclude\" to scope compilation.",
    "Trap: Running tsc without reading tsconfig — defaults may emit CommonJS to wrong folder."
  ],
  "flashcards": [
    [
      "Compiling with tsc",
      "The TypeScript compiler (tsc) parses .ts/.tsx, type-checks, and emits JavaScript per tsconfig targets (module, target, outDir)."
    ],
    [
      "Mental model",
      "tsc is a factory: raw TS enters, two products leave — JS for machines, .d.ts blueprints for other TS files."
    ],
    [
      "Common trap",
      "Running tsc without reading tsconfig — defaults may emit CommonJS to wrong folder."
    ],
    [
      "npx tsc --init scaffolds tsconfig.json.",
      "Set \"target\" and \"module\" to match your runtime."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Compiling with tsc in TypeScript and when do you use it?",
      "answerHint": "The TypeScript compiler (tsc) parses .ts/.tsx, type-checks, and emits JavaScript per tsconfig targets (module, target, outDir). It can also --noEmit for type-check only. tsc handles declaration files (.d.ts), source maps, and incremental builds. Bundlers often use esbuild/swc for speed and tsc for verification."
    },
    {
      "level": "intermediate",
      "question": "Explain Compiling with tsc with a code example and one pitfall.",
      "answerHint": "npx tsc --init scaffolds tsconfig.json. Set \"target\" and \"module\" to match your runtime. Use \"include\"/\"exclude\" to scope compilation. composite + project references split monorepos. CI: tsc --noEmit; dev: Vite HMR with esbuild transform. Pitfall: Running tsc without reading tsconfig — defaults may emit CommonJS to wrong folder."
    },
    {
      "level": "advanced",
      "question": "How would you explain Compiling with tsc in a senior frontend interview?",
      "answerHint": "Scanner → parser → binder → checker → emitter pipeline. Incremental builds cache .tsbuildinfo graph deltas. isolatedModules ensures each file transpiles independently for bundlers. // tsconfig.json excerpt\n// { \"compilerOptions\": { \"target\": \"ES2020\", \"module\": \"ESNext\", \"strict\": true, \"outDir\": \"di"
    }
  ],
  "pitfalls": [
    "Running tsc without reading tsconfig — defaults may emit CommonJS to wrong folder."
  ],
  "interview": {
    "expectations": [
      "Explain Compiling with tsc with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "Scanner → parser → binder → checker → emitter pipeline."
    ],
    "commonQuestions": [
      "What is Compiling with tsc?",
      "When would you choose Compiling with tsc over alternatives?",
      "What is the classic Compiling with tsc interview trap?"
    ],
    "traps": [
      "Running tsc without reading tsconfig — defaults may emit CommonJS to wrong folder."
    ],
    "misconceptions": [
      "A single official compiler ensures consistent behavior across editors, CI, and docs. Emit + check separation lets teams optimize pipelines."
    ],
    "strongSignals": [
      "Uses Compiling with tsc to remove invalid states, not just document them."
    ]
  }
})
