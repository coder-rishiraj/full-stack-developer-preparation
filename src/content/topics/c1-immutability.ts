import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'An immutable object\'s state cannot change after construction. All fields are final, no mutators expose internal state, and any mutable components are defensively copied. Callers receive new instances instead of modifying existing ones.',
  whyExists:
    'Mutable shared state is the root of bugs in concurrent and even single-threaded code. Immutability eliminates whole classes of errors (race conditions, unexpected aliasing), simplifies reasoning, and makes objects safe as HashMap keys and cache values.',
  mentalModel:
    'Values are replaced, not edited. String s = "hello"; s.toUpperCase() returns new String — s unchanged. Think spreadsheet: you add a new row, not overwrite cells in place.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Declare all fields final; initialize in constructor.',
        'No public setters; factory methods return new instances for "changes".',
        'Defensive copy mutable arguments in constructor; copy on getters if needed.',
        'Make class final or sealed to prevent mutable subclasses.',
        'Use records for compact immutable data carriers.',
      ],
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Shallow vs deep immutability',
      text: 'final List field prevents reassignment but not list mutation unless list itself is unmodifiable. Use List.copyOf or Collections.unmodifiableList on construction.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Immutable class with with-er method',
      code: `public final class Money {
  private final String currency;
  private final long cents;

  public Money(String currency, long cents) {
    this.currency = Objects.requireNonNull(currency);
    if (cents < 0) throw new IllegalArgumentException();
    this.cents = cents;
  }

  public Money add(Money other) {
    requireSameCurrency(other);
    return new Money(currency, cents + other.cents);
  }

  public String currency() { return currency; }
  public long cents() { return cents; }
}`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Record + List.copyOf for shallow immutability',
      code: `public record Team(String name, List<String> members) {
  public Team {
    members = List.copyOf(members); // compact ctor defensive copy
  }
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'String, Integer, BigDecimal are immutable reference types; arrays and StringBuilder are mutable.',
        'Java has no const keyword for references — final means reference cannot be reassigned.',
        'Immutable objects safely published without synchronization (safe publication idiom).',
        'Persistent data structures (not in JDK) return new structure on update — structural sharing.',
        'Copy-on-write collections (CopyOnWriteArrayList) trade memory for read-heavy immutability-like safety.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Thread-safe without locks when shared',
      'Safe HashMap keys — hash bucket stable',
      'No defensive copying when passing to untrusted code',
      'Easier to reason about — no hidden mutation',
    ],
    disadvantages: [
      'Every "change" allocates new object — GC pressure',
      'Awkward for large mutable buffers (use builder, then freeze)',
      'Deep immutability requires copying nested structures',
      'Frameworks expecting setters (JPA) conflict with immutability',
    ],
    alternatives: [
      'Mutable objects with clear ownership boundaries',
      'Copy-on-write for read-heavy concurrent lists',
      'Unmodifiable views (Collections.unmodifiableX) — weaker guarantee',
    ],
    whenToUse: [
      'Value objects, money, coordinates, IDs',
      'Shared configuration loaded once',
      'Keys in concurrent maps and cache entries',
    ],
    whenNotToUse: [
      'High-frequency in-place updates (StringBuilder, char buffer)',
      'Large domain aggregates mutated in transactions (use mutable entity + immutable snapshot)',
    ],
  },
  failureModes: [
    'final field but mutable component leaked and modified externally.',
    'Subclass adds mutator — breaks immutability contract.',
    'Serialization recreates object bypassing constructor validation.',
    'Caching mutable array internally without copying on construction.',
    'Assuming Collections.unmodifiableList prevents caller from holding original mutable ref.',
  ],
  interview: {
    expectations: [
      'How to make a class immutable in Java',
      'Shallow vs deep immutability',
      'Why immutable objects are thread-safe',
    ],
    commonQuestions: [
      'How do you create an immutable class?',
      'Is String immutable in Java?',
      'Immutable object as HashMap key — why safe?',
      'final vs immutable?',
    ],
    followUps: [
      'What is defensive copying?',
      'How do records help immutability?',
    ],
    misconceptions: [
      'final alone makes object immutable (only reference binding)',
      'Unmodifiable wrapper makes deep immutable copy',
    ],
    traps: ['Returning internal mutable Date from "immutable" class'],
    strongSignals: [
      'with-er / add returns new instance pattern',
      'List.copyOf in record compact constructor',
      'final class + all final fields checklist',
    ],
  },
  keyTakeaways: [
    'No mutators; all fields final; class final/sealed.',
    'Defensive copy mutable constructor args and getters.',
    'Replace-on-change instead of in-place mutation.',
    'Immutable = thread-safe sharing without sync.',
    'Records + List.copyOf for common immutable DTOs.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What makes an object immutable in Java?',
      answerHint: 'Final fields, no setters, no leaking mutable state, class not extendable for mutation.',
    },
    {
      level: 'intermediate',
      question: 'Why are immutable objects good HashMap keys?',
      answerHint: 'hashCode and equals stable; key state cannot change bucket after insert.',
    },
    {
      level: 'advanced',
      question: 'Explain shallow vs deep immutability.',
      answerHint: 'Shallow: references final but nested objects mutable. Deep: entire object graph immutable.',
    },
  ],
  flashcards: [
    { front: 'Immutability checklist', back: 'final fields, no setters, defensive copy, final class' },
    { front: 'final keyword', back: 'Reference cannot reassign; does not make object deeply immutable' },
    { front: 'Thread safety of immutable', back: 'Safely published immutable objects need no synchronization' },
  ],
  quickRevision: [
    'State fixed after construction',
    'final fields + no setters',
    'Defensive copy mutable parts',
    'New instance for changes',
    'String, Integer immutable',
    'Records help immutability',
    'Safe as map keys and shared state',
  ],
}
