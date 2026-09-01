import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'ForkJoinPool is Java’s work-stealing thread pool for divide-and-conquer: each worker maintains a deque of tasks; idle workers steal from others’ tails. Used by parallel streams and RecursiveTask/RecursiveAction for recursive parallelism.',
  whyExists:
    'Fixed thread pools starve when tasks block or sizes mismatch workload. Work-stealing balances CPU across many small tasks split recursively—good for parallel merge sort, array sums, and tree walks when tasks are CPU-bound and splittable.',
  mentalModel:
    'Workers push/pop own tasks LIFO (hot in cache); when idle, steal oldest from neighbor’s queue—keeps cores busy when some branches finish early.',
  howItWorks: [
    {
      type: 'list',
      items: [
        'ForkJoinPool.commonPool() backs parallelStream()—shared JVM-wide.',
        'RecursiveTask<V> returns value; RecursiveAction void—implement compute().',
        'Pattern: if size < THRESHOLD compute directly; else fork left, compute right, join.',
        'fork() async submit subtask; join() wait result; avoid excessive fork depth.',
        'pool.invoke(task) from outside submits root.',
        'Stealing reduces tail latency vs static partition.',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'RecursiveTask sum array',
      code: `class SumTask extends RecursiveTask<Long> {
    static final int THRESHOLD = 10_000;
    final long[] arr; final int lo, hi;
    SumTask(long[] arr, int lo, int hi) { this.arr = arr; this.lo = lo; this.hi = hi; }
    protected Long compute() {
        if (hi - lo <= THRESHOLD) {
            long s = 0;
            for (int i = lo; i < hi; i++) s += arr[i];
            return s;
        }
        int mid = (lo + hi) >>> 1;
        SumTask left = new SumTask(arr, lo, mid);
        left.fork();
        long right = new SumTask(arr, mid, hi).compute();
        return right + left.join();
    }
}
// use: long sum = ForkJoinPool.commonPool().invoke(new SumTask(a, 0, a.length));`,
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'Custom pool (avoid blocking in common pool)',
      code: `ForkJoinPool custom = new ForkJoinPool(8);
try {
    custom.submit(() ->
        IntStream.range(0, n).parallel().forEach(i -> cpuWork(i))
    ).get();
} finally {
    custom.shutdown();
}`,
    },
  ],
  tradeoffs: {
    advantages: [
      'Work-stealing load balances irregular trees',
      'Integrates with parallel streams',
      'Good for CPU-bound recursive splits',
    ],
    disadvantages: [
      'Blocking I/O in common pool starves parallelStream globally',
      'Over-forking tiny tasks hurt more than help',
      'Debugging harder than sequential',
    ],
    alternatives: ['ExecutorService fixed pool for blocking tasks', 'Virtual threads for I/O concurrency', 'StructuredTaskScope (Java 21+)'],
    whenToUse: ['CPU-bound divide-and-conquer', 'Large array parallel processing with threshold', 'Dedicated pool for isolated parallel work'],
    whenNotToUse: ['Blocking JDBC/HTTP inside parallelStream', 'Tiny arrays below threshold', 'Strict ordering side effects without sync'],
  },
  failureModes: [
    'Common pool exhaustion from blocking calls in parallel stream.',
    'ForkJoinTask invoked from within compute without managed pool—ForkJoinPool.managedBlock for blocking.',
    'Recursive leak if join forgotten—tasks pile up.',
  ],
  interview: {
    expectations: [
      'Work-stealing deque model',
      'RecursiveTask fork/join',
      'commonPool backs parallelStream',
    ],
    commonQuestions: ['ForkJoin vs ThreadPoolExecutor?', 'Why not block in common pool?', 'Threshold tuning?'],
    followUps: ['managedBlock when?', 'parallelStream default pool?', 'Virtual threads replace ForkJoin?'],
    misconceptions: ['parallelStream always faster', 'More forks always better', 'ForkJoin for I/O'],
    traps: ['parallelStream on small collection', 'Blocking in map inside parallelStream'],
    strongSignals: ['Stealing explanation', 'Threshold base case', 'Separate pool for blocking isolation'],
  },
  keyTakeaways: [
    'Work-stealing: idle threads steal tasks from others.',
    'RecursiveTask: fork subtasks, join results, base threshold.',
    'commonPool shared—do not block inside.',
    'Use custom ForkJoinPool or Executor for mixed workloads.',
    'CPU-bound splittable work only.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'What backs parallelStream()?', answerHint: 'ForkJoinPool.commonPool()—shared work-stealing pool.' },
    { level: 'intermediate', question: 'Work-stealing benefit?', answerHint: 'Idle workers steal tasks from busy queues—balances uneven recursive splits.' },
    { level: 'advanced', question: 'Blocking in common pool problem?', answerHint: 'Worker blocked cannot steal; reduces effective parallelism for all parallelStream users in JVM.' },
  ],
  flashcards: [
    { front: 'ForkJoin work stealing', back: 'Idle worker steals from tail of another deque.' },
    { front: 'RecursiveTask pattern', back: 'Small: compute direct; large: fork left, compute right, join.' },
    { front: 'commonPool caution', back: 'Avoid blocking I/O inside parallelStream.' },
  ],
  quickRevision: [
    'Work-stealing deque',
    'RecursiveTask fork/join',
    'Threshold base case',
    'commonPool = parallelStream',
    'No blocking in common pool',
    'CPU-bound splits only',
    'Custom pool isolation',
  ],
  production: {
    performance: [
      'Never call blocking JDBC/HTTP inside parallelStream—use dedicated executor or virtual threads.',
      'Tune parallelism: ForkJoinPool.commonPool().setParallelism only via system property at start—prefer custom pool.',
    ],
    scalability: [
      'commonPool parallelism = processors - 1 by default—contention with other JVM libs using same pool.',
    ],
    reliability: [
      'Handle RecursiveTask exceptions in join—unwrap ExecutionException cause.',
    ],
    maintainability: [
      'Document when code uses parallelStream—surprises ops when CPU spikes on common pool.',
    ],
  },
}
