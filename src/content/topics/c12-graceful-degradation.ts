import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Graceful degradation maintains core functionality when dependencies fail — serve reduced feature set instead of total outage. Techniques: circuit breaker fallbacks, serve stale cache, disable recommendations, read-only mode, static fallback page, queue requests for later. User sees partial experience with clear messaging.',
  whyExists:
    'Users prefer slow/simple checkout over 500 error page. Non-critical features (reviews, personalization) should not block payment. Degradation policies product-defined — engineering implements fallbacks and feature flags.',
  mentalModel:
    'Rank features by tier. Tier 0 must work or business stops. Tier 2 nice-to-have drops first. Each dependency has fallback story before outage not during panic.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Tier', 'Feature', 'Degraded behavior'],
      rows: [
        ['0', 'Checkout payment', 'No fallback — queue or clear error; fix dependency'],
        ['1', 'Product details', 'Stale cache prices with disclaimer banner'],
        ['2', 'Recommendations', 'Empty section — page still loads'],
        ['2', 'Search suggestions', 'Disable autocomplete'],
        ['3', 'Analytics beacons', 'Drop silently'],
      ],
    },
    {
      type: 'list',
      items: [
        'Feature flags kill non-critical paths quickly',
        'Circuit breaker triggers fallback automatically',
        'Stale-while-revalidate: return old cache + async refresh',
        'Read-only mode during DB migration — block writes show banner',
        'Communicate degradation in UI — trust preservation',
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Search index cluster down — product search returns cached top categories + message "Search limited"; direct product URL by id still works from catalog DB. Checkout unaffected.',
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Fallback must not call failing dependency again',
        'Timeout before fallback — do not wait 30s',
        'Load test degraded mode — still meets SLO',
        'Synthetic monitoring separate paths tier 0 vs 2',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Better UX during partial outages', 'Revenue on core paths', 'Reduced pressure on recovering dependency'],
    disadvantages: ['Product complexity defining tiers', 'Stale data risk if fallback abused', 'More code paths to maintain'],
    alternatives: ['Hard fail everything — simpler code worse UX', 'Maintenance page entire site — overkill'],
    whenToUse: ['Multi-dependency user-facing services'],
    whenNotToUse: ['Safety-critical systems requiring full correctness or stop'],
  },
  failureModes: [
    'Fallback still hits broken service',
    'Stale price fallback causes legal issues',
    'Silent degradation without user notice',
    'Tier 0 mistakenly depends on tier 2 service synchronously',
  ],
  production: {
    reliability: ['Pre-defined fallbacks per dependency', 'Feature flags tested in staging degrade drills'],
    observability: ['degraded_mode_active metric', 'Track fallback invocation rate'],
    maintainability: ['Degradation matrix doc per service'],
  },
  interview: {
    expectations: ['Tiered features', 'Fallback examples', 'Circuit breaker tie-in', 'Stale cache trade-off'],
    commonQuestions: ['Design graceful degradation e-commerce?', 'Recommendations down?', 'vs circuit breaker?'],
    followUps: ['Feature flags role?', 'Stale price acceptable?'],
    misconceptions: ['Degradation means ignore errors silently', 'All features equal priority'],
    traps: ['No tier 0 isolation from optional services'],
    strongSignals: ['Feature tiers, meaningful fallbacks, user messaging, metrics on degraded mode'],
  },
  keyTakeaways: [
    'Prioritize features — drop non-critical first.',
    'Fallbacks must not call failing dependency.',
    'Use circuit breakers + cache stale data where acceptable.',
    'Feature flags enable fast kill switches.',
    'Tell users when experience is limited.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Graceful degradation?', answerHint: 'Reduced functionality instead of full failure when dependencies down.' },
    { level: 'intermediate', question: 'Recommendations service down on product page?', answerHint: 'Hide section; load core product from catalog; breaker open; optional cached generic picks.' },
    { level: 'advanced', question: 'Stale cache fallback for prices?', answerHint: 'Only if business accepts + banner + short TTL cap; never stale on final checkout confirm — re-fetch authoritative price.' },
  ],
  flashcards: [
    { front: 'Graceful degradation', back: 'Partial service when dependencies fail' },
    { front: 'Feature tier', back: 'Priority ranking — drop low tiers first' },
    { front: 'Stale fallback', back: 'Serve cached data with disclaimer — not for final price without verify' },
    { front: 'Feature flag', back: 'Quick disable non-critical features in outage' },
  ],
  quickRevision: ['Tier features', 'Fallback no call broken', 'Flags kill switch', 'User messaging', 'Checkout tier 0'],
}
