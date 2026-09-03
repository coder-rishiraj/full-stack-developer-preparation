import type { TopicContent } from '@/domain/types'

export const jvmJdkJreContent: TopicContent = {
  whatIsIt:
    'The JVM (Java Virtual Machine) is the runtime that executes bytecode on a specific OS/CPU. The JRE (Java Runtime Environment) bundles JVM + core libraries to run apps. The JDK (Java Development Kit) adds development tools (javac, jar, jlink, javadoc) on top of the JRE.',
  whyExists:
    'Write once, run anywhere: compile .java to portable bytecode, ship .class/jar, run on any conforming JVM. Separating JDK from runtime lets production deploy lean JRE/JVM images while developers get compilers and debuggers.',
  mentalModel:
    'Source (.java) → javac → bytecode (.class) → class loader → bytecode verifier → interpreter + JIT → native machine code. JVM owns memory (heap/stack), threads, GC, and security sandboxing.',
  howItWorks: [
    {
      type: 'paragraph',
      text: 'HotSpot (Oracle/OpenJDK default) mixes interpretation with tiered JIT (C1/C2). Class files load lazily; linking resolves constant pool references; execution starts in interpreter, hot methods compile to native code.',
    },
    {
      type: 'table',
      headers: ['Component', 'Contains', 'Who needs it'],
      rows: [
        ['JVM', 'Execution engine, memory, GC, threads', 'Every running Java app'],
        [
          'Runtime environment',
          'JVM + Java modules/libraries; historically distributed as a separate JRE',
          'Running applications; Java 9+ often uses a JDK or jlink image',
        ],
        ['JDK', 'JRE + javac, jdb, jcmd, jmap, jstack, jlink', 'Developers and CI build pipelines'],
      ],
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'Java 11+ modular JDK',
      text: 'Oracle no longer ships a separate JRE installer. Production uses jlink custom runtimes or container images with a full JDK/JRE-equivalent module set. Say “runtime image” in modern interviews.',
    },
  ],
  architecture: {
    mermaid: `flowchart TB
  Dev[javac / JDK tools] --> Class[.class / .jar]
  Class --> CL[Class Loader]
  CL --> Verifier[Bytecode Verifier]
  Verifier --> Runtime[JVM Runtime]
  subgraph Runtime [HotSpot JVM]
    Interp[Interpreter]
    JIT[C1 / C2 JIT]
    Heap[Heap + Metaspace]
    GC[Garbage Collector]
  end
  Runtime --> Native[OS / CPU]`,
    caption: 'JDK builds bytecode; JVM loads, verifies, executes',
  },
  example: [
    {
      type: 'code',
      language: 'bash',
      caption: 'Inspect what runs in production vs build',
      code: `java -version          # JVM + runtime version
javac Hello.java       # JDK compiler
jar tf app.jar         # packaged bytecode
jcmd <pid> VM.version  # live JVM flags`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Same bytecode runs on any HotSpot port',
      code: `public class Hello {
  public static void main(String[] args) {
    System.out.println(System.getProperty("java.vm.name"));
  }
}
// Compiled once; JVM on Linux/macOS/Windows executes same .class`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Class loaders: Bootstrap (JDK core) → Platform → Application (classpath/modules). Parent-delegation prevents duplicate core classes.',
        'Bytecode verifier: stack map frames, type safety, no illegal casts — security + stability before execution.',
        'Execution modes: interpreter (fast startup), C1 (quick compile), C2 (aggressive optimizations after sufficient invocations).',
        'Memory areas: thread stacks, heap (objects), metaspace (class metadata since Java 8), code cache (JIT native code).',
        'JNI bridges native libraries; JVM TI / agents attach for profiling (e.g. async-profiler, JFR).',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Platform portability via bytecode abstraction',
      'Managed memory and GC reduce manual malloc/free bugs',
      'Rich tooling ecosystem (JFR, jcmd, VisualVM)',
      'JIT can outperform ahead-of-time C for long-running hot paths',
    ],
    disadvantages: [
      'Startup latency vs native (class loading, JIT warmup)',
      'Memory overhead (object headers, GC metadata)',
      'Tuning complexity (GC, heap, metaspace limits)',
    ],
    alternatives: [
      'GraalVM Native Image (AOT, smaller footprint, longer build)',
      'Kotlin/Scala on same JVM',
      'Non-JVM: Go, Rust for minimal runtime',
    ],
    whenToUse: [
      'Server-side long-lived services where JIT pays off',
      'Teams needing cross-platform deployment without recompile',
    ],
    whenNotToUse: [
      'Cold-start-sensitive CLI tools without Graal native (unless accept warmup)',
      'Extremely memory-constrained embedded without compact runtime',
    ],
  },
  failureModes: [
    'ClassNotFoundException / NoClassDefFoundError — wrong classpath or missing module.',
    'OutOfMemoryError: Metaspace — class loader leaks (hot redeploy without unload).',
    'UnsupportedClassVersionError — compiled with newer javac than runtime JVM.',
    'Mixing multiple JDK vendors/versions in one process via custom class loaders.',
  ],
  interview: {
    expectations: [
      'Draw JDK ⊃ JRE ⊃ JVM relationship clearly',
      'Explain bytecode portability and class loading at high level',
      'Name HotSpot components: interpreter, JIT, GC, metaspace',
    ],
    commonQuestions: [
      'Difference between JDK, JRE, and JVM?',
      'What happens when you run java Main?',
      'Why is Java platform-independent?',
    ],
    followUps: [
      'How does JIT compilation work?',
      'What is metaspace vs PermGen?',
    ],
    misconceptions: [
      'JRE still shipped separately in all modern JDKs (modular jlink replaced standalone JRE)',
      'JVM interprets forever (HotSpot JIT compiles hot methods)',
    ],
    traps: ['Saying Java is “compiled” or “interpreted” only — it is both via tiered compilation'],
    strongSignals: [
      'Mentions class loader delegation and verifier',
      'Distinguishes build-time (javac) vs runtime (JVM) artifacts',
      'References jcmd/jstack for production debugging',
    ],
  },
  keyTakeaways: [
    'JDK = dev tools + runtime; JVM = execution engine for bytecode.',
    'javac produces .class; JVM loads, verifies, interprets, JIT-compiles.',
    'HotSpot: heap + metaspace + per-thread stacks + GC.',
    'Parent-delegation class loading loads core classes once.',
    'Modern deployments use modular runtime images, not legacy JRE installers.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What is the difference between JDK and JVM?',
      answerHint: 'JDK includes compiler and tools; JVM executes bytecode at runtime.',
    },
    {
      level: 'intermediate',
      question: 'Outline the steps from java Main to running code.',
      answerHint: 'Launch JVM → load Main class → verify bytecode → execute main (interpret → JIT if hot).',
    },
    {
      level: 'advanced',
      question: 'Why can class loader leaks cause metaspace OOM?',
      answerHint: 'Redeployed apps retain ClassLoader references → classes never unloaded → metaspace grows.',
    },
  ],
  flashcards: [
    { front: 'JDK vs JVM', back: 'JDK: javac + tools + runtime. JVM: executes bytecode only.' },
    { front: 'WORA mechanism', back: 'Compile to portable bytecode; JVM maps to native OS/CPU.' },
    { front: 'Metaspace stores', back: 'Class metadata (replaced PermGen in Java 8).' },
  ],
  quickRevision: [
    'JDK ⊃ runtime + javac/jcmd/jlink',
    'JVM: loader, verifier, interpreter, JIT, GC',
    '.java → javac → .class → JVM',
    'HotSpot tiered: C1 fast, C2 aggressive',
    'Metaspace = class metadata',
    'Parent-delegation class loaders',
    'jcmd/jstack for live diagnostics',
  ],
}

export const content = jvmJdkJreContent
