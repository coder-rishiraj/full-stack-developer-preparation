import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Frontend system design practice: Trading dashboard: low-latency tick updates, WebSocket order book, throttled render batching, error states on stale data.',
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
    { level: 'basic', question: 'MVP features for trading?', answerHint: 'Pick 3 core flows; defer settings/admin.' },
    { level: 'intermediate', question: 'How handle offline or stale data?', answerHint: 'Optimistic UI + queue; stale indicators; SWR.' },
    { level: 'advanced', question: 'Performance plan for large lists?', answerHint: 'Windowing, memoization, stable keys, prefetch.' },
  ],
  flashcards: [
    { front: 'b6-practice-trading', back: 'Trading dashboard: low-latency tick updates' },
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
      'Design trading frontend',
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
    problem: 'Design a trading-dashboard frontend that displays prices and order books with low perceived latency while clearly communicating stale data, order state, and risk.',
    requirements: {
      functional: ['Show watchlists, chart, order book, positions, and order ticket.', 'Subscribe to market ticks and account/order updates.', 'Submit, cancel, and amend orders with explicit confirmation state.', 'Support keyboard operation, readable change indicators, and reduced motion.'],
      nonFunctional: ['Prevent render storms from high-frequency ticks.', 'Never imply an order is accepted before server acknowledgment.', 'Maintain usable data-age indicators across network disruption.', 'Keep initial dashboard LCP and order-entry INP fast.'],
    },
    scaleAssumptions: ['Hundreds of symbols subscribed per client.', 'Ticks can arrive tens of times per second per active symbol.', 'Order books have thousands of levels but only a portion is visible.'],
    capacityEstimates: ['Coalesce ticks per symbol per animation frame.', 'Render 50–100 virtualized order-book rows.', 'Keep a bounded ring buffer for chart points at each resolution.'],
    api: [{ type: 'table', headers: ['Endpoint/event', 'Client use'], rows: [['GET /market/snapshot?symbols=', 'Initial prices and depth snapshot'], ['WS market.delta', 'Sequenced price/order-book deltas'], ['POST /orders', 'Order submission with idempotency key'], ['WS account.order', 'Authoritative order and position updates']] }],
    dataModel: [{ type: 'paragraph', text: 'Maintain a mutable market-data store outside React, keyed by symbol and sequence. React subscribes to selected slices. Query cache holds slower account/reference data; ticket fields and modal state remain local.' }],
    highLevelArchitecture: [{ type: 'list', items: ['Socket coordinator receives snapshot plus sequenced deltas.', 'Market store coalesces deltas and exposes useSyncExternalStore subscriptions.', 'Chart and depth widgets are feature chunks, optionally using canvas for dense rendering.', 'Order manager tracks pending requests and reconciles authoritative account events.'] }],
    diagram: { mermaid: 'flowchart LR\nWS[Market/account sockets] --> Store[Market data store]\nStore --> Widgets[Price, chart, order book]\nTicket[Order ticket] --> API[Order API]\nAPI --> Orders[Order state]\nWS --> Orders', caption: 'High-frequency market data bypasses broad React state updates.' },
    dataFlow: ['Fetch a snapshot, record its sequence, then apply only contiguous deltas.', 'Coalesce visual updates per frame while retaining latest values.', 'Submit an order with an idempotency key; display pending until server event confirms accepted, rejected, or filled.'],
    storage: ['Persist watchlists and non-sensitive layout preferences.', 'Do not persist credentials, live account data, or order ticket values on shared devices.', 'Keep chart buffers in memory and discard them on logout.'],
    caching: ['Cache reference metadata and delayed historical candles by symbol/resolution.', 'Do not cache live quotes as fresh after their staleness threshold.', 'Invalidate account snapshots after an order event.'],
    asyncProcessing: ['Aggregate ticks and compute chart transforms in a worker.', 'Lazy-load advanced indicators and depth visualization.', 'Throttle noncritical analytics away from order entry.'],
    scaling: ['Subscribe only to visible/watchlisted symbols.', 'Use canvas or carefully virtualized DOM for dense depth data.', 'Partition stores by market data, account state, and UI layout.'],
    consistency: ['Sequence numbers detect missed deltas; resnapshot on a gap.', 'Server order status is authoritative and may supersede optimistic pending state.', 'Display source timestamp and delayed-data label.'],
    reliability: ['Reconnect with backoff, resubscribe, and resnapshot.', 'Disable risky submission only when required state is unavailable, while preserving the ticket.', 'Make stale and disconnected states visually unambiguous.'],
    failureScenarios: ['Sequence gap: freeze affected book and request snapshot.', 'Order timeout: mark unknown and poll/reconcile rather than resubmit blindly.', 'Clock skew: rely on server timestamps for data-age display.'],
    security: ['Use secure authenticated sockets and strict CSP.', 'Require reauthentication/step-up as dictated by risk policy.', 'Avoid logging positions, orders, balances, or account identifiers.'],
    observability: ['Track tick-to-paint latency, dropped/coalesced updates, sequence gaps, order submit-to-ack latency, and stale-data time.', 'Measure order ticket INP and widget errors.', 'Audit client order intents with privacy-aware correlation IDs.'],
    bottlenecks: ['High-frequency rerenders.', 'Chart calculations and DOM-heavy order books.', 'Ambiguous order state after a network timeout.'],
    alternatives: ['Polling is unacceptable for active prices but fine for slow account summaries.', 'Canvas improves dense charts but reduces native accessibility.', 'Web workers isolate compute but add message-copy overhead.'],
    tradeoffs: ['Frame batching improves responsiveness but can skip intermediate ticks.', 'Canvas scales dense visuals but needs an accessible textual companion.', 'Optimistic ticket feedback is useful, but execution status must remain authoritative.'],
    interviewFollowUps: ['How do you resync an order book after packet loss?', 'How do you design accessible price movement indicators?', 'What should happen if an order request times out?'],
    evolution: [{ stage: 'MVP', description: 'Watchlist, delayed quotes, order ticket, and explicit data age.' }, { stage: 'Realtime', description: 'Add sequenced sockets, coalesced store, and authoritative order events.', bottleneck: 'Render storms and sequence gaps.' }, { stage: 'Advanced', description: 'Add worker charts and dense depth visualization.', bottleneck: 'Accessibility and compute cost.' }],
  },
}
