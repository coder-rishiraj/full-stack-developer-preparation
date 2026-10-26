---
summary: Command turns a request into an object, so it can be stored, passed around, queued, logged, retried and undone instead of being executed on the spot. You will learn the roles in the pattern, build undo and redo for a text editor, combine commands into macros, and see how the same idea shows up as lambdas, job queues and the "command" side of CQRS.
difficulty: intermediate
minutes: 40
objectives:
  - Explain how turning a request into an object decouples the code that triggers an action from the code that performs it
  - Implement commands with execute and undo, and an invoker with correct undo and redo stacks
  - Design undo for operations that destroy information, and build macro commands that undo in reverse order
  - Choose between a command class, a lambda and a command-as-data record for a given need
  - Distinguish Command from Strategy, events and Memento, and recognise it in executors, UI actions and job queues
---

## Introduction

A text editor has a toolbar button, a menu item and a keyboard shortcut that all make the selected text bold. It also has an Undo button that must reverse the last action, whatever it was — typing, deleting, pasting, bolding — and a Redo button that re-applies what was undone. How do you build that?

If each button calls the document directly — `document.makeBold(selection)` — the Undo button has nothing to work with. A method call happens and is gone; there is no record of what was done or how to reverse it. The three triggers for "bold" also each carry their own copy of the call, and adding a macro recorder or a "repeat last action" feature means touching every one of them.

The **Command** pattern solves this by turning each request into an object. Instead of calling `makeBold`, the button creates a `BoldCommand` that knows which document and which selection it applies to, and hands it to an **invoker** that calls `execute()`. Because the request is now an object, it can be kept on a history stack, asked to `undo()` itself, recorded in a macro, written to a log, or put on a queue to run later. The *Design Patterns* book (Gamma, Helm, Johnson and Vlissides, 1994, the "Gang of Four" or GoF) describes Command as encapsulating a request as an object, thereby letting you parameterise clients with different requests, queue or log requests, and support undoable operations.

You have already used the idea. Every `Runnable` passed to an `ExecutorService` is a request turned into an object and queued for a thread to execute. Background-job systems store "send this email to this address" as a record in a database for a worker to pick up. Redux actions in React applications are plain objects describing a requested change. Undo in every editor you have used works on some form of command history.

## Before you start

- **Interfaces and polymorphism** — every command implements the same small interface, and the invoker calls it without knowing the concrete class. See [[c1-interfaces]] and [[c1-polymorphism]].
- **Lambdas and functional interfaces** — a one-method command can be a lambda. See [[c1-lambdas]] and [[c1-functional-interfaces]].
- **Stacks** — undo and redo histories are last-in, first-out. See [[a5-stack]].
- **Strategy** helps for the comparison near the end; both patterns wrap behaviour in an object, for different reasons. See [[d2-strategy]].

## The intuition

Think of ordering in a restaurant. You do not walk into the kitchen and tell the chef what to cook. The waiter writes your order on a ticket and pins it on the rail. The ticket is the request turned into a thing: it can wait in a queue while the kitchen is busy, be handed to whichever cook is free, be read back to check it, and be kept afterwards as a record of what was served. The waiter does not need to know how to cook a risotto, and the chef does not need to know which table you are sitting at beyond what the ticket says.

In the pattern, the ticket is the **command**, the waiter is the **invoker** (it triggers execution without knowing how the work is done), and the chef is the **receiver** (the object that actually does the work).

The analogy breaks at undo. A cooked risotto cannot be un-cooked. Software commands *can* often be reversed, but only if the command was designed to remember enough to reverse itself — and some actions, like sending an email or charging a card, can never be truly undone. You will see both cases.

## The roles

```mermaid title="Command: the invoker runs commands without knowing what they do"
classDiagram
  class Command {
    <<interface>>
    +execute()
    +undo()
  }
  class InsertText {
    -doc: Document
    -position: int
    -text: String
  }
  class Document {
    +insert(pos, text)
    +delete(pos, len) String
  }
  class History {
    -undoStack: Deque
    -redoStack: Deque
    +run(cmd)
    +undo()
    +redo()
  }
  Command <|.. InsertText
  InsertText --> Document : receiver
  History --> Command : invokes
```

