import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Password hashing transforms passwords into one-way digests stored in the database. Modern algorithms: bcrypt, scrypt, Argon2 (winner of PHC). Use per-user salt and tunable work factor. Never store plaintext or reversible encryption for passwords. Spring: BCryptPasswordEncoder, Argon2PasswordEncoder.',
  whyExists:
    'Databases leak. If passwords are hashed properly, attackers must crack each hash offline — slow algorithms and salts make mass cracking impractical. Plaintext or MD5/SHA1 without salt enables instant credential stuffing at scale.',
  mentalModel:
    'Hashing is a one-way slow function with salt — like a unique heavy lock per user. Login: hash submitted password with stored salt/work factor and compare constant-time. Pepper (app secret) adds defense if DB alone leaks.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Algorithm', 'Properties', 'Spring support'],
      rows: [
        ['bcrypt', 'Built-in salt, cost factor 2^n', 'BCryptPasswordEncoder — widely used default'],
        ['Argon2id', 'Memory-hard, resists GPU/ASIC', 'Argon2PasswordEncoder — preferred for new systems'],
        ['scrypt', 'Memory-hard', 'Less common in Java stacks'],
        ['PBKDF2', 'FIPS-friendly', 'Pbkdf2PasswordEncoder — acceptable if tuned high iterations'],
      ],
    },
    {
      type: 'list',
      ordered: true,
      items: [
        'User registers — generate salt, hash password, store hash string only',
        'Login — fetch hash, run same algorithm on input, constant-time equals compare',
        'Increase work factor periodically as hardware improves',
        'Optional pepper in HSM/env — not stored in DB row',
      ],
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Spring Security password encoding',
      code: `@Bean
PasswordEncoder passwordEncoder() {
  return Argon2PasswordEncoder.defaultsForSpringSecurity_v5_8();
}

// Registration
String hash = passwordEncoder.encode(rawPassword);
userRepository.save(new User(email, hash));

// Login — Spring Security DaoAuthenticationProvider compares automatically`,
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Stored value looks like $argon2id$v=19$m=65536,t=3,p=4$salt$hash — algorithm embeds parameters. On login failure, same generic error as unknown user to prevent enumeration (with rate limiting).',
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Salt prevents rainbow tables — unique per password',
        'Work factor / memory cost increases brute-force cost',
        'Constant-time comparison prevents timing leaks on password check',
        'Legacy MD5/sha1 passwords: verify then rehash on successful login (upgrade path)',
        'Do not roll custom crypto — use vetted libraries',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Protects users when DB exfiltrated', 'Tunable cost as CPUs improve', 'Standard library support'],
    disadvantages: ['CPU cost on login — needs rate limiting anyway', 'Cannot recover password — reset flow required', 'Wrong algorithm choice obsolete quickly'],
    alternatives: ['Passwordless (WebAuthn, magic link)', 'Federated OIDC — no local password'],
    whenToUse: ['Any local password authentication'],
    whenNotToUse: ['Storing API secrets (use vault, not user password hash flow)'],
  },
  failureModes: [
    'MD5/SHA1 single iteration — cracked in seconds',
    'Same salt for all users',
    'Timing attack on string equals compare',
    'Logging registration password by mistake',
    'No rate limit — online brute force despite hash',
    'Emailing plaintext temp password without force change',
  ],
  production: {
    security: ['Argon2id or bcrypt with appropriate cost', 'Rate limit + lockout + MFA for sensitive apps', 'Pepper in KMS optional layer'],
    performance: ['Auth nodes sized for hash CPU; async not applicable to verify path'],
    observability: ['Alert on auth failure spikes', 'Never log password fields'],
    maintainability: ['Document upgrade path for legacy hashes', 'Central PasswordEncoder bean'],
  },
  interview: {
    expectations: ['Why salt and slow hash', 'bcrypt vs Argon2', 'How Spring verifies'],
    commonQuestions: ['How store passwords?', 'Rainbow tables?', 'Increase cost factor?'],
    followUps: ['Pepper vs salt?', 'Upgrade legacy hashes?'],
    misconceptions: ['Encrypt passwords reversibly for forgot password', 'SHA256 alone is enough'],
    traps: ['Recommending MD5 or single SHA256'],
    strongSignals: ['Argon2id/bcrypt, constant-time compare, rate limit, passwordless option'],
  },
  keyTakeaways: [
    'Never store plaintext passwords.',
    'Use Argon2id or bcrypt with per-user salt and high work factor.',
    'Compare hashes in constant time.',
    'Rehash on login when upgrading legacy algorithms.',
    'Combine with rate limiting and MFA for defense in depth.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Why hash passwords?', answerHint: 'DB leaks should not expose usable passwords; slow salted hash forces expensive offline cracking.' },
    { level: 'intermediate', question: 'Salt purpose?', answerHint: 'Unique per user — defeats rainbow tables; same password gets different hashes.' },
    { level: 'advanced', question: 'Argon2 vs bcrypt?', answerHint: 'Argon2id memory-hard — better vs GPU/ASIC; bcrypt battle-tested with simpler tuning.' },
  ],
  flashcards: [
    { front: 'Password hashing', back: 'One-way slow function with salt — not encryption' },
    { front: 'Salt', back: 'Random per-user value stored with hash — stops rainbow tables' },
    { front: 'Work factor', back: 'Tunable cost — increase as hardware improves' },
    { front: 'Argon2id', back: 'Memory-hard PHC winner — strong default for new apps' },
  ],
  quickRevision: ['Never plaintext', 'Argon2/bcrypt + salt', 'Constant-time compare', 'Rate limit login', 'Upgrade legacy on login'],
}
