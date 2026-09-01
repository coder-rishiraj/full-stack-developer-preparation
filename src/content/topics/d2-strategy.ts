import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Strategy is a behavioral design pattern that defines a family of interchangeable algorithms (strategies), encapsulates each one, and lets the client select the algorithm at runtime without conditional spaghetti.',
  whyExists:
    'Business rules change often — shipping fees, tax, fraud scoring, sorting, compression. Without Strategy, every new variant adds another branch to the same method. Strategy isolates variation behind a common interface so Open/Closed holds.',
  mentalModel:
    'The context object holds a reference to a strategy interface. At runtime you plug in FlatRateShipping vs WeightBasedShipping. The context delegates the varying step; stable orchestration stays in one place.',
  howItWorks: [
    {
      type: 'paragraph',
      text: 'Components: Strategy interface (algorithm contract), Concrete strategies (implementations), Context (uses strategy, may allow swapping). Often combined with dependency injection or factory to choose strategy from config or user input.',
    },
    {
      type: 'mermaid',
      caption: 'Context delegates to interchangeable strategies',
      diagram: `classDiagram
  class PricingContext {
    -strategy: PricingStrategy
    +setStrategy(s: PricingStrategy)
    +calculate(cart): Money
  }
  class PricingStrategy {
    <<interface>>
    +calculate(cart): Money
  }
  class StandardPricing
  class PremiumMemberPricing
  class FlashSalePricing
  PricingStrategy <|.. StandardPricing
  PricingStrategy <|.. PremiumMemberPricing
  PricingStrategy <|.. FlashSalePricing
  PricingContext --> PricingStrategy`,
    },
    {
      type: 'list',
      items: [
        'Select strategy: constructor injection, setter, or factory keyed by enum/config',
        'Context calls strategy.calculate() — no switch on type inside context',
        'New strategy = new class + registration; context unchanged',
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'E-commerce checkout computes total differently for members, guests, and flash-sale carts. Strategy avoids a 200-line calculateTotal with nested if/else.',
    },
    {
      type: 'code',
      language: 'typescript',
      caption: 'Strategy for pricing',
      code: `interface PricingStrategy {
  calculate(cart: Cart): Money
}

class MemberPricing implements PricingStrategy {
  calculate(cart: Cart) {
    return cart.subtotal().multiply(0.9)
  }
}

class CheckoutService {
  constructor(private pricing: PricingStrategy) {}

  total(cart: Cart) {
    return this.pricing.calculate(cart)
  }
}

// Wire at edge: new CheckoutService(new MemberPricing())`,
    },
    {
      type: 'code',
      language: 'typescript',
      caption: 'Runtime swap (e.g., A/B test or user tier)',
      code: `const strategy =
  user.tier === 'premium' ? new MemberPricing() : new StandardPricing()
checkout.setStrategy(strategy)`,
    },
  ],
  implementation: [
    {
      language: 'java',
      caption: 'Java Comparator is Strategy for sorting',
      code: `List<Order> orders = ...;
orders.sort(Comparator.comparing(Order::createdAt)); // strategy injected`,
    },
    {
      language: 'typescript',
      caption: 'Strategy registry / factory',
      code: `const PRICING: Record<Tier, PricingStrategy> = {
  guest: new StandardPricing(),
  member: new MemberPricing(),
  sale: new FlashSalePricing(),
}
const pricing = PRICING[user.tier]`,
    },
  ],
  tradeoffs: {
    advantages: [
      'Eliminates growing conditionals',
      'Each algorithm testable in isolation',
      'Runtime selection without recompile',
    ],
    disadvantages: [
      'More classes for simple two-branch logic',
      'Client must know which strategies exist or use factory',
      'Shared state between strategies can get awkward',
    ],
    alternatives: [
      'Polymorphism without explicit Strategy name (duck typing)',
      'Rule engine / DSL for complex business rules',
      'Chain of Responsibility for sequential handlers',
      'Template Method when skeleton is fixed, one step varies',
    ],
    whenToUse: [
      'Multiple algorithms for same operation',
      'Rules change independently and frequently',
      'Need to unit test each variant separately',
    ],
    whenNotToUse: [
      'Single algorithm unlikely to change',
      'Two trivial branches — inline or small function map is enough',
    ],
  },
  failureModes: [
    'Strategy interface too wide — implementations stub unused methods (ISP violation)',
    'Context recreates strategy every call — unnecessary allocation',
    'Wrong strategy selected due to missing validation at boundary',
    'Hidden global mutable strategy — race conditions in concurrent servers',
  ],
  production: {
    maintainability: ['Keep strategy selection at composition root or factory', 'Document mapping from business keys to strategy'],
    performance: ['Reuse stateless strategy instances as singletons'],
    reliability: ['Default/fallback strategy when config references unknown key'],
    observability: ['Log which strategy ran for audit (pricing, fraud)'],
  },
  interview: {
    expectations: [
      'Contrast Strategy vs Template Method vs State',
      'Show refactoring from switch to strategy',
      'Discuss where strategies are wired (DI, factory)',
    ],
    commonQuestions: [
      'Implement shipping cost with multiple carriers',
      'Strategy vs if/else — when to switch?',
    ],
    followUps: [
      'How do strategies share dependencies (e.g., rate tables)?',
      'Strategy in functional style without classes?',
    ],
    misconceptions: [
      'Strategy always requires runtime switching — compile-time injection counts',
      'Strategy and State are identical — State focuses on object lifecycle transitions',
    ],
    traps: [
      'Using Strategy for one-off boolean flag',
      'Forgetting to make context thread-safe when strategy is mutable',
    ],
    strongSignals: [
      'Names real JDK/ stdlib examples (Comparator, Compression streams)',
      'Links to SOLID Open/Closed explicitly',
    ],
  },
  keyTakeaways: [
    'Encapsulate varying algorithm; context delegates.',
    'Add new behavior by new class, not editing context.',
    'Wire strategy via DI/factory at system boundary.',
    'Stateless strategies can be shared singletons.',
    'Don’t use for trivial two-way branches.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What problem does Strategy solve?',
      answerHint: 'Replace conditionals with pluggable algorithms.',
    },
    {
      level: 'intermediate',
      question: 'Strategy vs Template Method?',
      answerHint: 'Template fixes skeleton, subclass fills steps; Strategy swaps whole algorithm.',
    },
    {
      level: 'intermediate',
      question: 'Design payment retry with exponential vs fixed backoff.',
      answerHint: 'RetryStrategy interface; two implementations; inject into job runner.',
    },
    {
      level: 'advanced',
      question: 'When is a rule engine better than Strategy?',
      answerHint: 'Many combinatorial rules, non-dev edits, hot reload — else Strategy + config.',
    },
  ],
  flashcards: [
    { front: 'Strategy pattern core idea', back: 'Encapsulate algorithms; make them interchangeable' },
    { front: 'Strategy vs State', back: 'Strategy: client picks algorithm; State: object transitions internal behavior' },
    { front: 'JDK Strategy example', back: 'java.util.Comparator' },
    { front: 'OCP link', back: 'Extend by new strategy class without modifying context' },
  ],
  quickRevision: [
    'Interface + N implementations + context delegate',
    'Kill switch/if-else on type',
    'Select via DI, factory, or config map',
    'Test each strategy alone',
    'Compare: Template Method, State, Chain of Responsibility',
  ],
  patternRecognition: [
    'switch on type or enum growing weekly → Strategy',
    'Same method name, different business rules → Strategy family',
  ],
  commonMistakes: [
    'Fat strategy interface forcing empty stubs',
    'Selecting strategy deep inside domain instead of at edge',
  ],
}
