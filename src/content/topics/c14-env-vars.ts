import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Environment variables inject configuration into containers and apps at runtime: database URLs, API keys, feature flags, Spring profiles. Twelve-factor apps read config from env, not hard-coded files. Docker ENV, -e flags, env_file, and orchestrator secrets supply values.',
  whyExists:
    'Same image must run in dev, staging, and prod with different config. Baking secrets into images is a security disaster. Env vars separate build (immutable artifact) from config (environment-specific) enabling promote-not-rebuild deploys.',
  mentalModel:
    'Knobs on the outside of the box. Image is the box; env vars twist knobs without opening the factory seal. Spring reads SPRING_DATASOURCE_URL; Kubernetes sets env from ConfigMap and Secret.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Mechanism', 'Use'],
      rows: [
        ['Dockerfile ENV', 'Defaults — override at run time'],
        ['docker run -e KEY=val', 'Ad-hoc override'],
        ['env_file: .env', 'Compose loads file — gitignore secrets'],
        ['K8s ConfigMap/Secret', 'Inject as env or mounted files'],
        ['Spring ${VAR}', 'application.yml references env placeholders'],
      ],
    },
    {
      type: 'list',
      items: [
        'Never commit .env with prod secrets — use vault/SSM Parameter Store.',
        'SPRING_PROFILES_ACTIVE=prod selects profile-specific yaml.',
        'Secrets as files: /run/secrets/db_password — read in entrypoint.',
        '12-factor: strict separation; validate required env at startup fail-fast.',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'yaml',
      caption: 'Spring externalized config',
      code: `# application.yml
spring:
  datasource:
    url: \${SPRING_DATASOURCE_URL}
    username: \${SPRING_DATASOURCE_USERNAME}
    password: \${SPRING_DATASOURCE_PASSWORD}

# docker compose
environment:
  SPRING_PROFILES_ACTIVE: dev
  SPRING_DATASOURCE_URL: jdbc:postgresql://db:5432/app`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Process inherits env from PID 1; child processes get copy.',
        'Env size limits exist (~128KB on Linux) — huge config use mounted files.',
        'Docker --env-file order: later overrides earlier; CLI -e overrides file.',
        'Kubernetes secret env visible in pod spec and /proc — prefer external secret CSI.',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Same image all environments', 'No secret in image layers', 'Standard across platforms'],
    disadvantages: ['Env visible in docker inspect / process list', 'No typing — string only', 'Drift if not documented'],
    alternatives: ['Mounted config files', 'Consul/etcd dynamic config', 'AWS AppConfig'],
    whenToUse: ['All twelve-factor services', 'Feature flags and connection strings'],
    whenNotToUse: ['Large config blobs — use volume mount or S3'],
  },
  failureModes: [
    'Missing env — app starts with null URL, fails mysteriously later',
    'Secret in Dockerfile ENV — leaked in image history',
    '.env committed to git',
    'Wrong profile active in prod',
    'Typo in env var name — Spring silent default',
  ],
  production: {
    security: ['Secrets from vault/SSM, not env in CI logs', 'Rotate without rebuild'],
    reliability: ['Validate required env on startup', 'ConfigMap versioning in K8s'],
    maintainability: ['.env.example documents keys without values', 'Document in README/runbook'],
  },
  interview: {
    expectations: ['Build vs config separation', 'How inject DB URL in container', 'Secret handling'],
    commonQuestions: ['Configure Spring Boot in Docker?', 'Env vs config file?'],
    followUps: ['K8s Secret vs ConfigMap?', 'Env in image layer risk?'],
    misconceptions: ['ENV in Dockerfile safe for passwords', 'Same .env for all envs'],
    traps: ['ARG for runtime secret — ARG not available at run'],
    strongSignals: ['12-factor config', 'gitignore .env', 'Fail-fast validation'],
  },
  keyTakeaways: [
    'Config via env — same image, different environments.',
    'Never bake secrets into image; use secrets manager.',
    'Spring ${VAR} in yaml; SPRING_PROFILES_ACTIVE for profiles.',
    'env_file for Compose; K8s ConfigMap/Secret in prod.',
    'Validate required variables at startup.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Why env vars for config?', answerHint: 'Separate config from build; same artifact all envs.' },
    { level: 'intermediate', question: 'Danger of ENV PASSWORD in Dockerfile?', answerHint: 'Stored in image layers forever; visible in history.' },
    { level: 'advanced', question: 'K8s secret as env vs mounted file?', answerHint: 'Env easier but visible in pod spec/process; file slightly better; external CSI best.' },
  ],
  flashcards: [
    { front: '12-factor config', back: 'Store config in environment, not code' },
    { front: 'SPRING_PROFILES_ACTIVE', back: 'Selects Spring profile (dev, prod)' },
    { front: 'env_file', back: 'Compose loads key=value file into container env' },
  ],
  quickRevision: [
    'Config not in image',
    'Secrets external',
    'Spring placeholders',
    'Validate on start',
    '.env.example only',
  ],
}
