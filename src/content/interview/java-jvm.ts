import type { ReactInterviewItem } from './types'

export const JAVA_INTERVIEW_JVM: ReactInterviewItem[] = [
  {
    id: 'jvm-architecture',
    question: 'Draw the JVM architecture and explain what happens after `java Main`.',
    relatedTopicIds: ['c2-jvm-architecture', 'c2-class-loading', 'c2-jit'],
    answer: [
      {
        type: 'paragraph',
        text: 'The launcher creates the JVM, the application loader finds Main, and loading is followed by verification, preparation, resolution, and initialization. The execution engine starts with bytecode interpretation, profiles hot code, and tier-compiles it. Objects use the heap, each thread gets a stack and PC register, metadata uses metaspace, and GC reclaims unreachable heap objects.',
      },
    ],
  },
  {
    id: 'jdk-runtime-jvm-modern',
    question: 'JDK vs JRE vs JVM — what changes in modern Java?',
    relatedTopicIds: ['c2-jvm-jdk-jre', 'c2-runtime-image'],
    answer: [
      {
        type: 'paragraph',
        text: 'JVM executes bytecode. Runtime environment means JVM plus Java libraries/modules. JDK adds javac, jar, javadoc, jdb, jcmd, and jlink. Since Java 9 the platform is modular, and modern vendors commonly ship a JDK or custom jlink runtime rather than a separate end-user JRE installer.',
      },
    ],
  },
  {
    id: 'class-loading-phases',
    question: 'What are loading, linking, and initialization?',
    relatedTopicIds: ['c2-loading-linking-init', 'c2-linking-phases', 'c2-clinit'],
    answer: [
      {
        type: 'paragraph',
        text: 'Loading defines a Class from bytes. Linking verifies bytecode, prepares static storage with default values, and resolves symbolic references (possibly lazily). Initialization runs `<clinit>` once per class-loader identity, assigning explicit static values and executing static blocks.',
      },
    ],
  },
  {
    id: 'loader-hierarchy-modern',
    question: 'Explain the modern class-loader hierarchy and parent delegation.',
    relatedTopicIds: ['c2-loader-hierarchy', 'c2-parent-delegation'],
    answer: [
      {
        type: 'paragraph',
        text: 'Bootstrap loads core platform classes, Platform loads selected platform modules, and Application loads classpath/module-path application code. Parent-first delegation prevents an application from replacing `java.lang.String`. The old Extension ClassLoader and extension directory are pre-Java-9 terminology.',
      },
    ],
  },
  {
    id: 'cnfe-ncdfe',
    question: 'ClassNotFoundException vs NoClassDefFoundError?',
    relatedTopicIds: ['c2-cnfe-vs-ncdfe', 'c2-class-loading'],
    answer: [
      {
        type: 'paragraph',
        text: 'ClassNotFoundException is checked and normally comes from an explicit dynamic load such as Class.forName when bytes cannot be found. NoClassDefFoundError is an Error: code was compiled against a type, but runtime cannot define it — including a class whose initialization failed earlier.',
      },
    ],
  },
  {
    id: 'runtime-memory',
    question: 'Which JVM memory areas are shared, and which are per thread?',
    relatedTopicIds: ['c2-stack-vs-heap', 'c2-runtime-data-areas', 'c2-stack-frames'],
    answer: [
      {
        type: 'paragraph',
        text: 'Heap, metaspace/method-area data, and code cache are process-wide. Each Java thread has a JVM stack of frames, a PC register, and potentially a native stack. Direct buffers live off heap but still count against process/container memory.',
      },
    ],
  },
  {
    id: 'stack-frame',
    question: 'What is in a JVM stack frame?',
    relatedTopicIds: ['c2-stack-frames', 'c2-stack-vs-heap'],
    answer: [
      {
        type: 'paragraph',
        text: 'Local-variable slots hold primitives and object references; the operand stack is the bytecode working area; frame metadata supports return, constant-pool access, and exception handling. Recursive calls allocate frames until the thread throws StackOverflowError.',
      },
    ],
  },
  {
    id: 'jit-tiered',
    question: 'How do the interpreter, C1, and C2 work together?',
    relatedTopicIds: ['c2-interpreter', 'c2-tiered-compilation', 'c2-deoptimization'],
    answer: [
      {
        type: 'paragraph',
        text: 'HotSpot interprets first for fast startup and profiling. C1 compiles quickly and can collect richer profiles; C2 spends longer applying aggressive inlining and speculative optimizations to the hottest methods. If an assumption becomes false, the JVM deoptimizes to a safer tier or interpreter.',
      },
    ],
  },
  {
    id: 'gc-roots',
    question: 'How does the JVM decide that an object is garbage?',
    relatedTopicIds: ['c2-gc-reachability', 'c2-garbage-collection'],
    answer: [
      {
        type: 'paragraph',
        text: 'It traces from GC roots such as live thread-stack references, static fields, JNI handles, and active monitors. An object unreachable from all roots is collectable, including cycles. A logically dead object retained by a cache or ThreadLocal is still reachable and therefore a Java memory leak.',
      },
    ],
  },
  {
    id: 'collectors',
    question: 'Serial vs Parallel vs G1 vs ZGC?',
    relatedTopicIds: ['c2-gc-collectors', 'c2-g1-gc', 'c2-zgc'],
    answer: [
      {
        type: 'paragraph',
        text: 'Serial favors tiny heaps and one GC thread. Parallel maximizes throughput with stop-the-world parallel collection. G1 uses regions and concurrent marking to target balanced pauses and throughput; it is a common server default. ZGC and Shenandoah move most work concurrently for very low pauses, trading CPU and implementation availability. Collector defaults depend on JDK and environment.',
      },
    ],
  },
  {
    id: 'heap-leak-diagnosis',
    question: 'How do you diagnose a Java heap leak?',
    relatedTopicIds: ['c2-memory-leaks', 'c2-heap-dumps', 'c2-heap-dump-analysis'],
    answer: [
      {
        type: 'paragraph',
        text: 'Confirm that post-GC old-gen occupancy trends upward under stable load. Capture a heap dump, inspect dominator trees and retained size, then find the reference chain from a GC root. Typical owners are unbounded caches, listeners, class loaders, and ThreadLocals. Increasing Xmx delays the symptom; it does not fix retention.',
      },
    ],
  },
  {
    id: 'jvm-first-tools',
    question: 'Which JVM diagnostic tools do you reach for first?',
    relatedTopicIds: ['c2-profiling', 'c2-jfr-jmc', 'c2-jcmd-jstat'],
    answer: [
      {
        type: 'list',
        items: [
          '`jcmd <pid> VM.version / VM.flags / GC.heap_info` for context.',
          'JFR/JMC for low-overhead CPU, allocation, locks, and GC timelines.',
          '`jstack` or `jcmd Thread.print` for blocked/deadlocked threads.',
          'Unified `-Xlog:gc*` plus a heap dump for memory investigations.',
          'async-profiler for CPU/allocation flame graphs when sampling detail is needed.',
        ],
      },
    ],
  },
]
