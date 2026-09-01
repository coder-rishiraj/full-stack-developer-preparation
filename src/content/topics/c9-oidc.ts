import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'OpenID Connect (OIDC) is an identity layer on OAuth 2.0. Adds ID Token (JWT) with authenticated user claims (sub, email, name), UserInfo endpoint, and standard scopes like openid profile email. Enables federated login with verifiable identity, not just API access.',
  whyExists:
    'OAuth alone tells you the token is valid for scopes — not who the user is in a standard way. OIDC standardizes identity claims so apps can create sessions, link accounts, and enforce authN consistently across IdPs.',
  mentalModel:
    'OAuth gets you in the door (access token). OIDC tells you who walked in (ID token + UserInfo). Always validate ID token like any JWT: iss, aud, nonce, exp. Use sub as stable user key from that IdP.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Artifact', 'Purpose', 'Notes'],
      rows: [
        ['ID Token (JWT)', 'Proof of authentication event', 'Contains sub, iss, aud, nonce, auth_time'],
        ['Access Token', 'Call OAuth-protected APIs', 'May also access UserInfo with openid scope'],
        ['UserInfo endpoint', 'Additional claims', 'GET with Bearer access token'],
        ['Discovery (.well-known/openid-configuration)', 'Metadata', 'Endpoints, JWKS URI, supported scopes'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'OIDC login',
      diagram: `sequenceDiagram
  participant App
  participant IdP
  App->>IdP: authorize scope=openid profile
  IdP-->>App: code
  App->>IdP: token grant
  IdP-->>App: id_token + access_token
  App->>App: validate id_token nonce aud iss
  App->>IdP: GET /userinfo Bearer access_token
  IdP-->>App: claims JSON`,
    },
  ],
  example: [
    {
      type: 'code',
      language: 'json',
      caption: 'ID Token claims (simplified)',
      code: `{
  "iss": "https://accounts.google.com",
  "sub": "110284...",
  "aud": "your-client-id",
  "exp": 1699999999,
  "nonce": "random-bound-to-session",
  "email": "user@example.com",
  "email_verified": true
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'openid scope required to receive ID token',
        'Nonce prevents replay — bind to original authorize request',
        'Hybrid flows deprecated; prefer auth code + PKCE',
        'Pairwise sub vs public sub — privacy across clients',
        'Session management / logout via end_session_endpoint when supported',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Standard identity claims', 'Works with many IdPs', 'JWT ID token reduces UserInfo round trips'],
    disadvantages: ['JWT size in cookies if mishandled', 'Claim trust depends on IdP verification (email_verified)', 'Federation complexity'],
    alternatives: ['Custom OAuth + proprietary user API', 'SAML for enterprise', 'Local username/password only'],
    whenToUse: ['Social/enterprise SSO', 'Multi-tenant SaaS login', 'Federated identity across services'],
    whenNotToUse: ['Pure M2M with no user (client credentials only)'],
  },
  failureModes: [
    'Skipping nonce validation — replay ID token',
    'Trusting unverified email claim',
    'Using access token as session without binding',
    'Mixing users from different IdPs without (iss, sub) composite key',
    'Clock skew breaking exp validation',
  ],
  production: {
    security: ['Validate ID token fully; require email_verified for email-based account linking', 'Store (iss, sub) not email alone'],
    reliability: ['Cache JWKS; handle key rotation'],
    observability: ['Track login failures by IdP and error code'],
    maintainability: ['Single OIDC client config per environment'],
  },
  interview: {
    expectations: ['OIDC vs OAuth difference', 'ID token claims and validation', 'Nonce purpose'],
    commonQuestions: ['What is OIDC?', 'ID token vs access token?', 'How link federated account?'],
    followUps: ['UserInfo when needed?', 'Account linking rules?'],
    misconceptions: ['ID token for API authorization (use access token scopes)', 'Email alone is unique globally'],
    traps: ['Using ID token past exp as session forever'],
    strongSignals: ['(iss, sub) primary key', 'nonce + PKCE', 'email_verified check'],
  },
  keyTakeaways: [
    'OIDC = OAuth 2.0 + standardized identity (ID token).',
    'Validate ID token: iss, aud, exp, nonce.',
    'Use sub + iss as federated user identifier.',
    'Access token authorizes APIs; ID token proves login.',
    'Require verified email before auto-provisioning.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'How is OIDC different from OAuth 2.0?', answerHint: 'OIDC adds ID token and standard identity claims for authentication; OAuth focuses on authorization.' },
    { level: 'intermediate', question: 'Why nonce in OIDC?', answerHint: 'Binds ID token to original authorize request preventing token replay.' },
    { level: 'advanced', question: 'How safely link Google login to existing account?', answerHint: 'Match verified email or explicit linking flow; use (iss,sub) mapping table; avoid takeover via unverified email.' },
  ],
  flashcards: [
    { front: 'OIDC', back: 'Identity layer on OAuth — ID token + UserInfo for authentication' },
    { front: 'ID Token', back: 'JWT proving auth event; contains sub, iss, aud, nonce' },
    { front: 'openid scope', back: 'Required scope to receive ID token in token response' },
    { front: 'Federated user key', back: 'Pair (iss, sub) — not email alone' },
  ],
  quickRevision: ['OAuth + identity', 'ID token JWT', 'Validate nonce', 'iss+sub key', 'Access for API'],
}
