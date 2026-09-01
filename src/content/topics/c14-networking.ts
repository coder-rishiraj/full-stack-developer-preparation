import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Docker networking connects containers via virtual bridges, overlay networks, and DNS. Default bridge isolates containers; user-defined bridge enables service name DNS. Port publishing maps container ports to host. Compose and Kubernetes create per-app networks automatically.',
  whyExists:
    'Containers need to talk to each other and the outside world without IP chaos. Service discovery by name (api → db:5432) replaces hard-coded IPs. Network isolation separates dev stacks and limits blast radius.',
  mentalModel:
    'Private LAN per Compose project. Each container gets IP on bridge; embedded DNS resolves service names. -p publishes selected ports to host like NAT on router.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Network mode', 'Behavior'],
      rows: [
        ['bridge (default)', 'Containers on same user-defined bridge reach each other by name'],
        ['host', 'Container shares host network stack — no port mapping'],
        ['none', 'No networking — isolated batch jobs'],
        ['overlay', 'Multi-host Swarm/K8s CNI spans nodes'],
      ],
    },
    {
      type: 'list',
      items: [
        'docker network create app-net; docker run --network app-net.',
        'Published port -p 8080:8080 binds host 8080 → container 8080.',
        'Container-to-container on same network uses internal port, no publish needed.',
        'iptables DNAT implements port publishing on Linux.',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'bash',
      caption: 'Custom network and DNS',
      code: `docker network create backend
docker run -d --name db --network backend postgres:16
docker run -d --name api --network backend -p 8080:8080 \\
  -e DB_HOST=db myapi:1.0
# api resolves "db" to container IP via embedded DNS`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'veth pair connects container namespace to bridge docker0 or custom br-*.',
        'Embedded DNS server (127.0.0.11) resolves container names on user-defined networks.',
        'Default bridge does not support automatic DNS between containers — use custom network.',
        'Kubernetes CNI (Calico, Cilium) replaces Docker networking at orchestrator level.',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Service discovery by name', 'Network isolation per project', 'Simple local multi-container wiring'],
    disadvantages: ['Default bridge limitations', 'Host mode breaks port isolation', 'Overlay complexity multi-host'],
    alternatives: ['Host networking for max perf latency-sensitive', 'K8s Services and Ingress in prod'],
    whenToUse: ['Compose multi-service', 'Integration test networks', 'Isolated dev stacks'],
    whenNotToUse: ['Production cross-AZ — use cloud VPC + LB'],
  },
  failureModes: [
    'Containers on default bridge — cannot resolve by name',
    'Port already allocated on host',
    'Wrong network — api cannot reach db',
    'Published only 127.0.0.1 missing — cannot reach from other machines',
    'Firewall blocks published ports',
  ],
  production: {
    reliability: ['Prod: VPC subnets, security groups, not Docker bridge', 'Health checks on service endpoints'],
    security: ['Do not publish DB port to 0.0.0.0 in prod', 'Network policies in K8s restrict pod traffic'],
    maintainability: ['Compose networks mirror logical service groups'],
  },
  interview: {
    expectations: ['User-defined bridge DNS', 'Port publish syntax', 'Container to container vs host access'],
    commonQuestions: ['How containers communicate?', '-p flag meaning?'],
    followUps: ['Default vs user-defined bridge?', 'K8s Service vs Docker network?'],
    misconceptions: ['EXPOSE in Dockerfile publishes ports', 'Containers always on host network'],
    traps: ['Link deprecated — use custom networks'],
    strongSignals: ['Service name DNS in Compose', 'Internal vs published ports', 'VPC for prod'],
  },
  keyTakeaways: [
    'User-defined bridge enables DNS between containers.',
    '-p host:container publishes to host.',
    'Same network: use service name and internal port.',
    'Default bridge lacks automatic DNS — avoid for multi-container.',
    'Production uses VPC/security groups; Docker networking is dev/CI.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'How two containers talk in Compose?', answerHint: 'Same network; hostname = service name; internal port.' },
    { level: 'intermediate', question: 'docker run -p 8080:8080 meaning?', answerHint: 'Map host port 8080 to container port 8080.' },
    { level: 'advanced', question: 'Default bridge DNS limitation?', answerHint: 'No automatic name resolution; use user-defined network.' },
  ],
  flashcards: [
    { front: 'User-defined bridge', back: 'Custom network with embedded DNS for container names' },
    { front: 'Port publish', back: 'Host port forwarded to container port via iptables/NAT' },
    { front: '127.0.0.11', back: 'Embedded DNS resolver inside container' },
  ],
  quickRevision: [
    'Custom bridge DNS',
    '-p host:container',
    'Internal ports private',
    'Compose default network',
    'VPC in prod',
  ],
}
