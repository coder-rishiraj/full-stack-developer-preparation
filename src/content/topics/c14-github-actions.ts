import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'GitHub Actions is CI/CD platform integrated with GitHub repos — workflows triggered on push/PR/schedule run jobs on hosted or self-hosted runners executing steps (checkout, build, test, deploy). YAML workflows define jobs, matrix builds, secrets, artifacts, and reusable actions marketplace.',
  whyExists:
    'Automate build-test-deploy on every change — catch failures before merge, enforce quality gates, deploy consistently. Native GitHub integration removes separate Jenkins setup for many teams; Jenkins still used for complex enterprise pipelines and on-prem.',
  mentalModel:
    'Recipe card on fridge. Event (push to main) triggers workflow; job runs on fresh VM runner; steps are shell commands or prebuilt actions. Parallel jobs for test + lint; deploy job needs test job green. Secrets injected as env vars never logged.',
  howItWorks: [
    {
      type: 'mermaid',
      caption: 'Typical PR workflow',
      diagram: `flowchart LR
  PR[Pull request] --> Lint[Job: lint]
  PR --> Test[Job: mvn test]
  PR --> IT[Job: integration Docker]
  Lint & Test & IT --> Gate[Required checks]
  Gate --> Merge[Merge allowed]`,
    },
    {
      type: 'table',
      headers: ['Concept', 'Purpose'],
      rows: [
        ['Workflow', 'YAML file in .github/workflows/'],
        ['Job', 'Parallel unit; runs on one runner'],
        ['Step', 'Single command or uses: action'],
        ['Matrix', 'Build across Java 17/21 × OS'],
        ['Environment', 'Deployment approval gates + secrets scope'],
        ['Artifact', 'Pass build JAR between jobs'],
      ],
    },
    {
      type: 'list',
      items: [
        'on: push, pull_request, workflow_dispatch manual trigger.',
        'services: postgres in job for integration tests — lighter than full Testcontainers on GHA.',
        'concurrency group cancel-in-progress saves CI minutes on rapid pushes.',
        'Reusable workflows org-wide standardize microservice pipeline.',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'yaml',
      caption: 'Spring Boot CI workflow excerpt',
      code: `name: CI
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          distribution: temurin
          java-version: '21'
          cache: maven
      - run: mvn -B verify
      - uses: actions/upload-artifact@v4
        with:
          name: jar
          path: target/*.jar`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'GITHUB_TOKEN permissions default read — elevate minimally for packages/deploy.',
        'Self-hosted runners for VPC deploy to internal k8s.',
        'OIDC federated AWS role assumption — no long-lived AWS keys in secrets.',
        'Jenkins equivalent: declarative pipeline Jenkinsfile, agents, stages, post actions.',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Native GitHub UX', 'Marketplace actions', 'Matrix and caching', 'Free tier for public repos'],
    disadvantages: ['Minute costs at scale', 'YAML complexity', 'Self-hosted runner security if misconfigured'],
    alternatives: ['Jenkins on-prem', 'GitLab CI', 'CircleCI', 'AWS CodePipeline'],
    whenToUse: ['GitHub-hosted projects', 'Standard Java/Node CI', 'Container deploy to cloud'],
    whenNotToUse: ['Heavy regulated on-prem only', 'Complex mainframe integration Jenkins plugins excel'],
  },
  failureModes: [
    'Secrets leaked in log from echo',
    'Unpinned action@main supply chain risk',
    'Flaky integration without service health wait',
    'Concurrent deploy race without concurrency group',
    'Cache poisoned — stale dependency build',
  ],
  production: {
    security: ['Pin actions to SHA', 'OIDC not static cloud keys', 'Least privilege GITHUB_TOKEN'],
    reliability: ['Required status checks on main', 'Branch protection enforce reviews'],
    performance: ['Maven/Gradle cache', 'Split unit vs integration jobs'],
    maintainability: ['Reusable workflow per org standard', 'Document manual workflow_dispatch deploy'],
  },
  interview: {
    expectations: ['Workflow/job/step hierarchy', 'PR gate pattern', 'Secrets handling', 'Jenkins comparison'],
    commonQuestions: ['CI pipeline for Spring Boot?', 'Secure AWS deploy from GHA?'],
    followUps: ['Matrix build?', 'Self-hosted vs GitHub-hosted?'],
    misconceptions: ['Actions replace Dockerfile', 'Secrets visible in fork PRs from same repo rules'],
    traps: ['Running deploy on every PR to prod'],
    strongSignals: ['OIDC AWS role', 'Concurrency cancel', 'Artifact promote deploy', 'Branch protection'],
  },
  keyTakeaways: [
    'Workflows automate CI/CD on GitHub events.',
    'Jobs parallel; steps sequential within job.',
    'Never commit secrets — use GitHub Secrets/OIDC.',
    'Pin third-party actions to commit SHA.',
    'Jenkins: similar stages on self-managed agents.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'GitHub Actions workflow trigger?', answerHint: 'on: push, pull_request, schedule, workflow_dispatch — defined in .github/workflows YAML.' },
    { level: 'intermediate', question: 'Secure AWS deploy from Actions?', answerHint: 'OIDC federated role assumption — no long-lived access keys in secrets.' },
    { level: 'advanced', question: 'GHA vs Jenkins when?', answerHint: 'GHA native GitHub simplicity; Jenkins plugins/self-host for complex enterprise on-prem control.' },
  ],
  flashcards: [
    { front: 'runs-on', back: 'Runner OS label e.g. ubuntu-latest for job VM' },
    { front: 'Matrix strategy', back: 'Run job permutations across versions/OS' },
    { front: 'OIDC deploy', back: 'Short-lived cloud credentials via trust relationship' },
    { front: 'Branch protection', back: 'Require passing checks before merge to main' },
  ],
  quickRevision: ['YAML workflows', 'Jobs + steps', 'Secrets/OIDC', 'Pin actions SHA', 'Required checks'],
}
