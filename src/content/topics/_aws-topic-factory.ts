import type { TopicContent } from '@/domain/types'

type AwsTopicInput = {
  title: string
  sectionTitle: string
  parentTitle?: string
}

const SECTION_FOCUS: Record<string, string> = {
  'Cloud Foundations & Global Infrastructure':
    'cloud vs on-prem, Regions/AZs/edge, shared responsibility, and Console/CLI access patterns',
  'IAM & Account Security':
    'users/roles/policies, least privilege, MFA, instance profiles, and federation basics',
  'Secrets Manager & Credential Hygiene':
    'runtime secret inject, rotation, Parameter Store contrast, and never baking secrets into AMIs',
  'EC2 Compute':
    'instance types, AMIs, pricing models, SSH/SSM access, user data/IMDSv2, and Beanstalk overview',
  'Lambda & Serverless':
    'event sources, deploy model, cold starts/limits, execution roles, and API Gateway basics',
  'Containers: ECS, EKS & ECR':
    'task definitions/services, ECR, Fargate vs EC2 launch, and EKS vs ECS trade-offs',
  'S3 Object Storage':
    'buckets/keys, storage classes, lifecycle, encryption/public-access blocks, and static hosting',
  'EBS, EFS & Storage Comparison':
    'block vs file vs object, snapshots, Glacier/backup overview, and choosing the right store',
  'VPC Networking & Security':
    'subnets/routing, security groups vs NACLs, endpoints/peering, and bastion/private access',
  'Load Balancing & Auto Scaling':
    'ALB/NLB, health checks, TLS/path routing, and ASG policies with unhealthy replacement',
  'Route 53 & CloudFront':
    'DNS routing/failover, CDN caching, HTTPS, and origin access to S3',
  'RDS & Aurora':
    'engines, Multi-AZ/replicas, backups, and when Aurora’s shared storage model wins',
  'DynamoDB & Managed Data Stores':
    'keys/capacity modes, streams+Lambda, ElastiCache overview, and SQL vs NoSQL choice',
  'SQS, SNS & Application Integration':
    'queue semantics, visibility/DLQ, pub/sub fan-out, and EventBridge/Kinesis overview',
  'CloudWatch, CloudTrail & Operations':
    'metrics/alarms/logs, CloudTrail audit contrast, synthetics, and health/Trusted Advisor signals',
  'Cost, IaC & Well-Architected':
    'budgets/Cost Explorer, CloudFormation, Well-Architected pillars, and multi-account basics',
}

