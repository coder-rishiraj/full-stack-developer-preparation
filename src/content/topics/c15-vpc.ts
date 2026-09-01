import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Amazon VPC (Virtual Private Cloud) is your isolated network in AWS: CIDR block, subnets per AZ, route tables, internet gateway, NAT gateway, security groups, and NACLs. Every EC2, RDS, and Lambda (VPC-attached) lives inside a VPC.',
  whyExists:
    'Public cloud multi-tenant — you need private network boundaries, IP planning, and controlled internet access. VPC segments tiers: public subnets for ALB, private for app/DB, no direct inbound to database.',
  mentalModel:
    'Your datacenter rack in AWS. VPC is the building; subnets are floors in different wings (AZs); route tables are signage; IGW is front door to internet; NAT is back door for private floors to go out.',
  howItWorks: [
    {
      type: 'mermaid',
      caption: 'Typical three-tier VPC',
      diagram: `flowchart TB
  IGW[Internet Gateway]
  subgraph vpc [VPC 10.0.0.0/16]
    subgraph pub [Public subnet AZ-a]
      ALB[ALB]
      NAT[NAT Gateway]
    end
    subgraph priv [Private subnet AZ-a]
      App[EC2 / ECS]
    end
    subgraph db [DB subnet AZ-a]
      RDS[(RDS)]
    end
  end
  Internet --> IGW --> ALB
  App --> NAT --> IGW
  ALB --> App
  App --> RDS`,
    },
    {
      type: 'list',
      items: [
        'Public subnet: route 0.0.0.0/0 → IGW; resources can have public IP.',
        'Private subnet: default route 0.0.0.0/0 → NAT in public subnet.',
        'Security group: allow app SG from ALB SG on 8080.',
        'VPC endpoints (S3, DynamoDB gateway) avoid NAT cost for AWS APIs.',
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'VPC 10.0.0.0/16 with /24 subnets per AZ. ALB in public 10.0.1.0/24. ECS tasks in private 10.0.10.0/24. RDS in isolated DB subnets — no internet route. S3 access via gateway endpoint.',
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'ENI (elastic network interface) attaches IP/MAC/SG to instance.',
        'NACL stateless rules evaluated in order — explicit deny/allow.',
        'Peering and Transit Gateway connect VPCs and on-prem.',
        'Flow logs capture accepted/rejected traffic to S3/CloudWatch.',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Network isolation', 'Fine-grained tier segmentation', 'Hybrid cloud via VPN/Direct Connect'],
    disadvantages: ['NAT Gateway cost and AZ dependency', 'CIDR planning mistakes hard to fix', 'Complexity for small projects'],
    alternatives: ['Default VPC for learning only', 'Shared VPC for enterprise'],
    whenToUse: ['Every production AWS deployment', 'Regulatory network segmentation'],
    whenNotToUse: ['Public-only Lambda with no VPC attach — simpler'],
  },
  failureModes: [
    'RDS in public subnet with open SG',
    'Single NAT — AZ outage blocks private outbound',
    'Overlapping CIDR breaks peering',
    'NACL deny ephemeral return traffic breaks responses',
    'No VPC endpoints — all S3 via costly NAT',
  ],
  production: {
    reliability: ['NAT per AZ', 'Multi-AZ subnets for each tier'],
    security: ['Private DB subnets', 'SG least privilege', 'Flow logs enabled'],
    cost: ['S3/DynamoDB gateway endpoints', 'Right-size NAT instances vs GW'],
    observability: ['VPC Flow Logs for anomaly detection'],
  },
  interview: {
    expectations: ['Public vs private subnet', 'IGW vs NAT', 'SG vs NACL'],
    commonQuestions: ['Design VPC for web app?', 'How private EC2 reaches internet?'],
    followUps: ['VPC endpoints?', 'Multi-AZ NAT?'],
    misconceptions: ['Private subnet means no internet ever', 'Same SG for all tiers OK'],
    traps: ['Database with public IP'],
    strongSignals: ['Three-tier diagram', 'NAT per AZ', 'Endpoint for S3'],
  },
  keyTakeaways: [
    'VPC = isolated network; subnets per AZ.',
    'Public: IGW route; private: NAT for outbound.',
    'SG stateful on instance; NACL stateless on subnet.',
    'DB tier private — no direct internet.',
    'VPC endpoints reduce NAT traffic to AWS services.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Public vs private subnet?', answerHint: 'Public has route to IGW; private uses NAT for outbound only.' },
    { level: 'intermediate', question: 'Security group vs NACL?', answerHint: 'SG stateful instance level; NACL stateless subnet both directions.' },
    { level: 'advanced', question: 'Private subnet EC2 pull Docker image?', answerHint: 'NAT Gateway outbound, or VPC endpoints for ECR/S3.' },
  ],
  flashcards: [
    { front: 'Internet Gateway', back: 'VPC attachment for public internet routing' },
    { front: 'NAT Gateway', back: 'Outbound internet for private subnets' },
    { front: 'VPC endpoint', back: 'Private connectivity to AWS services without NAT' },
  ],
  quickRevision: [
    'Subnets per AZ',
    'Public IGW private NAT',
    'SG on instance',
    'DB subnet isolated',
    'Flow logs',
  ],
}
