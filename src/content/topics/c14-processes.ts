import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'A process is a running program instance with PID, memory, file descriptors, and environment. Linux creates processes via fork/exec; containers run one main process as PID 1. Understanding processes explains signals, zombies, OOM kills, and why Java needs proper shutdown hooks.',
  whyExists:
    'Servers run many processes — JVM, nginx, postgres. Docker stop sends SIGTERM to PID 1; if PID 1 is shell script that ignores signals, shutdown hangs. Thread vs process matters for JVM tuning and ulimit.',
  mentalModel:
    'Process = program in motion with identity (PID). fork copies; exec replaces image. Parent waits on child or child becomes zombie. Container lifecycle equals main process lifecycle — when PID 1 exits, container stops.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Concept', 'Detail'],
      rows: [
        ['PID 1', 'First process in namespace — init responsibilities in container'],
        ['fork', 'Clone process — copy-on-write memory'],
        ['exec', 'Replace process image with new program'],
        ['Zombie', 'Exited child not reaped by parent — defunct in ps'],
        ['Daemon', 'Background service — systemd manages on server'],
        ['Thread', 'Lightweight unit within process — JVM uses many threads'],
      ],
    },
    {
      type: 'list',
      items: [
        'docker stop: SIGTERM → wait grace period → SIGKILL.',
        'Java Runtime.addShutdownHook on SIGTERM for graceful drain.',
        'Use tini or dumb-init as PID 1 to reap zombies from shell scripts.',
        'ulimit -n raises open file descriptor limit for high connection count.',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'bash',
      caption: 'Process inspection',
      code: `ps aux | head
pgrep -f app.jar          # find PID
kill -15 $PID             # SIGTERM
sleep 5 && kill -9 $PID   # SIGKILL if stuck
cat /proc/$PID/status     # memory, state
ls /proc/$PID/fd | wc -l  # open file count`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Process states: R running, S sleeping, D uninterruptible IO, Z zombie.',
        'Context switch: kernel saves registers, schedules another process.',
        'Copy-on-write after fork until page modified.',
        'Container PID namespace: PID 1 inside may be ordinary PID on host.',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Clear lifecycle model', 'Signal-based graceful shutdown', 'Isolation via namespaces'],
    disadvantages: ['PID 1 special cases in containers', 'Zombie leak if init missing', 'Process per connection expensive vs event loop'],
    alternatives: ['Single JVM multi-thread vs multi-process workers', 'Serverless hides process management'],
    whenToUse: ['Debugging hung containers', 'Tuning file descriptors and memory', 'Designing graceful shutdown'],
    whenNotToUse: ['N/A — foundational'],
  },
  failureModes: [
    'Shell as PID 1 — SIGTERM not forwarded to Java',
    'Zombie accumulation crashes node',
    'Too many open files — accept() fails',
    'Grace period too short — kill mid-request',
    'Orphan processes after client disconnect without cleanup',
  ],
  production: {
    reliability: ['Exec form ENTRYPOINT', 'tini init', 'Shutdown hooks drain connections'],
    observability: ['Monitor process count and FD usage', 'Alert on zombie count'],
    performance: ['Right-size thread pools vs processes', 'ulimit in systemd unit or K8s limits'],
  },
  interview: {
    expectations: ['PID 1 in container', 'SIGTERM graceful shutdown', 'Zombie process cause'],
    commonQuestions: ['What happens on docker stop?', 'Thread vs process?'],
    followUps: ['Why tini?', 'Too many open files?'],
    misconceptions: ['Kill container instant', 'Threads are processes'],
    traps: ['Shell form CMD as PID 1 in prod'],
    strongSignals: ['Shutdown hook story', 'SIGTERM then SIGKILL', 'Reap zombies'],
  },
  keyTakeaways: [
    'Container main process is PID 1 — defines container lifetime.',
    'docker stop sends SIGTERM then SIGKILL after grace.',
    'Use exec ENTRYPOINT or tini for proper signal handling.',
    'Zombies: parent must wait() on children.',
    'Monitor open FDs and process count under load.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'docker stop behavior?', answerHint: 'SIGTERM to PID 1, wait, then SIGKILL if still running.' },
    { level: 'intermediate', question: 'Zombie process?', answerHint: 'Exited child not reaped; shows Z state until parent waits.' },
    { level: 'advanced', question: 'Java in Docker graceful shutdown?', answerHint: 'Exec form java as PID 1; shutdown hook; K8s terminationGracePeriodSeconds.' },
  ],
  flashcards: [
    { front: 'PID 1 container', back: 'Main process; receives signals from docker stop' },
    { front: 'Zombie', back: 'Child exited but entry remains until parent reaps' },
    { front: 'tini', back: 'Minimal init that forwards signals and reaps zombies' },
  ],
  quickRevision: [
    'PID 1 = container life',
    'SIGTERM then KILL',
    'Exec not shell CMD',
    'Reap zombies',
    'Shutdown hooks',
  ],
}
