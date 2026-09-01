import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Docker Compose defines multi-container applications in docker-compose.yml: services, images, ports, env, volumes, networks, depends_on, and healthchecks. docker compose up starts the stack locally — API + Postgres + Redis with one command.',
  whyExists:
    'Microservices and dependencies are painful to start manually. Compose gives dev/CI a reproducible local stack matching production topology without full Kubernetes. Integration tests and onboarding speed up dramatically.',
  mentalModel:
    'Orchestration lite for one machine. Each service is a container; Compose wires network DNS (service name = hostname), mounts volumes, injects env. Not for production HA — use ECS/K8s — but perfect for dev and test.',
  howItWorks: [
    {
      type: 'list',
      items: [
        'services: block defines each container (api, db, redis).',
        'ports: "8080:8080" publishes host:container.',
        'environment or env_file for config.',
        'depends_on + condition: service_healthy waits for DB ready.',
        'volumes: named or bind mount for persistent DB data.',
        'networks: default bridge; custom for isolation.',
      ],
    },
    {
      type: 'code',
      language: 'yaml',
      caption: 'Compose stack excerpt',
      code: `services:
  api:
    build: .
    ports: ["8080:8080"]
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://db:5432/app
    depends_on:
      db:
        condition: service_healthy
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: dev
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
    volumes:
      - pgdata:/var/lib/postgresql/data
volumes:
  pgdata:`,
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Developer runs docker compose up. API connects to jdbc:postgresql://db:5432/app — hostname db resolves via Compose DNS. Postgres data persists in pgdata volume across restarts.',
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Compose v2 is docker compose plugin (not docker-compose binary).',
        'Project name prefixes containers: myproject-api-1.',
        'Override files: compose.yml + compose.override.yml for local secrets.',
        'Profiles activate optional services (debug tools, mailhog).',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['One command local stack', 'Version controlled infra', 'CI integration test environment'],
    disadvantages: ['Not production orchestration', 'Single host limits', 'depends_on does not wait for app ready without healthcheck'],
    alternatives: ['Kubernetes kind/minikube locally', 'Testcontainers per test', 'Dev containers in VS Code'],
    whenToUse: ['Local dev with DB/cache', 'CI compose up for E2E', 'Demo environments'],
    whenNotToUse: ['Production multi-node HA', 'Autoscaling workloads'],
  },
  failureModes: [
    'depends_on without healthcheck — API starts before DB accepts connections',
    'Hard-coded passwords in compose committed to git',
    'Port conflict on host 5432 already in use',
    'Bind mount slow on macOS Docker Desktop',
    'Stale volume with old schema after migration change',
  ],
  production: {
    maintainability: ['Use env_file gitignored for secrets', 'Document compose up in README'],
    reliability: ['Healthchecks on dependencies', 'Restart policies for dev'],
    security: ['Do not reuse dev compose in prod', 'Secrets via Docker secrets or external vault'],
  },
  interview: {
    expectations: ['Compose purpose', 'Service DNS names', 'depends_on vs healthcheck'],
    commonQuestions: ['Docker Compose vs Kubernetes?', 'How connect app to Postgres in Compose?'],
    followUps: ['Persist DB data?', 'Run integration tests with Compose?'],
    misconceptions: ['Compose replaces K8s in prod', 'depends_on waits for DB migrations'],
    traps: ['No healthcheck — flaky startup race'],
    strongSignals: ['service_healthy condition', 'Named volumes', 'Override files for secrets'],
  },
  keyTakeaways: [
    'Compose defines multi-container apps for local/CI.',
    'Service name = DNS hostname on default network.',
    'Use healthchecks + depends_on condition for startup order.',
    'Volumes persist database data locally.',
    'Dev tool — production uses K8s/ECS with similar service graph.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'What is Docker Compose?', answerHint: 'YAML-defined multi-container app on one Docker host.' },
    { level: 'intermediate', question: 'How API finds DB in Compose?', answerHint: 'Hostname is service name (db); Compose embedded DNS.' },
    { level: 'advanced', question: 'depends_on enough for DB readiness?', answerHint: 'No — container start != DB ready; use healthcheck + service_healthy.' },
  ],
  flashcards: [
    { front: 'depends_on service_healthy', back: 'Wait until dependency healthcheck passes' },
    { front: 'Compose service name', back: 'DNS hostname for other containers' },
    { front: 'Named volume', back: 'Docker-managed persistent storage across restarts' },
  ],
  quickRevision: [
    'YAML multi-service',
    'DNS = service name',
    'Healthcheck startup',
    'Named volumes',
    'Dev not prod HA',
  ],
}
