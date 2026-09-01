import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Annotations (@Interface) attach metadata to declarations — classes, methods, fields, parameters — readable at compile time (annotation processors), runtime (reflection), or both. They do not directly alter program logic unless processed by tools or frameworks.',
  whyExists:
    'Externalizing cross-cutting configuration (JPA @Entity, Spring @Autowired, JUnit @Test) keeps code declarative. Frameworks introspect annotations to wire behavior without inheritance or boilerplate registration.',
  mentalModel:
    'Annotations are labels on code elements. Retention policy decides who reads them: SOURCE (compiler only), CLASS (bytecode, ignored at runtime), RUNTIME (reflection). Processors and frameworks act on those labels.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Define: @interface MyAnno { String value() default ""; }',
        '@Target(ElementType.METHOD) restricts where applicable.',
        '@Retention(RetentionPolicy.RUNTIME) for reflection.',
        '@Documented includes in Javadoc; @Inherited on class annotations propagates to subclasses.',
        'Apply: @MyAnno("x") on element; arrays: @Tags({"a","b"}).',
      ],
    },
    {
      type: 'table',
      headers: ['Built-in', 'Purpose'],
      rows: [
        ['@Override', 'Compile check method override'],
        ['@Deprecated', 'Mark obsolete API'],
        ['@SuppressWarnings', 'Silence compiler warnings'],
        ['@FunctionalInterface', 'Single abstract method check'],
        ['@SafeVarargs', 'Trust varargs generic array'],
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Custom runtime annotation + reflection',
      code: `@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
@interface Timed {}

class Service {
  @Timed
  public void work() { /* ... */ }
}

// Reflection reader
for (Method m : Service.class.getDeclaredMethods()) {
  if (m.isAnnotationPresent(Timed.class)) {
    long start = System.nanoTime();
    m.invoke(service);
    log.info("{} took {} ns", m.getName(), System.nanoTime() - start);
  }
}`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Repeatable annotation (J8+)',
      code: `@Repeatable(Roles.class)
@interface Role { String value(); }

@interface Roles { Role[] value(); }

@Role("admin") @Role("user")
class Account {}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Annotations are interfaces extending java.lang.annotation.Annotation — JVM generates annotation proxy classes.',
        'Annotation processors (APT) run at compile time — Lombok, MapStruct generate code.',
        'Spring scans classpath for @Component at startup — classpath scanning cost.',
        'Repeatable annotations stored in container annotation on class file.',
        'Type annotations (J8) on generic uses — Checker Framework nullness.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Declarative configuration co-located with code',
      'Framework integration without XML',
      'Compile-time validation via processors',
      'Reduces boilerplate registration',
    ],
    disadvantages: [
      'Magic behavior hidden from plain reading',
      'Reflection/runtime scan startup cost',
      'Over-annotation obscures logic',
      'Hard to refactor without IDE annotation support',
    ],
    alternatives: [
      'Explicit configuration files (YAML, XML)',
      'Convention over configuration without annotations',
      'Functional registration in code (module DSL)',
    ],
    whenToUse: [
      'Framework markers (@Test, @Path, @Entity)',
      'Compile-time code generation triggers',
      'API documentation (@Deprecated, @ApiStatus)',
    ],
    whenNotToUse: [
      'Business logic branching on annotation presence manually everywhere',
      'When explicit wiring is clearer for small apps',
    ],
  },
  failureModes: [
    'Wrong @Retention — runtime framework cannot see SOURCE-retained annotation.',
    'Missing @Target — annotation applied where meaningless; confusing errors.',
    'Assuming @Inherited on method annotations (only applies to class annotations).',
    'Annotation attribute type restrictions violated — must be primitives, String, Class, enum, annotation, or array.',
    'Relying on annotation order when not guaranteed.',
  ],
  interview: {
    expectations: [
      'Define custom annotation with meta-annotations',
      'Retention policies and Target',
      'Built-in annotations purpose',
    ],
    commonQuestions: [
      'What are annotations in Java?',
      'Difference between SOURCE, CLASS, RUNTIME retention?',
      'Can annotation have methods?',
      'How does @Override work?',
    ],
    followUps: [
      'What is annotation processing?',
      'Repeatable annotations?',
    ],
    misconceptions: [
      'Annotations execute code by themselves (need processor/framework)',
      'All annotations available at runtime (SOURCE/CLASS are not)',
    ],
    traps: ['Forgetting @Retention(RUNTIME) for reflection-based tools'],
    strongSignals: [
      'Meta-annotations @Target @Retention @Documented explained',
      'Mentions Lombok/MapStruct compile-time generation',
      'Distinguishes declarative vs imperative wiring',
    ],
  },
  keyTakeaways: [
    'Metadata on code; processed at compile or runtime.',
    '@Retention: SOURCE, CLASS, RUNTIME.',
    '@Target limits applicable elements.',
    'Annotation members are methods with defaults.',
    'Frameworks (Spring, JPA, JUnit) driven by annotations.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What is @Retention used for?',
      answerHint: 'Specifies whether annotation visible to source only, class file, or runtime reflection.',
    },
    {
      level: 'intermediate',
      question: 'How do you create a custom annotation?',
      answerHint: '@interface with members; meta-annotate Target, Retention; apply to elements.',
    },
    {
      level: 'advanced',
      question: 'What is the difference between annotation processing and runtime reflection?',
      answerHint: 'APT at compile time generates code; reflection reads RUNTIME annotations when program runs.',
    },
  ],
  flashcards: [
    { front: 'RetentionPolicy values', back: 'SOURCE, CLASS, RUNTIME' },
    { front: '@FunctionalInterface', back: 'Compiler checks single abstract method' },
    { front: 'Annotation member types', back: 'Primitives, String, Class, enum, annotation, arrays thereof' },
  ],
  quickRevision: [
    '@interface defines annotation',
    '@Target where allowed',
    '@Retention who sees it',
    'RUNTIME for reflection',
    'Built-in: Override, Deprecated',
    'Repeatable + container',
    'Frameworks consume metadata',
  ],
}
