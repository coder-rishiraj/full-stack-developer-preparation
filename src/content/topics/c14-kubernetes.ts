import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Kubernetes orchestrates containerized workloads — scheduling pods, service discovery, scaling, rolling updates, config/secrets, and self-healing across a cluster of nodes.',
  whyExists: 'Manual container ops do not scale. K8s standardizes deploy, scale, and recover for microservices including LLM inference gateways and workers.',
  mentalModel: 'Air traffic control for containers — declares desired state; controllers reconcile reality.',
  howItWorks: [
    { type: 'list', items: [
      'Pod: one or more containers sharing network/volume.',
      'Deployment: replicated pods + rolling update strategy.',
      'Service: stable ClusterIP/LoadBalancer to pods.',
      'Ingress: HTTP routing and TLS termination.',
      'ConfigMap/Secret mount env and files.',
      'HPA scales on CPU/custom metrics (queue depth).',
    ] },
  ],
  example: [
    { type: 'paragraph', text: 'LLM gateway Deployment 3 replicas; HPA on p95 latency; Secret for OpenAI key; Ingress routes /v1/chat; worker Deployment scaled by KEDA on SQS depth.' },
  ],
  tradeoffs: {
    advantages: [
      'Declarative ops',
      'Rich ecosystem',
    ],
    disadvantages: [
      'Steep learning curve',
      'Ops overhead for small teams',
    ],
    alternatives: [
      'ECS/Fargate simpler AWS',
      'Docker Compose dev only',
    ],
    whenToUse: [
      'Multi-service prod at scale',
    ],
    whenNotToUse: [
      'Single tiny app — overkill',
    ],
  },
  failureModes: [
    'No resource limits — noisy neighbor',
    'Liveness too aggressive restart loop',
    'Secret mounted world-readable',
  ],
  production: {
    reliability: [
      'Probes liveness/readiness',
      'PDB for upgrades',
    ],
    security: [
      'RBAC least privilege',
      'NetworkPolicy',
    ],
    observability: [
      'Prometheus metrics from kube-state-metrics',
    ],
  },
  interview: {
    expectations: [
      'Pod/Deployment/Service',
      'Rolling update',
    ],
    commonQuestions: [
      'Kubernetes core objects?',
    ],
    followUps: [
      'HPA custom metric?',
    ],
    misconceptions: [
      'K8s replaces Docker',
    ],
    traps: [
      'No readiness probe on slow LLM pod',
    ],
    strongSignals: [
      'Declarative yaml + probes + limits + secrets',
    ],
  },
  keyTakeaways: [
    'Pods run containers',
    'Deployment manages replicas',
    'Service stable networking',
    'Secrets for API keys',
    'HPA/KEDA for LLM workers',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Pod vs Deployment?', answerHint: 'Pod is unit; Deployment manages desired replica count and updates.' },
    { level: 'intermediate', question: 'Readiness vs liveness?', answerHint: 'Readiness excludes from service until ready; liveness restarts if dead.' },
    { level: 'advanced', question: 'Scale LLM workers on queue?', answerHint: 'KEDA ScaledObject on SQS/Kafka lag metric.' },
  ],
  flashcards: [
    { front: 'Deployment', back: 'Manages replicated pod template and rollouts' },
    { front: 'HPA', back: 'Horizontal Pod Autoscaler on metrics' },
    { front: 'ConfigMap vs Secret', back: 'Non-sensitive vs sensitive config mounts' },
  ],
  quickRevision: [
    'Pod/Deploy/Service',
    'Ingress TLS',
    'Secrets mount',
    'Probes',
    'HPA/KEDA',
  ],
}
