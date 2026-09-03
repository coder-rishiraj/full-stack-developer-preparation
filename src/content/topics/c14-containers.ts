import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Containers package an application and its dependencies into an isolated filesystem with its own process namespace, network, and cgroups limits. Docker is the dominant runtime; OCI (Open Container Initiative) defines the image and runtime spec shared by containerd, Podman, and Kubernetes.',
  whyExists:
    'Works on my machine stops when OS, libc, and dependency versions differ. Containers ship the same artifact from laptop to CI to production. Lightweight compared to VMs — share host kernel, start in seconds, density per host is high.',
  mentalModel:
    'Not a mini-VM — a fenced process with its own root filesystem snapshot (image layers). Namespaces hide other processes and networks; cgroups cap CPU/memory. Image is immutable template; container is running instance.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Concept', 'Description'],
      rows: [
        ['Image', 'Read-only layered filesystem + metadata (CMD, ENV, EXPOSE)'],
        ['Container', 'Writable layer on top of image + running process'],
        ['Registry', 'Remote store (Docker Hub, ECR) for push/pull'],
        ['Runtime', 'containerd/CRI runs container from image spec'],
        ['Orchestrator', 'Kubernetes schedules many containers across nodes'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'Container vs VM',
      diagram: `flowchart TB
  subgraph vm [VM]
    GuestOS[Guest OS]
    App1[App]
    GuestOS --> App1
  end
  subgraph ctr [Container]
    App2[App + libs]
  end
  Host[Host OS + Kernel] --> vm
  Host --> ctr`,
    },
    {
      type: 'list',
      items: [
        'docker run creates container from image, assigns network, mounts volumes.',
        'Docker architecture: CLI client → dockerd daemon → images/containers/networks/volumes; registries (Hub/ECR) store/share images.',
        'PID 1 in container should handle signals (use tini/dumb-init or proper init).',
        'Containers are ephemeral — state goes to volumes or external DB.',
        'Root in container != root on host unless --privileged (avoid).',
        'Same container image is the DevOps collaboration unit: local → CI → staging → prod.',
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Build Spring Boot JAR, package in eclipse-temurin:21-jre-alpine image, run with docker run -p 8080:8080 --env SPRING_PROFILES_ACTIVE=prod app:1.0. Same image runs in ECS, EKS, or local Compose — that is Docker for DevOps consistency.',
    },
    {
      type: 'code',
      language: 'bash',
      caption: 'Essential commands (interview fluency)',
      code: `docker pull eclipse-temurin:21-jre-alpine
docker build -t myapp:1.0 .
docker run -d --name api -p 8080:8080 --memory=512m --cpus=1 myapp:1.0
docker ps
docker logs -f api
docker exec -it api sh
docker stop api && docker rm api`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Union filesystem (overlay2): image layers shared, copy-on-write top layer per container.',
        'Linux namespaces: pid, net, mount, uts, ipc, user.',
        'cgroups v2 limit CPU, memory, pids — OOM kills container not whole host.',
        'OCI image manifest lists layer digests; content-addressable storage.',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Reproducible deploys', 'Fast start', 'High density', 'CI/CD parity'],
    disadvantages: ['Not full isolation vs VM for multi-tenant untrusted workloads', 'Stateful apps need external storage', 'Windows/macOS run Linux VM under Docker Desktop'],
    alternatives: ['VMs for strong isolation', 'Bare metal for max performance', 'Serverless containers (Fargate)'],
    whenToUse: ['Microservices deploy', 'CI test environments', 'Local dev parity'],
    whenNotToUse: ['GUI desktop apps without extra setup', 'When kernel modules needed differently per app on same host'],
  },
  failureModes: [
    'Writing logs/state to container filesystem — lost on restart',
    'PID 1 ignores SIGTERM — slow shutdown, corrupt state',
    'Running as root — container escape amplifies damage',
    'Fat images — slow pull and start',
    'Wrong architecture image (arm64 vs amd64) on CI',
  ],
  production: {
    reliability: ['Health checks in orchestrator', 'Graceful shutdown on SIGTERM', 'Non-root USER in Dockerfile'],
    scalability: ['Horizontal scale via orchestrator replicas', 'Immutable deploy — replace not patch'],
    security: ['Scan images for CVEs', 'Read-only root filesystem where possible', 'Drop capabilities'],
    cost: ['Right-size memory limits — pay for reserved K8s resources'],
    observability: ['Stdout/stderr log shipping', 'Container metrics via cAdvisor/kubelet'],
  },
  interview: {
    expectations: ['Container vs VM', 'Image vs container', 'Why containers for deploy'],
    commonQuestions: ['What is Docker?', 'Container vs VM difference?', 'Where is data stored?'],
    followUps: ['PID 1 problem?', 'How Kubernetes relates to Docker?'],
    misconceptions: ['Containers include guest OS', 'Docker equals Kubernetes'],
    traps: ['Store DB inside container without volume'],
    strongSignals: ['Namespaces + cgroups', 'Immutable infra', 'OCI standard mention'],
  },
  keyTakeaways: [
    'Container = isolated process with image filesystem, not full VM.',
    'Image immutable; container is runtime instance with writable layer.',
    'Share host kernel — fast and dense.',
    'State external: volumes, DB, object storage.',
    'OCI standard; Kubernetes orchestrates at scale.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Image vs container?', answerHint: 'Image: template/layers; container: running instance with writable layer.' },
    { level: 'intermediate', question: 'Container vs VM isolation?', answerHint: 'Container shares kernel, lighter; VM has own kernel, stronger isolation.' },
    { level: 'advanced', question: 'PID 1 signal handling issue?', answerHint: 'Java/shell as PID 1 may ignore SIGTERM; use tini or exec form CMD.' },
  ],
  flashcards: [
    { front: 'OCI', back: 'Open Container Initiative — image and runtime standards' },
    { front: 'overlay2', back: 'Docker storage driver stacking image layers' },
    { front: 'cgroups', back: 'Limit CPU/memory/pids for container process group' },
  ],
  quickRevision: [
    'Process + namespaces',
    'Image vs container',
    'Share host kernel',
    'External state',
    'Non-root PID1',
  ],
}
