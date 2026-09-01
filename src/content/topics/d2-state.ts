import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'State pattern lets object alter behavior when internal state changes — appears as if object changed class. Context delegates to State interface implementations; transitions replace current state object instead of giant switch on enum.',
  whyExists:
    'Order with status NEW/PAID/SHIPPED/CANCELLED accumulates if-else transitions violating Open/Closed. Each state class encapsulates allowed actions and next states — invalid transitions throw or no-op at type level.',
  mentalModel:
    'Vending machine modes: idle, hasMoney, dispensing. Same button means different things per mode. Context holds current State object; button press calls state.onButton(); state may context.setState(new DispensingState()).',
  howItWorks: [
    {
      type: 'mermaid',
      caption: 'Order state transitions',
      diagram: `stateDiagram-v2
  [*] --> Created
  Created --> Paid: pay()
  Created --> Cancelled: cancel()
  Paid --> Shipped: ship()
  Paid --> Refunded: refund()
  Shipped --> Delivered: deliver()
  Cancelled --> [*]
  Delivered --> [*]`,
    },
    {
      type: 'list',
      items: [
        'Context: holds state reference + delegate methods to state.handle().',
        'Concrete states implement same interface; know valid transitions.',
        'State objects can be singleton flyweights if stateless.',
        'Alternative: enum + transition map table for simpler finite machines.',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'TCP connection style state pattern',
      code: `public class OrderContext {
  private OrderState state = new CreatedState();

  public void pay() { state = state.pay(this); }
  public void ship() { state = state.ship(this); }
  void setState(OrderState s) { this.state = s; }
}

public class CreatedState implements OrderState {
  public OrderState pay(OrderContext ctx) {
    chargePayment();
    ctx.setState(new PaidState());
    return ctx.getState();
  }
  public OrderState ship(OrderContext ctx) {
    throw new IllegalStateException("Cannot ship unpaid order");
  }
}`,
    },
  ],
  implementation: [
    {
      language: 'java',
      caption: 'Spring StateMachine alternative for complex flows',
      code: `// spring-statemachine for explicit events/transitions config
// State pattern manual for interview LLD clarity`,
    },
  ],
  tradeoffs: {
    advantages: ['Eliminates sprawling switch/if', 'Transition rules localized per state', 'Open/Closed new states'],
    disadvantages: ['Many classes for simple FSM', 'State explosion combinatorial', 'Transition logic split across files'],
    alternatives: ['Enum + switch for 3-state simple cases', 'State machine library', 'Workflow engine Camunda'],
    whenToUse: ['Object behavior varies significantly by state', 'Documented transition matrix', 'Vending machine, order, connection protocols'],
    whenNotToUse: ['Two states trivial', 'Stateless service'],
  },
  failureModes: [
    'Invalid transition not guarded — corrupt state',
    'Context exposes setState publicly — bypass rules',
    'Concurrent transition race without lock',
    'State object holds stale context reference',
    'Duplicate state class logic',
  ],
  production: {
    reliability: ['Persist state enum in DB — rebuild state object on load', 'Optimistic lock on state transition'],
    observability: ['Log state transitions with correlation id', 'Metrics time-in-state'],
    maintainability: ['Transition diagram in docs matches code', 'Single entry point for transitions'],
  },
  interview: {
    expectations: ['Context + State interface', 'vs Strategy', 'FSM diagram', 'Invalid transition handling'],
    commonQuestions: ['Model order lifecycle?', 'State vs Strategy?'],
    followUps: ['Persist state across restarts?', 'Thread-safe transitions?'],
    misconceptions: ['Same as Strategy', 'Must use class per state always'],
    traps: ['Giant enum switch instead when pattern asked'],
    strongSignals: ['State objects encapsulate transitions', 'Illegal transition exception', 'state diagram drawn'],
  },
  keyTakeaways: [
    'Behavior changes by swapping State implementation on Context.',
    'Each state class defines valid transitions.',
    'Eliminates large conditional on status enum.',
    'Persist state identifier; reconstruct state object on load.',
    'Strategy varies algorithm; State varies behavior by lifecycle phase.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'State pattern purpose?', answerHint: 'Delegate behavior to state object that changes when internal state transitions.' },
    { level: 'intermediate', question: 'State vs Strategy?', answerHint: 'State transitions driven by context lifecycle; Strategy interchangeable algorithms chosen by client.' },
    { level: 'advanced', question: 'Concurrent order state update?', answerHint: 'Optimistic versioning on status column; CAS transition or row lock; reject stale state.' },
  ],
  flashcards: [
    { front: 'Context', back: 'Delegates to current State; triggers transitions' },
    { front: 'Transition', back: 'State method returns or sets next State object' },
    { front: 'vs Strategy', back: 'State auto-changes; Strategy usually client-selected' },
    { front: 'Invalid transition', back: 'Throw or no-op in state class guard' },
  ],
  quickRevision: ['Context delegates state', 'Class per state', 'Transitions encapsulated', 'Not big switch', 'Persist state id'],
}
