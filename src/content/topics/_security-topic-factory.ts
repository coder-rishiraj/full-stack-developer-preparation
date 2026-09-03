import type { TopicContent } from '@/domain/types'

type SecurityTopicInput = {
  title: string
  sectionTitle: string
  parentTitle?: string
}

const SECTION_FOCUS: Record<string, string> = {
  'Authentication vs Authorization':
    'who the caller is versus what they may do, fail-closed defaults, and session vs token models',
  'Sessions, Cookies & Browser Storage':
    'cookie flags, SameSite, session fixation, and why access tokens in localStorage fail under XSS',
  'JWT Structure, Claims & Validation':
    'signature, iss/aud/exp/sub, alg confusion, JWKS rotation, and validating claims on every request',
  'OAuth 2.0 Grants & Delegation':
    'Authorization Code with PKCE, why Implicit and ROPG are deprecated, scopes, and client credentials',
  'OIDC Identity vs OAuth Authorization':
    'OAuth as authorization and scope delegation versus OIDC identity assertion via ID Tokens',
  'Token Management, Rotation & Revocation':
    'short-lived access tokens, refresh-token rotation, revocation, and cookie vs Bearer transport',
  'Spring Security Filter Chain (Boot 3 / Security 6)':
    'component-based SecurityFilterChain, OncePerRequestFilter, SecurityContextHolder, and async propagation',
  'RBAC, ABAC & Method Security':
    'roles vs attributes vs ownership, @PreAuthorize SpEL, and broken access control / IDOR',
  'XSS & Content-Security-Policy':
    'reflected, stored, and DOM XSS, context-aware escaping, sanitization, and strict CSP headers',
  'CSRF Mechanics':
    'cookie-authenticated CSRF, Bearer CSRF immunity, anti-CSRF tokens, and SameSite as a control',
  'SQL Injection & Unsafe Persistence':
    'parameterized queries, second-order injection, and unsafe native JPA/Hibernate string concatenation',
  'CORS Misconfigurations':
    'CORS as browser enforcement, preflight OPTIONS, dynamic origins, and credentials rules',
  'Password Hashing':
    'Argon2id or Bcrypt cost ≥ 12, unique salts, and Spring PasswordEncoder defaults',
  'Secrets Management & Key Scanning':
    'runtime secret ingest, no secrets in git, CI scanning, rotation, and least privilege',
  'OWASP Architecture & Cryptographic Failures':
    'Broken Access Control, Cryptographic Failures, and defense in depth from gateway to database',
}

