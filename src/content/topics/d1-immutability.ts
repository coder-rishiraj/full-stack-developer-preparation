import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Immutability (in design) means objects whose state cannot change after construction — updates produce new instances rather than mutating shared references. It simplifies reasoning, concurrency, and caching in distributed and multi-threaded systems.',
  whyExists:
    'Mutable shared state causes bugs: thread A reads while B writes, cache keys invalidate unpredictably, event replay applies mutations twice. Immutable values are safe to share, hash, and pass across layers without defensive copying.',
  mentalModel:
    'Treat data like a printed receipt — to “change” it, issue a new receipt. `Money.plus(amount)` returns new Money; original unchanged. Identity vs value: immutable objects compared by value content, not reference mutation history.',
  howItWorks: [
    {
      type: 'list',
      items: [
        'All fields final/private; set only in constructor/factory',
        'No setters; “mutations” return new copy (withX methods)',
        'Deep immutability: composed objects also immutable',
        'Collections wrapped unmodifiable or copied on construction',
        'Use value objects for domain concepts (Money, Email, DateRange)',
      ],
    },
    {
      type: 'mermaid',
      caption: 'Update creates new instance; old references stay valid',
      diagram: `flowchart LR
  A[Cart v1: 2 items]
  A -->|addItem| B[Cart v2: 3 items]
  A -->|still| R1[Reader sees v1]
  B --> R2[Reader sees v2]`,
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Shallow vs deep',
      text: 'final List field but mutable list contents = shallow immutable only. Copy list in constructor: `List.copyOf(items)`.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Immutable value object',
      code: `public final class Money {
  private final BigDecimal amount;
  private final Currency currency;

  public Money(BigDecimal amount, Currency currency) {
    this.amount = amount;
    this.currency = currency;
  }

  public Money add(Money other) {
    if (!currency.equals(other.currency)) throw new IllegalArgumentException();
    return new Money(amount.add(other.amount), currency);
  }

  public BigDecimal getAmount() { return amount; }
}`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Java record for immutable DTO',
      code: `public record Address(String line1, String city, String zip) {
  public Address {
    Objects.requireNonNull(line1);
  }
}`,
    },
  ],
  implementation: [
    {
      language: 'java',
      caption: 'Builder produces immutable product',
      code: `public final class Pizza {
  private final List<String> toppings;
  private Pizza(List<String> toppings) {
    this.toppings = List.copyOf(toppings);
  }
  static Builder builder() { return new Builder(); }
  static class Builder {
    private final List<String> t = new ArrayList<>();
    Builder add(String topping) { t.add(topping); return this; }
    Pizza build() { return new Pizza(t); }
  }
}`,
    },
  ],
  tradeoffs: {
    advantages: [
      'Thread-safe without locks',
      'Safe keys in HashMap/HashSet',
      'Easier debugging — state never silently changes',
      'Functional-style pipelines predictable',
    ],
    disadvantages: [
      'Copy-on-write allocation overhead for large structures',
      'Awkward for incremental UI state unless structural sharing',
      'ORM/JPA often expect mutable entities',
    ],
    alternatives: [
      'Mutable internal + immutable public snapshots',
      'Persistent data structures (Clojure, Immutable.js)',
      'Copy-on-write only at persistence boundary',
    ],
    whenToUse: [
      'Value objects, money, coordinates, config snapshots',
      'Messages/events on queues (replay safe)',
      'Concurrent caches and shared read models',
    ],
    whenNotToUse: [
      'High-frequency in-place numeric buffers (games, HFT)',
      'JPA entity lifecycle with lazy loading mutations',
    ],
  },
  failureModes: [
    'Shallow immutability: final reference to mutable ArrayList',
    'Leaking builder reference after build()',
    'Mutating object retrieved from “immutable” cache',
    'Serialization/deserialization reintroducing mutability',
  ],
  production: {
    performance: ['Use structural sharing for large collections when needed', 'Profile allocation on hot paths'],
    reliability: ['Immutable events simplify exactly-once processing logic'],
    maintainability: ['Prefer records/value types at domain boundaries'],
  },
  interview: {
    expectations: [
      'Explain thread safety benefit',
      'Shallow vs deep immutability',
      'When immutability hurts (ORM, large graphs)',
    ],
    commonQuestions: [
      'Why immutable objects?',
      'String immutability in Java?',
      'Immutable class design checklist?',
    ],
    followUps: [
      'Immutability in distributed systems?',
      'StringBuilder vs String?',
    ],
    misconceptions: [
      'final keyword alone makes object immutable',
      'All immutability requires functional language',
    ],
    traps: [
      'Forgetting to copy mutable constructor args',
    ],
    strongSignals: [
      'Money/Address examples with withX/add returning new',
      'List.copyOf / unmodifiable wrapper mention',
    ],
  },
  keyTakeaways: [
    'No mutation after construction — new instance for change.',
    'Deep immutability: all reachable state frozen.',
    'Thread-safe sharing without synchronization.',
    'Great for value objects, events, cache keys.',
    'Watch shallow traps with collections and dates.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Benefits of immutability?', answerHint: 'Thread safety, simpler reasoning, safe sharing, valid hash keys.' },
    { level: 'intermediate', question: 'Make class immutable checklist?', answerHint: 'Final fields, no setters, defensive copy collections, deep immutability.' },
    { level: 'intermediate', question: 'Shallow immutability example?', answerHint: 'final List but list contents mutable if reference escapes.' },
    { level: 'advanced', question: 'Immutability in event sourcing?', answerHint: 'Events are facts; state derived by fold; replay deterministic.' },
  ],
  flashcards: [
    { front: 'Deep immutability', back: 'All nested objects also cannot change' },
    { front: 'Copy-on-write', back: 'Mutation returns new object; old unchanged' },
    { front: 'final field trap', back: 'final reference ≠ immutable object contents' },
    { front: 'Value object', back: 'Immutable type defined by its values (Money, Email)' },
  ],
  quickRevision: [
    'No setters; withX/add methods',
    'List.copyOf in constructor',
    'Thread-safe by default',
    'Records in Java',
    'Events/messages should be immutable',
  ],
  patternRecognition: [
    'HashMap key object fields mutated after insert → immutability fix',
    'ConcurrentModificationException → shared mutable collection',
  ],
  commonMistakes: [
    'Returning internal mutable list from getter',
    'Using Date instead of Instant/LocalDate',
  ],
}
