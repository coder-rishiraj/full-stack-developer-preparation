import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Health metrics and probes verify a service is fit to serve traffic: liveness (process up), readiness (can accept requests), startup (slow init). Spring Actuator /actuator/health aggregates DB, disk, custom indicators. Orchestrators route traffic only to ready instances.',
  whyExists:
    'Process running != able to serve — DB down, disk full, dependency circuit open. Health checks remove bad instances from load balancer before users hit errors. Distinguish restart (liveness fail) vs drain (readiness fail).',
  mentalModel:
    'Airport gate status. Liveness: plane exists. Readiness: fueled, crew ready, cleared for boarding. Startup: long maintenance before first ready. Do not send passengers to gate not ready.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Probe', 'Fails when', 'Orchestrator action'],
      rows: [
        ['Liveness', 'Deadlock, JVM stuck', 'Restart container'],
        ['Readiness', 'DB down, warming cache', 'Remove from LB, no restart'],
        ['Startup', 'Slow init > liveness grace', 'Delay liveness until startup succeeds'],
      ],
    },
    {
      type: 'list',
      items: [
        'Actuator health groups: liveness/readiness separate endpoints Boot 2.3+.',
        'Custom HealthIndicator for critical dependency.',
        'Do not include external SaaS in liveness — flapping restarts.',
        'Health check lightweight — avoid full DB scan table.',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'yaml',
      caption: 'Kubernetes probes',
      code: `livenessProbe:
  httpGet: { path: /actuator/health/liveness, port: 8080 }
  periodSeconds: 10
readinessProbe:
  httpGet: { path: /actuator/health/readiness, port: 8080 }
  periodSeconds: 5
startupProbe:
  httpGet: { path: /actuator/health/readiness, port: 8080 }
  failureThreshold: 30`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'HealthContributorRegistry aggregates indicators — UP/DOWN/OUT_OF_SERVICE.',
        'Reactive health for WebFlux non-blocking checks.',
        'ALB target health independent of K8s — align paths.',
        'Graceful shutdown: readiness DOWN first, drain, then stop.',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Automated bad instance removal', 'Self-healing restarts', 'Deploy safety'],
    disadvantages: ['Misconfigured probe causes restart loop', 'Heavy health check loads DB', 'False DOWN on slow dependency'],
    alternatives: ['Manual traffic shift only — risky', 'Synthetic monitoring external only'],
    whenToUse: ['Every production deploy on K8s/ECS/ALB', 'Spring Boot services'],
    whenNotToUse: ['Health endpoint on public internet unauthenticated — restrict or separate port'],
  },
  failureModes: [
    'Liveness checks DB — restart storm on DB blip',
    'Same endpoint liveness and readiness — wrong restart on drain',
    'Health unauthenticated DDoS vector',
    'Too short timeout — flaky unhealthy',
    'Readiness never fails during shutdown — 502 mid-request',
  ],
  production: {
    reliability: ['Separate liveness/readiness groups', 'Startup probe for slow JVM apps'],
    observability: ['Alert on health DOWN duration', 'Track probe failure rate'],
    security: ['Management port internal only or auth', 'Do not expose sensitive details in health JSON'],
    maintainability: ['Document which deps in readiness vs liveness'],
  },
  interview: {
    expectations: ['Liveness vs readiness', 'Actuator health', 'K8s probe behavior'],
    commonQuestions: ['Difference liveness readiness?', 'Design health check?'],
    followUps: ['DB down — which probe fails?', 'Graceful shutdown sequence?'],
    misconceptions: ['One /health enough for all', 'Liveness should check everything'],
    traps: ['Heavy query in liveness probe every 5s'],
    strongSignals: ['Readiness excludes from LB not restart', 'Startup probe', 'Graceful drain'],
  },
  keyTakeaways: [
    'Liveness: restart if broken; readiness: stop traffic if not ready.',
    'Actuator /actuator/health with liveness/readiness groups.',
    'Readiness fails on dependency outage — no restart loop.',
    'Startup probe for slow-init JVM services.',
    'Graceful shutdown: readiness DOWN, drain, then exit.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Liveness vs readiness?', answerHint: 'Liveness: alive restart if fail; readiness: ready for traffic remove from LB.' },
    { level: 'intermediate', question: 'DB down — liveness or readiness?', answerHint: 'Readiness DOWN drain; not liveness — avoid restart storm.' },
    { level: 'advanced', question: 'Graceful shutdown with K8s?', answerHint: 'PreStop hook; readiness fail; sleep drain; SIGTERM to app.' },
  ],
  flashcards: [
    { front: 'Readiness probe', back: 'Fail removes pod from service endpoints' },
    { front: 'Liveness probe', back: 'Fail triggers container restart' },
    { front: 'HealthIndicator', back: 'Spring Actuator custom health contributor' },
  ],
  quickRevision: [
    'Live vs ready',
    'Actuator groups',
    'DB in readiness only',
    'Startup probe',
    'Drain then stop',
  ],
}
