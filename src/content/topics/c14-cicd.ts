import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'CI/CD automates build, test, and deploy: Continuous Integration merges code frequently with automated tests; Continuous Delivery deploys to staging automatically; Continuous Deployment promotes to production without manual gate. Pipeline stages: checkout → build → test → scan → publish artifact → deploy.',
  whyExists:
    'Manual deploys are slow, error-prone, and inconsistent. CI catches regressions before merge. CD reduces time-to-production and enables rollbacks via immutable artifacts. DevOps culture pairs code ownership with pipeline responsibility — Docker makes the build and test environment reproducible across machines.',
  mentalModel:
    'Assembly line for software. Every commit rides the line: compile, test, security scan, package Docker image, push to registry, deploy to environment. Red build blocks merge; green artifact is promotable.',
  howItWorks: [
    {
      type: 'mermaid',
      caption: 'Typical Java microservice pipeline',
      diagram: `flowchart LR
  Commit --> Build[mvn package]
  Build --> Unit[Unit tests]
  Unit --> IT[Integration + Testcontainers]
  IT --> Scan[Image CVE scan]
  Scan --> Push[Push ECR]
  Push --> Deploy[Deploy staging]
  Deploy --> Smoke[Smoke tests]`,
    },
    {
      type: 'table',
      headers: ['Stage', 'Purpose'],
      rows: [
        ['Lint/format', 'Style and static analysis'],
        ['Unit test', 'Fast feedback on PR'],
        ['Integration test', 'Docker + Testcontainers'],
        ['Build image', 'docker build / Jib'],
        ['Security scan', 'Trivy, Snyk, Dependabot'],
        ['Deploy', 'Helm, ECS, kubectl apply'],
        ['Smoke/E2E', 'Post-deploy health verification'],
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'yaml',
      caption: 'GitHub Actions excerpt',
      code: `jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with: { java-version: '21', distribution: 'temurin' }
      - run: mvn -B verify
      - run: docker build -t app:\${{ github.sha }} .
      - run: docker push .../app:\${{ github.sha }}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Trunk-based development + feature flags vs long-lived branches.',
        'Artifact immutability: same SHA image dev → prod.',
        'Pipeline secrets in CI vault — not in yaml plaintext.',
        'GitOps: repo declares desired K8s state; Argo CD reconciles.',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Fast feedback', 'Reproducible deploys', 'Audit trail of every release'],
    disadvantages: ['Pipeline maintenance cost', 'Flaky tests block team', 'Initial setup investment'],
    alternatives: ['Manual deploy with checklists — does not scale', 'Heroku push — less control'],
    whenToUse: ['Every team shipping production software', 'Regulated audit requirements'],
    whenNotToUse: ['Throwaway prototype — still minimal CI recommended'],
  },
  failureModes: [
    'Flaky integration tests — team ignores red builds',
    'Deploy without migration run — schema mismatch',
    'Secrets logged in CI output',
    'No rollback path — forward-only panic',
    'Long pipeline — developers skip waiting',
  ],
  production: {
    reliability: ['Required checks on main', 'Automated rollback on health fail', 'Database migration job in pipeline'],
    security: ['SAST/DAST, dependency scan, signed images', 'Least privilege CI OIDC to cloud'],
    maintainability: ['Pipeline as code in repo', 'Parallel jobs for speed'],
    observability: ['Deploy notifications, DORA metrics (lead time, failure rate)'],
  },
  interview: {
    expectations: ['CI vs CD difference', 'Pipeline stages', 'Immutable artifact promote'],
    commonQuestions: ['Describe your CI/CD pipeline?', 'CI vs CD?'],
    followUps: ['GitOps?', 'Rollback strategy?'],
    misconceptions: ['CI/CD means no human testing ever', 'Deploy on every commit to prod always'],
    traps: ['No test stage before deploy'],
    strongSignals: ['Testcontainers in CI', 'Scan + sign', 'Same image promote', 'DORA metrics'],
  },
  keyTakeaways: [
    'CI: automated build+test on every change.',
    'CD: automated deploy to environments with quality gates.',
    'Immutable artifact (Docker image) promoted by tag/digest.',
    'Pipeline as code; secrets external.',
    'Fast unit stage; slower IT nightly or parallel.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'CI vs CD?', answerHint: 'CI: integrate and test automatically; CD: deliver/deploy to environments automatically.' },
    { level: 'intermediate', question: 'Why same Docker image staging and prod?', answerHint: 'What you tested is what runs; config differs via env only.' },
    { level: 'advanced', question: 'GitOps vs push deploy?', answerHint: 'GitOps: declarative desired state in git, controller reconciles; push: pipeline kubectl apply directly.' },
  ],
  flashcards: [
    { front: 'Continuous Integration', back: 'Frequent merge with automated build and test' },
    { front: 'Immutable artifact', back: 'Same built image promoted across environments' },
    { front: 'GitOps', back: 'Git as source of truth for deployment state' },
  ],
  quickRevision: [
    'Build test scan deploy',
    'Immutable image promote',
    'Pipeline as code',
    'Secrets in vault',
    'Rollback ready',
  ],
}
