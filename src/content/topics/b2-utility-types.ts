import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'TypeScript utility types are built-in generic type transforms in lib.d.ts — Partial, Required, Readonly, Pick, Omit, Record, Exclude, Extract, NonNullable, ReturnType, Parameters, Awaited, and more. They derive new types from existing ones without duplication.',
  whyExists:
    'API layers need variations: update DTOs with optional fields, readonly configs, picked response shapes. Writing each variant by hand drifts from source. Utilities encode common transforms once, composable and refactor-safe.',
  mentalModel:
    'Utilities are type-level functions. Feed them a type, get a transformed type. Pick/Omit slice keys; Partial makes optional; ReturnType extracts function output. Compose: Partial<Pick<User, "name">>.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Pick<T, K> / Omit<T, K> — select or remove keys.',
        'Partial<T> / Required<T> — toggle optionality.',
        'Readonly<T> — immutable properties.',
        'Record<K, V> — object with keys K and values V.',
        'Exclude<T, U> / Extract<T, U> — filter union members.',
        'ReturnType<F> / Parameters<F> / Awaited<P> — function and Promise helpers.',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Interview favorites',
      text: 'Be fluent defining Pick and Omit manually via mapped types — interviewers ask implementation, not just usage.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'typescript',
      caption: 'Common utilities in API layers',
      code: `interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
}

type UserPublic = Omit<User, 'passwordHash'>;
type UserCreate = Omit<User, 'id'>;
type UserUpdate = Partial<Pick<User, 'name' | 'email'>>;
type UserMap = Record<string, UserPublic>;

async function getUser(id: string): Promise<UserPublic> {
  const u: User = await db.users.find(id);
  const { passwordHash, ...publicUser } = u;
  return publicUser;
}`,
    },
    {
      type: 'code',
      language: 'typescript',
      caption: 'Implement Pick with mapped types',
      code: `type MyPick<T, K extends keyof T> = {
  [P in K]: T[P];
};

type MyOmit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

type MyPartial<T> = {
  [P in keyof T]?: T[P];
};`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Mapped types: [P in keyof T]: ... with key remapping (as clause in TS 4.1+).',
        'Conditional types power Exclude: T extends U ? never : T.',
        'Distributive conditional over union T in Exclude/Extract.',
        'ReadonlyDeep and PartialDeep are community patterns — not built-in.',
        'satisfies preserves literals while checking against utility-typed constraint.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'DRY type transformations',
      'Standard vocabulary across codebases',
      'Composable for complex DTO layers',
    ],
    disadvantages: [
      'Deep utilities need custom recursive types',
      'Over-composed types hurt error readability',
      'Omit does not remove from nested objects',
    ],
    alternatives: ['Manual interfaces', 'Zod infer<typeof schema>', 'Codegen'],
    whenToUse: ['DTOs, form state, public vs internal models, event payload subsets'],
    whenNotToUse: ['When explicit interface documents domain better than Omit chain'],
  },
  failureModes: [
    'Omit<User, "id"> still allows extra props on assignment from wider type.',
    'Partial makes all optional — not same as partial deep update semantics.',
    'Record<string, T> accepts any string key — typos not caught.',
    'ReturnType on overloaded function picks last overload signature.',
  ],
  production: {
    maintainability: ['Name derived types: UserPublic = Omit<User, "passwordHash">'],
    reliability: ['Use NonNullable after filter to drop null from union'],
    performance: ['Heavy mapped types affect tsc speed in monorepos'],
  },
  interview: {
    expectations: [
      'Use Pick, Omit, Partial in API example',
      'Implement Pick with mapped type',
      'Explain Exclude vs Extract',
    ],
    commonQuestions: ['Pick vs Omit?', 'Partial vs DeepPartial?', 'ReturnType use case?'],
    followUps: ['Mapped types?', 'Conditional Exclude implementation?'],
    misconceptions: ['Utilities change runtime objects'],
    traps: ['Record<string,T> vs specific key union Record<Route,T>'],
    strongSignals: ['Defines Pick manually, DTO layering example, Awaited for async'],
  },
  keyTakeaways: [
    'Utilities transform types — zero runtime cost.',
    'Pick/Omit slice keys; Partial/Required toggle optionality.',
    'ReturnType/Parameters/Awaited for functions and promises.',
    'Exclude/Extract filter union members.',
    'Implement Pick: { [P in K]: T[P] }.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What does Partial<T> do?',
      answerHint: 'Makes all properties of T optional.',
    },
    {
      level: 'intermediate',
      question: 'Implement Pick<T, K> without using built-in Pick.',
      answerHint: 'Mapped type { [P in K]: T[P] } where K extends keyof T.',
    },
    {
      level: 'advanced',
      question: 'Difference Exclude<T,U> vs Omit<T,K>?',
      answerHint: 'Exclude filters union members; Omit removes object keys via Pick+Exclude.',
    },
  ],
  flashcards: [
    { front: 'Pick<T,K>', back: 'Subset of T with keys K' },
    { front: 'Omit<T,K>', back: 'T without keys K' },
    { front: 'Partial<T>', back: 'All props optional' },
    { front: 'ReturnType<F>', back: 'Return type of function type F' },
  ],
  quickRevision: [
    'Pick/Omit/Partial/Required/Readonly',
    'Record<K,V> key-value map type',
    'Exclude/Extract on unions',
    'ReturnType/Parameters/Awaited',
    'Mapped type implementation',
    'Name derived DTO types',
  ],
}
