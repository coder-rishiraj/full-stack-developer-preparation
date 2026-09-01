import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Load testing measures system behavior under expected and peak traffic — throughput, latency percentiles, error rates, resource saturation. Tools: k6, Gatling, JMeter, Locust. Defines scenarios (ramp-up, steady, spike), validates SLOs, and finds bottlenecks before production incidents.',
  whyExists:
    'Capacity planning guesses fail. Load tests prove whether 10k RPS target survives with p99 < 200ms and reveal DB connection pool exhaustion, GC pauses, or lock contention invisible in unit tests. Required before major launches and autoscale tuning.',
  mentalModel:
    'Fire drill for traffic. Script simulates thousands of virtual users hitting endpoints while dashboards watch CPU, latency, errors. Ramp gradually — find knee of curve where latency explodes. Spike test sudden 5× traffic — does circuit breaker trip gracefully?',
  howItWorks: [
    {
      type: 'table',
      headers: ['Test type', 'Goal'],
      rows: [
        ['Load test', 'Sustained expected peak — validate SLO'],
        ['Stress test', 'Beyond peak until failure — find breaking point'],
        ['Spike test', 'Sudden traffic surge — autoscale/cold start'],
        ['Soak/endurance', 'Hours/days — memory leaks, connection drift'],
        ['Breakpoint', 'Increment load until SLA violated'],
      ],
    },
    {
      type: 'list',
      items: [
        'k6 script: stages [{ duration: "5m", target: 500 }] virtual users.',
        'Measure p50/p95/p99 latency not just average — tail matters.',
        'Isolate: test staging mirroring prod topology; realistic data volume.',
        'Inject think time — not all VUs hammer continuously unless stress intent.',
        'Monitor server-side during test: CPU, DB connections, Kafka lag, Redis memory.',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'javascript',
      caption: 'k6 load test snippet',
      code: `import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 100 },
    { duration: '5m', target: 500 },
    { duration: '2m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(99)<300'],
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  const res = http.get('https://staging.api.example.com/v1/products');
  check(res, { 'status 200': (r) => r.status === 200 });
  sleep(1);
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Coordinated omission: client timeout hides server slowness — k6 handles better than naive tools.',
        'Gatling async model simulates many connections per JVM efficiently.',
        'Distributed load generators needed when single machine cannot open enough sockets.',
        'Production-like cache warm state — cold cache test misleading for read latency.',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Evidence-based capacity', 'SLO validation', 'Regression detection in CI nightly'],
    disadvantages: ['Expensive staging infra', 'Risk if pointed at prod accidentally', 'Does not model all user behavior'],
    alternatives: ['Production traffic shadowing/mirroring', 'Analytical modeling only — risky alone'],
    whenToUse: ['Pre-launch', 'Architecture change', 'Autoscale policy tuning'],
    whenNotToUse: ['Tiny internal tool — overkill', 'Against prod without guardrails'],
  },
  failureModes: [
    'Testing dev laptop not prod topology — false confidence',
    'No data setup — empty DB unrealistic query plans',
    'Hammering one endpoint ignoring fan-out internal calls',
    'Ignoring warm-up — first minutes skew results',
    'Load generator itself CPU bound — not reaching target RPS',
  ],
  production: {
    performance: ['Define pass/fail thresholds in script (k6 thresholds)', 'Compare p99 release over release'],
    reliability: ['Run against isolated staging; block prod URLs in CI'],
    observability: ['Correlate test window with APM traces and DB slow query log'],
    cost: ['Schedule soak tests off-peak; tear down load env after'],
  },
  interview: {
    expectations: ['Load vs stress vs soak', 'p99 importance', 'What to monitor during test'],
    commonQuestions: ['Validate system handles 50k RPS?', 'Load test vs stress test?'],
    followUps: ['How find bottleneck from results?', 'Safe prod load test?'],
    misconceptions: ['Average latency enough', 'More VUs always better without analysis'],
    traps: ['Testing without realistic data volume'],
    strongSignals: ['SLO thresholds', 'Ramp stages', 'Server metrics correlation', 'k6/Gatling mention'],
  },
  keyTakeaways: [
    'Load test validates SLO under expected peak traffic.',
    'Measure tail latency p95/p99 not average only.',
    'Stress/soak/spike test different failure modes.',
    'Mirror prod topology and data scale in staging.',
    'Correlate client metrics with server resource monitors.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Purpose of load testing?', answerHint: 'Verify performance SLOs and find bottlenecks under simulated production traffic.' },
    { level: 'intermediate', question: 'Load vs stress test?', answerHint: 'Load: sustained expected peak; stress: push beyond until system breaks to find limits.' },
    { level: 'advanced', question: 'p99 latency spikes but avg fine — investigate?', answerHint: 'Tail issues — GC pauses, lock contention, slow queries, cold cache misses; check percentiles and traces.' },
  ],
  flashcards: [
    { front: 'Soak test', back: 'Long duration test exposing leaks and drift' },
    { front: 'k6 thresholds', back: 'Fail CI if p99 or error rate exceeds SLO' },
    { front: 'Spike test', back: 'Sudden traffic increase — tests autoscale and queues' },
    { front: 'Coordinated omission', back: 'Client timeouts hide server latency — distorts results' },
  ],
  quickRevision: ['Load = expected peak', 'Stress = break point', 'Watch p99', 'Realistic staging', 'Thresholds in CI'],
}
