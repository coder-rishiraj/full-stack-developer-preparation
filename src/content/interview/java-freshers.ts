import type { ReactInterviewItem } from './types'

export const JAVA_INTERVIEW_FRESHERS: ReactInterviewItem[] = [
  {
    id: 'what-is-java',
    question: 'What is Java, and what does “write once, run anywhere” actually mean?',
    relatedTopicIds: ['c1-syntax', 'c2-jvm-jdk-jre'],
    answer: [
      {
        type: 'paragraph',
        text: 'Java is a statically typed, object-oriented language. Source compiles to bytecode that a JVM executes. WORA means you ship class files, not a Windows or Linux binary — any compatible JVM can run them. You still depend on JVM version, available modules, and native libraries.',
      },
    ],
  },
  {
    id: 'jdk-jre-jvm',
    question: 'JDK vs JRE vs JVM?',
    relatedTopicIds: ['c2-jvm-jdk-jre'],
    answer: [
      {
        type: 'paragraph',
        text: 'JVM is the runtime that loads bytecode and executes it. JRE is JVM plus core libraries — enough to run an app. JDK is JRE plus compiler, javadoc, and tooling — enough to build one. Interviews want this split, then a sentence on bytecode and class loading.',
      },
    ],
  },
  {
    id: 'stack-heap',
    question: 'Where do primitives and objects live?',
    relatedTopicIds: ['c1-types', 'c2-stack-vs-heap'],
    answer: [
      {
        type: 'paragraph',
        text: 'Local primitives and references sit on the stack of the current method. The objects those references point to live on the heap. Arrays and wrappers are objects. Do not say “all ints are on the heap” — an `int x` local is a stack slot.',
      },
    ],
  },
  {
    id: 'oop-four',
    question: 'Name the four OOP pillars and one Java example each.',
    relatedTopicIds: ['c1-oop', 'c1-encapsulation', 'c1-inheritance', 'c1-polymorphism'],
    answer: [
      {
        type: 'list',
        items: [
          'Encapsulation: private fields, public methods, records with compact constructors.',
          'Inheritance: `extends` a class; prefer composition when you only need behavior reuse.',
          'Polymorphism: a List reference holding an ArrayList; override `equals`.',
          'Abstraction: interface or abstract class that hides a SQL vs HTTP implementation.',
        ],
      },
    ],
  },
  {
    id: 'overload-override',
    question: 'Overloading vs overriding?',
    relatedTopicIds: ['c1-polymorphism', 'c1-overload-vs-override', 'c1-method-overloading'],
    answer: [
      {
        type: 'paragraph',
        text: 'Overloading is the same name, different parameter lists, resolved at compile time (including boxing and varargs as weaker matches). Overriding is the same instance signature in a subclass, dispatched at runtime on the actual object. `static`, `private`, and constructors are not overridden.',
      },
    ],
  },
  {
    id: 'string-immutable',
    question: 'Why is String immutable, and how does the pool work?',
    relatedTopicIds: ['c1-strings', 'c1-string-pool', 'c1-immutability'],
    answer: [
      {
        type: 'paragraph',
        text: 'The character data cannot change after construction, so the JVM can intern literals safely, hash codes can be cached, and String keys are safe in maps if you do not replace the reference. `"hi"` looks in the pool; `new String("hi")` allocates a distinct heap object unless you `intern()`.',
      },
    ],
  },
  {
    id: 'eq-strings',
    question: '== vs equals() for strings?',
    relatedTopicIds: ['c1-string-equals', 'c1-equals'],
    answer: [
      {
        type: 'paragraph',
        text: '`==` compares references. `equals` on String compares characters. Two literals with the same text often share a pool object, so `==` can be true by accident — never rely on that in production code.',
      },
    ],
  },
  {
    id: 'array-arraylist',
    question: 'Array vs ArrayList?',
    relatedTopicIds: ['c1-arrays', 'c1-arrays-vs-arraylist', 'c1-arraylist'],
    answer: [
      {
        type: 'paragraph',
        text: 'An array has a fixed length and can hold primitives. ArrayList is a growable `Object[]` (or typed via generics that erase to Object), cannot store primitives without wrappers, and gives `add`/`remove`/`size`. Use arrays for tight primitive loops; use ArrayList for most application lists.',
      },
    ],
  },
  {
    id: 'checked-unchecked',
    question: 'Checked vs unchecked exceptions?',
    relatedTopicIds: ['c1-exceptions', 'c1-checked-unchecked'],
    answer: [
      {
        type: 'paragraph',
        text: 'Checked exceptions extend Exception but not RuntimeException; the compiler demands `throws` or try/catch (`IOException`). Unchecked are RuntimeException and Error (`NullPointerException`). Overriding cannot throw a new checked type that is broader than the parent method.',
      },
    ],
  },
  {
    id: 'access-modifiers',
    question: 'What can private, package, protected, and public see?',
    relatedTopicIds: ['c1-access-modifiers'],
    answer: [
      {
        type: 'paragraph',
        text: 'private: same class. default (no modifier): same package. protected: package plus subclasses (even other packages, for the inherited member). public: everywhere. Nested classes can see the outer private members.',
      },
    ],
  },
  {
    id: 'interface-abstract',
    question: 'Interface vs abstract class?',
    relatedTopicIds: ['c1-interfaces', 'c1-abstract-classes', 'c1-abstract-vs-interface'],
    answer: [
      {
        type: 'paragraph',
        text: 'A class can implement many interfaces and extend one class. Abstract classes can hold state and constructors. Interfaces since Java 8 can have default and static methods; they still cannot hold typical instance fields. Use an interface for a capability (`Comparable`); use an abstract class for a partial implementation with shared fields.',
      },
    ],
  },
  {
    id: 'finally',
    question: 'Does finally always run?',
    relatedTopicIds: ['c1-try-catch-finally'],
    answer: [
      {
        type: 'paragraph',
        text: 'It runs after try/catch even when you return from try — the return is delayed. It does not run if the JVM halts (`System.exit`) or the thread is killed from outside. Prefer try-with-resources for closing streams so you do not depend on finally for AutoCloseable.',
      },
    ],
  },
]
