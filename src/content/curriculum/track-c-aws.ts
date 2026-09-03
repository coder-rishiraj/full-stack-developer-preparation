import type { Priority } from '@/domain/types'
import type { SectionSeed, TopicSeed } from './build'

const AWS = ['aws'] as const
const M78 = [7, 8]
const M89 = [8, 9]
const M1012 = [10, 12]

function item(
  id: string,
  title: string,
  priority: Priority = 'tier1',
  extra: Partial<TopicSeed> = {},
): TopicSeed {
  const { tags, executionPriority, months, ...rest } = extra
  const defaultMonths =
    priority === 'tier1' ? M78 : priority === 'tier2' ? M89 : M1012
  return {
    id,
    title,
    priority,
    months: months ?? defaultMonths,
    tags: [...AWS, ...(tags ?? [])],
    executionPriority:
      executionPriority ?? (priority === 'tier1' ? 'p0' : priority === 'tier2' ? 'p1' : 'later'),
    ...rest,
  }
}

function nest(
  parent: string,
  id: string,
  title: string,
  priority: Priority = 'tier1',
  extra: Partial<TopicSeed> = {},
): TopicSeed {
  return item(id, title, priority, {
    ...extra,
    curriculumLevel: 'nested-concept',
    parentTopicId: parent,
  })
}

function section(id: string, title: string, order: number, topics: TopicSeed[]): SectionSeed {
  return {
    id,
    track: 'C',
    title,
    order,
    defaultKind: 'theory',
    defaultDepth: 'deep',
    topics,
  }
}

/**
 * C15.1–C15.16 — AWS / Cloud for 5-year full-stack interview prep.
 * Shape follows AWS getting-started / Cloud Practitioner tutorial maps
 * (IAM → compute → storage → VPC → databases → messaging → monitoring →
 * cost/governance) — shape only, not copied prose. Docker/ECS depth also
 * lives in C14; app security architecture in C9; observability tooling in C16.
 * Existing C15 topic IDs remain stable; EKS raised to tier2 for interview parity.
 *
 * @see https://aws.amazon.com/getting-started/
 * @see https://www.w3schools.com/aws/
 */
