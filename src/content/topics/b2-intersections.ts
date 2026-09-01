import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'An intersection type (`A & B`) combines multiple types into one that must satisfy all constituents. The result has every member from each part. Intersections merge object shapes; conflicting property types intersect to often become `never` on that property.',
  whyExists:
    'Composition beats deep inheritance. Mixins, capability flags, and layering behaviors (User & Timestamps & Auditable) are expressed by intersecting types rather than duplicating fields or building fragile class trees.',
  mentalModel:
    'Intersection is “must be all of these at once.” For objects, merge the property sets. For primitives like string & number, you get impossible types (never) — usually a mistake. Think &: everything applies simultaneously.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Object merge: `{ a: 1 } & { b: 2 }` → `{ a: 1; b: 2 }`.',
        'Same property name: types intersect — `string & number` → never on that key.',
        'Functions intersect: overload-like intersection of call signatures (advanced).',
        'Used with Omit/Pick to compose entity types.',
        'interface extends is similar to intersection for object shapes.',
      ],
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Union vs intersection',
      text: 'A | B = either. A & B = both. `(A | B) & C` distributes: (A & C) | (B & C). Confusing & and | is a top interview trap.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'typescript',
      caption: 'Composing entity types',
      code: `type Timestamps = {
  createdAt: Date;
  updatedAt: Date;
};

type SoftDelete = {
  deletedAt: Date | null;
};

type User = {
  id: string;
  name: string;
};

type UserRecord = User & Timestamps & SoftDelete;

const row: UserRecord = {
  id: '1',
  name: 'Ada',
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};`,
    },
    {
      type: 'code',
      language: 'typescript',
      caption: 'Mixin-style function',
      code: `type Constructor<T = {}> = new (...args: any[]) => T;

function Timestamped<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    createdAt = new Date();
  };
}

class User { name = 'Ada'; }
class TimestampedUser extends Timestamped(User) {}
// Intersection types model the static shape; classes model runtime mixin`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Intersection reduction flattens nested & chains.',
        'Conflicting optional/required modifiers merge with stricter rules.',
        'Union distribution: (A | B) & C → (A & C) | (B & C).',
        'Generic constraints often use extends which relates to assignability, not & directly.',
        'Excess overlap on methods uses intersection of signatures (overload merge).',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Composable type building without inheritance',
      'Expresses “has all capabilities” clearly',
      'Works well with utility types',
    ],
    disadvantages: [
      'Property conflicts produce never — confusing errors',
      'Long & chains hurt readability',
      'Does not add runtime behavior (types only)',
    ],
    alternatives: ['interface extends', 'Single interface with all fields', 'Composition objects at runtime'],
    whenToUse: ['Layering cross-cutting fields, typed mixins, combining Pick results'],
    whenNotToUse: ['Mutually exclusive alternatives — use union instead'],
  },
  failureModes: [
    'string & number intersection on accident → unusable type.',
    'Assuming intersection adds runtime mixin behavior.',
    'Optional property merge surprises when one side required.',
    'Over-intersecting generics producing `{}` or unknown.',
  ],
  production: {
    maintainability: ['Name composed types: UserEntity = User & Timestamps & ...'],
    reliability: ['Resolve property conflicts explicitly with Omit before intersecting'],
  },
  interview: {
    expectations: [
      'Define intersection vs union',
      'Compose two object types with &',
      'Explain property conflict → never',
    ],
    commonQuestions: ['A & B vs A | B?', 'What happens if same key different types?'],
    followUps: ['interface extends vs intersection?', 'Mixin patterns?'],
    misconceptions: ['Intersection means value can be either type'],
    traps: ['Confusing & and | in interview whiteboard'],
    strongSignals: ['Mentions merge of properties, never on conflict, composition pattern'],
  },
  keyTakeaways: [
    'Intersection = must satisfy all types simultaneously.',
    'Object intersections merge property sets.',
    'Conflicting property types → often never.',
    'Union = or; intersection = and.',
    'Name composed types for readability.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What is `{ a: string } & { b: number }`?',
      answerHint: 'Object with both a: string and b: number.',
    },
    {
      level: 'intermediate',
      question: 'Difference between union and intersection?',
      answerHint: 'Union is either; intersection is all combined requirements.',
    },
    {
      level: 'advanced',
      question: 'What is `{ id: string } & { id: number }`?',
      answerHint: 'id becomes string & number → never — unsatisfiable.',
    },
  ],
  flashcards: [
    { front: 'A & B', back: 'Must be both — merged requirements' },
    { front: 'A | B', back: 'Either A or B' },
    { front: 'Property conflict', back: 'Same key → intersect property types' },
    { front: 'Composition pattern', back: 'User & Timestamps & Auditable' },
  ],
  quickRevision: [
    '& = all at once',
    '| = one of',
    'Objects merge props',
    'Conflicts → never',
    'Not runtime mixins alone',
    'Name composed types',
  ],
}
