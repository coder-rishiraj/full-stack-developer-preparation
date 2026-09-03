import type { Priority } from '@/domain/types'
import type { SectionSeed, TopicSeed } from './build'

const JVM = ['java', 'jvm'] as const
const M12 = [1, 2]
const M34 = [3, 4]

function item(
  id: string,
  title: string,
  priority: Priority = 'tier1',
  extra: Partial<TopicSeed> = {},
): TopicSeed {
  const { tags, executionPriority, ...rest } = extra
  return {
    id,
    title,
    priority,
    months: extra.months ?? (priority === 'tier1' ? M12 : M34),
    tags: [...JVM, ...(tags ?? [])],
    executionPriority:
      executionPriority ?? (priority === 'tier1' ? 'p0' : priority === 'tier2' ? 'p1' : 'later'),
    ...rest,
  }
}

function nest(
  parent: string,
  id: string,
  title: string,
  priority: Priority = 'tier1',
  extra: Partial<TopicSeed> = {},
): TopicSeed {
  return item(id, title, priority, {
    ...extra,
    curriculumLevel: 'nested-concept',
    parentTopicId: parent,
  })
}

function section(id: string, title: string, order: number, topics: TopicSeed[]): SectionSeed {
  return {
    id,
    track: 'C',
    title,
    order,
    defaultKind: 'theory',
    defaultDepth: 'deep',
    topics,
  }
}

/**
 * C2.1–C2.12 — modern HotSpot/JVM architecture and diagnostics.
 * Java language stays in C1; synchronization/JMM stay in C3.
 */
