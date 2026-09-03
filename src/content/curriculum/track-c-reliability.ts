import type { Priority } from '@/domain/types'
import type { SectionSeed, TopicSeed } from './build'

const RELIABILITY = ['reliability'] as const
const M56 = [5, 6]
const M67 = [6, 7]

function item(
  id: string,
  title: string,
  priority: Priority = 'tier1',
  extra: Partial<TopicSeed> = {},
): TopicSeed {
  const { tags, executionPriority, ...rest } = extra
  return {
    id,
    title,
    priority,
    months: extra.months ?? (priority === 'tier1' ? M56 : M67),
    tags: [...RELIABILITY, ...(tags ?? [])],
    executionPriority:
      executionPriority ?? (priority === 'tier1' ? 'p0' : priority === 'tier2' ? 'p1' : 'later'),
    ...rest,
  }
}

function nest(
  parent: string,
  id: string,
  title: string,
  priority: Priority = 'tier1',
  extra: Partial<TopicSeed> = {},
): TopicSeed {
  return item(id, title, priority, {
    ...extra,
    curriculumLevel: 'nested-concept',
    parentTopicId: parent,
  })
}

function section(id: string, title: string, order: number, topics: TopicSeed[]): SectionSeed {
  return {
    id,
    track: 'C',
    title,
    order,
    defaultKind: 'theory',
    defaultDepth: 'deep',
    topics,
  }
}

/**
 * C12.1–C12.14 — backend reliability for experienced engineers.
 * Focus: failure modes, defensive defaults, production trade-offs, and composing
 * resilience patterns (timeouts → retries → idempotency → breakers → bulkheads).
 * Kafka-specific delivery stays in C11; distributed-systems depth in Track D;
 * observability tooling depth in C16. Existing C12 topic IDs remain stable.
 */
