import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Frontend system design practice: YouTube-like video UI: watch page layout, related sidebar, adaptive player shell, comment thread pagination.',
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
    { level: 'basic', question: 'MVP features for youtube?', answerHint: 'Pick 3 core flows; defer settings/admin.' },
    { level: 'intermediate', question: 'How handle offline or stale data?', answerHint: 'Optimistic UI + queue; stale indicators; SWR.' },
    { level: 'advanced', question: 'Performance plan for large lists?', answerHint: 'Windowing, memoization, stable keys, prefetch.' },
  ],
  flashcards: [
    { front: 'b6-practice-youtube', back: 'YouTube-like video UI: watch page layout' },
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
      'Design youtube frontend',
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
    problem: 'Design a YouTube-like frontend that loads a watch page quickly, adapts video playback to network conditions, supports discovery and comments, and works with keyboard and assistive technology.',
    requirements: {
      functional: ['Browse recommendations and search results, open watch pages, and control playback.', 'Select adaptive streams, captions, quality, and playback position.', 'Load related videos and cursor-paginated comments.', 'Support likes, subscriptions, watch history, and accessible player controls.'],
      nonFunctional: ['Start playback quickly without blocking page interaction.', 'Avoid loading player and comment code for browse-only routes.', 'Keep layout stable around thumbnails and player.', 'Handle network changes and playback errors gracefully.'],
    },
    scaleAssumptions: ['Home shelves can contain hundreds of videos.', 'Watch pages receive media, metadata, recommendations, and comments independently.', 'Adaptive playback emits frequent progress but only occasional server writes.'],
    capacityEstimates: ['Render one primary video and virtualize long result/comment lists.', 'Send playback progress at bounded intervals and on lifecycle events.', 'Use responsive thumbnails and reserve all media dimensions.'],
    api: [{ type: 'table', headers: ['Endpoint/event', 'Client use'], rows: [['GET /videos/:id', 'Metadata, permissions, stream manifest URL'], ['GET /videos/:id/related?cursor=', 'Related video pages'], ['GET /videos/:id/comments?cursor=', 'Comment pages'], ['POST /history/progress', 'Throttled resume position']] }],
    dataModel: [{ type: 'paragraph', text: 'Normalize Video, Channel, Playlist, Comment, and PlaybackProgress entities. Keep player instance, local volume, quality preference, fullscreen state, and keyboard focus local to the watch feature.' }],
    highLevelArchitecture: [{ type: 'list', items: ['Browse routes render lightweight thumbnail grids with route-level code splitting.', 'Watch route fetches metadata first, then lazy-initializes the player and manifest adapter.', 'Query cache independently stores related, comments, and metadata.', 'Playback reporter batches progress and uses page visibility events for final flush.'] }],
    diagram: { mermaid: 'flowchart LR\nBrowse[Browse routes] --> API[Metadata APIs]\nWatch[Watch route] --> Player[Adaptive player]\nPlayer --> CDN[Media CDN/manifest]\nWatch --> Cache[Query cache]\nCache --> API\nPlayer --> Progress[Throttled progress reporter]', caption: 'Playback delivery is independent from watch-page metadata and discussion.' },
    dataFlow: ['Render metadata and reserved player frame, then request a signed manifest.', 'Player adapts bitrate from network measurements while controls remain responsive.', 'Fetch related and comments independently; report progress periodically and at pause/unload.'],
    storage: ['Persist quality/caption preferences, watch progress, and bounded watch-history cache.', 'Do not persist signed stream URLs beyond their expiry.', 'Cache static player assets through the service worker.'],
    caching: ['Cache versioned thumbnails aggressively via CDN.', 'Use stale-while-revalidate for metadata and related lists.', 'Cache comments by cursor and invalidate a single comment thread after posting.'],
    asyncProcessing: ['Lazy-load player, transcript, casting, and rich comments.', 'Run thumbnail processing only server-side/CDN-side; client decodes offscreen media lazily.', 'Throttle progress writes and analytics to avoid network chatter.'],
    scaling: ['Virtualize comments and long search results.', 'Use adaptive manifests and CDN delivery rather than proxying media through the app API.', 'Split player and creator-tool bundles from browse routes.'],
    consistency: ['Server watch progress wins across devices after a conflict window.', 'Use idempotent progress/session IDs for retries.', 'Keep comment count eventually consistent while inserting a local pending comment.'],
    reliability: ['Retry alternate renditions or provide a clear playback-error action.', 'Resume from saved progress after reload.', 'Degrade to metadata, transcript, and related content when player initialization fails.'],
    failureScenarios: ['Manifest expired: refresh authorization and retry without losing page state.', 'Autoplay blocked: show an explicit play control.', 'Network downgrade: lower rendition and announce buffering without trapping focus.'],
    security: ['Use short-lived signed media URLs and entitlement checks.', 'Sandbox third-party embeds and sanitize comments/descriptions.', 'Avoid logging viewing history, search terms, or stream URLs in client telemetry.'],
    observability: ['Track player start time, rebuffer ratio, playback errors, LCP/CLS, comment scroll INP, and progress-write success.', 'Measure bundle size by route and quality-switch frequency.', 'Record accessibility control failures without content identifiers.'],
    bottlenecks: ['Player startup and manifest negotiation.', 'Media bandwidth and thumbnail decode.', 'DOM growth in comments and recommendation shelves.'],
    alternatives: ['Native video is simpler but may lack DRM/analytics/ABR integrations.', 'SSR improves metadata LCP but does not deliver video bytes.', 'Autoplay improves session starts but harms user control and data usage.'],
    tradeoffs: ['Lazy player loading reduces browse cost but adds watch initialization work.', 'Adaptive bitrate limits buffering but can visibly change quality.', 'Virtualized comments preserve memory but complicate deep links and find-in-page.'],
    interviewFollowUps: ['How would you prioritize player startup versus page LCP?', 'How do you report watch history without writing every second?', 'How would captions and keyboard shortcuts be designed accessibly?'],
    evolution: [{ stage: 'MVP', description: 'Browse grid, watch metadata, native playback, and related videos.' }, { stage: 'Playback', description: 'Add adaptive player, progress resume, and captions.', bottleneck: 'Startup latency and error recovery.' }, { stage: 'Scale', description: 'Add virtualized comments, service-worker assets, and personalized shelves.', bottleneck: 'Route bundle weight and client memory.' }],
  },
}
