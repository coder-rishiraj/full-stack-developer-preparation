import type { Priority } from '@/domain/types'
import type { TopicSeed, SectionSeed } from './build'

const JS = ['javascript'] as const
const M12 = [1, 2]
const M34 = [3, 4]
const M45 = [4, 5]
const M910 = [9, 10]

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
    tags: [...JS, ...(tags ?? [])],
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

/** B1.1–B1.43 — JavaScript language, beginner → interview depth. Browser APIs live in B3. */
export const TRACK_B_JAVASCRIPT_SECTIONS: SectionSeed[] = [
  section('B1.1', 'JavaScript Foundations', 1, [
    item('b1-what-is-javascript', 'What JavaScript Is', 'tier1', M12),
    item('b1-ecmascript', 'JavaScript vs ECMAScript', 'tier1', M12),
    item('b1-runtimes', 'JavaScript Runtimes', 'tier1', M12, { tags: ['runtime'] }),
    nest('b1-runtimes', 'b1-runtime-browser', 'Browser Runtime', 'tier1', M12, { tags: ['runtime'] }),
    nest('b1-runtimes', 'b1-runtime-engine', 'JavaScript Engine', 'tier1', M12, { tags: ['runtime'] }),
    nest('b1-runtimes', 'b1-runtime-web-apis', 'Web APIs vs Language', 'tier1', M12, { tags: ['runtime'] }),
    nest('b1-runtimes', 'b1-runtime-nodejs', 'Node.js Conceptually', 'tier1', M12, { tags: ['runtime'] }),
    item('b1-script-loading', 'How JavaScript Loads in a Webpage', 'tier1', M12),
    nest('b1-script-loading', 'b1-script-inline', 'Inline Scripts', 'tier1', M12),
    nest('b1-script-loading', 'b1-script-external', 'External Scripts', 'tier1', M12),
    nest('b1-script-loading', 'b1-script-async', 'script async', 'tier1', M12),
    nest('b1-script-loading', 'b1-script-defer', 'script defer', 'tier1', M12),
    nest('b1-script-loading', 'b1-script-module', 'type="module"', 'tier1', M12),
    item('b1-statements-expressions', 'Statements vs Expressions', 'tier1', M12),
    item('b1-syntax-basics', 'Syntax Basics', 'tier1', M12),
    nest('b1-syntax-basics', 'b1-comments', 'Comments', 'tier1', M12),
    nest('b1-syntax-basics', 'b1-identifiers', 'Identifiers', 'tier1', M12),
    nest('b1-syntax-basics', 'b1-keywords', 'Keywords and Reserved Words', 'tier1', M12),
    nest('b1-syntax-basics', 'b1-case-sensitivity', 'Case Sensitivity', 'tier1', M12),
    nest('b1-syntax-basics', 'b1-asi', 'Semicolons / ASI', 'tier1', M12),
    nest('b1-syntax-basics', 'b1-strict-mode', 'Strict Mode', 'tier1', M12),
    nest('b1-syntax-basics', 'b1-console-output', 'Console and Output', 'tier1', M12),
    item('b1-basic-debugging', 'Basic Debugging', 'tier1', M12),
  ]),

  section('B1.2', 'Variables & Declarations', 2, [
    item('b1-variables', 'Variables', 'tier1', M12),
    nest('b1-variables', 'b1-declaration', 'Declaration', 'tier1', M12),
    nest('b1-variables', 'b1-initialization', 'Initialization', 'tier1', M12),
    nest('b1-variables', 'b1-assignment', 'Assignment vs Reassignment', 'tier1', M12),
    nest('b1-variables', 'b1-redeclaration', 'Redeclaration', 'tier1', M12),
    item('b1-var', 'var', 'tier1', M12),
    item('b1-let', 'let', 'tier1', M12),
    item('b1-const', 'const', 'tier1', M12),
    item('b1-var-let-const', 'var vs let vs const', 'tier1', M12),
    nest('b1-var-let-const', 'b1-function-scope-vars', 'Function Scope', 'tier1', M12),
    nest('b1-var-let-const', 'b1-block-scope-vars', 'Block Scope', 'tier1', M12),
    nest('b1-var-let-const', 'b1-global-scope-vars', 'Global Scope', 'tier1', M12),
    item('b1-tdz', 'Temporal Dead Zone', 'tier1', M12),
    item('b1-global-variables', 'Global Variables and globalThis', 'tier1', M12),
    item('b1-variable-naming', 'Variable Naming / Best Practices', 'tier2', M34),
  ]),

  section('B1.3', 'Types & Values', 3, [
    item('b1-primitive-types', 'Primitive Types', 'tier1', M12),
    nest('b1-primitive-types', 'b1-type-string', 'string', 'tier1', M12),
    nest('b1-primitive-types', 'b1-type-number', 'number', 'tier1', M12),
    nest('b1-primitive-types', 'b1-type-bigint', 'bigint', 'tier1', M12),
    nest('b1-primitive-types', 'b1-type-boolean', 'boolean', 'tier1', M12),
    nest('b1-primitive-types', 'b1-type-undefined', 'undefined', 'tier1', M12),
    nest('b1-primitive-types', 'b1-type-null', 'null', 'tier1', M12),
    nest('b1-primitive-types', 'b1-type-symbol-overview', 'symbol', 'tier1', M12),
    item('b1-objects-as-values', 'Objects as Values', 'tier1', M12),
    item('b1-primitive-vs-reference', 'Primitive vs Reference Types', 'tier1', M12),
    nest('b1-primitive-vs-reference', 'b1-immutability-primitives', 'Primitive Immutability', 'tier1', M12),
    nest('b1-primitive-vs-reference', 'b1-object-mutability', 'Object Mutability', 'tier1', M12),
    nest('b1-primitive-vs-reference', 'b1-call-by-sharing', 'Call-by-Sharing / Parameter Passing', 'tier1', M12),
    item('b1-typeof', 'typeof', 'tier1', M12),
    nest('b1-typeof', 'b1-typeof-null', 'typeof null', 'tier1', M12),
    item('b1-undefined-vs-null', 'undefined vs null vs Undeclared', 'tier1', M12),
    item('b1-nan-infinity', 'NaN, Infinity, and Safe Numbers', 'tier1', M12),
    nest('b1-nan-infinity', 'b1-number-isnan', 'Number.isNaN()', 'tier1', M12),
    nest('b1-nan-infinity', 'b1-object-is', 'Object.is()', 'tier1', M12),
    item('b1-autoboxing', 'Wrapper Objects / Autoboxing', 'tier1', M12),
    item('b1-truthy-falsy', 'Truthy and Falsy Values', 'tier1', M12),
    item('b1-instanceof', 'instanceof', 'tier2', M34),
    item('b1-tostringtag', 'Symbol.toStringTag', 'tier2', M45),
  ]),

  section('B1.4', 'Type Conversion & Coercion', 4, [
    item('b1-explicit-conversion', 'Explicit Conversion', 'tier1', M12),
    nest('b1-explicit-conversion', 'b1-string-conversion', 'String()', 'tier1', M12),
    nest('b1-explicit-conversion', 'b1-number-conversion', 'Number()', 'tier1', M12),
    nest('b1-explicit-conversion', 'b1-boolean-conversion', 'Boolean()', 'tier1', M12),
    nest('b1-explicit-conversion', 'b1-parseint-parsefloat', 'parseInt / parseFloat', 'tier1', M12),
    nest('b1-explicit-conversion', 'b1-unary-plus', 'Unary +', 'tier1', M12),
    item('b1-type-coercion', 'Type Coercion', 'tier1', M12),
    nest('b1-type-coercion', 'b1-implicit-coercion', 'Implicit Coercion', 'tier1', M12),
    nest('b1-type-coercion', 'b1-plus-coercion', 'Coercion with +', 'tier1', M12),
    item('b1-equality', 'Equality Operators', 'tier1', M12),
    nest('b1-equality', 'b1-abstract-equality', '== Abstract Equality', 'tier1', M12),
    nest('b1-equality', 'b1-strict-equality', '=== Strict Equality', 'tier1', M12),
    nest('b1-equality', 'b1-inequality', '!= and !==', 'tier1', M12),
    item('b1-to-primitive', 'Object-to-Primitive Conversion', 'tier2', M34),
    nest('b1-to-primitive', 'b1-valueof', 'valueOf()', 'tier2', M34),
    nest('b1-to-primitive', 'b1-object-tostring', 'toString()', 'tier2', M34),
    nest('b1-to-primitive', 'b1-symbol-toprimitive', 'Symbol.toPrimitive', 'tier2', M34),
  ]),

  section('B1.5', 'Operators & Expressions', 5, [
    item('b1-arithmetic-operators', 'Arithmetic Operators', 'tier1', M12),
    item('b1-assignment-operators', 'Assignment Operators', 'tier1', M12),
    item('b1-comparison-operators', 'Comparison Operators', 'tier1', M12),
    item('b1-logical-operators', 'Logical Operators', 'tier1', M12),
    nest('b1-logical-operators', 'b1-short-circuit', 'Short-Circuit Evaluation', 'tier1', M12),
    item('b1-unary-operators', 'Unary Operators', 'tier1', M12),
    nest('b1-unary-operators', 'b1-increment-decrement', 'Increment / Decrement', 'tier1', M12),
    item('b1-ternary', 'Ternary Operator', 'tier1', M12),
    item('b1-precedence', 'Operator Precedence & Associativity', 'tier1', M12),
    item('b1-optional-chaining', 'Optional Chaining', 'tier1', M12),
    item('b1-nullish-coalescing', 'Nullish Coalescing', 'tier1', M12),
    nest('b1-nullish-coalescing', 'b1-logical-assignment', 'Logical Assignment (&&= ||= ??=)', 'tier1', M12),
    item('b1-bitwise-operators', 'Bitwise Operators', 'tier2', M34),
    item('b1-in-delete-void', 'in, delete, void, instanceof', 'tier2', M34),
  ]),

  section('B1.6', 'Control Flow', 6, [
    item('b1-if-else', 'if / else / else if', 'tier1', M12),
    item('b1-switch', 'switch', 'tier1', M12),
    item('b1-for-loops', 'for / while / do...while', 'tier1', M12),
    item('b1-for-of-in', 'for...of vs for...in', 'tier1', M12),
    item('b1-break-continue', 'break / continue', 'tier1', M12),
    nest('b1-break-continue', 'b1-labels', 'Labels', 'tier1', M12),
    item('b1-nested-control-flow', 'Nested Control Flow', 'tier1', M12),
  ]),

  section('B1.7', 'Strings', 7, [
    item('b1-string-creation', 'String Creation & Immutability', 'tier1', M12),
    nest('b1-string-creation', 'b1-string-indexing', 'Indexing and Length', 'tier1', M12),
    item('b1-string-methods', 'Core String Methods', 'tier1', M12),
    nest('b1-string-methods', 'b1-string-search', 'Searching Strings', 'tier1', M12),
    nest('b1-string-methods', 'b1-string-extract', 'Extracting / Slicing', 'tier1', M12),
    nest('b1-string-methods', 'b1-string-replace', 'Replacing / Splitting / Trimming', 'tier1', M12),
    item('b1-template-literals', 'Template Literals', 'tier1', M12),
    nest('b1-template-literals', 'b1-string-interpolation', 'Interpolation', 'tier1', M12),
    nest('b1-template-literals', 'b1-multiline-strings', 'Multiline Strings', 'tier1', M12),
    nest('b1-template-literals', 'b1-escape-sequences', 'Escape Sequences', 'tier1', M12),
    item('b1-tagged-templates', 'Tagged Template Literals', 'tier2', M34),
    item('b1-unicode-strings', 'Unicode / UTF-16 Basics', 'tier2', M34),
  ]),

  section('B1.8', 'Numbers & Math', 8, [
    item('b1-number-representation', 'Number Representation', 'tier1', M12),
    nest('b1-number-representation', 'b1-floating-point', 'Floating-Point and 0.1 + 0.2', 'tier1', M12),
    nest('b1-number-representation', 'b1-safe-integers', 'Safe Integers', 'tier1', M12),
    item('b1-number-methods', 'Number Methods & Parsing', 'tier1', M12),
    item('b1-math', 'Math', 'tier1', M12),
    nest('b1-math', 'b1-rounding', 'Rounding', 'tier1', M12),
    nest('b1-math', 'b1-random', 'Random Numbers', 'tier1', M12),
    item('b1-bigint', 'BigInt', 'tier2', M34),
  ]),

  section('B1.9', 'Functions', 9, [
    item('b1-function-declaration', 'Function Declaration', 'tier1', M12),
    item('b1-function-expression', 'Function Expression', 'tier1', M12),
    nest('b1-function-expression', 'b1-named-function-expression', 'Named Function Expression', 'tier1', M12),
    nest('b1-function-expression', 'b1-anonymous-function', 'Anonymous Function', 'tier1', M12),
    item('b1-arrow-functions', 'Arrow Functions', 'tier1', M12),
    nest('b1-arrow-functions', 'b1-lexical-this', 'Lexical this', 'tier1', M12),
    item('b1-parameters', 'Parameters, Defaults, Rest, arguments', 'tier1', M12),
    item('b1-first-class-functions', 'First-Class / Higher-Order Functions', 'tier1', M12),
    nest('b1-first-class-functions', 'b1-callbacks-sync', 'Callbacks', 'tier1', M12),
    item('b1-pure-functions', 'Pure vs Impure Functions', 'tier1', M12),
    nest('b1-pure-functions', 'b1-side-effects', 'Side Effects', 'tier1', M12),
    item('b1-iife', 'IIFE', 'tier1', M12),
    item('b1-function-hoisting', 'Function Hoisting vs Expression', 'tier1', M12),
    item('b1-recursion-js', 'Recursion', 'tier1', M12),
    item('b1-currying', 'Currying & Partial Application', 'tier2', M34),
    nest('b1-currying', 'b1-compose-pipe', 'compose / pipe', 'tier2', M34),
    item('b1-memoization', 'Memoization', 'tier2', M34),
  ]),

  section('B1.10', 'Scope & Lexical Environments', 10, [
    item('b1-scope', 'Scope', 'tier1', M12),
    nest('b1-scope', 'b1-module-scope', 'Module Scope', 'tier1', M12),
    item('b1-lexical-scope', 'Lexical Scope', 'tier1', M12),
    nest('b1-lexical-scope', 'b1-scope-chain', 'Scope Chain', 'tier1', M12),
    nest('b1-lexical-scope', 'b1-lexical-environment', 'Lexical Environment', 'tier1', M12),
    nest('b1-lexical-scope', 'b1-shadowing', 'Shadowing', 'tier1', M12),
    item('b1-name-resolution', 'Variable Resolution', 'tier1', M12),
  ]),

  section('B1.11', 'Hoisting & Temporal Dead Zone', 11, [
    item('b1-hoisting', 'Hoisting', 'tier1', M12),
    nest('b1-hoisting', 'b1-creation-vs-execution', 'Creation vs Execution Phase', 'tier1', M12),
    nest('b1-hoisting', 'b1-var-hoisting', 'var Hoisting', 'tier1', M12),
    nest('b1-hoisting', 'b1-let-const-hoisting', 'let/const Hoisting', 'tier1', M12),
    nest('b1-hoisting', 'b1-class-hoisting', 'Class Hoisting', 'tier1', M12),
    item('b1-hoisting-puzzles', 'Hoisting Interview Puzzles', 'tier1', M12),
  ]),

  section('B1.12', 'Closures', 12, [
    item('b1-closures', 'Closures', 'tier1', M12),
    nest('b1-closures', 'b1-closure-lifecycle', 'Closure Lifecycle', 'tier1', M12),
    nest('b1-closures', 'b1-private-state', 'Private State / Function Factories', 'tier1', M12),
    item('b1-closures-in-loops', 'Loops + Closures', 'tier1', M12),
    nest('b1-closures-in-loops', 'b1-var-loop-problem', 'var Loop Problem', 'tier1', M12),
    item('b1-stale-closures', 'Stale Closures', 'tier1', M12, { tags: ['javascript', 'react'] }),
    nest('b1-stale-closures', 'b1-closures-react', 'Closures in React', 'tier1', M12, { tags: ['javascript', 'react'] }),
    item('b1-closure-memory', 'Closure Memory Implications', 'tier1', M12),
    item('b1-closure-puzzles', 'Closure Interview Puzzles', 'tier1', M12),
  ]),

  section('B1.13', 'Objects', 13, [
    item('b1-object-literals', 'Object Literals', 'tier1', M12),
    nest('b1-object-literals', 'b1-dot-vs-bracket', 'Dot vs Bracket Notation', 'tier1', M12),
    nest('b1-object-literals', 'b1-computed-properties', 'Computed Property Names', 'tier1', M12),
    nest('b1-object-literals', 'b1-property-shorthand', 'Property / Method Shorthand', 'tier1', M12),
    item('b1-object-apis', 'Object APIs', 'tier1', M12),
    nest('b1-object-apis', 'b1-object-keys-values', 'keys / values / entries / fromEntries', 'tier1', M12),
    nest('b1-object-apis', 'b1-object-assign-create', 'Object.assign / Object.create', 'tier1', M12),
    nest('b1-object-apis', 'b1-object-freeze-seal', 'freeze / seal / preventExtensions', 'tier1', M12),
    nest('b1-object-apis', 'b1-object-hasown', 'hasOwn / ownership', 'tier1', M12),
    item('b1-copying-objects', 'Shallow vs Deep Copy', 'tier1', M12),
    nest('b1-copying-objects', 'b1-structured-clone', 'structuredClone', 'tier1', M12),
    nest('b1-copying-objects', 'b1-json-clone-limits', 'Why JSON Cloning Is Problematic', 'tier1', M12),
  ]),

  section('B1.14', 'Object Property Model', 14, [
    item('b1-own-vs-inherited', 'Own vs Inherited Properties', 'tier1', M12),
    nest('b1-own-vs-inherited', 'b1-enumerable-properties', 'Enumerable Properties', 'tier1', M12),
    item('b1-property-descriptors', 'Property Descriptors', 'tier2', M34),
    nest('b1-property-descriptors', 'b1-define-property', 'Object.defineProperty', 'tier2', M34),
    nest('b1-property-descriptors', 'b1-writable-enumerable-configurable', 'writable / enumerable / configurable', 'tier2', M34),
    item('b1-getters-setters', 'Getters & Setters', 'tier2', M34),
  ]),

  section('B1.15', 'this, call, apply, bind', 15, [
    item('b1-this', 'this', 'tier1', M12),
    nest('b1-this', 'b1-this-default', 'Default / Global Binding', 'tier1', M12),
    nest('b1-this', 'b1-this-implicit', 'Implicit Binding', 'tier1', M12),
    nest('b1-this', 'b1-this-explicit', 'Explicit Binding', 'tier1', M12),
    nest('b1-this', 'b1-this-new', 'new Binding', 'tier1', M12),
    nest('b1-this', 'b1-this-arrow', 'Arrow-Function Lexical Binding', 'tier1', M12),
    nest('b1-this', 'b1-this-lost', 'Losing this in Callbacks', 'tier1', M12),
    item('b1-call', 'call, apply, bind', 'tier1', M12),
    nest('b1-call', 'b1-apply', 'apply', 'tier1', M12),
    nest('b1-call', 'b1-bind', 'bind', 'tier1', M12),
    nest('b1-call', 'b1-function-borrowing', 'Function Borrowing', 'tier1', M12),
  ]),

  section('B1.16', 'Prototypes & Prototype Chain', 16, [
    item('b1-prototypes', 'Prototypes', 'tier1', M12),
    nest('b1-prototypes', 'b1-internal-prototype', '[[Prototype]] / getPrototypeOf', 'tier1', M12),
    item('b1-prototype-chain', 'Prototype Chain', 'tier1', M12),
    nest('b1-prototype-chain', 'b1-property-lookup', 'Property Lookup & Shadowing', 'tier1', M12),
    item('b1-constructor-functions', 'Constructor Functions', 'tier1', M12),
    nest('b1-constructor-functions', 'b1-new-operator', 'What new Actually Does', 'tier1', M12),
    nest('b1-constructor-functions', 'b1-constructor-property', 'constructor Property', 'tier1', M12),
    item('b1-object-create', 'Object.create', 'tier1', M12),
    item('b1-prototype-pollution', 'Prototype Pollution (Concept)', 'tier1', M12, { tags: ['javascript', 'security'] }),
  ]),

  section('B1.17', 'Classes & OOP', 17, [
    item('b1-classes', 'Classes', 'tier1', M12),
    nest('b1-classes', 'b1-class-constructor', 'constructor', 'tier1', M12),
    nest('b1-classes', 'b1-instance-static', 'Instance vs Static Methods', 'tier1', M12),
    nest('b1-classes', 'b1-public-private-fields', 'Public / Private Fields', 'tier1', M12),
    item('b1-class-inheritance', 'extends / super / Inheritance', 'tier1', M12),
    nest('b1-class-inheritance', 'b1-method-overriding', 'Method Overriding', 'tier1', M12),
    item('b1-js-oop-principles', 'Encapsulation, Polymorphism, Composition', 'tier1', M12),
    item('b1-classes-vs-factories', 'Classes vs Factories vs Constructors', 'tier1', M12),
  ]),

  section('B1.18', 'Arrays', 18, [
    item('b1-array-basics', 'Array Creation, Indexing, Length', 'tier1', M12),
    nest('b1-array-basics', 'b1-sparse-arrays', 'Sparse Arrays', 'tier1', M12),
    item('b1-array-mutation', 'Mutating vs Non-Mutating Methods', 'tier1', M12),
    nest('b1-array-mutation', 'b1-push-pop-shift', 'push / pop / shift / unshift', 'tier1', M12),
    nest('b1-array-mutation', 'b1-slice-splice', 'slice vs splice', 'tier1', M12),
    item('b1-array-search', 'Searching Arrays', 'tier1', M12),
    nest('b1-array-search', 'b1-includes-indexof', 'includes / indexOf / find', 'tier1', M12),
    nest('b1-array-search', 'b1-some-every', 'some / every', 'tier1', M12),
    item('b1-array-map-filter-reduce', 'map / filter / reduce', 'tier1', M12),
    nest('b1-array-map-filter-reduce', 'b1-foreach', 'forEach', 'tier1', M12),
    nest('b1-array-map-filter-reduce', 'b1-flat-flatmap', 'flat / flatMap', 'tier1', M12),
    item('b1-array-sort', 'sort and JavaScript Sorting Gotchas', 'tier1', M12),
    item('b1-array-from-isarray', 'Array.from / Array.isArray', 'tier1', M12),
    item('b1-copying-arrays', 'Copying Arrays', 'tier2', M34),
  ]),

  section('B1.19', 'Maps, Sets & Weak Collections', 19, [
    item('b1-set', 'Set', 'tier1', M12),
    nest('b1-set', 'b1-set-vs-array', 'Set vs Array', 'tier1', M12),
    item('b1-map', 'Map', 'tier1', M12),
    nest('b1-map', 'b1-map-vs-object', 'Map vs Object', 'tier1', M12),
    item('b1-weakmap', 'WeakMap', 'tier2', M34),
    item('b1-weakset', 'WeakSet', 'tier2', M34),
    nest('b1-weakmap', 'b1-weak-references', 'Weak References & GC', 'tier2', M34),
  ]),

  section('B1.20', 'Destructuring, Spread & Modern Syntax', 20, [
    item('b1-destructuring', 'Destructuring', 'tier1', M12),
    nest('b1-destructuring', 'b1-destructure-defaults', 'Defaults / Renaming / Nested', 'tier1', M12),
    item('b1-spread-rest', 'Spread/Rest', 'tier1', M12),
  ]),

  section('B1.21', 'Iterables, Iterators & Generators', 21, [
    item('b1-iterators', 'Iterators/Generators', 'tier2', M34),
    nest('b1-iterators', 'b1-iterable-protocol', 'Iterable / Iterator Protocol', 'tier2', M34),
    nest('b1-iterators', 'b1-symbol-iterator', 'Symbol.iterator', 'tier2', M34),
    nest('b1-iterators', 'b1-generators', 'Generators', 'tier2', M34),
    nest('b1-iterators', 'b1-yield', 'yield / yield*', 'tier2', M34),
    nest('b1-iterators', 'b1-async-iterators', 'Async Iterators / for await...of', 'tier2', M34),
  ]),

  section('B1.22', 'Symbols', 22, [
    item('b1-symbols', 'Symbols', 'tier2', M34),
    nest('b1-symbols', 'b1-symbol-for', 'Symbol.for / keyFor', 'tier2', M34),
    nest('b1-symbols', 'b1-well-known-symbols', 'Well-known Symbols', 'tier2', M34),
  ]),

  section('B1.23', 'Execution Context', 23, [
    item('b1-execution-contexts', 'Execution Contexts', 'tier1', M12, { tags: ['javascript', 'runtime'] }),
    nest('b1-execution-contexts', 'b1-global-execution-context', 'Global Execution Context', 'tier1', M12, { tags: ['javascript', 'runtime'] }),
    nest('b1-execution-contexts', 'b1-function-execution-context', 'Function Execution Context', 'tier1', M12, { tags: ['javascript', 'runtime'] }),
    nest('b1-execution-contexts', 'b1-variable-environment', 'Variable / Lexical Environment', 'tier1', M12, { tags: ['javascript', 'runtime'] }),
  ]),

  section('B1.24', 'Call Stack', 24, [
    item('b1-call-stack', 'Call Stack', 'tier1', M12, { tags: ['javascript', 'runtime'] }),
    nest('b1-call-stack', 'b1-stack-frames', 'Stack Frames', 'tier1', M12, { tags: ['javascript', 'runtime'] }),
    nest('b1-call-stack', 'b1-stack-overflow', 'Stack Overflow', 'tier1', M12, { tags: ['javascript', 'runtime'] }),
    nest('b1-call-stack', 'b1-stack-traces', 'Reading Stack Traces', 'tier1', M12, { tags: ['javascript', 'runtime'] }),
  ]),

  section('B1.25', 'JavaScript Runtime & Engine', 25, [
    item('b1-js-engine', 'JavaScript Engine', 'tier1', M12, { tags: ['javascript', 'runtime'] }),
    nest('b1-js-engine', 'b1-engine-vs-host', 'Engine vs Host Environment', 'tier1', M12, { tags: ['javascript', 'runtime'] }),
    nest('b1-js-engine', 'b1-heap', 'Heap', 'tier1', M12, { tags: ['javascript', 'runtime'] }),
    item('b1-parsing-jit', 'Parsing, AST, Interpreter, JIT', 'tier2', M45, { tags: ['javascript', 'runtime'] }),
    nest('b1-parsing-jit', 'b1-v8-architecture', 'V8 Architecture Conceptually', 'tier2', M45, { tags: ['javascript', 'runtime'] }),
    nest('b1-parsing-jit', 'b1-hidden-classes', 'Hidden Classes / Inline Caching', 'tier2', M45, { tags: ['javascript', 'runtime'] }),
  ]),

  section('B1.26', 'Event Loop', 26, [
    item('b1-event-loop', 'JavaScript Event Loop', 'tier1', M12, {
      tags: ['javascript', 'async', 'runtime', 'promises'],
      prereqs: ['b1-call-stack', 'b1-execution-contexts'],
      related: ['b1-microtasks', 'b1-macrotasks', 'b1-promises'],
      contentReady: true,
      depth: 'deep',
    }),
    nest('b1-event-loop', 'b1-run-to-completion', 'Run-to-Completion', 'tier1', M12, { tags: ['javascript', 'async'] }),
    item('b1-microtasks', 'Microtasks vs Macrotasks', 'tier1', M12, { tags: ['javascript', 'async'], prereqs: ['b1-event-loop'] }),
    nest('b1-microtasks', 'b1-macrotasks', 'Macrotasks', 'tier1', M12, { tags: ['javascript', 'async'], prereqs: ['b1-event-loop'] }),
    nest('b1-microtasks', 'b1-queue-microtask', 'queueMicrotask', 'tier1', M12, { tags: ['javascript', 'async'] }),
    nest('b1-microtasks', 'b1-microtask-starvation', 'Microtask Starvation', 'tier1', M12, { tags: ['javascript', 'async'] }),
    item('b1-event-loop-puzzles', 'Event-Loop Interview Puzzles', 'tier1', M12, { tags: ['javascript', 'async'] }),
  ]),

  section('B1.27', 'Timers & Scheduling', 27, [
    item('b1-settimeout', 'setTimeout / clearTimeout', 'tier1', M12, { tags: ['javascript', 'async'] }),
    item('b1-setinterval', 'setInterval / clearInterval', 'tier1', M12, { tags: ['javascript', 'async'] }),
    nest('b1-settimeout', 'b1-minimum-delay', 'Minimum-Delay Misconception', 'tier1', M12, { tags: ['javascript', 'async'] }),
    item('b1-requestanimationframe-js', 'requestAnimationFrame (Language View)', 'tier2', M34, { tags: ['javascript', 'async'], related: ['b3-raf'] }),
  ]),

  section('B1.28', 'Callbacks', 28, [
    item('b1-callback-concept', 'Callback Concept', 'tier1', M12, { tags: ['javascript', 'async'] }),
    nest('b1-callback-concept', 'b1-sync-vs-async-callbacks', 'Sync vs Async Callbacks', 'tier1', M12, { tags: ['javascript', 'async'] }),
    nest('b1-callback-concept', 'b1-error-first-callbacks', 'Error-First Callback Pattern', 'tier1', M12, { tags: ['javascript', 'async'] }),
    item('b1-callback-hell', 'Callback Hell & Inversion of Control', 'tier1', M12, { tags: ['javascript', 'async'] }),
  ]),

  section('B1.29', 'Promises', 29, [
    item('b1-promises', 'Promises', 'tier1', M12, { tags: ['javascript', 'async'], related: ['b1-event-loop'] }),
    nest('b1-promises', 'b1-promise-states', 'Pending / Fulfilled / Rejected', 'tier1', M12, { tags: ['javascript', 'async'] }),
    nest('b1-promises', 'b1-then-catch-finally', '.then / .catch / .finally', 'tier1', M12, { tags: ['javascript', 'async'] }),
    nest('b1-promises', 'b1-promise-chaining', 'Promise Chaining', 'tier1', M12, { tags: ['javascript', 'async'] }),
    item('b1-error-propagation', 'Error Propagation', 'tier1', M12, { tags: ['javascript', 'async'] }),
    item('b1-promise-combinators', 'Promise Combinators', 'tier1', M34, { tags: ['javascript', 'async'] }),
    nest('b1-promise-combinators', 'b1-promise-all', 'Promise.all', 'tier1', M34, { tags: ['javascript', 'async'] }),
    nest('b1-promise-combinators', 'b1-promise-allsettled', 'Promise.allSettled', 'tier1', M34, { tags: ['javascript', 'async'] }),
    nest('b1-promise-combinators', 'b1-promise-race', 'Promise.race', 'tier1', M34, { tags: ['javascript', 'async'] }),
    nest('b1-promise-combinators', 'b1-promise-any', 'Promise.any', 'tier1', M34, { tags: ['javascript', 'async'] }),
    item('b1-sequential-vs-parallel', 'Sequential vs Parallel Async Work', 'tier1', M12, { tags: ['javascript', 'async'] }),
  ]),

  section('B1.30', 'Async/Await', 30, [
    item('b1-async-await', 'async/await', 'tier1', M12, { tags: ['javascript', 'async'], prereqs: ['b1-promises'] }),
    nest('b1-async-await', 'b1-await-try-catch', 'try/catch with await', 'tier1', M12, { tags: ['javascript', 'async'] }),
    nest('b1-async-await', 'b1-await-does-not-block', 'Why await Does Not Block the Runtime', 'tier1', M12, { tags: ['javascript', 'async'] }),
    item('b1-async-control-flow', 'Async Control Flow', 'tier1', M12, { tags: ['javascript', 'async'] }),
  ]),

  section('B1.31', 'Async Cancellation & Coordination', 31, [
    item('b1-abort-controller-js', 'AbortController / AbortSignal (Language)', 'tier2', M34, { tags: ['javascript', 'async'], related: ['b3-fetch'] }),
    item('b1-stale-requests', 'Race Conditions & Stale Requests', 'tier2', M34, { tags: ['javascript', 'async'] }),
    nest('b1-stale-requests', 'b1-timeouts-retries', 'Timeouts / Retries / Deduplication', 'tier2', M34, { tags: ['javascript', 'async'] }),
    item('b1-concurrency-limiting', 'Concurrency Limiting', 'tier2', M34, { tags: ['javascript', 'async'] }),
  ]),

  section('B1.32', 'Error Handling', 32, [
    item('b1-error-types', 'Error Types', 'tier1', M12),
    nest('b1-error-types', 'b1-typeerror', 'TypeError / ReferenceError / RangeError', 'tier1', M12),
    item('b1-throw-try-catch', 'throw / try / catch / finally', 'tier1', M12),
    item('b1-custom-errors', 'Custom Errors', 'tier1', M12),
    item('b1-unhandled-rejection', 'Unhandled Promise Rejection', 'tier1', M12, { tags: ['javascript', 'async'] }),
  ]),

  section('B1.33', 'Debugging', 33, [
    item('b1-devtools', 'Browser DevTools', 'tier1', M12),
    nest('b1-devtools', 'b1-breakpoints', 'Breakpoints & Stepping', 'tier1', M12),
    nest('b1-devtools', 'b1-watch-scope', 'Watch / Scope / Call Stack', 'tier1', M12),
    item('b1-async-debugging', 'Async Debugging', 'tier1', M12, { tags: ['javascript', 'async'] }),
    item('b1-source-maps', 'Source Maps Conceptually', 'tier1', M12),
    item('b1-profiling-basics', 'Performance & Memory Profiling Basics', 'tier1', M12),
  ]),

  section('B1.34', 'Modules', 34, [
    item('b1-modules', 'Modules', 'tier1', M12),
    nest('b1-modules', 'b1-export-import', 'export / import', 'tier1', M12),
    nest('b1-modules', 'b1-default-named-exports', 'Default vs Named Exports', 'tier1', M12),
    nest('b1-modules', 'b1-dynamic-import', 'Dynamic import()', 'tier1', M12),
    item('b1-esm-vs-cjs', 'ESM vs CommonJS', 'tier1', M12),
    nest('b1-esm-vs-cjs', 'b1-live-bindings', 'Live Bindings', 'tier1', M12),
    nest('b1-esm-vs-cjs', 'b1-circular-deps', 'Circular Dependencies', 'tier1', M12),
    nest('b1-esm-vs-cjs', 'b1-top-level-await', 'Top-level await', 'tier1', M12),
    nest('b1-esm-vs-cjs', 'b1-tree-shaking', 'Tree Shaking Conceptually', 'tier1', M12),
    item('b1-module-pattern', 'IIFE / Module Pattern (Historical)', 'tier2', M34),
  ]),

  section('B1.35', 'JSON & Serialization', 35, [
    item('b1-json', 'JSON vs JavaScript Objects', 'tier1', M12),
    nest('b1-json', 'b1-json-stringify-parse', 'JSON.stringify / parse', 'tier1', M12),
    nest('b1-json', 'b1-json-unsupported', 'Unsupported Values & Circular Refs', 'tier1', M12),
    item('b1-json-replacer-reviver', 'replacer / reviver / toJSON', 'tier2', M34),
  ]),

  section('B1.36', 'Dates & Time', 36, [
    item('b1-date-basics', 'Date Basics', 'tier1', M12),
    nest('b1-date-basics', 'b1-unix-timestamps', 'Unix Timestamps', 'tier1', M12),
    nest('b1-date-basics', 'b1-local-vs-utc', 'Local Time vs UTC', 'tier1', M12),
    item('b1-date-pitfalls', 'Date Arithmetic Pitfalls', 'tier2', M34),
    item('b1-intl-datetime', 'Intl.DateTimeFormat', 'tier2', M34),
    item('b1-temporal-api', 'Temporal API Direction', 'tier3', M910),
  ]),

  section('B1.37', 'Regular Expressions', 37, [
    item('b1-regex-basics', 'Regex Literals & Constructor', 'tier2', M34),
    nest('b1-regex-basics', 'b1-regex-classes-quantifiers', 'Classes, Quantifiers, Anchors, Flags', 'tier2', M34),
    item('b1-regex-methods', 'test / exec / match / replace', 'tier2', M34),
    item('b1-regex-groups', 'Groups & Lookaround Basics', 'tier2', M34),
  ]),

  section('B1.38', 'Functional JavaScript', 38, [
    item('b1-functional-style', 'Declarative vs Imperative Style', 'tier1', M12),
    nest('b1-functional-style', 'b1-immutability-fp', 'Immutability', 'tier1', M12),
    item('b1-referential-transparency', 'Referential Transparency Concept', 'tier2', M34),
  ]),

  section('B1.39', 'Memory Management & Garbage Collection', 39, [
    item('b1-memory-management', 'Memory Management', 'tier1', M34),
    nest('b1-memory-management', 'b1-reachability', 'Reachability & Roots', 'tier1', M34),
    item('b1-garbage-collection', 'Garbage Collection', 'tier1', M34),
    nest('b1-garbage-collection', 'b1-mark-and-sweep', 'Mark-and-Sweep / Generational GC', 'tier2', M45),
    item('b1-memory-leaks', 'Common Memory Leaks', 'tier1', M34),
    nest('b1-memory-leaks', 'b1-heap-snapshots', 'Heap Snapshots', 'tier2', M45),
  ]),

  section('B1.40', 'Performance Patterns', 40, [
    item('b1-debounce', 'Debouncing', 'tier1', M12),
    item('b1-throttle', 'Throttling', 'tier1', M12),
    nest('b1-debounce', 'b1-debounce-vs-throttle', 'Debounce vs Throttle', 'tier1', M12),
    item('b1-long-tasks', 'Long Tasks / Main-Thread Blocking', 'tier2', M34),
  ]),

  section('B1.41', 'Proxy & Reflect', 41, [
    item('b1-proxy', 'Proxy/Reflect', 'tier2', M45),
    nest('b1-proxy', 'b1-reflect', 'Reflect', 'tier2', M45),
    nest('b1-proxy', 'b1-proxy-traps', 'Traps (get/set/has/deleteProperty)', 'tier2', M45),
    nest('b1-proxy', 'b1-reactivity-concept', 'Validation / Reactivity Concepts', 'tier2', M45),
  ]),

  section('B1.42', 'Binary Data', 42, [
    item('b1-arraybuffer', 'ArrayBuffer / TypedArray / DataView', 'tier3', M910),
    item('b1-blob-file-js', 'Blob / File / FileReader (Language)', 'tier3', M910, { related: ['b3-blob-file'] }),
  ]),

  section('B1.43', 'JavaScript Implementation Exercises', 43, [
    item('b1-impl-map-filter-reduce', 'Implement map / filter / reduce / forEach', 'tier1', M34),
    item('b1-impl-call-apply-bind', 'Implement call / apply / bind', 'tier1', M34),
    item('b1-impl-promise-combinators', 'Implement Promise.all / allSettled / race', 'tier1', M34),
    item('b1-impl-debounce-throttle', 'Implement debounce / throttle / memoize', 'tier1', M34),
    item('b1-impl-curry-compose', 'Implement curry / compose / pipe', 'tier1', M34),
    item('b1-impl-deep-clone', 'Implement deep clone / flatten / deep equality', 'tier1', M34),
    item('b1-impl-get-path', 'Implement get(object, path)', 'tier1', M34),
    item('b1-impl-event-emitter', 'Implement EventEmitter', 'tier1', M34),
    item('b1-impl-retry-sleep', 'Implement retry / sleep / concurrency limiter', 'tier1', M34),
    item('b1-impl-promise', 'Implement a Promise', 'tier2', M45),
    item('b1-impl-lru', 'Implement LRU Cache in JavaScript', 'tier2', M45),
  ]),
]
