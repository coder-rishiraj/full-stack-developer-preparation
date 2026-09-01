import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Builder is a creational pattern that separates construction of a complex object from its representation — assembling step-by-step via a fluent API until `build()` produces an immutable or fully validated product.',
  whyExists:
    'Constructors with 12 optional parameters (telescoping constructor anti-pattern) are unreadable and error-prone (`new Pizza(true, false, true, null, 2, ...)`). Builder makes optional fields explicit and validates before creation.',
  mentalModel:
    'Assembly line: Builder accumulates choices (`size(LARGE).topping("pepperoni").build()`); Director optional recipes call builder steps in order. Product is complete and valid only after build().',
  howItWorks: [
    {
      type: 'mermaid',
      caption: 'Builder accumulates config; build() creates product',
      diagram: `sequenceDiagram
  participant Client
  participant Builder
  participant Product
  Client->>Builder: size(LARGE)
  Client->>Builder: crust(THIN)
  Client->>Builder: build()
  Builder->>Product: new Pizza validated
  Builder-->>Client: Product`,
    },
    {
      type: 'list',
      items: [
        'Builder: chained setter methods return this; build() creates product',
        'Product: often immutable once built',
        'Director (optional): encapsulates preset build sequences',
        'Validate in build() — fail fast on illegal combinations',
        'Distinct from Factory: Builder focuses on stepwise multi-field assembly',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Fluent builder with validation',
      code: `public final class EmailMessage {
  private final String to, subject, body;
  private EmailMessage(Builder b) {
    this.to = b.to; this.subject = b.subject; this.body = b.body;
  }
  public static class Builder {
    private String to, subject, body;
    public Builder to(String to) { this.to = to; return this; }
    public Builder subject(String s) { this.subject = s; return this; }
    public Builder body(String b) { this.body = b; return this; }
    public EmailMessage build() {
      if (to == null || to.isBlank()) throw new IllegalStateException("to required");
      return new EmailMessage(this);
    }
  }
}

EmailMessage msg = new EmailMessage.Builder()
  .to("user@example.com").subject("Hi").body("...").build();`,
    },
  ],
  implementation: [
    {
      language: 'java',
      caption: 'Lombok @Builder / Java records with builder',
      code: `@Builder
public class OrderRequest {
  private final String userId;
  private final List<LineItem> items;
}`,
    },
    {
      language: 'java',
      caption: 'StringBuilder — builder for mutable buffer',
      code: `String s = new StringBuilder().append("Hello").append(" World").toString();`,
    },
  ],
  tradeoffs: {
    advantages: [
      'Readable optional-parameter construction',
      'Centralized validation at build time',
      'Immutable products safe to share',
      'Same construction process, different representations possible',
    ],
    disadvantages: [
      'Boilerplate for simple 2-field objects',
      'Duplicate field list in builder and product',
      'Mutable builder not thread-safe until build()',
    ],
    alternatives: [
      'Factory method with sensible defaults',
      'Named optional parameters (Kotlin, Python)',
      'Record + compact constructor validation',
      'Telescoping constructors (avoid)',
    ],
    whenToUse: [
      'Many optional fields or complex validation rules',
      'Immutable configuration objects',
      'Stepwise assembly (SQL query builder, HTTP client)',
    ],
    whenNotToUse: [
      'Simple data with 2-3 required fields — constructor or record',
    ],
  },
  failureModes: [
    'build() without required fields → runtime error late',
    'Reusing same builder instance after build() without reset',
    'Builder allows illegal combo detected only in product constructor',
    'Exposing builder after build allows tampering',
  ],
  production: {
    maintainability: ['Codegen (Lombok, Immutables) for large builders', 'Document required vs optional fields'],
    reliability: ['Validate cross-field rules in build() with clear errors'],
  },
  interview: {
    expectations: [
      'Contrast Builder vs Factory vs Abstract Factory',
      'Telescoping constructor problem',
      'Show fluent API sketch',
    ],
    commonQuestions: [
      'When use Builder?',
      'Builder vs Factory Method?',
    ],
    followUps: [
      'Thread-safe builder?',
      'Director role example?',
    ],
    misconceptions: [
      'Builder and Factory are interchangeable — different focus',
      'Every class needs Builder',
    ],
    traps: [
      'Not validating in build()',
    ],
    strongSignals: [
      'Immutable product + fluent chain',
      'Pizza/Email/HttpRequest examples',
    ],
  },
  keyTakeaways: [
    'Stepwise construction with fluent API.',
    'Fixes telescoping constructor anti-pattern.',
    'Validate at build(); product often immutable.',
    'Factory chooses type; Builder assembles one complex type.',
    'StringBuilder, Lombok @Builder are everyday examples.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Builder pattern solves what problem?', answerHint: 'Complex object creation with many optional params; readable assembly.' },
    { level: 'intermediate', question: 'Builder vs Factory?', answerHint: 'Factory creates which type/instance; Builder configures steps of one complex object.' },
    { level: 'intermediate', question: 'Telescoping constructor?', answerHint: 'Many overloaded constructors forwarding defaults — unreadable; Builder fixes.' },
    { level: 'advanced', question: 'Director in Builder?', answerHint: 'Encapsulates build steps order e.g. buildMeal() calls builder.addDrink().addMain().' },
  ],
  flashcards: [
    { front: 'Builder', back: 'Fluent stepwise construction; build() validates' },
    { front: 'Telescoping constructor', back: 'Anti-pattern Builder replaces' },
    { front: 'vs Factory', back: 'Builder = one product many steps; Factory = which implementation' },
    { front: 'build() validation', back: 'Fail fast before returning product' },
  ],
  quickRevision: [
    'Fluent chain returns this',
    'Immutable product',
    'Validate in build()',
    'Director optional',
    'Not for trivial 2-field objects',
  ],
  patternRecognition: [
    'Constructor with 8+ nullable params → Builder',
    'Illegal object states possible → enforce in build()',
  ],
  commonMistakes: [
    'Public product constructor bypassing builder validation',
    'Builder mutable after build() shared',
  ],
}