export function createSecurityTopicContent({
  title,
  sectionTitle,
  parentTitle,
}: SecurityTopicInput): TopicContent {
  const focus =
    SECTION_FOCUS[sectionTitle] ??
    'security architecture, failure modes, production trade-offs, and defensive engineering'
  const parent = parentTitle ? ` It is an atomic part of ${parentTitle}.` : ''

  return {
    whatIsIt:
      `${title} is an application-security topic in ${sectionTitle}.${parent} ` +
      'At five years of experience, explain the architecture, the failure mode it prevents, and the production trade-off — not only the happy-path setup.',
    whyExists:
      `${title} exists because authentication, authorization, tokens, and browsers fail in predictable ways. ` +
      `A strong answer covers ${focus}.`,
    mentalModel:
      'Decide who the principal is, what they may do, how proof of identity or authorization is carried, and what happens when the browser, token, filter, or query is attacker-controlled. ' +
      'Then name the control: cookie flags, claim validation, parameterized SQL, CSP, CSRF tokens, or method security.',
    howItWorks: [
      {
        type: 'list',
        ordered: true,
        items: [
          `Place ${title} in the request path: browser, gateway, Spring Security filter, method security, or data access.`,
          'Name the asset: session, access token, ID token, secret, password hash, or query.',
          'State the attacker model: XSS, CSRF, token theft, IDOR, injection, or secret leakage.',
          'State the control and what still fails if it is misconfigured (wildcard CORS, localStorage tokens, disabled CSRF on cookie apps).',
          'Verify with tests, headers, token claims, query binding, and a revoke/rotate story.',
        ],
      },
      {
        type: 'callout',
        variant: 'note',
        title: 'Track boundary',
        text:
          'C9 owns application security architecture. C4 owns HTTP/CORS protocol mechanics; C7 owns SQL parameterization; ' +
          'C8 owns JPA native-query binding; C15 owns AWS Secrets Manager as a product. Do not treat CORS as a server firewall.',
      },
    ],
    internals: [
      {
        type: 'list',
        items: [
          'OAuth 2.0 delegates scoped access via access tokens; OIDC asserts identity via ID tokens. Validate iss, aud, exp, sub, and signature on every use.',
          'Spring Security 6 uses SecurityFilterChain beans; SecurityContextHolder holds the authenticated principal and must be propagated across async work.',
          'Cookie-authenticated browsers send cookies on cross-site form posts; custom Authorization: Bearer headers do not, so CSRF risk differs.',
          'XSS in the origin can read localStorage and call same-origin APIs; HttpOnly cookies and CSP reduce that blast radius.',
          'ORM native queries are still SQL: concatenation is injection; named parameters and bind variables are the control.',
        ],
      },
    ],
    failureModes: [
      `Treating ${title} as a framework checkbox without naming the attacker and the remaining residual risk.`,
      'Storing access or refresh tokens in localStorage, or skipping JWT iss/aud/exp/signature checks.',
      'Using Implicit or Resource Owner Password grants, or long-lived access tokens without rotation/revocation.',
      'Disabling CSRF on a cookie-session app, or assuming CORS replaces authentication.',
      'Hashing passwords with MD5/SHA, cost-1 bcrypt, or checking authorization only in the UI.',
    ],
    production: {
      reliability: [
        'Prefer short-lived access tokens, refresh-token rotation with reuse detection, and documented revocation.',
        'Keep SecurityFilterChain explicit: public vs authenticated vs actuator, and fail closed on unmatched routes.',
      ],
      observability: [
        'Log authentication and authorization failures without leaking tokens, codes, or PII.',
        'Alert on JWKS fetch failures, secret-rotation errors, and repeated 401/403 spikes.',
      ],
      maintainability: [
        'Centralize claim validation and method security; avoid ad-hoc header parsing in controllers.',
        'Inject secrets at runtime; scan CI for keys; never bake credentials into images.',
      ],
    },
    interview: {
      expectations: [
        `Define ${title} in ${sectionTitle} and name the failure mode it exists to stop.`,
        'Distinguish OAuth authorization from OIDC identity, and RBAC from ownership/ABAC checks.',
        'Give one Spring Security 6 or browser-control detail (filter chain, cookie flags, CSP, CSRF).',
      ],
      commonQuestions: [
        `How does ${title} work in a production API?`,
        'What breaks if this control is skipped or misconfigured?',
        'How would you design this for an SPA plus a Spring Boot resource server?',
      ],
      followUps: [
        'Where do you store tokens, and why not localStorage?',
        'How do you rotate signing keys or refresh tokens without downtime?',
      ],
      misconceptions: [
        'OAuth 2.0 is login.',
        'CORS is a server-side access-control firewall.',
        'Stateless JWT APIs still need CSRF tokens in every case.',
      ],
      traps: [
        'Reciting grant names without PKCE, deprecation reasons, or claim validation.',
        'Showing SecurityFilterChain that disables CSRF for a cookie-authenticated browser app.',
      ],
      strongSignals: [
        'Separates identity, authorization, transport, and data-layer controls.',
        'Talks residual risk: XSS vs HttpOnly, Bearer vs CSRF, parameterized SQL vs second-order injection.',
      ],
    },
    keyTakeaways: [
      `${title} belongs to ${sectionTitle}.`,
      `Focus: ${focus}.`,
      'Architecture → attacker model → control → residual risk → rotation/revoke/observe.',
    ],
    interviewQuestions: [
      {
        level: 'basic',
        question: `What is ${title}, and what attack or misuse does it prevent?`,
        answerHint: `Place it in ${sectionTitle} and name the asset (session, token, secret, query) it protects.`,
      },
      {
        level: 'intermediate',
        question: `Which production trade-offs matter for ${title} on a Spring Boot 3 API used by an SPA?`,
        answerHint: 'Discuss cookies vs Bearer, PKCE, CSRF, XSS/CSP, method security, or secret handling as applicable.',
      },
      {
        level: 'advanced',
        question: `How would you detect a break in ${title} in production and rotate without locking users out?`,
        answerHint: `Use ${focus} plus JWKS/refresh rotation, filter-chain metrics, and fail-closed authorization.`,
      },
    ],
    flashcards: [
      { front: title, back: `${sectionTitle}: ${focus}.` },
      {
        front: `${title} review loop`,
        back: 'Principal → proof → authorization → transport → data layer → residual risk.',
      },
    ],
    quickRevision: [
      `${title} — ${sectionTitle}`,
      `Focus: ${focus}`,
      'OAuth authorizes; OIDC identifies',
      'Validate claims, bind queries, fail closed',
    ],
  }
}
