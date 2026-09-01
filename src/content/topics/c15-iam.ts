import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'AWS IAM (Identity and Access Management) controls who can do what in AWS: users, groups, roles, policies (JSON permissions), MFA, and resource-based policies. Applications use IAM roles (temporary credentials) — never long-lived access keys on EC2.',
  whyExists:
    'Shared AWS account needs least privilege. Every API call is authenticated and authorized. Roles let EC2, Lambda, and CI assume permissions without embedding secrets. Cross-account and service-to-service trust via role assumption.',
  mentalModel:
    'Badge system for AWS API. Policy is list of Allow/Deny actions on resources. Role is badge EC2 wears via instance profile. User is human badge — prefer SSO instead of IAM users in prod.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Entity', 'Use'],
      rows: [
        ['IAM Role', 'Assumed by EC2, Lambda, GitHub OIDC — temp creds'],
        ['Policy', 'JSON: Effect, Action, Resource, Condition'],
        ['Instance profile', 'Container attaching role to EC2'],
        ['Resource policy', 'S3 bucket policy allowing role from another account'],
        ['Permission boundary', 'Max permissions cap for delegated admin'],
      ],
    },
    {
      type: 'list',
      items: [
        'Explicit Deny always wins over Allow.',
        'Least privilege: s3:GetObject on arn:.../bucket/prefix/* not s3:*.',
        'sts:AssumeRole for cross-account and CI OIDC.',
        'CloudTrail logs every IAM-authenticated API call.',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'json',
      caption: 'S3 read-only policy snippet',
      code: `{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": ["s3:GetObject"],
    "Resource": "arn:aws:s3:::my-app-assets/*"
  }]
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Policy evaluation: identity policies + resource policies + SCP (Organizations).',
        'Session duration for assumed roles configurable up to max.',
        'IAM Access Analyzer finds public or cross-account access.',
        'IRSA on EKS: pod service account maps to IAM role via OIDC.',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Fine-grained audit', 'No static keys on servers', 'Central SSO integration'],
    disadvantages: ['Policy sprawl and complexity', 'Misconfiguration common', 'Debugging Deny tricky'],
    alternatives: ['Access keys — avoid for apps', 'Bucket ACLs legacy — prefer policies'],
    whenToUse: ['Every AWS resource access decision', 'CI/CD cloud deploy roles'],
    whenNotToUse: ['Application user auth — use Cognito/OAuth not IAM users'],
  },
  failureModes: [
    'Admin * policy on CI role — compromised pipeline owns account',
    'Access keys in git',
    'Overly broad s3:* on production role',
    'Missing condition on sts:AssumeRole — confused deputy',
    'IAM user instead of SSO for humans',
  ],
  production: {
    security: ['No long-lived keys', 'MFA for humans', 'Permission boundaries', 'Access Analyzer alerts'],
    maintainability: ['IAM as code Terraform/CDK', 'Named roles per service'],
    observability: ['CloudTrail + alert on root usage'],
  },
  interview: {
    expectations: ['Role vs user', 'Least privilege', 'Instance profile'],
    commonQuestions: ['How EC2 access S3 without keys?', 'Policy JSON structure?'],
    followUps: ['OIDC for GitHub Actions?', 'Explicit Deny?'],
    misconceptions: ['IAM is app login for customers', 'Access keys OK on EC2'],
    traps: ['Recommend embedding AKIA keys in app.properties'],
    strongSignals: ['Instance profile + scoped policy', 'OIDC federation', 'Deny wins'],
  },
  keyTakeaways: [
    'IAM: users, roles, policies — API authorization.',
    'Apps use roles via instance profile — temp creds.',
    'Least privilege on Action and Resource ARNs.',
    'Explicit Deny overrides Allow.',
    'CloudTrail audits all API calls.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'IAM role vs user?', answerHint: 'Role assumed temporarily by service; user long-lived human identity — prefer SSO.' },
    { level: 'intermediate', question: 'EC2 read S3 without access keys?', answerHint: 'Instance profile with IAM role; SDK uses IMDS temp credentials.' },
    { level: 'advanced', question: 'GitHub Actions deploy to AWS safely?', answerHint: 'OIDC provider trust role with repo/branch condition — no stored keys.' },
  ],
  flashcards: [
    { front: 'Instance profile', back: 'Links IAM role to EC2 for automatic credentials' },
    { front: 'Explicit Deny', back: 'Always wins over Allow in policy evaluation' },
    { front: 'sts:AssumeRole', back: 'Obtain temporary creds for another role' },
  ],
  quickRevision: [
    'Roles not keys',
    'Least privilege ARNs',
    'Deny wins',
    'Instance profile',
    'CloudTrail audit',
  ],
}
