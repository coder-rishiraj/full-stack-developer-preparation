import type { TopicContent } from '@/domain/types'

type ReliabilityTopicInput = {
  title: string
  sectionTitle: string
  parentTitle?: string
}

const SECTION_FOCUS: Record<string, string> = {
  'Reliability Foundations & Failure Modes':
    'partial failure, blast radius, fail-fast vs fail-safe, and classifying critical dependencies',
  'Timeouts & Deadlines':
    'connect/read timeouts, deadline propagation, end-to-end budgets, and preventing hanging calls',
  'Retries & Backoff':
    'retryable errors, amplification control, exponential backoff with jitter, and retry budgets',
  Idempotency:
    'idempotency keys, natural idempotency, DB guards, and effectively-once side effects under retry',
  'Rate Limiting & Throttling':
    'client vs server limits, token/leaky bucket, concurrency limits, load shedding, and fairness',
  'Circuit Breakers':
    'closed/open/half-open states, thresholds, fallbacks, and interaction with retries',
  'Bulkheads & Isolation':
    'thread/connection/queue isolation, noisy-neighbor containment, and cell architectures',
  Backpressure:
    'bounded queues, slow-consumer propagation, reactive signals, and avoiding buffer bloat',
  'Graceful Degradation & Fallbacks':
    'feature shedding, stale-cache fallbacks, safe defaults, and priority under stress',
  'Health Checks & Safe Rollouts':
    'liveness vs readiness, deep probes, graceful drain, and rolling-deploy safety',
  'Eventual Consistency & Compensation':
    'read-your-writes expectations, compensation, reconciliation, and inbox/outbox reliability',
  'Failure Recovery':
    'restart vs heal, poison quarantine, runbooks, data repair, and postmortem loops',
  'SLOs, Error Budgets & Reliability Signals':
    'SLI/SLO/SLA, error budgets, latency percentiles, saturation, and symptom-based alerts',
  'Chaos, Overload & Production Playbooks':
    'chaos drills, overload control, dependency-outage playbooks, and production checklists',
}

