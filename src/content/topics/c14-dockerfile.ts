import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'A Dockerfile is a declarative recipe to build a container image: FROM base, COPY artifacts, RUN commands, ENV, EXPOSE ports, USER, HEALTHCHECK, and ENTRYPOINT/CMD. Each instruction creates a cached layer.',
  whyExists:
    'Reproducible, version-controlled image builds in CI. Team shares exact steps to package JRE + app. Dockerfile review catches security smells (root user, curl | bash) before they reach production.',
  mentalModel:
    'Recipe card read top to bottom. Start from base image. Install deps before copying app code (cache). End with how to start the process. Multi-stage: compile in fat stage, copy JAR to slim runtime stage.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Instruction', 'Purpose'],
      rows: [
        ['FROM', 'Base image — must be first real instruction'],
        ['WORKDIR', 'Set working directory for subsequent commands'],
        ['COPY --chown', 'Copy files from build context'],
        ['RUN', 'Execute at build time — installs packages'],
        ['ENV', 'Default environment variables'],
        ['EXPOSE', 'Documentation of port — does not publish'],
        ['USER', 'Run as non-root'],
        ['HEALTHCHECK', 'Docker-level health probe'],
        ['ENTRYPOINT / CMD', 'Process to run — exec form preferred'],
      ],
    },
    {
      type: 'list',
      items: [
        'Exec form: CMD ["java", "-jar", "app.jar"] — PID 1 is java, receives SIGTERM.',
        'Shell form: CMD java -jar app.jar — PID 1 is shell, signal handling worse.',
        'Use .dockerignore for target/, .git, node_modules.',
        'ARG for build-time vars; ENV for runtime.',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'dockerfile',
      caption: 'Production Spring Boot Dockerfile',
      code: `FROM eclipse-temurin:21-jre-alpine AS runtime
RUN addgroup -S app && adduser -S app -G app
WORKDIR /app
COPY --chown=app:app target/checkout-api.jar app.jar
USER app
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost:8080/actuator/health || exit 1
ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-jar", "app.jar"]`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'BuildKit RUN --mount=type=cache speeds Maven/npm layers.',
        'COPY --from=stage in multi-stage copies artifacts between stages.',
        'Each RUN creates layer — combine apt install && rm cache in one RUN.',
        'HEALTHCHECK distinct from K8s liveness — both may coexist.',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Version controlled build', 'Layer cache in CI', 'Reviewable security posture'],
    disadvantages: ['Dockerfile drift from local scripts', 'Build context misuse leaks files', 'RUN curl installs non-reproducible'],
    alternatives: ['Jib / Buildpacks — no Dockerfile', 'Kaniko in K8s CI'],
    whenToUse: ['Custom JVM tuning', 'Multi-stage Java builds', 'Full control over base OS'],
    whenNotToUse: ['Simple Java deploy — Jib may suffice'],
  },
  failureModes: [
    'Root USER — privilege escalation risk',
    'Secrets in ENV or COPY .env',
    'No HEALTHCHECK — bad instances stay in rotation',
    'Shell form CMD — graceful shutdown broken',
    'Fat single-stage — 800MB image with JDK + source',
  ],
  production: {
    security: ['Non-root USER', 'Minimal base (distroless/alpine)', 'Pin base digest'],
    reliability: ['HEALTHCHECK + exec ENTRYPOINT', 'JAVA_TOOL_OPTIONS for container memory'],
    maintainability: ['Multi-stage separate build and runtime', 'Comments for non-obvious RUN'],
    performance: ['Order: deps before app COPY', 'Use .dockerignore'],
  },
  interview: {
    expectations: ['Layer caching order', 'ENTRYPOINT vs CMD', 'Multi-stage why'],
    commonQuestions: ['Write Dockerfile for Spring Boot?', 'Reduce image size?'],
    followUps: ['Exec vs shell form?', 'HEALTHCHECK vs K8s probe?'],
    misconceptions: ['EXPOSE publishes port to host', 'RUN at container start'],
    traps: ['COPY app before mvn dependency:go-offline layer'],
    strongSignals: ['Non-root', 'Multi-stage', 'Exec form ENTRYPOINT'],
  },
  keyTakeaways: [
    'Dockerfile instructions become cached layers.',
    'Copy dependencies before app code for cache hits.',
    'Multi-stage: build in JDK image, run in JRE/distroless.',
    'Exec form ENTRYPOINT for proper signals.',
    'Non-root USER and HEALTHCHECK in production images.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'ENTRYPOINT vs CMD?', answerHint: 'ENTRYPOINT fixed executable; CMD default args overridable.' },
    { level: 'intermediate', question: 'Optimize Docker layer cache for Maven?', answerHint: 'COPY pom.xml, RUN mvn dependency:go-offline, then COPY src.' },
    { level: 'advanced', question: 'Why exec form over shell form CMD?', answerHint: 'Exec: app is PID 1, gets SIGTERM; shell may not forward signals.' },
  ],
  flashcards: [
    { front: 'Exec form CMD', back: 'JSON array — no shell, proper signal handling' },
    { front: 'WORKDIR', back: 'Sets directory for RUN, COPY, CMD' },
    { front: '.dockerignore', back: 'Excludes paths from build context' },
  ],
  quickRevision: [
    'Layers cache order',
    'Multi-stage build',
    'USER non-root',
    'Exec ENTRYPOINT',
    'HEALTHCHECK',
  ],
}
