import type { Priority } from '@/domain/types'
import type { SectionSeed, TopicSeed } from './build'

const SECURITY = ['security'] as const
const M45 = [4, 5]
const M56 = [5, 6]

function item(
  id: string,
  title: string,
  priority: Priority = 'tier1',
  extra: Partial<TopicSeed> = {},
): TopicSeed {
  const { tags, executionPriority, ...rest } = extra
  return {
    id,
    title,
    priority,
    months: extra.months ?? (priority === 'tier1' ? M45 : M56),
    tags: [...SECURITY, ...(tags ?? [])],
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
 * C9.1–C9.15 — application security architecture for experienced backend interviews.
 * Shaped for 5-year expectations: grant types, token vs identity, Spring Security 6
 * filter chains, web failure modes, secrets, and OWASP. Networking CORS basics stay
 * in C4; SQL parameterization in C7; JPA native-query binding in C8; AWS Secrets
 * Manager product mechanics in C15. Existing C9 topic IDs remain stable.
 */
export const TRACK_C_SECURITY_SECTIONS: SectionSeed[] = [
  section('C9.1', 'Authentication vs Authorization', 135, [
    item('c9-authentication', 'Authentication vs Authorization'),
    nest('c9-authentication', 'c9-identification-vs-authn', 'Identification vs Authentication'),
    nest('c9-authentication', 'c9-authz-after-authn', 'Authorization After Authentication'),
    nest('c9-authentication', 'c9-fail-closed', 'Fail-Closed Defaults'),
    nest('c9-authentication', 'c9-session-vs-token-auth', 'Session vs Token Authentication Models'),
    nest('c9-authentication', 'c9-mfa-step-up', 'MFA & Step-up Authentication', 'tier2'),
  ]),

  section('C9.2', 'Sessions, Cookies & Browser Storage', 136, [
    item('c9-sessions', 'Sessions (Security)', 'tier1', { related: ['c4-sessions'] }),
    nest('c9-sessions', 'c9-session-fixation', 'Session Fixation'),
    nest('c9-sessions', 'c9-cookie-flags', 'HttpOnly, Secure & SameSite Cookies'),
    nest('c9-sessions', 'c9-samesite-lax-strict', 'SameSite=Lax vs Strict'),
    nest('c9-sessions', 'c9-localstorage-xss', 'Why Tokens Must Not Live in localStorage'),
    nest('c9-sessions', 'c9-bff-cookie-session', 'BFF Cookie Sessions for SPAs', 'tier2'),
  ]),

  section('C9.3', 'JWT Structure, Claims & Validation', 137, [
    item('c9-jwt', 'JWT'),
    nest('c9-jwt', 'c9-jwt-structure', 'Header, Payload & Signature'),
    nest('c9-jwt', 'c9-jwt-claims', 'iss, aud, exp, sub, nbf & iat'),
    nest('c9-jwt', 'c9-jwt-signature-alg', 'Signature Algorithms & alg:none'),
    nest('c9-jwt', 'c9-jwt-jwks', 'JWKS & Signing-Key Rotation'),
    nest('c9-jwt', 'c9-jwt-vs-opaque', 'JWT vs Opaque Access Tokens'),
    nest('c9-jwt', 'c9-jwt-every-request', 'Validating JWT Claims on Every Request'),
  ]),

  section('C9.4', 'OAuth 2.0 Grants & Delegation', 138, [
    item('c9-oauth2', 'OAuth 2.0 Concepts'),
    nest('c9-oauth2', 'c9-oauth-roles', 'Resource Owner, Client, Authorization Server & Resource Server'),
    nest('c9-oauth2', 'c9-oauth-scopes', 'Scopes & Least-Privilege Delegation'),
    nest('c9-oauth2', 'c9-access-tokens', 'Access Tokens'),
    nest('c9-oauth2', 'c9-auth-code-pkce', 'Authorization Code Flow with PKCE'),
    nest('c9-oauth2', 'c9-implicit-deprecated', 'Why Implicit Grant Is Deprecated'),
    nest('c9-oauth2', 'c9-ropg-deprecated', 'Why Resource Owner Password Grant Is Deprecated'),
    nest('c9-oauth2', 'c9-client-credentials', 'Client Credentials for Service-to-Service'),
    nest('c9-oauth2', 'c9-device-code', 'Device Authorization Grant', 'tier2'),
  ]),

  section('C9.5', 'OIDC Identity vs OAuth Authorization', 139, [
    item('c9-oidc', 'OpenID Connect Concepts'),
    nest('c9-oidc', 'c9-oauth-vs-oidc', 'OAuth 2.0 Authorization vs OIDC Identity'),
    nest('c9-oidc', 'c9-id-token', 'ID Tokens vs Access Tokens'),
    nest('c9-oidc', 'c9-id-token-claims', 'ID Token Claim Validation'),
    nest('c9-oidc', 'c9-oidc-nonce', 'nonce Against Replay'),
    nest('c9-oidc', 'c9-userinfo', 'UserInfo Endpoint', 'tier2'),
  ]),

  section('C9.6', 'Token Management, Rotation & Revocation', 140, [
    item('c9-token-management', 'Token Management'),
    nest('c9-token-management', 'c9-short-lived-access-tokens', 'Short-Lived Access Tokens'),
    nest('c9-token-management', 'c9-refresh-token-rotation', 'Refresh Token Rotation & Reuse Detection'),
    nest('c9-token-management', 'c9-token-revocation', 'Token Revocation'),
    nest('c9-token-management', 'c9-bearer-vs-cookie-transport', 'Bearer Header vs Cookie Transport'),
    nest('c9-token-management', 'c9-token-audience-binding', 'Audience, Sender-Constrained Tokens & mTLS', 'tier2'),
  ]),

  section('C9.7', 'Spring Security Filter Chain (Boot 3 / Security 6)', 141, [
    item('c9-spring-security', 'Spring Security', 'tier1', { tags: ['spring'] }),
    nest('c9-spring-security', 'c9-security-filter-chain', 'SecurityFilterChain Beans'),
    nest('c9-spring-security', 'c9-once-per-request-filter', 'OncePerRequestFilter'),
    nest('c9-spring-security', 'c9-security-context-holder', 'SecurityContextHolder'),
    nest('c9-spring-security', 'c9-async-security-context', 'Security Context Across Async & Reactive Threads'),
    nest('c9-spring-security', 'c9-multiple-filter-chains', 'Multiple Filter Chains & Request Matchers'),
    nest('c9-spring-security', 'c9-resource-server-jwt', 'OAuth2 Resource Server JWT'),
  ]),

  section('C9.8', 'RBAC, ABAC & Method Security', 142, [
    item('c9-rbac', 'RBAC'),
    nest('c9-rbac', 'c9-roles-authorities-scopes', 'Roles, Authorities & Scopes'),
    nest('c9-rbac', 'c9-preauthorize-spel', '@PreAuthorize & SpEL'),
    nest('c9-rbac', 'c9-abac', 'Attribute-Based Access Control'),
    nest('c9-rbac', 'c9-domain-ownership', 'Domain-Level Ownership Checks'),
    nest('c9-rbac', 'c9-broken-access-control', 'Broken Access Control & IDOR'),
    nest('c9-rbac', 'c9-method-security-enable', '@EnableMethodSecurity', 'tier2'),
  ]),

  section('C9.9', 'XSS & Content-Security-Policy', 143, [
    item('c9-xss', 'XSS'),
    nest('c9-xss', 'c9-reflected-xss', 'Reflected XSS'),
    nest('c9-xss', 'c9-stored-xss', 'Stored XSS'),
    nest('c9-xss', 'c9-dom-xss', 'DOM-based XSS'),
    nest('c9-xss', 'c9-context-escaping', 'Context-Aware Escaping & Framework Sanitization'),
    nest('c9-xss', 'c9-csp', 'Content-Security-Policy'),
  ]),

  section('C9.10', 'CSRF Mechanics', 144, [
    item('c9-csrf', 'CSRF'),
    nest('c9-csrf', 'c9-csrf-cookie-auth', 'CSRF on Cookie-Authenticated Apps'),
    nest('c9-csrf', 'c9-csrf-bearer-immune', 'Why Bearer APIs Are CSRF-Immune'),
    nest('c9-csrf', 'c9-csrf-tokens', 'Anti-CSRF Tokens'),
    nest('c9-csrf', 'c9-csrf-samesite', 'SameSite as a CSRF Control'),
    nest('c9-csrf', 'c9-csrf-disable-stateless', 'Disabling CSRF Only for Stateless APIs'),
  ]),

  section('C9.11', 'SQL Injection & Unsafe Persistence', 145, [
    item('c9-sql-injection', 'SQL Injection', 'tier1', {
      related: ['c7-prepared-statements', 'c7-bind-parameters'],
    }),
    nest('c9-sql-injection', 'c9-parameterized-queries', 'Parameterized Queries'),
    nest('c9-sql-injection', 'c9-second-order-sqli', 'Second-Order SQL Injection'),
    nest('c9-sql-injection', 'c9-jpa-native-query-binding', 'Unsafe Native Queries in Spring Data JPA', 'tier1', {
      related: ['c8-repositories'],
    }),
    nest('c9-sql-injection', 'c9-orm-string-concat', 'String Concatenation in ORM Queries'),
  ]),

  section('C9.12', 'CORS Misconfigurations', 146, [
    item('c9-cors-security', 'CORS (Security)', 'tier1', { related: ['c4-cors'] }),
    nest('c9-cors-security', 'c9-cors-not-firewall', 'CORS Is Browser Enforcement, Not a Firewall'),
    nest('c9-cors-security', 'c9-cors-preflight', 'Preflight OPTIONS Requests'),
    nest('c9-cors-security', 'c9-cors-dynamic-origin', 'Dynamic Origin Validation'),
    nest('c9-cors-security', 'c9-cors-credentials', 'Access-Control-Allow-Credentials'),
    nest('c9-cors-security', 'c9-cors-wildcard-trap', 'Wildcard Origin + Credentials Trap'),
  ]),

  section('C9.13', 'Password Hashing', 147, [
    item('c9-password-hashing', 'Password Hashing'),
    nest('c9-password-hashing', 'c9-argon2id', 'Argon2id'),
    nest('c9-password-hashing', 'c9-bcrypt-cost', 'Bcrypt Cost Factor ≥ 12'),
    nest('c9-password-hashing', 'c9-unique-salts', 'Unique Per-User Salts'),
    nest('c9-password-hashing', 'c9-pepper', 'Pepper vs Salt', 'tier2'),
    nest('c9-password-hashing', 'c9-password-encoder-spring', 'Spring PasswordEncoder'),
  ]),

  section('C9.14', 'Secrets Management & Key Scanning', 148, [
    item('c9-secrets', 'Secrets Management', 'tier1', { related: ['c15-secrets-manager'] }),
    nest('c9-secrets', 'c9-runtime-secret-ingest', 'Runtime Ingest from Secrets Manager or Vault'),
    nest('c9-secrets', 'c9-no-secrets-in-git', 'No Secrets in Git, Images or Logs'),
    nest('c9-secrets', 'c9-ci-secret-scanning', 'CI/CD Scanning: GitGuardian & TruffleHog'),
    nest('c9-secrets', 'c9-secret-rotation', 'Secret Rotation'),
    nest('c9-secrets', 'c9-least-privilege-credentials', 'Least-Privilege Credentials'),
  ]),

  section('C9.15', 'OWASP Architecture & Cryptographic Failures', 149, [
    item('c9-owasp', 'OWASP Basics'),
    nest('c9-owasp', 'c9-owasp-broken-access-control', 'Broken Access Control (A01)'),
    nest('c9-owasp', 'c9-owasp-crypto-failures', 'Cryptographic Failures (A02)'),
    nest('c9-owasp', 'c9-defense-in-depth', 'Defense in Depth: Gateway to Persistence'),
    nest('c9-owasp', 'c9-security-headers', 'Security Response Headers', 'tier2'),
    nest('c9-owasp', 'c9-threat-model-apis', 'API Threat Modeling', 'tier2'),
  ]),
]
