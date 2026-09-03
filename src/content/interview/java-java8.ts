import type { ReactInterviewItem } from './types'

export const JAVA_INTERVIEW_JAVA8: ReactInterviewItem[] = [
  {
    id: 'lambda',
    question: 'What is a lambda, really?',
    relatedTopicIds: ['c1-lambdas', 'c1-functional-interfaces'],
    answer: [
      {
        type: 'paragraph',
        text: 'It is an instance of a functional interface: exactly one abstract method. The compiler infers the target type from assignment, a parameter, or a return. Captured locals must be final or effectively final. Prefer method references when the lambda only forwards (`String::length`).',
      },
    ],
  },
  {
    id: 'functional-interface',
    question: 'What is a functional interface?',
    relatedTopicIds: ['c1-functional-interfaces', 'c1-default-methods'],
    answer: [
      {
        type: 'paragraph',
        text: 'One abstract method; default and static methods do not count. `@FunctionalInterface` is optional but documents the intent and fails compilation if a second abstract method appears. Predicate, Function, Consumer, Supplier, and Comparator are the usual ones.',
      },
    ],
  },
  {
    id: 'default-methods',
    question: 'Why were default methods added to interfaces?',
    relatedTopicIds: ['c1-default-methods', 'c1-interfaces'],
    answer: [
      {
        type: 'paragraph',
        text: 'So the JDK could add `List.sort` without breaking every List implementation on earth. Class wins over interface default; two interfaces with the same default force an override in the class. They are not a substitute for abstract classes when you need state.',
      },
    ],
  },
  {
    id: 'streams',
    question: 'How does Stream pipeline evaluation work?',
    relatedTopicIds: ['c1-streams', 'c1-intermediate-terminal', 'c1-collectors'],
    answer: [
      {
        type: 'paragraph',
        text: 'Intermediate ops (`filter`, `map`) are lazy. A terminal op (`collect`, `forEach`, `reduce`) pulls data. Streams are not reusable. Prefer `collect(Collectors.toList())` (or `toList()` on Java 16+) over mutating a list inside `forEach`. Watch boxed primitives — use `IntStream` when the data is ints.',
      },
    ],
  },
  {
    id: 'optional',
    question: 'How should Optional be used?',
    relatedTopicIds: ['c1-optional'],
    answer: [
      {
        type: 'paragraph',
        text: 'As a return type that might be absent. Do not use it for fields, parameters, or `Optional.of(null)` — that throws. `orElseGet` is lazy; `orElse` always evaluates the fallback. It is not a replacement for throwing a domain exception when absence is a bug.',
      },
    ],
  },
  {
    id: 'method-ref',
    question: 'Four kinds of method references?',
    relatedTopicIds: ['c1-method-references', 'c1-lambdas'],
    answer: [
      {
        type: 'list',
        items: [
          'Static: `Integer::parseInt`',
          'Bound instance: `System.out::println`',
          'Unbound instance: `String::toLowerCase` (the stream element is `this`)',
          'Constructor: `ArrayList::new`',
        ],
      },
    ],
  },
]
