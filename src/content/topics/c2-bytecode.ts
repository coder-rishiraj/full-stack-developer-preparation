import type { TopicContent } from '@/domain/types'

export const bytecodeContent: TopicContent = {
  whatIsIt:
    'Java bytecode is the platform-neutral instruction set stored in .class files (JVM spec). Each method body is a sequence of opcodes operating on an operand stack and local variable slots — not source lines, not native machine code.',
  whyExists:
    'Bytecode is the portable contract between javac (or Kotlin/Scala compilers) and any JVM implementation. It enables verification before execution, JIT optimization, and decompilation/debugging without shipping source.',
  mentalModel:
    'Think stack machine: push constants/locals, operate (iadd, invokevirtual), pop results. Control flow uses goto, if_icmp*. The verifier ensures you never pop an int and use it as a reference.',
  howItWorks: [
    {
      type: 'paragraph',
      text: 'A .class file has magic 0xCAFEBABE, version, constant pool (strings, class/method refs), fields, methods with Code attributes (bytecode + exception table + stack map frames).',
    },
    {
      type: 'table',
      headers: ['Opcode family', 'Examples', 'Purpose'],
      rows: [
        ['Load/store', 'iload, aload, istore', 'Local variables 0..n'],
        ['Stack ops', 'iconst_1, dup, pop', 'Operand stack manipulation'],
        ['Arithmetic', 'iadd, lmul', 'Primitive math'],
        ['Control', 'ifeq, goto, tableswitch', 'Branches and loops'],
        ['Invoke', 'invokevirtual, invokestatic, invokedynamic', 'Method calls; lambda/bootstrap'],
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'invokedynamic',
      text: 'Java 7+ uses invokedynamic for lambdas, string concat, pattern matching bootstraps — bytecode stays stable while language features evolve.',
    },
  ],
  architecture: {
    mermaid: `flowchart LR
  Source[.java] --> Javac[javac]
  Javac --> ClassFile[.class]
  ClassFile --> CP[Constant Pool]
  ClassFile --> Code[Code attribute]
  Code --> Stack[Operand Stack]
  Code --> Locals[Local Vars]
  Stack --> JVM[JVM execute / JIT]`,
    caption: 'Methods compile to stack-based bytecode',
  },
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Simple method',
      code: `int add(int a, int b) {
  return a + b;
}
// javap -c → iload_1, iload_2, iadd, ireturn`,
    },
    {
      type: 'code',
      language: 'bash',
      caption: 'Disassemble with javap',
      code: `javap -c -v MyClass.class
# Shows opcodes, constant pool refs, stack map frames`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Verifier checks: no stack underflow/overflow, type consistency on every instruction, branch targets valid (StackMapTable since Java 6).',
        'Wide instructions extend local index beyond 255 (wide iload).',
        'Exception table: try range → handler offset → catch type; finally compiles to duplicated handlers or JSR/RET (legacy) / inline paths.',
        'Synthetic methods: bridge methods for generics, lambda bodies as private synthetics.',
        'JIT reads same bytecode IR; may inline, escape-analyze, and eliminate allocations.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Portable across JVM implementations and OS',
      'Verifiable safety before native execution',
      'Stable target for alternative JVM languages',
    ],
    disadvantages: [
      'Verbose vs native code; indirection through constant pool',
      'Decompilable (IP concern for client apps)',
      'Not human-readable without tools',
    ],
    alternatives: [
      'GraalVM native AOT (no bytecode at runtime)',
      'Dalvik/ART dex (Android — different format)',
    ],
    whenToUse: [
      'Default Java/Kotlin deployment model',
      'Bytecode agents (AspectJ, tracing) instrument at load time',
    ],
    whenNotToUse: [
      'When sub-second cold start dominates (consider native image)',
    ],
  },
  failureModes: [
    'VerifyError at class load — corrupt jar or ASM bug generating invalid stack maps.',
    'NoSuchMethodError — compile-time call site vs runtime class mismatch (binary incompatibility).',
    'Incorrect bytecode weaving breaks verifier or causes IllegalAccessError.',
  ],
  interview: {
    expectations: [
      'Describe stack-based execution model',
      'Name invoke* variants and when each applies',
      'Know javap for disassembly',
    ],
    commonQuestions: [
      'How is Java platform-independent if it compiles?',
      'Difference between invokevirtual and invokeinterface?',
      'What does invokedynamic do?',
    ],
    followUps: [
      'How does the verifier work?',
      'How are try/catch/finally represented?',
    ],
    misconceptions: [
      'Bytecode is the same as machine code',
      'javac produces optimized native executables',
    ],
    traps: ['Confusing invokestatic with invokevirtual for instance methods'],
    strongSignals: [
      'Explains operand stack + locals',
      'Mentions constant pool and StackMapTable',
      'Links invokedynamic to lambdas',
    ],
  },
  keyTakeaways: [
    'Bytecode = stack machine in .class Code attributes.',
    'Constant pool holds symbolic refs resolved at link time.',
    'Verifier enforces type-safe stack behavior before run.',
    'invokevirtual (instance), invokeinterface, invokestatic, invokespecial (ctor/private/super).',
    'javap -c -v is the interview debugging tool.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What is Java bytecode?',
      answerHint: 'Platform-independent JVM instructions in .class files; stack-based execution.',
    },
    {
      level: 'intermediate',
      question: 'Why invokeinterface vs invokevirtual?',
      answerHint: 'interface call uses interface method resolution; JVM may use vtables/itables; invokevirtual for class hierarchy.',
    },
    {
      level: 'advanced',
      question: 'Role of StackMapTable in verification?',
      answerHint: 'Precomputed stack/local types at branch targets; faster/safer verification vs dataflow analysis alone.',
    },
  ],
  flashcards: [
    { front: '.class magic number', back: '0xCAFEBABE' },
    { front: 'Operand stack model', back: 'Opcodes push/pop typed values; no registers in bytecode IR' },
    { front: 'invokedynamic used for', back: 'Lambdas, string concat bootstraps, language features' },
  ],
  quickRevision: [
    'Stack machine: locals + operand stack',
    'Constant pool: strings, class/method refs',
    'Verifier before execution',
    'invoke*: virtual, interface, static, special, dynamic',
    'javap -c -v to disassemble',
    'Exception table per Code attribute',
    'JIT optimizes same bytecode',
  ],
}

export const content = bytecodeContent
