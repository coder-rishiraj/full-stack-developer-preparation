import type { TopicContent } from "@/domain/types";
import { frontendDesignTopic } from "../frontend-design-factory";

export const content: TopicContent = frontendDesignTopic({
  whatIsIt:
    "Infinite scrolling incrementally loads a cursor-ordered collection as a viewport sentinel approaches, while bounding memory and preserving navigation state.",
  whyExists:
    "It suits exploratory feeds but can create duplicate pages, request storms, inaccessible unreachable content, and unstable scroll positions.",
  mentalModel:
    "The cursor is a bookmark in a stable ordered stream; the viewport is a demand signal, not permission to issue unlimited requests.",
  how: [
    "Start by naming the infinite scrolling boundary and its owner; keep visual rendering separate from transport, cache, and cross-route policy.",
    "Model loading, success, empty, blocked, and failure as explicit states instead of inferring them from missing values.",
    "Use cancellation, deduplication, and idempotent client commands so route changes and retries cannot leave a stale screen in control.",
    "Make the URL, accessibility tree, and telemetry part of the feature contract where users or operators depend on them.",
  ],
  callout: {
    variant: "tip",
    title: "Interview framing",
    text: "Draw the browser boundary first. Explain what the client owns for infinite scrolling, what the API guarantees, and how the UI recovers when that guarantee is delayed or broken.",
  },
  example:
    "A feed requests the next cursor at 70% viewport proximity, deduplicates IDs, exposes Load more for keyboard users, and retains only nearby pages.",
  takeaways: [
    "Give infinite scrolling an explicit client-side owner and public contract.",
    "Separate durable server truth from transient interaction state.",
    "Cancel or ignore stale work when route inputs change.",
    "Design loading, empty, permission, offline, and failure states deliberately.",
    "Correlate browser actions with API requests using safe trace context.",
  ],
  revision: [
    "Define the browser boundary.",
    "Name state ownership.",
    "Specify API and UI contracts.",
    "Handle stale and failed work.",
    "Measure route-level user impact.",
    "Evolve behind compatible contracts.",
  ],
  flashcards: [
    [
      "Infinite scrolling: core model",
      "The cursor is a bookmark in a stable ordered stream; the viewport is a demand signal, not permission to issue unlimited requests.",
    ],
    [
      "Recovery rule",
      "Keep an authoritative snapshot, classify the failure, and expose a user action that is safe to retry.",
    ],
    [
      "Client contract",
      "Specify inputs, loading and error states, cache or state ownership, and invalidation or reconciliation behavior.",
    ],
  ],
  questions: [
    {
      level: "basic",
      question: "What client problem does infinite scrolling solve?",
      answerHint:
        "It suits exploratory feeds but can create duplicate pages, request storms, inaccessible unreachable content, and unstable scroll positions.",
    },
    {
      level: "intermediate",
      question:
        "How would you keep infinite scrolling correct during navigation and retries?",
      answerHint:
        "Use cancellation or request identity, explicit state transitions, and idempotent or deduplicated updates.",
    },
    {
      level: "advanced",
      question:
        "How would you evolve infinite scrolling for several frontend teams?",
      answerHint:
        "Version public contracts, establish observability and budgets, and migrate one route or capability at a time.",
    },
  ],
  advantages: [
    "Makes ownership and failure behavior visible during feature work.",
    "Allows route-level performance and reliability budgets.",
    "Supports incremental migration behind stable contracts.",
  ],
  disadvantages: [
    "Adds abstractions and vocabulary before a small prototype needs them.",
    "Requires contract discipline across frontend and API teams.",
    "A shared platform can become a bottleneck if it owns feature decisions.",
  ],
  alternatives: [
    "Keep a feature-local implementation for a short-lived, isolated workflow.",
    "Use framework conventions when they already provide the required boundary.",
  ],
  whenToUse: [
    "The SPA has multiple routes, data dependencies, or contributors.",
    "Users need recoverable behavior under slow, stale, or partial network conditions.",
  ],
  whenNotToUse: [
    "A static campaign page with no durable client interaction.",
    "A one-screen prototype where the abstraction would hide rather than clarify the flow.",
  ],
  failureModes: [
    "A stale request commits after a newer route input and overwrites the screen.",
    "A dependency failure is reported as a generic message with no safe next action.",
    "Client and server contracts drift without runtime validation or release correlation.",
  ],
  production: {
    performance: [
      "Set route-specific payload and interaction budgets; inspect long tasks and request waterfalls.",
    ],
    scalability: [
      "Bound in-memory collections and isolate feature bundles so growth in one area does not load every route.",
    ],
    reliability: [
      "Use request identity, cancellation, bounded retries, and a deterministic recovery path.",
    ],
    security: [
      "Keep credentials out of logs and URLs; enforce authorization on the server even when the UI hides controls.",
    ],
    observability: [
      "Record release, route, operation outcome, latency, and a sanitized correlation ID.",
    ],
    maintainability: [
      "Document the public client contract and restrict imports across feature boundaries.",
    ],
    cost: [
      "Sample high-volume telemetry and avoid background refetches with no user value.",
    ],
  },
  interview: {
    expectations: [
      "Start with a concrete user journey and distinguish client responsibilities from API responsibilities.",
      "Quantify browser constraints: bytes, devices, memory, concurrency, or interaction latency.",
      "Describe a degraded mode, not only the happy path.",
    ],
    commonQuestions: [
      "Design infinite scrolling for a large SPA.",
      "How do you avoid stale client state after a mutation?",
      "How do you debug a user-reported failure that does not reproduce locally?",
    ],
    followUps: [
      "What changes for offline or flaky mobile networks?",
      "How do you migrate existing routes without a flag day?",
    ],
    misconceptions: [
      "The frontend is only a rendering layer; it also schedules work, owns interaction state, and determines perceived reliability.",
    ],
    traps: [
      "Treating retries as universally safe.",
      "Putting secrets or authorization decisions exclusively in browser state.",
    ],
    strongSignals: [
      "Names state ownership and consistency boundaries.",
      "Connects API contracts to concrete loading, recovery, and telemetry behavior.",
    ],
  },
  design: {
    problem:
      "Design the client architecture for infinite scrolling in a multi-route SPA while keeping the browser responsive, secure, and diagnosable.",
    functional: [
      "Render and update infinite scrolling states for the active route.",
      "Fetch or submit data through a typed domain adapter.",
      "Expose accessible loading, empty, error, and recovery UI.",
    ],
    nonFunctional: [
      "Keep the initial route usable on mid-tier mobile hardware.",
      "Do not show stale or unauthorized data after an identity or route change.",
      "Attach privacy-safe diagnostic context to important failures.",
    ],
    scale: [
      "500,000 daily active users; 80% mobile web.",
      "Peak 20,000 concurrent browser sessions after a campaign.",
      "The client must tolerate 3G latency, tab suspension, and deploy skew.",
    ],
    capacity: [
      "Initial route budget: under 200 KB compressed application JavaScript before feature chunks.",
      "Target p75 interaction response under 100 ms for local work; show progress for network work over 200 ms.",
      "Cap retained client collection data to the visible route plus a small adjacent window.",
    ],
    api: [
      "cursor pages: GET /feed?cursor=...&limit=30.",
      "Responses include schema version, request or trace ID, and typed problem details for recoverable errors.",
      "Commands accept an idempotency key when a user retry could create a duplicate side effect.",
    ],
    dataModel: [
      "page cursors, entity IDs, and scroll anchor",
      "Store entity identity separately from ordered views so an update does not require copying records into every screen.",
      "Track request generation or version to reject late responses.",
    ],
    architecture: [
      "Application shell initializes identity, route parsing, error reporting, and feature loading.",
      "Feature boundary owns screen orchestration and exposes a narrow public entry point.",
      "Typed adapter owns transport, validation, authorization context, and error normalization.",
      "Query cache owns remote data; local reducers own ephemeral interaction state.",
    ],
    flow: [
      "Parse and validate route state before requesting data.",
      "Render a skeleton or previous valid content while the current request is pending.",
      "Validate and normalize the response, then commit only if its request generation is current.",
      "After a mutation, update or invalidate the affected query and announce the outcome to the user.",
    ],
    storage: [
      "Use memory for active feature state and a bounded query cache.",
      "Persist only user-approved, non-sensitive preferences; treat it as a cache that can be discarded.",
      "Never use browser storage as the authorization authority.",
    ],
    caching: [
      "Key entries by identity, route filters, locale, and authorization scope where applicable.",
      "Use stale-while-revalidate only where a stale display is safe and label it when material.",
      "Invalidate by entity or query family after successful commands; prevent stale writes with versions.",
    ],
    async: [
      "Schedule noncritical prefetching with idle time and network-quality guards.",
      "Cancel requests on route disposal where transport supports it; otherwise ignore responses by generation.",
      "Queue only explicitly supported offline actions and surface their pending status.",
    ],
    scaling: [
      "Code-split by route and feature ownership.",
      "Virtualize large visual collections and release off-screen pages.",
      "Use CDN-cached static assets and keep API calls demand-driven.",
    ],
    consistency: [
      "Use server response versions or ETags for conflicting writes.",
      "The browser may be eventually consistent; show pending or stale indicators instead of implying immediate global confirmation.",
      "Re-fetch the authoritative snapshot after ambiguous command outcomes.",
    ],
    reliability: [
      "Bound retries with jitter and retry only idempotent or explicitly keyed commands.",
      "Place error boundaries around routes and high-risk widgets so one crash does not blank the shell.",
      "Provide a manual retry and a safe fallback path for every critical dependency.",
    ],
    failure: [
      "Slow network: retain prior valid data, show pending state, and allow cancellation where useful.",
      "401 or expired session: clear scoped cache, refresh or redirect once, then return to a sanitized route.",
      "Schema or deploy mismatch: stop rendering unsafe data, report release and request IDs, and show a contained fallback.",
    ],
    security: [
      "Use secure, HttpOnly cookie sessions when possible; avoid long-lived bearer tokens in local storage.",
      "Validate redirect targets, escape rendered content, and enforce CSP.",
      "Do not emit personal data, access tokens, or raw form values in telemetry.",
    ],
    observability: [
      "Collect Web Vitals and route transition timings by release and device class.",
      "Emit normalized error type, feature, request ID, and recovery action.",
      "Propagate W3C trace context to APIs and sample sessions with consent.",
    ],
    bottlenecks: [
      "Main-thread rendering and JavaScript parsing on low-end devices.",
      "Network waterfalls caused by nested feature fetches.",
      "Unbounded caches or collections growing with a long-lived tab.",
    ],
    alternatives: [
      "Server-render more of the route when first content is the limiting metric.",
      "Use a modular monolith before introducing runtime-isolated frontends.",
      "Use polling instead of a persistent stream when update frequency is low.",
    ],
    tradeoffs: [
      "A rich client cache improves perceived speed but introduces invalidation and authorization-scope risk.",
      "Feature isolation improves deploy safety but can duplicate utilities until platform APIs mature.",
      "More telemetry shortens diagnosis time but needs sampling, consent, and strict attribute controls.",
    ],
    followUps: [
      "Which state must survive refresh and which must never persist?",
      "What user-visible metric proves the design improved?",
      "How would a partial deploy between client and API fail safely?",
    ],
    evolution: [
      {
        stage: "Single route",
        description:
          "Keep state local and use one typed adapter; establish error and telemetry conventions.",
      },
      {
        stage: "Multiple features",
        description:
          "Introduce route-level code splitting, shared query policy, and public feature boundaries.",
        bottleneck: "Cross-feature imports and duplicated cache behavior.",
      },
      {
        stage: "Multi-team SPA",
        description:
          "Version contracts, enforce dependency rules, and evolve platform capabilities through compatibility windows.",
        bottleneck: "Release coordination and shared runtime governance.",
      },
    ],
  },
});