There are five roles, though some may be the same object in small programs:

- The **Command** interface declares `execute()` and, when undo is needed, `undo()`.
- A **concrete command** (`InsertText`) stores everything needed to perform one particular request: a reference to the receiver and the request's parameters. It implements `execute()` by calling the receiver.
- The **receiver** (`Document`) knows how to do the actual work. It has no idea that commands exist.
- The **invoker** (`History`, a button, a queue worker) holds commands and calls `execute()` at the right time. It depends only on the `Command` interface.
- The **client** creates concrete commands, connects them to their receivers and hands them to the invoker.

The key decoupling is between the invoker and the receiver. The `History` class can undo any action — inserting, deleting, formatting, a macro of all three — because it sees only `Command`. Adding a new kind of action means writing a new command class; the invoker and the receiver are untouched.

## Undo and redo for a text editor

The program below implements a tiny editor. The document is the receiver; inserts and deletes are commands; a history object is the invoker that supports undo and redo. A macro command, explained in the next section, combines two commands into one undoable step.

```java title="EditorCommands.java"
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Deque;
import java.util.List;

public class EditorCommands {

    /** Receiver: knows how to change text; knows nothing about commands. */
    static final class Document {
        private final StringBuilder text = new StringBuilder();

        void insert(int pos, String s) { text.insert(pos, s); }

        String delete(int pos, int len) {
            String removed = text.substring(pos, pos + len);
            text.delete(pos, pos + len);
            return removed;
        }

        @Override public String toString() { return text.toString(); }
    }

    interface Command {
        void execute();
        void undo();
    }

    static final class InsertText implements Command {
        private final Document doc;
        private final int pos;
        private final String text;

        InsertText(Document doc, int pos, String text) {
            this.doc = doc;
            this.pos = pos;
            this.text = text;
        }

        public void execute() { doc.insert(pos, text); }
        public void undo()    { doc.delete(pos, text.length()); }
    }

    static final class DeleteText implements Command {
        private final Document doc;
        private final int pos;
        private final int len;
        private String removed;            // captured on execute, needed to undo

        DeleteText(Document doc, int pos, int len) {
            this.doc = doc;
            this.pos = pos;
            this.len = len;
        }

        public void execute() { removed = doc.delete(pos, len); }
        public void undo()    { doc.insert(pos, removed); }
    }

    /** A command made of commands: runs them in order, undoes them in reverse. */
    static final class Macro implements Command {
        private final List<Command> steps;

        Macro(List<Command> steps) { this.steps = List.copyOf(steps); }

        public void execute() { steps.forEach(Command::execute); }

        public void undo() {
            List<Command> reversed = new ArrayList<>(steps);
            java.util.Collections.reverse(reversed);
            reversed.forEach(Command::undo);
        }
    }

    /** Invoker: runs commands and keeps the history; sees only the interface. */
    static final class History {
        private final Deque<Command> undoStack = new ArrayDeque<>();
        private final Deque<Command> redoStack = new ArrayDeque<>();

        void run(Command c) {
            c.execute();
            undoStack.push(c);
            redoStack.clear();             // a new action invalidates the redo branch
        }

        boolean undo() {
            if (undoStack.isEmpty()) return false;
            Command c = undoStack.pop();
            c.undo();
            redoStack.push(c);
            return true;
        }

        boolean redo() {
            if (redoStack.isEmpty()) return false;
            Command c = redoStack.pop();
            c.execute();
            undoStack.push(c);
            return true;
        }
    }

    static void show(String step, Document doc) {
        System.out.printf("%-26s \"%s\"%n", step, doc);
    }

    public static void main(String[] args) {
        Document doc = new Document();
        History history = new History();

        history.run(new InsertText(doc, 0, "Hello"));     show("insert \"Hello\"", doc);
        history.run(new InsertText(doc, 5, " world"));    show("insert \" world\"", doc);
        history.run(new DeleteText(doc, 0, 6));           show("delete first 6 chars", doc);
        history.undo();                                   show("undo", doc);
        history.undo();                                   show("undo", doc);
        history.redo();                                   show("redo", doc);
        history.run(new InsertText(doc, 11, "!"));        show("insert \"!\"", doc);
        System.out.println("redo possible? " + history.redo());

        history.run(new Macro(List.of(                    // replace "world" with "there"
                new DeleteText(doc, 6, 5),
                new InsertText(doc, 6, "there"))));       show("macro: replace word", doc);
        history.undo();                                   show("undo macro", doc);
    }
}
```

