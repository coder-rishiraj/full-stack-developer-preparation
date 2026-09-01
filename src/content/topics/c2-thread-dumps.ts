import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'A thread dump is a snapshot of all JVM threads—their names, states (RUNNABLE, BLOCKED, WAITING, TIMED_WAITING), stack traces, and lock ownership. Captured with jstack, jcmd Thread.print, or kill -3 (SIGQUIT). Used to diagnose deadlocks, thread pool exhaustion, and stuck I/O.',
  whyExists:
    'CPU profiling shows hot code; thread dumps show who waits on whom. When requests hang, dumps reveal BLOCKED on monitor, WAITING on CountDownLatch, or all pool threads stuck in socket read.',
  mentalModel:
    'Photograph every worker at their desk: what line of code, holding which lock, waiting for which lock. "Found one Java-level deadlock" is the smoking gun line in jstack output.',
  howItWorks: [
    {
      type: 'list',
      items: [
        'jstack -l <pid> or jcmd <pid> Thread.print -l (shows locked monitors).',
        'States: RUNNABLE (on CPU or in native I/O), BLOCKED (waiting monitor), WAITING/TIMED_WAITING (park, wait, join).',
        'Deadlock section: JVM prints cycle of threads and locks.',
        'Compare 3 dumps 30s apart: same stack stuck → hang; many BLOCKED same lock → contention.',
        'Thread pool: all http-nio threads RUNNABLE in read or WAITING on queue empty.',
        'Safe point: dump is STW brief but usually sub-second.',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'bash',
      caption: 'Capture thread dump',
      code: `# Preferred
jcmd $(pgrep -f app.jar) Thread.print -l > /tmp/threads-$(date +%s).txt

# Classic
jstack -l $(pgrep -f app.jar)

# Look for:
# "Found one Java-level deadlock"
# "BLOCKED (on object monitor)"
# same frame repeated across pool threads`,
    },
  ],
  tradeoffs: {
    advantages: [
      'Fast capture, no agent required',
      'Deadlock detection built into JVM report',
      'Low overhead single snapshot',
    ],
    disadvantages: [
      'Single point in time—transient issues need series',
      'Does not show heap retention',
      'Native frame stacks less readable without symbols',
    ],
    alternatives: ['JFR ThreadStart/ThreadPark events', 'Continuous tracing with span blocked time', 'Lock profiling in async-profiler'],
    whenToUse: ['Request timeout spike', 'Suspected deadlock', 'Thread pool appears exhausted'],
    whenNotToUse: ['Pure CPU burn—use profiler', 'Memory leak—heap dump'],
  },
  failureModes: [
    'Misreading RUNNABLE in socket read as CPU hot (actually blocked on I/O).',
    'Ignoring parking/wait vs true deadlock.',
    'One dump during GC pause looks like hang—take multiple.',
    'Cannot jstack as wrong user on container—need same uid or root.',
  ],
  interview: {
    expectations: [
      'jstack / jcmd Thread.print',
      'Thread states BLOCKED vs WAITING',
      'Deadlock section interpretation',
    ],
    commonQuestions: ['How diagnose deadlock?', 'BLOCKED vs WAITING?', 'All threads stuck in pool?'],
    followUps: ['Why 3 dumps?', 'Thread dump vs heap dump?', 'Virtual thread dump differences?'],
    misconceptions: ['RUNNABLE always using CPU', 'Thread dump shows memory', 'More threads always helps BLOCKED'],
    traps: ['Fix symptom by raising pool size when all blocked on same DB lock'],
    strongSignals: ['Multi-dump comparison strategy', 'Reads lock hex ids and owner thread', 'Correlates with thread pool metrics'],
  },
  keyTakeaways: [
    'jcmd Thread.print -l or jstack -l for dumps.',
    'BLOCKED = waiting for monitor; WAITING = park/wait without timeout.',
    'JVM prints Java deadlock cycles explicitly.',
    'Take series of dumps for stuck thread confirmation.',
    'Pair with metrics: pool active count, queue depth.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Command for thread dump?', answerHint: 'jstack -l pid or jcmd pid Thread.print -l' },
    { level: 'intermediate', question: 'BLOCKED vs WAITING?', answerHint: 'BLOCKED waiting to enter synchronized block/monitor; WAITING/TIMED_WAITING on Object.wait, LockSupport.park, join without holding contested monitor entry.' },
    { level: 'advanced', question: 'Why take multiple thread dumps?', answerHint: 'Confirm same threads same stacks over time—transient vs permanent hang; rule out momentary GC safepoint.' },
  ],
  flashcards: [
    { front: 'Thread dump command', back: 'jcmd pid Thread.print -l' },
    { front: 'Deadlock in jstack', back: 'Section "Found one Java-level deadlock" with cycle' },
    { front: 'BLOCKED meaning', back: 'Waiting to acquire object monitor lock' },
  ],
  quickRevision: [
    'jstack/jcmd Thread.print',
    'BLOCKED vs WAITING',
    'Deadlock section',
    '3 dumps compare stacks',
    'Pool stuck same frame',
    'Not for heap leaks',
    'RUNNABLE can be I/O',
  ],
  production: {
    observability: [
      'Automate thread dump on high latency alert (jcmd via sidecar) with rate limit.',
      'Tag thread names with purpose (http-worker, kafka-consumer) for readable dumps.',
    ],
    reliability: [
      'Deadlock often design bug—fix lock ordering; do not rely on restart alone.',
      'Thread pool rejection may need dump before scaling replicas blindly.',
    ],
    maintainability: [
      'Document lock acquisition order in modules using nested synchronized blocks.',
    ],
  },
}
