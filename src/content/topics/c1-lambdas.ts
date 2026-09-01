import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Lambda expressions (Java 8+) provide concise syntax for anonymous functional instances: (params) -> expression or (params) -> { statements }. They implement functional interfaces and power Streams, CompletableFuture, and event handlers.',
  whyExists:
    'Anonymous inner classes for single-method callbacks were verbose (10+ lines for one call). Lambdas reduce noise, enable lazy Stream pipelines, and align Java with functional programming patterns without full functional language conversion.',
  mentalModel:
    'A lambda is a short function value assigned to a functional interface reference. Compiler generates invokedynamic + LambdaMetafactory bytecode — not always a new class file per lambda (unlike anonymous classes).',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Target type must be functional interface (one abstract method).',
        'Syntax: (a, b) -> a + b or x -> x * 2 (single param may omit parens).',
        'Type inference: (String s) -> s.length() or explicit types when ambiguous.',
        'Blocks require return for non-void; expression form implicit return.',
        'Capture effectively final locals and this from enclosing instance.',
      ],
    },
    {
      type: 'table',
      headers: ['Form', 'Example'],
      rows: [
        ['No params', '() -> System.out.println("hi")'],
        ['One param', 's -> s.trim()'],
        ['Multiple', '(a, b) -> a.compareTo(b)'],
        ['Block', '(x) -> { log(x); return x * 2; }'],
        ['Method ref', 'String::valueOf or list::add'],
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Lambda with Stream',
      code: `List<String> names = List.of("Ada", "bob", "charlie");

List<String> result = names.stream()
    .filter(n -> n.length() > 3)
    .map(String::toUpperCase)
    .sorted()
    .toList();`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Custom functional interface',
      code: `@FunctionalInterface
interface Validator<T> {
  boolean test(T value);
}

Validator<String> notBlank = s -> s != null && !s.isBlank();

// Equivalent anonymous class (verbose)
Validator<String> v2 = new Validator<String>() {
  public boolean test(String s) { return s != null && !s.isBlank(); }
};`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'invokedynamic bootstrap LambdaMetafactory.metafactory links call site to implementation.',
        'Lambdas capturing no variables may be singleton instances.',
        'Captured variables must be effectively final — compiler error if reassigned.',
        'Serializable lambdas need special handling — not serializable by default.',
        'Performance: after JIT, often comparable to anonymous classes; first calls may allocate.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Concise readable callbacks',
      'Stream API enabler',
      'Deferred execution — pass behavior as data',
      'Method references further reduce boilerplate',
    ],
    disadvantages: [
      'Debugging stack traces can be cryptic',
      'Over-nesting lambdas hurts readability',
      'Cannot use break/continue into outer loop from lambda',
      'Checked exceptions awkward in lambdas',
    ],
    alternatives: [
      'Anonymous inner class when need multiple methods or explicit this',
      'Named private methods — clearer for complex logic',
      'Method references when delegating existing method',
    ],
    whenToUse: [
      'Stream operations, comparators, listeners',
      'Short predicates and mappers',
      'Passing behavior to APIs (forEach, supplyAsync)',
    ],
    whenNotToUse: [
      'Complex multi-step logic — extract named method',
      'Need to mutate outer non-final variable',
      'API requires checked exception propagation without wrap',
    ],
  },
  failureModes: [
    'Variable used in lambda not effectively final — compile error.',
    'Returning wrong type from block lambda — missing return statement.',
    'parallelStream + mutating shared state from lambda — race.',
    'Null lambda assigned where non-null expected — NPE at invoke.',
    'Confusing method reference overload resolution.',
  ],
  interview: {
    expectations: [
      'Lambda syntax and target typing',
      'Effectively final capture rule',
      'Relationship to functional interfaces and method references',
    ],
    commonQuestions: [
      'What is a lambda expression?',
      'Difference lambda vs anonymous inner class?',
      'What is effectively final?',
      'What is method reference?',
    ],
    followUps: [
      'How are lambdas implemented in bytecode?',
      'Can lambda throw checked exceptions?',
    ],
    misconceptions: [
      'Lambda always creates new class file per use (often invokedynamic, not always new class)',
      'Any interface works as target (must be functional — one abstract method)',
    ],
    traps: ['Modifying non-final counter from parallel stream lambda'],
    strongSignals: [
      'invokedynamic / LambdaMetafactory mention',
      'Method reference forms: static, instance, constructor',
      'When to extract method vs inline lambda',
    ],
  },
  keyTakeaways: [
    '(params) -> body implements functional interface.',
    'Target type inferred from context.',
    'Captured vars must be effectively final.',
    'Method references: Class::method, instance::method.',
    'Power Streams, CompletableFuture, event APIs.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What is the syntax of a lambda expression?',
      answerHint: '(parameters) -> expression or block; targets functional interface.',
    },
    {
      level: 'intermediate',
      question: 'What does effectively final mean?',
      answerHint: 'Variable not reassigned after initialization — safe to capture in lambda.',
    },
    {
      level: 'advanced',
      question: 'How does Java implement lambdas at bytecode level?',
      answerHint: 'invokedynamic with LambdaMetafactory; may not generate separate class per lambda.',
    },
  ],
  flashcards: [
    { front: 'Lambda target type', back: 'Must be functional interface (single abstract method)' },
    { front: 'Effectively final', back: 'Local captured by lambda cannot be reassigned' },
    { front: 'Method reference forms', back: 'Static, bound instance, unbound instance, constructor' },
  ],
  quickRevision: [
    '(args) -> expr or block',
    'Functional interface target',
    'Effectively final capture',
    'Method references shorthand',
    'Streams and callbacks',
    'No checked exception without wrap',
    'invokedynamic bytecode',
  ],
}
