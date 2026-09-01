import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'An interface defines a contract — method signatures (and since Java 8, default and static methods) that implementing classes must satisfy. Interfaces enable multiple inheritance of type and decouple callers from concrete implementations.',
  whyExists:
    'Abstract classes permit only single inheritance. Interfaces let a class play many roles (Serializable, Comparable, Runnable) without forcing a common base. They are the primary tool for dependency inversion and test doubles.',
  mentalModel:
    'An interface is a capability label. Code depends on PaymentProcessor, not StripeProcessor. At runtime, any implementing object satisfies the contract; the JVM uses interface method tables (imt) for dispatch.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Declare interface with methods (implicitly public abstract pre-J8).',
        'Class implements one or more interfaces: class X implements A, B.',
        'Must implement all abstract methods unless class is abstract.',
        'Default methods (Java 8+) provide shared implementation — diamond problem resolved by class wins.',
        'Static methods on interface are utility helpers, not inherited.',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Java 8+ interface evolution',
      text: 'Default and static methods let libraries add methods without breaking implementors — e.g. Collection.stream().',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Interface with default method',
      code: `public interface Repository<T> {
  T findById(String id);

  default List<T> findAll() {
    throw new UnsupportedOperationException("Not implemented");
  }

  static <T> Repository<T> inMemory() {
    return new InMemoryRepository<>();
  }
}`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Dependency injection via interface',
      code: `class OrderService {
  private final PaymentProcessor processor;

  OrderService(PaymentProcessor processor) {
    this.processor = processor;
  }

  void checkout(Order o) { processor.charge(o.total()); }
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Interface fields are implicitly public static final — constants only.',
        'A class may implement multiple interfaces; JVM builds interface method table per class.',
        'Default method resolution: class method > default in most specific interface > compile error if ambiguous.',
        'Private methods (Java 9+) share code among default methods in same interface.',
        'Sealed interfaces (J17+) restrict permitted implementors for exhaustive pattern matching.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Multiple inheritance of type',
      'Loose coupling — swap implementations',
      'Natural fit for mocks in unit tests',
      'Default methods evolve APIs without breaking code',
    ],
    disadvantages: [
      'No shared instance state (only constants)',
      'Large interfaces violate interface segregation',
      'Default method diamond conflicts require careful design',
      'Over-interface-ization creates ceremony',
    ],
    alternatives: [
      'Abstract class when shared state or partial implementation needed',
      'Functional interface + lambda for single-method contracts',
      'sealed interface + records for closed hierarchies',
    ],
    whenToUse: [
      'Define capability contracts between layers',
      'Plugin/strategy patterns',
      'API boundaries in libraries and frameworks',
    ],
    whenNotToUse: [
      'Need shared mutable state across subclasses — abstract class',
      'Single-method callback — functional interface may suffice',
      'When one concrete implementation will never vary',
    ],
  },
  failureModes: [
    'Fat interface forces empty stub implementations.',
    'Adding abstract method to published interface breaks all implementors (pre-default-method libraries).',
    'Using interface only for constants — anti-pattern; use enum or final class.',
    'Default method accidentally changes behavior for existing implementors.',
    'Implementing incompatible interfaces with same method signature — rare conflict.',
  ],
  interview: {
    expectations: [
      'Interface vs abstract class comparison',
      'Explain default/static methods and diamond problem resolution',
      'Why program to interfaces, not implementations',
    ],
    commonQuestions: [
      'Difference between interface and abstract class?',
      'Can interface have constructors? Fields?',
      'What are default methods? Why added?',
      'How many interfaces can a class implement?',
    ],
    followUps: [
      'What happens if two interfaces define same default method?',
      'Functional interface rules (@FunctionalInterface)?',
    ],
    misconceptions: [
      'Interfaces cannot have any implementation (default/static/private methods exist)',
      'Interfaces replace abstract classes entirely',
    ],
    traps: ['Saying interfaces support multiple inheritance of implementation'],
    strongSignals: [
      'Mentions ISP from SOLID',
      'Explains default method conflict resolution order',
      'Knows sealed interfaces for domain modeling',
    ],
  },
  keyTakeaways: [
    'Interface = contract; class implements one or many.',
    'All methods public; fields are constants.',
    'Default methods evolve APIs; class wins over interface default.',
    'Prefer interfaces for dependency inversion and testing.',
    'Abstract class when shared state + template methods needed.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What is the difference between an interface and a class?',
      answerHint: 'Interface defines contract; no instance fields (except constants); class has state and single extends.',
    },
    {
      level: 'intermediate',
      question: 'When do default methods cause conflicts and how are they resolved?',
      answerHint: 'Two defaults with same signature — class override wins; else most specific; else must override.',
    },
    {
      level: 'advanced',
      question: 'Interface vs abstract class — decision criteria?',
      answerHint: 'Multiple types, no state → interface; shared fields/constructors → abstract class.',
    },
  ],
  flashcards: [
    { front: 'Interface fields', back: 'public static final constants only' },
    { front: 'Default method purpose', back: 'Add methods to interface without breaking implementors' },
    { front: 'Multiple inheritance in Java', back: 'Multiple interfaces; one superclass' },
  ],
  quickRevision: [
    'implements keyword; multiple allowed',
    'Methods public abstract (classic)',
    'default/static since Java 8',
    'No constructors or instance state',
    'Program to interface not impl',
    '@FunctionalInterface: one abstract method',
    'sealed interface restricts subtypes',
  ],
}
