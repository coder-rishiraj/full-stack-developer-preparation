import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Avoiding `any` means using precise types — unknown at boundaries, generics, unions, interfaces, type guards, and strict compiler flags — so mistakes surface at compile time. any disables checking and propagates silently through your codebase like a virus.',
  whyExists:
    'any was an escape hatch for gradual migration and dynamic JS. In large apps it erases the value of TypeScript — refactors break silently, autocomplete disappears, and bugs reach production. Disciplined alternatives keep safety without blocking productivity.',
  mentalModel:
    'any is an off switch for the type checker on that value and often everything it touches. unknown is a locked box — you must open it with a guard before use. Prefer unknown + narrow over any + hope.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Enable strict: strictNullChecks, noImplicitAny, strictFunctionTypes.',
        'Use unknown for external JSON; narrow with typeof, schema, predicates.',
        'Generics instead of any parameters: `<T>(x: T) => T`.',
        'Record<string, unknown> over any for dynamic objects.',
        'eslint @typescript-eslint/no-explicit-any and no-unsafe-* rules.',
        'Incremental migration: narrow any with unknown + satisfies + typed helpers.',
      ],
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'any propagation',
      text: 'One any poisons downstream inference — function returning any makes callers untyped. Fix at the source.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'typescript',
      caption: 'unknown vs any at boundary',
      code: `// Bad — no checking
function processBad(data: any) {
  return data.foo.bar; // compiles; may throw at runtime
}

// Good — force narrowing
function processGood(data: unknown) {
  if (typeof data !== 'object' || data === null) throw new Error('Expected object');
  if (!('foo' in data)) throw new Error('Missing foo');
  const foo = (data as { foo: unknown }).foo;
  // ... continue narrowing
}

// Schema approach
const UserSchema = z.object({ id: z.string(), name: z.string() });
type User = z.infer<typeof UserSchema>;

function parseUser(raw: unknown): User {
  return UserSchema.parse(raw);
}`,
    },
    {
      type: 'code',
      language: 'typescript',
      caption: 'Replace any in generics and events',
      code: `// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LegacyHandler = (event: any) => void; // avoid

type Handler<E extends Event = Event> = (event: E) => void;

const onClick: Handler<MouseEvent> = (e) => {
  console.log(e.clientX);
};

function identity<T>(x: T): T {
  return x;
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'any is both top and bottom — assignable to/from everything (unsound).',
        'unknown only assignable to unknown/any until narrowed.',
        'Implicit any from untyped params under noImplicitAny.',
        'Third-party @types sometimes use any — wrap or patch locally.',
        'Type assertion `as T` is not safer than any if abused.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Catch bugs at compile time',
      'Refactors with confidence',
      'IDE autocomplete and docs from types',
    ],
    disadvantages: [
      'Upfront typing effort at boundaries',
      'Third-party JS without types needs declarations or wrappers',
      'Strict flags may slow initial migration',
    ],
    alternatives: ['// @ts-expect-error with comment for rare cases', 'Gradual strict in tsconfig paths'],
    whenToUse: ['Always in application code; unknown at JSON/network edges'],
    whenNotToUse: ['Prototyping spike — but delete before merge or tighten'],
  },
  failureModes: [
    'Double cast any as unknown as User — bypasses without validation.',
    'JSON.parse without schema — still unknown at runtime.',
    'Disabling ESLint any rule repo-wide.',
    'Generic default any in library defs leaking to app.',
  ],
  production: {
    maintainability: ['CI: no-explicit-any, strict true in tsconfig'],
    reliability: ['Zod/io-ts at all external inputs'],
    security: ['any on auth/session objects hides missing checks'],
  },
  interview: {
    expectations: [
      'Explain any vs unknown',
      'List strict compiler flags',
      'Describe boundary validation strategy',
    ],
    commonQuestions: ['When is any OK?', 'unknown vs any?', 'How migrate legacy any?'],
    followUps: ['noImplicitAny?', 'Type assertion risks?'],
    misconceptions: ['as Type is as good as validation'],
    traps: ['Saying never use assertions — sometimes needed after guard'],
    strongSignals: ['unknown + narrow, noImplicitAny, ESLint, schema parse, any propagation'],
  },
  keyTakeaways: [
    'any disables type checking — avoid in app code.',
    'unknown is type-safe top type for external data.',
    'strict + ESLint enforce discipline.',
    'Validate at boundaries; generics inside.',
    'Fix any at source — stops propagation.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Difference any vs unknown?',
      answerHint: 'any opts out of checks; unknown requires narrowing before use.',
    },
    {
      level: 'intermediate',
      question: 'How handle JSON.parse typing?',
      answerHint: 'Parse to unknown; validate with schema; infer User type.',
    },
    {
      level: 'advanced',
      question: 'Why does one any parameter hurt a whole codebase?',
      answerHint: 'Return inference and chained calls lose types — propagates outward.',
    },
  ],
  flashcards: [
    { front: 'any', back: 'Opt out of type checking — avoid' },
    { front: 'unknown', back: 'Safe top type — narrow before use' },
    { front: 'noImplicitAny', back: 'Error on untyped params/locals' },
    { front: 'Boundary pattern', back: 'unknown → schema parse → typed' },
  ],
  quickRevision: [
    'any = checker off',
    'unknown + narrow',
    'strict + noImplicitAny',
    'ESLint no-explicit-any',
    'Zod at JSON edge',
    'Generics not any',
  ],
}
