import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Inheritance lets a subclass extend a superclass with extends, inheriting fields and methods (except private) and optionally overriding behavior. It models is-a relationships and enables code reuse through specialization.',
  whyExists:
    'Duplicating common logic across similar classes violates DRY. Inheritance centralizes shared behavior in a parent while subclasses customize specifics — e.g. all shapes share area() contract, Circle and Square implement differently.',
  mentalModel:
    'Subclass IS-A parent type. A reference of type Parent can hold a Child. The subclass gets parent\'s members plus its own; super keyword accesses parent version of overridden members.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'class Child extends Parent — single inheritance only.',
        'Child inherits accessible members; private parent fields accessed via inherited methods only.',
        'Constructor must call super(...) if parent lacks no-arg constructor.',
        'Override instance methods with @Override — runtime dispatch uses actual type.',
        'Hide static methods (not override); shadow fields (anti-pattern).',
      ],
    },
    {
      type: 'table',
      headers: ['Keyword', 'Purpose'],
      rows: [
        ['extends', 'Class inherits from one superclass'],
        ['super()', 'Invoke parent constructor — must be first in ctor'],
        ['super.method()', 'Call parent version of overridden method'],
        ['@Override', 'Compile-time check of valid override'],
        ['final method/class', 'Prevent override or extension'],
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Basic inheritance with override',
      code: `public class Animal {
  protected String name;
  public Animal(String name) { this.name = name; }
  public String speak() { return "..."; }
}

public class Dog extends Animal {
  public Dog(String name) { super(name); }

  @Override
  public String speak() { return name + " says woof"; }
}

Animal a = new Dog("Rex");
a.speak(); // "Rex says woof" — virtual dispatch`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'super in overridden method',
      code: `class LoggingList<E> extends ArrayList<E> {
  @Override
  public boolean add(E e) {
    System.out.println("Adding: " + e);
    return super.add(e);
  }
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Object is root of all class hierarchies — equals, hashCode, toString inherited.',
        'Field hiding: subclass field same name as parent — two distinct fields; access depends on reference type (confusing).',
        'Method overriding uses invokevirtual; checked at compile via @Override (Java 5+).',
        'Covariant return types allowed since Java 5 — override may return narrower type.',
        'Initialization: parent static → child static → parent instance init → parent ctor → child instance → child ctor.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Reuse parent implementation via super',
      'Polymorphic substitution — Child where Parent expected',
      'Framework extension points (override hooks)',
    ],
    disadvantages: [
      'Tight coupling to parent implementation',
      'Fragile base class — parent changes break children',
      'Single inheritance limits modeling flexibility',
      'Field/method hiding causes subtle bugs',
    ],
    alternatives: [
      'Composition — delegate to contained object',
      'Interface implementation without extends',
      'Default methods on interfaces for shared code',
    ],
    whenToUse: [
      'True is-a relationship with LSP satisfied',
      'Framework lifecycle hooks (onCreate, paint)',
      'Shared algorithm with customizable steps (template method)',
    ],
    whenNotToUse: [
      'Reuse only — prefer composition',
      'Subclass needs another unrelated base class',
      'Parent not designed for extension (final or brittle)',
    ],
  },
  failureModes: [
    'Subclass breaks parent contract — LSP violation.',
    'Overriding without @Override — typo creates overload not override.',
    'Calling overridable method from parent constructor — subclass not initialized yet.',
    'Deep inheritance trees — God object at root.',
    'Synchronized override with different lock than parent — deadlock risk.',
  ],
  interview: {
    expectations: [
      'Explain extends, super, @Override',
      'Initialization order parent → child',
      'Composition vs inheritance trade-offs',
    ],
    commonQuestions: [
      'Why single inheritance in Java?',
      'Difference between overriding and overloading?',
      'Can you inherit from multiple classes?',
      'What happens if parent has no default constructor?',
    ],
    followUps: [
      'What is fragile base class problem?',
      'Can static methods be overridden?',
    ],
    misconceptions: [
      'Inheritance copies parent fields into child at compile time (layout merged; private fields not directly visible)',
      'All methods are virtual in Java (static, private, final are not overridden)',
    ],
    traps: ['Calling virtual method from constructor'],
    strongSignals: [
      'Initialization order example with println in constructors',
      'Explains LSP and when not to inherit',
      'Distinguishes override vs hide vs overload',
    ],
  },
  keyTakeaways: [
    'extends — single parent; implements interfaces additionally.',
    'Override instance methods; @Override annotation mandatory style.',
    'super() first in constructor; super.method() for parent behavior.',
    'Runtime type determines overridden method (virtual dispatch).',
    'Prefer composition when reuse is only goal.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What keyword is used for inheritance in Java?',
      answerHint: 'extends for classes; implements for interfaces.',
    },
    {
      level: 'intermediate',
      question: 'Why should you not call overridable methods from a constructor?',
      answerHint: 'Subclass fields not initialized; overridden method sees default/null state.',
    },
    {
      level: 'advanced',
      question: 'Explain method hiding vs overriding.',
      answerHint: 'Static methods hide based on reference type; instance override uses runtime type.',
    },
  ],
  flashcards: [
    { front: 'Single inheritance', back: 'One extends; multiple implements' },
    { front: 'super() rule', back: 'Must be first statement in constructor if used' },
    { front: 'Override dispatch', back: 'Runtime class of object determines method' },
  ],
  quickRevision: [
    'extends Parent — is-a',
    'super() and super.method()',
    '@Override on instance methods',
    'Init: parent before child',
    'No multi-class extends',
    'final prevents override/extend',
    'Composition often beats inheritance',
  ],
}
