import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Frontend system design practice: Uber web map UI: driver markers on map tile layer, ride status stepper, geolocation permission UX, surge banner.',
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
    { level: 'basic', question: 'MVP features for uber?', answerHint: 'Pick 3 core flows; defer settings/admin.' },
    { level: 'intermediate', question: 'How handle offline or stale data?', answerHint: 'Optimistic UI + queue; stale indicators; SWR.' },
    { level: 'advanced', question: 'Performance plan for large lists?', answerHint: 'Windowing, memoization, stable keys, prefetch.' },
  ],
  flashcards: [
    { front: 'b6-practice-uber', back: 'Uber web map UI: driver markers on map tile layer' },
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
      'Design uber frontend',
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
    problem: 'Design an Uber rider web frontend that lets a rider set locations, compare ride options, request a trip, and follow the driver live without overwhelming the browser.',
    requirements: {
      functional: ['Collect pickup/dropoff with geolocation permission and address search.', 'Render map, ETA, fare options, ride request state, and driver location.', 'Receive trip and driver updates in realtime.', 'Provide accessible non-map alternatives and clear permission/error flows.'],
      nonFunctional: ['Keep map boot cost out of initial non-map routes.', 'Smoothly update nearby drivers without DOM-marker overload.', 'Protect precise location and maintain usable degraded mode.', 'Meet mobile performance budgets on weak networks.'],
    },
    scaleAssumptions: ['Thousands of nearby driver updates per city region.', 'A rider sees a few hundred markers at most.', 'Trip state changes are infrequent but high importance.'],
    capacityEstimates: ['Cluster or tile-render markers; update at a capped frame rate.', 'Persist only current trip and recent place selections.', 'Use one active trip socket subscription per rider.'],
    api: [{ type: 'table', headers: ['Endpoint/event', 'Client use'], rows: [['GET /places?query=', 'Debounced address suggestions'], ['POST /quotes', 'Ride options and estimates'], ['POST /trips', 'Idempotent trip request'], ['WS trip.updated', 'Driver location and trip state']] }],
    dataModel: [{ type: 'paragraph', text: 'Normalize Place, Quote, Trip, Driver, and Vehicle entities. Local UI state includes map viewport, permission prompt, pickup pin drag, selected product, and focus after state transitions.' }],
    highLevelArchitecture: [{ type: 'list', items: ['Route shell lazy-loads map SDK only for location flows.', 'Map adapter owns imperative map lifecycle outside broad React renders.', 'Trip store subscribes to selected trip and coalesces location updates.', 'Query cache stores place suggestions and quotes with short TTLs.'] }],
    diagram: { mermaid: 'flowchart LR\nSearch[Place search] --> API[Places/quote APIs]\nUI[Ride flow] --> Trip[Trip store]\nSocket[Trip socket] --> Trip\nTrip --> Map[Imperative map adapter]\nTrip --> Status[Accessible status panel]', caption: 'Map rendering and trip state are separated for responsive updates.' },
    dataFlow: ['Debounce place search and cancel stale requests.', 'Fetch quotes after a stable route selection; expire them visibly.', 'Request a trip idempotently, subscribe to its events, and animate/coalesce driver position updates.'],
    storage: ['Persist recent places and current trip recovery token with user consent.', 'Avoid retaining precise coordinates longer than necessary.', 'Use session-scoped storage for map preferences.'],
    caching: ['Cache place details briefly and deduplicate in-flight searches.', 'Cache static map assets and route style resources.', 'Treat quote and driver locations as short-lived data.'],
    asyncProcessing: ['Load map SDK and route visualization after intent.', 'Use worker or map-native clustering for many markers.', 'Throttle geolocation reads and position interpolation.'],
    scaling: ['Use marker clustering or vector layers instead of one DOM node per driver.', 'Subscribe only to active trip and viewport-relevant supply updates.', 'Code-split map, payment, and support modules.'],
    consistency: ['Trip state from the server is authoritative.', 'Ignore out-of-order driver locations using sequence/timestamp.', 'Clearly distinguish an expired quote from a changed final fare.'],
    reliability: ['Recover an in-progress trip after reload.', 'Reconnect and request latest trip snapshot.', 'Provide address/manual pickup fallback when geolocation fails.'],
    failureScenarios: ['Geolocation denied: preserve manual location entry.', 'Map SDK failure: show trip details and status without map.', 'Duplicate request retry: use idempotency key and fetch existing trip.'],
    security: ['Request location only with contextual consent and minimize retention.', 'Use authenticated sockets scoped to the trip.', 'Do not include coordinates or addresses in generic logs and analytics.'],
    observability: ['Measure map load LCP impact, search latency, quote conversion, location-update lag, and trip-state mismatch.', 'Track permission outcomes and map SDK errors.', 'Monitor map render frame time and marker count.'],
    bottlenecks: ['Map SDK bundle and tile loading.', 'High-frequency marker updates.', 'Sensitive location handling across tab recovery.'],
    alternatives: ['Static map images are lighter but cannot support interactive pickup.', 'Polling trip status is simpler but feels delayed.', 'DOM markers are accessible but do not scale to dense supply.'],
    tradeoffs: ['Imperative map adapters isolate churn but add lifecycle complexity.', 'Marker clustering improves FPS but hides individual drivers.', 'Precise location improves ETA but increases privacy obligations.'],
    interviewFollowUps: ['How would you make the map flow screen-reader accessible?', 'How would you prevent stale place-search results?', 'How would you recover a trip after a browser crash?'],
    evolution: [{ stage: 'MVP', description: 'Manual address entry, quotes, trip request, and status panel.' }, { stage: 'Realtime', description: 'Add map adapter and trip websocket.', bottleneck: 'Out-of-order location updates.' }, { stage: 'Scale', description: 'Add clustering, lazy map loading, and multi-tab recovery.', bottleneck: 'Map performance and privacy.' }],
  },
}
