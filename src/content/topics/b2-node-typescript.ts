import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Node.js + TypeScript",
  "whatIsIt": "Node + TS: @types/node for process, fs, Buffer; moduleResolution node16/nodenext for ESM/CJS; ts-node/tsx for dev; compile to dist for production. Typings for __dirname differ in ESM.",
  "whyExists": "Backend TS mirrors frontend tooling with Node-specific types.",
  "mentalModel": "Same TS language, Node host types instead of DOM.",
  "how": [
    "npm i -D typescript @types/node.",
    "module: NodeNext for package.json \"type\": \"module\".",
    "Import fs/promises with typed APIs.",
    "process.env typed via augmentation or zod.",
    "Build with tsc or bundle with esbuild."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Using DOM types in Node project — lib dom pollutes; set \"lib\" appropriately.",
    "variant": "warning"
  },
  "example": "import { readFile } from 'node:fs/promises';\nimport path from 'node:path';\nasync function readConfig(cwd: string): Promise<string> {\n  const file = path.join(cwd, 'config.json');\n  return readFile(file, 'utf8');\n}\nconsole.log(typeof readConfig);\nconsole.log(readConfig('demo'));",
  "exampleCaption": "Node fs/promises with typed Promise<string>",
  "internals": [
    "Node ESM needs .js extensions in imports per NodeNext.",
    "import.meta.url replaces __dirname in ESM.",
    "Types version should match Node LTS runtime."
  ],
  "takeaways": [
    "npm i -D typescript @types/node.",
    "module: NodeNext for package.json \"type\": \"module\".",
    "Using DOM types in Node project — lib dom pollutes; set \"lib\" appropriately.",
    "Node ESM needs .js extensions in imports per NodeNext."
  ],
  "revision": [
    "Node.js + TypeScript: Same TS language, Node host types instead of DOM.",
    "npm i -D typescript @types/node.",
    "module: NodeNext for package.json \"type\": \"module\".",
    "Import fs/promises with typed APIs.",
    "Trap: Using DOM types in Node project — lib dom pollutes; set \"lib\" appropriately."
  ],
  "flashcards": [
    [
      "Node.js + TypeScript",
      "Node + TS: @types/node for process, fs, Buffer; moduleResolution node16/nodenext for ESM/CJS; ts-node/tsx for dev; compile to dist for production."
    ],
    [
      "Mental model",
      "Same TS language, Node host types instead of DOM."
    ],
    [
      "Common trap",
      "Using DOM types in Node project — lib dom pollutes; set \"lib\" appropriately."
    ],
    [
      "npm i -D typescript @types/node.",
      "module: NodeNext for package.json \"type\": \"module\"."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Node.js + TypeScript in TypeScript and when do you use it?",
      "answerHint": "Node + TS: @types/node for process, fs, Buffer; moduleResolution node16/nodenext for ESM/CJS; ts-node/tsx for dev; compile to dist for production. Typings for __dirname differ in ESM."
    },
    {
      "level": "intermediate",
      "question": "Explain Node.js + TypeScript with a code example and one pitfall.",
      "answerHint": "npm i -D typescript @types/node. module: NodeNext for package.json \"type\": \"module\". Import fs/promises with typed APIs. process.env typed via augmentation or zod. Build with tsc or bundle with esbuild. Pitfall: Using DOM types in Node project — lib dom pollutes; set \"lib\" appropriately."
    },
    {
      "level": "advanced",
      "question": "How would you explain Node.js + TypeScript in a senior frontend interview?",
      "answerHint": "Node ESM needs .js extensions in imports per NodeNext. import.meta.url replaces __dirname in ESM. Types version should match Node LTS runtime. import { readFile } from 'node:fs/promises';\nimport path from 'node:path';\nasync function readConfig(cwd: string): Promi"
    }
  ],
  "pitfalls": [
    "Using DOM types in Node project — lib dom pollutes; set \"lib\" appropriately."
  ],
  "interview": {
    "expectations": [
      "Explain Node.js + TypeScript with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "Node ESM needs .js extensions in imports per NodeNext."
    ],
    "commonQuestions": [
      "What is Node.js + TypeScript?",
      "When would you choose Node.js + TypeScript over alternatives?",
      "What is the classic Node.js + TypeScript interview trap?"
    ],
    "traps": [
      "Using DOM types in Node project — lib dom pollutes; set \"lib\" appropriately."
    ],
    "misconceptions": [
      "Backend TS mirrors frontend tooling with Node-specific types."
    ],
    "strongSignals": [
      "Uses Node.js + TypeScript to remove invalid states, not just document them."
    ]
  }
})
