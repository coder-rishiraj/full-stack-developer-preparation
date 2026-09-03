import type { TopicContent } from '@/domain/types'

export const tlsContent: TopicContent = {
  whatIsIt:
    'TLS (Transport Layer Security, successor to SSL) is a cryptographic protocol providing confidentiality, integrity, and optional client authentication over TCP. TLS 1.2 and 1.3 are current; handshake negotiates cipher suite, exchanges keys, verifies certificates.',
  whyExists:
    'Applications need secure channels without building crypto themselves. TLS standardizes cipher negotiation, certificate validation, and record encryption used by HTTPS, email, databases, and gRPC.',
  mentalModel:
    'Handshake establishes shared secret and verifies identity. Application data split into TLS records, encrypted with AEAD ciphers (AES-GCM, ChaCha20-Poly1305). Certificates bind public key to domain via CA signature.',
  howItWorks: [
    {
      type: 'mermaid',
      caption: 'TLS 1.3 simplified handshake',
      diagram: `sequenceDiagram
  participant C as Client
  participant S as Server
  C->>S: ClientHello (ciphers, key share)
  S->>C: ServerHello, cert, Finished
  C->>S: Finished
  Note over C,S: Application data encrypted`,
    },
    {
      type: 'table',
      headers: ['Concept', 'Role'],
      rows: [
        ['Certificate', 'Server public key + domain + CA signature'],
        ['Cipher suite', 'Key exchange + AEAD encryption + hash'],
        ['SNI', 'Client sends intended hostname in ClientHello'],
        ['ALPN', 'Negotiates application protocol (h2, http/1.1)'],
        ['Forward secrecy', 'ECDHE ephemeral keys — past traffic safe if long-term key stolen'],
      ],
    },
    {
      type: 'list',
      items: [
        'TLS 1.3 completes a full handshake in 1 RTT; a new HTTPS-over-TCP connection also pays the TCP handshake first.',
        'Mutual TLS (mTLS): client also presents certificate.',
        'Session tickets / PSK resumption reduces handshake RTT.',
        'OCSP stapling: server attaches cert revocation status.',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'bash',
      caption: 'Inspect certificate with openssl',
      code: `openssl s_client -connect api.example.com:443 -servername api.example.com </dev/null 2>/dev/null | openssl x509 -noout -subject -dates`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Custom trust store (conceptual)',
      code: `SSLContext ctx = SSLContext.getInstance("TLS");
KeyStore trustStore = KeyStore.getInstance("PKCS12");
// load trustStore with CA certs
TrustManagerFactory tmf = TrustManagerFactory.getInstance(TrustManagerFactory.getDefaultAlgorithm());
tmf.init(trustStore);
ctx.init(null, tmf.getTrustManagers(), new SecureRandom());`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'X.509 certificate format; PEM base64 between BEGIN/END CERTIFICATE.',
        'Certificate pinning: app trusts specific pub key — breaks on cert rotation if misused.',
        'JA3/JA4 fingerprint TLS client hello for bot detection.',
        'Downgrade attacks mitigated by TLS 1.3 version enforcement.',
        'Perfect forward secrecy requires ephemeral (ECDHE) key exchange.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Industry-standard vetted protocol',
      'Flexible cipher negotiation and ALPN for HTTP/2',
      'mTLS for strong service identity',
    ],
    disadvantages: [
      'Handshake latency especially cold start',
      'Certificate management operational burden',
      'Complex misconfiguration surface (weak ciphers, old TLS)',
    ],
    alternatives: [
      'QUIC embeds TLS 1.3 for HTTP/3',
      'IPsec VPN layer (different scope)',
    ],
    whenToUse: [
      'Any untrusted network transport',
      'Public HTTPS and inter-service encryption',
    ],
    whenNotToUse: [
      'TLS 1.0/1.1 (deprecated, insecure)',
      'Custom crypto instead of TLS without expert review',
    ],
  },
  failureModes: [
    'Weak cipher suites enabled (RC4, 3DES).',
    'Certificate expired or wrong SAN for hostname.',
    'Missing intermediate cert in chain.',
    'Revoked cert without stapling/OCSP check.',
    'TLS termination misconfig leaking HTTP internally.',
  ],
  interview: {
    expectations: [
      'Describe TLS handshake at high level',
      'Role of certificates and CAs',
      'TLS 1.3 improvements over 1.2',
    ],
    commonQuestions: [
      'How TLS handshake works?',
      'What is certificate chain?',
      'TLS vs SSL?',
      'What is mTLS?',
    ],
    followUps: [
      'Forward secrecy meaning?',
      'SNI purpose?',
    ],
    misconceptions: [
      'TLS encrypts DNS lookup (DNS happens before TLS)',
      'Any certificate makes site “verified business” (DV vs EV)',
      'TLS protects against XSS (application layer issue)',
    ],
    traps: ['Explaining SSL 3.0 as current — say TLS 1.2/1.3'],
    strongSignals: [
      'Mentions AEAD, forward secrecy, ALPN',
      'Certificate validation steps',
      'mTLS for service mesh',
    ],
  },
  keyTakeaways: [
    'TLS handshake negotiates keys and verifies cert.',
    'Certificates: domain + pubkey signed by CA.',
    'TLS 1.3 faster, fewer weak options.',
    'SNI for virtual hosts; ALPN for HTTP/2.',
    'mTLS authenticates client too.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What three properties does TLS provide?',
      answerHint: 'Confidentiality, integrity, authentication (server, optionally client).',
    },
    {
      level: 'intermediate',
      question: 'What is forward secrecy?',
      answerHint: 'Ephemeral key exchange — compromise of long-term key doesn’t decrypt past sessions.',
    },
    {
      level: 'advanced',
      question: 'What is SNI and why needed?',
      answerHint: 'Client sends hostname in ClientHello so server picks correct cert on shared IP.',
    },
  ],
  flashcards: [
    { front: 'TLS 1.3 full handshake', back: '1 RTT for TLS, in addition to a cold TCP handshake' },
    { front: 'ALPN', back: 'Negotiates h2 vs http/1.1 during TLS handshake' },
    { front: 'mTLS', back: 'Client and server both present certificates' },
  ],
  quickRevision: [
    'TLS not SSL',
    'Cert chain to CA',
    'ECDHE forward secrecy',
    'AES-GCM AEAD',
    'SNI hostname',
    'ALPN for HTTP/2',
    'TLS 1.3 preferred',
  ],
}

export const content = tlsContent
