import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Amazon ECS (Elastic Container Service) runs Docker containers on AWS — EC2 launch type manages your instances or Fargate is serverless containers without managing hosts. Task definitions specify image, CPU/memory, env; services maintain desired task count with ALB integration and auto scaling.',
  whyExists:
    'Package app as container once; ECS schedules across cluster with health checks, rolling deploys, and IAM task roles. Alternative to self-managed Kubernetes when AWS-native orchestration suffices — pairs with ECR images and CodeDeploy blue/green.',
  mentalModel:
    'Cluster holds services; service keeps N copies of task (container group) running. Task definition is recipe; service ensures count. Fargate = AWS runs the VM; EC2 = you patch the host fleet.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Concept', 'Role'],
      rows: [
        ['Cluster', 'Logical grouping of capacity'],
        ['Task definition', 'JSON: container image, ports, env, secrets from SM'],
        ['Task', 'Running instance of definition'],
        ['Service', 'Maintains desired count; load balancer registration'],
        ['Fargate', 'Serverless — pay per task CPU/memory'],
        ['EC2 launch', 'You manage Auto Scaling Group of container instances'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'ECS service behind ALB',
      diagram: `flowchart TB
  ALB --> TG[Target Group]
  TG --> T1[Task 1 container :8080]
  TG --> T2[Task 2 container :8080]
  ECS[ECS Service desired=2] --> T1
  ECS --> T2
  ECR[ECR image] --> ECS`,
    },
    {
      type: 'list',
      items: [
        'awsvpc network mode: each task gets ENI — security group per task.',
        'Task IAM role grants S3/SQS access without static keys in container.',
        'Secrets from Secrets Manager injected as env at task start.',
        'Circuit breaker rollback failed deployments automatically.',
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Spring Boot JAR in Docker pushed to ECR. Fargate task definition: 0.5 vCPU, 1GB, port 8080, env SPRING_PROFILES_ACTIVE=prod, secrets DB URL from Secrets Manager. ECS service desired 3 behind ALB /health. Target tracking scale on CPU 70%.',
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'ECS agent on EC2 registers capacity; Fargate abstracts agent.',
        'Service discovery via Cloud Map for internal DNS service mesh lite.',
        'Capacity providers link ASG or Fargate weight strategies.',
        'Execute command ECS Exec for debug shell into running task.',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['AWS-native simpler than K8s for many teams', 'Fargate no host ops', 'Deep ALB/IAM integration'],
    disadvantages: ['Less portable than Kubernetes', 'Fargate cost at steady high utilization', 'EC2 launch type host patching burden'],
    alternatives: ['EKS Kubernetes', 'Elastic Beanstalk', 'Lambda for small workloads'],
    whenToUse: ['Containerized microservices on AWS', 'Steady HTTP services with ALB'],
    whenNotToUse: ['Multi-cloud K8s requirement', 'Extreme batch per-second scale Lambda better'],
  },
  failureModes: [
    'Task fails health check loop — deploy stuck',
    'Insufficient Fargate capacity in AZ — tasks pending',
    'Wrong task role — S3 access denied at runtime',
    'Memory limit OOM kill Spring Boot',
    'Bridge mode port conflicts on EC2 launch',
  ],
  production: {
    reliability: ['ALB health check /actuator/health', 'Deployment circuit breaker', 'Multi-AZ tasks'],
    scalability: ['Target tracking on CPU/RPS custom metric', 'Min healthy 100% rolling'],
    security: ['Task role least privilege', 'Private subnets + NAT egress'],
    observability: ['CloudWatch logs driver awslogs', 'Container Insights metrics'],
    cost: ['Fargate vs EC2 breakeven analysis', 'Right-size CPU memory from profiling'],
  },
  interview: {
    expectations: ['Task vs service', 'Fargate vs EC2', 'ALB integration', 'Task IAM role'],
    commonQuestions: ['Run Docker on AWS?', 'ECS vs EKS?'],
    followUps: ['Secrets injection?', 'Rolling deploy strategy?'],
    misconceptions: ['ECS is same as EC2', 'Fargate always cheaper'],
    traps: ['Public IP tasks without need'],
    strongSignals: ['Task definition + service desired count', 'awsvpc', 'Circuit breaker rollback'],
  },
  keyTakeaways: [
    'ECS orchestrates Docker tasks on Fargate or EC2.',
    'Service maintains desired task count with health checks.',
    'Task IAM role for AWS API access from container.',
    'ALB target group registers task IPs awsvpc mode.',
    'Fargate removes host management; EC2 more control.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'ECS task vs service?', answerHint: 'Task = running containers instance; service = keeps N tasks running with load balancer.' },
    { level: 'intermediate', question: 'Fargate vs EC2 launch type?', answerHint: 'Fargate serverless no host mgmt; EC2 you manage container instances ASG.' },
    { level: 'advanced', question: 'Grant S3 access to container?', answerHint: 'Task IAM role in task definition — not access keys in env.' },
  ],
  flashcards: [
    { front: 'Task definition', back: 'Blueprint: image, CPU, memory, ports, env, roles' },
    { front: 'Fargate', back: 'Serverless ECS — no EC2 host to manage' },
    { front: 'awsvpc', back: 'Each task gets own ENI and security group' },
    { front: 'Desired count', back: 'Service target number of running tasks' },
  ],
  quickRevision: ['Cluster/service/task', 'Fargate serverless', 'Task IAM role', 'ALB + health check', 'ECR images'],
}