export const TRACK_C_RELIABILITY_SECTIONS: SectionSeed[] = [
  section('C12.1', 'Reliability Foundations & Failure Modes', 182, [
    item('c12-reliability-foundations', 'Reliability Foundations'),
    nest('c12-reliability-foundations', 'c12-what-is-reliability', 'Availability, Latency & Correctness'),
    nest('c12-reliability-foundations', 'c12-partial-failure', 'Partial Failure in Distributed Systems'),
    nest('c12-reliability-foundations', 'c12-blast-radius', 'Blast Radius & Failure Domains'),
    nest('c12-reliability-foundations', 'c12-fail-fast-vs-fail-safe', 'Fail-Fast vs Fail-Safe'),
    nest('c12-reliability-foundations', 'c12-defense-in-depth-reliability', 'Defense in Depth for Dependencies'),
    nest('c12-reliability-foundations', 'c12-dependency-criticality', 'Critical vs Non-Critical Dependencies'),
  ]),

  section('C12.2', 'Timeouts & Deadlines', 183, [
    item('c12-timeouts', 'Timeouts'),
    nest('c12-timeouts', 'c12-connect-vs-read-timeout', 'Connect vs Read/Write Timeouts'),
    nest('c12-timeouts', 'c12-deadline-propagation', 'Deadline / Timeout Propagation'),
    nest('c12-timeouts', 'c12-timeout-budget', 'End-to-End Timeout Budgets'),
    nest('c12-timeouts', 'c12-hanging-calls', 'Hanging Calls & Thread/Connection Exhaustion'),
    nest('c12-timeouts', 'c12-timeout-defaults', 'Choosing Timeout Defaults'),
  ]),

  section('C12.3', 'Retries & Backoff', 184, [
    item('c12-retries', 'Retries'),
    nest('c12-retries', 'c12-retryable-errors', 'Retryable vs Non-Retryable Errors'),
    nest('c12-retries', 'c12-retry-amplification', 'Retry Amplification & Cascades'),
    nest('c12-retries', 'c12-retry-budgets', 'Retry Budgets'),
    item('c12-exponential-backoff', 'Exponential Backoff'),
    nest('c12-exponential-backoff', 'c12-jitter', 'Full / Equal / Decorrelated Jitter'),
    nest('c12-exponential-backoff', 'c12-max-attempts', 'Max Attempts & Caps'),
    nest('c12-exponential-backoff', 'c12-retry-after', 'Retry-After & Server Hints', 'tier2'),
  ]),

  section('C12.4', 'Idempotency', 185, [
    item('c12-idempotency', 'Idempotency', 'tier1', {
      related: ['c11-idempotent-consumers', 'd4-idempotency'],
      capstone: 'Critical for payment and booking retries without double charges.',
    }),
    nest('c12-idempotency', 'c12-idempotency-keys', 'Idempotency-Key Headers & Stores'),
    nest('c12-idempotency', 'c12-natural-idempotency', 'Naturally Idempotent Operations'),
    nest('c12-idempotency', 'c12-db-unique-guards', 'DB UNIQUE / Upsert Guards'),
    nest('c12-idempotency', 'c12-exactly-once-effect', 'Effectively-Once Side Effects'),
    nest('c12-idempotency', 'c12-idempotency-ttl', 'Idempotency Record TTL & Replay Windows'),
  ]),

  section('C12.5', 'Rate Limiting & Throttling', 186, [
    item('c12-rate-limiting', 'Rate Limiting', 'tier1', { related: ['d10-rate-limiter', 'c10-rate-limiting'] }),
    nest('c12-rate-limiting', 'c12-client-vs-server-limits', 'Client-Side vs Server-Side Limits'),
    nest('c12-rate-limiting', 'c12-token-bucket-leaky', 'Token Bucket & Leaky Bucket'),
    nest('c12-rate-limiting', 'c12-concurrency-limits', 'Concurrency Limits'),
    nest('c12-rate-limiting', 'c12-load-shedding', 'Load Shedding Under Overload'),
    nest('c12-rate-limiting', 'c12-fairness-tenancy', 'Per-Tenant Fairness', 'tier2'),
  ]),

  section('C12.6', 'Circuit Breakers', 187, [
    item('c12-circuit-breakers', 'Circuit Breakers'),
    nest('c12-circuit-breakers', 'c12-breaker-states', 'Closed, Open & Half-Open'),
    nest('c12-circuit-breakers', 'c12-failure-thresholds', 'Error Rate & Slow-Call Thresholds'),
    nest('c12-circuit-breakers', 'c12-fallback-on-open', 'Fallbacks When Open'),
    nest('c12-circuit-breakers', 'c12-breaker-vs-retry', 'Breakers vs Retries Interaction'),
    nest('c12-circuit-breakers', 'c12-resilience4j', 'Resilience4j / Spring Patterns', 'tier2'),
  ]),

  section('C12.7', 'Bulkheads & Isolation', 188, [
    item('c12-bulkheads', 'Bulkheads'),
    nest('c12-bulkheads', 'c12-thread-pool-isolation', 'Thread-Pool / Semaphore Isolation'),
    nest('c12-bulkheads', 'c12-connection-pool-isolation', 'Connection-Pool Isolation'),
    nest('c12-bulkheads', 'c12-queue-isolation', 'Queue & Consumer Isolation'),
    nest('c12-bulkheads', 'c12-noisy-neighbor', 'Noisy-Neighbor Containment'),
    nest('c12-bulkheads', 'c12-cell-architecture', 'Cell / Shard Isolation', 'tier2'),
  ]),

  section('C12.8', 'Backpressure', 189, [
    item('c12-backpressure', 'Backpressure'),
    nest('c12-backpressure', 'c12-bounded-queues', 'Bounded Queues & Rejection'),
    nest('c12-backpressure', 'c12-slow-consumers', 'Slow Consumer Propagation'),
    nest('c12-backpressure', 'c12-reactive-signals', 'Reactive / Async Backpressure Signals', 'tier2'),
    nest('c12-backpressure', 'c12-buffer-bloat', 'Unbounded Buffer Bloat'),
  ]),

  section('C12.9', 'Graceful Degradation & Fallbacks', 190, [
    item('c12-graceful-degradation', 'Graceful Degradation'),
    nest('c12-graceful-degradation', 'c12-feature-degradation', 'Disable Non-Critical Features'),
    nest('c12-graceful-degradation', 'c12-stale-cache-fallback', 'Stale Cache / Last-Known-Good'),
    nest('c12-graceful-degradation', 'c12-default-responses', 'Safe Default Responses'),
    nest('c12-graceful-degradation', 'c12-priority-lanes', 'Priority Lanes Under Stress', 'tier2'),
    nest('c12-graceful-degradation', 'c12-ux-degradation', 'Honest UX During Degradation'),
  ]),

  section('C12.10', 'Health Checks & Safe Rollouts', 191, [
    item('c12-health-checks', 'Health Checks'),
    nest('c12-health-checks', 'c12-liveness-vs-readiness', 'Liveness vs Readiness'),
    nest('c12-health-checks', 'c12-dependency-probes', 'Dependency Probes & Deep Checks'),
    nest('c12-health-checks', 'c12-health-check-anti-patterns', 'Health-Check Anti-Patterns'),
    nest('c12-health-checks', 'c12-graceful-shutdown', 'Graceful Shutdown & Drain'),
    nest('c12-health-checks', 'c12-rolling-deploy-safety', 'Rolling Deploy Safety', 'tier2'),
  ]),

  section('C12.11', 'Eventual Consistency & Compensation', 192, [
    item('c12-eventual-consistency', 'Eventual Consistency', 'tier1', {
      related: ['d4-eventual-consistency'],
    }),
    nest('c12-eventual-consistency', 'c12-read-your-writes', 'Read-Your-Writes Expectations'),
    nest('c12-eventual-consistency', 'c12-compensation', 'Compensating Actions'),
    nest('c12-eventual-consistency', 'c12-reconciliation', 'Reconciliation Jobs'),
    nest('c12-eventual-consistency', 'c12-user-visible-consistency', 'User-Visible Consistency Trade-offs'),
    nest('c12-eventual-consistency', 'c12-inbox-outbox-reliability', 'Inbox/Outbox for Reliable Side Effects', 'tier2', {
      related: ['c11-outbox'],
    }),
  ]),

  section('C12.12', 'Failure Recovery', 193, [
    item('c12-failure-recovery', 'Failure Recovery'),
    nest('c12-failure-recovery', 'c12-restart-vs-heal', 'Restart vs Self-Heal'),
    nest('c12-failure-recovery', 'c12-poison-messages', 'Poison Messages & Quarantine'),
    nest('c12-failure-recovery', 'c12-manual-intervention', 'Runbooks & Manual Intervention'),
    nest('c12-failure-recovery', 'c12-data-repair', 'Data Repair & Backfills', 'tier2'),
    nest('c12-failure-recovery', 'c12-postmortem-loop', 'Incident → Postmortem → Prevention'),
  ]),

  section('C12.13', 'SLOs, Error Budgets & Reliability Signals', 194, [
    item('c12-slos', 'SLOs & Error Budgets', 'tier2'),
    nest('c12-slos', 'c12-sli-slo-sla', 'SLI vs SLO vs SLA', 'tier2'),
    nest('c12-slos', 'c12-error-budgets', 'Error Budgets & Release Policy', 'tier2'),
    nest('c12-slos', 'c12-latency-percentiles', 'p50 / p95 / p99 for Reliability', 'tier2'),
    nest('c12-slos', 'c12-saturation-signals', 'Saturation & Golden Signals', 'tier2'),
    nest('c12-slos', 'c12-alert-on-symptoms', 'Alert on User Symptoms', 'tier2'),
  ]),

  section('C12.14', 'Chaos, Overload & Production Playbooks', 195, [
    item('c12-chaos-ops', 'Chaos, Overload & Playbooks', 'tier2'),
    nest('c12-chaos-ops', 'c12-chaos-testing', 'Chaos / Fault Injection', 'tier2'),
    nest('c12-chaos-ops', 'c12-game-days', 'Game Days & Resilience Drills', 'tier2'),
    nest('c12-chaos-ops', 'c12-overload-control', 'Overload Control Playbook', 'tier2'),
    nest('c12-chaos-ops', 'c12-dependency-outage-playbook', 'Dependency Outage Playbook', 'tier2'),
    nest('c12-chaos-ops', 'c12-reliability-checklist', 'Production Reliability Checklist', 'tier2'),
  ]),
]
