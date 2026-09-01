import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Template Method defines algorithm skeleton in base class — subclasses override specific steps (hooks) without changing structure. Hollywood principle: "Don\'t call us, we\'ll call you." Base class controls flow; variants customize hooks.',
  whyExists:
    'Duplicate algorithm structure with only step differences — buildReport(), processRequest(), test lifecycle. Template Method centralizes invariant order (validate → execute → cleanup) while subclasses specialize details.',
  mentalModel:
    'Cookie recipe template: mix dry, mix wet, combine, bake — same steps; subclasses swap chocolate chip vs oatmeal in addIns hook. JUnit @BeforeEach testMethod @AfterEach is template method framework calls.',
  howItWorks: [
    {
      type: 'mermaid',
      caption: 'Template method flow',
      diagram: `flowchart TB
  A[templateMethod] --> B[step1 hook]
  B --> C[step2 abstract]
  C --> D[step3 hook optional]
  D --> E[step4 final]
  subgraph SubclassA
    C
    D
  end`,
    },
    {
      type: 'list',
      items: [
        'final templateMethod() prevents overriding algorithm order.',
        'abstract methods must be implemented by subclass.',
        'hook methods default empty — optional override.',
        'Differs from Strategy: inheritance vs composition for variation.',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Data export template',
      code: `public abstract class DataExporter {
  public final void export(Path dest) {
    List<Row> data = fetchData();
    validate(data);
    writeFormat(dest, transform(data));
    notifyComplete();
  }
  protected abstract List<Row> fetchData();
  protected abstract void writeFormat(Path dest, List<Row> rows);
  protected void validate(List<Row> data) { /* default noop hook */ }
  protected void notifyComplete() { log.info("done"); }
}

public class CsvExporter extends DataExporter {
  protected List<Row> fetchData() { return repo.findAll(); }
  protected void writeFormat(Path dest, List<Row> rows) { /* CSV */ }
}`,
    },
  ],
  implementation: [
    {
      language: 'java',
      caption: 'Servlet doGet/doPost template in HttpServlet',
      code: `service() -> dispatch -> doGet() // subclass implements`,
    },
  ],
  tradeoffs: {
    advantages: ['DRY algorithm structure', 'Enforces step order', 'Hooks for optional customization'],
    disadvantages: ['Inheritance rigidity', 'Hard to change runtime algorithm', 'Deep hierarchy confusion'],
    alternatives: ['Strategy composition for runtime swap', 'Pipeline of functions', 'Template in functional style'],
    whenToUse: ['Fixed multi-step workflow with variant steps', 'Framework lifecycle hooks'],
    whenNotToUse: ['Algorithm structure varies completely', 'Prefer composition over inheritance'],
  },
  failureModes: [
    'Subclass overrides templateMethod breaking order',
    'Hook override throws — partial algorithm state',
    'Too many abstract steps — subclass burden',
    'Leaky hook exposing internal steps wrongly',
    'Diamond inheritance if multiple templates',
  ],
  production: {
    maintainability: ['Keep templateMethod final', 'Document which hooks safe to override'],
    reliability: ['try/finally cleanup step in template base'],
    observability: ['Template base logs step timing around hooks'],
  },
  interview: {
    expectations: ['Skeleton in base subclass hooks', 'final templateMethod', 'vs Strategy', 'JUnit/HttpServlet examples'],
    commonQuestions: ['Share algorithm structure across classes?', 'Template Method vs Strategy?'],
    followUps: ['Hook method purpose?', 'When not use inheritance template?'],
    misconceptions: ['Same as abstract factory', 'All methods must abstract'],
    traps: ['Using Strategy when fixed inherited skeleton intended'],
    strongSignals: ['final templateMethod', 'abstract + hook methods', 'HttpServlet service example'],
  },
  keyTakeaways: [
    'Base class defines algorithm skeleton; subclasses fill steps.',
    'templateMethod often final to lock step order.',
    'Hooks optional override; abstract steps required.',
    'Strategy composes algorithm; Template Method inherits skeleton.',
    'JUnit and HttpServlet are classic template examples.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Template Method pattern?', answerHint: 'Base defines algorithm skeleton calling abstract/hook methods subclasses implement.' },
    { level: 'intermediate', question: 'Template Method vs Strategy?', answerHint: 'Template: inheritance fixed skeleton; Strategy: composition swap whole algorithm at runtime.' },
    { level: 'advanced', question: 'Prevent subclass breaking algorithm order?', answerHint: 'final templateMethod(); only hooks/abstract steps overridable.' },
  ],
  flashcards: [
    { front: 'templateMethod', back: 'Final method defining algorithm step order' },
    { front: 'Hook method', back: 'Optional override with default in base' },
    { front: 'Hollywood principle', back: 'Framework calls subclass hooks not vice versa' },
    { front: 'vs Strategy', back: 'Template inheritance skeleton; Strategy composition swap' },
  ],
  quickRevision: ['Skeleton in base', 'final templateMethod', 'abstract steps', 'optional hooks', 'Inheritance not Strategy'],
}
