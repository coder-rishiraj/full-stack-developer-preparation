import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Express Request/Response Typing",
  "whatIsIt": "Express typing via @types/express: Request, Response, NextFunction, RequestHandler. Extend Request with module augmentation for userId. Typed routers with express.Router(). Generic handler wrappers for async errors.",
  "whyExists": "Most common Node interview stack — typed middleware and handlers.",
  "mentalModel": "HTTP handler signatures enforced by Request/Response types.",
  "how": [
    "const app: Express = express();",
    "req.params.id string — validate before use.",
    "req.body unknown until validation — use zod infer type.",
    "Augment Request interface for custom fields.",
    "Async handler wrapper returns Promise<void>."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Trusting req.body as User without parse — use middleware validation.",
    "variant": "warning"
  },
  "example": "import express, { type Request, type Response } from 'express';\nconst app = express();\napp.get('/health', (_req: Request, res: Response) => {\n  res.json({ ok: true });\n});\napp.listen(3000);\nconsole.log(\"app.listen(3000)\");\n// TypeScript validates this file before emit",
  "exampleCaption": "Typed Express Request/Response handler",
  "internals": [
    "Express types separate from runtime express package.",
    "Router mergeParams affects req.params typing loosely.",
    "Typed HTTP clients (axios) complement server types."
  ],
  "takeaways": [
    "const app: Express = express();",
    "req.params.id string — validate before use.",
    "Trusting req.body as User without parse — use middleware validation.",
    "Express types separate from runtime express package."
  ],
  "revision": [
    "Express Request/Response Typing: HTTP handler signatures enforced by Request/Response types.",
    "const app: Express = express();",
    "req.params.id string — validate before use.",
    "req.body unknown until validation — use zod infer type.",
    "Trap: Trusting req.body as User without parse — use middleware validation."
  ],
  "flashcards": [
    [
      "Express Request/Response Typing",
      "Express typing via @types/express: Request, Response, NextFunction, RequestHandler."
    ],
    [
      "Mental model",
      "HTTP handler signatures enforced by Request/Response types."
    ],
    [
      "Common trap",
      "Trusting req.body as User without parse — use middleware validation."
    ],
    [
      "const app: Express = express();",
      "req.params.id string — validate before use."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Express Request/Response Typing in TypeScript and when do you use it?",
      "answerHint": "Express typing via @types/express: Request, Response, NextFunction, RequestHandler. Extend Request with module augmentation for userId. Typed routers with express.Router(). Generic handler wrappers for async errors."
    },
    {
      "level": "intermediate",
      "question": "Explain Express Request/Response Typing with a code example and one pitfall.",
      "answerHint": "const app: Express = express(); req.params.id string — validate before use. req.body unknown until validation — use zod infer type. Augment Request interface for custom fields. Async handler wrapper returns Promise<void>. Pitfall: Trusting req.body as User without parse — use middleware validation."
    },
    {
      "level": "advanced",
      "question": "How would you explain Express Request/Response Typing in a senior frontend interview?",
      "answerHint": "Express types separate from runtime express package. Router mergeParams affects req.params typing loosely. Typed HTTP clients (axios) complement server types. import express, { type Request, type Response } from 'express';\nconst app = express();\napp.get('/health', (_req: Request"
    }
  ],
  "pitfalls": [
    "Trusting req.body as User without parse — use middleware validation."
  ],
  "interview": {
    "expectations": [
      "Explain Express Request/Response Typing with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "Express types separate from runtime express package."
    ],
    "commonQuestions": [
      "What is Express Request/Response Typing?",
      "When would you choose Express Request/Response Typing over alternatives?",
      "What is the classic Express Request/Response Typing interview trap?"
    ],
    "traps": [
      "Trusting req.body as User without parse — use middleware validation."
    ],
    "misconceptions": [
      "Most common Node interview stack — typed middleware and handlers."
    ],
    "strongSignals": [
      "Uses Express Request/Response Typing to remove invalid states, not just document them."
    ]
  }
})
