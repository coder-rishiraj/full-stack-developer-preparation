import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'JVM profiling measures where CPU time and allocations go—async-profiler (sample-based, flame graphs), JFR (JDK Flight Recorder events), JMC (Mission Control UI), and traditional JVisualVM. Goal: find hot methods, lock contention, and allocation hotspots without guessing.',
  whyExists:
    'Production slowness needs evidence—not printf. Sampling profilers attach to live JVM with low overhead; flame graphs collapse stacks to show which code paths consume cumulative time.',
  mentalModel:
    'Take snapshots of "where is the JVM right now?" thousands of times per second. Tall frames in flame graph = hot methods. Allocation profiling shows who creates the most objects.',
  howItWorks: [
    {
      type: 'list',
      items: [
        'async-profiler: -e cpu, wall, alloc; outputs flamegraph.html; uses perf on Linux.',
        'JFR: jcmd <pid> JFR.start duration=60s filename=rec.jfr; analyze in JMC.',
        'CPU samples: stack traces aggregated; width = time in method.',
        'Allocation profiling: sample object alloc sites—find byte[] or char[] churn.',
        'Lock profiling: -e lock shows contended monitors.',
        'Always profile representative load—not idle JVM.',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'bash',
      caption: 'async-profiler and JFR',
      code: `# 30s CPU flame graph
async-profiler -d 30 -e cpu -f /tmp/cpu.html $(pgrep -f app.jar)

# Allocation hotspots
async-profiler -d 30 -e alloc -f /tmp/alloc.html $(pgrep -f app.jar)

# JFR recording
jcmd $(pgrep -f app.jar) JFR.start name=profile settings=profile filename=/tmp/app.jfr
sleep 60
jcmd $(pgrep -f app.jar) JFR.dump name=profile filename=/tmp/app.jfr`,
    },
  ],
  tradeoffs: {
    advantages: [
      'Data-driven optimization targets',
      'Low overhead sampling vs instrumentation',
      'JFR built into JDK 11+ with known event model',
    ],
    disadvantages: [
      'Profiler overhead still 1-5%—coordinate with ops',
      'Flame graphs need skill to read inlined frames',
      'Alloc profiling can distort if too aggressive',
    ],
    alternatives: ['Micrometer + tracing spans for service-level', 'BenchmarkJMH for micro-opts', 'GC logs for allocation indirect signal'],
    whenToUse: ['CPU spike investigation', 'Latency regression after release', 'GC pressure from allocation rate'],
    whenNotToUse: ['Network/external dependency bound—use tracing', 'Cold start before JIT warm-up misleading'],
  },
  failureModes: [
    'Profiling idle app—flat useless graph.',
    'Missing permissions for perf_events on Linux (async-profiler).',
    'Misreading inlined JVM frames as wrong Java method.',
    'Short profile missing periodic spike (cron job).',
  ],
  interview: {
    expectations: [
      'async-profiler / JFR names',
      'Flame graph interpretation (width = time)',
      'Sample vs instrument overhead tradeoff',
    ],
    commonQuestions: ['How find CPU hotspot in production?', 'Flame graph read?', 'JFR vs async-profiler?'],
    followUps: ['Allocation vs CPU profiling?', 'Safepoint bias in older profilers?', 'Wall-clock vs CPU time?'],
    misconceptions: ['Profiler always safe at 100% rate', 'Single thread dump enough for CPU', 'Println timing replaces profiler'],
    traps: ['Profile without load', 'Optimize cold code path from unrepresentative sample'],
    strongSignals: ['Mentions sampling overhead', 'JFR start/dump commands', 'Distinguishes wall vs cpu events'],
  },
  keyTakeaways: [
    'async-profiler: cpu/alloc flame graphs on live JVM.',
    'JFR: rich events, jcmd start/dump, JMC analyze.',
    'Flame width = cumulative sample time in frame.',
    'Profile under realistic load.',
    'Fix top of flame first—biggest wins.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'What does flame graph width mean?', answerHint: 'Proportional to sampled time (or allocations) in that stack frame and callees.' },
    { level: 'intermediate', question: 'JFR start command?', answerHint: 'jcmd pid JFR.start settings=profile filename=rec.jfr; dump/stop when done; open in JDK Mission Control.' },
    { level: 'advanced', question: 'CPU vs wall profiling?', answerHint: 'CPU samples only when thread on-CPU; wall includes blocked/waiting—use wall for latency, cpu for compute hotspots.' },
  ],
  flashcards: [
    { front: 'async-profiler CPU flame', back: 'async-profiler -d 30 -e cpu -f out.html pid' },
    { front: 'Flame graph reading', back: 'Wider frame = more samples = hotter path' },
    { front: 'JFR analyze tool', back: 'JDK Mission Control (JMC)' },
  ],
  quickRevision: [
    'Sample under load',
    'async-profiler cpu/alloc',
    'JFR jcmd start/dump',
    'Flame width = hot',
    'Wall vs CPU events',
    'Fix widest frame first',
    'Low overhead sampling',
  ],
  production: {
    observability: [
      'Keep async-profiler agent or JFR templates in runbooks—attach during incidents without redeploy.',
      'Correlate flame graph timestamp with deploy/traffic spike in metrics.',
    ],
    performance: [
      'Limit profile duration (30-120s) and sample rate in prod to cap overhead.',
      'Repeat profile after fix to verify hotspot shrink—not one-shot guess.',
    ],
    reliability: [
      'Profile replica or canary before production attach if security policy restricts prod signals.',
    ],
    maintainability: [
      'Name threads and use meaningful package structure—flame graphs readable in incidents.',
    ],
  },
}
