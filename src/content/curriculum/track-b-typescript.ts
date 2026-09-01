import type { Priority } from '@/domain/types'
import type { TopicSeed, SectionSeed } from './build'

const TS = ['typescript'] as const
const M34 = [3, 4]
const M45 = [4, 5]
const M56 = [5, 6]

function item(
  id: string,
  title: string,
  priority: Priority,
  months: number[],
  extra: Partial<TopicSeed> = {},
): TopicSeed {
  const { tags, executionPriority, ...rest } = extra
  return {
    id,
    title,
    priority,
    months,
    tags: [...TS, ...(tags ?? [])],
    executionPriority:
      executionPriority ?? (priority === 'tier1' ? 'p0' : undefined),
    ...rest,
  }
}

function nest(
  parent: string,
  id: string,
  title: string,
  priority: Priority,
  months: number[],
  extra: Partial<TopicSeed> = {},
): TopicSeed {
  return item(id, title, priority, months, {
    ...extra,
    curriculumLevel: 'nested-concept',
    parentTopicId: parent,
  })
}

function section(
  id: string,
  title: string,
  order: number,
  topics: TopicSeed[],
): SectionSeed {
  return {
    id,
    track: 'B',
    title,
    order,
    defaultKind: 'theory',
    defaultDepth: 'deep',
    topics,
  }
}

