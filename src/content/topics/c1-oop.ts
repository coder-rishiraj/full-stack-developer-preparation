import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Object-Oriented Programming (OOP) organizes software around objects — bundles of state (fields) and behavior (methods) — using four pillars: encapsulation, inheritance, polymorphism, and abstraction. Java is a class-based OOP language where almost everything lives inside types.',
  whyExists:
    'Procedural code scales poorly when domain concepts multiply. OOP maps real-world entities to types, localizes change behind interfaces, and enables reuse through inheritance and composition — reducing coupling in large codebases.',
  mentalModel:
    'Think in nouns (classes) and verbs (methods). Each object is an instance with its own field values but shared method definitions from its class. Messages (method calls) dispatch to the runtime type, not the reference type.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Define a class — blueprint with fields, constructors, methods.',
        'Instantiate with new — heap allocation + constructor runs.',
        'Interact via public API; internal state hidden (encapsulation).',
        'Extend or implement for specialization (inheritance, interfaces).',
        'Call methods on references — JVM resolves actual method via virtual dispatch.',
      ],
    },
    {
      type: 'table',
      headers: ['Pillar', 'Mechanism in Java', 'Purpose'],
      rows: [
        ['Encapsulation', 'private fields + getters/setters', 'Hide invariants, control mutation'],
        ['Abstraction', 'abstract classes, interfaces', 'Expose what, hide how'],
        ['Inheritance', 'extends, super', 'Reuse and specialize behavior'],
        ['Polymorphism', 'overriding, interfaces', 'One interface, many implementations'],
      ],
    },
  ],
  architecture: {
    mermaid: `flowchart TB
  Class[Class blueprint] --> Instance1[Object instance A]
  Class --> Instance2[Object instance B]
  Ref[Reference type] -->|virtual dispatch| Method[Runtime method on actual class]`,
    caption: 'Class defines shared behavior; each instance holds its own state',
  },
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Minimal OOP model',
      code: `public class BankAccount {
  private final String id;
  private int balance;

  public BankAccount(String id, int initial) {
    this.id = id;
    this.balance = initial;
  }

  public void deposit(int amount) {
    if (amount <= 0) throw new IllegalArgumentException();
    balance += amount;
  }

  public int getBalance() { return balance; }
}`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Polymorphism via interface',
      code: `interface Notifier { void send(String msg); }

class EmailNotifier implements Notifier {
  public void send(String msg) { /* SMTP */ }
}

class SmsNotifier implements Notifier {
  public void send(String msg) { /* SMS API */ }
}

void alert(Notifier n, String msg) { n.send(msg); } // works for any Notifier`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Every class extends Object implicitly — inherits equals, hashCode, toString, getClass.',
        'Instance fields live on the heap per object; static fields belong to the class (Metaspace).',
        'Method dispatch: invokevirtual for instance methods (vtable at runtime); invokestatic for static.',
        'Composition (has-a) preferred over deep inheritance (is-a) — favor injecting dependencies.',
        'Java supports single inheritance of classes; multiple inheritance of types via interfaces.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Models domain concepts naturally',
      'Encapsulation protects invariants',
      'Polymorphism enables extensibility without modifying callers',
      'Interfaces decouple modules for testing',
    ],
    disadvantages: [
      'Deep inheritance hierarchies become rigid and fragile',
      'Over-abstraction slows simple tasks',
      'Hidden state + side effects complicate reasoning',
      'God classes violate single responsibility',
    ],
    alternatives: [
      'Functional style — lambdas, immutable data, pure functions',
      'Procedural modules for scripts and small tools',
      'Records + sealed types for data-centric modeling (Java 16+)',
    ],
    whenToUse: [
      'Domain-rich applications with many interacting entities',
      'Frameworks requiring extension points (plugins, strategies)',
      'When invariants must be enforced at object boundaries',
    ],
    whenNotToUse: [
      'Pure data transforms with no mutable state — streams/functions may suffice',
      'Performance-critical inner loops where allocation overhead matters',
      'When composition + interfaces already cover reuse without subclassing',
    ],
  },
  failureModes: [
    'Leaking internal mutable collections via getters — callers break invariants.',
    'Using inheritance for code reuse only — fragile base class problem.',
    'Violating Liskov substitution — subclass breaks parent contract.',
    'Treating every problem as a class explosion — over-engineering.',
    'Ignoring equals/hashCode on types used as HashMap keys.',
  ],
  interview: {
    expectations: [
      'Name and explain four OOP pillars with Java examples',
      'Contrast composition vs inheritance',
      'Explain dynamic dispatch and why references can point to subclasses',
    ],
    commonQuestions: [
      'What are the four pillars of OOP?',
      'Composition vs inheritance — when to use each?',
      'Is Java purely object-oriented?',
      'What is the difference between abstraction and encapsulation?',
    ],
    followUps: [
      'How does Java support multiple inheritance?',
      'What is the fragile base class problem?',
    ],
    misconceptions: [
      'OOP means everything must be a class (Java has primitives and static methods)',
      'Inheritance is always the best reuse mechanism',
      'Encapsulation requires getters/setters for every field',
    ],
    traps: ['Confusing overloading (compile-time) with overriding (runtime)'],
    strongSignals: [
      'Prefers composition and interfaces over deep extends chains',
      'Mentions LSP, SOLID, and when functional style fits',
      'Explains virtual method table dispatch clearly',
    ],
  },
  keyTakeaways: [
    'OOP = objects with state + behavior; four pillars guide design.',
    'Encapsulate invariants; expose minimal public API.',
    'Prefer composition over inheritance for reuse.',
    'Polymorphism: reference type vs runtime type — method resolved at runtime.',
    'Java: single class inheritance, multiple interface implementation.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What are the four pillars of OOP?',
      answerHint: 'Encapsulation, abstraction, inheritance, polymorphism — each with a Java mechanism.',
    },
    {
      level: 'intermediate',
      question: 'Why prefer composition over inheritance?',
      answerHint: 'Looser coupling, no fragile base class, easier testing, swap implementations.',
    },
    {
      level: 'advanced',
      question: 'How does Java resolve which method runs on obj.method()?',
      answerHint: 'Virtual dispatch: runtime class of object; static/overload resolved at compile time.',
    },
  ],
  flashcards: [
    { front: 'Four OOP pillars', back: 'Encapsulation, Abstraction, Inheritance, Polymorphism' },
    { front: 'Composition vs inheritance', back: 'Has-a vs is-a; prefer composition for flexibility' },
    { front: 'Java multiple inheritance', back: 'One class parent; many interfaces' },
  ],
  quickRevision: [
    'Objects = state + behavior',
    'Four pillars: encapsulate, abstract, inherit, polymorph',
    'new allocates on heap; reference is handle',
    'Composition > deep inheritance',
    'Interface for contract; class for shared implementation',
    'Virtual dispatch at runtime',
    'Every class extends Object',
  ],
}
