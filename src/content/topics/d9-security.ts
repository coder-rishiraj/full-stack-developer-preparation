import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Security in system design interviews addresses authentication, authorization, data protection, transport encryption, input validation, rate limiting abuse, secrets management, compliance boundaries, and threat-aware design — proportionate to system sensitivity (payments vs public feed).',
  whyExists:
    'Security omitted from HLD is a fail at senior levels. Interviewers probe PII handling, auth model, multi-tenant isolation, and OWASP basics. Security choices affect API design, data model, and cache key isolation from the start.',
  mentalModel:
    'Castle layers: moat (WAF rate limit), gate (authn), guards per room (authz), locked treasury (encryption at rest), messengers over sealed roads (TLS). Not every shed needs a moat — match controls to asset value.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Area', 'Interview mention', 'Example'],
      rows: [
        ['Authn', 'OAuth2/JWT/session', 'Login via IdP'],
        ['Authz', 'RBAC owner checks', 'User can edit own posts only'],
        ['Transport', 'TLS everywhere', 'HTTPS HSTS'],
        ['Data at rest', 'Encrypt PII columns or disk', 'KMS managed keys'],
        ['Input', 'Validate sanitize size limits', 'Prevent injection XSS'],
        ['Abuse', 'Rate limit CAPTCHA', 'Signup spam scraping'],
        ['Secrets', 'Vault not env git', 'Rotate API keys'],
        ['Multi-tenant', 'tenant_id in every query', 'No cross-tenant cache keys'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'Security layers on request path',
      diagram: `flowchart TB
  Client --> TLS[TLS termination]
  TLS --> WAF[WAF rate limit]
  WAF --> Auth[Authn JWT verify]
  Auth --> AuthZ[Authz resource owner]
  AuthZ --> API[API validate input]
  API --> DB[(Encrypted at rest)]`,
    },
    {
      type: 'list',
      items: [
        '2–4 minutes — proportional to system (payment > paste bin)',
        'Never cache authenticated responses on shared CDN key without Vary',
        'Principle of least privilege for service accounts',
        'Audit log for sensitive admin actions',
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Healthcare portal: OAuth2 + MFA; RBAC patient vs doctor; PHI encrypted at rest AES-256 KMS; TLS 1.3; field-level encryption SSN; audit log all record access; tenant isolation hospital_id on queries; rate limit login; secrets in Vault; HIPAA BAA with cloud vendor; no PHI in logs.',
    },
  ],
  tradeoffs: {
    advantages: ['Trust compliance', 'Prevent costly breaches in design'],
    disadvantages: ['Security slows feature velocity', 'Over-engineering low-risk systems'],
    alternatives: ['Defense in depth proportionate — not fortress for public blog'],
    whenToUse: ['Any user data system', 'Mandatory for payment health'],
    whenNotToUse: ['Do not spend 15 min on public static site'],
  },
  failureModes: [
    'Auth check only at edge — internal service trust exploit',
    'Shared cache key leaks user A data to user B',
    'PII in plain logs',
    'Rate limit absent on login — credential stuffing',
    'Secrets in repo or env without rotation',
  ],
  production: {
    security: ['WAF TLS authz encryption secrets rotation', 'Regular pen test'],
    observability: ['Security audit logs anomaly detection'],
    reliability: ['Fail closed on auth for sensitive ops'],
    maintainability: ['Security review in design RFC template'],
  },
  interview: {
    expectations: ['Authn vs authz', 'TLS encryption mention', 'Abuse rate limit'],
    commonQuestions: ['Secure API design?', 'Multi-tenant isolation?'],
    followUps: ['JWT vs session?', 'Encrypt what at rest?'],
    misconceptions: ['Security only at API gateway', 'HTTPS enough for all security'],
    traps: ['Cache user dashboard on shared URL'],
    strongSignals: ['tenant_id isolation', 'KMS at rest', 'audit log sensitive access'],
  },
  keyTakeaways: [
    'Authn (who) vs authz (what allowed) — both required.',
    'TLS in transit; encrypt sensitive data at rest.',
    'Validate input; rate limit abuse paths (login signup).',
    'Multi-tenant: tenant in query and cache keys.',
    'Match security depth to data sensitivity.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Authn vs authz?', answerHint: 'Authentication proves identity; authorization checks permission for resource action.' },
    { level: 'intermediate', question: 'Prevent CDN cache leaking private API?', answerHint: 'Cache-Control private no-store or user-specific cache keys signed cookies edge auth.' },
    { level: 'advanced', question: 'Secure multi-tenant SaaS data model?', answerHint: 'tenant_id every row query index RLS optional separate schema tier encrypt per tenant keys audit access.' },
  ],
  flashcards: [
    { front: 'Authn vs Authz', back: 'Identity vs permission check' },
    { front: 'Fail closed', back: 'Deny access when auth system uncertain — sensitive ops' },
    { front: 'Tenant isolation', back: 'tenant_id in queries and cache keys prevent cross-leak' },
    { front: 'Secrets management', back: 'Vault/KMS not git — rotate regularly' },
  ],
  quickRevision: [
    'Authn + authz',
    'TLS + encrypt rest',
    'Validate input',
    'Rate limit abuse',
    'Tenant cache keys',
  ],
}
