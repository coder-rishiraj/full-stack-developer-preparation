import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Health checks report service readiness for traffic — liveness (process alive, restart if hung) vs readiness (can handle requests, remove from load balancer if not). Spring Boot Actuator: /actuator/health, /actuator/health/readiness. Probes verify DB, Redis, disk, custom dependencies. Kubernetes liveness/readiness/startup probes.',
  whyExists:
    'Load balancers must not send traffic to starting or broken instances. Orchestrators restart wedged processes. Readiness waits for connection pools warmed and migrations done — prevents 503 storm during deploy rolling update.',
  mentalModel:
    'Liveness: JVM up and not deadlocked — fail → restart pod. Readiness: DB ping OK — fail → remove from LB but keep running to recover. Do not put slow external APIs on liveness — flapping restarts.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Probe', 'Question', 'Fail action'],
      rows: [
        ['Liveness', 'Process fundamentally broken?', 'Restart container'],
        ['Readiness', 'Can serve traffic now?', 'Remove from service endpoints'],
        ['Startup', 'Finished slow initialization?', 'Delay liveness until ready'],
        ['Actuator health', 'Aggregates indicators UP/DOWN', 'HTTP 503 when down'],
      ],
    },
    {
      type: 'code',
      language: 'yaml',
      caption: 'Kubernetes readiness probe',
      code: `readinessProbe:
  httpGet:
    path: /actuator/health/readiness
    port: 8080
  initialDelaySeconds: 10
  periodSeconds: 5
livenessProbe:
  httpGet:
    path: /actuator/health/liveness
    port: 8080
  periodSeconds: 10`,
    },
    {
      type: 'list',
      items: [
        'Custom HealthIndicator for Kafka consumer lag threshold',
        'Separate management port for actuator security',
        'Do not authenticate health endpoint to LB — network restrict instead',
        'Deep checks on readiness; shallow on liveness',
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Deploy new version: readiness fails until Flyway migrations complete and Redis ping succeeds — old pods take traffic. Kafka lag indicator marks DOWN readiness until caught up — instance drained until healthy.',
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Spring HealthContributorRegistry aggregates indicators',
        'Kubernetes endpoints controller watches ready pods',
        'Startup probe for JVM apps with slow start — prevents liveness kill mid-start',
        'Synthetic checks vs in-process health — complementary',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Automated traffic routing', 'Faster incident isolation', 'Safer rolling deploys'],
    disadvantages: ['Misconfigured liveness restart loops', 'Health check load on dependencies', 'False DOWN from strict checks'],
    alternatives: ['Manual LB drain — error prone', 'No probes — traffic to broken pods'],
    whenToUse: ['All orchestrated/stateless services'],
    whenNotToUse: ['Checking flaky third party on liveness — use readiness or async indicator only'],
  },
  failureModes: [
    'Payment API on liveness — external blip restarts all pods',
    'Health endpoint public exposes infra info — secure it',
    'Readiness same as liveness — unnecessary restarts',
    'No startup probe — slow app killed before ready',
    'Health always UP — hardcoded lie',
  ],
  production: {
    reliability: ['Readiness includes critical dependencies only', 'Startup probe for slow init'],
    security: ['Restrict actuator to internal network', 'Minimal health detail publicly'],
    observability: ['Track probe failures during deploys', 'Alert readiness flapping'],
  },
  interview: {
    expectations: ['Liveness vs readiness', 'Actuator endpoints', 'K8s probe config', 'What to check'],
    commonQuestions: ['Difference liveness readiness?', 'Spring Boot health?', 'Kafka lag in health?'],
    followUps: ['Startup probe when?', 'External API in health?'],
    misconceptions: ['Health check same as monitoring', 'Liveness should check database'],
    traps: ['Deep dependency check on liveness causing restart storm'],
    strongSignals: ['Readiness for DB/Redis, liveness lightweight, startup for slow boot, secure actuator'],
  },
  keyTakeaways: [
    'Liveness → restart; readiness → LB membership.',
    'Readiness waits for DB/pools/migrations; liveness stays shallow.',
    'Spring Actuator /health/readiness and /health/liveness.',
    'Startup probe protects slow-start apps.',
    'Never expose sensitive health details publicly.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Liveness vs readiness?', answerHint: 'Liveness: alive restart if fail; readiness: ready for traffic remove from LB if fail.' },
    { level: 'intermediate', question: 'What readiness should check?', answerHint: 'Critical local dependencies: DB pool, Redis, migrations done — not flaky third-party on liveness.' },
    { level: 'advanced', question: 'Kafka consumer lag in health?', answerHint: 'Readiness DOWN if lag > threshold — drain instance; do not liveness restart; scale consumers instead.' },
  ],
  flashcards: [
    { front: 'Liveness probe', back: 'Is process alive? Fail → restart pod' },
    { front: 'Readiness probe', back: 'Can serve traffic? Fail → remove from LB' },
    { front: 'Actuator /health', back: 'Spring aggregated health indicators' },
    { front: 'Startup probe', back: 'Delay liveness until slow initialization completes' },
  ],
  quickRevision: ['Liveness restart', 'Readiness LB', 'Shallow liveness', 'Actuator secure', 'Startup slow apps'],
}
