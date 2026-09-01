import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Facade is a structural pattern providing a simplified, unified interface to a complex subsystem — hiding orchestration across multiple classes behind one easy entry point for common client workflows.',
  whyExists:
    'Subsystems grow dozens of classes (inventory, pricing, tax, payment, shipping). Callers shouldn’t sequence 15 steps and know every dependency. Facade offers `checkout(cart)` that coordinates internally.',
  mentalModel:
    'Hotel concierge: you ask one desk for “dinner and show tickets”; they coordinate kitchen, theater, billing. You don’t call each department. Facade is not a god class — it delegates, doesn’t implement business rules of subsystems.',
  howItWorks: [
    {
      type: 'mermaid',
      caption: 'Client uses Facade; Facade delegates to subsystem',
      diagram: `flowchart TB
  Client --> F[CheckoutFacade]
  F --> Inv[InventoryService]
  F --> Tax[TaxCalculator]
  F --> Pay[PaymentService]
  F --> Ship[ShippingService]
  Client -.-x Inv`,
    },
    {
      type: 'list',
      items: [
        'Facade knows subsystem classes; subsystems don’t know facade',
        'Thin orchestration — compose calls, map DTOs, handle transaction boundary',
        'Subsystems remain usable directly for advanced/power clients',
        'Often sits at application layer (use case / service facade)',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Checkout facade orchestrates subsystem',
      code: `public class CheckoutFacade {
  private final InventoryService inventory;
  private final PaymentService payment;
  private final NotificationService notifications;

  public CheckoutResult checkout(Cart cart, User user) {
    inventory.reserve(cart);
    var charge = payment.charge(cart.total(), user);
    notifications.orderConfirmed(user, cart);
    return CheckoutResult.success(charge.id());
  }
}`,
    },
  ],
  implementation: [
    {
      language: 'java',
      caption: 'SLF4J LoggerFactory — facade over logging backends',
      code: `Logger log = LoggerFactory.getLogger(CheckoutFacade.class);
// Hides log4j/logback/jul details`,
    },
  ],
  tradeoffs: {
    advantages: [
      'Reduces client coupling to subsystem',
      'Documents common workflows explicitly',
      'Easier onboarding — one place to read flow',
    ],
    disadvantages: [
      'Facade can become god orchestrator with business logic creep',
      'Hides subsystem — power users may duplicate facade poorly',
      'Testing facade requires many mocks unless subsystems faked',
    ],
    alternatives: [
      'Application service / use case class (same idea, DDD naming)',
      'Workflow engine for long-running processes',
      'Direct subsystem calls for simple cases',
    ],
    whenToUse: [
      'Multi-step workflows repeated by many clients',
      'Legacy subsystem wrap for migration',
      'Library API simplification',
    ],
    whenNotToUse: [
      'Single-class operation — unnecessary indirection',
      'When clients need fine-grained control always',
    ],
  },
  failureModes: [
    'Facade accumulates domain rules → unmaintainable megaclass',
    'Partial failure handling missing — inconsistent state across subsystems',
    'Facade bypasses subsystem invariants by reaching internals',
    'No idempotency on retried facade operations',
  ],
  production: {
    reliability: ['Define transaction/saga boundary at facade level', 'Compensating actions on partial failure'],
    maintainability: ['Keep facade thin; push rules to domain services'],
    observability: ['Single trace span for facade operation with child spans per subsystem'],
  },
  interview: {
    expectations: [
      'Facade vs Adapter vs Mediator',
      'Draw checkout facade example',
      'Warn against god facade',
    ],
    commonQuestions: [
      'What is Facade pattern?',
      'Facade vs API gateway?',
    ],
    followUps: [
      'Where put transaction boundaries?',
      'Facade in microservices?',
    ],
    misconceptions: [
      'Facade must hide subsystem completely — advanced clients can still use subsystems',
      'Same as Adapter — Adapter changes interface; Facade simplifies many',
    ],
    traps: [
      'Putting all business logic in facade',
    ],
    strongSignals: [
      'Checkout/home theater unified interface examples',
      'Thin orchestration emphasis',
    ],
  },
  keyTakeaways: [
    'One simple API over complex subsystem.',
    'Orchestrates; doesn’t replace subsystem logic.',
    'Reduces coupling for typical clients.',
    'Risk: god facade — keep thin.',
    'Application service ≈ Facade in layered architecture.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Facade pattern?', answerHint: 'Unified simplified interface to complex subsystem.' },
    { level: 'intermediate', question: 'Facade vs Adapter?', answerHint: 'Facade simplifies/coordinates many; Adapter converts one incompatible interface.' },
    { level: 'intermediate', question: 'Facade vs Mediator?', answerHint: 'Mediator coordinates peer components both ways; Facade is one-way entry for clients.' },
    { level: 'advanced', question: 'Checkout fails after payment — facade role?', answerHint: 'Orchestrate compensation/refund; define saga; don’t leave inconsistent state.' },
  ],
  flashcards: [
    { front: 'Facade', back: 'Simple API hiding complex subsystem coordination' },
    { front: 'vs Adapter', back: 'Facade simplifies many classes; Adapter translates one interface' },
    { front: 'God facade smell', back: 'Orchestrator grew all business rules — split to domain' },
    { front: 'Application service', back: 'DDD name for facade-like use case entry' },
  ],
  quickRevision: [
    'One entry, many delegates',
    'Thin orchestration only',
    'Checkout / home theater examples',
    'Subsystems still exist independently',
    'Handle partial failure / saga',
  ],
  patternRecognition: [
    'Controller calling 8 services in sequence → extract facade/use case',
    'Client copies same 10-step setup → facade candidate',
  ],
  commonMistakes: [
    'Domain validation inside facade instead of entities',
    'No rollback on step 3 failure after step 2 succeeded',
  ],
}
