import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'SOLID is five object-oriented design principles (Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion) that guide how to structure classes and modules so code stays testable, extensible, and safe to change.',
  whyExists:
    'Large codebases rot when every class knows too much, changes ripple unpredictably, and subclasses break callers. SOLID gives a shared vocabulary for spotting design smells before they become production incidents and interview red flags.',
  mentalModel:
    'Think of each class as a small, replaceable cog with one job, plugged into narrow interfaces. High-level policy should not depend on low-level details — both depend on abstractions. Subtypes must honor the contract of what they replace.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Principle', 'Rule of thumb', 'Violation smell'],
      rows: [
        ['S — Single Responsibility', 'One reason to change per class/module', 'God class mixing HTTP, DB, email, metrics'],
        ['O — Open/Closed', 'Extend behavior without editing stable code', 'Long if/else or switch on type for every new variant'],
        ['L — Liskov Substitution', 'Subtypes usable wherever base type is expected', 'Square extends Rectangle but breaks setWidth/setHeight'],
        ['I — Interface Segregation', 'Many small interfaces > one fat interface', 'Clients forced to implement unused methods'],
        ['D — Dependency Inversion', 'Depend on abstractions, inject concretions', 'new PostgresRepo() inside service constructor'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'Dependency Inversion: high-level module depends on interface, not concrete DB',
      diagram: `flowchart TB
  subgraph high [High-level]
    Svc[BookingService]
  end
  subgraph abstractions [Abstractions]
    RepoI[BookingRepository interface]
    PayI[PaymentGateway interface]
  end
  subgraph low [Low-level]
    Pg[PostgresBookingRepo]
    Stripe[StripeGateway]
  end
  Svc --> RepoI
  Svc --> PayI
  Pg -.implements.-> RepoI
  Stripe -.implements.-> PayI`,
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Interview framing',
      text: 'SOLID is not dogma — apply where change pressure exists. A one-off script does not need five interfaces. A payment module with three providers does.',
    },
  ],
  architecture: {
    mermaid: `classDiagram
  class PaymentProcessor {
    <<interface>>
    +charge(amount)
  }
  class StripeProcessor
  class PayPalProcessor
  class CheckoutService {
    -processor: PaymentProcessor
    +checkout(cart)
  }
  PaymentProcessor <|.. StripeProcessor
  PaymentProcessor <|.. PayPalProcessor
  CheckoutService --> PaymentProcessor`,
    caption: 'OCP + DIP: add StripeProcessor without editing CheckoutService',
  },
  example: [
    {
      type: 'paragraph',
      text: 'Before SOLID: OrderService validates input, writes SQL, sends email, logs metrics, and applies discounts in one 800-line class. Adding PayPal means editing OrderService and risking regression in email logic.',
    },
    {
      type: 'code',
      language: 'typescript',
      caption: 'SRP + DIP: separate concerns and inject dependencies',
      code: `interface OrderRepository { save(order: Order): Promise<void> }
interface Notifier { send(order: Order): Promise<void> }
interface DiscountPolicy { apply(cart: Cart): Money }

class OrderService {
  constructor(
    private repo: OrderRepository,
    private notifier: Notifier,
    private discount: DiscountPolicy,
  ) {}

  async placeOrder(cart: Cart, user: User): Promise<Order> {
    const total = this.discount.apply(cart)
    const order = Order.create(user, cart, total)
    await this.repo.save(order)
    await this.notifier.send(order)
    return order
  }
}`,
    },
    {
      type: 'code',
      language: 'typescript',
      caption: 'OCP: Strategy for new discount rules without modifying existing ones',
      code: `class SeasonalDiscount implements DiscountPolicy {
  apply(cart: Cart) { /* ... */ }
}
// Register in DI container — OrderService unchanged`,
    },
  ],
  implementation: [
    {
      language: 'typescript',
      caption: 'LSP fix: prefer composition over broken inheritance',
      code: `// Bad: Square extends Rectangle, setWidth breaks area invariant
// Good: shared Shape interface, separate width/height where needed
interface Shape { area(): number }`,
    },
    {
      language: 'typescript',
      caption: 'ISP: split fat interface',
      code: `interface Readable { read(): string }
interface Writable { write(data: string): void }
// File implements both; Logger only implements Writable`,
    },
  ],
  tradeoffs: {
    advantages: [
      'Easier unit testing via interfaces and injection',
      'New features often add classes instead of editing risky core',
      'Clear boundaries reduce merge conflicts in teams',
    ],
    disadvantages: [
      'More files and indirection for simple CRUD',
      'Over-abstraction when requirements are stable',
      'Junior devs may struggle navigating interface graphs',
    ],
    alternatives: [
      'Functional modules with plain functions',
      'Procedural scripts for one-off tooling',
      'Framework conventions (Rails, Spring) that encode parts of SOLID',
    ],
    whenToUse: [
      'Multi-provider integrations (payments, shipping, auth)',
      'Domains with frequent new variants (pricing, notifications)',
      'Codebases with parallel team ownership',
    ],
    whenNotToUse: [
      'Throwaway prototypes with no extension path',
      'Single-algorithm utilities with no variation',
    ],
  },
  failureModes: [
    'Interface explosion: one interface per method with no cohesive module',
    'LSP violations causing subtle bugs when polymorphism is used',
    'DIP without DI container → manual wiring spaghetti in main()',
    'SRP taken to extreme: class per line, unreadable navigation',
  ],
  production: {
    maintainability: [
      'Align package boundaries with SRP (billing/, notifications/)',
      'Use constructor injection in services; avoid service locator antipattern',
    ],
    performance: ['Indirection cost is negligible vs I/O; do not skip SOLID for micro-opts'],
    scalability: ['Team scalability: clear modules reduce ownership conflicts'],
    observability: ['Keep cross-cutting concerns (logging, metrics) as decorators/aspects, not duplicated in every class'],
  },
  interview: {
    expectations: [
      'Name all five principles with a concrete example each',
      'Explain tradeoff between simplicity and extensibility',
      'Refactor a smelly class live or on whiteboard',
    ],
    commonQuestions: [
      'What is Open/Closed? Example?',
      'Difference between ISP and SRP?',
      'How does DIP relate to dependency injection?',
    ],
    followUps: [
      'When would you violate SOLID intentionally?',
      'How does SOLID apply in functional languages?',
      'Show LSP violation and fix',
    ],
    misconceptions: [
      'SOLID requires inheritance — composition often satisfies OCP/LSP better',
      'Every class must have exactly one public method',
      'DIP means always using a DI framework',
    ],
    traps: [
      'Reciting definitions without linking to change scenarios',
      'Proposing abstract factory for a single concrete implementation',
    ],
    strongSignals: [
      'Maps principles to test doubles and extension points',
      'Discusses when not to apply',
      'Uses booking/payment/e-commerce examples consistently',
    ],
  },
  keyTakeaways: [
    'SRP: one reason to change; split by axis of change not by layer alone.',
    'OCP: extend via new types/strategies, not editing stable switches.',
    'LSP: subtypes must not break caller assumptions.',
    'ISP: clients depend only on methods they use.',
    'DIP: high-level policy depends on abstractions; wire concretions at the edge.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What does Single Responsibility mean?',
      answerHint: 'One reason to change; not necessarily one method.',
    },
    {
      level: 'basic',
      question: 'Why depend on interfaces instead of concrete classes?',
      answerHint: 'Testability, swap implementations, isolate high-level logic.',
    },
    {
      level: 'intermediate',
      question: 'Give an Open/Closed example for payment providers.',
      answerHint: 'PaymentProcessor interface; add Stripe without editing checkout flow.',
    },
    {
      level: 'intermediate',
      question: 'Classic Liskov violation?',
      answerHint: 'Square/Rectangle, or subclass that throws on base method.',
    },
    {
      level: 'advanced',
      question: 'Refactor a god-class OrderService with 6 responsibilities.',
      answerHint: 'Extract repo, notifier, pricing; inject; keep orchestration thin.',
    },
  ],
  flashcards: [
    { front: 'S in SOLID', back: 'Single Responsibility — one reason to change per module' },
    { front: 'O in SOLID', back: 'Open/Closed — open for extension, closed for modification' },
    { front: 'L in SOLID', back: 'Liskov Substitution — subtypes honor base contract' },
    { front: 'I in SOLID', back: 'Interface Segregation — no fat interfaces' },
    { front: 'D in SOLID', back: 'Dependency Inversion — depend on abstractions' },
  ],
  quickRevision: [
    'S: split god classes by reason to change',
    'O: strategy/new class > editing switch',
    'L: substitutability without surprise',
    'I: narrow interfaces',
    'D: inject abstractions at composition root',
    'Balance: don’t over-engineer stable code',
  ],
  patternRecognition: [
    'Growing switch on type → OCP + Strategy',
    'Hard to mock DB in tests → DIP + interface',
    'Subclass overrides method to throw → LSP smell',
  ],
  commonMistakes: [
    'Creating interfaces with only one implementation everywhere',
    'Confusing SRP with “one function per file”',
  ],
}
