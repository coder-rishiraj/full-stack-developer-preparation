import type { TopicContent } from '@/domain/types'

export const genericsContent: TopicContent = {
  whatIsIt:
    'Java generics provide compile-time type parameters on classes, interfaces, and methods (e.g., List<String>), enabling type-safe collections and APIs without casts, with erasure removing type parameters at runtime.',
  whyExists:
    'Pre-generics Java used raw types and casts — ClassCastException at runtime. Generics catch type errors at compile time, document APIs, and enable reusable algorithms (Comparable, Comparator, streams) with type safety.',
  mentalModel:
    'Generics are a compile-time checker; the JVM mostly sees raw types and casts inserted by javac. Wildcards (? extends T, ? super T) express variance when producer/consumer roles differ.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Construct', 'Meaning', 'Example'],
      rows: [
        ['<T>', 'Type parameter', 'class Box<T> { T value; }'],
        ['<T extends Comparable<T>>', 'Bounded type param', 'static <T extends Comparable<T>> T max(T a, T b)'],
        ['? extends T', 'Upper bounded wildcard (producer)', 'List<? extends Number> read numbers'],
        ['? super T', 'Lower bounded wildcard (consumer)', 'List<? super Integer> add integers'],
        ['<?>', 'Unbounded wildcard', 'List<?> unknown element type'],
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'PECS',
      text: 'Producer Extends, Consumer Super — when you only read T, use ? extends T; when you only write T, use ? super T.',
    },
    {
      type: 'paragraph',
      text: 'Type erasure: generic type args are stripped at bytecode; List<String> and List<Integer> share Class List. Runtime cannot test instanceof List<String> — only raw List.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'PECS — copy utility',
      code: `public static <T> void copy(
    List<? extends T> src,
    List<? super T> dest) {
  for (T item : src) dest.add(item);
}`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Type erasure at runtime',
      code: `List<String> a = new ArrayList<>();
List<Integer> b = new ArrayList<>();
System.out.println(a.getClass() == b.getClass()); // true — both ArrayList.class

// Invalid:
// if (obj instanceof List<String>) { } // compile error`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Generic method inference',
      code: `List<String> names = List.of("Ada", "Lin");
names.stream()
    .map(String::length)   // T inferred as String
    .toList();`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Erasure replaces type params with bounds (Object or first bound) and inserts casts at bytecode.',
        'Bridge methods preserve polymorphism when overriding generic methods in subclasses.',
        'Cannot create new T[], new T(), or catch generic exceptions — need Class<T> token for reflection.',
        'Reifiable types at runtime: primitives, non-generic classes, raw types, arrays, unbounded wildcards.',
        'Heap pollution: mixing raw and generic types can cause ClassCastException despite compile checks.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Compile-time safety and clearer APIs',
      'Reusable algorithms without Object casts',
      'IDE autocomplete on typed collections',
    ],
    disadvantages: [
      'Erasure limits runtime type info (no List<String>.class)',
      'Verbose wildcards for API flexibility',
      'Primitive types need wrappers or specialized streams',
    ],
    alternatives: [
      'Raw types (legacy — avoid)',
      'Code generation (Kotlin reified inline)',
      'External validation (JSON schema) at boundaries',
    ],
    whenToUse: [
      'Collections, repositories, DTO mappers, comparators',
      'Public library APIs needing type safety',
    ],
    whenNotToUse: [
      'When runtime type dispatch on parameter is required without Class token',
      'Over-wildcarding simple internal methods',
    ],
  },
  failureModes: [
    'Raw List without generics → heap pollution and ClassCastException later.',
    'List<Object> is not a supertype of List<String> — cannot assign; use wildcards.',
    'Adding to List<? extends Number> — compile error (producer only).',
    'Reading specific type from List<? super Integer> without cast — only Object guaranteed.',
    'new T() or (T) obj unchecked cast hiding bugs.',
  ],
  interview: {
    expectations: [
      'Explain erasure and why instanceof List<String> fails',
      'Apply PECS on copy/read/write APIs',
      'Distinguish bounded type params vs wildcards',
    ],
    commonQuestions: [
      'What is type erasure?',
      'Difference between List<Object> and List<?>?',
      'Explain PECS with example.',
    ],
    followUps: [
      'What are bridge methods?',
      'How to get Class<T> at runtime?',
    ],
    misconceptions: [
      'Generics exist at runtime with full type args',
      'List<String> is a subtype of List<Object>',
      '? extends T and ? super T are interchangeable',
    ],
    traps: ['Suggesting arrays of generic types List<String>[] — illegal'],
    strongSignals: [
      'Uses PECS correctly in API signatures',
      'Explains erasure + bridge methods',
      'Mentions Class<T> for reified patterns',
    ],
  },
  keyTakeaways: [
    'Generics = compile-time checks; erasure at runtime.',
    'PECS: extends to read, super to write.',
    'List<String> is not List<Object> — invariance.',
    'Wildcards for flexible API; type params for implementation.',
    'Avoid raw types; use Class<T> when runtime type needed.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Why were generics added to Java?',
      answerHint: 'Type safety at compile time; eliminate casts and ClassCastException.',
    },
    {
      level: 'intermediate',
      question: 'What is PECS?',
      answerHint: 'Producer Extends, Consumer Super — wildcard direction for read vs write.',
    },
    {
      level: 'advanced',
      question: 'Why can you not do new T() in a generic class?',
      answerHint: 'Erasure — T becomes Object; no constructor info at runtime without Class token.',
    },
  ],
  flashcards: [
    { front: 'Type erasure', back: 'Generic params erased to bounds at bytecode; casts inserted' },
    { front: 'PECS', back: 'Producer Extends; Consumer Super' },
    { front: 'List<String> vs List<Object>', back: 'Not assignable — generics invariant' },
  ],
  quickRevision: [
    'Compile-time safety; erasure at runtime',
    'PECS: ? extends read, ? super write',
    'No List<String>.class',
    'Avoid raw types',
    'Bridge methods for overrides',
    'Class<T> for reified ops',
    'Wildcards for API flexibility',
  ],
}

export const content = genericsContent
