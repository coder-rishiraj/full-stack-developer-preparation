import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Frontend system design practice: Infinite social feed: cursor pagination, optimistic like, image lazy load, skeleton states, pull-to-refresh mobile.',
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
    { level: 'basic', question: 'MVP features for social feed?', answerHint: 'Pick 3 core flows; defer settings/admin.' },
    { level: 'intermediate', question: 'How handle offline or stale data?', answerHint: 'Optimistic UI + queue; stale indicators; SWR.' },
    { level: 'advanced', question: 'Performance plan for large lists?', answerHint: 'Windowing, memoization, stable keys, prefetch.' },
  ],
  flashcards: [
    { front: 'b6-practice-social-feed', back: 'Infinite social feed: cursor pagination' },
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
      'Design social feed frontend',
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
    problem: 'Design a personalized social-feed frontend that scrolls smoothly through media-rich posts, supports optimistic engagement, and remains accessible on mobile and desktop.',
    requirements: {
      functional: ['Render a ranked cursor-paginated feed and post detail.', 'Create posts, like, comment, save, and refresh the feed.', 'Lazy-load images/video and announce new content accessibly.', 'Show realtime count or notification changes without disrupting reading.'],
      nonFunctional: ['Maintain fast LCP and low CLS for media cards.', 'Avoid memory growth during long sessions.', 'Work on slow networks with clear stale and retry states.', 'Respect reduced motion, keyboard navigation, and image alt text.'],
    },
    scaleAssumptions: ['Millions of candidate posts but 20–50 items per page.', 'Long sessions may load hundreds of cards.', 'Media payload dominates JSON payload.'],
    capacityEstimates: ['Virtualize cards after a threshold; retain a small overscan.', 'Request responsive image variants and defer offscreen decoding.', 'Cache a few pages and evict distant ranges.'],
    api: [{ type: 'table', headers: ['Endpoint/event', 'Client use'], rows: [['GET /feed?cursor=', 'Ranked feed pages'], ['GET /posts/:id', 'Deep-linked post detail'], ['POST /posts/:id/likes', 'Optimistic engagement'], ['SSE feed.changed', 'New-item or count notification']] }],
    dataModel: [{ type: 'paragraph', text: 'Normalize Post, Author, Media, CommentPreview, and Engagement entities. Keep feed cursors and server records in the query cache; drafts, mute preferences, and scroll restoration belong to UI state.' }],
    highLevelArchitecture: [{ type: 'list', items: ['Feed route uses a virtualized card list and IntersectionObserver prefetch sentinel.', 'Media component reserves aspect ratio, selects CDN variants, and lazily decodes.', 'Query cache merges cursor pages and an outbox reconciles optimistic actions.', 'Notification stream updates badges rather than inserting cards above a reading user.'] }],
    diagram: { mermaid: 'flowchart LR\nFeed[Virtual feed] --> Cache[Cursor query cache]\nFeed --> Media[CDN media component]\nCache --> API[Feed API]\nActions[Like/comment] --> Outbox[Optimistic outbox]\nEvents[SSE] --> Cache', caption: 'The feed separates ranked data, media delivery, and user actions.' },
    dataFlow: ['Render cached first page, revalidate, then prefetch the next cursor near the sentinel.', 'Reserve media dimensions before image load and decode off the main interaction path.', 'Apply engagement optimistically, reconcile counts/version, and show retry on rejection.'],
    storage: ['Persist bounded feed metadata, drafts, and pending actions in IndexedDB.', 'Rely on HTTP cache/CDN for media rather than duplicating large blobs.', 'Store scroll restoration by route and feed filter.'],
    caching: ['Use cursor pages with a short freshness window.', 'Cache media through immutable versioned URLs.', 'Invalidate one post entity across feed and detail after a mutation.'],
    asyncProcessing: ['Use a worker for expensive client-side media transformations only when needed.', 'Defer video player, comments, and share-sheet code.', 'Batch analytics after idle time without blocking interaction.'],
    scaling: ['Virtualize cards, memoize stable card props, and avoid global feed rerenders.', 'Use responsive images and priority-load only the LCP candidate.', 'Code-split creation, video, and comment experiences.'],
    consistency: ['Treat ranking as a server snapshot; do not reorder a user mid-scroll.', 'Version optimistic engagement operations and reconcile counts softly.', 'Offer a new-posts banner instead of injecting updates.'],
    reliability: ['Show cached content with freshness labels when offline.', 'Retry page loads independently and retain already-read cards.', 'Restore position from stable post anchors, not pixel offsets alone.'],
    failureScenarios: ['Failed media: preserve layout and offer retry/alt text.', 'Invalid cursor: refresh from top with an explanation.', 'Action rejection: roll back only the affected control and retain comment draft.'],
    security: ['Sanitize user-generated rich text and URLs.', 'Use signed media URLs where content is private.', 'Redact post content and viewer identity from telemetry.'],
    observability: ['Track LCP image, CLS, scroll INP, page-fetch latency, media failure rate, and engagement rollback rate.', 'Measure virtual-list rendered count and client memory.', 'Capture route-level errors without post bodies.'],
    bottlenecks: ['Media decode and layout shifts.', 'Long-feed memory retention.', 'Fan-out of a popular post engagement update.'],
    alternatives: ['Pagination controls are more accessible but reduce continuous discovery.', 'No virtualization is simpler for short feeds but fails long sessions.', 'Polling for new posts is simpler than SSE but consumes more network.'],
    tradeoffs: ['Virtualization keeps scrolling fast but makes browser find-in-page harder.', 'Optimistic likes feel instant but require reconciliation.', 'Aggressive media lazy loading saves bytes but risks delayed perceived content.'],
    interviewFollowUps: ['How would you keep a feed stable while ranking changes?', 'How would you make virtualized cards accessible?', 'How do you choose the LCP image priority?'],
    evolution: [{ stage: 'MVP', description: 'Cursor feed, responsive media, detail view, and likes.' }, { stage: 'Engagement', description: 'Add optimistic comments, notifications, and persisted drafts.', bottleneck: 'Cross-view entity invalidation.' }, { stage: 'Scale', description: 'Add virtualization, adaptive media, and richer offline cache.', bottleneck: 'Memory and CWV.' }],
  },
}
