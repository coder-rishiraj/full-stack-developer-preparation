import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Frontend system design practice: Collaborative editor frontend: OT/CRDT awareness, presence cursors, chunked doc model, conflict-free typing UX.',
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
    { level: 'basic', question: 'MVP features for google docs?', answerHint: 'Pick 3 core flows; defer settings/admin.' },
    { level: 'intermediate', question: 'How handle offline or stale data?', answerHint: 'Optimistic UI + queue; stale indicators; SWR.' },
    { level: 'advanced', question: 'Performance plan for large lists?', answerHint: 'Windowing, memoization, stable keys, prefetch.' },
  ],
  flashcards: [
    { front: 'b6-practice-google-docs', back: 'Collaborative editor frontend: OT/CRDT awareness' },
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
      'Design google docs frontend',
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
    problem: 'Design a Google Docs-like frontend where collaborators edit a large document concurrently, see presence, recover offline work, and receive an accessible editing experience.',
    requirements: {
      functional: ['Load, edit, format, and save documents.', 'Show remote cursors, collaborators, comments, and connection status.', 'Apply local edits immediately and merge concurrent operations.', 'Support keyboard shortcuts, IME composition, and screen-reader editing.'],
      nonFunctional: ['Typing must remain responsive under high operation volume.', 'Avoid losing local work during disconnects or tab crashes.', 'Load long documents without unbounded DOM growth.', 'Meet CWV budgets outside the editor feature.'],
    },
    scaleAssumptions: ['Up to 100 concurrent editors in a document.', 'Documents can contain thousands of blocks.', 'Operations may arrive faster than React can safely rerender.'],
    capacityEstimates: ['Render only visible document blocks plus an editing buffer.', 'Batch remote operations once per animation frame.', 'Persist a compact operation outbox rather than document snapshots per keystroke.'],
    api: [{ type: 'table', headers: ['Endpoint/event', 'Client use'], rows: [['GET /documents/:id', 'Initial snapshot and revision'], ['WS doc.operations', 'Ordered CRDT/OT operations and presence'], ['POST /documents/:id/operations', 'Durable local operation batch'], ['GET /documents/:id/comments', 'Paginated comments']] }],
    dataModel: [{ type: 'paragraph', text: 'Keep a document CRDT/OT model outside React. React derives visible blocks, toolbar state, comments, and presence. Store operations with actor ID, sequence, base revision, and idempotency key.' }],
    highLevelArchitecture: [{ type: 'list', items: ['Editor engine owns selection, composition, and operation transforms.', 'React shell renders toolbar, virtualized block viewport, side panels, and connection UI.', 'Sync coordinator batches operations over a websocket and persists the outbox.', 'Worker handles serialization, snapshot compaction, and expensive document indexing.'] }],
    diagram: { mermaid: 'flowchart LR\nEditor[Editor engine] --> Sync[Sync coordinator]\nSync --> WS[Collaboration service]\nWS --> Sync\nEditor --> View[Virtualized React viewport]\nSync --> DB[IndexedDB outbox]', caption: 'Local editing stays responsive while synchronization runs separately.' },
    dataFlow: ['Apply a keystroke to the local engine synchronously.', 'Append and persist its operation, then send a batch.', 'Transform or merge remote operations, update presence, and rerender only impacted visible blocks.'],
    storage: ['Persist operation outbox and recent document snapshot in IndexedDB.', 'Use a worker to compact acknowledged operations.', 'Clear sensitive offline data on logout or policy change.'],
    caching: ['Cache document metadata and last snapshot by revision.', 'Do not treat a stale snapshot as the live source while connected.', 'Prefetch adjacent comments only when their anchors enter view.'],
    asyncProcessing: ['Serialize and compact operations in a worker.', 'Throttle presence broadcasts separately from document edits.', 'Lazy-load export, comments, and advanced formatting plugins.'],
    scaling: ['Virtualize block rendering while preserving selection and scroll anchoring.', 'Use external-store subscriptions so a remote operation does not rerender the entire route.', 'Coalesce remote bursts per animation frame.'],
    consistency: ['The editor engine resolves concurrent edits with CRDT/OT semantics.', 'Track acknowledgments per actor sequence.', 'Show unsynced state; never silently discard unacknowledged edits.'],
    reliability: ['Reconnect from last acknowledged sequence and request missing operations.', 'Recover the outbox after reload.', 'Fall back to read-only mode if merge state is unsafe.'],
    failureScenarios: ['Version mismatch: fetch snapshot and replay local operations.', 'Worker failure: keep editing, restart worker, and resync.', 'Network loss: remain editable with an explicit offline badge.'],
    security: ['Authorize document access before opening a socket.', 'Sanitize pasted HTML and isolate extension code.', 'Avoid recording document text, selections, or collaborator names in telemetry.'],
    observability: ['Track input latency, operation queue depth, sync lag, reconnect count, and editor crashes.', 'Measure long-document render time and memory.', 'Sample anonymized operation failure reasons.'],
    bottlenecks: ['IME-safe editing around virtualized blocks.', 'Transforming large remote operation bursts.', 'Memory from long undo histories.'],
    alternatives: ['A simple last-write-wins API is easier but loses concurrent edits.', 'OT requires a central ordering service; CRDT offers offline freedom but grows metadata.', 'Contenteditable is flexible but needs extensive browser edge-case handling.'],
    tradeoffs: ['Virtualization protects memory but complicates selection across unmounted blocks.', 'CRDT improves offline collaboration but increases payload and compaction work.', 'Worker isolation preserves INP but adds synchronization boundaries.'],
    interviewFollowUps: ['How would you implement undo for local versus remote edits?', 'How do you handle IME composition during a remote change?', 'When would you choose OT instead of CRDT?'],
    evolution: [{ stage: 'MVP', description: 'Single-user editor with debounced snapshot saves.' }, { stage: 'Collaboration', description: 'Add websocket operations, presence, and persistent outbox.', bottleneck: 'Operation ordering and reconnect replay.' }, { stage: 'Scale', description: 'Add worker compaction and virtualized large documents.', bottleneck: 'Selection correctness and memory.' }],
  },
}
