import type { TopicContent } from '@/domain/types'

export const starvationContent: TopicContent = {
  whatIsIt:
    'Starvation is when a thread cannot gain regular access to shared resources (CPU, locks) because other threads monopolize them — progress is theoretically possible but unfair scheduling or persistent contention denies one thread indefinitely.',
  whyExists:
    'Non-fair locks allow barging; high-priority or busy threads dominate; thread pools with fixed size may never assign work to blocked tasks; read-write locks can starve writers if readers continuously arrive.',
  mentalModel:
    'Cafeteria line where pushy diners keep cutting in front of one person who never reaches the counter. Unlike deadlock, some threads proceed — the starved thread does not. Fairness policies and balanced lock modes mitigate.',
  howItWorks: [
    {
      type: 'paragraph',
      text: 'Sources: ReentrantLock(false) barging, excessive thread priorities (rare in server Java), single-thread executor with unbounded queue of long tasks ahead, ReadWriteLock reader dominance, GC or OS scheduling quirks under overload.',
    },
    {
      type: 'table',
      headers: ['Cause', 'Symptom', 'Mitigation'],
      rows: [
        ['Non-fair lock', 'Some threads rarely acquire', 'new ReentrantLock(true) fair mode'],
        ['RW lock read-heavy', 'Writers never run', 'StampedLock, limit read lock scope, upgrade policy'],
        ['Thread pool queue', 'Tasks wait forever behind slow head', 'Separate pools, priority queue, timeout/reject'],
        ['CPU oversubscription', 'Runnable threads >> cores', 'Right-size pool, work stealing balance'],
      ],
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'Starvation vs livelock',
      text: 'Starvation: thread blocked/waiting, no CPU. Livelock: threads keep changing state in response to each other but no useful work completes (both keep yielding “politely”).',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Writer starvation under RW lock',
      code: `ReadWriteLock rw = new ReentrantReadWriteLock();
// Many reader threads constantly acquire readLock
// Writer thread waits indefinitely if readers overlap continuously`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Fair lock trade-off',
      code: `ReentrantLock fair = new ReentrantLock(true);
// Reduces starvation risk; lower throughput under contention`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Fair AQS queues threads FIFO for lock acquisition — reduces barging.',
        'OS scheduler CFS generally fair; Java thread priorities often ignored on Linux.',
        'ForkJoinPool work stealing balances CPU-bound tasks across workers.',
        'Virtual threads: carrier starvation if pinned threads hold carriers.',
        'Metrics: thread dump WAITING/BLOCKED duration; task queue depth per pool.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Fair locks provide predictable progress guarantees',
      'Separate pools isolate latency-sensitive tasks',
    ],
    disadvantages: [
      'Fair locks reduce throughput (more context switching)',
      'Over-provisioning threads worsens scheduling',
    ],
    alternatives: [
      'Backpressure instead of infinite queue',
      'Deadline-aware scheduling (custom Executor)',
    ],
    whenToUse: [
      'Fair lock when starvation observed in profiling',
      'Dedicated executor for admin/critical paths',
    ],
    whenNotToUse: [
      'Fair lock by default everywhere (perf hit)',
    ],
  },
  failureModes: [
    'Low-priority housekeeping thread never runs — metrics gap.',
    'Writer never updates cache — stale data indefinitely.',
    'Scheduled task pile-up — only oldest runs, rest starve if single thread.',
    'Thread.setPriority abuse causing unpredictability.',
  ],
  interview: {
    expectations: [
      'Define starvation vs deadlock',
      'Name RW lock writer starvation',
      'Know fair vs non-fair ReentrantLock',
    ],
    commonQuestions: [
      'What is thread starvation?',
      'How does fair lock help?',
      'Reader-writer starvation scenario?',
    ],
    followUps: [
      'Starvation vs livelock?',
      'Thread priority in Java on Linux?',
    ],
    misconceptions: [
      'Deadlock and starvation are the same',
      'More threads always reduce starvation',
    ],
    traps: ['Recommending Thread.setPriority as primary fix'],
    strongSignals: [
      'Mentions fair lock throughput cost',
      'Separate pools for isolation',
      'Queue depth monitoring',
    ],
  },
  keyTakeaways: [
    'Starvation: thread denied resources while others progress.',
    'Non-fair locks and continuous readers starve waiters.',
    'Fair ReentrantLock helps; costs throughput.',
    'Size pools and queues; avoid unbounded backlog.',
    'Not deadlock — diagnose with thread dumps and queue metrics.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Starvation vs deadlock?',
      answerHint: 'Deadlock: circular wait, none progress. Starvation: some progress, one thread perpetually denied.',
    },
    {
      level: 'intermediate',
      question: 'Why can ReadWriteLock starve writers?',
      answerHint: 'Continuous incoming readers block writer acquisition.',
    },
    {
      level: 'advanced',
      question: 'Trade-off of fair ReentrantLock?',
      answerHint: 'FIFO acquisition reduces starvation but lowers barging throughput under contention.',
    },
  ],
  flashcards: [
    { front: 'Starvation', back: 'Thread cannot obtain CPU/lock while others can' },
    { front: 'Fair lock cost', back: 'Lower throughput vs non-fair barging' },
    { front: 'RW writer starvation', back: 'Constant readers prevent writer lock' },
  ],
  quickRevision: [
    'Some threads run, one doesn’t',
    'Non-fair lock barging',
    'RW lock reader dominance',
    'fair=true ReentrantLock',
    'Pool queue backlog',
    'Not deadlock / livelock',
    'Monitor queue depth',
  ],
}

export const content = starvationContent
