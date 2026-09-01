import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Frontend system design practice: Gmail-like mail client: thread list virtualization, label filters, compose modal, offline draft sync, search with debounce.',
  whyExists: 'Interviewers ask product-shaped frontend design — not just components but data flow, performance, realtime, and state for recognizable apps.',
  mentalModel: 'Clarify users and flows → component tree → data sources → caching/realtime → performance hotspots → a11y and error states.',
  howItWorks: [
    { type: 'list', ordered: true, items: [
      'Clarify functional scope (MVP vs full)',
      'Sketch component hierarchy and routes',
      'Define API/events and client cache strategy',
      'Identify virtualization and code-split points',
      'Plan loading/error/empty states',
      'Discuss metrics and rollout',
    ] },
  ],
  example: [
    { type: 'code', language: 'text', caption: 'Interview outline', code: 'Requirements → UI architecture → State/API → Performance → Edge cases' },
  ],
  keyTakeaways: [
    'Start requirements not pixels',
    'Call out virtualization early for lists',
    'Separate server cache from UI state',
    'Realtime needs reconnect strategy',
    'Name Core Web Vitals risks',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'MVP features for gmail?', answerHint: 'Pick 3 core flows; defer settings/admin.' },
    { level: 'intermediate', question: 'How handle offline or stale data?', answerHint: 'Optimistic UI + queue; stale indicators; SWR.' },
    { level: 'advanced', question: 'Performance plan for large lists?', answerHint: 'Windowing, memoization, stable keys, prefetch.' },
  ],
  flashcards: [
    { front: 'b6-practice-gmail', back: 'Gmail-like mail client: thread list virtualization' },
    { front: 'Interview order', back: 'Reqs → arch → data → perf → a11y' },
    { front: 'List perf', back: 'Virtualize + cursor pagination' },
  ],
  quickRevision: [
    'Scope MVP',
    'Component tree',
    'API/cache layer',
    'Virtualize lists',
    'Realtime reconnect',
    'Loading/error UX',
  ],
  tradeoffs: {
    advantages: [
    'Demonstrates holistic FE SD',
    ],
    disadvantages: [
    'Easy to over-scope timebox',
    ],
    alternatives: [
    'Whiteboard only no code',
    ],
    whenToUse: [
    'Frontend senior interviews',
    ],
    whenNotToUse: [
    'Pure algorithm rounds',
    ],
  },
  failureModes: [
    'Jump to CSS before data model',
    'Ignore mobile',
    'No error/loading states',
  ],
  production: {
    performance: [
      'Profile list scroll INP',
    ],
    observability: [
      'Track client errors by route',
    ],
  },
  interview: {
    expectations: [
      'Structured answer',
      'Perf for lists/maps',
    ],
    commonQuestions: [
      'Design gmail frontend',
    ],
    followUps: [
      'Scale 10× traffic?',
    ],
    misconceptions: [
      'Only visual design',
    ],
    traps: [
      'Fetch entire feed at once',
    ],
    strongSignals: [
      'Virtualization, cache policy, structured sections',
    ],
  },
  systemDesign: {
    problem: 'Design a responsive Gmail frontend that lets a user browse and search mail threads, read and label messages, compose drafts, and remain useful during unreliable connectivity.',
    requirements: {
      functional: ['Render inbox, labels, thread detail, search, and compose.', 'Apply archive, read, star, and label mutations optimistically.', 'Synchronize new mail, draft status, and thread changes in realtime.', 'Support keyboard-first navigation and screen readers.'],
      nonFunctional: ['Keep interactions responsive with 100k-thread mailboxes.', 'Protect mail content in memory and at rest on the device.', 'Meet LCP, INP, and CLS budgets on a slow mobile connection.', 'Recover from reconnects without duplicate or missing thread updates.'],
    },
    scaleAssumptions: ['100k threads per heavy mailbox; 50 visible rows.', 'A user can have several tabs and offline edits.', 'Inbox updates arrive in bursts after reconnect.'],
    capacityEstimates: ['Fetch 50 thread summaries per cursor page, not message bodies.', 'Virtualize rows with a small overscan window.', 'Bound the local thread cache by recency and pinned labels.'],
    api: [{ type: 'table', headers: ['Endpoint/event', 'Client use'], rows: [['GET /threads?label=&cursor=', 'Cursor-paginated summaries'], ['GET /threads/:id', 'Thread body on selection'], ['PATCH /threads/:id', 'Optimistic read/label/archive mutation'], ['WS mail.changed', 'Invalidate or patch affected entities']] }],
    dataModel: [{ type: 'paragraph', text: 'Normalize Thread, Message, Label, Draft, and User entities. Keep selected thread, compose state, focus target, and filter controls in local UI state; server entities belong in the query cache.' }],
    highLevelArchitecture: [{ type: 'list', items: ['Route shell loads label navigation and thread-list feature chunk.', 'Query cache stores normalized summaries and detail records.', 'An outbox persists offline mutations; a websocket coordinator reconciles events.', 'A worker indexes recently cached mail metadata for local suggestions.'] }],
    diagram: { mermaid: 'flowchart LR\nUI[React route] --> Cache[Query cache]\nUI --> Outbox[IndexedDB outbox]\nCache --> API[Mail API]\nWS[WebSocket] --> Cache', caption: 'Client data paths for mailbox reads and changes.' },
    dataFlow: ['Load a label page from cache, then revalidate by cursor.', 'Open a thread lazily and prefetch the next likely thread.', 'Apply a mutation locally with an idempotency key, enqueue it offline, then reconcile the server response or websocket version.'],
    storage: ['Persist encrypted-at-rest drafts, outbox entries, and a bounded summary cache in IndexedDB.', 'Do not persist message bodies by default on shared devices.', 'Store only non-sensitive UI preferences in local storage.'],
    caching: ['Use stale-while-revalidate for summaries and a shorter TTL for unread counts.', 'Cache thread detail by version and invalidate it after a mutation event.', 'Prefetch hover or keyboard-neighbor threads without fetching every row.'],
    asyncProcessing: ['Batch local-search indexing in a worker.', 'Flush outbox mutations in order per thread with retries and idempotency keys.', 'Defer attachment previews and rich compose editor until requested.'],
    scaling: ['Virtualize the list and retain scroll anchors when pages append.', 'Code-split compose, settings, rich text, and attachment viewers.', 'Use event coalescing to avoid rendering one update per incoming notification.'],
    consistency: ['Show pending state for optimistic actions and resolve by server revision.', 'Treat server ordering and unread count as authoritative after reconnect.', 'Surface a conflict banner if a draft version cannot merge.'],
    reliability: ['Reconnect with exponential backoff and resume token.', 'Keep cached inbox readable with explicit stale/offline status.', 'Offer retry and undo for reversible mutations.'],
    failureScenarios: ['Expired session: preserve draft locally and direct the user to reauthenticate.', 'Websocket gap: refetch affected label cursors from a sync token.', 'Outbox rejection: revert or mark the action failed with a retry affordance.'],
    security: ['Use HttpOnly session cookies and CSRF protection for writes.', 'Sanitize remote HTML and isolate attachments/previews.', 'Redact subjects, recipients, and message text from analytics and error reports.'],
    observability: ['Measure inbox LCP, row-scroll INP, cache hit rate, and websocket reconnects.', 'Log mutation outcome and sync lag with anonymized identifiers.', 'Alert on client error rate by route and browser version.'],
    bottlenecks: ['Rendering variable-height thread rows.', 'Burst reconciliation after offline reconnect.', 'Rich editor and attachment bundle weight.'],
    alternatives: ['Offset pagination is simpler but breaks with mailbox churn.', 'Polling avoids socket infrastructure but delays unread updates.', 'A full offline mirror improves availability but raises privacy and storage costs.'],
    tradeoffs: ['Cursor pagination plus virtualization preserves scroll performance but complicates jump-to-position.', 'Optimistic actions feel immediate but require rollback UX.', 'Local draft persistence improves resilience but must be carefully protected.'],
    interviewFollowUps: ['How would you support offline attachment upload?', 'How would you make search typeahead fast without exposing mail content?', 'How do you preserve keyboard focus when a row disappears?'],
    evolution: [{ stage: 'MVP', description: 'Inbox, thread view, compose, cursor pagination, and accessible keyboard navigation.' }, { stage: 'Growth', description: 'Add IndexedDB cache, websocket updates, and offline outbox.', bottleneck: 'Reconnect bursts and duplicate events.' }, { stage: 'Mature', description: 'Add worker search, predictive prefetch, and multi-tab coordination.', bottleneck: 'Client memory and privacy controls.' }],
  },
}