export function createAwsTopicContent({
  title,
  sectionTitle,
  parentTitle,
}: AwsTopicInput): TopicContent {
  const focus =
    SECTION_FOCUS[sectionTitle] ??
    'AWS service choice, failure modes, cost, and production trade-offs'
  const parent = parentTitle ? ` It is an atomic part of ${parentTitle}.` : ''

  return {
    whatIsIt:
      `${title} is an AWS/cloud topic in ${sectionTitle}.${parent} ` +
      'At five years of experience, explain the architecture placement, blast radius, IAM boundary, and cost/ops trade-off — not only the console happy path.',
    whyExists:
      `${title} exists because teams need elastic, globally distributed infrastructure without owning data centers. ` +
      `A strong answer covers ${focus}.`,
    mentalModel:
      'Region → AZ → VPC/subnet → service endpoint. Attach identity (IAM role), network path (SG/NACL/route), data plane (compute/storage/db/queue), and observe with metrics/logs/trails. ' +
      'Always ask: who can call it, what fails when an AZ dies, and what it costs when traffic spikes.',
    howItWorks: [
      {
        type: 'list',
        ordered: true,
        items: [
          `Place ${title} on a typical request path: edge → load balancer → compute → data store/queue.`,
          'Name the trust boundary: IAM principal, security group, encryption, and account/org guardrails.',
          'State durability/availability expectations (AZ, Multi-AZ, replication, or object durability class).',
          'State the scaling and cost model (instance hours, request pricing, provisioned capacity, or CDN egress).',
          'State the ops signal: CloudWatch metric/alarm, CloudTrail event, or budget alert.',
        ],
      },
      {
        type: 'callout',
        variant: 'note',
        title: 'Track boundary',
        text:
          'C15 owns AWS product mechanics and cloud architecture choices. C14 owns Docker/DevOps delivery; C9 owns application security architecture; ' +
          'C16 owns deep observability tooling; Track D owns distributed-systems theory beyond a single cloud vendor.',
      },
    ],
    internals: [
      {
        type: 'list',
        items: [
          'AWS regions contain multiple AZs; design for AZ failure unless the service is inherently regional.',
          'IAM evaluates identity + resource policies; prefer roles over long-lived access keys on EC2/Lambda/ECS tasks.',
          'VPC networking separates public/private subnets; security groups are stateful allow-lists attached to ENIs.',
          'Managed data services (RDS/Aurora/DynamoDB/S3) trade control for operational leverage — know backup, failover, and consistency models.',
          'Well-Architected thinking: operational excellence, security, reliability, performance efficiency, cost optimization, and sustainability.',
        ],
      },
    ],
    failureModes: [
      `Using ${title} without an IAM least-privilege story or with long-lived keys in code.`,
      'Single-AZ production for stateful workloads, or public S3 buckets without Block Public Access.',
      'Confusing security groups with NACLs, or assuming Lambda has no VPC/cold-start constraints.',
      'No alarms/budgets — silent outages or surprise bills after a traffic spike.',
      'Choosing EKS when ECS/Fargate (or vice versa) would better match team ops maturity.',
    ],
    production: {
      reliability: [
        'Spread critical workloads across AZs; use Multi-AZ databases and health-checked load balancers.',
        'Define backup/restore and failover runbooks before you need them.',
      ],
      performance: [
        'Right-size instance/Lambda memory; put static assets on CloudFront; keep chatty services in the same AZ/VPC path when latency matters.',
      ],
      maintainability: [
        'Prefer IaC (CloudFormation/Terraform) over click-ops; tag resources for ownership and cost allocation.',
      ],
      observability: [
        'Alarm on user symptoms (5xx, latency, queue depth, error rate) and keep CloudTrail enabled for audit.',
      ],
      security: [
        'MFA on privileged users, instance/task roles, encrypt data at rest, and rotate secrets automatically.',
      ],
      cost: [
        'Use budgets/anomaly detection; prefer Spot for interruptible work; lifecycle cold data in S3; turn off idle non-prod.',
      ],
    },
    interview: {
      expectations: [
        `Define ${title} in ${sectionTitle} and place it in a VPC + IAM architecture.`,
        'Compare at least one alternative AWS service for the same job.',
        'Name one production control: Multi-AZ, SG rule, alarm, budget, or least-privilege role.',
      ],
      commonQuestions: [
        `When would you use ${title} on AWS?`,
        'How do you secure access and network paths?',
        'What happens if an Availability Zone fails?',
      ],
      followUps: [
        'How would you estimate cost at 10× traffic?',
        'ECS/Fargate vs EKS for this workload?',
      ],
      misconceptions: [
        'Public subnet means the instance is reachable without a route/IGW/SG allow.',
        'S3 is a filesystem drop-in for EBS/EFS.',
        'CloudWatch and CloudTrail are the same thing.',
      ],
      traps: [
        'Listing service names without IAM, AZ, or cost trade-offs.',
        'Designing everything serverless without discussing cold starts, timeouts, or idempotency.',
      ],
      strongSignals: [
        'Draws Region/AZ/VPC and ties services to failure domains and blast radius.',
        'Connects IAM roles, encryption, alarms, and Well-Architected trade-offs into one design.',
      ],
    },
    keyTakeaways: [
      `${title} belongs to ${sectionTitle}.`,
      `Focus: ${focus}.`,
      'Identity + network + data plane + observe/cost — design all four.',
    ],
    interviewQuestions: [
      {
        level: 'basic',
        question: `What is ${title}, and where does it sit in an AWS architecture?`,
        answerHint: `Place it in ${sectionTitle}; mention Region/AZ or request path as applicable.`,
      },
      {
        level: 'intermediate',
        question: `Which reliability, security, or cost trade-offs matter for ${title}?`,
        answerHint: 'Discuss Multi-AZ, IAM, encryption, scaling model, or alternatives.',
      },
      {
        level: 'advanced',
        question: `How would you operate ${title} in production under AZ failure and traffic spikes?`,
        answerHint: `Use ${focus} plus alarms, failover, and cost controls.`,
      },
    ],
    flashcards: [
      { front: title, back: `${sectionTitle}: ${focus}.` },
      {
        front: `${title} review loop`,
        back: 'Place in VPC → IAM boundary → failure domain → cost/ops signal.',
      },
    ],
    quickRevision: [
      `${title} — ${sectionTitle}`,
      `Focus: ${focus}`,
      'Regions/AZs + IAM + VPC path',
      'Design for failure, cost, and least privilege',
    ],
  }
}
