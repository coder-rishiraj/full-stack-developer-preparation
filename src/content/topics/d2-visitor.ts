import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Visitor pattern separates algorithms from object structure — double dispatch: element.accept(visitor) calls visitor.visitConcreteElement(), adding operations without modifying element classes.',
  whyExists: 'Export, tax calc, validation on AST or document tree would bloat each node class. Visitor centralizes ops; new op = new visitor class.',
  mentalModel: 'Building inspector walks rooms — each room accepts inspector who records different checklist per room type without room knowing all inspection types.',
  howItWorks: [
    { type: 'list', items: [
      'Element interface: accept(Visitor v).',
      'Concrete elements call v.visitThis(this).',
      'Visitor interface: visitTypeA, visitTypeB per concrete type.',
      'New operation: new Visitor impl; structure unchanged.',
      'Requires stable element hierarchy; adding new element updates all visitors.',
    ] },
  ],
  example: [
    { type: 'code', language: 'java', code: 'interface Expr { <R> R accept(ExprVisitor<R> v); }\nclass Add implements Expr {\n  public <R> R accept(ExprVisitor<R> v) { return v.visitAdd(this); }\n}\nclass PrintVisitor implements ExprVisitor<String> {\n  public String visitAdd(Add n) { return visit(n.left) + "+" + visit(n.right); }\n}', caption: 'AST pretty-print visitor' },
  ],
  tradeoffs: {
    advantages: [
      'Open/Closed for new operations',
      'Related ops grouped in visitor',
    ],
    disadvantages: [
      'Adding new element type breaks all visitors',
      'Breaks encapsulation of internals',
    ],
    alternatives: [
      'Switch on type enum',
      'Functions per node type in map',
    ],
    whenToUse: [
      'Stable structure, many operations — compilers, AST, docs',
    ],
    whenNotToUse: [
      'Frequent new node types',
    ],
  },
  failureModes: [
    'Forget update visitor on new element',
    'Circular visitor dependency',
    'Cast instead of accept dispatch',
  ],
  production: {
    maintainability: [
      'Visitor per export format/version',
    ],
    performance: [
      'Avoid deep recursion stack overflow — iterative',
    ],
  },
  interview: {
    expectations: [
      'Double dispatch',
      'Tradeoff new op vs new type',
    ],
    commonQuestions: [
      'Visitor pattern when?',
    ],
    followUps: [
      'vs Strategy?',
    ],
    misconceptions: [
      'Same as Strategy',
    ],
    traps: [
      'Unstable hierarchy',
    ],
    strongSignals: [
      'accept/visit + new op without editing nodes',
    ],
  },
  keyTakeaways: [
    'Double dispatch accept/visit',
    'New ops via new visitor',
    'Stable element hierarchy needed',
    'Bad for frequent new types',
    'Use for AST/export pipelines',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Visitor pattern purpose?', answerHint: 'Add operations on element structure without modifying element classes.' },
    { level: 'intermediate', question: 'Double dispatch?', answerHint: 'accept calls visitor method resolved by both visitor and element types.' },
    { level: 'advanced', question: 'Visitor vs Strategy?', answerHint: 'Visitor ops vary by element type; Strategy swaps one algorithm for one context.' },
  ],
  flashcards: [
    { front: 'accept(visitor)', back: 'Element entry point for double dispatch' },
    { front: 'visitConcrete', back: 'Visitor method per element type' },
    { front: 'Stable hierarchy', back: 'Visitor fits when node types rarely change' },
  ],
  quickRevision: [
    'Double dispatch',
    'New visitor=new op',
    'Stable nodes',
    'Hard new types',
    'AST/export use case',
  ],
}
