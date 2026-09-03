import type { TopicContent } from '@/domain/types'

type JvmTopicInput = {
  title: string
  sectionTitle: string
  parentTitle?: string
}

const SECTION_FOCUS: Record<string, string> = {
  'JDK, Runtime & JVM':
    'build-time tools versus the modular runtime image and the native JVM process',
  'Bytecode & Class Files':
    'portable instructions, constant-pool references, verification, and class-file compatibility',
  'JVM Architecture':
    'class loading, runtime memory, execution, GC, and native integration as separate subsystems',
  'Class Loading & Initialization':
    'loader identity, delegation, linking, initialization order, and production classpath failures',
  'Runtime Memory Areas':
    'shared heap/metaspace versus per-thread stacks, PC registers, and native memory',
  'Object Allocation':
    'TLAB fast paths, object headers, promotion, and allocation eliminated by the JIT',
  'Interpreter & JIT':
    'startup in the interpreter, profile-guided tiered compilation, and deoptimization',
  'Garbage Collection Foundations':
    'reachability from roots, generations, barriers, safepoints, and reclamation algorithms',
  'Garbage Collectors':
    'choosing throughput, footprint, or low-pause behavior rather than memorizing flags',
  'Runtime Failures & Leaks':
    'distinguishing heap retention, metaspace, direct memory, stack exhaustion, and missing classes',
  'Diagnostics & Profiling':
    'gathering JFR, dumps, GC logs, and profiles before changing JVM flags',
  'JVM Tuning & Measurement':
    'evidence-led heap and collector changes measured under representative warm-up and load',
}

export function createJvmTopicContent({
  title,
  sectionTitle,
  parentTitle,
}: JvmTopicInput): TopicContent {
  const focus =
    SECTION_FOCUS[sectionTitle] ??
    'modern HotSpot behavior you can explain and observe in production'
  const parentContext = parentTitle ? ` It is a focused part of ${parentTitle}.` : ''

  return {
    whatIsIt:
      `${title} is a JVM topic in ${sectionTitle}.${parentContext} Study it as ${focus}, ` +
      'using modern modular JDK terminology rather than the removed extension-loader/rt.jar model.',
    whyExists:
      `${title} matters because Java performance and failures occur below application code. ` +
      `An interview-ready answer connects the runtime rule to ${focus}.`,
    mentalModel:
      `Trace ${title} through .java → javac → .class → loader → verifier → interpreter/JIT. ` +
      'Then identify which memory area, GC phase, or native boundary is involved.',
    howItWorks: [
      {
        type: 'list',
        ordered: true,
        items: [
          `Place ${title} in the ${sectionTitle} stage of JVM execution.`,
          'Separate process-wide structures from per-thread structures.',
          'Name the observable artifact: bytecode, JFR event, GC log, heap dump, or stack trace.',
          'Diagnose from evidence before recommending a collector or heap flag.',
        ],
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Modern JVM wording',
        text:
          'Java 9+ uses Bootstrap, Platform, and Application class loaders. Modern JDKs use modules ' +
          'and runtime images; do not present rt.jar or an extension directory as the current architecture.',
      },
    ],
    internals: [
      {
        type: 'list',
        items: [
          'The JVM implementation is platform-specific; bytecode is the portable artifact.',
          'Heap and metaspace are shared; each Java thread owns a stack and PC register.',
          'HotSpot can invalidate speculative compiled code and deoptimize safely.',
          'Reachable objects are not garbage, even when the application no longer needs them.',
        ],
      },
    ],
    failureModes: [
      `Explaining ${title} with a diagram but no runtime symptom or diagnostic command.`,
      'Calling every OutOfMemoryError a heap leak.',
      'Treating System.gc() as a guaranteed collection or a production repair.',
    ],
    production: {
      reliability: [
        'Capture JVM version, flags, container limit, and workload before comparing behavior.',
        'Use JFR or async-profiler for CPU/allocation evidence.',
        'Use unified GC logs and heap-dump retained size for memory evidence.',
      ],
      maintainability: [
        `For ${title}, reproduce with the same JDK and flags as production.`,
        'Correlate pause, allocation, CPU, and latency timelines.',
        'Change one JVM variable at a time and retain before/after evidence.',
      ],
      observability: [
        'Heap occupancy after GC, allocation rate, pause percentiles, and CPU.',
        'Metaspace, direct-buffer pools, code cache, and thread count.',
      ],
    },
    interview: {
      expectations: [
        `Define ${title} and place it in ${sectionTitle}.`,
        'Explain one runtime failure and the evidence that distinguishes it.',
        'Use current Java 9+ terminology while recognizing legacy terms.',
      ],
      commonQuestions: [
        `How does ${title} work?`,
        `What breaks when ${title} is exhausted or misconfigured?`,
        'Which JVM tool would you use first?',
      ],
      followUps: [
        'Is this shared across threads?',
        'Can the JIT or GC move or eliminate this object?',
      ],
      misconceptions: [
        `${title} is fixed by increasing -Xmx.`,
        'The JVM is either purely compiled or purely interpreted.',
      ],
      traps: ['Repeating obsolete rt.jar and Extension ClassLoader diagrams as current Java.'],
      strongSignals: [
        'Separates heap, metaspace, thread stacks, and native memory.',
        'Chooses evidence before tuning.',
      ],
    },
    keyTakeaways: [
      `${title} belongs to ${sectionTitle}.`,
      `Focus on ${focus}.`,
      'Modern HotSpot is observable: collect evidence before changing flags.',
    ],
    interviewQuestions: [
      {
        level: 'basic',
        question: `What is ${title}, and where does it fit in JVM execution?`,
        answerHint: `Place it within ${sectionTitle} and name its input and output.`,
      },
      {
        level: 'intermediate',
        question: `What production failure is associated with ${title}?`,
        answerHint: 'Name the exception or symptom and one diagnostic artifact.',
      },
      {
        level: 'advanced',
        question: `What trade-off or optimization does HotSpot make around ${title}?`,
        answerHint: `Discuss ${focus}, then how profiling or GC evidence validates the explanation.`,
      },
    ],
    flashcards: [
      {
        front: title,
        back: `${sectionTitle}: component → memory area → observable evidence.`,
      },
      {
        front: `${title} debugging rule`,
        back: 'Version + flags + workload + JFR/GC/dump evidence before tuning.',
      },
    ],
    quickRevision: [
      `${title} — ${sectionTitle}`,
      `Focus: ${focus}`,
      '.java → bytecode → loader → interpreter/JIT',
      'Symptom → memory area → evidence → change',
    ],
  }
}
