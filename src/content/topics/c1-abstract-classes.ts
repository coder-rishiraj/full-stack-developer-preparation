import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'An abstract class is a partially implemented class that cannot be instantiated directly. It may contain abstract methods (no body) that subclasses must implement, plus concrete methods and fields shared across the hierarchy.',
  whyExists:
    'Some abstractions need shared state or common algorithm skeletons (template method pattern) while leaving specific steps to subclasses. Abstract classes fill the gap between a full concrete class and a pure interface contract.',
  mentalModel:
    'Abstract class = "mostly built, finish these parts." Subclasses extend one parent, inherit concrete helpers, and fill in abstract hooks. Think base Document with shared metadata + abstract render().',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Declare abstract class — may mix abstract and concrete methods.',
        'Cannot use new AbstractType(); compile error.',
        'Concrete subclass must implement all remaining abstract methods.',
        'Constructor runs on subclass instantiation via super(...) chain.',
        'May define final template method calling abstract hooks.',
      ],
    },
    {
      type: 'table',
      headers: ['Feature', 'Abstract class', 'Interface'],
      rows: [
        ['Instantiation', 'No', 'No (except anonymous/lambda for FI)'],
        ['Instance fields', 'Yes', 'Constants only'],
        ['Constructors', 'Yes', 'No'],
        ['Multiple inheritance', 'Single extends', 'Multiple implements'],
        ['Method bodies', 'Yes (mixed)', 'default/static/private'],
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Template method pattern',
      code: `public abstract class DataExporter {
  protected final Path outputDir;

  protected DataExporter(Path outputDir) {
    this.outputDir = outputDir;
  }

  public final void export(List<Row> rows) throws IOException {
    validate(rows);
    writeHeader();
    for (Row row : rows) writeRow(row);
    writeFooter();
  }

  protected abstract void writeRow(Row row) throws IOException;
  protected void writeHeader() {}
  protected void writeFooter() {}
  protected void validate(List<Row> rows) {
    if (rows.isEmpty()) throw new IllegalArgumentException();
  }
}`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Concrete subclass',
      code: `class CsvExporter extends DataExporter {
  CsvExporter(Path dir) { super(dir); }

  @Override
  protected void writeRow(Row row) throws IOException {
    Files.writeString(outputDir.resolve("out.csv"),
        row.toCsv() + "\\n", StandardOpenOption.APPEND);
  }
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Abstract methods have no body; JVM still uses virtual dispatch on subclass implementations.',
        'Abstract class may implement interfaces and leave some interface methods abstract.',
        'If subclass does not implement all abstracts, subclass must be abstract too.',
        'private methods in abstract class are helpers not visible to subclasses.',
        'sealed abstract class restricts which classes may extend (Java 17+).',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Shared fields and constructors reduce duplication',
      'Template method enforces algorithm structure',
      'Can provide default behavior subclasses override selectively',
      'Single inheritance keeps hierarchy clear',
    ],
    disadvantages: [
      'Single inheritance slot consumed — blocks other extends',
      'Tight coupling to base class implementation',
      'Fragile base class — changes break subclasses',
      'Harder to mock than interface in some test setups',
    ],
    alternatives: [
      'Interface + default methods for simple shared code',
      'Composition — delegate to strategy/helper objects',
      'sealed class hierarchy with records for closed domains',
    ],
    whenToUse: [
      'Shared state + partial implementation across family of types',
      'Template method with invariant algorithm steps',
      'Framework base classes (HttpServlet, InputStream)',
    ],
    whenNotToUse: [
      'Only method signatures needed — use interface',
      'Subclasses unrelated except for one method — use functional interface',
      'Need multiple unrelated type roles — interfaces',
    ],
  },
  failureModes: [
    'Subclass violates LSP — breaks when used as parent type.',
    'Overriding template method steps incorrectly — bypasses invariant logic.',
    'Exposing protected mutable state subclasses corrupt.',
    'Deep abstract hierarchies — hard to navigate and test.',
    'Choosing abstract class blocks extending another useful base.',
  ],
  interview: {
    expectations: [
      'Contrast abstract class vs interface with concrete criteria',
      'Explain template method pattern',
      'Know instantiation rules and constructor chaining',
    ],
    commonQuestions: [
      'Can abstract class have a constructor?',
      'Abstract class vs interface?',
      'Can abstract class be final?',
      'What is template method pattern?',
    ],
    followUps: [
      'When would you combine abstract class + interfaces?',
      'What is fragile base class problem?',
    ],
    misconceptions: [
      'Abstract class must have at least one abstract method (false — can be fully concrete but uninstantiable)',
      'Abstract methods cannot be private (true in Java — private abstract illegal)',
    ],
    traps: ['Saying abstract classes support multiple inheritance'],
    strongSignals: [
      'Gives decision tree: state + extends vs capability + implements',
      'Template method example with final keyword',
      'Mentions sealed abstract hierarchies',
    ],
  },
  keyTakeaways: [
    'Abstract class: partial implementation, not instantiable.',
    'Subclasses implement abstract methods or stay abstract.',
    'Use for shared state + template method skeleton.',
    'Single inheritance — prefer interface when only contract needed.',
    'Constructor chain: subclass super() invokes abstract class init.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Can you create an instance of an abstract class?',
      answerHint: 'No — must subclass and instantiate concrete class.',
    },
    {
      level: 'intermediate',
      question: 'Explain template method pattern with abstract class.',
      answerHint: 'Final method defines algorithm; abstract hooks for variable steps.',
    },
    {
      level: 'advanced',
      question: 'Abstract class implementing interface — when and why?',
      answerHint: 'Provide partial interface impl + shared state; subclasses finish rest.',
    },
  ],
  flashcards: [
    { front: 'Abstract class instantiation', back: 'Cannot new; concrete subclass required' },
    { front: 'vs interface', back: 'Abstract: fields, ctors, single extends; Interface: multiple types' },
    { front: 'Template method', back: 'Final algorithm in base; abstract steps in subclass' },
  ],
  quickRevision: [
    'abstract class + abstract methods',
    'Mix concrete and abstract members',
    'Constructor allowed; no direct new',
    'extends one; implements interfaces OK',
    'Template method: final + hooks',
    'Choose over interface when shared state',
    'sealed restricts subclasses',
  ],
}
