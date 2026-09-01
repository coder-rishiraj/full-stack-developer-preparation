import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Generic constraints (`T extends U`) limit type parameters to types assignable to U. They unlock access to properties and methods of U inside the generic body while keeping T more specific than the bare constraint.',
  whyExists:
    'Unconstrained T is only known as unknown-like — you cannot read `.length` or `.id`. Constraints express minimum requirements: “T must be an object with id”, enabling safe property access without falling back to any.',
  mentalModel:
    'extends on a generic is a contract: T must be at least U. Inside the function, T is treated as having U\'s members plus possibly more. keyof and conditional types often combine with constrained T.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Syntax: `function fn<T extends HasId>(x: T)`.',
        'Multiple constraints: `T extends A & B` or intersect object types.',
        'Default constraint: `T extends object = object`.',
        'Conditional narrowing: constrained T in conditional types.',
        'Class generics: `class Store<T extends Entity>`.',
      ],
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'extends vs implements',
      text: 'Generic extends is a type bound at compile time. Class implements is a class contract. Do not confuse generic T extends Foo with class implements Foo.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'typescript',
      caption: 'Property access via constraint',
      code: `interface Identifiable {
  id: string;
}

function byId<T extends Identifiable>(items: T[], id: string): T | undefined {
  return items.find(item => item.id === id);
}

interface User extends Identifiable {
  name: string;
}

const users: User[] = [{ id: '1', name: 'Ada' }];
byId(users, '1'); // User | undefined — not just Identifiable`,
    },
    {
      type: 'code',
      language: 'typescript',
      caption: 'keyof constraint pattern',
      code: `function pick<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    result[key] = obj[key];
  }
  return result;
}

const user = { id: '1', name: 'Ada', role: 'admin' };
pick(user, ['id', 'name']); // { id: string; name: string }`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Constraint checking at instantiation: concrete T must extend bound.',
        'Higher-kinded patterns simulated via constrained type params and conditional types.',
        'extends string | number | symbol for keyof results.',
        'No runtime enforcement — purely static.',
        'Over-constraining loses useful inference — balance specificity.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Safe property access on generic T',
      'Enables pick/pluck/get patterns with keyof',
      'Documents minimum shape for callers',
    ],
    disadvantages: [
      'Complex bounds hard to read',
      'Wrong constraint blocks valid uses',
      'Error messages reference bound type not caller intent',
    ],
    alternatives: ['Function overloads per shape', 'Union of allowed types instead of open generic'],
    whenToUse: ['Entity lookups, pick/omit helpers, comparators on .id'],
    whenNotToUse: ['When T truly arbitrary — use unknown and type guards instead'],
  },
  failureModes: [
    'T extends object but passing null/undefined.',
    'Constraint too narrow — valid extra fields rejected in assignment contexts.',
    'Using any in constraint (`T extends any`) disables checking.',
    'Confusing extends in generics with class inheritance extends.',
  ],
  production: {
    maintainability: ['Name constraint interfaces: HasTimestamps, Identifiable'],
    reliability: ['Prefer unknown + guards over unconstrained T for external data'],
  },
  interview: {
    expectations: [
      'Write T extends with property access',
      'Combine with keyof for pick helper',
      'Distinguish generic bound vs class extends',
    ],
    commonQuestions: ['What does T extends X mean?', 'Why constrain generics?'],
    followUps: ['Multiple constraints?', 'T extends keyof U pattern?'],
    misconceptions: ['Constraint creates runtime check'],
    traps: ['Using extends any — lint ban'],
    strongSignals: ['Shows pick<T,K extends keyof T> pattern, Identifiable example'],
  },
  keyTakeaways: [
    'T extends U limits T to assignable types.',
    'Enables safe access to U\'s members inside generic code.',
    'Often paired with keyof for typed keys.',
    'Compile-time only — not runtime validation.',
    'Name constraints for clarity.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Why write `<T extends { id: string }>` instead of `<T>`?',
      answerHint: 'Guarantees id exists on T inside the function body.',
    },
    {
      level: 'intermediate',
      question: 'Implement pick(obj, keys) with generics.',
      answerHint: 'T extends object, K extends keyof T, return Pick<T, K>.',
    },
    {
      level: 'advanced',
      question: 'Can T be narrower than its constraint?',
      answerHint: 'Yes — T extends U means T is subtype of U; return type can stay T.',
    },
  ],
  flashcards: [
    { front: 'T extends U', back: 'T must be assignable to U — type bound' },
    { front: 'Why constrain', back: 'Access properties of U on T safely' },
    { front: 'K extends keyof T', back: 'Key param must be valid key of T' },
    { front: 'Runtime?', back: 'No — compile-time bound only' },
  ],
  quickRevision: [
    'extends on generic = minimum shape',
    'Unlocks property access',
    'pick: T + K extends keyof T',
    'Name constraint interfaces',
    'Not runtime check',
    'Avoid extends any',
  ],
}
