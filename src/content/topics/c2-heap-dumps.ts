import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'A heap dump is a snapshot of all objects on the Java heap at a point in time—captured with jmap, jcmd, or -XX:+HeapDumpOnOutOfMemoryError. Analyzed in Eclipse MAT or VisualVM: dominator tree, leak suspects, retained size, and reference chains to GC roots.',
  whyExists:
    'When production hits OutOfMemoryError or creeping heap usage, logs alone are insufficient. Heap dumps show what objects retain memory and who references them—essential for fixing static cache leaks, unbounded collections, and classloader retention.',
  mentalModel:
    'Freeze the attic: every object and reference edge exported. Dominator tree answers "if I remove X, how much memory becomes unreachable?" Leak suspect report groups large retainers.',
  howItWorks: [
    {
      type: 'list',
      items: [
        'Capture live: jcmd <pid> GC.heap_dump /tmp/heap.hprof or jmap -dump:live,format=b,file=heap.hprof <pid>.',
        'Automatic on OOM: -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/var/log/app/',
        'Open in MAT: histogram by class, dominator tree, leak suspects wizard.',
        'Retained vs shallow size: shallow = object header+fields; retained = shallow + only-through-this objects.',
        'GC root path: chain from thread stack/static to leaking object.',
        'Compare two dumps for growth diff (requires same tool/version).',
      ],
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Live dump pauses',
      text: 'Heap dump STW can freeze large heaps seconds to minutes—capture off-peak or from replica; prefer live dump to exclude already-GC-eligible garbage.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'bash',
      caption: 'Capture and analyze',
      code: `# Live heap dump
jcmd $(pgrep -f myapp.jar) GC.heap_dump /tmp/heap-$(date +%s).hprof

# JVM flags for auto dump on OOM
-XX:+HeapDumpOnOutOfMemoryError
-XX:HeapDumpPath=/var/crash/heap.hprof
-XX:+ExitOnOutOfMemoryError`,
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'Programmatic dump (HotSpot Diagnostic MXBean)',
      code: `import com.sun.management.HotSpotDiagnosticMXBean;
import java.lang.management.ManagementFactory;

HotSpotDiagnosticMXBean mx =
    ManagementFactory.getPlatformMXBean(HotSpotDiagnosticMXBean.class);
mx.dumpHeap("/tmp/manual.hprof", true); // live=true`,
    },
  ],
  tradeoffs: {
    advantages: [
      'Complete object graph for leak diagnosis',
      'Dominator analysis finds unexpected retainers',
      'Auto dump on OOM preserves failure scene',
    ],
    disadvantages: [
      'Dump size ≈ heap used—multi-GB files',
      'STW pause during capture',
      'Sensitive data in heap (PII) in dumps',
    ],
    alternatives: ['JFR allocation profiling before full dump', 'Native memory tracking for off-heap', 'Metrics on old gen usage trend'],
    whenToUse: ['OOM investigation', 'Suspected memory leak', 'Post-mortem after heap exhaustion'],
    whenNotToUse: ['CPU-only issues', 'Metaspace-only without heap growth', 'Every minor GC blip'],
  },
  failureModes: [
    'Disk full writing multi-GB hprof.',
    'Analyzing dump from different JDK version—format quirks.',
    'Chasing shallow large byte[] without following dominator to owner Map.',
    'No dump on OOM because flag missing or killed -9 before write completes.',
  ],
  interview: {
    expectations: [
      'jmap/jcmd heap dump commands',
      'MAT dominator tree and leak suspects',
      'Retained vs shallow size',
    ],
    commonQuestions: ['How diagnose Java memory leak?', 'Heap dump vs thread dump?', 'What is dominator tree?'],
    followUps: ['HeapDumpOnOutOfMemoryError flags?', 'Live vs all dump?', 'PII concerns?'],
    misconceptions: ['Heap dump shows stack traces for all objects', 'GC log replaces heap dump', 'Small shallow object is always the leak'],
    traps: ['Analyzing without live flag includes garbage noise', 'Opening 30GB dump on laptop MAT OOM'],
    strongSignals: ['Follows GC root path to static map', 'Mentions STW and capture timing', 'Retained size language'],
  },
  keyTakeaways: [
    'jcmd GC.heap_dump or jmap -dump:live for capture.',
    'MAT dominator tree: largest retainers first.',
    'Retained size = memory freed if object removed.',
    'HeapDumpOnOutOfMemoryError for production OOM.',
    'Follow reference chain to GC root to fix leak.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Command to take heap dump?', answerHint: 'jcmd <pid> GC.heap_dump file.hprof or jmap -dump:live,format=b,file=...' },
    { level: 'intermediate', question: 'Dominator tree purpose?', answerHint: 'Shows objects that dominate memory—removing dominator frees dominated subgraph; finds true retainers.' },
    { level: 'advanced', question: 'Live vs all objects dump?', answerHint: 'live excludes unreachable garbage—smaller, clearer for leak analysis; all includes objects about to be collected.' },
  ],
  flashcards: [
    { front: 'Heap dump capture', back: 'jcmd pid GC.heap_dump path.hprof' },
    { front: 'Retained size', back: 'Memory freed if object and only-dominated objects collected.' },
    { front: 'Auto OOM dump flag', back: '-XX:+HeapDumpOnOutOfMemoryError' },
  ],
  quickRevision: [
    'jcmd/jmap hprof',
    'MAT dominator tree',
    'retained vs shallow',
    'GC root path',
    'HeapDumpOnOOM flag',
    'STW during capture',
    'PII in dumps',
  ],
  production: {
    observability: [
      'Always set HeapDumpOnOutOfMemoryError + HeapDumpPath on production JVMs.',
      'Ship dumps to secure storage; scrub before sharing—contains session tokens and PII.',
    ],
    reliability: [
      'Ensure disk quota on dump path—OOM during dump write doubles failure.',
      'Practice MAT workflow in staging with representative heap size.',
    ],
    security: [
      'Restrict heap dump file permissions; treat as secret-bearing artifact.',
    ],
    cost: [
      'Large dumps slow incident response—pair continuous heap usage metrics to capture before full OOM.',
    ],
  },
}