```output
insert "Hello"             "Hello"
insert " world"            "Hello world"
delete first 6 chars       "world"
undo                       "Hello world"
undo                       "Hello"
redo                       "Hello world"
insert "!"                 "Hello world!"
redo possible? false
macro: replace word        "Hello there!"
undo macro                 "Hello world!"
```

Follow the history as it runs. Each `run` executes a command and pushes it onto the undo stack. The first `undo` pops the delete command and calls its `undo()`, which puts `"Hello "` back; the command moves to the redo stack. The second `undo` pops the second insert and removes `" world"`. `redo` pops that insert from the redo stack and executes it again.

Then a new action — inserting `"!"` — arrives while the redo stack still holds the first undone delete. `run` clears the redo stack, which is why `redo()` then returns `false`. This is the standard behaviour in editors, and it is required for correctness, not merely convention: the delete command recorded "delete six characters at position 0" against the document *as it was then*. After a new edit, replaying it could delete the wrong text. Once history branches, the old future is discarded.

The invoker never looks inside a command. It does not know that `DeleteText` exists, and it would work unchanged with a `BoldText` or `PasteImage` command written next year.

```quiz
Q: The history holds an undone command on its redo stack. The user then types a new character. Why must the redo stack be cleared?
- [ ] Because `ArrayDeque` cannot hold more than one stack's worth of commands
- [x] Because the undone command was recorded against the earlier text, and replaying it after a new edit could change the wrong characters
- [ ] Because redo is only allowed immediately after undo by convention, with no correctness reason
- [ ] Because the new command will overwrite the old one in memory
> Commands carry positions and lengths that were valid for the document as it was when they ran. A new edit shifts the text, so redoing an old "delete 6 characters at 0" might remove different characters than the user expects. Clearing the redo stack discards a future that no longer matches the present.
```

## Designing undo

Undo is the feature that most often justifies the Command pattern, and also where most of its bugs are. The central rule is: **a command must remember everything it needs to reverse itself, at the moment it executes.**

Look at the two commands in the example. `InsertText` can undo itself from its constructor arguments alone — it knows where it inserted and how long the text was. `DeleteText` cannot: its constructor knows only the position and length, and after `execute()` the deleted characters are gone from the document. So it captures them in the `removed` field during `execute()`. Without that line, undo would be impossible. Operations that **destroy information** — delete, overwrite, clear, resize an image — must save what they destroy.

There are two broad ways to implement undo:

| Approach | How it works | Good for | Cost |
|---|---|---|---|
| Inverse operation | `undo()` performs the opposite action (insert ↔ delete, add ↔ subtract) using saved parameters | Small, precise edits | Must be written carefully for every command |
| State snapshot | `execute()` saves a copy of the affected state; `undo()` restores it | Complex operations where an inverse is hard to write | Memory for each snapshot |

