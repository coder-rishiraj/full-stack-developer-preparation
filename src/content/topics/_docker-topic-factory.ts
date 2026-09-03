import type { TopicContent } from '@/domain/types'

type DockerTopicInput = {
  title: string
  sectionTitle: string
  parentTitle?: string
}

const SECTION_FOCUS: Record<string, string> = {
  'DevOps Foundations & Lifecycle':
    'culture + automation, the DevOps lifecycle, traditional SDLC friction, and feedback loops from plan to operate',
  'Version Control for Delivery':
    'merge strategies, trunk-based vs long-lived branches, and how Git habits enable or block CI',
  'Linux Fundamentals for Containers':
    'processes, permissions, env config, signals/SIGTERM, and debugging the Linux host under containers',
  'Containers & Docker Architecture':
    'images vs containers, client/daemon/registry, containers vs VMs, and Docker’s role in DevOps speed',
  'Docker Images & Registries':
    'layers/cache, Hub vs private registries, semantic tags, digests, and immutable promotion',
  'Dockerfile & Image Optimization':
    'Dockerfile syntax, .dockerignore, small secure images, non-root USER, and multi-stage builds',
  'Docker Compose & Local Stacks':
    'multi-service YAML, healthchecks, local parity, and why Compose is not production orchestration',
  'Docker Networking':
    'bridge vs host/overlay, port publish vs EXPOSE, and DNS between containers on user-defined networks',
  'Volumes & Container Storage':
    'named volumes vs bind mounts, persistence across restarts, and why prod DBs usually leave the node',
  'CI/CD Concepts & Deployment Automation':
    'CI vs CD, immutable Docker artifacts, pipeline stages, and reproducible builds via containers',
  'Pipeline Tools: GitHub Actions & Jenkins':
    'workflow jobs, Jenkins pipelines, secret handling/OIDC, and cache for faster feedback',
  'Kubernetes Orchestration':
    'Pods/Deployments/Services, rolling updates, probes, Docker vs K8s responsibilities, and cluster ops basics',
  'AWS ECS & Managed Containers':
    'task definitions/services, ECR deploy flow, and ECS/Fargate vs EKS trade-offs for teams',
  'Infrastructure as Code':
    'Terraform vs CloudFormation, reviewable infra, state/drift, and replacing irreversible click-ops',
  'Monitoring & Logging for Delivery':
    'Prometheus/Grafana/Helm overview, golden signals around deploys, and chatops for incidents',
  'DevSecOps & Container Security':
    'shift-left scanning/SBOM, non-root images, secrets hygiene, and baseline Kubernetes security controls',
}

