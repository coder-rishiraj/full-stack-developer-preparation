import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Enums define a fixed set of named constants that are type-safe singleton instances of the enum class. Enums may have fields, constructors, methods, and implement interfaces — beyond simple C-style constants.',
  whyExists:
    'public static final int RED = 1 is not type-safe — any int passes. Enums give compile-time checking, singleton semantics, usable in switch, and can carry behavior per constant (strategy embedded in enum).',
  mentalModel:
    'Each enum constant is a public static final instance of the enum class, created once when the enum class loads. Order of declaration defines ordinal and compareTo order.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'enum Day { MON, TUE, WED } — constants are comma-separated.',
        'Constructor private implicitly; can pass args: MON("Monday").',
        'EnumSet and EnumMap provide efficient set/map keyed by enum.',
        'switch on enum — compiler may warn on missing cases if enum small.',
        'values() returns clone of all constants; valueOf(String) parses name.',
      ],
    },
    {
      type: 'table',
      headers: ['API', 'Use'],
      rows: [
        ['name()', 'String name of constant'],
        ['ordinal()', 'Declaration order index (avoid for logic)'],
        ['EnumSet.of(...)', 'Bit-vector set, O(1) ops'],
        ['EnumMap', 'Array-backed map, ordinals as index'],
        ['values()', 'All constants array (clone)'],
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Enum with fields and behavior',
      code: `public enum HttpStatus {
  OK(200, "Success"),
  NOT_FOUND(404, "Not Found"),
  INTERNAL_ERROR(500, "Server Error");

  private final int code;
  private final String message;

  HttpStatus(int code, String message) {
    this.code = code;
    this.message = message;
  }

  public int code() { return code; }
  public boolean isSuccess() { return code >= 200 && code < 300; }
}`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'EnumSet for flags',
      code: `enum Permission { READ, WRITE, EXECUTE }

EnumSet<Permission> perms = EnumSet.of(Permission.READ, Permission.WRITE);
perms.add(Permission.EXECUTE);
// Efficient bit set internally`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Enum extends java.lang.Enum<E> — compareTo uses ordinal by default.',
        'Constants created in static initializer before static fields of enum run.',
        'Singleton guaranteed by JVM — reflection can break unless enum ctor throws.',
        'EnumMap: Object[] vals indexed by ordinal — no hashing, very fast.',
        'EnumSet: long bit vector for ≤64 constants, JumboEnumSet for more.',
      ],
    },
  ],
  complexity: {
    average: 'EnumMap get/put O(1); EnumSet add/contains O(1)',
    space: 'EnumMap O(#enum constants) array; EnumSet O(1) word(s)',
    notes: 'ordinal() is O(1) but semantically fragile if enum reordered.',
  },
  tradeoffs: {
    advantages: [
      'Type-safe constants with behavior',
      'Singleton without double-checked locking',
      'EnumSet/EnumMap highly optimized',
      'Natural fit for finite state machines',
    ],
    disadvantages: [
      'Cannot extend enums (fixed hierarchy)',
      'ordinal() breaks if constants reordered',
      'Large enum sets of behavior — class explosion per constant',
      'Serialization name-based — renaming breaks persisted data',
    ],
    alternatives: [
      'sealed interface + records for open/closed variants',
      'Static final constants for internal ints not in public API',
      'Class + singleton instances when subclassing needed',
    ],
    whenToUse: [
      'Fixed finite set known at compile time (days, statuses, ops)',
      'Strategy per constant (Operation.PLUS.apply)',
      'Keys for EnumMap / membership in EnumSet',
    ],
    whenNotToUse: [
      'Open set extensible by users — plugin types',
      'Need subclassing per variant',
      'Constants driven from database config at runtime',
    ],
  },
  failureModes: [
    'Using ordinal() for business logic — reorder breaks persistence.',
    'Mutable fields on enum constants — shared mutable state across JVM.',
    'Switch without default on enum that may grow — missed new constant.',
    'valueOf user input without try/catch — IllegalArgumentException.',
    'Enum implements mutable interface — constants appear mutable to callers.',
  ],
  interview: {
    expectations: [
      'Enum as type-safe singletons',
      'EnumSet/EnumMap advantages',
      'Why ordinal is discouraged',
    ],
    commonQuestions: [
      'Can enum have constructor and methods?',
      'Enum vs constant interface pattern?',
      'How is EnumMap implemented?',
      'Are enum instances singletons?',
    ],
    followUps: [
      'Effective singleton pattern with enum?',
      'Can enum extend a class?',
    ],
    misconceptions: [
      'Enums are just ints (they are full objects with identity)',
      'Enums cannot implement interfaces (they can)',
    ],
    traps: ['Using ordinal for DB storage instead of name()'],
    strongSignals: [
      'EnumMap ordinal indexing explanation',
      'Singleton pattern via enum (Joshua Bloch)',
      'Behavior-rich enum strategy example',
    ],
  },
  keyTakeaways: [
    'enum = fixed type-safe constant instances.',
    'Private ctor; one instance per constant.',
    'Prefer name() over ordinal() for persistence.',
    'EnumSet/EnumMap: fast, memory-efficient.',
    'Enums can have fields, methods, implement interfaces.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Why use enum instead of public static final int constants?',
      answerHint: 'Type safety, namespace, methods, switch exhaustiveness, singleton semantics.',
    },
    {
      level: 'intermediate',
      question: 'How does EnumMap achieve O(1) operations?',
      answerHint: 'Array indexed by enum ordinal; no hashing or boxing.',
    },
    {
      level: 'advanced',
      question: 'Why is enum recommended for singleton pattern?',
      answerHint: 'JVM guarantees single instance; serialization-safe; reflection-resistant.',
    },
  ],
  flashcards: [
    { front: 'EnumMap internals', back: 'Object array indexed by ordinal' },
    { front: 'ordinal vs name', back: 'ordinal: position (fragile); name: string identifier (stable)' },
    { front: 'Enum constructor visibility', back: 'Private implicitly; constants created at class init' },
  ],
  quickRevision: [
    'Fixed constants, type-safe',
    'One singleton instance each',
    'Fields, methods, interfaces OK',
    'EnumSet = bit vector',
    'EnumMap = ordinal array',
    'Avoid ordinal for logic',
    'valueOf / values / switch',
  ],
}
