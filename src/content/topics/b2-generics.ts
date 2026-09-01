import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Generics are type parameters that make functions, classes, and types reusable while preserving type relationships. Instead of `any`, a placeholder `T` captures the caller\'s concrete type through inference or explicit type arguments.',
  whyExists:
    'Duplicating functions for each type loses safety and maintainability. any disables checking. Generics write one implementation and let the compiler specialize types — `Array<T>`, `Promise<T>`, `useState<T>` are everywhere in modern TS/React.',
  mentalModel:
    'Generics are function parameters for the type system. Call `identity<string>("a")` or let inference bind T from the argument. The implementation must work for all allowed T — constraints narrow the allowed set.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Declare: `function id<T>(x: T): T` or `class Box<T> { value: T }`.',
        'Inference: `id(42)` → T is number without explicit args.',
        'Multiple params: `function pair<A, B>(a: A, b: B): [A, B]`.',
        'Default type params: `interface Api<T = unknown>`.',
        'Generic interfaces propagate: `Promise<User>` chains through await.',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Inference tip',
      text: 'Pass values as parameters rather than type args when possible — `createUser({ name: "Ada" })` infers better than `createUser<User>(...)`.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'typescript',
      caption: 'Generic function and interface',
      code: `function first<T>(items: T[]): T | undefined {
  return items[0];
}

const n = first([1, 2, 3]);     // number | undefined
const s = first(['a', 'b']);    // string | undefined

interface Repository<T> {
  get(id: string): Promise<T | null>;
  save(entity: T): Promise<void>;
}

async function loadUser(repo: Repository<User>, id: string) {
  const user = await repo.get(id);
  return user?.name; // typed if User has name
}`,
    },
    {
      type: 'code',
      language: 'typescript',
      caption: 'React-style generic hook pattern',
      code: `function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : initial;
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue] as const;
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Type erasure: generics compile away — no runtime type param (unless reflection libraries).',
        'Variance: function param types contravariant, returns covariant (simplified model).',
        'Instantiation: compiler substitutes concrete types for T at check sites.',
        'Generic constraints use extends keyword — separate topic.',
        'typeof and keyof often combined with generics for typed keys.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Type-safe reusable libraries',
      'Inference reduces boilerplate',
      'Documents relationships (input T → output T)',
    ],
    disadvantages: [
      'Complex generics explode error message size',
      'Over-generic APIs harder to read',
      'No runtime type info without schemas',
    ],
    alternatives: ['Function overloads for fixed cases', 'Union of specific types', 'any (avoid)'],
    whenToUse: ['Collections, repositories, hooks, serializers, API clients'],
    whenNotToUse: ['Single concrete type with no reuse', 'When overloads clearer for 2–3 fixed shapes'],
  },
  failureModes: [
    'Explicit `<any>` on generic call wiping inference.',
    'Returning T without actually producing T — unsound cast.',
    'Generic component in TSX: `<List<Item> items={...} />` syntax confusion.',
    'Circular generic constraint without base case.',
  ],
  production: {
    maintainability: ['Cap generic complexity; export inferred helper types'],
    reliability: ['Validate external JSON before treating as T'],
    performance: ['Generics zero runtime cost — erasure'],
  },
  interview: {
    expectations: [
      'Write a simple generic function',
      'Explain inference vs explicit type args',
      'Know erasure — no runtime T',
    ],
    commonQuestions: ['What are generics?', 'Generic vs any?', 'How does inference work?'],
    followUps: ['Constraints with extends?', 'Generic defaults?'],
    misconceptions: ['Generics exist at runtime like Java'],
    traps: ['Thinking Array<number> creates different runtime Array class'],
    strongSignals: ['Mentions type parameters, inference, erasure, Repository<T> examples'],
  },
  keyTakeaways: [
    'Generics parameterize types — reusable and safe.',
    'Inference binds T from arguments when possible.',
    'Erased at runtime — compile-time only.',
    'Constraints (extends) limit allowed T.',
    'Prefer inference over manual type args.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Why use generics instead of any?',
      answerHint: 'Preserves type information and relationships through the call.',
    },
    {
      level: 'intermediate',
      question: 'What is type inference for generics?',
      answerHint: 'Compiler deduces T from argument types without explicit <T>.',
    },
    {
      level: 'advanced',
      question: 'Do generics exist at runtime in TypeScript?',
      answerHint: 'No — erased; need schemas or typeof checks for runtime.',
    },
  ],
  flashcards: [
    { front: 'Generic T', back: 'Type parameter placeholder' },
    { front: 'Inference', back: 'Compiler deduces T from usage' },
    { front: 'Erasure', back: 'Generics removed at compile — no runtime T' },
    { front: 'Repository<T>', back: 'Generic interface pattern for data access' },
  ],
  quickRevision: [
    'T = type parameter',
    'Write once, many types',
    'Infer when possible',
    'extends = constraint',
    'Zero runtime cost',
    'Not a substitute for validation',
  ],
}