export function createReliabilityTopicContent({
  title,
  sectionTitle,
  parentTitle,
}: ReliabilityTopicInput): TopicContent {
  const focus =
    SECTION_FOCUS[sectionTitle] ??
    'failure modes, defensive defaults, and production resilience trade-offs'
  const parent = parentTitle ? ` It is an atomic part of ${parentTitle}.` : ''

  return {
    whatIsIt:
      `${title} is a backend-reliability topic in ${sectionTitle}.${parent} ` +
      'At five years of experience, explain the failure mode, the control, how patterns compose, and what users still see when the control trips.',
    whyExists:
      `${title} exists because networks, dependencies, and overloaded systems fail partially and repeatedly. ` +
      `A strong answer covers ${focus}.`,
    mentalModel:
      'Assume every remote call can hang, fail, or succeed twice. Put a deadline on the call, retry only when safe and budgeted, make side effects idempotent, isolate pools, trip breakers, shed load, and degrade intentionally — then measure with SLOs.',
    howItWorks: [
      {
        type: 'list',
        ordered: true,
        items: [
          `Place ${title} on the request path: client → API → dependency → storage/queue.`,
          'Name the failure mode: hang, timeout, overload, duplicate, dependency outage, or data drift.',
          'State the control and its knobs (timeout, attempts, key, threshold, pool size, SLO).',
          'State how it interacts with neighboring patterns (retry + breaker + idempotency).',
          'State the user-visible outcome and the ops signal you would watch.',
        ],
      },
      {
        type: 'callout',
        variant: 'note',
        title: 'Track boundary',
        text:
          'C12 owns cross-cutting application reliability patterns. C11 owns Kafka delivery/idempotent consumers; ' +
          'C10 owns Redis rate-limit implementations; Track D owns distributed consistency theory; C16 owns deep telemetry tooling.',
      },
    ],
    internals: [
      {
        type: 'list',
        items: [
          'Timeouts bound resource hold time; without them, thread and connection pools exhaust under slow dependencies.',
          'Retries amplify load unless scoped to retryable errors, capped, jittered, and paired with idempotency.',
          'Circuit breakers stop calling a sick dependency so the system can fail fast and recover capacity.',
          'Bulkheads limit how much of the process one dependency or tenant can consume.',
          'SLOs turn reliability into a product decision: burn error budget → slow releases / fix reliability.',
        ],
      },
    ],
    failureModes: [
      `Implementing ${title} as a library checkbox without naming the failure mode or residual risk.`,
      'Retrying non-idempotent POSTs / payments and creating duplicate side effects.',
      'Infinite retries or synchronized retries that DDoS your own dependency.',
      'Health checks that query every dependency and take the whole fleet down during a partial outage.',
      'No load shedding: queues grow forever until latency and memory collapse.',
    ],
    production: {
      reliability: [
        'Compose timeout → bounded retry with jitter → idempotency → breaker/bulkhead → degradation.',
        'Define explicit behavior for dependency outage: fail closed, stale read, or feature off.',
      ],
      performance: [
        'Size pools and concurrency limits from measured latency and arrival rate, not guesses.',
        'Track p95/p99 and saturation; optimize the tail, not only the average.',
      ],
      maintainability: [
        'Centralize resilience policies; avoid one-off retry loops in every service method.',
        'Document idempotency keys, timeout budgets, and fallback contracts per dependency.',
      ],
      observability: [
        'Alert on symptoms (SLO burn, error rate, lag, saturation), not only raw CPU.',
        'Log retry counts, breaker state changes, shed decisions, and idempotency conflicts without leaking secrets.',
      ],
    },
    interview: {
      expectations: [
        `Define ${title} in ${sectionTitle} and the failure it prevents.`,
        'Explain how it composes with timeouts, retries, and idempotency.',
        'Give production knobs and one anti-pattern.',
      ],
      commonQuestions: [
        `How does ${title} improve backend reliability?`,
        'What happens if this control is missing under dependency failure?',
        'How would you choose defaults for a payment or booking API?',
      ],
      followUps: [
        'How do retries interact with circuit breakers?',
        'How do you prove the system degrades safely in a game day?',
      ],
      misconceptions: [
        'More retries always improve reliability.',
        'Circuit breakers replace timeouts and idempotency.',
        'Health = “ping every dependency on every probe”.',
      ],
      traps: [
        'Naming patterns without discussing amplification, duplicates, or user-visible degradation.',
        'Ignoring timeout budgets across multi-hop calls.',
      ],
      strongSignals: [
        'Talks composition of controls and residual risk explicitly.',
        'Ties reliability to SLOs, error budgets, and runbooks — not only libraries.',
      ],
    },
    keyTakeaways: [
      `${title} belongs to ${sectionTitle}.`,
      `Focus: ${focus}.`,
      'Deadline → safe retry → idempotent effect → isolate → degrade → measure.',
    ],
    interviewQuestions: [
      {
        level: 'basic',
        question: `What is ${title}, and which failure mode does it address?`,
        answerHint: `Place it in ${sectionTitle}; name hang, overload, duplicate, or dependency outage.`,
      },
      {
        level: 'intermediate',
        question: `How would you configure ${title} for a latency-sensitive API with flaky dependencies?`,
        answerHint: 'Discuss budgets, knobs, interaction with retries/breakers, and user-visible fallback.',
      },
      {
        level: 'advanced',
        question: `How would you validate ${title} in production and during incidents?`,
        answerHint: `Use ${focus} plus SLO burn, chaos drills, and playbooks.`,
      },
    ],
    flashcards: [
      { front: title, back: `${sectionTitle}: ${focus}.` },
      {
        front: `${title} review loop`,
        back: 'Failure mode → control → composition → residual risk → SLO/signal.',
      },
    ],
    quickRevision: [
      `${title} — ${sectionTitle}`,
      `Focus: ${focus}`,
      'Assume hangs, duplicates, and partial outages',
      'Compose resilience controls; measure with SLOs',
    ],
  }
}
