import type { TopicContent } from '@/domain/types'

export const gcAlgorithmsContent: TopicContent = {
  whatIsIt:
    'GC algorithms are the concrete policies HotSpot uses to trace, relocate, and reclaim heap memory: Serial, Parallel (Throughput), CMS (deprecated), G1 (default since Java 9), ZGC, and Shenandoah — each trading throughput, pause time, footprint, and implementation complexity.',
  whyExists:
    'One size does not fit all workloads: batch jobs want throughput; trading systems want bounded pauses; huge heaps need concurrent collectors. The JVM exposes selectable algorithms and tuning flags so operators match GC behavior to SLA and hardware.',
  mentalModel:
    'Copying collectors (young gen) move live objects to fresh space — fast, compact. Mark-compact for old gen clears gaps. G1 partitions heap into regions and collects subsets (mixed GC). ZGC/Shenandoah mark concurrently and relocate with colored pointers / load barriers for sub-ms pauses on large heaps.',
  howItWorks: [
    {
      type: 'paragraph',
      text: 'Default OpenJDK 17+: G1 (-XX:+UseG1GC). Young collections evacuate live regions; concurrent marking tracks old-gen occupancy; mixed GC reclaims old regions with most garbage. ZGC (-XX:+UseZGC) and Shenandoah target low pause regardless of heap size.',
    },
    {
      type: 'table',
      headers: ['Collector', 'Pause goal', 'Typical use'],
      rows: [
        ['Serial', 'Single-thread STW', 'Small client / embedded heaps'],
        ['Parallel (Throughput)', 'Maximize app CPU time', 'Batch, offline analytics'],
        ['G1', 'Predictable mixed pauses (-XX:MaxGCPauseMillis)', 'General server default'],
        ['ZGC', 'Sub-ms pauses, scalable heap', 'Large heap, latency-sensitive'],
        ['Shenandoah', 'Concurrent compact, low pause', 'Similar niche to ZGC'],
        ['CMS (removed 14+)', 'Low pause old gen (legacy)', 'Do not choose on modern JDK'],
      ],
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'G1 key knobs',
      text: 'MaxGCPauseMillis (default 200), InitiatingHeapOccupancyPercent (when concurrent cycle starts), region size auto from heap. Watch mixed GC frequency and humongous allocations.',
    },
  ],
  architecture: {
    mermaid: `flowchart TB
  subgraph G1 [G1 Region-based]
    R1[Eden region]
    R2[Survivor region]
    R3[Old region]
    R4[Humongous region]
    CM[Concurrent Mark]
    Mixed[Mixed GC subset of Old]
  end
  subgraph ZGC [ZGC concurrent]
    MarkC[Concurrent Mark]
    Reloc[Concurrent Relocate]
    LB[Load barriers]
  end
  App[Application threads] --> G1
  App --> ZGC
  LB -.-> App`,
    caption: 'G1: regional evacuation; ZGC: concurrent mark + relocate',
  },
  example: [
    {
      type: 'code',
      language: 'bash',
      caption: 'Select collector (Java 17+)',
      code: `# G1 (default)
java -XX:+UseG1GC -XX:MaxGCPauseMillis=100 -jar app.jar

# ZGC
java -XX:+UseZGC -Xmx16g -jar app.jar

# Parallel throughput
java -XX:+UseParallelGC -jar app.jar`,
    },
    {
      type: 'code',
      language: 'bash',
      caption: 'Read GC cause from unified logging',
      code: `# Look for: G1 Evacuation Pause, G1 Mixed GC,
# Allocation Failure, Metaspace, System.gc()`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'G1: heap split into equal-sized regions (~1–32 MB); remembered sets per region; SATB write barrier for concurrent marking.',
        'Parallel GC: stop-the-world mark-sweep-compact old gen; fewer threads overhead than G1 on small heaps but longer pauses.',
        'ZGC: colored pointers (metadata bits), load barriers on reference read, multiple heap views during relocation.',
        'Shenandoah: Brooks pointers / forwardings; concurrent compaction with app running.',
        'GC causes: Allocation Failure, Metadata GC Threshold, Ergonomics, System.gc(), G1 Humongous Alloc.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'G1 balances pause and throughput for typical services',
      'ZGC/Shenandoah enable very large heaps with ms pauses',
      'Parallel maximizes batch throughput on multi-core',
    ],
    disadvantages: [
      'Low-pause collectors use more CPU (barriers, concurrent threads)',
      'Wrong collector choice wastes resources (ZGC on tiny heap)',
      'Tuning still needed for humongous objects, allocation spikes',
    ],
    alternatives: [
      'Heap sizing + object design before switching collector',
      'Off-heap for giant caches',
    ],
    whenToUse: [
      'G1: default server workloads',
      'ZGC/Shenandoah: strict latency SLAs, heaps many GB+',
      'Parallel: offline jobs where pause length irrelevant',
    ],
    whenNotToUse: [
      'ZGC on small embedded heap without latency requirement',
      'CMS on modern JDK (removed)',
    ],
  },
  failureModes: [
    'G1 evacuation failure / to-space exhausted — heap too small or spike of live data.',
    'Concurrent mode failure (CMS legacy) — fallback full STW.',
    'Humongous objects bypass Eden → fragment G1 old regions.',
    'Metaspace full GC loops during class churn.',
  ],
  interview: {
    expectations: [
      'Compare G1 vs Parallel vs ZGC pause/throughput trade-offs',
      'Explain generational + regional ideas',
      'Know CMS is deprecated/removed',
    ],
    commonQuestions: [
      'Which GC would you use for a low-latency API?',
      'How does G1 differ from Parallel GC?',
      'What is a mixed GC in G1?',
    ],
    followUps: [
      'What are load barriers in ZGC?',
      'When does G1 start concurrent marking?',
    ],
    misconceptions: [
      'More GC threads always help (can increase contention)',
      'Zero pause collectors have zero GC cost (CPU/barrier overhead remains)',
    ],
    traps: ['Reciting CMS details as current default'],
    strongSignals: [
      'Mentions region-based collection and IHOP',
      'Ties collector choice to SLA and heap size',
      'Reads GC logs for cause and pause distribution',
    ],
  },
  keyTakeaways: [
    'Java 9+ default: G1 — regional, mixed GC, pause target.',
    'Parallel: throughput; ZGC/Shenandoah: low pause on big heaps.',
    'CMS legacy — not for new systems.',
    'Humongous allocations hurt G1 — watch object sizes.',
    'Choose collector from latency SLA, heap size, allocation rate — then tune with logs.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What is the default GC in modern OpenJDK?',
      answerHint: 'G1 (Garbage-First) since Java 9.',
    },
    {
      level: 'intermediate',
      question: 'G1 vs Parallel GC trade-off?',
      answerHint: 'G1 targets pause bounds via regional mixed GC; Parallel maximizes throughput with longer STW compacts.',
    },
    {
      level: 'advanced',
      question: 'Why do ZGC and Shenandoah use load barriers?',
      answerHint: 'Objects may move concurrently; barriers ensure threads see correct reference when dereferencing.',
    },
  ],
  flashcards: [
    { front: 'G1 default since', back: 'Java 9' },
    { front: 'ZGC pause target', back: 'Sub-millisecond pauses, concurrent relocation, colored pointers' },
    { front: 'G1 mixed GC', back: 'Collects subset of old regions with highest garbage after concurrent mark' },
  ],
  quickRevision: [
    'G1: regions, evacuation, mixed GC',
    'Parallel: throughput, STW compact',
    'ZGC/Shenandoah: concurrent, low pause',
    'CMS deprecated/removed',
    'MaxGCPauseMillis for G1',
    'Humongous objects = G1 pain',
    'Pick collector by SLA + heap size',
  ],
}

export const content = gcAlgorithmsContent
