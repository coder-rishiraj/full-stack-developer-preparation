import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Decorator is a structural pattern that wraps a component in nested wrapper objects, each adding behavior while preserving the same interface — alternative to subclass explosion for cross-cutting enhancements.',
  whyExists:
    'Inheritance for features (`BufferedFileInputStream extends FileInputStream extends ...`) creates combinatorial subclasses. Decorator composes behaviors at runtime: `new Gzip(new Buffered(new FileStream()))`.',
  mentalModel:
    'Russian dolls: each layer implements same interface, delegates to inner layer, adds sauce before/after. Client sees uniform `InputStream.read()`; layers add buffering, compression, metrics transparently.',
  howItWorks: [
    {
      type: 'mermaid',
      caption: 'Decorators implement same interface, wrap component',
      diagram: `classDiagram
  class Coffee {
    <<interface>>
    +cost() double
    +description() String
  }
  class SimpleCoffee
  class MilkDecorator {
    -inner: Coffee
    +cost()
  }
  class SugarDecorator {
    -inner: Coffee
  }
  Coffee <|.. SimpleCoffee
  Coffee <|.. MilkDecorator
  Coffee <|.. SugarDecorator
  MilkDecorator --> Coffee
  SugarDecorator --> Coffee`,
    },
    {
      type: 'list',
      items: [
        'Component interface defines core operations',
        'Concrete component = base behavior',
        'Decorator implements interface, holds Component reference',
        'Decorator forwards calls, adds pre/post logic',
        'Stack decorators in any order (mind ordering effects)',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Coffee decorator classic',
      code: `public interface Coffee {
  double cost();
  String description();
}

public class MilkDecorator implements Coffee {
  private final Coffee inner;
  public MilkDecorator(Coffee inner) { this.inner = inner; }
  public double cost() { return inner.cost() + 0.5; }
  public String description() { return inner.description() + ", milk"; }
}

Coffee order = new MilkDecorator(new SimpleCoffee());`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Java I/O streams are decorators',
      code: `InputStream in = new BufferedInputStream(
    new GZIPInputStream(new FileInputStream("data.gz")));`,
    },
  ],
  implementation: [
    {
      language: 'typescript',
      caption: 'Middleware as decorator chain',
      code: `const withAuth = (handler) => (req, res) => {
  if (!req.user) return res.status(401).end()
  return handler(req, res)
}`,
    },
  ],
  tradeoffs: {
    advantages: [
      'Compose features at runtime',
      'Single Responsibility per decorator',
      'Open/Closed without subclass forest',
    ],
    disadvantages: [
      'Many small wrapper classes',
      'Hard to remove one layer from middle of stack',
      'Order-dependent behavior can surprise',
      'Debugging through deep wrapper chains',
    ],
    alternatives: [
      'Mixin/trait composition',
      'AOP (AspectJ) for cross-cutting at bytecode level',
      'Middleware pipeline explicit list',
    ],
    whenToUse: [
      'Optional layered behavior (logging, cache, auth)',
      'Stream/filter pipelines',
      'UI component wrapping',
    ],
    whenNotToUse: [
      'Core variant behavior — Strategy may be clearer',
      'Interface must change — Adapter not Decorator',
    ],
  },
  failureModes: [
    'Decorator breaks LSP if it strengthens preconditions',
    'Double application of same decorator (double charge)',
    'Identity equality broken across wrappers',
    'Decorator holding resources not closed with inner',
  ],
  production: {
    performance: ['Avoid deep stacks on hot paths without need'],
    observability: ['Decorators ideal for metrics/tracing wrappers'],
    maintainability: ['Document decorator ordering contracts'],
  },
  interview: {
    expectations: [
      'Contrast Decorator vs Adapter vs Proxy',
      'Java I/O or coffee example',
      'Explain composition order',
    ],
    commonQuestions: [
      'Decorator vs inheritance?',
      'Implement logging decorator for repository',
    ],
    followUps: [
      'Decorator vs Chain of Responsibility?',
      'Spring @Transactional as decorator?',
    ],
    misconceptions: [
      'Decorator must change interface — it preserves it',
      'Same as Proxy — Proxy often controls access/lazy init',
    ],
    traps: [
      'Using decorator when interface conversion needed (Adapter)',
    ],
    strongSignals: [
      'BufferedInputStream example',
      'Runtime stacking story',
    ],
  },
  keyTakeaways: [
    'Same interface, wrapped delegation, added behavior.',
    'Avoids subclass combinatorics.',
    'Java I/O streams = canonical example.',
    'Order of decorators matters.',
    'Differs from Adapter (interface change) and Proxy (access control).',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Decorator pattern purpose?', answerHint: 'Add responsibilities dynamically by wrapping; same interface.' },
    { level: 'intermediate', question: 'Decorator vs Proxy?', answerHint: 'Both wrap; decorator adds behavior, proxy often controls access/lazy/caching same role.' },
    { level: 'intermediate', question: 'Java I/O example?', answerHint: 'BufferedInputStream decorates FileInputStream.' },
    { level: 'advanced', question: 'Logging decorator for Repository?', answerHint: 'Implement Repository, delegate to inner, log before/after calls.' },
  ],
  flashcards: [
    { front: 'Decorator', back: 'Wrap component; same interface; add behavior' },
    { front: 'vs Adapter', back: 'Decorator keeps interface; Adapter converts interface' },
    { front: 'vs Proxy', back: 'Proxy access/lazy; Decorator feature stacking' },
    { front: 'Java I/O', back: 'Stream wrappers are decorators' },
  ],
  quickRevision: [
    'Wrap + delegate + enhance',
    'Stack at runtime',
    'Coffee / I/O streams',
    'OCP without subclass explosion',
    'Mind decorator order',
  ],
  patternRecognition: [
    'Subclass per optional feature combo → Decorator',
    'HTTP middleware stack → decorator/pipeline',
  ],
  commonMistakes: [
    'Changing method signatures in decorator',
    'Business logic in decorator that belongs in domain',
  ],
}
