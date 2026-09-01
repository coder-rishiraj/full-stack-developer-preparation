import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Factory patterns encapsulate object creation so callers depend on abstractions (Product interfaces) rather than concrete constructors. Variants: Simple Factory (single creator function), Factory Method (subclass decides which product), Abstract Factory (families of related products).',
  whyExists:
    'Direct `new ConcreteClass()` scatters construction logic, couples callers to implementations, and makes testing painful. Factories centralize creation rules, hide complex initialization, and support configuration-driven or platform-specific object graphs.',
  mentalModel:
    'Instead of the client knowing “new PostgresNotifier vs SmtpNotifier,” it asks a factory for a Notifier. The factory reads config, environment, or tenant and returns the right implementation. Creation complexity lives in one place.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Variant', 'Who creates', 'Typical use'],
      rows: [
        ['Simple Factory', 'Static method or function', 'Map string key → implementation'],
        ['Factory Method', 'Subclass overrides create method', 'Framework hooks (Document.createPage())'],
        ['Abstract Factory', 'Factory interface creates product families', 'UI toolkit: WindowsButton + WindowsCheckbox together'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'Simple Factory: client asks factory, not concrete class',
      diagram: `flowchart LR
  Client --> F[NotifierFactory.create]
  F -->|config=smtp| S[SmtpNotifier]
  F -->|config=ses| E[SesNotifier]
  F -->|config=mock| M[MockNotifier]`,
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'DI containers overlap',
      text: 'Spring/@Injectable and Nest providers are factory-like at scale. In interviews, Simple Factory + DI is often enough; mention Abstract Factory when products must stay consistent as a family (OS-themed UI widgets).',
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Multi-tenant SaaS sends email via SES in prod, Mailhog in dev, and a no-op in tests. A NotifierFactory reads env and returns the correct Notifier without services calling `new` directly.',
    },
    {
      type: 'code',
      language: 'typescript',
      caption: 'Simple Factory',
      code: `interface Notifier {
  send(msg: Message): Promise<void>
}

class NotifierFactory {
  static create(env: Env): Notifier {
    switch (env.NOTIFIER) {
      case 'ses': return new SesNotifier(env)
      case 'smtp': return new SmtpNotifier(env)
      default: return new NoOpNotifier()
    }
  }
}

// composition root
const notifier = NotifierFactory.create(process.env)
const orderService = new OrderService(notifier)`,
    },
    {
      type: 'code',
      language: 'typescript',
      caption: 'Factory Method (subclass chooses product)',
      code: `abstract class LogisticsPartner {
  abstract createLabel(shipment: Shipment): Label
  ship(s: Shipment) {
    const label = this.createLabel(s) // factory method
    return this.dispatch(label)
  }
}
class FedExPartner extends LogisticsPartner {
  createLabel(s: Shipment) { return new FedExLabel(s) }
}`,
    },
  ],
  implementation: [
    {
      language: 'typescript',
      caption: 'Registry pattern (open for extension)',
      code: `const creators = new Map<string, () => PaymentGateway>()
creators.set('stripe', () => new StripeGateway())
creators.set('paypal', () => new PayPalGateway())

export function createGateway(name: string): PaymentGateway {
  const fn = creators.get(name)
  if (!fn) throw new Error(\`Unknown gateway: \${name}\`)
  return fn()
}`,
    },
  ],
  tradeoffs: {
    advantages: [
      'Single place for construction and validation',
      'Easier mocking — inject factory or product interface',
      'Hides complex object graphs (connection pools, credentials)',
    ],
    disadvantages: [
      'Extra indirection for trivial `new Foo()`',
      'Simple Factory switch can grow like the code it replaced',
      'Abstract Factory adds many interfaces for small apps',
    ],
    alternatives: [
      'Dependency injection container auto-wiring',
      'Builder for step-by-step complex objects',
      'Prototype (clone) when creation cost is high',
    ],
    whenToUse: [
      'Creation depends on config, env, or tenant',
      'Multiple implementations of same interface',
      'Construction requires steps callers should not know',
    ],
    whenNotToUse: [
      'Single concrete type forever',
      'Value objects with public constructors and no variation',
    ],
  },
  failureModes: [
    'Factory becomes god switch — register pattern or plugin discovery',
    'Returning new instance every call when singleton pool needed',
    'Leaking concrete type from factory (return type must be interface)',
    'Circular dependency between factory and products',
  ],
  production: {
    maintainability: ['Keep composition root thin; factories live at app bootstrap'],
    reliability: ['Validate config at startup, not first request'],
    security: ['Never construct clients with secrets inside domain layer'],
    observability: ['Log which implementation was selected at startup'],
  },
  interview: {
    expectations: [
      'Distinguish Simple Factory, Factory Method, Abstract Factory',
      'Relate to DIP and composition root',
      'Design factory for multi-provider payment or storage',
    ],
    commonQuestions: [
      'Why not just use new?',
      'Factory vs Builder?',
      'Design object creation for test vs prod',
    ],
    followUps: [
      'How would you add a new provider without editing factory?',
      'Factory Method in framework design?',
    ],
    misconceptions: [
      'Every class needs a factory',
      'Factory Method and Abstract Factory are the same',
      'Static factory methods on domain entities are always good (often prefer separate factory)',
    ],
    traps: [
      'Overusing Abstract Factory for unrelated single objects',
      'Factory that returns different concrete types without common interface',
    ],
    strongSignals: [
      'Composition root wiring',
      'Registry + plugin model for OCP',
      'Clear return type as interface',
    ],
  },
  keyTakeaways: [
    'Centralize creation; callers depend on interfaces.',
    'Simple Factory: one function maps config → product.',
    'Factory Method: subclass overrides creation hook.',
    'Abstract Factory: consistent families of products.',
    'Pair with DI at application bootstrap.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Why use a factory instead of new?',
      answerHint: 'Decouple from concrete class; centralize config and complex setup.',
    },
    {
      level: 'intermediate',
      question: 'Factory vs Builder?',
      answerHint: 'Factory: which type; Builder: step-by-step assembly of one complex object.',
    },
    {
      level: 'intermediate',
      question: 'Design storage factory for S3 vs local disk.',
      answerHint: 'Storage interface; factory reads env; inject into service.',
    },
    {
      level: 'advanced',
      question: 'Extend factory for plugins without modifying core switch?',
      answerHint: 'Registry map; modules register at startup; fail fast on unknown key.',
    },
  ],
  flashcards: [
    { front: 'Simple Factory', back: 'One creator selects concrete implementation' },
    { front: 'Factory Method', back: 'Subclass decides which product to instantiate' },
    { front: 'Abstract Factory', back: 'Creates families of related products' },
    { front: 'Factory vs Builder', back: 'Factory picks type; Builder assembles steps' },
  ],
  quickRevision: [
    'Hide new; return interface',
    'Simple / Method / Abstract variants',
    'Wire at composition root',
    'Registry for OCP extension',
    'Startup validate config',
  ],
  patternRecognition: [
    'Scattered new ConcreteX() with env checks → factory',
    'UI components must match same theme → Abstract Factory',
  ],
  commonMistakes: [
    'Factory returning concrete types to callers expecting abstraction',
    'God factory with 50-case switch and no registration',
  ],
}
