import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'JWT (JSON Web Token) is a compact signed token format: header.payload.signature (Base64URL). Claims (sub, exp, iss, aud, scopes) are signed with HMAC or RSA/ECDSA. Servers verify signature and claims without session store—stateless authentication for APIs and microservices.',
  whyExists:
    'Horizontal scaling favors stateless credentials. JWT carries identity and metadata across services if all trust the signing key (JWKS). Standard in OAuth2 access tokens and SPA/BFF patterns.',
  mentalModel:
    'Tamper-evident signed JSON envelope: anyone can read payload (not encrypted by default), but only issuer can produce valid signature.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Issuer signs header+payload with secret/private key.',
        'Client sends Authorization: Bearer <jwt>.',
        'Resource server validates signature via JWKS or shared secret.',
        'Check exp, nbf, iss, aud, required claims.',
        'Use short TTL + refresh token for revocation gap.',
      ],
    },
    {
      type: 'code',
      language: 'text',
      caption: 'JWT structure',
      code: `eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJ1LTEiLCJleHAiOjE3MDAwMDAwMDB9.SIGNATURE
# header: alg, typ
# payload: sub, exp, custom claims
# signature: sign(base64(header).base64(payload))`,
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'Spring validate JWT resource server (concept)',
      code: `@Configuration
@EnableWebSecurity
public class SecurityConfig {
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
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Payload {"sub":"user-7","exp":1700000000} signed RS256; API rejects tampered payload or expired exp on each request.',
    },
  ],
  tradeoffs: {
    advantages: ['Stateless verification', 'Cross-service identity propagation', 'Standard libraries'],
    disadvantages: ['Hard to revoke before exp', 'Payload readable—no secrets inside', 'Key rotation complexity'],
    alternatives: ['Opaque tokens + introspection endpoint', 'Session cookies server-side'],
    whenToUse: ['API/microservice AuthN', 'OAuth2 access tokens'],
    whenNotToUse: ['Long-lived privileged tokens', 'Store sensitive PII in payload'],
  },
  failureModes: [
    'alg=none attack if validator accepts.',
    'Weak HMAC secret.',
    'No exp validation or clock skew handling.',
    'Trusting client-modified claims without signature verify.',
    'localStorage XSS token theft.',
  ],
  production: {
    security: ['RS256+JWKS rotation', 'Reject none alg', 'Short access token TTL', 'HttpOnly cookie BFF for browser'],
    reliability: ['JWKS cache with backoff', 'Leeway on exp skew'],
    observability: ['Token validation failure reasons', 'expired vs bad signature metrics'],
    maintainability: ['Central JwtDecoder bean', 'Versioned signing keys'],
    performance: ['Local signature verify O(1) per request'],
    scalability: ['No session store lookup'],
    cost: ['Managed IdP issues JWT vs operate keys'],
  },
  interview: {
    expectations: ['Structure header.payload.sig', 'Validate signature exp iss aud', 'Revocation limitations'],
    commonQuestions: ['JWT vs session?', 'Where store SPA token?', 'How revoke JWT?'],
    followUps: ['JWE vs JWS?', 'Refresh token rotation?'],
    misconceptions: ['JWT encrypted by default', 'Put passwords in JWT'],
    traps: ['Accept HS256 with public secret', 'Skip aud/iss check'],
    strongSignals: ['BFF HttpOnly pattern', 'Refresh rotation + blocklist for compromise'],
  },
  keyTakeaways: [
    'JWT is signed JSON claims—not encrypted by default.',
    'Verify signature, exp, iss, aud every request.',
    'Short TTL; refresh for longevity; revocation hard.',
    'Never store secrets in payload; XSS steals browser tokens.',
    'Prefer RS256 + JWKS for multi-service trust.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'JWT three parts?', answerHint: 'Header, payload, signature Base64URL joined by dots.' },
    { level: 'intermediate', question: 'How revoke JWT before exp?', answerHint: 'Short TTL, refresh token revoke, token blocklist/denylist, or session version claim.' },
    { level: 'advanced', question: 'Secure JWT in browser SPA?', answerHint: 'BFF with HttpOnly Secure SameSite cookie; avoid localStorage; PKCE for OAuth.' },
  ],
  flashcards: [
    { front: 'JWT confidential by default?', back: 'No—signed (JWS) not encrypted; payload Base64 readable.' },
    { front: 'Minimum JWT validation checks', back: 'Signature, exp, iss, aud as applicable.' },
  ],
  quickRevision: [
    'header.payload.signature',
    'Verify sig + exp',
    'Not encrypted default',
    'Short TTL + refresh',
    'No secrets in payload',
    'BFF HttpOnly browser',
    'Reject alg none',
  ],
}
