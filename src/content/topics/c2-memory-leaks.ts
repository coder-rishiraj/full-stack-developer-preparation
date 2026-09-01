import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'A Java "memory leak" is unintended strong reference retention keeping objects reachable from GC roots—GC never collects them. Common sources: static collections, listeners not removed, ThreadLocal without remove(), caches without bounds, and classloader pins after redeploy.',
  whyExists:
    'GC only frees unreachable objects. Long-lived services accumulate references if lifecycle boundaries are ignored—heap grows until OutOfMemoryError despite "automatic" memory management.',
  mentalModel:
    'Leak = object you forgot you still hold. Trace from GC root (static field, thread stack, ThreadLocal map) to the bloated Map or cache entry; breaking that reference fixes the leak.',
  howItWorks: [
    {
      type: 'list',
      items: [
        'Static Map/List grows with every request key never removed.',
        'Event listener registered on long-lived bus, never unregistered.',
        'ThreadLocal set in pool thread; thread reused; value survives request end.',
        'HttpSession attributes holding large graphs after logout timeout misconfigured.',
        'Custom ClassLoader held by singleton → all its classes stay in metaspace/heap.',
        'Diagnose: heap dump dominator tree → path to GC root; JFR allocation rate + old gen growth.',
      ],
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'ThreadLocal in thread pools',
      text: 'Always ThreadLocal.remove() in finally block in pooled threads—otherwise next request inherits stale user context and retains objects.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Classic leak patterns and fixes',
      code: `// BAD: unbounded static cache
static Map<String, byte[]> CACHE = new HashMap<>();
void handle(Request r) { CACHE.put(r.id(), loadHuge()); }

// GOOD: bounded Caffeine cache with TTL/max size
Cache<String, byte[]> cache = Caffeine.newBuilder()
    .maximumSize(10_000).expireAfterWrite(Duration.ofMinutes(10)).build();

// ThreadLocal in pool — MUST remove
private static final ThreadLocal<User> CTX = new ThreadLocal<>();
try { CTX.set(user); work(); }
finally { CTX.remove(); }`,
    },
  ],
  tradeoffs: {
    advantages: [
      'Fixing retention is permanent heap relief',
      'Bounded caches trade memory for hit rate predictably',
      'WeakReference/SoftReference for optional caches (use carefully)',
    ],
    disadvantages: [
      'Weak refs not a default fix—may disappear too early',
      'Over-aggressive cache eviction hurts latency',
      'Finding root cause requires heap dump skill',
    ],
    alternatives: ['Off-heap storage with explicit free', 'Process restart cron (mask not fix)', 'Redis external cache with TTL'],
    whenToUse: ['Any long-lived JVM service', 'After OOM or monotonic heap growth'],
    whenNotToUse: ['Normal young gen churn— not a leak', 'Metaspace only—classloader issue separate'],
  },
  failureModes: [
    'OutOfMemoryError: Java heap space after hours/days uptime.',
    'GC overhead limit exceeded—GC thrashing little reclaim.',
    'False leak: heap sized too small for legitimate working set.',
    'Fixing symptom by -Xmx only—delays OOM without root cause.',
  ],
  interview: {
    expectations: [
      'Leak = reachable not unreachable',
      'Static map, listener, ThreadLocal examples',
      'Heap dump + dominator tree diagnosis',
    ],
    commonQuestions: ['Can Java leak memory?', 'ThreadLocal leak in pools?', 'How find leak in production?'],
    followUps: ['WeakReference vs strong?', 'Metaspace classloader leak?', 'Cache sizing?'],
    misconceptions: ['GC bugs cause most leaks', 'finalize prevents leaks', 'Nulling local var helps if still in map'],
    traps: ['Suggest System.gc() as fix', 'Confuse native memory leak with heap retention'],
    strongSignals: ['GC root path narrative', 'ThreadLocal.remove in finally', 'Bounded cache with metrics'],
  },
  keyTakeaways: [
    'Java leak = strong reference retention from GC roots.',
    'Static collections, listeners, ThreadLocal top culprits.',
    'ThreadLocal.remove() in pooled threads mandatory.',
    'Heap dump dominator → reference chain to fix.',
    'Bound and expire caches explicitly.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'What makes a Java memory leak?', answerHint: 'Objects stay reachable via unintended references—GC cannot collect despite app thinking they are unused.' },
    { level: 'intermediate', question: 'ThreadLocal leak scenario?', answerHint: 'Pool thread sets ThreadLocal; thread returns to pool with value still in thread map—remove in finally.' },
    { level: 'advanced', question: 'Classloader leak in app server?', answerHint: 'Singleton/cache holds Class or ClassLoader from old deployment—metaspace and heap classes never collected until ref cleared.' },
  ],
  flashcards: [
    { front: 'Java memory leak definition', back: 'Unintended strong references keeping objects reachable' },
    { front: 'ThreadLocal pool fix', back: 'ThreadLocal.remove() in finally block' },
    { front: 'Diagnosis tool', back: 'Heap dump + MAT dominator tree to GC root' },
  ],
  quickRevision: [
    'Reachable ≠ unused',
    'Static maps grow forever',
    'Remove listeners',
    'ThreadLocal.remove',
    'Bounded cache TTL',
    'Heap dump dominator',
    'Not a GC bug',
  ],
  production: {
    observability: [
      'Alert on old gen usage trend after full GC—not just heap percent.',
      'Track allocation rate via JFR; sudden drop with rising heap suggests retention not churn.',
    ],
    reliability: [
      'Cap in-memory caches; externalize session state for stateless horizontal scale.',
      'Load test 24h soak to catch slow leaks before production.',
    ],
    maintainability: [
      'Code review checklist: static mutable collections, listener register/unregister pairs, ThreadLocal lifecycle.',
    ],
    performance: [
      'Right-size heap after fixing leak—oversized -Xmx hides growth and delays detection.',
    ],
  },
}
