import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Polymorphism ("many forms") lets code treat objects of different concrete types through a common supertype reference. In Java, runtime polymorphism via method overriding and interface implementation enables one API to work with many implementations.',
  whyExists:
    'Without polymorphism, every caller would branch on concrete types (if Dog ... else if Cat ...). Polymorphism pushes variation into implementations, keeping client code stable when new types are added — open/closed principle.',
  mentalModel:
    'Reference type = remote control buttons (what you can call). Object type = actual device (what happens). Parent ref pointing to Child object — pressing speak() runs Child\'s version.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Compile-time type of reference determines accessible methods.',
        'Runtime type of object determines which overridden method executes.',
        'Upcasting: Child c = new Child(); Parent p = c; — always safe.',
        'Downcasting: (Child) p — requires instanceof check; ClassCastException if wrong.',
        'Interface references enable polymorphism without shared base class.',
      ],
    },
    {
      type: 'table',
      headers: ['Kind', 'Binding time', 'Example'],
      rows: [
        ['Overriding', 'Runtime', 'animal.speak() on Dog instance'],
        ['Overloading', 'Compile time', 'print(int) vs print(String)'],
        ['Interface dispatch', 'Runtime', 'List ref to ArrayList'],
        ['Static method hide', 'Compile time', 'Parent.staticM() vs Child.staticM()'],
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Runtime polymorphism',
      code: `interface Shape { double area(); }

record Circle(double r) implements Shape {
  public double area() { return Math.PI * r * r; }
}

record Rectangle(double w, double h) implements Shape {
  public double area() { return w * h; }
}

double totalArea(List<Shape> shapes) {
  return shapes.stream().mapToDouble(Shape::area).sum();
}`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Safe downcasting with pattern matching (J21+)',
      code: `void describe(Object o) {
  if (o instanceof String s) {
    System.out.println("Length: " + s.length());
  } else if (o instanceof Integer i) {
    System.out.println("Value: " + i);
  }
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'HotSpot uses vtable (itables for interfaces) attached to klass metadata for fast virtual dispatch.',
        'Monomorphic/megamorphic call sites — JIT may inline when one implementation dominates.',
        'sealed hierarchies + switch pattern matching (J21) give exhaustive polymorphic dispatch.',
        'Generics erasure: List<String> and List<Integer> share List at runtime — no type-based overload on generic params.',
        'Double dispatch not native — visitor pattern simulates it.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Extensible — add new implementations without changing callers',
      'Cleaner code — no type-switch sprawl',
      'Testability — inject mock implementations',
      'Aligns with dependency inversion',
    ],
    disadvantages: [
      'Indirection cost (usually JIT-optimized away)',
      'Behavior harder to trace without IDE navigation',
      'Over-polymorphism obscures simple linear logic',
    ],
    alternatives: [
      'Tagged union / sealed types with switch — closed world',
      'Strategy as enum with lambdas — finite variants',
      'Visitor for double dispatch on stable hierarchy',
    ],
    whenToUse: [
      'Open set of implementations (plugins, payment providers)',
      'Framework callbacks and lifecycle hooks',
      'Collection APIs parameterized by interface type',
    ],
    whenNotToUse: [
      'Closed finite set — sealed + switch may be clearer',
      'Performance-critical monomorphic hot path before JIT warms up',
      'When behavior depends on many unrelated dimensions — avoid type explosion',
    ],
  },
  failureModes: [
    'Unsafe cast without instanceof — ClassCastException.',
    'Assuming compile-time type for overridden behavior — surprise when Parent ref holds Child.',
    'Broken LSP — subclass throws where parent does not, breaks polymorphic callers.',
    'Adding method to interface without default breaks all implementors.',
    'Relying on getClass() for polymorphic behavior instead of virtual methods.',
  ],
  interview: {
    expectations: [
      'Explain compile-time vs runtime type',
      'Override vs overload vs hide',
      'Upcasting, downcasting, instanceof',
    ],
    commonQuestions: [
      'What is polymorphism?',
      'Compile-time vs runtime polymorphism examples?',
      'Can you override static methods?',
      'What is dynamic method dispatch?',
    ],
    followUps: [
      'How does JVM implement virtual method calls?',
      'What is Liskov Substitution Principle?',
    ],
    misconceptions: [
      'Polymorphism only via inheritance (interfaces suffice)',
      'Overloading is runtime polymorphism (it is compile-time)',
    ],
    traps: ['Confusing method hiding with overriding for static methods'],
    strongSignals: [
      'Draws reference type vs object type diagram',
      'Mentions sealed + pattern matching as modern closed polymorphism',
      'Explains vtable/itables at high level',
    ],
  },
  keyTakeaways: [
    'Same interface, different implementations — runtime picks method.',
    'Reference type limits visible API; object type drives override.',
    'Upcast implicit; downcast needs check.',
    'Overloading = compile time; overriding = runtime.',
    'Program to supertype/interface for extensibility.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Give an example of polymorphism in Java.',
      answerHint: 'Parent/interface reference holding subclass; overridden method runs at runtime.',
    },
    {
      level: 'intermediate',
      question: 'Difference between overloading and overriding?',
      answerHint: 'Overload: same name, different params, compile time. Override: same signature, runtime dispatch.',
    },
    {
      level: 'advanced',
      question: 'What is LSP and how does it relate to polymorphism?',
      answerHint: 'Subtypes must be substitutable for base type without breaking callers.',
    },
  ],
  flashcards: [
    { front: 'Runtime vs compile-time type', back: 'Ref type vs actual object class' },
    { front: 'Virtual dispatch', back: 'JVM calls method of runtime object type' },
    { front: 'Overloading binding', back: 'Compile time based on reference type and args' },
  ],
  quickRevision: [
    'Many forms via common supertype',
    'Override → runtime dispatch',
    'Overload → compile time',
    'Upcast safe; downcast check instanceof',
    'Interface enables polymorphism without extends',
    'LSP: substitutable subtypes',
    'sealed + switch for closed sets',
  ],
}
