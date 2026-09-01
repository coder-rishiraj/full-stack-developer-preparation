import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'OWASP (Open Web Application Security Project) publishes community-driven security guidance. OWASP Top 10 lists the most critical web app risks (broken access control, injection, cryptographic failures, insecure design, etc.). Used as baseline threat model and interview vocabulary for secure SDLC.',
  whyExists:
    'Teams repeat the same vulnerabilities across projects. OWASP consolidates real-world attack patterns and mitigations so developers, architects, and auditors share a common language and prioritize fixes that matter most.',
  mentalModel:
    'Think defense in depth against a ranked hit list. For each feature ask: who can access this (A01)? is input trusted (A03 injection)? are secrets handled correctly (A02)? map controls to layers: validate input, enforce authZ server-side, secure defaults, logging without secrets.',
  howItWorks: [
    {
      type: 'table',
      headers: ['OWASP Top 10 (2021)', 'Risk', 'Backend mitigation'],
      rows: [
        ['A01 Broken Access Control', 'Users access others data/actions', 'Server-side authZ, deny by default, integration tests per role'],
        ['A02 Cryptographic Failures', 'Weak TLS, exposed secrets', 'TLS 1.2+, KMS/vault, no secrets in repos'],
        ['A03 Injection', 'SQL/command/LDAP injection', 'Parameterized queries, ORM, input validation'],
        ['A04 Insecure Design', 'Missing threat model', 'Abuse cases, rate limits, idempotency for payments'],
        ['A05 Security Misconfiguration', 'Debug on, default creds', 'Hardened images, least privilege IAM, disable unused endpoints'],
        ['A07 Identification & Auth Failures', 'Weak session/JWT', 'MFA, secure cookies, lockout, password hashing'],
        ['A08 Software/Data Integrity Failures', 'Unsigned updates, CI compromise', 'Signed artifacts, dependency scanning, SBOM'],
        ['A09 Logging & Monitoring Failures', 'Blind to breaches', 'Structured audit logs, alerts on auth anomalies'],
        ['A10 SSRF', 'Server fetches attacker URLs', 'Allowlist egress, block metadata IPs'],
      ],
    },
    {
      type: 'list',
      items: [
        'ASVS (Application Security Verification Standard) — detailed requirements checklist',
        'Cheat Sheets — practical mitigations per topic (XSS, CSRF, REST)',
        'SAMM / OpenSAMM — maturity model for org security programs',
        'Integrate into CI: SAST, dependency check, secret scanning',
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Ticket API GET /orders/{id}: A01 test — user A token must not read user B order id. A03 — use JPA @Query with bound params, never concat SQL. A09 — log authZ denial with user id and resource, not full JWT.',
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Interview framing',
      text: 'Pick one Top 10 item and walk threat → control → verification. Stronger than listing all ten from memory.',
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Top 10 updated periodically based on CWE data and community surveys',
        'Risk rating considers exploitability, prevalence, detectability, impact',
        'Maps to CWE/CVE taxonomy for tooling integration',
        'Not a compliance standard alone — complements PCI, SOC2, ISO 27001',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Industry-standard vocabulary', 'Prioritizes high-impact risks', 'Free actionable cheat sheets'],
    disadvantages: ['Generic — must tailor to your stack', 'Can become checkbox compliance', 'Does not replace pen testing'],
    alternatives: ['NIST SSDF', 'CIS Controls', 'Internal threat model per service'],
    whenToUse: ['Design reviews', 'Onboarding security training', 'Interview system design security section'],
    whenNotToUse: ['As sole audit without contextual threat modeling'],
  },
  failureModes: [
    'Treating Top 10 as exhaustive — missing business-logic flaws',
    'Security only at perimeter — no authZ in service layer',
    'Logging PII/secrets while fixing A09',
    'Dependency scan without remediation SLA',
    'Ignoring SSRF in microservices calling user URLs',
  ],
  production: {
    security: ['Shift-left: threat model per epic', 'Mandatory security review for auth/payment paths'],
    observability: ['SIEM alerts on brute force, privilege escalation patterns'],
    maintainability: ['OWASP ASVS level target per app tier documented'],
    reliability: ['Chaos + security game days for credential rotation'],
  },
  interview: {
    expectations: ['Name several Top 10 with mitigations', 'Connect to concrete backend controls'],
    commonQuestions: ['Explain OWASP Top 10?', 'How prevent broken access control?', 'Secure SDLC practices?'],
    followUps: ['SSRF in cloud metadata?', 'Difference A01 vs missing authN?'],
    misconceptions: ['OWASP certifies products', 'Top 10 is only frontend'],
    traps: ['Listing acronyms without mitigation detail'],
    strongSignals: ['Map A01 to server-side authZ tests', 'Mention ASVS, dependency scanning, secrets management'],
  },
  keyTakeaways: [
    'OWASP Top 10 = prioritized common web app risks.',
    'Broken access control and injection dominate real breaches.',
    'Mitigate with validate input, enforce authZ server-side, secure config.',
    'Use cheat sheets + ASVS for depth beyond Top 10 list.',
    'Verify with tests, scanning, and monitoring — not policies alone.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'What is OWASP Top 10?', answerHint: 'Community list of critical web application security risks with guidance.' },
    { level: 'intermediate', question: 'Mitigate broken access control in REST API?', answerHint: 'Deny by default; check ownership/roles on every handler; integration tests per role; avoid IDOR via indirect references.' },
    { level: 'advanced', question: 'How SSRF differs from XSS?', answerHint: 'SSRF: server makes outbound request to attacker-chosen URL (metadata theft); XSS: browser executes script in victim context.' },
  ],
  flashcards: [
    { front: 'OWASP Top 10', back: 'Ranked list of critical web app security risks' },
    { front: 'A01', back: 'Broken Access Control — enforce authZ on every request' },
    { front: 'A03 Injection', back: 'Untrusted data in interpreter — use parameterized queries' },
    { front: 'ASVS', back: 'Detailed security verification requirements checklist' },
  ],
  quickRevision: ['Top 10 risk list', 'A01 authZ server-side', 'A03 param queries', 'Threat model features', 'Scan + monitor'],
}
