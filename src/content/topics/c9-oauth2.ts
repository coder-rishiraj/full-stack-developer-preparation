import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'OAuth 2.0 is an authorization framework where a resource owner delegates limited access to a client via an authorization server. Common flows: Authorization Code (+ PKCE for SPAs/mobile), Client Credentials for service-to-service, and Refresh Token rotation. OAuth issues access tokens — it is not authentication by itself.',
  whyExists:
    'Users should not share passwords with third-party apps. OAuth lets users grant scoped access (read email, post tweets) without handing credentials to every integrator. Standardizes token issuance, refresh, and revocation across IdPs (Google, Okta, Auth0).',
  mentalModel:
    'User signs in at trusted IdP, approves scopes, client gets short-lived access token to call API on user behalf. Your API validates token signature/introspection — never trust client-supplied user id without token proof.',
  howItWorks: [
    {
      type: 'mermaid',
      caption: 'Authorization Code + PKCE (SPA/mobile)',
      diagram: `sequenceDiagram
  participant U as User
  participant App as Client app
  participant IdP as Authorization server
  participant API as Resource server
  App->>IdP: /authorize?code_challenge=...
  U->>IdP: login + consent scopes
  IdP-->>App: redirect ?code=...
  App->>IdP: POST /token code + code_verifier
  IdP-->>App: access_token refresh_token
  App->>API: GET /resource Authorization: Bearer`,
    },
    {
      type: 'table',
      headers: ['Flow', 'Use case', 'Key detail'],
      rows: [
        ['Authorization Code + PKCE', 'SPAs, mobile, user delegation', 'No client secret in browser; PKCE prevents code interception'],
        ['Client Credentials', 'Machine-to-machine', 'No user; client_id + secret or mTLS'],
        ['Refresh Token', 'Long sessions', 'Rotate on use; detect reuse for breach'],
        ['Device Code', 'TV/constrained input', 'User approves on phone'],
      ],
    },
    {
      type: 'list',
      items: [
        'Scopes limit what token can do — least privilege',
        'Access tokens short TTL (minutes); refresh longer with rotation',
        'Validate JWT locally (JWKS) or introspect opaque tokens',
        'Redirect URI allowlist prevents token theft via open redirect',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Spring Security OAuth2 Resource Server',
      code: `@Configuration
@EnableWebSecurity
class SecurityConfig {
  @Bean
  SecurityFilterChain api(HttpSecurity http) throws Exception {
    return http
        .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()))
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/public/**").permitAll()
            .anyRequest().authenticated())
        .build();
  }
}`,
    },
    {
      type: 'paragraph',
      text: 'Login with Google: SPA uses PKCE, exchanges code for tokens, sends access_token to your BFF/API. API validates aud/iss/exp and checks scope contains orders:read before returning data.',
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Authorization endpoint returns code bound to client + redirect + PKCE challenge',
        'Token endpoint exchanges code for tokens using client auth (secret or PKCE)',
        'JWT access tokens: signed claims sub, aud, scope, exp — verify with IdP JWKS',
        'Opaque tokens need introspection endpoint',
        'Refresh token rotation: new refresh on each use; revoke family on reuse attack',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['No password sharing with third parties', 'Standard flows and libraries', 'Scoped, revocable access'],
    disadvantages: ['Complex redirect/PKCE setup', 'Token validation burden on every service', 'Refresh token theft if stored insecurely'],
    alternatives: ['API keys for server-only M2M (weaker)', 'SAML for enterprise SSO', 'Session cookies with BFF pattern'],
    whenToUse: ['Third-party integrations', 'Social login', 'Mobile/SPA accessing user APIs'],
    whenNotToUse: ['Simple first-party monolith with session cookies only', 'When you need identity claims without OIDC layer'],
  },
  failureModes: [
    'Implicit flow in browser (deprecated) — token in URL fragment',
    'Missing PKCE on public clients — authorization code interception',
    'Over-broad scopes granted by default',
    'Trusting access token without aud/iss validation',
    'Long-lived refresh tokens without rotation',
    'Open redirect on redirect_uri validation',
  ],
  production: {
    security: ['PKCE mandatory for public clients', 'Rotate refresh tokens; bind to client', 'Short access token TTL', 'Strict redirect URI allowlist'],
    reliability: ['JWKS caching with kid rotation handling', 'Fallback introspection if JWKS stale'],
    observability: ['Log token validation failures by reason', 'Monitor refresh reuse anomalies'],
    maintainability: ['Centralize OAuth client config', 'Document scopes per API surface'],
  },
  interview: {
    expectations: ['Explain auth code + PKCE', 'OAuth vs authentication', 'Access vs refresh token roles'],
    commonQuestions: ['OAuth 2.0 flows?', 'How secure SPA login?', 'Validate JWT at API?'],
    followUps: ['PKCE why needed?', 'Refresh token rotation?', 'OAuth vs OIDC?'],
    misconceptions: ['OAuth is login (it is authorization)', 'JWT means no server validation needed', 'Client credentials for user apps'],
    traps: ['Recommending implicit flow', 'Storing refresh token in localStorage without threat model'],
    strongSignals: ['PKCE, scope least privilege, JWKS validation, BFF for cookie sessions'],
  },
  keyTakeaways: [
    'OAuth delegates authorization via tokens — not password sharing.',
    'Authorization Code + PKCE for public clients.',
    'Validate access tokens: signature, iss, aud, exp, scope.',
    'Refresh tokens need rotation and secure storage.',
    'Pair with OIDC when you need authenticated identity claims.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'What problem does OAuth 2.0 solve?', answerHint: 'Delegated access without sharing user password; scoped tokens for third-party clients.' },
    { level: 'intermediate', question: 'Why PKCE for SPAs?', answerHint: 'Public client cannot hold secret; PKCE binds auth code to code_verifier preventing interception.' },
    { level: 'advanced', question: 'How handle refresh token compromise?', answerHint: 'Rotation on each refresh; detect reuse and revoke token family; short access TTL limits blast radius.' },
  ],
  flashcards: [
    { front: 'OAuth 2.0', back: 'Authorization framework — delegated access via tokens, not authentication protocol alone' },
    { front: 'Authorization Code + PKCE', back: 'Standard SPA/mobile flow; code exchanged with code_verifier' },
    { front: 'Access vs refresh token', back: 'Access: short, calls API; refresh: longer, obtains new access tokens' },
    { front: 'Scope', back: 'Permission string limiting what token can do' },
  ],
  quickRevision: ['Delegate not share password', 'Auth code + PKCE', 'Validate JWT claims', 'Rotate refresh', 'OIDC adds identity'],
}
