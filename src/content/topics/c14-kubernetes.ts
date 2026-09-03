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
    {
      type: 'table',
      headers: ['Concern', 'Docker', 'Kubernetes'],
      rows: [
        ['Primary job', 'Build and run containers', 'Schedule, scale, heal containers across nodes'],
        ['Unit of work', 'Container / Compose service', 'Pod + Deployment / Service'],
        ['Best fit', 'Local/CI and single-host stacks', 'Multi-node production clusters'],
        ['Rollouts', 'Replace container / compose up', 'Rolling update, probes, PDB'],
      ],
    },
    {
      type: 'list',
      items: [
        'Docker creates the image; the orchestrator (K8s or ECS) runs many copies of that image.',
        'Declare desired state in YAML; controllers reconcile when nodes or pods fail.',
        'DevOps practice: same image digest from CI, probes before traffic, Resource requests/limits, and NetworkPolicy/RBAC.',
      ],
    },
  ],
  example: [
    { type: 'paragraph', text: 'Checkout API Deployment 3 replicas; readiness on /actuator/health; Secret for DB password; Service ClusterIP; Ingress TLS; HPA on CPU. Same image digest promoted from staging.' },
  ],
  tradeoffs: {
    advantages: [
      'Declarative ops',
      'Self-healing and rolling updates',
      'Rich ecosystem (Ingress, HPA, operators)',
    ],
    disadvantages: [
      'Steep learning curve',
      'Ops overhead for small teams',
    ],
    alternatives: [
      'ECS/Fargate simpler AWS',
      'Docker Compose for local only',
      'Docker Swarm — legacy contrast, rarely chosen for greenfield',
    ],
    whenToUse: [
      'Multi-service prod at scale',
      'Need rolling updates, service discovery, and autoscaling',
    ],
    whenNotToUse: [
      'Single tiny app — overkill',
      'Team has no cluster ops capacity — prefer ECS/Fargate',
    ],
  },
  failureModes: [
    'No resource limits — noisy neighbor',
    'Liveness too aggressive restart loop',
    'Secret mounted world-readable',
    'Treating Kubernetes as a replacement for writing a good Dockerfile/image',
  ],
  production: {
    reliability: [
      'Probes liveness/readiness',
      'PDB for upgrades',
      'Roll image digests, not :latest',
    ],
    security: [
      'RBAC least privilege',
      'NetworkPolicy',
      'Non-root containers + image scanning gates',
    ],
    observability: [
      'Prometheus metrics from kube-state-metrics',
    ],
  },
  interview: {
    expectations: [
      'Pod/Deployment/Service',
      'Rolling update',
      'Docker builds/runs; K8s orchestrates',
    ],
    commonQuestions: [
      'Kubernetes core objects?',
      'Docker vs Kubernetes?',
    ],
    followUps: [
      'HPA custom metric?',
      'When choose ECS over EKS?',
    ],
    misconceptions: [
      'K8s replaces Docker',
      'Compose equals production orchestration',
    ],
    traps: [
      'No readiness probe on slow startup pods',
    ],
    strongSignals: [
      'Declarative yaml + probes + limits + secrets + digest promotion',
    ],
  },
  keyTakeaways: [
    'Pods run containers; Deployments manage replicas and rollouts',
    'Service gives stable networking; Ingress handles HTTP/TLS',
    'Docker packages; Kubernetes schedules and heals at scale',
    'Secrets, probes, and resource limits are production baselines',
    'HPA/KEDA for demand-based scale',
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
