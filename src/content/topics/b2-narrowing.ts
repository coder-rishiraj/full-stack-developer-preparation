import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Type narrowing is the process by which TypeScript refines a broad type (union or unknown) to a more specific type inside a control-flow branch. Guards include typeof, instanceof, in, equality checks, discriminant switches, and user-defined type predicates.',
  whyExists:
    'Unions and unknown cannot use type-specific APIs until proven safe. Narrowing encodes runtime checks the compiler understands, eliminating unsafe casts and catching missing cases at compile time.',
  mentalModel:
    'Each if/switch branch is a proof obligation. Show the compiler evidence — typeof x === "string", "id" in obj, result.ok === true — and it trusts you with narrower types in that block.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'typeof: string, number, boolean, bigint, symbol, undefined, function; not null/object distinction well.',
        'instanceof: class/array types.',
        'in operator: property existence on object union.',
        'Equality: null/undefined checks; discriminant literal compare.',
        'Type predicate: `function isUser(x: unknown): x is User`.',
        'Assertion functions: `asserts x is User` throws on failure.',
      ],
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'typeof null',
      text: 'typeof null === "object" — use x === null or x == null (idiom) instead of typeof for null.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'typescript',
      caption: 'typeof, in, and type predicate',
      code: `function format(value: string | number | null) {
  if (value === null) return 'N/A';
  if (typeof value === 'string') return value.trim();
  return value.toFixed(2);
}

type Cat = { meow(): void };
type Dog = { bark(): void };

function speak(pet: Cat | Dog) {
  if ('meow' in pet) pet.meow();
  else pet.bark();
}

function isUser(x: unknown): x is User {
  return typeof x === 'object' && x !== null && 'id' in x && 'name' in x;
}`,
    },
    {
      type: 'code',
      language: 'typescript',
      caption: 'Discriminant narrowing',
      code: `type Result =
  | { status: 'ok'; data: string }
  | { status: 'err'; message: string };

function handle(r: Result) {
  if (r.status === 'ok') {
    console.log(r.data); // narrowed
  } else {
    console.error(r.message);
  }
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Control flow analysis tracks narrowing across assignments, returns, throws.',
        'Aliasing: narrowing may not apply if same object referenced by two vars.',
        'Filter + type predicate: arr.filter(isUser) narrows array type (with Boolean guard pattern).',
        'Discriminated unions preferred — reliable literal narrowing.',
        'unknown requires narrowing before any use — top type safe boundary.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Eliminates unsafe casts',
      'Catches unhandled union members',
      'Works with strictNullChecks for null safety',
    ],
    disadvantages: [
      'Type predicates must be honest — lying causes runtime bugs',
      'Complex control flow loses narrowing',
      'typeof limited for object interfaces',
    ],
    alternatives: ['Schema validation (Zod) at boundary then trust type', 'Exhaustive switch default'],
    whenToUse: ['All union handling, unknown JSON, API result branches'],
    whenNotToUse: ['Blind as assertions without checks'],
  },
  failureModes: [
    'Incorrect type predicate returning true for wrong shapes.',
    'Narrowing lost after async gap — re-check or assign to const before await.',
    'typeof null object trap.',
    'in operator on primitive union member.',
  ],
  production: {
    reliability: ['Validate external data with schema; use is* predicates internally'],
    maintainability: ['Prefer discriminated unions over boolean flag combos'],
  },
  interview: {
    expectations: [
      'Narrow string | number with typeof',
      'Write type predicate',
      'Explain discriminant narrowing',
    ],
    commonQuestions: ['What is type narrowing?', 'Type guard vs assertion?', 'typeof null?'],
    followUps: ['unknown vs any?', 'Exhaustiveness with never?'],
    misconceptions: ['as casts are narrowing — they bypass checks'],
    traps: ['Thinking typeof distinguishes null'],
    strongSignals: ['Mentions predicates, in, discriminant, unknown boundary'],
  },
  keyTakeaways: [
    'Narrowing refines types via control-flow proofs.',
    'typeof, instanceof, in, equality, predicates.',
    'Discriminated unions narrow best on literal field.',
    'Type predicates: x is T — must be truthful.',
    'unknown needs narrowing before use.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'How narrow string | number before calling toUpperCase?',
      answerHint: 'if (typeof x === "string") x.toUpperCase().',
    },
    {
      level: 'intermediate',
      question: 'What is a type predicate?',
      answerHint: 'Return type x is T — tells compiler narrowing when true.',
    },
    {
      level: 'advanced',
      question: 'Why might narrowing be lost after await?',
      answerHint: 'Control flow analysis may not track across async boundaries; re-narrow.',
    },
  ],
  flashcards: [
    { front: 'Type narrowing', back: 'Compiler refines union to specific type in branch' },
    { front: 'x is User', back: 'Type predicate return type' },
    { front: 'typeof null', back: '"object" — use === null instead' },
    { front: 'in operator', back: 'Narrows object unions by property' },
  ],
  quickRevision: [
    'Proof in if/switch branches',
    'typeof / instanceof / in',
    'Discriminant literal compare',
    'Type predicates x is T',
    'unknown → narrow first',
    'never for exhaustiveness',
  ],
}
