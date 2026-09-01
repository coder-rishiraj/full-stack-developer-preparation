import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Proxy pattern provides surrogate or placeholder controlling access to real object — lazy loading, access control, logging, caching, remote stub. Structural pattern: Proxy implements same interface as RealSubject; client often unaware of indirection.',
  whyExists:
    'Expensive object creation, remote service call, or sensitive resource needs gatekeeper. Proxy defers cost until needed, checks permissions before delegate, or adds cross-cutting behavior without polluting real class. Distinct from Spring AOP proxy (framework) but same idea.',
  mentalModel:
    'Personal assistant gatekeeping CEO. Caller asks assistant (proxy); assistant checks calendar, logs request, then forwards to CEO (real subject) if allowed. Virtual proxy loads heavy image thumbnail first, full image on demand.',
  howItWorks: [
    {
      type: 'mermaid',
      caption: 'Proxy controls access to RealSubject',
      diagram: `classDiagram
  class Subject {
    <<interface>>
    +request()
  }
  class RealSubject {
    +request()
  }
  class Proxy {
    -real: RealSubject
    +request()
  }
  Subject <|.. RealSubject
  Subject <|.. Proxy
  Proxy --> RealSubject`,
    },
    {
      type: 'table',
      headers: ['Proxy type', 'Purpose'],
      rows: [
        ['Virtual', 'Lazy init expensive object'],
        ['Protection', 'Role check before delegate'],
        ['Remote', 'RMI/gRPC stub local representative'],
        ['Caching', 'Return cached result if valid'],
        ['Smart reference', 'Ref counting audit'],
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Protection proxy for document access',
      code: `public class SecureDocumentProxy implements Document {
  private Document real;
  private final User user;

  public String getContent() {
    if (!user.hasRole("READ_DOCS")) throw new AccessDeniedException();
    if (real == null) real = new HeavyDocumentLoader().load();
    return real.getContent();
  }
}`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Virtual proxy lazy load',
      code: `public class ImageProxy implements Image {
  private RealImage real;
  private final String path;
  public void display() {
    if (real == null) real = new RealImage(path); // load on first use
    real.display();
  }
}`,
    },
  ],
  tradeoffs: {
    advantages: ['Control access and lazy load', 'Add behavior transparently', 'Same interface as subject'],
    disadvantages: ['Extra indirection layer', 'Client must use interface type', 'Remote proxy latency/errors'],
    alternatives: ['Decorator augments always', 'Spring AOP for cross-cutting', 'Direct call if no gate needed'],
    whenToUse: ['Lazy loading', 'Access control wrapper', 'Remote service stub', 'Caching facade'],
    whenNotToUse: ['Simple delegation with no added value', 'When framework AOP sufficient'],
  },
  failureModes: [
    'Proxy not interchangeable — wrong interface',
    'Double proxy wrapping confusion',
    'Cache proxy stale invalidation missed',
    'Remote proxy hides network failures',
    'Lazy init thread-unsafe double create',
  ],
  production: {
    reliability: ['Synchronized lazy init or holder idiom', 'Circuit breaker on remote proxy'],
    performance: ['Cache proxy with TTL', 'Lazy load reduces startup'],
    security: ['Protection proxy centralizes auth checks'],
  },
  interview: {
    expectations: ['Proxy vs Decorator vs Adapter', 'Virtual and protection types', 'Spring proxy relation'],
    commonQuestions: ['Lazy load heavy object?', 'Proxy vs Decorator?'],
    followUps: ['Remote proxy example?', 'Spring @Transactional proxy type?'],
    misconceptions: ['Proxy same as Facade', 'Decorator and Proxy identical'],
    traps: ['Confusing Spring AOP with Gang of Four Proxy only'],
    strongSignals: ['Same interface control access', 'Lazy init virtual proxy', 'Decorator adds behavior always'],
  },
  keyTakeaways: [
    'Proxy controls access to real subject via same interface.',
    'Virtual proxy defers expensive creation.',
    'Protection proxy enforces permissions.',
    'Decorator wraps to add behavior; Proxy controls access.',
    'Spring beans often are dynamic proxies for AOP.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Proxy pattern purpose?', answerHint: 'Surrogate controlling access — lazy load, security, logging, remote stub.' },
    { level: 'intermediate', question: 'Proxy vs Decorator?', answerHint: 'Proxy controls access/lazy; Decorator adds responsibilities wrapping every call.' },
    { level: 'advanced', question: 'Hibernate lazy collection proxy?', answerHint: 'Virtual proxy loads DB rows on first access — classic ORM lazy loading.' },
  ],
  flashcards: [
    { front: 'Virtual proxy', back: 'Lazy initialization of expensive RealSubject' },
    { front: 'Protection proxy', back: 'Checks permissions before delegating' },
    { front: 'Same interface', back: 'Proxy implements Subject like RealSubject' },
    { front: 'vs Decorator', back: 'Proxy controls access; Decorator adds behavior layers' },
  ],
  quickRevision: ['Surrogate controls access', 'Virtual lazy load', 'Protection auth', 'Same interface', 'Not Facade'],
}
