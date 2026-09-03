import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Amazon EC2 (Elastic Compute Cloud) provides resizable virtual machines in AWS: instance types (CPU/memory/GPU), AMIs, EBS volumes, security groups, key pairs, and placement across Availability Zones. Foundation for running JVM apps, workers, and bastion hosts before containers.',
  whyExists:
    'Cloud VMs replace buying hardware. Scale capacity in minutes, pay per hour/second, choose AZ for HA. EC2 pairs with ALB, Auto Scaling, and RDS for classic three-tier architectures and Kubernetes worker nodes (EKS).',
  mentalModel:
    'Rent a computer in an AWS datacenter. Pick size (t3.medium), OS image (AMI), disk (EBS), firewall (security group), and which building wing (AZ). Stop/start or terminate when done.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Concept', 'Purpose'],
      rows: [
        ['Instance type', 't3 burstable, m6i general, c7 compute, r7 memory'],
        ['AMI', 'Boot disk template — Amazon Linux, Ubuntu, custom golden'],
        ['EBS volume', 'Persistent disk attached to instance'],
        ['Security group', 'Stateful firewall — allow 443 from ALB SG'],
        ['Key pair', 'SSH access to Linux instance'],
        ['User data', 'Cloud-init script on first boot'],
        ['IMDSv2', 'Instance metadata — roles for AWS API access'],
      ],
    },
    {
      type: 'list',
      items: [
        'Launch in VPC subnet — public subnet + EIP for direct internet or private + NAT.',
        'Instance profile attaches IAM role — app gets temp credentials via IMDS.',
        'AMIs are golden templates (OS + software) for consistent, repeatable launches.',
        'Pricing models: On-Demand, Reserved/Savings Plans, and Spot for interruptible work.',
        'Placement group cluster for HPC; spread for HA across hardware.',
        'Spot instances cheap interruptible capacity for batch jobs.',
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Spring Boot on t3.small in private subnet. Security group allows 8080 from ALB security group only. Instance profile grants s3:GetObject on app bucket. ALB health check /actuator/health routes traffic.',
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Nitro hypervisor: network and EBS offloaded for better performance.',
        'Credit-based t3 bursts CPU until credits exhaust then throttles.',
        'EBS gp3 decouples IOPS from size; io2 for high IOPS DB.',
        'NVIDIA instances for ML; Graviton arm64 for cost/perf Java with Corretto.',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Full OS control', 'Any software stack', 'Predictable for legacy JVM monoliths'],
    disadvantages: ['You patch OS and JVM', 'Slower scale than Fargate/Lambda', 'Capacity planning for types'],
    alternatives: ['ECS Fargate', 'EKS', 'Elastic Beanstalk', 'Lambda for event-driven'],
    whenToUse: ['Stateful apps needing local disk', 'Bastion/jump host', 'EKS worker nodes', 'GPU workloads'],
    whenNotToUse: ['Simple HTTP API with no OS needs — prefer containers/serverless'],
  },
  failureModes: [
    'Single AZ instance — AZ outage takes service down',
    'Security group too open — SSH from 0.0.0.0/0',
    'IMDSv1 SSRF credential theft',
    'Disk full on root EBS — instance unhealthy',
    'Wrong instance type — OOM or CPU throttle',
  ],
  production: {
    reliability: ['Multi-AZ ASG', 'ALB health checks', 'Automated AMI patching via SSM'],
    security: ['IMDSv2 required', 'No SSH — SSM Session Manager', 'Least privilege SG'],
    cost: ['Right-size with Compute Optimizer', 'Spot for fault-tolerant batch', 'Stop dev instances nights'],
    observability: ['CloudWatch agent for disk/mem', 'Detailed monitoring 1-min metrics'],
  },
  interview: {
    expectations: ['EC2 vs Lambda/Fargate', 'Security group basics', 'Multi-AZ HA'],
    commonQuestions: ['Design HA web app on AWS?', 'What is security group?'],
    followUps: ['Spot vs On-Demand?', 'Instance metadata role?'],
    misconceptions: ['EC2 always cheaper than serverless', 'Public IP required for outbound internet'],
    traps: ['Single instance production'],
    strongSignals: ['Private subnet + ALB + ASG', 'Instance profile not hard-coded keys', 'IMDSv2'],
  },
  keyTakeaways: [
    'EC2 = virtual servers in VPC AZs.',
    'Security groups are instance firewall; stateful allow rules.',
    'EBS for persistent disk; instance store ephemeral.',
    'IAM instance profile — no access keys on disk.',
    'Multi-AZ ASG + ALB for HA web tier.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Security group vs NACL?', answerHint: 'SG: stateful instance firewall; NACL: stateless subnet border.' },
    { level: 'intermediate', question: 'EC2 internet without public IP?', answerHint: 'Private subnet + NAT Gateway for outbound; inbound via ALB.' },
    { level: 'advanced', question: 'IMDSv2 why?', answerHint: 'Session-oriented metadata access prevents SSRF stealing IAM role creds.' },
  ],
  flashcards: [
    { front: 'AMI', back: 'Amazon Machine Image — EC2 boot template' },
    { front: 'Security group', back: 'Stateful virtual firewall for EC2 ENI' },
    { front: 'Instance profile', back: 'Links IAM role to EC2 for AWS API credentials' },
  ],
  quickRevision: [
    'VPC subnet AZ',
    'Security groups',
    'EBS persistent',
    'Instance profile IAM',
    'ASG multi-AZ',
  ],
}