/** B2.1–B2.35 — TypeScript beginner → senior interview depth. */
export const TRACK_B_TYPESCRIPT_SECTIONS: SectionSeed[] = [
  section('B2.1', 'Introduction & Setup', 44, [
    item('b2-what-is-typescript', 'What TypeScript Is', 'tier1', M34),
    item('b2-ts-vs-javascript', 'TypeScript vs JavaScript', 'tier1', M34),
    item('b2-why-typescript', 'Why Use TypeScript', 'tier1', M34),
    item('b2-ts-disadvantages', 'TypeScript Trade-offs', 'tier2', M45),
    item('b2-optional-static-typing', 'Optional Static Typing', 'tier1', M34),
    item('b2-tsc-compilation', 'Compiling with tsc', 'tier1', M34),
    item('b2-ts-vs-tsx', '.ts vs .tsx', 'tier1', M34),
  ]),

  section('B2.2', 'Simple Types & Annotations', 45, [
    item('b2-primitive-object-types', 'Primitive & Object Types', 'tier1', M34),
    nest('b2-primitive-object-types', 'b2-type-string', 'string', 'tier1', M34),
    nest('b2-primitive-object-types', 'b2-type-number', 'number', 'tier1', M34),
    nest('b2-primitive-object-types', 'b2-type-boolean', 'boolean', 'tier1', M34),
    item('b2-explicit-types', 'Explicit Types', 'tier1', M34),
    item('b2-type-annotations', 'Type Annotations', 'tier1', M34),
  ]),

  section('B2.3', 'Type Inference', 46, [
    item('b2-type-inference', 'Type Inference', 'tier1', M34),
    item('b2-when-explicit-vs-inferred', 'When to Annotate vs Infer', 'tier1', M34),
  ]),

  section('B2.4', 'Special Types', 47, [
    item('b2-special-types', 'any, unknown, never, void', 'tier1', M34),
    nest('b2-special-types', 'b2-avoiding-any', 'Avoiding any', 'tier1', M34),
    nest('b2-special-types', 'b2-unknown', 'unknown', 'tier1', M34),
    nest('b2-special-types', 'b2-never', 'never', 'tier1', M34),
    nest('b2-special-types', 'b2-void-ts', 'void', 'tier1', M34),
    item('b2-null-undefined-ts', 'null & undefined', 'tier1', M34),
    item('b2-strict-null-checks', 'strictNullChecks', 'tier1', M34),
  ]),

  section('B2.5', 'Arrays', 48, [
    item('b2-typed-arrays', 'Typed Arrays', 'tier1', M34),
    nest('b2-typed-arrays', 'b2-readonly-arrays', 'Readonly Arrays', 'tier1', M34),
    nest('b2-typed-arrays', 'b2-array-inference', 'Array Type Inference', 'tier1', M34),
  ]),

  section('B2.6', 'Tuples', 49, [
    item('b2-tuples', 'Tuples', 'tier1', M34),
    item('b2-readonly-tuples', 'Readonly Tuples', 'tier1', M34),
  ]),

  section('B2.7', 'Object Types', 50, [
    item('b2-object-types', 'Object Types', 'tier1', M34),
    nest('b2-object-types', 'b2-optional-properties', 'Optional Properties', 'tier1', M34),
    nest('b2-object-types', 'b2-readonly-properties', 'readonly Properties', 'tier1', M34),
    item('b2-parameter-destructuring', 'Parameter Destructuring', 'tier1', M34),
  ]),

  section('B2.8', 'Enums & Literal Constants', 51, [
    item('b2-enums', 'Enums', 'tier1', M34),
    nest('b2-enums', 'b2-string-enums', 'String Enums', 'tier1', M34),
    item('b2-literal-unions-vs-enums', 'Literal Unions vs Enums', 'tier1', M34),
    item('b2-as-const-objects', 'as const Objects', 'tier1', M34),
  ]),

  section('B2.9', 'Interfaces', 52, [
    item('b2-interfaces', 'Interfaces', 'tier1', M34),
    nest('b2-interfaces', 'b2-extending-interfaces', 'Extending Interfaces', 'tier1', M34),
    item('b2-interface-vs-type-when', 'Interface vs Type — When to Use', 'tier1', M34),
  ]),

  section('B2.10', 'Type Aliases', 53, [
    item('b2-type-aliases', 'Type Aliases', 'tier1', M34),
    item('b2-type-alias-patterns', 'Type Alias Patterns', 'tier1', M34),
  ]),

  section('B2.11', 'Unions & Intersections', 54, [
    item('b2-unions', 'Union Types', 'tier1', M34),
    nest('b2-unions', 'b2-intersections', 'Intersection Types', 'tier1', M34),
    item('b2-union-patterns', 'Union & Intersection Patterns', 'tier1', M34),
  ]),

  section('B2.12', 'Literal Types & Discriminated Unions', 55, [
    item('b2-literal-types', 'Literal Types', 'tier1', M34),
    item('b2-discriminated-unions', 'Discriminated Unions', 'tier1', M34),
    nest('b2-discriminated-unions', 'b2-exhaustiveness-assertnever', 'Exhaustiveness & assertNever', 'tier1', M34),
    item('b2-remote-data-pattern', 'RemoteData Async State Pattern', 'tier1', M34, {
      tags: ['typescript', 'interview'],
    }),
  ]),

  section('B2.13', 'Type Narrowing & Type Guards', 56, [
    item('b2-narrowing', 'Type Narrowing', 'tier1', M34),
    nest('b2-narrowing', 'b2-typeof-narrowing', 'typeof Narrowing', 'tier1', M34),
    nest('b2-narrowing', 'b2-instanceof-narrowing', 'instanceof Narrowing', 'tier1', M34),
    nest('b2-narrowing', 'b2-in-operator', 'in Operator', 'tier1', M34),
    nest('b2-narrowing', 'b2-custom-type-guards', 'Custom Type Guards', 'tier1', M34),
  ]),

  section('B2.14', 'Functions', 57, [
    item('b2-typed-functions', 'Typed Functions', 'tier1', M34),
    item('b2-function-overloading', 'Function Overloading', 'tier1', M34),
    nest('b2-typed-functions', 'b2-optional-rest-parameters', 'Optional & Rest Parameters', 'tier1', M34),
    nest('b2-typed-functions', 'b2-arrow-functions-ts', 'Arrow Functions', 'tier1', M34),
    item('b2-function-variance', 'Function Type Variance', 'tier2', M45),
  ]),

  section('B2.15', 'Casting & Assertions', 58, [
    item('b2-type-assertions', 'Type Assertions (as)', 'tier1', M34),
    nest('b2-type-assertions', 'b2-as-const-assertion', 'as const Assertion', 'tier1', M34),
    nest('b2-type-assertions', 'b2-non-null-assertion', 'Non-null Assertion (!)', 'tier1', M34),
  ]),

  section('B2.16', 'Classes', 59, [
    item('b2-classes-ts', 'Classes', 'tier1', M34),
    nest('b2-classes-ts', 'b2-class-inheritance', 'Class Inheritance', 'tier1', M34),
    nest('b2-classes-ts', 'b2-super-constructor', 'super & Constructor', 'tier1', M34),
  ]),

  section('B2.17', 'Access Modifiers & Encapsulation', 60, [
    item('b2-public-private-protected', 'public / private / protected', 'tier1', M34),
    nest('b2-public-private-protected', 'b2-readonly-class-members', 'readonly Members', 'tier1', M34),
    item('b2-parameter-properties', 'Parameter Properties', 'tier1', M34),
  ]),

  section('B2.18', 'Abstract Classes & implements', 61, [
    item('b2-abstract-classes', 'Abstract Classes', 'tier1', M34),
    item('b2-implements-vs-extends', 'implements vs extends', 'tier1', M34),
    nest('b2-abstract-classes', 'b2-method-overriding', 'Method Overriding', 'tier1', M34),
    item('b2-singleton-pattern', 'Singleton Pattern', 'tier2', M45),
  ]),

  section('B2.19', 'Generics', 62, [
    item('b2-generics', 'Generics', 'tier1', M34),
    item('b2-generic-constraints', 'Generic Constraints', 'tier1', M34, { prereqs: ['b2-generics'] }),
    nest('b2-generics', 'b2-generic-classes', 'Generic Classes', 'tier1', M34),
    nest('b2-generics', 'b2-default-type-parameters', 'Default Type Parameters', 'tier1', M34),
  ]),

  section('B2.20', 'Utility Types', 63, [
    item('b2-utility-types', 'Utility Types Overview', 'tier1', M34),
    nest('b2-utility-types', 'b2-partial', 'Partial', 'tier1', M34),
    nest('b2-utility-types', 'b2-required', 'Required', 'tier1', M34),
    nest('b2-utility-types', 'b2-pick', 'Pick', 'tier1', M34),
    nest('b2-utility-types', 'b2-omit', 'Omit', 'tier1', M34),
    nest('b2-utility-types', 'b2-record-utility', 'Record', 'tier1', M34),
    nest('b2-utility-types', 'b2-readonly-utility', 'Readonly', 'tier1', M34),
    nest('b2-utility-types', 'b2-returntype', 'ReturnType', 'tier1', M34),
    nest('b2-utility-types', 'b2-parameters-type', 'Parameters', 'tier1', M34),
    nest('b2-utility-types', 'b2-awaited', 'Awaited', 'tier1', M34),
  ]),

  section('B2.21', 'keyof, typeof & Indexed Access', 64, [
    item('b2-keyof', 'keyof', 'tier1', M34),
    item('b2-typeof', 'typeof (type level)', 'tier1', M34),
    item('b2-indexed-access', 'Indexed Access Types', 'tier1', M34),
    item('b2-keyof-typeof-patterns', 'keyof + typeof Patterns', 'tier1', M34),
  ]),

  section('B2.22', 'Structural Typing & Declaration Merging', 65, [
    item('b2-structural-typing', 'Structural Typing', 'tier1', M34),
    item('b2-declaration-merging', 'Declaration Merging', 'tier2', M45),
    nest('b2-declaration-merging', 'b2-module-augmentation', 'Module Augmentation', 'tier2', M45),
  ]),

  section('B2.23', 'Index Signatures', 66, [
    item('b2-index-signatures', 'Index Signatures', 'tier1', M34),
    item('b2-record-vs-index-signature', 'Record vs Index Signature', 'tier1', M34),
  ]),

  section('B2.24', 'satisfies & as const', 67, [
    item('b2-satisfies', 'satisfies', 'tier1', M34),
    item('b2-as-const', 'as const', 'tier1', M34),
    item('b2-variant-map-satisfies', 'Variant Maps with satisfies', 'tier1', M34, {
      tags: ['typescript', 'interview'],
    }),
  ]),

  section('B2.25', 'Conditional Types & infer', 68, [
    item('b2-conditional-types', 'Conditional Types', 'tier2', M56),
    item('b2-infer', 'infer', 'tier2', M56, { prereqs: ['b2-conditional-types'] }),
    item('b2-async-return-infer', 'Async Return with infer / Awaited', 'tier2', M56, {
      tags: ['typescript', 'interview'],
    }),
  ]),

  section('B2.26', 'Mapped & Template Literal Types', 69, [
    item('b2-mapped-types', 'Mapped Types', 'tier2', M56),
    item('b2-template-literal-types', 'Template Literal Types', 'tier2', M56),
    nest('b2-mapped-types', 'b2-key-remapping', 'Key Remapping (as)', 'tier2', M56),
    item('b2-change-handlers-pattern', 'ChangeHandlers Pattern', 'tier2', M56, {
      tags: ['typescript', 'interview'],
    }),
  ]),

  section('B2.27', 'Type-Safe API Design', 70, [
    item('b2-type-safe-apis', 'Type-Safe API Design', 'tier1', M34),
    nest('b2-type-safe-apis', 'b2-pick-partial-patch', 'Pick + Partial Patch Payloads', 'tier1', M34),
    item('b2-generic-pick-helper', 'Generic pick() Helper', 'tier1', M34, {
      tags: ['typescript', 'interview'],
    }),
  ]),

  section('B2.28', 'React + TypeScript', 71, [
    item('b2-react-typescript', 'React + TypeScript', 'tier1', M34, { tags: ['typescript', 'react'] }),
    nest('b2-react-typescript', 'b2-react-component-props', 'Component Props', 'tier1', M34, {
      tags: ['typescript', 'react'],
    }),
    item('b2-mutually-exclusive-props', 'Mutually Exclusive Props', 'tier1', M34, {
      tags: ['typescript', 'react', 'interview'],
    }),
    nest('b2-react-typescript', 'b2-controlled-uncontrolled-props', 'Controlled vs Uncontrolled', 'tier1', M34, {
      tags: ['typescript', 'react'],
    }),
    item('b2-hooks-typing', 'Typing Hooks', 'tier1', M34, { tags: ['typescript', 'react'] }),
  ]),

  section('B2.29', 'Node.js + TypeScript', 72, [
    item('b2-node-typescript', 'Node.js + TypeScript', 'tier1', M45),
    nest('b2-node-typescript', 'b2-express-typing', 'Express Request/Response Typing', 'tier1', M45),
  ]),

  section('B2.30', 'Modules', 73, [
    item('b2-ts-modules', 'TypeScript Modules', 'tier1', M34),
    item('b2-esm-vs-cjs-ts', 'ESM vs CommonJS in TS', 'tier1', M34),
    item('b2-namespaces', 'Namespaces', 'tier2', M45),
  ]),

  section('B2.31', 'tsconfig & Compiler Options', 74, [
    item('b2-tsconfig', 'tsconfig.json', 'tier1', M34),
    nest('b2-tsconfig', 'b2-strict-compiler-options', 'strict & Compiler Flags', 'tier1', M34),
    nest('b2-tsconfig', 'b2-noimplicitany', 'noImplicitAny', 'tier1', M34),
    item('b2-declaration-files', 'Declaration Files (.d.ts)', 'tier1', M45),
    item('b2-source-maps-ts', 'Source Maps & Debugging', 'tier1', M34),
  ]),

  section('B2.32', 'Tooling & Ecosystem', 75, [
    item('b2-definitely-typed', 'Definitely Typed (@types)', 'tier1', M34),
    item('b2-third-party-types', 'Third-Party Library Types', 'tier1', M34),
    item('b2-eslint-typescript', 'ESLint + TypeScript', 'tier1', M45),
    item('b2-vite-typescript', 'Vite / Build Tooling', 'tier1', M45),
  ]),

  section('B2.33', 'Migration & Decorators', 76, [
    item('b2-migration-js-to-ts', 'Migrating JavaScript → TypeScript', 'tier1', M45),
    nest('b2-migration-js-to-ts', 'b2-allowjs-checkjs', 'allowJs & checkJs', 'tier1', M45),
    item('b2-decorators', 'Decorators', 'tier2', M56),
  ]),

  section('B2.34', 'Advanced Patterns', 77, [
    item('b2-mixins', 'Mixins', 'tier2', M56),
    item('b2-this-types', 'this Types', 'tier2', M56),
    item('b2-branded-types', 'Branded / Nominal Types', 'tier2', M56),
  ]),

  section('B2.35', 'TypeScript Implementation Exercises', 78, [
    item('b2-impl-pick', 'Implement type-safe pick()', 'tier1', M45, {
      tags: ['typescript', 'interview'],
    }),
    item('b2-impl-discriminated-union', 'Implement RemoteData<T>', 'tier1', M45, {
      tags: ['typescript', 'interview'],
    }),
    item('b2-impl-exclusive-props', 'Implement Exclusive Button Props', 'tier1', M45, {
      tags: ['typescript', 'react', 'interview'],
    }),
    item('b2-impl-change-handlers', 'Implement ChangeHandlers<T>', 'tier2', M56, {
      tags: ['typescript', 'interview'],
    }),
    item('b2-impl-type-guard', 'Implement isPreferences Guard', 'tier1', M45, {
      tags: ['typescript', 'interview'],
    }),
  ]),
]
