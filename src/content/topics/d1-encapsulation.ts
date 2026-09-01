import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Encapsulation is the OOP principle of bundling data (fields) with the methods that operate on that data, and hiding internal representation behind a controlled public interface so invariants are enforced at the boundary.',
  whyExists:
    'Without encapsulation, any module can mutate shared state directly — balance goes negative, order status jumps illegally, concurrent threads corrupt collections. Encapsulation localizes change: callers depend on behavior, not field layout.',
  mentalModel:
    'Treat each object as a capsule with a small API (getters/setters or domain methods). Internal fields are private; the object validates every mutation. “Tell, don’t ask” — prefer `account.withdraw(50)` over reading balance and setting it externally.',
  howItWorks: [
    {
      type: 'list',
      items: [
        'Hide fields (private/protected); expose only intentional operations',
        'Validate in setters and domain methods — reject invalid states early',
        'Return defensive copies or immutable views when exposing collections',
        'Keep invariants inside the class: “balance ≥ 0”, “status transitions legal”',
      ],
    },
    {
      type: 'mermaid',
      caption: 'Callers interact with public API; internals stay hidden',
      diagram: `flowchart LR
  Client -->|withdraw 50| Account
  subgraph capsule [Account capsule]
    API[public methods]
    State[private fields]
    API --> State
  end
  Client -.-x State`,
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Encapsulation ≠ getters/setters everywhere',
      text: 'Anemic models expose all fields with dumb accessors — behavior leaks to services. Rich domain objects encapsulate rules: `Order.cancel()` checks state instead of `order.setStatus(CANCELLED)` from outside.',
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Bank account: external code must not set `balance` directly. Withdraw checks funds, logs audit, updates balance atomically inside the class.',
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Encapsulated domain object with invariant',
      code: `public class BankAccount {
  private BigDecimal balance;

  public BankAccount(BigDecimal initial) {
    if (initial.compareTo(BigDecimal.ZERO) < 0)
      throw new IllegalArgumentException("negative initial balance");
    this.balance = initial;
  }

  public void withdraw(BigDecimal amount) {
    if (amount.compareTo(balance) > 0)
      throw new InsufficientFundsException();
    balance = balance.subtract(amount);
  }

  public BigDecimal getBalance() { return balance; }
}`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Defensive copy when exposing mutable internals',
      code: `public List<String> getTags() {
  return Collections.unmodifiableList(tags);
}`,
    },
  ],
  implementation: [
    {
      language: 'java',
      caption: 'Package-private for module-level encapsulation',
      code: `// Same package collaborators; other packages use public API only
class OrderRepository { /* package-private */ }`,
    },
    {
      language: 'typescript',
      caption: 'TS: private fields + readonly where state never changes after build',
      code: `class Cart {
  #items: LineItem[] = []
  add(item: LineItem) { this.#items.push(item) }
  total() { return this.#items.reduce((s, i) => s + i.price, 0) }
}`,
    },
  ],
  tradeoffs: {
    advantages: [
      'Invariants enforced in one place',
      'Implementation can change without breaking callers',
      'Easier reasoning about concurrent access boundaries',
    ],
    disadvantages: [
      'More boilerplate than public fields in prototypes',
      'Over-encapsulation hides useful batch operations',
      'Getter/setter-only classes add indirection without behavior',
    ],
    alternatives: [
      'Immutable value objects with no setters',
      'Module pattern / closures in JS for private state',
      'Records with validated factory methods',
    ],
    whenToUse: [
      'Domain entities with business rules',
      'Shared mutable state across modules',
      'Libraries where internal structure may evolve',
    ],
    whenNotToUse: [
      'Plain DTOs crossing wire with no behavior',
      'Internal one-file scripts with no external consumers',
    ],
  },
  failureModes: [
    'Leaky encapsulation: returning mutable internal collections',
    'Anemic domain: all logic in services, entities are structs',
    'Validation only in UI — API bypass corrupts data',
    'Reflection/serialization bypassing private fields in unsafe ways',
  ],
  production: {
    maintainability: ['Keep validation on write paths in domain layer', 'Document which methods are side-effect free'],
    security: ['Do not expose internal IDs or tokens via getters without need'],
    reliability: ['Encapsulate retry/idempotency state inside client wrappers'],
  },
  interview: {
    expectations: [
      'Define encapsulation beyond “private fields”',
      'Contrast with abstraction; show invariant enforcement',
      'Discuss anemic vs rich domain models',
    ],
    commonQuestions: [
      'What is encapsulation?',
      'Difference between encapsulation and data hiding?',
      'Why not make all fields public in a small class?',
    ],
    followUps: [
      'How does encapsulation help testing?',
      'Encapsulation in functional style?',
    ],
    misconceptions: [
      'Encapsulation requires getters/setters for every field',
      'public record = no encapsulation (factory validation still applies)',
    ],
    traps: [
      'Describing only access modifiers without invariants',
      'Confusing encapsulation with security (private ≠ encrypted)',
    ],
    strongSignals: [
      'Mentions tell-don’t-ask and defensive copies',
      'Shows withdraw/cancel with validation inside class',
    ],
  },
  keyTakeaways: [
    'Bundle data + behavior; hide representation.',
    'Enforce invariants at object boundary, not in callers.',
    'Prefer domain methods over dumb setters.',
    'Return unmodifiable views for collections.',
    'Encapsulation enables safe refactoring of internals.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'What is encapsulation?', answerHint: 'Hide internal state; expose controlled interface; enforce rules.' },
    { level: 'basic', question: 'Why use private fields?', answerHint: 'Prevent external code breaking invariants or depending on layout.' },
    { level: 'intermediate', question: 'What is an anemic domain model?', answerHint: 'Entities with only getters/setters; logic lives elsewhere — weak encapsulation.' },
    { level: 'intermediate', question: 'Defensive copy — when?', answerHint: 'When returning mutable internal collections or dates.' },
    { level: 'advanced', question: 'Encapsulation vs immutability?', answerHint: 'Immutability is a strong form; encapsulation can still hide mutable internals with controlled mutation API.' },
  ],
  flashcards: [
    { front: 'Encapsulation', back: 'Bundle data + methods; hide internals; controlled API' },
    { front: 'Tell, don’t ask', back: 'Call behavior on object instead of pulling state and deciding externally' },
    { front: 'Defensive copy', back: 'Return copy/unmodifiable view so caller cannot mutate internal state' },
    { front: 'Anemic model smell', back: 'Data class with no behavior; rules scattered in services' },
  ],
  quickRevision: [
    'Private fields + public domain methods',
    'Validate on every mutation path',
    'Unmodifiable list returns',
    'Tell, don’t ask',
    'Not the same as encryption/security',
  ],
  patternRecognition: [
    'Service class checks entity fields before every update → move logic into entity',
    'getItems() returns internal ArrayList → defensive copy smell',
  ],
  commonMistakes: [
    'Auto-generated getters/setters with zero validation',
    'Exposing mutable Date or collection references',
  ],
}
