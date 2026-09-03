import type { Priority } from '@/domain/types'
import type { SectionSeed, TopicSeed } from './build'

const JAVA = ['java'] as const
const M12 = [1, 2]
const M23 = [2, 3]

function item(
  id: string,
  title: string,
  priority: Priority = 'tier1',
  extra: Partial<TopicSeed> = {},
): TopicSeed {
  const { tags, executionPriority, ...rest } = extra
  const months = priority === 'tier1' ? M12 : M23
  return {
    id,
    title,
    priority,
    months: extra.months ?? months,
    tags: [...JAVA, ...(tags ?? [])],
    executionPriority:
      executionPriority ?? (priority === 'tier1' ? 'p0' : priority === 'tier2' ? 'p1' : 'later'),
    ...rest,
  }
}

function nest(
  parent: string,
  id: string,
  title: string,
  priority: Priority = 'tier1',
  extra: Partial<TopicSeed> = {},
): TopicSeed {
  return item(id, title, priority, {
    ...extra,
    curriculumLevel: 'nested-concept',
    parentTopicId: parent,
  })
}

function section(id: string, title: string, order: number, topics: TopicSeed[]): SectionSeed {
  return {
    id,
    track: 'C',
    title,
    order,
    defaultKind: 'theory',
    defaultDepth: 'deep',
    topics,
  }
}

/**
 * C1.1–C1.16 — Core Java language for interviews.
 * JVM/GC stay in C2, threads/locks in C3, Spring in C5–C6, SQL in C7.
 * Shape follows W3Schools + TutorialsPoint language maps, not copied prose.
 */
