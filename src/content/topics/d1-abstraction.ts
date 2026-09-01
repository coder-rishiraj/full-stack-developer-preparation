import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Abstraction is the design technique of exposing essential behavior while hiding irrelevant implementation detail — users interact with a simplified model (interface, API, base class) without knowing how it works underneath.',
  whyExists:
    'Complex systems (DB drivers, payment gateways, file systems) are unusable if every caller must understand wire protocols. Abstraction lets teams swap implementations, compose layers, and reason at the right level of detail.',
  mentalModel:
    'Think “what” not “how.” A `Storage` interface has `put/get/delete`; callers don’t care if backend is S3, disk, or memory. Each layer abstracts the layer below — HTTP abstracts TCP, ORM abstracts SQL.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Mechanism', 'What it hides', 'Example'],
      rows: [
        ['Interface / abstract class', 'Algorithm and dependencies', 'PaymentGateway.charge()'],
        ['Facade', 'Subsystem complexity', 'CheckoutFacade wraps inventory + tax + payment'],
        ['API contract', 'Internal service topology', 'REST /users/{id}'],
        ['Named module boundary', 'File/package structure', 'billing/ vs notifications/'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'Layers of abstraction',
      diagram: `flowchart TB
  App[Application logic]
  App --> PG[PaymentGateway interface]
  PG --> Stripe[Stripe impl]
  PG --> PayPal[PayPal impl]
  App -.-x Stripe`,
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'Abstraction vs encapsulation',
      text: 'Encapsulation hides state inside an object. Abstraction hides entire subsystems or algorithms behind a contract. They often work together — interface (abstraction) with private fields (encapsulation).',
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'OrderService depends on `NotificationSender` — email vs SMS vs push is irrelevant to checkout flow. Swap SendGrid for SES without touching OrderService.',
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Interface abstracts delivery channel',
      code: `public interface NotificationSender {
  void send(User user, Message message);
}

public class OrderService {
  private final NotificationSender sender;
  public OrderService(NotificationSender sender) { this.sender = sender; }

  public void placeOrder(Order order) {
    // ... persist order
    sender.send(order.getUser(), Message.orderConfirmed(order));
  }
}`,
    },
  ],
  implementation: [
    {
      language: 'java',
      caption: 'Abstract class when shared skeleton exists',
      code: `public abstract class BaseExporter {
  public final void export(Data data) {
    validate(data);
    write(transform(data));
  }
  protected abstract void write(byte[] bytes);
}`,
    },
  ],
  tradeoffs: {
    advantages: [
      'Reduces cognitive load — work at problem domain level',
      'Enables substitution and parallel development',
      'Localizes change when implementation evolves',
    ],
    disadvantages: [
      'Wrong abstraction leaks — callers still need escape hatches',
      'Too many layers obscure debugging (where did bug happen?)',
      'Premature abstraction before requirements stabilize',
    ],
    alternatives: [
      'Concrete classes when only one implementation forever',
      'Configuration flags instead of interface hierarchy',
      'Procedural functions with clear names (no OOP ceremony)',
    ],
    whenToUse: [
      'Multiple implementations or expected variation',
      'Cross-team boundaries and plugin points',
      'Hiding third-party SDK complexity',
    ],
    whenNotToUse: [
      'Single stable algorithm with no variation',
      'Performance-critical hot path where indirection hurts (rare)',
    ],
  },
  failureModes: [
    'Leaky abstraction: SQL exceptions bubble to HTTP layer unchanged',
    'God interface: 40 methods forcing empty stubs',
    'Abstraction inversion: low-level details exposed in API (S3 bucket paths)',
    'Wrong level: abstracting unstable code that changes weekly',
  ],
  production: {
    maintainability: ['Name abstractions by domain capability, not technology', 'Version interfaces when breaking changes unavoidable'],
    observability: ['Trace through abstraction boundaries with correlation IDs'],
    performance: ['Avoid deep abstraction stacks on hot paths without profiling'],
  },
  interview: {
    expectations: [
      'Define abstraction with concrete example',
      'Contrast with encapsulation and inheritance',
      'Identify good vs leaky abstraction',
    ],
    commonQuestions: [
      'What is abstraction in OOP?',
      'Interface vs abstract class?',
      'Give example of leaky abstraction',
    ],
    followUps: [
      'When is abstraction harmful?',
      'How does abstraction relate to DIP?',
    ],
    misconceptions: [
      'Abstraction always means interface keyword',
      'More abstraction layers = better design',
    ],
    traps: [
      'Confusing abstraction with simplification (hiding wrong things)',
    ],
    strongSignals: [
      'Payment/storage/logging examples with swap story',
      'Mentions stable abstractions depend on unstable concretions (DIP)',
    ],
  },
  keyTakeaways: [
    'Expose what, hide how — essential vs incidental complexity.',
    'Interfaces and facades are primary abstraction tools.',
    'Good abstraction survives implementation changes.',
    'Leaky abstractions force callers to know internals anyway.',
    'Pair with encapsulation; don’t abstract before variation exists.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'What is abstraction?', answerHint: 'Simplified view of capability; hide implementation detail.' },
    { level: 'intermediate', question: 'Abstraction vs encapsulation?', answerHint: 'Abstraction = contract/model; encapsulation = hidden state in object.' },
    { level: 'intermediate', question: 'Leaky abstraction example?', answerHint: 'File upload API exposing filesystem paths or ORM exposing raw SQL errors.' },
    { level: 'advanced', question: 'When to introduce an interface?', answerHint: 'Second implementation, testing seam, or stable boundary between teams/modules.' },
  ],
  flashcards: [
    { front: 'Abstraction', back: 'Show essential behavior; hide implementation' },
    { front: 'Leaky abstraction', back: 'Caller forced to know hidden details to use API correctly' },
    { front: 'Facade', back: 'Single entry simplifying many subsystems' },
    { front: 'Abstraction vs encapsulation', back: 'Contract vs hidden object state' },
  ],
  quickRevision: [
    'Interface hides implementation',
    'Layers: HTTP → service → repo',
    'Avoid premature abstraction',
    'Name by capability not tech',
    'Watch for leaky exceptions/APIs',
  ],
  patternRecognition: [
    'Direct imports of Stripe SDK in 20 services → extract PaymentGateway',
    'Callers parsing S3 URLs → storage abstraction leaking',
  ],
  commonMistakes: [
    'Interface with one implementation “for future”',
    'Abstract class used when no shared code exists',
  ],
}
