import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Class loading is the JVM process of finding bytecode, defining a Class object (load → link → initialize), and assigning it to a ClassLoader. The platform uses a delegation hierarchy: bootstrap → platform (extension) → application class loaders, with parent-first delegation by default.',
  whyExists:
    'Classes must be loaded once per loader namespace, verified, and linked before execution. ClassLoaders enable modular isolation (app vs lib versions), dynamic agents, and OSGi/Spring Boot fat-jar separation—misunderstanding causes ClassNotFoundException and NoClassDefFoundError in production.',
  mentalModel:
    'Each loader owns a namespace of classes it defined. Child asks parent first; only if parent cannot load does child try. Bootstrap loads java.*; application loader loads your com.app.* from classpath.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Loading: find .class bytes, create Class metadata in metaspace.',
        'Linking: verify bytecode, prepare static fields, resolve symbolic refs (may defer).',
        'Initialization: run <clinit> static blocks once when class first actively used.',
        'loadClass(name): synchronized; delegate to parent.loadClass; else findClass.',
        'Custom ClassLoader: override findClass, defineClass(byte[]).',
        'Class.forName(name) initializes; ClassLoader.loadClass may not initialize until use.',
      ],
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'ClassNotFoundException vs NoClassDefFoundError',
      text: 'CNFE: loader could not find bytecode at load time. NCDFE: class was present at compile time but missing/failed init at runtime (static block exception, wrong loader).',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Explicit load vs forName',
      code: `Class<?> c1 = ClassLoader.getSystemClassLoader()
    .loadClass("com.app.Service"); // may not run static init
Class<?> c2 = Class.forName("com.app.Service"); // initializes class
// JDBC pattern (legacy):
Class.forName("org.postgresql.Driver"); // registers driver static block`,
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'Minimal custom ClassLoader',
      code: `class JarLoader extends ClassLoader {
    JarLoader(ClassLoader parent) { super(parent); }
    @Override
    protected Class<?> findClass(String name) throws ClassNotFoundException {
        byte[] bytes = readBytesFromPluginJar(name);
        return defineClass(name, bytes, 0, bytes.length);
    }
}`,
    },
  ],
  tradeoffs: {
    advantages: [
      'Parent delegation avoids duplicate core classes',
      'Custom loaders for plugins/hot deploy isolation',
      'Lazy loading speeds startup',
    ],
    disadvantages: [
      'Classloader leaks retain metaspace (redeploy without GC of loader)',
      'Parent-last breaks delegation—use only when intentional (containers)',
      'Complexity in modular class path (JPMS layers)',
    ],
    alternatives: ['JPMS module path for strong encapsulation', 'OSGi / isolated plugin frameworks'],
    whenToUse: ['Plugin architectures', 'Understanding CNFE in ops', 'Agent instrumentation'],
    whenNotToUse: ['Simple single-classpath apps without version conflicts'],
  },
  failureModes: [
    'ClassNotFoundException: wrong classpath, shaded jar missing, typo.',
    'NoClassDefFoundError: static init failed earlier; incompatible bytecode version.',
    'LinkageError: same class loaded by two loaders (cast fails at runtime).',
    'Metaspace OOM from leaked ClassLoader after hot redeploy.',
  ],
  interview: {
    expectations: [
      'Three phases load/link/init',
      'Parent delegation model',
      'CNFE vs NCDFE distinction',
    ],
    commonQuestions: ['ClassLoader hierarchy?', 'How JDBC driver loads?', 'Why custom ClassLoader?'],
    followUps: ['When static init runs?', 'JPMS vs classpath?', 'Classloader leak scenario?'],
    misconceptions: ['Classes reload on every new()', 'forName and loadClass identical', 'Bootstrap loader is a Java class'],
    traps: ['Same FQN two loaders → ClassCastException', 'Static init exception → NCDFE later'],
    strongSignals: ['Explains delegation', 'Mentions metaspace and leaks', 'Initialization trigger examples'],
  },
  keyTakeaways: [
    'Load → link → initialize once per loader.',
    'Parent-first delegation: bootstrap → platform → app.',
    'Class.forName triggers initialization; loadClass may defer.',
    'CNFE not found; NCDFE failed init or missing at runtime.',
    'Same class name different loaders = incompatible types.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Default class loader for application code?', answerHint: 'Application/system class loader—loads classpath; delegates java.* to bootstrap.' },
    { level: 'intermediate', question: 'When does static initializer run?', answerHint: 'During initialization when class first actively used (new, static field ref, forName, etc.)—once per class per loader.' },
    { level: 'advanced', question: 'Classloader leak in app server redeploy?', answerHint: 'Old loader retained by ThreadLocal/static/cache holding Class ref—metaspace grows; fix clear refs and use new loader on redeploy.' },
  ],
  flashcards: [
    { front: 'Class loading phases', back: 'Loading → Linking → Initialization.' },
    { front: 'Parent delegation', back: 'Child asks parent to load first; parent-first by default.' },
    { front: 'CNFE vs NCDFE', back: 'CNFE: not found at load; NCDFE: present at compile, missing/broken at runtime.' },
  ],
  quickRevision: [
    'load link init',
    'bootstrap platform app',
    'parent delegates first',
    'forName initializes',
    'defineClass custom loader',
    'loader leak metaspace',
    'two loaders ClassCastException',
  ],
  production: {
    reliability: [
      'Pin dependency versions in fat jars—CNFE often missing shaded transitive at runtime.',
      'Health-check critical classes load at startup to fail fast not mid-request.',
    ],
    security: [
      'Never defineClass on untrusted bytes without sandbox; custom loaders bypass module boundaries if misused.',
      'Restrict reflective Class.forName on user input to prevent arbitrary code load.',
    ],
    maintainability: [
      'Document custom ClassLoader plugin paths; ops needs classpath vs plugin dir distinction in runbooks.',
    ],
    observability: [
      'Metaspace metrics after redeploy—monotonic growth signals classloader leak.',
      '-verbose:class or JFR ClassLoad events for load storm diagnosis.',
    ],
  },
}