export function createDockerTopicContent({
  title,
  sectionTitle,
  parentTitle,
}: DockerTopicInput): TopicContent {
  const focus =
    SECTION_FOCUS[sectionTitle] ??
    'Docker/DevOps delivery mechanics, failure modes, and production trade-offs'
  const parent = parentTitle ? ` It is an atomic part of ${parentTitle}.` : ''

  return {
    whatIsIt:
      `${title} is a Docker/DevOps topic in ${sectionTitle}.${parent} ` +
      'At five years of experience, explain the delivery path (build → ship → run), the failure mode it prevents, and the production trade-off — not only the happy-path command.',
    whyExists:
      `${title} exists because teams need reproducible environments, fast feedback, and safer releases across machines and clouds. ` +
      `A strong answer covers ${focus}.`,
    mentalModel:
      'Code → version control → CI builds an immutable image → registry → orchestrator runs the same artifact with env-specific config. ' +
      'Ask: what is packaged, what is configured at runtime, how do we roll forward/back, and how do we observe and secure it?',
    howItWorks: [
      {
        type: 'list',
        ordered: true,
        items: [
          `Place ${title} on the delivery path: develop → build → test → registry → deploy → observe.`,
          'Name the artifact boundary: Dockerfile/image layers, Compose stack, or orchestrator workload.',
          'State the runtime concern: networking, volumes, env/secrets, probes, or scaling.',
          'State the ops control: digests not :latest, resource limits, rollouts, or IaC review.',
          'State the security/ops signal: CVE scan, non-root, logs/metrics, or incident playbook.',
        ],
      },
      {
        type: 'callout',
        variant: 'note',
        title: 'Track boundary',
        text:
          'C14 owns Docker/DevOps delivery mechanics. C15 owns deep AWS product surfaces; C16 owns observability tooling depth; ' +
          'C9 owns application security architecture; C12 owns reliability patterns that pipelines and orchestrators must respect.',
      },
    ],
    internals: [
      {
        type: 'list',
        items: [
          'Containers share the host kernel with isolated namespaces/cgroups; images are layered read-only filesystems instantiated as containers.',
          'Docker Engine is client + daemon + APIs; registries store/share images; Compose defines multi-container apps on one host.',
          'CI/CD promotes the same image digest across environments; config differs via env, secrets, and orchestrator manifests.',
          'Kubernetes schedules desired state (Pods/Deployments/Services); ECS is a managed AWS alternative with task definitions/services.',
          'DevSecOps shifts scanning, least privilege, and secret hygiene left into build and deploy — not only perimeter firewalls.',
        ],
      },
    ],
    failureModes: [
      `Treating ${title} as a local demo without an immutable artifact, rollback, or observability story.`,
      'Shipping :latest, baking secrets into image layers, or running containers as root in production.',
      'Using Docker Compose (or Swarm) as a stand-in for production orchestration without HA, scheduling, or probe strategy.',
      'CI that cannot reproduce local builds, or pipelines without image scanning and secret isolation.',
      'Confusing Docker (build/run containers) with Kubernetes (orchestrate containers at scale).',
    ],
    production: {
      performance: [
        'Keep images small (multi-stage, alpine/distroless where appropriate) and cache layers ordered from stable to volatile.',
        'Set CPU/memory limits so one noisy container cannot starve the host or node.',
      ],
      reliability: [
        'Promote digests; use health/readiness probes and graceful SIGTERM shutdown.',
        'Prefer managed data stores over node-local Docker volumes for production state.',
      ],
      maintainability: [
        'Keep Dockerfiles and Compose/K8s manifests reviewable in Git; prefer IaC over console click-ops.',
        'Document the one golden path: local Compose → CI image → registry → ECS/K8s.',
      ],
      observability: [
        'Emit structured logs and golden signals around deploys; correlate image digest with incidents.',
        'Alert on deploy failure, probe flaps, and error-rate burn — not only host CPU.',
      ],
      security: [
        'Scan images, pin bases by digest, run as non-root, and inject secrets at runtime — never ENV passwords in Dockerfiles.',
        'Limit registry pull sources and apply least-privilege IAM/service accounts to deploy roles.',
      ],
      cost: [
        'Right-size tasks/pods; prune unused images/volumes in CI runners; prefer Fargate/spot strategies consciously.',
      ],
    },
    interview: {
      expectations: [
        `Define ${title} in ${sectionTitle} and place it on the build → ship → run path.`,
        'Separate image (immutable) from config/secrets (environment-specific).',
        'Name one production control: digest pinning, probes, scan gate, or IaC review.',
      ],
      commonQuestions: [
        `How does ${title} show up in a Docker/DevOps workflow?`,
        'Container vs VM? Docker vs Kubernetes?',
        'How do you keep staging and production identical safely?',
      ],
      followUps: [
        'What breaks if the container receives SIGKILL instead of SIGTERM?',
        'How would you roll back a bad image without rebuilding from scratch?',
      ],
      misconceptions: [
        'Docker replaces Kubernetes (or vice versa).',
        'EXPOSE publishes ports to the world.',
        'Compose/Swarm is enough for multi-AZ production by default.',
      ],
      traps: [
        'Reciting commands without discussing immutability, secrets, or rollback.',
        'Claiming “works on my machine” is solved while still shipping host-specific bind mounts to prod.',
      ],
      strongSignals: [
        'Ties Dockerfile → registry digest → orchestrator rollout into one coherent story.',
        'Talks security and operability (non-root, scans, probes, IaC) as first-class, not afterthoughts.',
      ],
    },
    keyTakeaways: [
      `${title} belongs to ${sectionTitle}.`,
      `Focus: ${focus}.`,
      'Same image digest everywhere; config and secrets vary by environment.',
    ],
    interviewQuestions: [
      {
        level: 'basic',
        question: `What is ${title}, and where does it sit in Docker/DevOps delivery?`,
        answerHint: `Place it in ${sectionTitle}; mention build, registry, or runtime as applicable.`,
      },
      {
        level: 'intermediate',
        question: `Which production trade-offs matter for ${title}?`,
        answerHint: 'Discuss immutability, networking/storage, orchestration, or security gates as applicable.',
      },
      {
        level: 'advanced',
        question: `How would you operate and debug ${title} after a bad production deploy?`,
        answerHint: `Use ${focus} plus digests, probes, logs/metrics, and rollback/roll-forward.`,
      },
    ],
    flashcards: [
      { front: title, back: `${sectionTitle}: ${focus}.` },
      {
        front: `${title} review loop`,
        back: 'Build image → pin digest → deploy with probes → observe → secure/rollback.',
      },
    ],
    quickRevision: [
      `${title} — ${sectionTitle}`,
      `Focus: ${focus}`,
      'Immutable artifact + env-specific config',
      'Docker builds/runs; orchestrators schedule/heal',
    ],
  }
}
