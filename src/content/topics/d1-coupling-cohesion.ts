import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Coupling measures how much one module depends on another’s internals; cohesion measures how closely elements within a module belong together. High cohesion + low coupling is the target — modules do one job well and talk through narrow interfaces.',
  whyExists:
    'Tightly coupled code ripples: change database column → fix 40 controllers. Low-cohesion classes mix unrelated responsibilities → hard to test, name, or reuse. These metrics predict maintainability better than line count.',
  mentalModel:
    'Cohesion: “Does everything in this class change for the same reason?” Coupling: “If I change module B, how many modules break?” Aim for modules that are internally focused and externally dumb — expose small APIs.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Coupling type', 'Severity', 'Fix'],
      rows: [
        ['Content (direct field access)', 'Worst', 'Encapsulate; use methods'],
        ['Common (shared global state)', 'High', 'Inject dependencies; isolate state'],
        ['Control (passing flags)', 'Medium', 'Strategy/polymorphism instead of flags'],
        ['Stamp (pass whole object, use one field)', 'Medium', 'Pass only needed data (primitives/DTO slice)'],
        ['Data (via parameters)', 'Acceptable', 'Preferred for loose coupling'],
        ['Message (events/async)', 'Loose', 'Event-driven boundaries'],
      ],
    },
    {
      type: 'table',
      headers: ['Cohesion type', 'Quality'],
      rows: [
        ['Functional (single task)', 'Best'],
        ['Sequential (pipeline steps)', 'Good'],
        ['Communicational (same data)', 'OK'],
        ['Temporal (same time, unrelated)', 'Weak'],
        ['Logical (grouped by category only)', 'Poor'],
        ['Coincidental (random dump)', 'Worst'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'Low coupling: services depend on interfaces',
      diagram: `flowchart LR
  OrderSvc --> OrderRepoI[OrderRepository]
  OrderRepoI --> PgRepo[PostgresRepo]
  OrderSvc --> NotifierI[Notifier]
  NotifierI --> Email[EmailNotifier]`,
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'High coupling: `ReportService` imports `PostgresConnection`, runs raw SQL, formats PDF, emails result. Change DB → touch report code. Split: `ReportGenerator`, `ReportRepository`, `ReportDelivery` with interfaces — each cohesive module, coupled only via contracts.',
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Reduce stamp coupling — pass needed values',
      code: `// Bad: entire User object for email only
void sendReceipt(User user, Order order);

// Better
void sendReceipt(String email, OrderSummary summary);`,
    },
  ],
  tradeoffs: {
    advantages: [
      'Loose coupling enables independent deploy and test',
      'High cohesion makes modules understandable in isolation',
      'Easier parallel team ownership',
    ],
    disadvantages: [
      'Extreme decoupling → many tiny interfaces and indirection',
      'Event-driven loose coupling complicates debugging trace',
      'Premature modularization before boundaries are clear',
    ],
    alternatives: [
      'Monolith modules with clear package boundaries (modular monolith)',
      'Microservices for organizational coupling (not performance default)',
    ],
    whenToUse: [
      'Refactoring god classes and spaghetti imports',
      'Designing package/module boundaries in reviews',
      'Evaluating whether to extract a microservice',
    ],
    whenNotToUse: [
      'Optimizing coupling metrics on throwaway prototype',
    ],
  },
  failureModes: [
    'Stringly-typed events — hidden coupling via magic strings',
    'Shared mutable singletons coupling all tests',
    'Over-splitting: 5 classes for 20-line feature (low cohesion across files)',
    'Circular dependencies between packages',
  ],
  production: {
    maintainability: ['Enforce dependency direction (domain → infra, not reverse)', 'ArchUnit/layer checks in CI'],
    scalability: ['Organizational scalability via bounded contexts'],
    observability: ['Coupling pain shows as wide blast radius in incidents'],
  },
  interview: {
    expectations: [
      'Define coupling and cohesion clearly',
      'Give before/after refactor example',
      'Relate to SRP and DIP',
    ],
    commonQuestions: [
      'What is high cohesion?',
      'Types of coupling?',
      'How reduce coupling between services?',
    ],
    followUps: [
      'Coupling in microservices vs monolith?',
      'Is zero coupling possible?',
    ],
    misconceptions: [
      'Microservices automatically mean low coupling',
      'Coupling is always bad — some data coupling is fine',
    ],
    traps: [
      'Confusing cohesion with performance',
    ],
    strongSignals: [
      'Mentions stamp/control coupling with fixes',
      'SRP as path to cohesion',
    ],
  },
  keyTakeaways: [
    'High cohesion: one reason to change inside module.',
    'Low coupling: depend on abstractions, minimal surface area.',
    'Data/message coupling preferred over content/common.',
    'God class = low cohesion + high coupling hub.',
    'SRP and DIP are practical tools to improve both.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Define cohesion and coupling.', answerHint: 'Cohesion = internal focus; coupling = inter-module dependency.' },
    { level: 'intermediate', question: 'Worst type of coupling?', answerHint: 'Content coupling — direct manipulation of internals.' },
    { level: 'intermediate', question: 'How does DIP reduce coupling?', answerHint: 'Depend on interface; swap implementation without changing consumer.' },
    { level: 'advanced', question: 'Detect circular coupling in monolith?', answerHint: 'Dependency graphs, package rules, arch tests, split by domain events.' },
  ],
  flashcards: [
    { front: 'High cohesion', back: 'Module elements belong together; single clear purpose' },
    { front: 'Low coupling', back: 'Minimal dependency between modules; narrow interfaces' },
    { front: 'Stamp coupling', back: 'Pass whole structure when only part needed' },
    { front: 'Functional cohesion', back: 'All parts contribute to one well-defined task' },
  ],
  quickRevision: [
    'Cohesion inside, coupling between',
    'SRP → cohesion',
    'DIP/interfaces → lower coupling',
    'Avoid globals and content coupling',
    'Modular monolith before microservices',
  ],
  patternRecognition: [
    'Import graph fans into one util class → cohesion smell',
    'Feature needs 6 packages touched → coupling smell',
  ],
  commonMistakes: [
    'Extracting microservice while sharing DB tables (hidden coupling)',
    'DTO with 40 fields passed everywhere (stamp coupling)',
  ],
}
