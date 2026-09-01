import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Multi-stage Docker builds use multiple FROM stages in one Dockerfile. Early stages compile or bundle; final stage copies only runtime artifacts into a minimal base. Build tools and source never ship to production image.',
  whyExists:
    'Single-stage Java image includes Maven, JDK, and source — 500MB+. Multi-stage copies only the JAR into JRE-alpine — 150MB, smaller attack surface, faster deploys. Same pattern for Node (npm build → nginx static), Go (compile → scratch).',
  mentalModel:
    'Factory floor vs showroom. Stage 1 factory builds product; stage 2 showroom displays only finished goods. Customer never sees factory machinery.',
  howItWorks: [
    {
      type: 'mermaid',
      caption: 'Multi-stage build flow',
      diagram: `flowchart LR
  S1[Stage 1: maven + JDK] -->|COPY --from=build target/*.jar| S2[Stage 2: JRE-alpine]
  S2 --> Image[Final image]`,
    },
    {
      type: 'list',
      items: [
        'Name stages: FROM maven:3.9-eclipse-temurin-21 AS build',
        'Final stage: FROM eclipse-temurin:21-jre-alpine AS runtime',
        'COPY --from=build /app/target/app.jar app.jar',
        'Only last stage becomes default image unless --target specified.',
        'BuildKit cache mounts: RUN --mount=type=cache,target=/root/.m2 mvn package',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'dockerfile',
      caption: 'Maven build stage + slim runtime',
      code: `FROM maven:3.9-eclipse-temurin-21-alpine AS build
WORKDIR /src
COPY pom.xml .
RUN mvn -B dependency:go-offline
COPY src ./src
RUN mvn -B -DskipTests package

FROM eclipse-temurin:21-jre-alpine AS runtime
RUN adduser -D app
USER app
WORKDIR /app
COPY --from=build /src/target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Intermediate stages discarded unless tagged with --target for debugging.',
        'Cross-compile: BUILDPLATFORM and TARGETPLATFORM for arm64 from amd64 CI.',
        'Distroless final stage: no shell — debug harder, security better.',
        'Kaniko and BuildKit build stages in parallel when independent.',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Small prod image', 'No build tools in prod', 'Clear separation build vs run'],
    disadvantages: ['More complex Dockerfile', 'Must copy correct artifact path', 'Distroless harder to kubectl exec debug'],
    alternatives: ['CI builds JAR then docker COPY only', 'Jib builds layers without Dockerfile stages'],
    whenToUse: ['Compiled languages', 'Frontend static assets + nginx', 'Any fat build toolchain'],
    whenNotToUse: ['Pre-built artifact pipeline — single COPY stage enough'],
  },
  failureModes: [
    'COPY --from wrong path — build fails or empty JAR',
    'Forgot to rebuild stage after pom change — stale JAR',
    'Still running as root in final stage',
    'Including test classes in fat JAR copied to prod',
    'Two apps in monorepo — wrong module JAR copied',
  ],
  production: {
    security: ['Final stage minimal base', 'Non-root in runtime stage'],
    performance: ['Maven/npm cache mounts in build stage', 'Smaller image = faster K8s pull'],
    maintainability: ['Name stages clearly', 'CI --target runtime for prod builds only'],
  },
  interview: {
    expectations: ['Why multi-stage', 'COPY --from syntax', 'Size/security benefit'],
    commonQuestions: ['Reduce Docker image size for Java?', 'What is multi-stage build?'],
    followUps: ['Distroless final stage?', 'BuildKit cache mount?'],
    misconceptions: ['All FROM stages end up in final image', 'Multi-stage only for Go'],
    traps: ['Single stage with mvn and java in same image for prod'],
    strongSignals: ['Separate build/runtime', 'dependency:go-offline cache layer', 'JRE not JDK in prod'],
  },
  keyTakeaways: [
    'Multi-stage: build in fat image, copy artifact to slim runtime.',
    'COPY --from=stageName brings files between stages.',
    'Only final stage is published image by default.',
    'Cuts size and attack surface — no Maven/JDK in prod.',
    'Combine with cache mounts for fast CI builds.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Why multi-stage Docker build?', answerHint: 'Smaller prod image without compilers/build tools.' },
    { level: 'intermediate', question: 'COPY --from purpose?', answerHint: 'Copy files from named earlier stage into current stage.' },
    { level: 'advanced', question: 'Maven layer caching in Docker?', answerHint: 'Copy pom first, dependency:go-offline, then source; use BuildKit cache mount for .m2.' },
  ],
  flashcards: [
    { front: 'COPY --from=build', back: 'Copy artifact from named build stage' },
    { front: 'Final stage', back: 'Only last FROM becomes default output image' },
    { front: 'Distroless', back: 'Minimal image with app runtime only — no shell/package manager' },
  ],
  quickRevision: [
    'Build stage + runtime',
    'COPY --from',
    'JRE not JDK prod',
    'Cache pom layer',
    'Small attack surface',
  ],
}