export const TRACK_C_JVM_SECTIONS: SectionSeed[] = [
  section('C2.1', 'JDK, Runtime & JVM', 17, [
    item('c2-jvm-jdk-jre', 'JDK / Runtime / JVM'),
    nest('c2-jvm-jdk-jre', 'c2-javac-java-tools', 'javac, java, jar & jlink'),
    nest('c2-jvm-jdk-jre', 'c2-runtime-image', 'Modern Runtime Images vs Legacy JRE'),
    nest('c2-jvm-jdk-jre', 'c2-wora', 'WORA & Platform-Specific JVM Builds'),
  ]),

  section('C2.2', 'Bytecode & Class Files', 18, [
    item('c2-bytecode', 'Bytecode'),
    nest('c2-bytecode', 'c2-class-file-format', '.class File Structure'),
    nest('c2-bytecode', 'c2-constant-pool', 'Runtime Constant Pool'),
    nest('c2-bytecode', 'c2-bytecode-verifier', 'Bytecode Verification'),
    nest('c2-bytecode', 'c2-javap', 'Inspecting Bytecode with javap'),
    nest('c2-bytecode', 'c2-class-version', 'Class Version & UnsupportedClassVersionError'),
  ]),

  section('C2.3', 'JVM Architecture', 19, [
    item('c2-jvm-architecture', 'JVM Architecture'),
    nest('c2-jvm-architecture', 'c2-classloader-subsystem', 'Class Loader Subsystem'),
    nest('c2-jvm-architecture', 'c2-runtime-data-areas', 'Runtime Data Areas'),
    nest('c2-jvm-architecture', 'c2-execution-engine', 'Execution Engine'),
    item('c2-jni', 'JNI & Native Libraries', 'tier2'),
    nest('c2-jni', 'c2-native-method-stack', 'Native Method Stack', 'tier2'),
  ]),

  section('C2.4', 'Class Loading & Initialization', 20, [
    item('c2-class-loading', 'Class Loading'),
    nest('c2-class-loading', 'c2-loading-linking-init', 'Loading → Linking → Initialization'),
    nest('c2-class-loading', 'c2-linking-phases', 'Verify, Prepare & Resolve'),
    nest('c2-class-loading', 'c2-loader-hierarchy', 'Bootstrap, Platform & Application Loaders'),
    nest('c2-class-loading', 'c2-parent-delegation', 'Parent Delegation'),
    nest('c2-class-loading', 'c2-clinit', '<clinit>, Static Blocks & Initialization Order'),
    nest('c2-class-loading', 'c2-cnfe-vs-ncdfe', 'ClassNotFoundException vs NoClassDefFoundError'),
    nest('c2-class-loading', 'c2-class-unloading', 'Class Unloading & Loader Leaks', 'tier2'),
  ]),

  section('C2.5', 'Runtime Memory Areas', 21, [
    item('c2-stack-vs-heap', 'Stack vs Heap'),
    nest('c2-stack-vs-heap', 'c2-heap-area', 'Heap Area'),
    nest('c2-stack-vs-heap', 'c2-metaspace', 'Method Area & Metaspace'),
    nest('c2-stack-vs-heap', 'c2-stack-frames', 'Stack Frames: Locals, Operand Stack & Frame Data'),
    nest('c2-stack-vs-heap', 'c2-pc-register', 'Per-Thread PC Register'),
    nest('c2-stack-vs-heap', 'c2-code-cache', 'JIT Code Cache', 'tier2'),
    nest('c2-stack-vs-heap', 'c2-direct-memory', 'Direct / Off-Heap Memory', 'tier2'),
  ]),

  section('C2.6', 'Object Allocation', 22, [
    item('c2-object-allocation', 'Object Allocation'),
    nest('c2-object-allocation', 'c2-tlab', 'TLAB Fast-Path Allocation'),
    nest('c2-object-allocation', 'c2-object-header', 'Object Header, Mark Word & Klass Pointer'),
    nest('c2-object-allocation', 'c2-compressed-oops', 'Compressed Oops', 'tier2'),
    nest('c2-object-allocation', 'c2-escape-analysis', 'Escape Analysis & Scalar Replacement', 'tier2'),
    nest('c2-object-allocation', 'c2-allocation-lifecycle', 'Eden, Survivor & Promotion'),
  ]),

  section('C2.7', 'Interpreter & JIT', 23, [
    item('c2-jit', 'JIT Compilation'),
    nest('c2-jit', 'c2-interpreter', 'Interpreter'),
    nest('c2-jit', 'c2-tiered-compilation', 'Tiered Compilation: C1 & C2'),
    nest('c2-jit', 'c2-hot-methods', 'Invocation Counters & Hot Methods'),
    nest('c2-jit', 'c2-osr', 'On-Stack Replacement'),
    nest('c2-jit', 'c2-inlining', 'Inlining & Speculative Optimization'),
    nest('c2-jit', 'c2-deoptimization', 'Deoptimization'),
  ]),

  section('C2.8', 'Garbage Collection Foundations', 24, [
    item('c2-garbage-collection', 'Garbage Collection'),
    nest('c2-garbage-collection', 'c2-gc-reachability', 'Reachability & GC Roots'),
    nest('c2-garbage-collection', 'c2-gc-generations', 'Young, Survivor & Old Generations'),
    nest('c2-garbage-collection', 'c2-minor-major-full', 'Young, Major & Full GC'),
    item('c2-gc-algorithms', 'GC Algorithms/Concepts'),
    nest('c2-gc-algorithms', 'c2-mark-sweep-compact', 'Mark, Sweep, Compact & Copy'),
    nest('c2-gc-algorithms', 'c2-safepoints', 'Safepoints & Stop-the-World'),
    nest('c2-gc-algorithms', 'c2-write-barriers', 'Write Barriers & Remembered Sets'),
    nest('c2-gc-algorithms', 'c2-reference-types', 'Soft, Weak & Phantom References', 'tier2'),
    nest('c2-gc-algorithms', 'c2-finalization-cleaner', 'Finalization, Cleaner & Resource Lifecycle', 'tier2'),
  ]),

  section('C2.9', 'Garbage Collectors', 25, [
    item('c2-gc-collectors', 'JVM Garbage Collectors'),
    nest('c2-gc-collectors', 'c2-serial-gc', 'Serial GC'),
    nest('c2-gc-collectors', 'c2-parallel-gc', 'Parallel / Throughput GC'),
    nest('c2-gc-collectors', 'c2-g1-gc', 'G1 GC'),
    nest('c2-gc-collectors', 'c2-zgc', 'ZGC', 'tier2'),
    nest('c2-gc-collectors', 'c2-shenandoah', 'Shenandoah', 'tier2'),
    nest('c2-gc-collectors', 'c2-cms-history', 'CMS (Historical / Removed)', 'tier2'),
  ]),

  section('C2.10', 'Runtime Failures & Leaks', 26, [
    item('c2-runtime-errors', 'Common JVM Errors'),
    nest('c2-runtime-errors', 'c2-oome-heap', 'OutOfMemoryError: Java Heap Space'),
    nest('c2-runtime-errors', 'c2-oome-metaspace', 'OutOfMemoryError: Metaspace'),
    nest('c2-runtime-errors', 'c2-oome-direct', 'OutOfMemoryError: Direct Buffer Memory', 'tier2'),
    nest('c2-runtime-errors', 'c2-stackoverflow', 'StackOverflowError'),
    item('c2-memory-leaks', 'Memory Leaks', 'tier2'),
    nest('c2-memory-leaks', 'c2-retention-leaks', 'Caches, Listeners & ThreadLocal Leaks', 'tier2'),
    nest('c2-memory-leaks', 'c2-native-memory-leaks', 'Native Memory Leaks', 'tier2'),
  ]),

  section('C2.11', 'Diagnostics & Profiling', 27, [
    item('c2-profiling', 'JVM Profiling', 'tier2'),
    nest('c2-profiling', 'c2-jfr-jmc', 'Java Flight Recorder & Mission Control', 'tier2'),
    nest('c2-profiling', 'c2-async-profiler', 'async-profiler & Flame Graphs', 'tier2'),
    nest('c2-profiling', 'c2-jcmd-jstat', 'jcmd, jstat & jstack', 'tier2'),
    item('c2-heap-dumps', 'Heap Dumps / Thread Dumps', 'tier2'),
    nest('c2-heap-dumps', 'c2-thread-dumps', 'Thread Dumps', 'tier2', {
      related: ['c3-deadlocks'],
    }),
    nest('c2-heap-dumps', 'c2-heap-dump-analysis', 'Heap Dominators & Retained Size', 'tier2'),
    nest('c2-heap-dumps', 'c2-gc-logs', 'Unified GC Logs', 'tier2'),
  ]),

  section('C2.12', 'JVM Tuning & Measurement', 28, [
    item('c2-jvm-tuning', 'JVM Tuning Strategy', 'tier2'),
    nest('c2-jvm-tuning', 'c2-xms-xmx', '-Xms, -Xmx & Heap Sizing', 'tier2'),
    nest('c2-jvm-tuning', 'c2-pause-throughput', 'Latency vs Throughput', 'tier2'),
    nest('c2-jvm-tuning', 'c2-container-memory', 'Container Memory Awareness', 'tier2'),
    nest('c2-jvm-tuning', 'c2-jmh-warmup', 'JMH, Warm-up & Benchmark Traps', 'tier2'),
  ]),
]
