import type { TopicContent } from '@/domain/types'

type FsdTopicInput = {
  title: string
  sectionTitle: string
  parentTitle?: string
}

const SECTION_FOCUS: Record<string, string> = {
  'Interview Method':
    'structuring a 45-minute frontend system design round: requirements, architecture, data, contracts, and optimizations',
  'Application Architecture':
    'boundaries, rendering choice, failure surfaces, and how a large SPA or MPA stays changeable',
  'Component & Widget LLD':
    'reusable UI: composition, accessibility, performance, and a public component API',
  'State Architecture':
    'what lives in the URL, the server cache, and the client store — and who owns writes',
  'API Layer':
    'contracts the UI can trust: aggregation, pagination, errors, and idempotent writes',
  'Frontend Authentication':
    'session model, route gates, and what the browser must never treat as authorization',
  'Lists, Search & Pagination':
    'loading large collections without jank, duplicate requests, or lost scroll position',
  'Realtime UI':
    'choosing a transport and handling order, reconnect, and presence without lying to the user',
  'Frontend Performance':
    'Core Web Vitals, main-thread work, and budgets as first-class design constraints',
  'Caching & Offline':
    'freshness vs availability: HTTP, memory, service workers, and conflict UI',
  'Frontend Security Architecture':
    'trust boundaries in HTML, cookies, third-party scripts, and user-generated content',
  Observability:
    'what you measure in production so you can debug client failures you never reproduced locally',
  'A11y, i18n & Design Systems':
    'inclusive, localizable UI that a design system can ship without breaking product teams',
  'HLD Case Studies & Microfrontends':
    'end-to-end product design: feeds, editors, marketplaces, media — and when not to split the app',
}

