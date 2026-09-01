import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Secrets management protects credentials, API keys, TLS private keys, and DB passwords from exposure in code, logs, and repos. Tools: HashiCorp Vault, AWS Secrets Manager, GCP Secret Manager, Azure Key Vault, Kubernetes Secrets (with encryption at rest). Patterns: inject at runtime, rotate automatically, audit access.',
  whyExists:
    'Leaked .env in GitHub is a top breach vector. Hard-coded secrets in JARs, config repos, and CI logs create persistent compromise. Central vaults enable rotation, fine-grained access, and encryption without redeploying plaintext config.',
  mentalModel:
    'Secrets live in a vault with identity-based access. Apps fetch at startup or via sidecar; never commit to git. Rotate on schedule and incident. Treat CI/CD and prod secrets separately — blast radius containment.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Pattern', 'How', 'Trade-off'],
      rows: [
        ['Env injection', 'K8s secret → env var at pod start', 'Simple; restart to rotate'],
        ['Vault agent/sidecar', 'Dynamic secrets, auto-renew', 'More moving parts'],
        ['External Secrets Operator', 'Sync cloud secret to K8s', 'GitOps friendly metadata only in git'],
        ['Spring Cloud Config + Vault', 'PropertySource from vault', 'Central config + secrets backend'],
      ],
    },
    {
      type: 'list',
      items: [
        'Never log secrets — structured logging scrubbers',
        'Pre-commit secret scanning (gitleaks, trufflehog)',
        'Short-lived credentials: IAM roles vs long-lived keys',
        'Separate dev/stage/prod secrets and IAM boundaries',
        'Break-glass procedures documented for vault outage',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'yaml',
      caption: 'Kubernetes — reference secret, not inline',
      code: `apiVersion: v1
kind: Pod
spec:
  containers:
    - name: api
      env:
        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: db-credentials
              key: password`,
    },
    {
      type: 'paragraph',
      text: 'Spring Boot: spring.config.import=aws-secretsmanager:/prod/api/db — loads JDBC password at bootstrap. Local dev uses .env.local gitignored or docker-compose secrets file.',
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Envelope encryption: data key encrypted by master key (KMS)',
        'Dynamic DB credentials: vault creates user with TTL',
        'Versioning: rollback secret version on bad rotation',
        'Audit trail: who read which secret when',
        'K8s Secrets base64 not encryption — enable etcd encryption provider',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Rotation without code change', 'Audit and ACL', 'Removes secrets from git'],
    disadvantages: ['Vault is critical dependency', 'Operational complexity', 'Misconfigured RBAC on vault'],
    alternatives: ['Cloud-native secret managers only', 'Sealed Secrets for GitOps ciphertext'],
    whenToUse: ['All production credentials', 'CI/CD pipeline secrets', 'TLS cert lifecycle'],
    whenNotToUse: ['Committing encrypted blobs without key management story'],
  },
  failureModes: [
    'Secrets in git history forever',
    'Same prod secret in dev laptops',
    'Logging connection strings with password',
    'Vault token with overly broad policy in every pod',
    'No rotation after employee offboarding',
    'Panic hardcode secret in prod hotfix committed to repo',
  ],
  production: {
    security: ['Least privilege IAM to secret paths', 'Automatic rotation for DB/API keys', 'Scan repos and images in CI'],
    reliability: ['Cache secrets with TTL; handle vault outage fallback policy', 'Multi-region vault replication'],
    observability: ['Alert on secret access anomalies', 'Never include secret values in traces'],
    maintainability: ['Runbooks for rotation and emergency revoke'],
    cost: ['Right-size secret API calls; cache appropriately'],
  },
  interview: {
    expectations: ['Why not env in repo', 'Rotation strategy', 'K8s secrets limitations'],
    commonQuestions: ['How store DB password?', 'Rotate API keys without downtime?', 'Vault vs AWS Secrets Manager?'],
    followUps: ['Dynamic credentials?', 'Secret leak response?'],
    misconceptions: ['K8s Secret is encrypted by default', '.env in private repo is safe'],
    traps: ['Suggesting secrets in application.properties in git'],
    strongSignals: ['Vault/KMS, rotation, scanning, separate envs, audit logs'],
  },
  keyTakeaways: [
    'Never commit secrets — scan repos and rotate on leak.',
    'Use vault or cloud secret manager with IAM least privilege.',
    'Inject at runtime; separate dev/prod credentials.',
    'Rotate automatically; audit all access.',
    'K8s Secrets need encryption at rest — not just base64.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Why secrets management vs .env in repo?', answerHint: 'Prevent git leaks, enable rotation, audit access, separate environments.' },
    { level: 'intermediate', question: 'Rotate DB password without downtime?', answerHint: 'Dual-credential window: add new password, rolling restart apps, revoke old; or dynamic creds from vault.' },
    { level: 'advanced', question: 'K8s Secret security gaps?', answerHint: 'Base64 not encryption; etcd must encrypt; RBAC on secret read; prefer external secrets + IRSA/workload identity.' },
  ],
  flashcards: [
    { front: 'Secrets management', back: 'Central store, ACL, rotation, audit — not in git' },
    { front: 'Dynamic secret', back: 'Short-lived credential generated on demand (e.g., vault DB user)' },
    { front: 'gitleaks', back: 'Pre-commit/CI scan for secrets in repos' },
    { front: 'K8s Secret caveat', back: 'Base64 encoding ≠ encryption; protect etcd and RBAC' },
  ],
  quickRevision: ['No secrets in git', 'Vault/KMS', 'Rotate + audit', 'Inject runtime', 'Scan CI'],
}
