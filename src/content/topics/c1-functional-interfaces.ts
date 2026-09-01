import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'A functional interface has exactly one abstract method (SAM), making it eligible for lambda expressions and method references. java.util.function provides standard FIs: Predicate, Function, Consumer, Supplier, and primitive specializations.',
  whyExists:
    'Java needed a type target for lambdas without adding new language types. Functional interfaces mark intent (@FunctionalInterface), enable compiler checks, and standardize common patterns (test, apply, accept, get) across the JDK and libraries.',
  mentalModel:
    'One method contract = one lambda shape. Predicate<T> is T -> boolean; Function<T,R> is T -> R. Default and static methods on interface do not count toward SAM count.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Declare @FunctionalInterface for compile-time SAM validation.',
        'Single abstract method defines lambda parameter and return types.',
        'Default/static methods allowed — still functional if one abstract.',
        'Primitive variants avoid boxing: IntPredicate, ToIntFunction, etc.',
        'Common composition: predicate.and(other), function.andThen(after).',
      ],
    },
    {
      type: 'table',
      headers: ['Interface', 'Method', 'Signature'],
      rows: [
        ['Predicate<T>', 'test', 'T -> boolean'],
        ['Function<T,R>', 'apply', 'T -> R'],
        ['Consumer<T>', 'accept', 'T -> void'],
        ['Supplier<T>', 'get', '() -> T'],
        ['BiFunction<T,U,R>', 'apply', '(T,U) -> R'],
        ['UnaryOperator<T>', 'apply', 'T -> T'],
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Standard functional interfaces',
      code: `Predicate<String> isLong = s -> s.length() > 10;
Function<String, Integer> length = String::length;
Consumer<String> print = System.out::println;
Supplier<Instant> now = Instant::now;

List<String> filtered = names.stream()
    .filter(isLong)
    .toList();

Integer len = length.apply("hello"); // 5`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Custom SAM + method reference',
      code: `@FunctionalInterface
interface EventHandler {
  void onEvent(String eventId);

  default void onEventQuiet(String id) {
    try { onEvent(id); } catch (Exception ignored) {}
  }
}

EventHandler logHandler = System.out::println;`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        '@FunctionalInterface is optional but triggers compiler error if not SAM.',
        'Object methods (equals, hashCode, toString) do not count as abstract.',
        'LambdaMetafactory links SAM to lambda body at bootstrap.',
        'Generic specialization: Function<String, Integer> vs raw Function — erasure applies.',
        'Custom FIs preferred over generic Function for domain clarity in public APIs.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Standard vocabulary across JDK (Stream, Optional)',
      'Composable default methods on Predicate, Function',
      'Primitive specializations reduce allocation',
      'Clear lambda target types',
    ],
    disadvantages: [
      'Checked exceptions not in SAM signature — must wrap',
      'Too many similar FIs confuse beginners',
      'Long generic signatures reduce readability',
    ],
    alternatives: [
      'Abstract class with single abstract method — not lambda-compatible unless FI',
      'Plain interface with multiple methods — not lambda target',
    ],
    whenToUse: [
      'API accepting callbacks (filter, map, retry predicate)',
      'Dependency injection of behavior',
      'Stream pipeline operations',
    ],
    whenNotToUse: [
      'Multiple related methods needed — regular interface or class',
      'When named class documents complex stateful handler better',
    ],
  },
  failureModes: [
    'Two abstract methods — not functional; lambda assignment fails.',
    'Using raw Consumer causes unchecked warnings and type unsafety.',
    'Predicate throwing checked exception without try/catch wrap — compile error.',
    'Method reference to overloaded method — ambiguous target type needed.',
    'Composing predicates without short-circuit awareness (and/or do short-circuit).',
  ],
  interview: {
    expectations: [
      'Define functional interface and SAM rule',
      'List java.util.function core types',
      'Default methods do not break SAM',
    ],
    commonQuestions: [
      'What is a functional interface?',
      'Name four built-in functional interfaces.',
      'Can functional interface have default methods?',
      'Difference Predicate vs Function?',
    ],
    followUps: [
      'What is @FunctionalInterface annotation for?',
      'Primitive functional interfaces why?',
    ],
    misconceptions: [
      'Must annotate all lambdas with @FunctionalInterface (annotation on interface definition only)',
      'Runnable is not functional (it has run() — it IS functional, one abstract method)',
    ],
    traps: ['Interface with two abstract methods + defaults still not functional'],
    strongSignals: [
      'SAM rule with Object method exclusion',
      'andThen/compose composition',
      'Domain-specific FI vs generic Function trade-off',
    ],
  },
  keyTakeaways: [
    'Exactly one abstract method — lambda target.',
    '@FunctionalInterface enforces SAM at compile time.',
    'Predicate, Function, Consumer, Supplier — core quartet.',
    'Primitive FIs avoid autoboxing.',
    'Default/static methods OK on functional interfaces.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What makes an interface functional?',
      answerHint: 'Exactly one abstract method; default/static/object methods excluded from count.',
    },
    {
      level: 'intermediate',
      question: 'Difference between Consumer and Function?',
      answerHint: 'Consumer takes T returns void; Function takes T returns R.',
    },
    {
      level: 'advanced',
      question: 'Why IntPredicate instead of Predicate<Integer>?',
      answerHint: 'Avoids boxing/unboxing overhead in tight numeric loops and streams.',
    },
  ],
  flashcards: [
    { front: 'SAM', back: 'Single Abstract Method — enables lambda assignment' },
    { front: 'Predicate', back: 'T -> boolean via test(T)' },
    { front: '@FunctionalInterface', back: 'Optional; compiler error if not exactly one abstract method' },
  ],
  quickRevision: [
    'One abstract method only',
    'Predicate Function Consumer Supplier',
    'Primitive variants Int*, Long*',
    'Default methods allowed',
    'Lambda + method ref targets',
    '@FunctionalInterface check',
    'compose andThen chaining',
  ],
}
