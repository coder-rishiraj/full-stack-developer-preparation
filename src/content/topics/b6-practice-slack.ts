import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Frontend system design practice: Slack-like chat: channel list, message virtual scroll, websocket reconnect, unread badges, emoji picker lazy load.',
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
    { level: 'basic', question: 'MVP features for slack?', answerHint: 'Pick 3 core flows; defer settings/admin.' },
    { level: 'intermediate', question: 'How handle offline or stale data?', answerHint: 'Optimistic UI + queue; stale indicators; SWR.' },
    { level: 'advanced', question: 'Performance plan for large lists?', answerHint: 'Windowing, memoization, stable keys, prefetch.' },
  ],
  flashcards: [
    { front: 'b6-practice-slack', back: 'Slack-like chat: channel list' },
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
      'Design slack frontend',
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
    problem: 'Design a Slack-like frontend for channel navigation, high-volume threaded chat, realtime unread state, file sharing, and dependable offline behavior.',
    requirements: {
      functional: ['Browse workspaces and channels, read/send messages, reply in threads, and react.', 'Receive message, typing, presence, and unread events in realtime.', 'Support search, mentions, keyboard navigation, and accessible announcements.', 'Queue messages when offline and show delivery state.'],
      nonFunctional: ['Keep scroll and composer input responsive in channels with years of history.', 'Preserve chronological order through reconnects.', 'Avoid loading heavy emoji, media, and search code on first paint.', 'Meet mobile CWV and usable reduced-motion behavior.'],
    },
    scaleAssumptions: ['50k messages in an active channel; 100s of events/minute.', 'Users can be in multiple channels across tabs.', 'A reconnect can deliver a large event gap.'],
    capacityEstimates: ['Fetch 100 messages per cursor page and render ~60.', 'Batch incoming events each animation frame.', 'Bound per-workspace cache by recent channels and threads.'],
    api: [{ type: 'table', headers: ['Endpoint/event', 'Client use'], rows: [['GET /channels', 'Workspace navigation'], ['GET /channels/:id/messages?before=', 'Cursor-history page'], ['POST /messages', 'Optimistic send with client ID'], ['WS message.*', 'Message, reaction, and unread changes']] }],
    dataModel: [{ type: 'paragraph', text: 'Normalize Channel, Message, Thread, User, Reaction, and ReadCursor. Local state owns composer draft, active channel, reply panel, modal stack, and focus restoration.' }],
    highLevelArchitecture: [{ type: 'list', items: ['Route shell contains workspace sidebar and feature-loaded channel pane.', 'Virtual message viewport subscribes to a normalized query cache.', 'Socket manager shares one connection per workspace across tabs when possible.', 'Outbox and drafts live in IndexedDB; media and emoji are lazy features.'] }],
    diagram: { mermaid: 'flowchart LR\nSidebar[Channel sidebar] --> Cache[Normalized cache]\nChat[Virtual chat viewport] --> Cache\nComposer --> Outbox[IndexedDB outbox]\nCache --> API[HTTP API]\nSocket[WebSocket manager] --> Cache', caption: 'Channel state is reconciled through a shared normalized cache.' },
    dataFlow: ['Open a channel from cached summaries and fetch latest messages.', 'Send with a client-generated ID, display pending status, and reconcile server ID.', 'On reconnect, request events since the saved cursor before declaring the channel current.'],
    storage: ['Persist drafts, outbox messages, read cursors, and bounded recent history.', 'Keep file blobs in browser-managed caches only with explicit user intent.', 'Coordinate tab ownership with BroadcastChannel.'],
    caching: ['Use cursor pages keyed by channel and anchor.', 'Keep recent channel messages hot and evict inactive history.', 'Prefetch a thread when its reply count becomes visible.'],
    asyncProcessing: ['Upload files with resumable background tasks where supported.', 'Parse large pasted content and index recent message metadata in a worker.', 'Lazy-load emoji picker and syntax highlighting.'],
    scaling: ['Virtualize messages with stable IDs and preserve bottom anchoring.', 'Coalesce typing/presence events and drop stale ones.', 'Split workspace, search, and media bundles.'],
    consistency: ['Use server sequence/event IDs to order events.', 'Read cursors advance monotonically; server wins after conflict.', 'Deduplicate echoed sends by client ID.'],
    reliability: ['Use exponential reconnect and visible connection state.', 'Retry failed sends without duplicating them.', 'Keep local draft and pending message state across reload.'],
    failureScenarios: ['Socket event gap: backfill from cursor.', 'Failed message: retain editable draft and retry action.', 'Deleted active channel: redirect accessibly and announce the change.'],
    security: ['Enforce workspace authorization on HTTP and socket channels.', 'Sanitize message markdown and isolate link previews.', 'Never send message body or channel names to generic client logs.'],
    observability: ['Measure send-to-ack latency, event-gap frequency, scroll INP, cache hit rate, and reconnect duration.', 'Track failed uploads and renderer errors by feature.', 'Monitor accessibility shortcut and focus failures.'],
    bottlenecks: ['Variable-height virtual messages and images.', 'Thread state reconciliation across channel and sidebar views.', 'Burst event rendering during reconnect.'],
    alternatives: ['Polling is simpler but weak for chat freshness.', 'One socket per tab is easy but wastes connections.', 'Offset pagination is convenient but unstable for incoming messages.'],
    tradeoffs: ['Virtualization improves performance but complicates search result anchors.', 'Optimistic sends reduce perceived latency but need failure UI.', 'Shared tab socket lowers load but adds leader-election complexity.'],
    interviewFollowUps: ['How would you preserve scroll position when loading older messages?', 'How do you fan out one socket across tabs?', 'How would end-to-end encryption change previews and search?'],
    evolution: [{ stage: 'MVP', description: 'Channels, cursor history, composer, and accessible messaging.' }, { stage: 'Realtime', description: 'Add websocket reconciliation, outbox, and unread badges.', bottleneck: 'Event ordering after reconnect.' }, { stage: 'Scale', description: 'Add multi-tab coordination and worker-backed search.', bottleneck: 'Memory and event bursts.' }],
  },
}
