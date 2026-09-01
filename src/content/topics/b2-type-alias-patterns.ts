import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Type Alias Patterns",
  "whatIsIt": "Common alias patterns: branded IDs, Result/Either unions, Nullable wrappers, callback signatures, and utility compositions (type ReadonlyUser = Readonly<User>). Aliases encode domain language and DRY complex unions.",
  "whyExists": "Patterns turn repeated type shapes into readable vocabulary senior engineers expect.",
  "mentalModel": "Domain dictionary — one word replaces a paragraph of structure.",
  "how": [
    "Branded: type Email = string & { readonly __brand: unique symbol }.",
    "Result: type ApiResult<T> = { ok: true; value: T } | { ok: false; error: Error }.",
    "Extract props: type ButtonProps = ComponentProps<typeof Button>.",
    "DeepPartial recursive alias for nested patches.",
    "Document invariants aliases cannot enforce alone."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Branded types without runtime validation — still just strings at runtime.",
    "variant": "warning"
  },
  "example": "type UserId = string & { readonly __brand: 'UserId' };\nfunction userId(raw: string): UserId { return raw as UserId; }\ntype LoadState<T> =\n  | { status: 'idle' }\n  | { status: 'loading' }\n  | { status: 'ok'; data: T }\n  | { status: 'error'; error: string };\n// type UserId = string & { readonly __brand: 'UserId' }; narrows allowed values",
  "exampleCaption": "Branded UserId and discriminated LoadState",
  "internals": [
    "Unique symbol brands survive structural typing.",
    "Discriminated unions need shared literal field.",
    "Alias expansion in errors can be verbose — keep names short."
  ],
  "takeaways": [
    "Branded: type Email = string & { readonly __brand: unique symbol }.",
    "Result: type ApiResult<T> = { ok: true; value: T } | { ok: false; error: Error }.",
    "Branded types without runtime validation — still just strings at runtime.",
    "Unique symbol brands survive structural typing."
  ],
  "revision": [
    "Type Alias Patterns: Domain dictionary — one word replaces a paragraph of structure.",
    "Branded: type Email = string & { readonly __brand: unique symbol }.",
    "Result: type ApiResult<T> = { ok: true; value: T } | { ok: false; error: Error }.",
    "Extract props: type ButtonProps = ComponentProps<typeof Button>.",
    "Trap: Branded types without runtime validation — still just strings at runtime."
  ],
  "flashcards": [
    [
      "Type Alias Patterns",
      "Common alias patterns: branded IDs, Result/Either unions, Nullable wrappers, callback signatures, and utility compositions (type ReadonlyUser = Readonly<User>)."
    ],
    [
      "Mental model",
      "Domain dictionary — one word replaces a paragraph of structure."
    ],
    [
      "Common trap",
      "Branded types without runtime validation — still just strings at runtime."
    ],
    [
      "Branded: type Email = string & { readonly __brand: unique symbol }.",
      "Result: type ApiResult<T> = { ok: true; value: T } | { ok: false; error: Error }."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Type Alias Patterns in TypeScript and when do you use it?",
      "answerHint": "Common alias patterns: branded IDs, Result/Either unions, Nullable wrappers, callback signatures, and utility compositions (type ReadonlyUser = Readonly<User>). Aliases encode domain language and DRY complex unions."
    },
    {
      "level": "intermediate",
      "question": "Explain Type Alias Patterns with a code example and one pitfall.",
      "answerHint": "Branded: type Email = string & { readonly __brand: unique symbol }. Result: type ApiResult<T> = { ok: true; value: T } | { ok: false; error: Error }. Extract props: type ButtonProps = ComponentProps<typeof Button>. DeepPartial recursive alias for nested patches. Document invariants aliases cannot enforce alone. Pitfall: Branded types without runtime validation — still just strings at runtime."
    },
    {
      "level": "advanced",
      "question": "How would you explain Type Alias Patterns in a senior frontend interview?",
      "answerHint": "Unique symbol brands survive structural typing. Discriminated unions need shared literal field. Alias expansion in errors can be verbose — keep names short. type UserId = string & { readonly __brand: 'UserId' };\nfunction userId(raw: string): UserId { return raw as UserId; }\nty"
    }
  ],
  "pitfalls": [
    "Branded types without runtime validation — still just strings at runtime."
  ],
  "interview": {
    "expectations": [
      "Explain Type Alias Patterns with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "Unique symbol brands survive structural typing."
    ],
    "commonQuestions": [
      "What is Type Alias Patterns?",
      "When would you choose Type Alias Patterns over alternatives?",
      "What is the classic Type Alias Patterns interview trap?"
    ],
    "traps": [
      "Branded types without runtime validation — still just strings at runtime."
    ],
    "misconceptions": [
      "Patterns turn repeated type shapes into readable vocabulary senior engineers expect."
    ],
    "strongSignals": [
      "Uses Type Alias Patterns to remove invalid states, not just document them."
    ]
  }
})
