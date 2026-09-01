import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'AWS Secrets Manager stores and rotates secrets (DB passwords, API keys) with encryption at rest via KMS, fine-grained IAM access, audit via CloudTrail, and optional automatic rotation Lambda. Applications fetch secrets at runtime instead of hardcoding in env files or git.',
  whyExists:
    'Leaked .env in repo is top breach vector. Secrets Manager centralizes secret lifecycle — rotation without redeploy if app fetches on schedule, cross-service sharing with IAM, and versioning for rollback.',
  mentalModel:
    'Vault with automatic key rotation. App asks IAM-permitted GetSecretValue at startup or cache TTL; never bake password in Docker image. Rotation Lambda updates RDS + secret atomically.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Feature', 'Purpose'],
      rows: [
        ['Secret JSON', 'Key/value e.g. username password host'],
        ['Rotation Lambda', 'AWS template or custom rotates RDS creds'],
        ['Resource policy', 'Cross-account secret access'],
        ['Version stages', 'AWSCURRENT vs AWSPENDING during rotation'],
        ['ECS/EKS integration', 'Inject as env from task definition'],
      ],
    },
    {
      type: 'list',
      items: [
        'Spring Cloud AWS or AWS SDK GetSecretValue on boot.',
        'Cache secret in memory with refresh — avoid API call every query.',
        'Parameter Store cheaper for non-rotation config; Secrets Manager for creds needing rotation.',
        'CloudTrail logs every GetSecretValue — detect abnormal access.',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Fetch DB credentials from Secrets Manager',
      code: `SecretsManagerClient sm = SecretsManagerClient.create();
GetSecretValueResponse resp = sm.getSecretValue(
    GetSecretValueRequest.builder().secretId("prod/db/postgres").build());
JsonNode json = mapper.readTree(resp.secretString());
String url = "jdbc:postgresql://" + json.get("host").asText() + "/app";
String user = json.get("username").asText();
String pass = json.get("password").asText();`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Rotation four-step: createPending → test → move current → finish.',
        'Replica secrets multi-region disaster recovery.',
        'KMS CMK customer managed key for compliance separation.',
        'Lambda extension caches secret reducing cold fetch latency.',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Rotation automation', 'Audit trail', 'No secrets in git', 'IAM fine control'],
    disadvantages: ['Cost per secret per month vs SSM Parameter Store', 'Runtime dependency on AWS API', 'Misconfigured IAM blocks startup'],
    alternatives: ['SSM Parameter Store SecureString', 'HashiCorp Vault', 'Kubernetes external-secrets operator'],
    whenToUse: ['DB credentials rotation', 'Third-party API keys in prod', 'Compliance requirements'],
    whenNotToUse: ['Non-sensitive config flags — use Parameter Store plain', 'Local dev — .env.local gitignored OK'],
  },
  failureModes: [
    'Secret cached forever — miss rotation until restart',
    'Rotation Lambda fails — AWSPENDING stuck',
    'Hardcoded fallback password in code path',
    'Over-broad IAM secretsmanager:GetSecretValue *',
    'Log secret value in debug statement',
  ],
  production: {
    security: ['Least privilege IAM per service', 'CMK encryption', 'No secrets in CloudFormation plain text'],
    reliability: ['Handle rotation with dual-user DB pattern', 'Retry GetSecretValue on startup'],
    observability: ['Alert rotation failure CloudWatch', 'CloudTrail anomaly detection'],
    maintainability: ['Naming convention /env/service/secret', 'Document rotation schedule'],
  },
  interview: {
    expectations: ['Why not env in git', 'Rotation concept', 'vs Parameter Store', 'IAM access pattern'],
    commonQuestions: ['Store DB password in AWS?', 'Secret rotation without downtime?'],
    followUps: ['ECS inject secrets?', 'Local dev secrets?'],
    misconceptions: ['Secrets Manager free like Parameter Store', 'Embedding secrets in Lambda env is fine long-term'],
    traps: ['Logging secretString in application logs'],
    strongSignals: ['Rotation Lambda', 'AWSCURRENT version', 'Cache + refresh pattern', 'CloudTrail audit'],
  },
  keyTakeaways: [
    'Secrets Manager stores credentials with KMS encryption.',
    'Fetch at runtime via IAM — never commit secrets.',
    'Automatic rotation for RDS and custom secrets.',
    'Parameter Store for config; Secrets Manager for rotating creds.',
    'Cache secrets but refresh on rotation events.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Secrets Manager vs hardcoded env?', answerHint: 'Central encrypted store, IAM access, rotation, audit — not in git or images.' },
    { level: 'intermediate', question: 'Rotation without app downtime?', answerHint: 'Dual-user DB: rotation creates pending creds, app supports both until swap to AWSCURRENT.' },
    { level: 'advanced', question: 'Secrets Manager vs SSM Parameter Store?', answerHint: 'Secrets Manager: rotation and higher cost for secrets; SSM cheaper for config and static secure strings.' },
  ],
  flashcards: [
    { front: 'AWSCURRENT', back: 'Active secret version stage applications should use' },
    { front: 'Rotation Lambda', back: 'Automates credential update in secret and target e.g. RDS' },
    { front: 'GetSecretValue', back: 'API call fetching secret — logged in CloudTrail' },
    { front: 'KMS', back: 'Encrypts secret at rest — CMK for compliance' },
  ],
  quickRevision: ['Runtime fetch via IAM', 'KMS encrypted', 'Auto rotation', 'Not in git', 'Cache + refresh'],
}