export const TRACK_C_JAVA_SECTIONS: SectionSeed[] = [
  section('C1.1', 'Syntax & Types', 1, [
    item('c1-syntax', 'Language Syntax & Compilation'),
    nest('c1-syntax', 'c1-comments', 'Comments'),
    nest('c1-syntax', 'c1-main-method', 'main() & Program Entry'),
    nest('c1-syntax', 'c1-packages', 'Packages'),
    item('c1-types', 'Data Types & Variables'),
    nest('c1-types', 'c1-primitives', 'Primitive Types'),
    nest('c1-types', 'c1-reference-types', 'Reference Types'),
    nest('c1-types', 'c1-type-casting', 'Type Casting'),
    nest('c1-types', 'c1-local-var', 'Local-Variable Type Inference (var)'),
    item('c1-user-input', 'Scanner & User Input', 'tier2'),
  ]),

  section('C1.2', 'Operators & Control Flow', 2, [
    item('c1-operators', 'Operators'),
    nest('c1-operators', 'c1-arithmetic-operators', 'Arithmetic & Assignment'),
    nest('c1-operators', 'c1-relational-logical', 'Relational & Logical'),
    nest('c1-operators', 'c1-bitwise-operators', 'Bitwise Operators'),
    nest('c1-operators', 'c1-operator-precedence', 'Precedence & Associativity'),
    item('c1-control-flow', 'Control Flow'),
    nest('c1-control-flow', 'c1-if-else', 'if / else'),
    nest('c1-control-flow', 'c1-switch', 'switch'),
    nest('c1-control-flow', 'c1-loops', 'for / while / do-while'),
    nest('c1-control-flow', 'c1-break-continue', 'break & continue'),
  ]),

  section('C1.3', 'Arrays & Methods', 3, [
    item('c1-arrays', 'Arrays'),
    nest('c1-arrays', 'c1-multidimensional-arrays', 'Multidimensional Arrays'),
    nest('c1-arrays', 'c1-arrays-vs-arraylist', 'Arrays vs ArrayList'),
    item('c1-methods', 'Methods'),
    nest('c1-methods', 'c1-method-parameters', 'Parameters & Return'),
    nest('c1-methods', 'c1-method-overloading', 'Method Overloading'),
    nest('c1-methods', 'c1-variable-scope', 'Variable Scope'),
    nest('c1-methods', 'c1-recursion-java', 'Recursion'),
    nest('c1-methods', 'c1-varargs', 'varargs'),
  ]),

  section('C1.4', 'Strings & Wrappers', 4, [
    item('c1-strings', 'Strings'),
    nest('c1-strings', 'c1-string-pool', 'String Pool'),
    nest('c1-strings', 'c1-stringbuilder', 'StringBuilder / StringBuffer'),
    nest('c1-strings', 'c1-string-equals', '== vs equals() on Strings'),
    item('c1-wrappers', 'Wrapper Classes'),
    nest('c1-wrappers', 'c1-autoboxing', 'Autoboxing & Unboxing'),
    nest('c1-wrappers', 'c1-integer-cache', 'Integer Cache'),
  ]),

  section('C1.5', 'OOP Foundations', 5, [
    item('c1-oop', 'OOP'),
    nest('c1-oop', 'c1-aggregation', 'Aggregation & Composition'),
    item('c1-encapsulation', 'Encapsulation'),
    item('c1-classes', 'Classes/Interfaces'),
    nest('c1-classes', 'c1-interfaces', 'Interfaces'),
    nest('c1-classes', 'c1-constructors', 'Constructors'),
    nest('c1-classes', 'c1-this-keyword', 'this Keyword'),
    nest('c1-classes', 'c1-access-modifiers', 'Access Modifiers'),
  ]),

  section('C1.6', 'Inheritance & Polymorphism', 6, [
    item('c1-inheritance', 'Inheritance'),
    nest('c1-inheritance', 'c1-super-keyword', 'super Keyword'),
    nest('c1-inheritance', 'c1-object-class', 'java.lang.Object'),
    item('c1-polymorphism', 'Polymorphism'),
    nest('c1-polymorphism', 'c1-overload-vs-override', 'Overloading vs Overriding'),
    nest('c1-polymorphism', 'c1-dynamic-binding', 'Dynamic vs Static Binding'),
    nest('c1-polymorphism', 'c1-static-no-override', 'Why static Methods Are Not Overridden'),
    item('c1-abstract-classes', 'Abstract Classes'),
    nest('c1-abstract-classes', 'c1-abstract-vs-interface', 'Abstract Class vs Interface'),
  ]),

  section('C1.7', 'Records, Enums & Nested Types', 7, [
    item('c1-records', 'Records'),
    item('c1-enums', 'Enums'),
    nest('c1-enums', 'c1-enum-constructor', 'Enum Constructors & Fields'),
    item('c1-inner-classes', 'Inner & Nested Classes'),
    nest('c1-inner-classes', 'c1-anonymous-classes', 'Anonymous Classes'),
    nest('c1-inner-classes', 'c1-static-nested', 'Static Nested Classes'),
  ]),

  section('C1.8', 'Immutability & Object Contract', 8, [
    item('c1-immutability', 'Immutability'),
    nest('c1-immutability', 'c1-defensive-copies', 'Defensive Copies'),
    item('c1-equals', 'equals() / hashCode()'),
    nest('c1-equals', 'c1-hashcode', 'hashCode()', 'tier1', {
      related: ['c1-equals', 'c1-hashmap-internals'],
    }),
    nest('c1-equals', 'c1-comparable-equals', 'equals vs Comparable'),
  ]),

  section('C1.9', 'Exceptions', 9, [
    item('c1-exceptions', 'Exceptions'),
    nest('c1-exceptions', 'c1-checked-unchecked', 'Checked vs Unchecked'),
    nest('c1-exceptions', 'c1-try-catch-finally', 'try / catch / finally'),
    nest('c1-exceptions', 'c1-try-with-resources', 'try-with-resources'),
    nest('c1-exceptions', 'c1-throw-throws', 'throw vs throws'),
    nest('c1-exceptions', 'c1-custom-exceptions', 'Custom Exceptions'),
  ]),

  section('C1.10', 'Generics & Annotations', 10, [
    item('c1-generics', 'Generics'),
    nest('c1-generics', 'c1-wildcards', 'Wildcards & Bounds'),
    nest('c1-generics', 'c1-type-erasure', 'Type Erasure'),
    item('c1-annotations', 'Annotations'),
    nest('c1-annotations', 'c1-builtin-annotations', 'Built-in Annotations'),
  ]),

  section('C1.11', 'Collections Framework', 11, [
    item('c1-list-set-map', 'List / Set / Map', 'tier1', { tags: ['collections'] }),
    nest('c1-list-set-map', 'c1-collection-vs-collections', 'Collection vs Collections', 'tier1', {
      tags: ['collections'],
    }),
    nest('c1-list-set-map', 'c1-fail-fast', 'Fail-Fast vs Fail-Safe', 'tier1', {
      tags: ['collections'],
    }),
    nest('c1-list-set-map', 'c1-iterator', 'Iterator & ListIterator', 'tier1', {
      tags: ['collections'],
    }),
    nest('c1-list-set-map', 'c1-comparable-comparator', 'Comparable & Comparator', 'tier1', {
      tags: ['collections'],
    }),
  ]),

  section('C1.12', 'Lists', 12, [
    item('c1-arraylist', 'ArrayList', 'tier1', {
      tags: ['collections'],
      related: ['a1-arraylist'],
    }),
    nest('c1-arraylist', 'c1-linkedlist', 'LinkedList', 'tier1', { tags: ['collections'] }),
    nest('c1-arraylist', 'c1-vector-vs-arraylist', 'Vector vs ArrayList', 'tier1', {
      tags: ['collections'],
    }),
    nest('c1-arraylist', 'c1-list-sorting', 'List Sorting', 'tier1', { tags: ['collections'] }),
  ]),

  section('C1.13', 'Sets, Maps & Queues', 13, [
    item('c1-hashmap-internals', 'HashMap Internals', 'tier1', {
      tags: ['collections'],
      depth: 'deep',
      related: ['a1-hashmap'],
    }),
    nest('c1-hashmap-internals', 'c1-hash-collision', 'Hash Collisions & Treeify', 'tier1', {
      tags: ['collections'],
    }),
    nest('c1-hashmap-internals', 'c1-hashmap-resize', 'Resize & Transfer', 'tier1', {
      tags: ['collections'],
    }),
    item('c1-hashset', 'HashSet', 'tier1', { tags: ['collections'] }),
    nest('c1-hashset', 'c1-treeset', 'TreeSet', 'tier1', { tags: ['collections'] }),
    nest('c1-hashset', 'c1-linkedhashset', 'LinkedHashSet', 'tier1', { tags: ['collections'] }),
    item('c1-treemap', 'TreeMap', 'tier1', { tags: ['collections'] }),
    item('c1-priorityqueue', 'PriorityQueue', 'tier1', { tags: ['collections'] }),
    item('c1-concurrenthashmap', 'ConcurrentHashMap', 'tier1', {
      tags: ['concurrency'],
      related: ['c3-concurrent-collections'],
    }),
  ]),

  section('C1.14', 'Functional Java', 14, [
    item('c1-lambdas', 'Lambdas'),
    item('c1-functional-interfaces', 'Functional Interfaces'),
    nest('c1-functional-interfaces', 'c1-default-methods', 'Default Methods on Interfaces'),
    item('c1-streams', 'Streams'),
    nest('c1-streams', 'c1-collectors', 'Collectors'),
    nest('c1-streams', 'c1-intermediate-terminal', 'Intermediate vs Terminal Ops'),
    item('c1-optional', 'Optional'),
    item('c1-method-references', 'Method References', 'tier2'),
  ]),

  section('C1.15', 'I/O & Serialization', 15, [
    item('c1-io-files', 'File I/O'),
    nest('c1-io-files', 'c1-byte-char-streams', 'Byte vs Character Streams'),
    nest('c1-io-files', 'c1-buffered-io', 'BufferedReader / BufferedWriter'),
    nest('c1-io-files', 'c1-nio-path', 'NIO Path & Files', 'tier2'),
    item('c1-serialization', 'Serialization'),
    nest('c1-serialization', 'c1-transient', 'transient & Serializable'),
    nest('c1-serialization', 'c1-serialversionuid', 'serialVersionUID'),
  ]),

  section('C1.16', 'Modern Java Language', 16, [
    item('c1-switch-expressions', 'Switch Expressions'),
    item('c1-text-blocks', 'Text Blocks'),
    item('c1-sealed', 'Sealed Classes', 'tier2'),
    item('c1-pattern-matching', 'Pattern Matching', 'tier2'),
    item('c1-modules', 'Module System', 'tier2'),
  ]),
]
