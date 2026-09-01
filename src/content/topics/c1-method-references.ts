import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Method references are shorthand lambda expressions using :: syntax to refer to methods without invoking them—static (ClassName::method), instance on particular object (obj::method), instance on arbitrary object (ClassName::instanceMethod), and constructor (ClassName::new).',
  whyExists:
    'When a lambda only forwards arguments to an existing method, method references reduce noise and improve readability—common in Stream.map/filter, Comparator.comparing, and event handlers.',
  mentalModel:
    ':: points at a method slot; the functional interface supplies when to call it. Type inference matches signature: (T) -> R maps to method accepting T returning R.',
  howItWorks: [
    {
      type: 'list',
      items: [
        'Static: Integer::parseInt ≡ s -> Integer.parseInt(s).',
        'Bound instance: System.out::println ≡ x -> System.out.println(x).',
        'Unbound instance: String::length ≡ s -> s.length()—first arg becomes receiver.',
        'Constructor: ArrayList::new ≡ () -> new ArrayList() or n -> new ArrayList<>(n) if arity matches.',
        'Must match functional interface abstract method signature exactly.',
        'Cannot reference overloaded method without target type context for disambiguation.',
      ],
    },
    {
      type: 'table',
      headers: ['Form', 'Example', 'Equivalent lambda'],
      rows: [
        ['Static', 'Integer::valueOf', 'x -> Integer.valueOf(x)'],
        ['Bound instance', 'list::add', 'x -> list.add(x)'],
        ['Unbound instance', 'String::toLowerCase', 's -> s.toLowerCase()'],
        ['Constructor', 'HashMap::new', '() -> new HashMap<>()'],
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Stream with method references',
      code: `List<String> names = List.of("Ada", "Grace", "Linus");
List<String> upper = names.stream()
    .map(String::toUpperCase)
    .filter(Predicate.not(String::isBlank))
    .toList();

names.sort(Comparator.comparing(String::length).thenComparing(String::compareToIgnoreCase));`,
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'Four reference types',
      code: `Function<String, Integer> parse = Integer::parseInt;       // static
Consumer<String> log = System.out::println;                 // bound instance
Function<String, Integer> len = String::length;             // unbound instance
Supplier<List<String>> factory = ArrayList::new;            // constructor`,
    },
  ],
  tradeoffs: {
    advantages: [
      'Concise when lambda is pure delegation',
      'Clear intent in streams and comparators',
      'Compiler checks signature match',
    ],
    disadvantages: [
      'Less readable when logic is not a single method call',
      'Overload ambiguity needs explicit type',
      'Debugging stack traces skip named lambda less obvious than inline',
    ],
    alternatives: ['Explicit lambda', 'Method handle (MethodHandle) low-level'],
    whenToUse: ['Single method delegation', 'Stream pipelines', 'Comparator.comparing keys'],
    whenNotToUse: ['Multiple statements or side logic', 'Need to capture extra locals beyond receiver'],
  },
  failureModes: [
    'Wrong arity constructor reference vs functional interface.',
    'Autoboxing mismatch int vs Integer in generic FI.',
    'Using ClassName::instanceMethod when static method intended.',
  ],
  interview: {
    expectations: [
      'Explain :: four forms',
      'Unbound instance first param is receiver',
      'Equivalence to lambda',
    ],
    commonQuestions: ['String::length vs s->s.length()', 'ArrayList::new which constructor?', 'System.out::println type?'],
    followUps: ['Method reference vs lambda performance?', 'Reference to private method?', 'Double colon with generics?'],
    misconceptions: ['Always faster than lambda', 'Can reference any expression', 'Same as function pointer in C'],
    traps: ['Comparator.comparing(String::length) vs comparingInt', 'Constructor ref wrong arity for Supplier vs Function'],
    strongSignals: ['Names four categories', 'Explains target type inference', 'Knows unbound receiver rule'],
  },
  keyTakeaways: [
    ':: references method/constructor, does not call.',
    'Four kinds: static, bound, unbound, constructor.',
    'Unbound instance: first FI arg is receiver.',
    'Use when lambda only forwards to one method.',
    'Target type resolves overloads.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Integer::parseInt is which reference type?', answerHint: 'Static method reference on Integer.' },
    { level: 'intermediate', question: 'String::length with Function<String,Integer>—how invoked?', answerHint: 'Unbound instance: apply("abc") calls "abc".length().' },
    { level: 'advanced', question: 'Method reference vs lambda bytecode?', answerHint: 'Often identical after javac; both use invokedynamic/bootstrap; no guaranteed perf difference.' },
  ],
  flashcards: [
    { front: 'Unbound instance example', back: 'String::length — receiver is first argument.' },
    { front: 'Constructor reference', back: 'ArrayList::new matches Supplier or Function by arity.' },
    { front: 'When prefer over lambda', back: 'Single delegation to existing method—clearer intent.' },
  ],
  quickRevision: [
    ':: four forms',
    'Static Class::method',
    'Bound obj::method',
    'Unbound Class::inst',
    'Constructor Class::new',
    'Match FI signature',
    'Stream/Comparator idioms',
  ],
  production: {
    maintainability: [
      'Prefer method references in stream pipelines when they name domain methods (User::getEmail) for self-documenting code.',
      'Avoid obscure constructor refs in public APIs—explicit lambda clearer for reviewers.',
    ],
    performance: [
      'No systematic runtime win over lambdas—choose for readability.',
      'Hot paths with profiling show identical invokedynamic cost for equivalent refs.',
    ],
  },
}
