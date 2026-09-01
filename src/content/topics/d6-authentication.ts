import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'API authentication verifies caller identity on each request — via API keys, Bearer JWT (OAuth2/OIDC), mTLS, or session tokens. Authorization (often paired) determines what the identity may do. Stateless APIs typically use short-lived access tokens + refresh tokens or signed JWTs validated without server session.',
  whyExists:
    'Public APIs must reject anonymous access to private resources. Every request carries credentials; servers validate signature/expiry/scopes before business logic. Confusing 401 (unauthenticated) vs 403 (authenticated but forbidden) is a common integration bug.',
  mentalModel:
    'Prove who you are every call. JWT: signed claims (sub, exp, scopes) verified with public key. OAuth2: client exchanges code for tokens; API validates JWT or introspects. Never roll custom crypto — use OIDC providers.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Mechanism', 'Header', 'Typical use'],
      rows: [
        ['Bearer JWT', 'Authorization: Bearer eyJ...', 'Mobile/web SPA, microservices'],
        ['API key', 'X-API-Key or query (avoid)', 'Server-to-server partners'],
        ['OAuth2 client credentials', 'Bearer access token', 'Machine clients'],
        ['mTLS', 'Client cert at TLS layer', 'High-trust B2B'],
        ['Session cookie', 'Cookie: sid=...', 'Browser same-site apps'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'OAuth2 authorization code flow (web)',
      diagram: `sequenceDiagram
  participant U as User browser
  participant App
  participant IdP as OIDC Provider
  participant API
  U->>IdP: login consent
  IdP-->>App: auth code
  App->>IdP: exchange code
  IdP-->>App: access_token + refresh_token
  App->>API: Authorization Bearer access_token
  API->>API: validate JWT signature exp scopes`,
    },
    {
      type: 'list',
      items: [
        '401 + WWW-Authenticate when missing/invalid token',
        '403 when valid token lacks scope for resource',
        'Short access token TTL (15m) + refresh rotation',
        'Validate aud, iss, exp, nbf on JWT; clock skew leeway',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'http',
      caption: 'Scoped access',
      code: `GET /v1/invoices/42
Authorization: Bearer eyJhbGciOiJSUzI1NiIs...
# JWT claims: sub=user-7, scope= invoices:read, tenant_id=t-1

403 if scope missing invoices:write on PUT
401 if expired or bad signature`,
    },
  ],
  tradeoffs: {
    advantages: ['Standard interoperable security', 'Stateless JWT reduces session store', 'Fine-grained OAuth scopes'],
    disadvantages: ['JWT revocation hard without short TTL/blocklist', 'OAuth complexity for simple APIs', 'API keys leak if embedded client-side'],
    alternatives: ['mTLS only internal mesh', 'Signed requests (AWS SigV4)'],
    whenToUse: ['All non-public APIs', 'Partner integrations'],
    whenNotToUse: ['Truly public read-only CDN assets'],
  },
  failureModes: [
    'JWT in localStorage XSS theft',
    'Long-lived JWT cannot revoke',
    'API keys in mobile apps extractable',
    'Confusing 401 vs 403',
    'Missing authZ check after authN on resource id',
  ],
  production: {
    security: ['HTTPS only', 'Rotate keys', 'Refresh token reuse detection', 'Rate limit auth endpoints'],
    reliability: ['JWKS cache with fallback', 'IdP outage graceful error'],
    observability: ['401/403 rates', 'Failed token validation reasons'],
    maintainability: ['Central auth middleware', 'OpenAPI securitySchemes'],
    scalability: ['Stateless JWT validation horizontal scale'],
  },
  interview: {
    expectations: ['401 vs 403', 'JWT validation steps', 'OAuth flows high level'],
    commonQuestions: ['JWT vs session?', 'Secure SPA tokens?'],
    followUps: ['Revoke JWT?', 'API key rotation?'],
    misconceptions: ['JWT encrypted by default — only signed unless JWE', 'AuthN sufficient without AuthZ per resource'],
    traps: ['Accept alg=none JWT attack'],
    strongSignals: ['OIDC standard library', 'Scope per endpoint', 'HttpOnly cookie BFF pattern for SPA'],
  },
  keyTakeaways: [
    'Authenticate every request; 401 unauthenticated, 403 forbidden.',
    'Prefer OAuth2/OIDC + short JWT over custom auth.',
    'Validate JWT signature, exp, iss, aud, scopes.',
    'Never expose long-lived secrets in browsers — use BFF or PKCE.',
    'Authorization checks resource ownership every call.',
  ],
  interviewQuestions: [
    { level: 'basic', question: '401 vs 403?', answerHint: '401 not authenticated; 403 authenticated but not allowed.' },
    { level: 'intermediate', question: 'JWT validation checklist?', answerHint: 'Signature with JWKS, exp/nbf, iss, aud, scopes for operation.' },
    { level: 'advanced', question: 'SPA secure token storage?', answerHint: 'BFF HttpOnly cookie session or PKCE + short access token; avoid localStorage.' },
  ],
  flashcards: [
    { front: 'Bearer token', back: 'Authorization: Bearer <access_token> on each API call' },
    { front: 'OAuth2 scopes', back: 'Limit what access token can do e.g. read:invoices' },
    { front: 'JWT revocation challenge', back: 'Stateless until exp — short TTL or token blocklist' },
    { front: 'PKCE', back: 'Proof Key for Code Exchange secures public OAuth clients' },
  ],
  quickRevision: [
    '401 vs 403',
    'JWT validate all claims',
    'Short access TTL',
    'Scope per endpoint',
    'AuthZ every resource',
  ],
  systemDesign: {
    problem: 'Design authentication for multi-tenant B2B API (partners server-to-server + customer admin SSO) with fine-grained scopes.',
    requirements: {
      functional: ['OAuth client credentials partners', 'SSO SAML/OIDC admins', 'Scope per API resource'],
      nonFunctional: ['SOC2 audit', 'Token introspection optional', 'Key rotation'],
    },
    scaleAssumptions: ['200 partners', '50k API RPS', 'Auth0/Keycloak IdP'],
    capacityEstimates: ['JWT local validation — no per-request IdP call'],
    api: [{ type: 'paragraph', text: 'OpenAPI securitySchemes OAuth2; scopes invoices:read, invoices:write, admin:*' }],
    dataModel: [{ type: 'list', items: ['tenants, clients, scopes mapping', 'Audit log auth events'] }],
    highLevelArchitecture: [{ type: 'paragraph', text: 'API gateway JWT validation JWKS; service checks tenant_id claim matches resource.' }],
    diagram: {
      mermaid: `flowchart LR
  Partner --> GW[API Gateway JWT validate]
  Admin --> IdP[OIDC SSO]
  IdP --> GW
  GW --> Svc[Services AuthZ tenant+scope]`,
      caption: 'Central JWT validation then resource AuthZ',
    },
    dataFlow: ['Token issued with tenant_id + scopes', 'Each handler @PreAuthorize scope + tenant match'],
    storage: ['IdP stores users; API stores tenant mapping'],
    caching: ['JWKS cache 24h with refresh'],
    asyncProcessing: ['Audit log stream'],
    scaling: ['Stateless validators scale out'],
    consistency: ['Revocation via short TTL + refresh blocklist Redis optional'],
    reliability: ['JWKS fetch fallback cached keys'],
    failureScenarios: ['IdP down — existing JWTs work until exp'],
    security: ['mTLS optional tier-1 partners', 'Rotate client secrets'],
    observability: ['401/403 by client, scope denial metrics'],
    bottlenecks: ['Blocklist Redis if overused revocation'],
    alternatives: ['API keys simple small partners only'],
    tradeoffs: ['OAuth complexity vs API key simplicity'],
    interviewFollowUps: ['Cross-tenant token leak impact?', 'Machine vs user token lifetimes?'],
    evolution: [
      { stage: '1. Simple design', description: 'Single API key.', bottleneck: 'No scopes/SSO.' },
      { stage: '2. Improve', description: 'OAuth client credentials.', bottleneck: 'Admin SSO separate.' },
      { stage: '3. Improve', description: 'Unified OIDC + scopes.', bottleneck: 'AuthZ bugs cross-tenant.' },
      { stage: '4. Scale further', description: 'Gateway policy as code + audit.', bottleneck: 'Policy sprawl governance.' },
    ],
  },
}
