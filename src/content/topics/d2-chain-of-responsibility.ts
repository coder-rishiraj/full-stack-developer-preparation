import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Chain of Responsibility passes request along linked handlers until one processes it — each handler decides to handle or forward to next. Used in servlet filters, Spring Security filter chain, logging pipelines, and support ticket escalation levels.',
  whyExists:
    'Avoid giant if-else dispatch or coupling sender to every handler. Add new processing step by inserting link in chain without changing client or existing handlers. Open/Closed for cross-cutting pipelines.',
  mentalModel:
    'Assembly line checkpoints. Package arrives at station A — not my job, pass down. Station B validates — pass. Station C ships. Client sends to first station only; does not know how many stations exist.',
  howItWorks: [
    {
      type: 'mermaid',
      caption: 'Handler chain',
      diagram: `flowchart LR
  R[Request] --> H1[AuthHandler]
  H1 -->|next| H2[ValidationHandler]
  H2 -->|next| H3[BusinessHandler]
  H3 -->|next| H4[LoggingHandler]
  H1 -.->|reject| E[403]
  H3 --> OK[Response]`,
    },
    {
      type: 'list',
      items: [
        'AbstractHandler holds next reference + setNext or constructor chain.',
        'handle(request): if canHandle process else next.handle(request).',
        'Spring OncePerRequestFilter chain is canonical servlet example.',
        'Can short-circuit — auth failure never reaches business handler.',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Support ticket escalation chain',
      code: `public abstract class SupportHandler {
  private SupportHandler next;

  public SupportHandler linkWith(SupportHandler n) {
    this.next = n;
    return n;
  }

  public abstract boolean handle(Ticket ticket);

  protected boolean passToNext(Ticket ticket) {
    return next != null && next.handle(ticket);
  }
}

public class L1Handler extends SupportHandler {
  public boolean handle(Ticket t) {
    if (t.getSeverity() == LOW) { resolve(t); return true; }
    return passToNext(t);
  }
}
// L1.linkWith(L2).linkWith(L3);`,
    },
  ],
  implementation: [
    {
      language: 'java',
      caption: 'Spring filter chain analogy',
      code: `// SecurityFilterChain: JwtFilter -> CsrfFilter -> AuthorizationFilter
// Each extends OncePerRequestFilter doFilterInternal -> chain.doFilter`,
    },
  ],
  tradeoffs: {
    advantages: ['Decouple sender from handlers', 'Dynamic chain composition', 'Single Responsibility per link'],
    disadvantages: ['No guarantee any handler processes — request may fall through', 'Hard to debug order', 'Performance overhead many links'],
    alternatives: ['Explicit pipeline list', 'Event bus', 'Middleware stack in framework'],
    whenToUse: ['Filter chains', 'Escalation workflows', 'Processing pipelines with optional steps'],
    whenNotToUse: ['Exactly one handler always required — use Strategy', 'Need guaranteed processing audit'],
  },
  failureModes: [
    'Broken chain link null — silent drop',
    'Wrong order — business before auth',
    'Infinite loop if handler re-invokes self',
    'Handler swallows exception — chain stops opaque',
    'No handler matched — unhandled request',
  ],
  production: {
    reliability: ['Default terminal handler returns 404/500 explicit'],
    observability: ['Trace span per handler link with order tag'],
    maintainability: ['Document chain order in config class', 'Integration test full chain'],
  },
  interview: {
    expectations: ['Chain structure', 'Spring Security filter example', 'vs Decorator', 'Short-circuit'],
    commonQuestions: ['Implement middleware pipeline?', 'Servlet filter chain?'],
    followUps: ['What if no handler matches?', 'Chain vs Decorator?'],
    misconceptions: ['Same as Observer', 'Client picks handler directly'],
    traps: ['Forgetting to call next in filter'],
    strongSignals: ['linkWith builder', 'passToNext', 'Spring filter chain reference'],
  },
  keyTakeaways: [
    'Handlers linked; each handles or forwards to next.',
    'Client sends to chain head only.',
    'Spring Security filters are Chain of Responsibility.',
    'Order of handlers critical — auth before business.',
    'Terminal handler or explicit unhandled path required.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Chain of Responsibility purpose?', answerHint: 'Pass request along handler chain until one processes — decouple sender from receivers.' },
    { level: 'intermediate', question: 'Real example in Spring?', answerHint: 'Servlet Filter chain / SecurityFilterChain — each filter processes or calls chain.doFilter.' },
    { level: 'advanced', question: 'Chain vs Decorator?', answerHint: 'CoR one handler may consume; Decorator wraps all layers always augmenting behavior.' },
  ],
  flashcards: [
    { front: 'Handler link', back: 'Each handler references next in chain' },
    { front: 'Short-circuit', back: 'Handler stops chain e.g. auth failure 403' },
    { front: 'passToNext', back: 'Delegate to next handler if cannot process' },
    { front: 'Filter chain', back: 'Servlet/Spring canonical CoR example' },
  ],
  quickRevision: ['Linked handlers', 'Handle or forward', 'Spring filters', 'Order matters', 'Terminal handler'],
}
