import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Records (Java 16+, finalized in J16) are compact, immutable carrier classes for data: the compiler generates constructor, accessors, equals, hashCode, and toString from the header components.',
  whyExists:
    'Boilerplate POJOs for DTOs, value objects, and tuple-like returns cluttered codebases. Records express "this is immutable data" with one declaration, reduce bugs in equals/hashCode, and integrate with pattern matching.',
  mentalModel:
    'Record = transparent immutable tuple with a name. List.of-style value object: state fixed at construction, identity by value (equals on components), not by reference.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Declare: public record Point(int x, int y) {}',
        'Canonical constructor implicit; compact constructor validates: public Point { if (x < 0) throw ... }',
        'Accessors named x(), y() — not getX() (JavaBean style).',
        'Implicit final fields; cannot extend other classes (implicitly extends Record).',
        'Can implement interfaces; add static methods, custom methods.',
      ],
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'Restrictions',
      text: 'Records cannot extend classes (already extend java.lang.Record). Fields are final; no instance field declarations beyond components unless static.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Record as value object and map key',
      code: `public record UserId(long id) {
  public UserId {
    if (id <= 0) throw new IllegalArgumentException("id must be positive");
  }
}

Map<UserId, String> cache = new HashMap<>();
cache.put(new UserId(42L), "Ada");
cache.get(new UserId(42L)); // "Ada" — equals/hashCode generated`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Record implementing interface + pattern matching',
      code: `sealed interface Expr permits Constant, Add {}
record Constant(int value) implements Expr {}
record Add(Expr left, Expr right) implements Expr {}

int eval(Expr e) {
  return switch (e) {
    case Constant(int v) -> v;
    case Add(var l, var r) -> eval(l) + eval(r);
  };
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Compiler generates private final fields, canonical constructor, component accessors.',
        'equals compares each component with Objects.equals; hashCode uses Objects.hash.',
        'toString format: Point[x=1, y=2].',
        'Record class is final unless explicitly sealed/non-final (J16+ records can be non-final in some cases — typically final).',
        'Reflection: RecordComponent API exposes metadata; serializable records need custom readResolve for validation.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Eliminates equals/hashCode/toString boilerplate',
      'Immutability by default — thread-safe sharing',
      'Ideal HashMap keys and value semantics',
      'Works with sealed hierarchies and pattern matching',
    ],
    disadvantages: [
      'Not for mutable entities or JPA entities needing setters',
      'Cannot extend another class',
      'All components exposed via accessors — "transparent" not encapsulated',
      'Large records with many fields — consider builder for readability',
    ],
    alternatives: [
      'Lombok @Value — external codegen',
      'Classic class with final fields + manual equals',
      'record for data + separate mutable entity class',
    ],
    whenToUse: [
      'DTOs, API responses, domain value objects',
      'Composite keys, coordinates, money amounts',
      'Algebraic data types with sealed interfaces',
    ],
    whenNotToUse: [
      'JPA/Hibernate entities requiring no-arg ctor and setters',
      'Types needing inheritance from concrete base',
      'Heavy mutable behavior with internal state transitions',
    ],
  },
  failureModes: [
    'Using record for JPA entity — framework needs mutability and proxy subclassing.',
    'Mutable component types (Date, List) — record immutable but contents mutate.',
    'Assuming getX() accessors — record uses x() naming.',
    'Defensive copy omitted for mutable components in compact constructor.',
    'Serialization bypassing compact constructor validation — use readResolve.',
  ],
  interview: {
    expectations: [
      'What compiler generates for records',
      'Immutability and equals/hashCode behavior',
      'Limitations vs regular classes',
    ],
    commonQuestions: [
      'What is a Java record?',
      'Can records extend classes?',
      'Record vs class for DTOs?',
      'What is compact constructor?',
    ],
    followUps: [
      'Can record components be mutable objects?',
      'Records with JPA — viable?',
    ],
    misconceptions: [
      'Records are just syntactic sugar with getters (accessors are component names, not getX)',
      'Records cannot have methods (they can — instance and static)',
    ],
    traps: ['Using records as JPA entities without understanding proxy requirements'],
    strongSignals: [
      'Compact constructor validation example',
      'Mutable component defensive copy mention',
      'sealed interface + record ADT pattern',
    ],
  },
  keyTakeaways: [
    'record Name(Type comp, ...) — immutable data carrier.',
    'Auto: equals, hashCode, toString, constructor, accessors.',
    'Compact constructor validates without repeating assignments.',
    'Final, extend Record, cannot extend other classes.',
    'Perfect for value objects and pattern matching ADTs.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What does the compiler generate for a record?',
      answerHint: 'Fields, canonical ctor, accessors, equals, hashCode, toString.',
    },
    {
      level: 'intermediate',
      question: 'What is a compact constructor?',
      answerHint: 'Validation block in record header; assignments to fields implicit afterward.',
    },
    {
      level: 'advanced',
      question: 'Why must mutable record components be defensively copied?',
      answerHint: 'Immutability broken if external code mutates shared List/Date passed in.',
    },
  ],
  flashcards: [
    { front: 'Record accessor naming', back: 'Component name: point.x() not getX()' },
    { front: 'Record inheritance', back: 'Implicitly extends java.lang.Record; no other extends' },
    { front: 'Compact constructor', back: 'Validation-only ctor body in record declaration' },
  ],
  quickRevision: [
    'record Point(int x, int y)',
    'Immutable final components',
    'equals/hashCode by value',
    'Compact ctor validates',
    'No extend except Record',
    'Good for DTOs and keys',
    'sealed + record ADTs',
  ],
}
