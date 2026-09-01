import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Observer is a behavioral pattern where a subject maintains a list of dependents (observers) and notifies them automatically when its state changes — enabling loose coupling between event producers and consumers.',
  whyExists:
    'Without Observer, subjects call concrete handlers directly (`emailUser(); updateAnalytics(); refreshCache()`) — every new reaction requires editing the subject. Observer decouples “state changed” from “who cares,” supporting open-ended subscribers.',
  mentalModel:
    'Subject is a radio tower broadcasting events; observers tune in and react independently. Subject knows observer interface, not concrete classes. One-to-many dependency: one state change, many updates.',
  howItWorks: [
    {
      type: 'mermaid',
      caption: 'Subject notifies all registered observers',
      diagram: `classDiagram
  class Subject {
    -observers: List~Observer~
    +attach(o: Observer)
    +detach(o: Observer)
    +notify()
  }
  class Observer {
    <<interface>>
    +update(event)
  }
  class EmailObserver
  class MetricsObserver
  Observer <|.. EmailObserver
  Observer <|.. MetricsObserver
  Subject --> Observer`,
    },
    {
      type: 'list',
      items: [
        'Subject: register/unregister observers; notify on state change',
        'Observer: update(event) or onOrderPlaced(order)',
        'Push model: subject sends full state; pull: observer queries subject',
        'Often replaced in production by event bus, pub/sub, or reactive streams',
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Order placed → notify inventory, email, analytics without OrderService knowing each listener. New fraud check = new observer, no edit to Order aggregate.',
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Classic Observer sketch',
      code: `public interface OrderObserver {
  void onOrderPlaced(Order order);
}

public class OrderService {
  private final List<OrderObserver> observers = new ArrayList<>();

  public void attach(OrderObserver o) { observers.add(o); }

  public void placeOrder(Order order) {
    repository.save(order);
    observers.forEach(o -> o.onOrderPlaced(order));
  }
}`,
    },
  ],
  implementation: [
    {
      language: 'java',
      caption: 'Java PropertyChangeListener is built-in Observer',
      code: `bean.addPropertyChangeListener(evt -> log.info("changed: {}", evt));`,
    },
    {
      language: 'typescript',
      caption: 'EventEmitter / RxJS as modern Observer',
      code: `orderEvents.on('placed', (order) => analytics.track(order))`,
    },
  ],
  tradeoffs: {
    advantages: [
      'Open/Closed — add observers without changing subject',
      'Runtime subscription/unsubscription',
      'Clear separation of core logic and side effects',
    ],
    disadvantages: [
      'Notification order may matter but is implicit',
      'Memory leaks if observers not detached',
      'Hard to trace flow vs explicit calls (debugging)',
      'Synchronous notify blocks subject on slow observer',
    ],
    alternatives: [
      'Domain events + message queue (async, durable)',
      'Reactive streams (backpressure aware)',
      'Explicit orchestration in application service',
    ],
    whenToUse: [
      'UI model-view binding',
      'In-process domain events with few subscribers',
      'Plugin architectures',
    ],
    whenNotToUse: [
      'Distributed side effects needing durability — use queue',
      'Strict ordering/transactions across handlers',
    ],
  },
  failureModes: [
    'Observer throws → breaks others unless isolated',
    'Circular updates: A notifies B notifies A',
    'Forgotten detach → zombie listeners on long-lived subjects',
    'Thundering herd on every tiny state change',
  ],
  production: {
    reliability: ['Wrap observer calls in try/catch; dead-letter failed handlers', 'Prefer async bus for cross-service reactions'],
    performance: ['Debounce high-frequency notifications', 'Filter events observers don’t need'],
    observability: ['Trace event IDs through observer chain'],
  },
  interview: {
    expectations: [
      'Draw subject-observer diagram',
      'Contrast with Mediator and pub/sub',
      'Discuss sync vs async notification',
    ],
    commonQuestions: [
      'Implement stock price notifier',
      'Observer vs pub/sub?',
      'Memory leak scenario?',
    ],
    followUps: [
      'How implement thread-safe observer list?',
      'Push vs pull model?',
    ],
    misconceptions: [
      'Observer always async — often synchronous in-process',
      'Same as callback hell — structured with interface',
    ],
    traps: [
      'Not mentioning leak from missing detach',
    ],
    strongSignals: [
      'Mentions event bus evolution for microservices',
      'Isolates observer failures',
    ],
  },
  keyTakeaways: [
    'One-to-many notify on state change.',
    'Subject depends on Observer interface only.',
    'Add subscribers without editing subject (OCP).',
    'Production often evolves to event bus/queue.',
    'Watch leaks, order, and synchronous blocking.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'What problem does Observer solve?', answerHint: 'Decouple state change from reactions; dynamic subscription.' },
    { level: 'intermediate', question: 'Observer vs pub/sub?', answerHint: 'Observer usually in-process direct list; pub/sub often async broker, topics, durability.' },
    { level: 'intermediate', question: 'Push vs pull?', answerHint: 'Push sends data in notify; pull observer queries subject state.' },
    { level: 'advanced', question: 'Order placed — sync observers or queue?', answerHint: 'Email/analytics async via outbox/queue; in-process OK for UI only.' },
  ],
  flashcards: [
    { front: 'Observer', back: 'Subject notifies registered observers on change' },
    { front: 'OCP link', back: 'New observer class without modifying subject' },
    { front: 'Leak risk', back: 'Long-lived subject + attached observer never removed' },
    { front: 'Modern equivalent', back: 'EventEmitter, domain events, Kafka topics' },
  ],
  quickRevision: [
    'attach / notify / detach',
    'Interface for observers',
    'Sync default; queue at scale',
    'Isolate observer errors',
    'UI binding classic use case',
  ],
  patternRecognition: [
    'Growing list of post-commit hooks in one method → Observer or events',
    'Model change updates 5 UI panels → Observer/MVC',
  ],
  commonMistakes: [
    'Notifying before transaction commits',
    'Heavy work in synchronous notify',
  ],
}
