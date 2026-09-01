import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Adapter is a structural pattern that wraps an incompatible interface (adaptee) behind a target interface clients already expect — making legacy or third-party APIs usable without changing client code.',
  whyExists:
    'Integrations bring mismatched APIs: your `PaymentGateway.charge(Money)` vs vendor’s `processPayment(double, String currencyCode)`. Rewriting every caller is expensive. Adapter translates calls at the boundary.',
  mentalModel:
    'Power plug adapter: device expects UK socket; wall is US. Adapter sits between — same device, no rewiring. Client talks Target; adapter delegates to Adaptee with translation.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Variant', 'Structure', 'When'],
      rows: [
        ['Object adapter', 'Adapter holds adaptee instance, implements target', 'Most common — composition'],
        ['Class adapter', 'Adapter extends adaptee + implements target', 'Rare — multiple inheritance languages'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'Client → Target interface → Adapter → Adaptee',
      diagram: `flowchart LR
  Client --> Target[PaymentGateway]
  Target --> Adapter[StripeAdapter]
  Adapter --> Adaptee[Stripe SDK]
  Client -.-x Adaptee`,
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Legacy `LegacyLogger.log(String msg, int level)` must work with new `Logger.info(String)`. Adapter implements `Logger` and maps levels to legacy ints.',
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Object adapter for payment SDK',
      code: `public interface PaymentGateway {
  Receipt charge(Money amount, Customer customer);
}

public class StripeAdapter implements PaymentGateway {
  private final com.stripe.StripeClient stripe;

  public StripeAdapter(com.stripe.StripeClient stripe) {
    this.stripe = stripe;
  }

  public Receipt charge(Money amount, Customer customer) {
    var req = Map.of(
      "amount", amount.cents(),
      "currency", amount.currency(),
      "customer", customer.stripeId()
    );
    var result = stripe.charges().create(req);
    return new Receipt(result.getId(), result.getStatus());
  }
}`,
    },
  ],
  implementation: [
    {
      language: 'java',
      caption: 'Collections.enumeration — JDK adapter example',
      code: `// Adapts Iterator to legacy Enumeration interface
Enumeration<E> e = Collections.enumeration(list);`,
    },
  ],
  tradeoffs: {
    advantages: [
      'Clients stay on stable domain interface',
      'Swap vendors by swapping adapter',
      'Isolates third-party types from domain',
    ],
    disadvantages: [
      'Extra layer and mapping code',
      'Feature gap if adaptee cannot express target contract',
      'Can hide performance quirks of adaptee',
    ],
    alternatives: [
      'Anti-corruption layer (DDD) — broader boundary module',
      'Facade when simplifying many classes not just interface mismatch',
      'Direct SDK use in one infra module (no adapter name, same idea)',
    ],
    whenToUse: [
      'Third-party SDK integration',
      'Legacy system wrap during migration',
      'Testing against target with fake adapter',
    ],
    whenNotToUse: [
      'Greenfield where you own both sides — align interfaces instead',
    ],
  },
  failureModes: [
    'Leaky adapter exposing adaptee types in return values',
    'Incomplete mapping — silent data loss on translate',
    'Adapter becomes god class with 50 mapping methods',
    'Error translation missing — vendor errors confuse callers',
  ],
  production: {
    maintainability: [
      'One adapter per external system',
      'Map errors to domain exceptions',
      'Contract tests against vendor sandbox via adapter',
    ],
    reliability: ['Circuit-break adaptee calls inside adapter'],
  },
  interview: {
    expectations: [
      'Draw client-target-adapter-adaptee',
      'Contrast Adapter vs Facade vs Decorator',
      'Real integration example',
    ],
    commonQuestions: [
      'Adapter vs Facade?',
      'Wrap legacy API example?',
    ],
    followUps: [
      'Anti-corruption layer?',
      'Where place adapter in hexagonal arch?',
    ],
    misconceptions: [
      'Adapter changes adaptee — it wraps, adaptee unchanged',
      'Same as proxy — proxy controls access; adapter changes interface',
    ],
    traps: [
      'Confusing with Decorator (adds behavior vs changes interface)',
    ],
    strongSignals: [
      'Stripe/PayPal payment example',
      'Infrastructure layer placement',
    ],
  },
  keyTakeaways: [
    'Makes incompatible interface fit expected target.',
    'Object adapter via composition is default.',
    'Boundary pattern for third-party and legacy.',
    'Not Facade (simplify many) or Decorator (add behavior).',
    'Keep domain free of SDK types.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'What does Adapter do?', answerHint: 'Wraps adaptee to implement interface client expects.' },
    { level: 'intermediate', question: 'Adapter vs Facade?', answerHint: 'Adapter = interface conversion; Facade = simplified entry to subsystem.' },
    { level: 'intermediate', question: 'Adapter vs Decorator?', answerHint: 'Decorator same interface adds behavior; Adapter different interface translation.' },
    { level: 'advanced', question: 'Anti-corruption layer?', answerHint: 'DDD boundary module with adapters translating external model to domain.' },
  ],
  flashcards: [
    { front: 'Adapter', back: 'Convert adaptee interface to target client expects' },
    { front: 'Object adapter', back: 'Implements target, delegates to adaptee instance' },
    { front: 'vs Facade', back: 'Facade simplifies subsystem; Adapter translates interface' },
    { front: 'vs Decorator', back: 'Decorator enhances same interface; Adapter changes it' },
  ],
  quickRevision: [
    'Target ← Adapter → Adaptee',
    'Composition over class adapter',
    'Payment SDK classic example',
    'Infra/boundary layer',
    'Map errors to domain',
  ],
  patternRecognition: [
    'Domain imports com.stripe.* → need adapter',
    'Legacy XML API vs REST client interface',
  ],
  commonMistakes: [
    'Returning SDK types from domain services',
    'Adapter doing business logic not translation',
  ],
}