export const TRACK_C_AWS_SECTIONS: SectionSeed[] = [
  section('C15.1', 'Cloud Foundations & Global Infrastructure', 226, [
    item('c15-cloud-foundations', 'Cloud Foundations & AWS'),
    nest('c15-cloud-foundations', 'c15-what-is-cloud', 'What Is Cloud Computing'),
    nest('c15-cloud-foundations', 'c15-what-is-aws', 'What Is AWS'),
    nest('c15-cloud-foundations', 'c15-regions-azs-edge', 'Regions, Availability Zones & Edge Locations'),
    nest('c15-cloud-foundations', 'c15-shared-responsibility', 'Shared Responsibility Model'),
    nest('c15-cloud-foundations', 'c15-console-cli-access', 'Management Console & AWS CLI'),
    nest('c15-cloud-foundations', 'c15-free-tier-basics', 'Free Tier & Account Setup Basics', 'tier2'),
  ]),

  section('C15.2', 'IAM & Account Security', 227, [
    item('c15-iam', 'IAM'),
    nest('c15-iam', 'c15-iam-users-groups-roles', 'Users, Groups & Roles'),
    nest('c15-iam', 'c15-iam-policies-least-privilege', 'Policies & Least Privilege'),
    nest('c15-iam', 'c15-iam-instance-profiles', 'Instance Profiles & Roles for EC2'),
    nest('c15-iam', 'c15-iam-mfa', 'MFA for Root & Privileged Users'),
    nest('c15-iam', 'c15-iam-federation-saml', 'Federation & SAML Overview', 'tier2'),
    nest('c15-iam', 'c15-iam-deny-patterns', 'Explicit Deny & Guardrail Policies', 'tier2'),
  ]),

  section('C15.3', 'Secrets Manager & Credential Hygiene', 228, [
    item('c15-secrets-manager', 'Secrets Manager', 'tier2', {
      related: ['c9-secrets', 'c14-devsecops'],
    }),
    nest('c15-secrets-manager', 'c15-secrets-runtime-inject', 'Runtime Secret Injection', 'tier2'),
    nest('c15-secrets-manager', 'c15-secrets-rotation', 'Secret Rotation', 'tier2'),
    nest('c15-secrets-manager', 'c15-secrets-vs-param-store', 'Secrets Manager vs Parameter Store', 'tier2'),
    nest('c15-secrets-manager', 'c15-no-secrets-in-ami', 'No Secrets in AMIs, Images or User Data', 'tier2'),
  ]),

  section('C15.4', 'EC2 Compute', 229, [
    item('c15-ec2', 'EC2'),
    nest('c15-ec2', 'c15-ec2-launch-manage', 'Launching & Managing Instances'),
    nest('c15-ec2', 'c15-ec2-instance-types', 'Instance Types & Families'),
    nest('c15-ec2', 'c15-ec2-pricing-models', 'On-Demand, Reserved & Spot Pricing'),
    nest('c15-ec2', 'c15-ec2-ami', 'AMIs & Golden Images'),
    nest('c15-ec2', 'c15-ec2-connect-ssh', 'Connecting to Linux/Windows Instances'),
    nest('c15-ec2', 'c15-ec2-user-data-imds', 'User Data & IMDSv2', 'tier2'),
    nest('c15-ec2', 'c15-elastic-beanstalk', 'Elastic Beanstalk Overview', 'tier2'),
  ]),

  section('C15.5', 'Lambda & Serverless', 230, [
    item('c15-lambda', 'Lambda', 'tier2'),
    nest('c15-lambda', 'c15-lambda-event-sources', 'Event Sources (S3, API Gateway, SQS)', 'tier2'),
    nest('c15-lambda', 'c15-lambda-create-deploy', 'Creating & Deploying Functions', 'tier2'),
    nest('c15-lambda', 'c15-lambda-limits-cold-start', 'Timeouts, Memory & Cold Starts', 'tier2'),
    nest('c15-lambda', 'c15-lambda-iam-permissions', 'Execution Roles & Least Privilege', 'tier2'),
    nest('c15-lambda', 'c15-api-gateway-basics', 'API Gateway Basics', 'tier2'),
  ]),

  section('C15.6', 'Containers: ECS, EKS & ECR', 231, [
    item('c15-ecs', 'ECS', 'tier2', { related: ['c14-ecs', 'c14-containers'] }),
    nest('c15-ecs', 'c15-ecs-tasks-services', 'Tasks, Services & Task Definitions', 'tier2'),
    nest('c15-ecs', 'c15-ecr-registry', 'ECR Image Registry', 'tier2', { related: ['c14-docker-images'] }),
    nest('c15-ecs', 'c15-fargate-vs-ec2-launch', 'Fargate vs EC2 Launch Type', 'tier2'),
    item('c15-eks', 'EKS', 'tier2', { related: ['c14-kubernetes'] }),
    nest('c15-eks', 'c15-eks-vs-ecs', 'EKS vs ECS Trade-offs', 'tier2'),
    nest('c15-eks', 'c15-eks-control-plane', 'Managed Control Plane Basics', 'tier2'),
  ]),

  section('C15.7', 'S3 Object Storage', 232, [
    item('c15-s3', 'S3'),
    nest('c15-s3', 'c15-s3-buckets-objects', 'Buckets, Objects & Keys'),
    nest('c15-s3', 'c15-s3-storage-classes', 'Storage Classes'),
    nest('c15-s3', 'c15-s3-lifecycle', 'Lifecycle Rules'),
    nest('c15-s3', 'c15-s3-security', 'Bucket Policies, Block Public Access & Encryption'),
    nest('c15-s3', 'c15-s3-static-hosting', 'Static Website & Asset Hosting', 'tier2'),
  ]),

  section('C15.8', 'EBS, EFS & Storage Comparison', 233, [
    item('c15-ebs-efs', 'EBS, EFS & Storage Choices'),
    nest('c15-ebs-efs', 'c15-ebs-volumes', 'EBS Volumes, Attach & Snapshots'),
    nest('c15-ebs-efs', 'c15-efs-shared', 'EFS Shared File Storage'),
    nest('c15-ebs-efs', 'c15-ebs-vs-efs-vs-s3', 'EBS vs EFS vs S3'),
    nest('c15-ebs-efs', 'c15-glacier-backup', 'Glacier & Backup / DR Overview', 'tier2'),
    nest('c15-ebs-efs', 'c15-storage-gateway-snow', 'Storage Gateway & Snow Family Overview', 'tier3'),
  ]),

  section('C15.9', 'VPC Networking & Security', 234, [
    item('c15-vpc', 'VPC Fundamentals'),
    nest('c15-vpc', 'c15-vpc-subnets-routing', 'Subnets, Route Tables & Internet/NAT Gateways'),
    nest('c15-vpc', 'c15-security-groups', 'Security Groups'),
    nest('c15-vpc', 'c15-nacls', 'NACLs vs Security Groups'),
    nest('c15-vpc', 'c15-vpc-peering-endpoints', 'VPC Peering & Gateway/Interface Endpoints', 'tier2'),
    nest('c15-vpc', 'c15-bastion-host', 'Bastion Hosts & Private Access Patterns', 'tier2'),
  ]),

  section('C15.10', 'Load Balancing & Auto Scaling', 235, [
    item('c15-load-balancers', 'Load Balancers (AWS)'),
    nest('c15-load-balancers', 'c15-alb-nlb-clb', 'ALB vs NLB vs Classic'),
    nest('c15-load-balancers', 'c15-lb-health-checks', 'Target Groups & Health Checks'),
    nest('c15-load-balancers', 'c15-lb-tls-listeners', 'Listeners, TLS & Path Routing', 'tier2'),
    item('c15-auto-scaling', 'Auto Scaling'),
    nest('c15-auto-scaling', 'c15-asg-policies', 'ASG Scaling Policies'),
    nest('c15-auto-scaling', 'c15-asg-health-replacement', 'Health-Based Instance Replacement'),
  ]),

  section('C15.11', 'Route 53 & CloudFront', 236, [
    item('c15-route53', 'Route 53', 'tier2'),
    nest('c15-route53', 'c15-route53-records-routing', 'Records & Routing Policies', 'tier2'),
    nest('c15-route53', 'c15-route53-health-failover', 'Health Checks & DNS Failover', 'tier2'),
    item('c15-cloudfront', 'CloudFront', 'tier2'),
    nest('c15-cloudfront', 'c15-cloudfront-cdn-basics', 'CDN Caching & Origins', 'tier2'),
    nest('c15-cloudfront', 'c15-cloudfront-https-oai', 'HTTPS, OAI/OAC & Static Assets', 'tier2'),
  ]),

  section('C15.12', 'RDS & Aurora', 237, [
    item('c15-rds', 'RDS', 'tier1', { related: ['c7-transactions'] }),
    nest('c15-rds', 'c15-rds-engines-create', 'Engines, Create & Connectivity'),
    nest('c15-rds', 'c15-rds-multi-az-read-replicas', 'Multi-AZ & Read Replicas'),
    nest('c15-rds', 'c15-rds-backups', 'Automated Backups & Snapshots'),
    nest('c15-rds', 'c15-aurora-overview', 'Aurora Overview'),
    nest('c15-rds', 'c15-rds-vs-aurora', 'RDS vs Aurora'),
  ]),

  section('C15.13', 'DynamoDB & Managed Data Stores', 238, [
    item('c15-dynamodb', 'DynamoDB', 'tier2', { related: ['d5-sql-vs-nosql'] }),
    nest('c15-dynamodb', 'c15-dynamodb-tables-keys', 'Tables, Partition & Sort Keys', 'tier2'),
    nest('c15-dynamodb', 'c15-dynamodb-capacity', 'On-Demand vs Provisioned Capacity', 'tier2'),
    nest('c15-dynamodb', 'c15-dynamodb-streams-lambda', 'Streams & Lambda Integration', 'tier2'),
    nest('c15-dynamodb', 'c15-elasticache-overview', 'ElastiCache Overview', 'tier2', {
      related: ['c10-redis-foundations'],
    }),
    nest('c15-dynamodb', 'c15-redshift-overview', 'Redshift Overview', 'tier3'),
  ]),

  section('C15.14', 'SQS, SNS & Application Integration', 239, [
    item('c15-sqs', 'SQS', 'tier2', { related: ['c11-kafka-foundations'] }),
    nest('c15-sqs', 'c15-sqs-standard-vs-fifo', 'Standard vs FIFO Queues', 'tier2'),
    nest('c15-sqs', 'c15-sqs-visibility-dlq', 'Visibility Timeout & DLQ', 'tier2'),
    item('c15-sns', 'SNS', 'tier2'),
    nest('c15-sns', 'c15-sns-topics-subscriptions', 'Topics & Subscriptions', 'tier2'),
    nest('c15-sns', 'c15-sns-sqs-fanout', 'SNS → SQS Fan-out Pattern', 'tier2'),
    nest('c15-sns', 'c15-eventbridge-kinesis', 'EventBridge & Kinesis Overview', 'tier3'),
  ]),

  section('C15.15', 'CloudWatch, CloudTrail & Operations', 240, [
    item('c15-cloudwatch', 'CloudWatch', 'tier1', {
      related: ['c16-metrics', 'c16-structured-logging'],
    }),
    nest('c15-cloudwatch', 'c15-cloudwatch-metrics-alarms', 'Metrics, Alarms & Dashboards'),
    nest('c15-cloudwatch', 'c15-cloudwatch-logs', 'CloudWatch Logs'),
    nest('c15-cloudwatch', 'c15-cloudtrail', 'CloudTrail vs CloudWatch'),
    nest('c15-cloudwatch', 'c15-cloudwatch-synthetics', 'Synthetics & Canaries', 'tier2'),
    nest('c15-cloudwatch', 'c15-trusted-advisor-health', 'Trusted Advisor & AWS Health Overview', 'tier2'),
  ]),

  section('C15.16', 'Cost, IaC & Well-Architected', 241, [
    item('c15-cost-governance', 'Cost, IaC & Well-Architected', 'tier2', {
      related: ['c14-iac'],
    }),
    nest('c15-cost-governance', 'c15-cost-explorer-budgets', 'Cost Explorer, Budgets & Billing Alarms', 'tier2'),
    nest('c15-cost-governance', 'c15-cloudformation', 'CloudFormation Overview', 'tier2', {
      related: ['c14-iac'],
    }),
    nest('c15-cost-governance', 'c15-well-architected', 'Well-Architected Framework Pillars', 'tier2'),
    nest('c15-cost-governance', 'c15-organizations-governance', 'Organizations & Account Governance Basics', 'tier2'),
    nest('c15-cost-governance', 'c15-migration-overview', 'Migration Strategies Overview', 'tier3'),
  ]),
]
