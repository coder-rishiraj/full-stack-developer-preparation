import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Interfaces (in design) are explicit contracts defining what a component can do without specifying how — they establish substitution points, test seams, and boundaries between modules regardless of language syntax.',
  whyExists:
    'Without contracts, code depends on concrete classes — tests need real databases, swapping Stripe for Adyen rewrites callers. Interfaces document expectations, enable mocks, and satisfy Dependency Inversion at module boundaries.',
  mentalModel:
    'An interface is a promise: “Anything implementing PaymentGateway can charge and refund.” Callers compile against the promise; wiring chooses Stripe at startup. Design interfaces from client needs (ISP), not from existing class methods.',
  howItWorks: [
    {
      type: 'list',
      items: [
        'Define narrow interfaces per client role (Reader vs Writer)',
        'Place interfaces on the consumer side when possible (ports & adapters)',
        'Prefer many small interfaces over one “God interface”',
        'Methods express domain verbs, not framework jargon',
        'Return types should not leak infrastructure (SQLException)',
      ],
    },
    {
      type: 'mermaid',
      caption: 'Hexagonal: application defines port (interface)',
      diagram: `flowchart TB
  subgraph app [Application core]
    Svc[BookingService]
    Port[BookingRepository port]
    Svc --> Port
  end
  Adapter[PostgresBookingRepo] -.implements.-> Port
  Svc -.-x Adapter`,
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Design rule',
      text: 'If you cannot name the interface without “I” prefix noise, name by capability: `PaymentGateway`, `Clock`, `IdGenerator`. One implementation today is OK if boundary is real (external system, test double).',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Port defined by application; adapter in infrastructure',
      code: `// domain / application
public interface OrderRepository {
  Optional<Order> findById(OrderId id);
  void save(Order order);
}

public class OrderService {
  private final OrderRepository orders;
  public OrderService(OrderRepository orders) { this.orders = orders; }
}

// infrastructure
public class JpaOrderRepository implements OrderRepository { /* ... */ }`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'ISP: split fat interface',
      code: `interface Readable { String read(); }
interface Writable { void write(String data); }
// Printer implements both; Logger implements Writable only`,
    },
  ],
  implementation: [
    {
      language: 'java',
      caption: 'Test double via interface',
      code: `class InMemoryOrderRepository implements OrderRepository {
  private final Map<OrderId, Order> store = new HashMap<>();
  public void save(Order o) { store.put(o.getId(), o); }
  public Optional<Order> findById(OrderId id) { return Optional.ofNullable(store.get(id)); }
}`,
    },
    {
      language: 'typescript',
      caption: 'Structural typing — duck typing as interface',
      code: `type Notifier = { send(msg: Message): Promise<void> }
// Any object with send() works — no implements keyword required`,
    },
  ],
  tradeoffs: {
    advantages: [
      'Testability with fakes/mocks',
      'Swap implementations without changing consumers',
      'Documents module contract explicitly',
    ],
    disadvantages: [
      'Interface proliferation for trivial stable code',
      'Sync interface + async impl mismatch pain',
      'Java: single inheritance limits mixin-style interfaces',
    ],
    alternatives: [
      'Abstract class when shared implementation exists',
      'Function types for single-method contracts',
      'Module exports in JS without formal interface',
    ],
    whenToUse: [
      'External systems (DB, payment, email)',
      'Multiple implementations or test doubles required',
      'Team/package boundaries',
    ],
    whenNotToUse: [
      'Internal private class with one caller',
      'DTO/data carrier with no behavior contract',
    ],
  },
  failureModes: [
    'Fat interface → empty stub methods in implementers',
    'Interface owned by infrastructure leaking JDBC types',
    'Changing interface breaks all implementers (semver neglect)',
    'Mock-only interface never used in production wiring',
  ],
  production: {
    maintainability: [
      'Version breaking interface changes carefully',
      'Keep ports in domain layer',
      'Prefer fakes over mocks for repositories',
    ],
    reliability: ['Contract tests between adapter and fake'],
  },
  interview: {
    expectations: [
      'Interface vs abstract class decision',
      'ISP and port/adapter example',
      'When NOT to create interface',
    ],
    commonQuestions: [
      'Why interface if one implementation?',
      'Interface segregation?',
      'Where define repository interface?',
    ],
    followUps: [
      'Default methods in Java interfaces?',
      'Interface in functional languages?',
    ],
    misconceptions: [
      'Every class needs an interface',
      'Interface and API endpoint are the same thing',
    ],
    traps: [
      'Listing language syntax without design rationale',
    ],
    strongSignals: [
      'Consumer-defined ports',
      'Narrow interfaces with domain language',
    ],
  },
  keyTakeaways: [
    'Interfaces are contracts for substitution and testing.',
    'Design from client needs — Interface Segregation.',
    'Ports in domain; adapters in infrastructure.',
    'Not every class needs an interface — boundary matters.',
    'Hide infrastructure types behind domain-facing contracts.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Purpose of interface in design?', answerHint: 'Contract, polymorphism, test seam, decouple consumer from implementation.' },
    { level: 'intermediate', question: 'Interface vs abstract class?', answerHint: 'Interface = pure contract; abstract class = shared code + partial implementation.' },
    { level: 'intermediate', question: 'One implementation — still interface?', answerHint: 'Yes at real boundary (DB, third party) or when tests need fake.' },
    { level: 'advanced', question: 'ISP example?', answerHint: 'Split Document into Printable and Editable so Printer doesn’t implement save().' },
  ],
  flashcards: [
    { front: 'Port and adapter', back: 'App defines port interface; infra adapter implements' },
    { front: 'ISP', back: 'Many small client-specific interfaces vs one fat interface' },
    { front: 'Interface for testing', back: 'Inject fake/in-memory impl without real DB' },
    { front: 'Leaky interface', back: 'Exposes SQLException or HTTP types to domain' },
  ],
  quickRevision: [
    'Contract = what not how',
    'Narrow interfaces per client',
    'Ports in domain layer',
    'Fakes > mocks for repos',
    'Don’t interface everything',
  ],
  patternRecognition: [
    'Service imports JDBC directly → missing repository port',
    'Implementer throws UnsupportedOperationException → ISP violation',
  ],
  commonMistakes: [
    'IUserService with 30 methods',
    'Interface mirroring entire concrete class 1:1',
  ],
}
