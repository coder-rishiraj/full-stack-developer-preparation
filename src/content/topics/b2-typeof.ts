import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'In TypeScript, `typeof` in type position extracts the type of a value, variable, or property. Combined with `as const`, it builds precise types from runtime values — `typeof config`, `typeof myFunc`, `ReturnType<typeof fn>`.',
  whyExists:
    'Maintaining parallel type definitions and runtime values duplicates truth. typeof bridges “single source of truth” — define a config object or function once; derive types from its inferred shape.',
  mentalModel:
    'Runtime typeof (JavaScript) returns a string. Type-level typeof takes a value identifier and asks the compiler what type that value has. Use in type aliases, not at runtime.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Type query: `type Config = typeof configObject`.',
        'Functions: `typeof fn` gives callable type including overloads.',
        'Classes: `typeof MyClass` is constructor side; `InstanceType<typeof MyClass>` for instances.',
        'as const narrows literals — `typeof routes` becomes readonly deep literals.',
        'Import type of values: combine with ReturnType, Parameters utilities.',
      ],
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'Two typeofs',
      text: 'JS runtime: typeof x === "string". TS type position: type T = typeof x. Context disambiguates.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'typescript',
      caption: 'Config-driven types',
      code: `const themes = {
  light: { bg: '#fff', fg: '#000' },
  dark: { bg: '#111', fg: '#eee' },
} as const;

type ThemeName = keyof typeof themes; // 'light' | 'dark'
type ThemeTokens = typeof themes.light;

function applyTheme(name: ThemeName) {
  const tokens: ThemeTokens = themes[name];
  return tokens;
}`,
    },
    {
      type: 'code',
      language: 'typescript',
      caption: 'ReturnType and Parameters',
      code: `async function fetchUser(id: string) {
  return { id, name: 'Ada', role: 'admin' as const };
}

type FetchUser = typeof fetchUser;
type User = Awaited<ReturnType<typeof fetchUser>>;
type FetchArgs = Parameters<typeof fetchUser>; // [string]

// User: { id: string; name: string; role: "admin" }`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'typeof only applies to values, not types (use type aliases for types).',
        'Widening: without as const, string literals widen to string.',
        'Declaration merging affects typeof on merged identifiers.',
        'Enums: typeof MyEnum includes reverse mapping for numeric enums.',
        'Bundler tree-shaking keeps typeof targets if imported for types only with import type.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'DRY — types follow implementation',
      'Refactor-safe when values change',
      'Excellent for API route maps and feature flags',
    ],
    disadvantages: [
      'Circular references if typeof depends on types that depend on typeof',
      'Over-narrowed as const can block intentional widening',
      'Complex inferred types leak implementation details in public API',
    ],
    alternatives: ['Manual duplicate interfaces', 'Codegen from OpenAPI/GraphQL'],
    whenToUse: ['Config objects, reducer action creators, const enums replacement'],
    whenNotToUse: ['Public library API — export explicit interfaces instead of typeof internals'],
  },
  failureModes: [
    'Forgetting as const — ThemeName becomes string not union.',
    'typeof on type name instead of value — error.',
    'Circular type alias with typeof self-reference.',
    'Assuming typeof works on JSON imports without assertion.',
  ],
  production: {
    maintainability: ['Centralize constants; export type Route = keyof typeof ROUTES'],
    reliability: ['Pair with satisfies for validation without widening'],
  },
  interview: {
    expectations: [
      'Distinguish runtime vs type typeof',
      'Derive union from keyof typeof const object',
      'Use ReturnType<typeof fn>',
    ],
    commonQuestions: ['typeof in TypeScript vs JavaScript?', 'as const purpose?', 'ReturnType?'],
    followUps: ['satisfies operator?', 'InstanceType?'],
    misconceptions: ['Type typeof runs at runtime'],
    traps: ['Confusing type and value typeof in same snippet'],
    strongSignals: ['Shows config + as const + keyof typeof pattern'],
  },
  keyTakeaways: [
    'Type typeof extracts type from a value.',
    'as const preserves literal types for typeof.',
    'keyof typeof builds string union from object keys.',
    'ReturnType/Parameters work with typeof fn.',
    'Single source of truth for configs and routes.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What does `type T = typeof x` do?',
      answerHint: 'Aliases T to the inferred type of value x.',
    },
    {
      level: 'intermediate',
      question: 'How get union of theme names from a themes object?',
      answerHint: 'as const on object, then keyof typeof themes.',
    },
    {
      level: 'advanced',
      question: 'Difference typeof MyClass vs InstanceType<typeof MyClass>?',
      answerHint: 'typeof = constructor type; InstanceType = instance shape.',
    },
  ],
  flashcards: [
    { front: 'Type typeof', back: 'Query type of a value identifier' },
    { front: 'as const', back: 'Deep readonly literal narrowing' },
    { front: 'ReturnType<typeof fn>', back: 'Function return type from value' },
    { front: 'Runtime typeof', back: 'String primitive name — different operator' },
  ],
  quickRevision: [
    'typeof value → type alias',
    'Not typeof on types',
    'as const for literals',
    'keyof typeof for key unions',
    'ReturnType/Parameters',
    'DRY config typing',
  ],
}
