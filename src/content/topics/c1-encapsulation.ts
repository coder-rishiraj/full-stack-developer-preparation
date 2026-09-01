import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Encapsulation hides an object\'s internal state behind a controlled public API, exposing behavior through methods while restricting direct field access via access modifiers (private, protected, package-private, public).',
  whyExists:
    'Unrestricted mutation lets callers break invariants (negative balance, invalid email). Encapsulation localizes validation, enables refactoring internal representation without breaking clients, and makes concurrent reasoning easier when boundaries are clear.',
  mentalModel:
    'The object is a capsule — callers knock on public methods, never reach inside. Getters/setters are optional gates with validation, not automatic boilerplate for every field.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Declare fields private (default for good design).',
        'Expose behavior via public methods that enforce rules.',
        'Validate in setters/constructors; fail fast on invalid input.',
        'Return defensive copies of mutable internals, not live references.',
        'Use package-private for module-internal collaboration when needed.',
      ],
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Leaky encapsulation',
      text: 'Returning internal List or Date directly lets callers mutate object state without your validation — use unmodifiable wrappers or immutable types.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Proper encapsulation with invariant',
      code: `public class Temperature {
  private double celsius;

  public Temperature(double celsius) {
    setCelsius(celsius);
  }

  public double getCelsius() { return celsius; }

  public void setCelsius(double celsius) {
    if (celsius < -273.15) throw new IllegalArgumentException("Below absolute zero");
    this.celsius = celsius;
  }

  public double getFahrenheit() { return celsius * 9 / 5 + 32; }
}`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Defensive copy on getter',
      code: `public class Team {
  private final List<String> members = new ArrayList<>();

  public void addMember(String name) {
    members.add(Objects.requireNonNull(name));
  }

  public List<String> getMembers() {
    return List.copyOf(members); // immutable snapshot
  }
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'JVM access checks enforced at compile time and via reflection (setAccessible can bypass — modules restrict this).',
        'JavaBeans convention: getX/isX, setX — used by frameworks (Jackson, JPA) via reflection.',
        'Records provide accessor methods but are transparent — encapsulation via immutability not hiding.',
        'Module system (JPMS) exports packages — stronger encapsulation at module boundary.',
        'Immutable objects achieve encapsulation by eliminating mutators entirely.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Invariants enforced in one place',
      'Freedom to change internal representation',
      'Clear public contract for callers',
      'Easier unit testing of validation logic',
    ],
    disadvantages: [
      'Boilerplate getters/setters without behavior',
      'Over-encapsulation obscures simple data',
      'Reflection/frameworks may bypass accessors',
    ],
    alternatives: [
      'Immutable records — no setters needed',
      'Package-private fields within same module',
      'Builder pattern for complex construction validation',
    ],
    whenToUse: [
      'Any mutable state with business rules',
      'Types exposed in public API of libraries',
      'Shared objects accessed from multiple threads',
    ],
    whenNotToUse: [
      'Internal DTOs in same package with no invariants — package-private fields OK',
      'Immutable value types — record with compact constructor validation',
    ],
  },
  failureModes: [
    'Returning mutable internal collection — external code clears or corrupts state.',
    'Validation only in setter but constructor bypasses it.',
    'Public fields on "data classes" in library API.',
    'Synchronized getter but unsynchronized setter — race on compound state.',
    'Exposing mutable Date or Calendar — caller changes internal timestamp.',
  ],
  interview: {
    expectations: [
      'Define encapsulation and show Java access modifiers',
      'Explain defensive copying',
      'When getters/setters add value vs ceremony',
    ],
    commonQuestions: [
      'What is encapsulation?',
      'Difference between private, protected, default, public?',
      'Why return copies from getters?',
      'Do records break encapsulation?',
    ],
    followUps: [
      'How does JPMS strengthen encapsulation?',
      'Encapsulation vs data hiding — same thing?',
    ],
    misconceptions: [
      'Encapsulation means every field needs getter and setter',
      'protected fields are good encapsulation (subclasses can abuse)',
    ],
    traps: ['Suggesting public fields for convenience in production code'],
    strongSignals: [
      'Defensive copy example with List.copyOf',
      'Distinguishes behavioral methods from dumb accessors',
      'Mentions invariant enforcement at construction',
    ],
  },
  keyTakeaways: [
    'Hide state; expose controlled behavior.',
    'private fields + validated mutators/constructors.',
    'Never leak mutable internals — defensive copies.',
    'Access modifiers: public > protected > package > private.',
    'Immutability is encapsulation through absence of mutation.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What is encapsulation in Java?',
      answerHint: 'Bundling data with methods; restricting direct field access via modifiers.',
    },
    {
      level: 'intermediate',
      question: 'Why is returning a mutable internal list dangerous?',
      answerHint: 'Caller can modify list without validation; breaks invariants.',
    },
    {
      level: 'advanced',
      question: 'How do Java modules relate to encapsulation?',
      answerHint: 'exports/opens control package visibility across module boundaries; strong encapsulation.',
    },
  ],
  flashcards: [
    { front: 'Access modifier order (widest to narrow)', back: 'public → protected → package-private → private' },
    { front: 'Defensive copy', back: 'Return copy/unmodifiable view of internal mutable state' },
    { front: 'Encapsulation goal', back: 'Protect invariants; hide implementation details' },
  ],
  quickRevision: [
    'private fields, public methods',
    'Validate in ctor and setters',
    'Defensive copy on getters',
    'No public mutable fields in API',
    'protected exposes to subclasses — careful',
    'Records: transparent immutable carriers',
    'Modules: package-level boundaries',
  ],
}
