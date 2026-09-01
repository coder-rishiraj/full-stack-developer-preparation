import type { TopicContent } from '@/domain/types'

export const futuresContent: TopicContent = {
  whatIsIt:
    'Future represents the result of an asynchronous computation: submit Callable/Runnable to an ExecutorService and receive Future<V> to query completion, retrieve value with get(), or cancel execution. It is a one-shot handle — no chaining until CompletableFuture.',
  whyExists:
    'Threads should not block idle waiting for ad-hoc callbacks. Future decouples submission from result consumption, enabling parallel tasks with a standard cancellation and timeout API across executors.',
  mentalModel:
    'IOU ticket: submit work, do other things, later get() blocks until result ready (or timeout/cancel). Once done, get returns value or ExecutionException wrapping failure.',
  howItWorks: [
    {
      type: 'paragraph',
      text: 'ExecutorService.submit returns FutureTask wrapping callable. States: not completed → running → done (normal, exceptional, cancelled). get() waits; get(timeout) avoids indefinite block. cancel(true) interrupts worker thread.',
    },
    {
      type: 'table',
      headers: ['Method', 'Behavior'],
      rows: [
        ['get()', 'Block until done; throws ExecutionException if failed'],
        ['get(timeout, unit)', 'Timed wait; TimeoutException if late'],
        ['cancel(mayInterrupt)', 'Attempt cancel; false if already done'],
        ['isDone()', 'Non-blocking completion check'],
        ['isCancelled()', 'Cancelled before normal completion'],
      ],
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Blocking get on event thread',
      text: 'Calling get() on limited pool thread while child task needs same pool → deadlock. Compose async or use CompletableFuture instead of nested blocking gets.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Submit Callable and handle errors',
      code: `ExecutorService pool = Executors.newFixedThreadPool(4);
Future<String> fut = pool.submit(() -> fetchRemote());
try {
  String data = fut.get(2, TimeUnit.SECONDS);
} catch (TimeoutException e) {
  fut.cancel(true);
} catch (ExecutionException e) {
  Throwable cause = e.getCause(); // real failure
}`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'invokeAll / invokeAny',
      code: `List<Future<Result>> futures =
    pool.invokeAll(tasks, 5, TimeUnit.SECONDS);
Result fastest = pool.invokeAny(tasks); // first success wins`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'FutureTask implements RunnableFuture; runs on pool worker, sets outcome, wakes waiters.',
        'get() uses LockSupport park until state transitions.',
        'Cancellation sets state; mayInterruptIfRunning sends interrupt to thread.',
        'ExecutionException always wraps callable exception — unwrap getCause().',
        'Legacy Future lacks compose; CompletableFuture extends CompletionStage.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Simple async result retrieval',
      'Standard cancel and timeout',
      'Works with any ExecutorService',
    ],
    disadvantages: [
      'Blocking get only — no fluent pipeline',
      'No combined callback without manual threads',
      'Easy to misuse with nested gets',
    ],
    alternatives: [
      'CompletableFuture for composition',
      'Reactive types (Flow, RxJava)',
      'Virtual threads blocking cheaply on get',
    ],
    whenToUse: [
      'Fire parallel Callable tasks, aggregate with invokeAll',
      'Simple background job with timeout',
    ],
    whenNotToUse: [
      'Multi-stage async pipelines — CompletableFuture',
      'Many dependent callbacks on same thread pool',
    ],
  },
  failureModes: [
    'Forgotten Future — task exceptions swallowed until get().',
    'InterruptedException ignored breaking interrupt flag.',
    'cancel(false) on non-responsive blocking IO — task keeps running.',
    'invokeAny success hides other tasks still running until shutdown.',
  ],
  interview: {
    expectations: [
      'Explain get vs ExecutionException',
      'Cancel and interrupt semantics',
      'invokeAll vs invokeAny',
    ],
    commonQuestions: [
      'Future vs Callable?',
      'What does ExecutionException mean?',
      'Difference cancel(true) vs false?',
    ],
    followUps: [
      'Future vs CompletableFuture?',
      'Pool deadlock with get()?',
    ],
    misconceptions: [
      'cancel always stops work immediately',
      'Future is thread (it is result handle)',
    ],
    traps: ['Blocking get in loop on single-thread executor'],
    strongSignals: [
      'Unwraps ExecutionException cause',
      'Uses timeouts on get',
      'Mentions CompletableFuture for chaining',
    ],
  },
  keyTakeaways: [
    'Future = pending result of async task.',
    'get() blocks; use timeout; ExecutionException wraps errors.',
    'cancel(mayInterrupt) requests stop; not guaranteed.',
    'invokeAll waits all; invokeAny first success.',
    'For pipelines use CompletableFuture, not nested get().',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Callable vs Runnable in executor context?',
      answerHint: 'Callable returns value, throws checked exceptions; Runnable void.',
    },
    {
      level: 'intermediate',
      question: 'Why wrap exceptions in ExecutionException?',
      answerHint: 'get() signature; distinguish failure in task vs future machinery.',
    },
    {
      level: 'advanced',
      question: 'When does cancel(true) fail to stop a task?',
      answerHint: 'Task ignores interrupt; blocked in non-interruptible native IO; already completed.',
    },
  ],
  flashcards: [
    { front: 'ExecutionException', back: 'get() throws when task failed; use getCause()' },
    { front: 'invokeAny', back: 'Returns first successful task result; cancels others (executor dependent)' },
    { front: 'Future limitation', back: 'No built-in chaining — use CompletableFuture' },
  ],
  quickRevision: [
    'submit → Future',
    'get blocks, timeout optional',
    'ExecutionException unwrap',
    'cancel + interrupt flag',
    'invokeAll / invokeAny',
    'Don’t nested get same pool',
    'CompletableFuture for compose',
  ],
}

export const content = futuresContent
