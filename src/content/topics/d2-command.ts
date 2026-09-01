import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Command pattern encapsulates request as object — enabling queue, log, undo/redo, and decouple invoker from receiver. Command holds execute() and optional undo(); invoker triggers without knowing concrete operation details.',
  whyExists:
    'Direct method calls couple UI buttons to business logic. Command turns "click Save" into SaveDocumentCommand executed by CommandManager — supports macro commands, transaction log, and async job queue of operations.',
  mentalModel:
    'Restaurant order ticket. Waiter (invoker) writes ticket (command); kitchen (receiver) executes. Ticket filed for undo if wrong dish. Remote control buttons map to command objects, not wired directly to TV internals.',
  howItWorks: [
    {
      type: 'mermaid',
      caption: 'Command with invoker and receiver',
      diagram: `classDiagram
  class Command {
    <<interface>>
    +execute()
    +undo()
  }
  class Invoker {
    -history: Stack
    +run(cmd: Command)
    +undo()
  }
  class Receiver {
    +action()
  }
  class ConcreteCommand {
    -receiver: Receiver
    +execute()
    +undo()
  }
  Command <|.. ConcreteCommand
  Invoker --> Command
  ConcreteCommand --> Receiver`,
    },
    {
      type: 'list',
      items: [
        'Invoker.run(cmd) calls cmd.execute() and pushes to history stack.',
        'MacroCommand executes list of child commands atomically.',
        'Job queue worker polls Command objects — same abstraction sync/async.',
        'Spring @Async method invocation is not Command but similar decoupling.',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Text editor undo/redo',
      code: `public interface Command { void execute(); void undo(); }

public class InsertTextCommand implements Command {
  private final Editor editor;
  private final String text;
  public void execute() { editor.insert(text); }
  public void undo() { editor.deleteLast(text.length()); }
}

public class CommandManager {
  private final Deque<Command> undo = new ArrayDeque<>();
  public void run(Command c) { c.execute(); undo.push(c); }
  public void undo() { if (!undo.isEmpty()) undo.pop().undo(); }
}`,
    },
  ],
  implementation: [
    {
      language: 'java',
      caption: 'Payment as queued command',
      code: `public record ProcessPaymentCommand(UUID orderId) implements Command {
  public void execute() { paymentGateway.charge(orderId); }
  public void undo() { paymentGateway.refund(orderId); }
}`,
    },
  ],
  tradeoffs: {
    advantages: ['Undo/redo support', 'Queue and schedule operations', 'Open/Closed new commands', 'Audit log of commands'],
    disadvantages: ['Many small command classes', 'Undo complexity for non-reversible ops', 'Indirection overhead'],
    alternatives: ['Function references lambdas without undo', 'Event sourcing stores events not commands', 'Direct service calls simpler'],
    whenToUse: ['Undo stacks', 'Job queues', 'Remote control APIs', 'Transactional macro operations'],
    whenNotToUse: ['Simple CRUD one-liner', 'No need for history or queue'],
  },
  failureModes: [
    'Undo not inverse of execute — corrupted state',
    'Command not serializable for persistent queue',
    'Execute without idempotency on retry',
    'History stack unbounded memory',
    'Macro partial failure without rollback strategy',
  ],
  production: {
    reliability: ['Persist command queue for crash recovery', 'Idempotent execute with command id'],
    observability: ['Log command type + aggregate id', 'Metrics commands/sec failures'],
    maintainability: ['Command registry mapping type string to class for deserialization'],
  },
  interview: {
    expectations: ['Command object structure', 'Undo/redo', 'Invoker/receiver roles', 'Real examples'],
    commonQuestions: ['Design undo feature?', 'Command vs Strategy?'],
    followUps: ['Macro command?', 'Persist command queue?'],
    misconceptions: ['Same as Event', 'Commands always async'],
    traps: ['No undo for side-effect external API call'],
    strongSignals: ['History stack', 'execute/undo pair', 'Job queue of commands', 'Text editor example'],
  },
  keyTakeaways: [
    'Encapsulate action as Command object with execute().',
    'Invoker decoupled from receiver implementation.',
    'Enable undo/redo via inverse undo() operation.',
    'Queue commands for async workers or audit trail.',
    'MacroCommand batches multiple commands.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Command pattern benefit?', answerHint: 'Encapsulate requests as objects — queue, log, undo, decouple invoker from receiver.' },
    { level: 'intermediate', question: 'Command vs Strategy?', answerHint: 'Command encapsulates action + optional undo; Strategy selects algorithm interchangeable at runtime.' },
    { level: 'advanced', question: 'Undo payment command?', answerHint: 'execute charges; undo refunds — external API may not support true undo, use compensating transaction.' },
  ],
  flashcards: [
    { front: 'Invoker', back: 'Triggers command without knowing receiver details' },
    { front: 'undo()', back: 'Reverses execute — enables redo stack' },
    { front: 'MacroCommand', back: 'Composite executing multiple commands as one' },
    { front: 'Receiver', back: 'Domain object performing actual work' },
  ],
  quickRevision: ['Action as object', 'execute + undo', 'Invoker decoupling', 'Command queue', 'Macro batch'],
}
