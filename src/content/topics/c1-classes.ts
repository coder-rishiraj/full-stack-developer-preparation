import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'A class is Java’s blueprint for objects: it declares fields (state), constructors (initialization), and methods (behavior). Classes support access modifiers, static members, nested types, and may be concrete, abstract, final, or sealed.',
  whyExists:
    'Without classes, there is no type-safe way to group related data and operations. Classes enforce invariants at construction, enable reuse through inheritance, and give the JVM a unit for loading, verification, and method dispatch.',
  mentalModel:
    'A class file (.class) is a template; new ClassName() creates a distinct heap object copying the field layout. Static members belong to the class (one copy); instance members belong to each object.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Class loader loads bytecode; JVM verifies and links.',
        'new allocates memory; default field values applied (0, null, false).',
        'Instance initializers and field declarations run top-to-bottom.',
        'Matching constructor executes (possibly chaining this(...) or super(...)).',
        'Reference returned; object eligible for GC when unreachable.',
      ],
    },
    {
      type: 'table',
      headers: ['Modifier', 'Effect'],
      rows: [
        ['public', 'Accessible everywhere'],
        ['final class', 'Cannot be extended'],
        ['abstract class', 'Cannot instantiate; may have abstract methods'],
        ['static', 'Belongs to class, not instance'],
        ['sealed (J17+)', 'Restricts which classes may extend'],
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Well-formed class with constructor chaining',
      code: `public final class Point {
  private final int x;
  private final int y;

  public Point(int x, int y) {
    this.x = x;
    this.y = y;
  }

  public Point() { this(0, 0); }

  public int distanceFromOrigin() {
    return (int) Math.sqrt(x * x + y * y);
  }
}`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Static vs instance',
      code: `class Counter {
  static int globalCount;
  int instanceCount;

  static void bumpGlobal() { globalCount++; }
  void bumpInstance() { instanceCount++; }
}

Counter.bumpGlobal(); // no instance needed
new Counter().bumpInstance();`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Object header on heap: mark word (GC, lock) + klass pointer to metaspace Class metadata.',
        'If no constructor written, compiler adds default no-arg calling super().',
        'Initialization order: static blocks (once per class) → instance fields/blocks → constructor.',
        'Inner non-static classes hold implicit reference to enclosing instance — memory leak risk.',
        'this() must be first statement in constructor; super() likewise when not calling this().',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Clear encapsulation boundary',
      'Constructors enforce valid initial state',
      'Static utilities colocated with domain type',
      'Nested classes for scoped helpers',
    ],
    disadvantages: [
      'Boilerplate for simple data carriers (records reduce this)',
      'Non-static inner classes capture outer reference',
      'Heavy use of static mutable state complicates testing',
    ],
    alternatives: [
      'record for immutable data tuples',
      'enum for fixed constant sets',
      'interface + default methods instead of abstract class when no shared state',
    ],
    whenToUse: [
      'Mutable entities with behavior and invariants',
      'Types needing controlled construction or multiple constructors',
      'Framework extension points (abstract/sealed hierarchies)',
    ],
    whenNotToUse: [
      'Pure data transfer — use record',
      'Single-method strategy — lambda or functional interface',
      'Utility-only methods with no state — consider final class + private constructor',
    ],
  },
  failureModes: [
    'Public mutable fields bypass encapsulation.',
    'Forgotten super() when parent has no default constructor — compile error.',
    'Non-static inner class retained by long-lived outer → leak inner + outer.',
    'Synchronizing on this or class object — unexpected lock contention.',
    'Finalizer/Cleaner anti-patterns — use try-with-resources instead.',
  ],
  interview: {
    expectations: [
      'Explain object creation steps and initialization order',
      'Difference between static and instance members',
      'When to use final, abstract, sealed classes',
    ],
    commonQuestions: [
      'What happens when you call new MyClass()?',
      'Static vs instance — storage and invocation?',
      'Can a constructor be private? Why?',
      'Initialization order: static, fields, constructor?',
    ],
    followUps: [
      'What is an instance initializer block?',
      'Difference between static nested and inner class?',
    ],
    misconceptions: [
      'Classes must have a no-arg constructor (only if subclasses need implicit super())',
      'Static methods are overridden (they are hidden, not overridden)',
    ],
    traps: ['Confusing method hiding (static) with overriding (instance)'],
    strongSignals: [
      'Explains initialization order with static + subclass example',
      'Knows when records replace classes',
      'Mentions inner class memory leak pattern',
    ],
  },
  keyTakeaways: [
    'Class = blueprint; object = instance on heap.',
    'Initialization: static once → fields/blocks → constructor chain.',
    'static belongs to class; instance belongs to object.',
    'Use access modifiers to enforce encapsulation.',
    'Prefer records for immutable data; classes for mutable behavior.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What is the difference between a class and an object?',
      answerHint: 'Class is blueprint; object is runtime instance with its own field values.',
    },
    {
      level: 'intermediate',
      question: 'Describe initialization order when creating a subclass instance.',
      answerHint: 'Parent static → child static → parent fields/constructor → child fields/constructor.',
    },
    {
      level: 'advanced',
      question: 'Why can non-static inner classes cause memory leaks?',
      answerHint: 'Inner holds implicit ref to outer; long-lived inner keeps outer alive.',
    },
  ],
  flashcards: [
    { front: 'Object creation steps', back: 'Allocate → default values → field init → constructor' },
    { front: 'static vs instance', back: 'static: one per class; instance: one per object' },
    { front: 'Default constructor', back: 'Compiler adds public no-arg if none declared and parent has one' },
  ],
  quickRevision: [
    'Class defines fields, constructors, methods',
    'new → heap object + constructor',
    'static = class-level; instance = per object',
    'Init order: static → instance → ctor',
    'final class: no extend; abstract: no new',
    'private ctor + static factory for controlled creation',
    'Inner class holds outer reference',
  ],
}
