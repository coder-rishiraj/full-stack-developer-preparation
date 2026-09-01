import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Amazon EKS is managed Kubernetes on AWS — control plane operated by AWS, worker nodes on EC2 or Fargate, integrated with IAM, VPC, ALB Ingress, and EBS/EFS storage.',
  whyExists: 'Self-managed K8s control plane is heavy ops. EKS gives AWS-native K8s for prod LLM services with IAM roles for service accounts (IRSA).',
  mentalModel: 'AWS-flavored Kubernetes — same kubectl, AWS handles masters, you plug in VPC and IAM.',
  howItWorks: [
    { type: 'list', items: [
      'EKS cluster: managed API server across AZs.',
      'Node groups: EC2 or Fargate profiles for pods.',
      'IRSA: pod assumes IAM role via OIDC — no static AWS keys.',
      'AWS Load Balancer Controller for Ingress ALB/NLB.',
      'EBS CSI for persistent volumes; EFS for shared read.',
    ] },
  ],
  example: [
    { type: 'paragraph', text: 'EKS cluster in private subnets; IRSA role allows embed worker SQS+S3; ALB Ingress terminates TLS; Cluster Autoscaler adds nodes when pending pods.' },
  ],
  tradeoffs: {
    advantages: [
      'Managed control plane',
      'AWS integration',
    ],
    disadvantages: [
      'Cost vs self-kubeadm',
      'VPC CNI IP planning',
    ],
    alternatives: [
      'ECS simpler',
      'GKE on GCP',
    ],
    whenToUse: [
      'K8s on AWS prod',
    ],
    whenNotToUse: [
      'Minimal AWS — Lambda may suffice',
    ],
  },
  failureModes: [
    'IP exhaustion in VPC CNI',
    'Overwide IRSA role',
    'Public API endpoint exposed',
  ],
  production: {
    security: [
      'Private endpoint + IRSA',
      'Pod security standards',
    ],
    cost: [
      'Fargate vs EC2 tradeoff',
      'Cluster Autoscaler',
    ],
    reliability: [
      'Multi-AZ node groups',
    ],
  },
  interview: {
    expectations: [
      'IRSA',
      'ALB Ingress',
    ],
    commonQuestions: [
      'EKS vs ECS?',
    ],
    followUps: [
      'IRSA how works?',
    ],
    misconceptions: [
      'EKS free control plane cost ignore',
    ],
    traps: [
      'Static AWS keys in pod env',
    ],
    strongSignals: [
      'IRSA + private cluster + ALB + autoscaler',
    ],
  },
  keyTakeaways: [
    'Managed K8s on AWS',
    'IRSA for pod AWS access',
    'ALB Ingress controller',
    'Plan VPC IPs',
    'Cluster Autoscaler for nodes',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'What is EKS?', answerHint: 'AWS managed Kubernetes control plane + worker integration.' },
    { level: 'intermediate', question: 'IRSA?', answerHint: 'IAM Roles for Service Accounts — pods assume IAM via OIDC.' },
    { level: 'advanced', question: 'Fargate vs EC2 nodes?', answerHint: 'Fargate no node ops pay per pod; EC2 cheaper at scale GPU workloads.' },
  ],
  flashcards: [
    { front: 'IRSA', back: 'Pod-level IAM role without static credentials' },
    { front: 'ALB Ingress', back: 'AWS LB Controller maps Ingress to ALB' },
    { front: 'VPC CNI', back: 'Pods get VPC IPs — plan ENI/IP capacity' },
  ],
  quickRevision: [
    'Managed control plane',
    'IRSA',
    'ALB Ingress',
    'VPC IP plan',
    'Cluster Autoscaler',
  ],
}