The snapshot approach combines Command with the Memento pattern (an object that captures another object's state so it can be restored later). Real editors mix the two: typing uses inverse operations, while a complex filter in an image editor stores the affected pixels.

Three practical issues come up in every real undo system:

- **Bounded history.** An unbounded undo stack is a slow memory leak, especially with snapshots. Editors cap the history by count or by total memory and drop the oldest entries.
- **Merging.** Typing "hello" should normally undo as one step, not five. Editors merge consecutive commands of the same kind (inserts at adjacent positions within a short time) into one.
- **Irreversible actions.** Sending an email, charging a card or calling an external API cannot be undone. The honest options are to not put them on the undo stack, to delay them until the user can no longer undo (Gmail's "Undo send" works by holding the email for a few seconds before sending it), or to implement a **compensating action** — a refund rather than an un-charge — and accept that it is a new action with its own visible effects. See [[d4-compensation]].

> [!IMPORTANT] Undo must restore exactly what execute changed
> Test every command with the property "execute then undo leaves the receiver exactly as it was". A command whose undo is almost right — off by one position, or restoring formatting but not text — corrupts the document a little more with every use, and the user sees the damage only many steps later.

## Macro commands

A **macro command** is a command whose `execute()` runs a list of other commands. In the example, "replace a word" is a delete followed by an insert, and wrapping them in a `Macro` means the history treats the pair as one step: one undo reverses both. This is the Composite pattern applied to commands — a group is used exactly like a single item.

The one rule that matters is in `Macro.undo()`: **undo the steps in reverse order**. The insert of `"there"` assumed the delete had already happened; to undo safely, you must first remove `"there"` and only then put `"world"` back. Undoing in the original order goes wrong in a way that is easy to miss. Reinserting `"world"` first gives `"Hello worldthere!"`; then the insert's undo deletes five characters at position 6 — which are now `"world"`, not `"there"`. The document ends as `"Hello there!"`, as if the undo had never happened, and the history is now out of step with the text.

Macros raise a second question: what if step three of five fails during `execute()`? The two earlier steps have already changed the receiver. A robust macro catches the failure, undoes the steps that completed (again in reverse), and rethrows — giving the macro all-or-nothing behaviour similar to a database transaction. Without that, a failed macro leaves the receiver half-changed and the history inconsistent.

Macros also give you **recording** for free: to record a user's actions, the invoker appends each command it runs to a list, and replaying the list is running a `Macro` built from it — provided each command can be safely executed against the document's state at replay time.

## Commands as lambdas

When a command needs only `execute()` — no undo, no inspection, no persistence — it is a function, and in Java a lambda or method reference is the natural way to write it. `Runnable`, `Callable` and the other functional interfaces are, in effect, ready-made command interfaces.

```java title="Shortcuts.java"
import java.util.LinkedHashMap;
import java.util.Map;

public class Shortcuts {
    static final StringBuilder doc = new StringBuilder("draft");

    public static void main(String[] args) {
        // The invoker is the key map: it runs whatever command is bound to a key.
        Map<String, Runnable> keymap = new LinkedHashMap<>();
        keymap.put("ctrl+u", () -> doc.replace(0, doc.length(), doc.toString().toUpperCase()));
        keymap.put("ctrl+e", () -> doc.append("!"));
        keymap.put("ctrl+p", () -> System.out.println("printing: " + doc));

        for (String key : new String[] {"ctrl+e", "ctrl+u", "ctrl+p", "ctrl+z"}) {
            Runnable command = keymap.getOrDefault(key, () -> System.out.println("unbound: " + key));
            command.run();
        }
    }
}
```

```output
printing: DRAFT!
unbound: ctrl+z
```

The key map plays the invoker: it maps a trigger to a command and runs it without knowing what it does. Rebinding a key is a map update, not a code change in the key-handling logic. Notice the default command for unbound keys — a small application of the Null Object idea that saves a `null` check.

Lambdas are the right choice for fire-and-forget actions such as button handlers, scheduled tasks and callbacks. Prefer a class when you need any of the following: an `undo()` method, a readable name or description for menus and logs, state captured at execution time (like `removed` in `DeleteText`), or a command that must be stored and sent somewhere. A lambda's captured variables are invisible from outside and it cannot be serialised reliably, which matters for the next use.

## Commands as data: queues, logs and retries

The GoF book lists queuing and logging requests as uses of Command. In modern backend systems this is where the pattern does its heaviest work, usually in a variant where the command is **pure data** and the code that executes it lives in a separate **handler**.

Why separate them? A command that will be put in a message queue, stored in a database table or sent to another service must be serialisable — turned into JSON or bytes and back. An object holding references to live services and database connections cannot travel that way. So the command shrinks to a record describing the request, and a worker looks up the handler for each command type.

```java title="JobQueue.java"
import java.util.ArrayDeque;
import java.util.HashSet;
import java.util.Queue;
import java.util.Set;

public class JobQueue {

    // Commands as plain data: easy to serialise, log, store and retry.
    sealed interface Job permits SendEmail, ChargeCard {
        String id();
    }
    record SendEmail(String id, String to, String template) implements Job {}
    record ChargeCard(String id, String orderId, long cents) implements Job {}

    /** Worker: the invoker. Dispatches each command type to its handler. */
    static final class Worker {
        private final Set<String> done = new HashSet<>();   // ids already processed

        void process(Job job) {
            if (!done.add(job.id())) {
                System.out.println("skip duplicate " + job.id());
                return;
            }
            switch (job) {
                case SendEmail e  -> System.out.println("email '" + e.template() + "' to " + e.to());
                case ChargeCard c -> System.out.println("charge " + c.cents() + " for " + c.orderId());
            }
        }
    }

    public static void main(String[] args) {
        Queue<Job> queue = new ArrayDeque<>();
        queue.add(new ChargeCard("job-1", "order-42", 2_856));
        queue.add(new SendEmail("job-2", "alice@example.com", "order-confirmed"));
        queue.add(new ChargeCard("job-1", "order-42", 2_856));   // redelivered by the broker

        System.out.println("queued: " + queue.peek());
        Worker worker = new Worker();
        while (!queue.isEmpty()) worker.process(queue.poll());
    }
}
```

```output
queued: ChargeCard[id=job-1, orderId=order-42, cents=2856]
charge 2856 for order-42
email 'order-confirmed' to alice@example.com
skip duplicate job-1
```

The records carry only data, so printing one (as the `queued:` line shows) gives a readable log entry, and converting one to JSON for a real message broker is straightforward. The worker is the invoker: it takes commands off the queue and dispatches them. Because `Job` is a sealed interface, the `switch` (Java 21 pattern matching) is checked for exhaustiveness — adding a third job type without a `case` is a compile error. See [[c1-sealed]] and [[c1-switch-expressions]].

The third queue entry shows the problem every queue-based system must handle: **duplicates**. Message brokers commonly guarantee *at-least-once* delivery, so the same command can arrive twice after a timeout or a crash. Because each command carries a unique ID, the worker can recognise and skip the repeat instead of charging the card twice. In production the set of processed IDs lives in a database, often enforced by a unique constraint. See [[c12-idempotency]] and [[d4-delivery-semantics]].

The same shape appears in Java's own concurrency library. `executor.submit(task)` takes a `Runnable` or `Callable` — a command — and puts it on the executor's work queue, where a pool thread acts as the invoker. The code that submits work is fully decoupled from when and on which thread it runs. See [[c3-executors]].

```quiz
Q: A team wants to store pending operations in a database table so a worker can run them after a restart. Why are records such as `ChargeCard(id, orderId, cents)` a better fit than command objects holding a reference to a `PaymentGateway`?
- [ ] Records execute faster than classes
- [ ] Java forbids storing objects that have methods
- [x] Plain data can be serialised, stored and read back by another process, while a live service reference cannot
- [ ] Records automatically prevent duplicate execution
> A command that crosses a process boundary must be turned into bytes or JSON and rebuilt later, possibly on another machine; a reference to a running service or connection has no meaning there. Records do not prevent duplicates on their own — that still needs the unique ID and an idempotent handler.
```

### Commands versus events

Once commands become messages, they are easy to confuse with events. The difference is one of intent and ownership:

| | Command | Event |
|---|---|---|
| Meaning | A request: "please do this" | A fact: "this happened" |
| Naming | Imperative — `ChargeCard`, `PlaceOrder` | Past tense — `CardCharged`, `OrderPlaced` |
| Recipients | Exactly one handler is expected to act | Zero or many listeners may react |
| Can it be refused? | Yes — validation may reject it | No — it already happened |

Command Query Responsibility Segregation (CQRS) uses this vocabulary: the write side of the system accepts commands, validates them, and on success records events. Event sourcing stores the *events*, not the commands, because events are facts that cannot be rejected on replay. See [[c11-cqrs]] and [[d5-event-sourcing]].

## In real systems

**UI frameworks.** Java Swing's `Action` interface bundles a command's behaviour with its name, icon, keyboard shortcut and enabled state, so a toolbar button and a menu item can share one action and both grey out together when it is disabled. Desktop and web editors build undo on command histories.

**Executors and schedulers.** `ExecutorService`, `ScheduledExecutorService` and `CompletableFuture.runAsync` all accept commands as `Runnable` or `Callable` objects.

**Background jobs.** Job systems store a job's type and arguments, so a worker process — possibly on another machine, possibly hours later — can execute it. This is commands as data, with retry, scheduling and dead-letter handling around them. See [[d5-queues]].

**Frontend state.** A Redux action such as `{ type: 'cart/itemAdded', payload: { sku: 'MUG' } }` is a plain object describing a requested change, dispatched to a store that applies it through a reducer. Because actions are data, tools can log them, replay them and "time-travel" through an application's history. Redux's own style guide recommends naming actions as past-tense events, which shows how blurred the line between command and event becomes in practice. See [[b4-usereducer]].

**Transactions and logs.** Database write-ahead logs and replicated logs record operations so they can be replayed after a crash or applied on a replica — the "log requests" use of the pattern at the storage level.

## Trade-offs and alternatives

Command decouples the code that triggers an action from the code that performs it, makes actions first-class values that can be stored, queued, logged, retried and undone, and makes new actions easy to add without changing invokers. Macro commands and recording come almost for free once actions are objects.

The costs: one class per kind of action, which can feel heavy for simple cases; undo that must be designed and tested for every command; history that consumes memory; and an extra layer of indirection that makes "what happens when I click this?" harder to trace in a debugger.

Alternatives:

- **A direct method call** when there is one trigger and no need for history, queuing or undo.
- **A lambda** when you need deferred or parameterised execution but no undo, naming or persistence.
- **State snapshots alone** (Memento) when undo is needed but individual commands are hard to reverse — for example, saving the whole document after each change in a small app.
- **Events** when the goal is to tell other parts of the system that something happened, rather than to ask one part to do something. See [[d2-observer]].

## Command compared with similar patterns

**Command versus Strategy.** Both wrap behaviour in an object. A strategy is *how* an object does its job — an interchangeable algorithm the context calls whenever it needs that job done, such as a pricing rule. A command is *what* to do — a specific request, bound to its receiver and arguments, that is executed once (or undone, or queued). A `SortStrategy` is reused for every sort; a `DeleteText(doc, 0, 6)` describes one particular deletion.

**Command versus Memento.** A memento captures state; a command captures an action. They are often combined: a command saves a memento in `execute()` and restores it in `undo()`.

**Command versus Chain of Responsibility.** A command can be the request object passed along a chain of handlers until one executes it. See [[d2-chain-of-responsibility]].

## Common mistakes

> [!MISTAKE] Not capturing state needed for undo
> A delete command that stores only the position and length cannot restore the deleted text. Capture whatever an operation destroys at the moment it executes, and test that execute followed by undo leaves the receiver unchanged.

**Undoing a macro in the original order.** Later steps depend on earlier ones, so a macro must undo in reverse order.

**Keeping the redo stack after a new action.** Commands recorded against an old version of the state can corrupt the new one. Clear the redo stack whenever a new command runs.

**Pretending irreversible actions can be undone.** An `undo()` on an email command that does nothing, or a card charge whose `undo()` "refunds" without telling anyone, misleads users and auditors. Keep irreversible actions out of the undo history, delay them, or implement and label a real compensating action.

**Putting live objects in persisted commands.** A queued command that holds a database connection or a service reference cannot be serialised and will fail when it reaches the broker. Commands sent across process boundaries must be plain data with IDs.

**No idempotency for queued commands.** At-least-once delivery means duplicates. Give every command a unique ID and make the handler skip IDs it has already processed.

**Unbounded history.** Long editing sessions with snapshot-based undo can exhaust memory. Cap the history.

## Interview perspective

The classic prompt is "design undo and redo for a text editor" — two stacks, `execute`/`undo` pairs, clearing redo on a new action, and capturing deleted text. Other prompts are "Command versus Strategy?" and, in system design, "how would you queue and retry operations?". Command also appears inside low-level design problems such as [[d3-elevator]] (requests queued for the controller), [[d3-vending-machine]] and [[d3-splitwise]] (an expense log that can be replayed or reversed).

> [!INTERVIEW] Explaining undo with Command
> "Each user action becomes a command object with `execute()` and `undo()`, holding a reference to the document and the parameters it needs. The history runs a command and pushes it on an undo stack. Undo pops it, calls `undo()`, and pushes it on a redo stack; a new action clears the redo stack because those commands were recorded against a state that no longer exists. Destructive commands like delete must save what they remove during `execute()`. Macros are commands made of commands and undo their steps in reverse order."

Questions to prepare:

- **What problem does Command solve?** It turns a request into an object, decoupling invoker from receiver and enabling queuing, logging, retries, undo and macros.
- **Why clear the redo stack?** Redo commands were recorded against a state that a new action has changed; replaying them could corrupt the data.
- **How do you undo a non-reversible operation such as a payment?** You cannot truly undo it; use a compensating action (a refund), delay the action, or exclude it from undo.
- **Command versus Strategy?** Command is a specific request to execute once; Strategy is an interchangeable algorithm used repeatedly by a context.
- **Command versus event?** A command asks one handler to do something and may be rejected; an event records a fact for any number of listeners.
- **How do you persist a command queue safely?** Make commands serialisable data with unique IDs, store them durably, and make handlers idempotent.

## Practice

1. **Bold command.** Add a `Document.format(start, end, style)` method and a `FormatText` command. Decide what it must capture to undo correctly when part of the range was already bold.
2. **Bounded history.** Change `History` to keep at most 100 commands, dropping the oldest. Which data structure operation does that require on the `Deque`?
3. **Atomic macro.** Make `Macro.execute()` all-or-nothing: if a step throws, undo the completed steps in reverse order and rethrow. Test it with a `DeleteText` whose range is out of bounds.
4. **Merge typing.** Make consecutive single-character `InsertText` commands at adjacent positions merge into one history entry, so typing "abc" undoes in one step.
5. **Retry with backoff.** Extend `JobQueue` so a handler that throws puts the job back on the queue up to three times, then moves it to a separate dead-letter list. Keep the duplicate check correct.

## Quick revision {#quick-revision}

- Command: a request turned into an object, so it can be stored, queued, logged, retried, undone and combined.
- Roles: Command interface (`execute`, optional `undo`), concrete command (receiver + parameters), receiver (does the work), invoker (runs commands; knows only the interface), client (wires them).
- Undo/redo: two stacks; `run` executes, pushes to undo, clears redo; `undo` pops, calls `undo()`, pushes to redo; `redo` re-executes.
- Destructive commands capture what they destroy during `execute()`; test "execute then undo = unchanged".
- Undo strategies: inverse operation vs state snapshot (Memento). Bound history; merge typing; irreversible actions need delay or compensation.
- Macro command: Composite of commands; execute in order, undo in reverse; roll back completed steps if one fails.
- Lambdas (`Runnable`, `Callable`) are commands without undo; use classes when you need undo, names, captured state or persistence.
- Commands as data: serialisable records + handlers; queues need unique IDs and idempotent handlers (at-least-once delivery).
- Command = request, imperative, one handler, can be refused; event = fact, past tense, many listeners.
- vs Strategy (interchangeable algorithm, reused) and Memento (captures state, often used inside undo).

## Key takeaways {#key-takeaways}

- Turning a request into an object is what makes undo, queues, logs, retries and macros possible; a plain method call leaves nothing behind to work with.
- The invoker depends only on the command interface, so new actions are added without touching the code that triggers or records them.
- Correct undo depends on capturing, at execution time, everything the command changes or destroys — and on reversing macros in reverse order.
- Not everything can be undone; external side effects need delays or compensating actions, honestly labelled.
- In backend systems, commands usually travel as plain data with unique IDs, executed by idempotent handlers.