export function createFsdTopicContent({
  title,
  sectionTitle,
  parentTitle,
}: FsdTopicInput): TopicContent {
  const focus =
    SECTION_FOCUS[sectionTitle] ??
    'frontend architecture you can defend in a system design interview'
  const parentContext = parentTitle ? ` It is a focused part of ${parentTitle}.` : ''

  return {
    whatIsIt:
      `${title} is a frontend system-design topic in ${sectionTitle}.${parentContext} ` +
      `Study it as ${focus}, not as a protocol trivia dump from the networking layer.`,
    whyExists:
      `${title} shows up in mid-to-senior frontend interviews because interviewers want a ` +
      `structured design, trade-offs, and failure modes — not a framework tour. The job is ${focus}.`,
    mentalModel:
      `For ${title}, start with users and constraints, sketch the client architecture, name data ` +
      `ownership, define UI and API contracts, then layer performance, accessibility, and security.`,
    howItWorks: [
      {
        type: 'list',
        ordered: true,
        items: [
          `Scope ${title} with requirements: users, devices, latency, offline, and scale.`,
          'Draw a high-level client picture: routes, data stores, API edges, and realtime if needed.',
          'Call out loading, empty, error, and permission states before pixels.',
          'Name one optimization (virtualization, cache, SSR) and one risk (XSS, stale data, a11y).',
        ],
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Interview standard',
        text:
          `Do not answer ${title} by listing libraries. State the requirement, the architecture, ` +
          'the contract, and what you would measure in production.',
      },
    ],
    internals: [
      {
        type: 'list',
        items: [
          'The browser is a constrained runtime: main thread, memory, and network dominate UX.',
          'HTTP, WebSockets, and storage APIs are tools; the design chooses when each is justified.',
          'Authorization belongs on the server; the UI only reflects it and fails closed.',
        ],
      },
    ],
    failureModes: [
      `Jumping into ${title} implementation details before locking requirements.`,
      'Designing only the happy path — no pagination, auth, or error budget.',
      'Re-teaching CORS or XSS internals instead of how they constrain this product.',
    ],
    interview: {
      expectations: [
        `Define ${title} inside ${sectionTitle}.`,
        'Walk RADIO: requirements → architecture → data → interface → optimizations.',
        'Name a trade-off you would revisit with more time.',
      ],
      commonQuestions: [
        `How would you design ${title}?`,
        'What is on the critical path for first paint versus interaction?',
        'How does this fail at 10× data or with a flaky network?',
      ],
      followUps: [
        'Where does state live, and why not in one global store?',
        'How would you make this accessible with keyboard and a screen reader?',
      ],
      misconceptions: [
        `${title} is solved by picking Redux, GraphQL, or a microfrontend platform.`,
      ],
      traps: ['Spending the round on backend Kafka while the UI contract is undefined.'],
      strongSignals: [
        'Timeboxes and checks in with the interviewer.',
        'Separates widget LLD from product HLD when the question is mixed.',
      ],
    },
    keyTakeaways: [
      `${title} belongs to ${sectionTitle}.`,
      `Reason about ${title} with RADIO, not a library list.`,
      'Call out loading, error, a11y, and cache freshness before polish.',
    ],
    interviewQuestions: [
      {
        level: 'basic',
        question: `What is ${title}, and what problem does it solve on the frontend?`,
        answerHint: `Place it in ${sectionTitle}, then name the user-visible failure it prevents.`,
      },
      {
        level: 'intermediate',
        question: `Walk through a design for ${title} using RADIO.`,
        answerHint: 'Requirements, architecture sketch, data ownership, contracts, then one optimization.',
      },
      {
        level: 'advanced',
        question: `What breaks in ${title} under scale, offline, or hostile content?`,
        answerHint: `Discuss ${focus}, plus measurement you would add in production.`,
      },
    ],
    flashcards: [
      {
        front: title,
        back: `${sectionTitle}: requirements → architecture → data → contracts → optimizations.`,
      },
      {
        front: `${title} interview signal`,
        back: 'Scope first, then client architecture, then failure and a11y — not a stack dump.',
      },
    ],
    quickRevision: [
      `${title} — ${sectionTitle}`,
      `Focus: ${focus}`,
      'RADIO: R → A → D → I → O',
      'Happy path + empty/error + a11y + cache',
    ],
    systemDesign: {
      problem: `Design the frontend for ${title}: what the client owns, which contracts it depends on, and how the UI stays correct under load, latency, and failure.`,
      requirements: {
        functional: [
          `Users can complete the core ${title} flow on the critical path.`,
          'Loading, empty, permission, and error states are explicit in the UI.',
          'Keyboard and screen-reader users can reach the same outcomes as pointer users.',
        ],
        nonFunctional: [
          'Interaction stays responsive on a mid-range device and a flaky network.',
          'The design has a performance budget and a way to observe regressions.',
          'Hostile or unexpected content cannot execute as script in the page.',
        ],
      },
      scaleAssumptions: [
        'Primary surface is a browser SPA or SSR-hydrated app used by authenticated and anonymous users.',
        'List and media payloads can grow 10× without a redesign of the information architecture.',
      ],
      capacityEstimates: [
        'Budget first paint and interaction for the 75th percentile of real users, not a local cable connection.',
        'Assume list windows of hundreds of rows in the viewport, not the full dataset in the DOM.',
      ],
      api: [
        {
          type: 'list',
          items: [
            `Name the reads and writes ${title} needs; keep them versioned and typed at the adapter.`,
            'Prefer domain errors over leaking HTTP status into presentational components.',
            'Cancel or ignore stale responses when the route or query key changes.',
          ],
        },
      ],
      dataModel: [
        {
          type: 'list',
          items: [
            'Separate server truth, URL state, and ephemeral UI state.',
            'Normalize entities that are reused across screens; derive projections for widgets.',
            `For ${title}, write down identity, ordering, and who is allowed to mutate.`,
          ],
        },
      ],
      highLevelArchitecture: [
        {
          type: 'paragraph',
          text: `Route or widget shell → feature boundary → query/cache → transport. ${title} should not mix those layers in one module.`,
        },
      ],
      diagram: {
        mermaid:
          'flowchart LR\n  U[User] --> S[Shell / widget]\n  S --> C[Client cache]\n  C --> A[API adapter]\n  A --> N[Network]\n  N --> A\n  A --> C\n  C --> S',
        caption: 'Client owns rendering, cache policy, and degradation; the network is untrusted latency.',
      },
      dataFlow: [
        'User intent hits the shell, which updates URL or local state.',
        'The cache layer fetches or revalidates; the adapter maps the contract.',
        'The view renders success, empty, or error from explicit states.',
      ],
      storage: [
        'Use memory/query cache for session truth; persist only what must survive reload.',
        'Do not treat localStorage as an authorization store.',
      ],
      caching: [
        'HTTP cache for immutable assets; application cache for user-specific JSON.',
        'Define stale-while-revalidate versus must-revalidate per resource.',
      ],
      asyncProcessing: [
        'Debounce search; backoff reconnects; queue offline writes with conflict UI.',
        'Never let an older response overwrite a newer query key.',
      ],
      scaling: [
        'Window long lists; paginate or cursor at the contract.',
        'Code-split routes; keep the design system and data layer out of every widget bundle if possible.',
      ],
      consistency: [
        'Optimistic updates must roll back on conflict.',
        'Realtime events are hints until reconciled with a snapshot or cursor.',
      ],
      reliability: [
        'Timeouts, retries with jitter, and fallback UI on the critical path.',
        'Error boundaries at route edges, not around every leaf.',
      ],
      failureScenarios: [
        'Partial JSON, 401 mid-session, and duplicate submit.',
        'Lost websocket with a UI that still looks live.',
      ],
      security: [
        'Sanitize or isolate untrusted HTML; cookies and CSRF follow the session model.',
        'UI hiding is not authorization.',
      ],
      observability: [
        'Correlate navigation, API failures, and Core Web Vitals to a route.',
        'Alert on client error rate, not only server 500s.',
      ],
      bottlenecks: [
        'Main-thread work from large trees and synchronous layout.',
        'Waterfalls from sequential queries on the critical path.',
      ],
      alternatives: [
        'Thicker BFF versus chatty REST from the browser.',
        'SSR versus CSR for the first meaningful view of this surface.',
      ],
      tradeoffs: [
        'Freshness versus availability when the network is poor.',
        'Widget reuse versus product-specific performance constraints.',
      ],
      interviewFollowUps: [
        `Where does state for ${title} live, and what happens on back/forward?`,
        'How would you test this without a full backend?',
        'What would you cut if you had 15 minutes left in the round?',
      ],
      evolution: [
        {
          stage: 'MVP',
          description: `Ship the ${title} happy path with explicit loading and error states.`,
        },
        {
          stage: 'Scale',
          description: 'Add pagination/windowing, cache policy, and production telemetry.',
          bottleneck: 'Unbounded lists and unmeasured main-thread work.',
        },
      ],
    },
  }
}
