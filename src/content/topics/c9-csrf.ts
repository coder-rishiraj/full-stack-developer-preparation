import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'CSRF (Cross-Site Request Forgery) tricks a victim browser into sending authenticated requests to a site where they are logged in—exploiting automatic cookie sending. Defenses: CSRF tokens (synchronizer pattern), SameSite cookies, double-submit cookie, and avoiding cookie-only auth for state-changing APIs without protection.',
  whyExists:
    'Browsers attach session cookies to cross-origin requests unless restricted. A malicious page can POST /transfer with victim cookies. CSRF tokens prove the request originated from your own frontend form/JS.',
  mentalModel:
    'Forged letter with victim signature: attacker site triggers browser to send victim cookies; server must require secret token only your legitimate page knows.',
  howItWorks: [
    {
      type: 'list',
      items: [
        'Login issues session cookie + CSRF token (header or form field).',
        'Mutating requests include token; server compares to session store.',
        'SameSite=Lax/Strict reduces cross-site cookie on POST.',
        'SPA with JWT in Authorization header immune to classic cookie CSRF.',
        'Double-submit: token in cookie and header must match.',
      ],
    },
    {
      type: 'mermaid',
      caption: 'CSRF attack vs token defense',
      diagram: `sequenceDiagram
  participant Victim
  participant Evil as evil.com
  participant Bank
  Evil->>Victim: Hidden form POST /transfer
  Victim->>Bank: Cookie sent automatically
  Note over Bank: Without CSRF token → attack succeeds
  Note over Bank: With CSRF token required → 403`,
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'evil.com auto-posts to bank.com/transfer with victim session cookie; server rejects without matching CSRF token header.',
    },
  ],
  tradeoffs: {
    advantages: ['CSRF token standard in forms', 'SameSite simple extra layer', 'Header JWT avoids cookie CSRF class'],
    disadvantages: ['Token plumbing in SPAs', 'SameSite breaks some OAuth flows', 'Double-submit weaker if XSS exists'],
    alternatives: ['SameSite=Strict/Lax cookies', 'OAuth state param', 'Custom header requirement'],
    whenToUse: ['Cookie session auth with browser forms', 'Server-rendered apps'],
    whenNotToUse: ['Pure Bearer token APIs no cookies', 'Server-to-server'],
  },
  failureModes: [
    'GET mutates state without CSRF protection.',
    'SameSite=None without Secure on cross-site cookies.',
    'CSRF token not rotated on login.',
    'XSS steals CSRF token—fix XSS first.',
  ],
  production: {
    security: ['CSRF on all state-changing cookie auth', 'SameSite=Lax default', 'Rotate token per session', 'Require custom header for APIs'],
    reliability: ['Clear 403 on token mismatch'],
    observability: ['CSRF failure metrics', 'Alert spikes'],
    maintainability: ['Spring CsrfFilter defaults for forms', 'Document SPA exemption with JWT'],
    performance: ['Minimal token validation overhead'],
    scalability: ['Token in session or signed double-submit'],
    cost: ['N/A'],
  },
  interview: {
    expectations: ['CSRF vs XSS vs CORS', 'Cookie auto-send mechanism', 'SameSite and CSRF token'],
    commonQuestions: ['Prevent CSRF in Spring?', 'JWT in header CSRF risk?'],
    followUps: ['Double-submit cookie?', 'SameSite Lax vs Strict?'],
    misconceptions: ['CORS prevents CSRF', 'HTTPS alone stops CSRF'],
    traps: ['State-changing GET endpoints', 'CSRF token in URL leaked via Referer'],
    strongSignals: ['Cookie + CSRF token + SameSite layered', 'SPA uses Authorization header'],
  },
  keyTakeaways: [
    'CSRF exploits automatic cookie submission.',
    'Use CSRF token on mutating cookie-auth requests.',
    'SameSite cookies reduce but do not replace tokens.',
    'Bearer JWT in header not vulnerable to classic CSRF.',
    'CORS does not prevent CSRF.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'CSRF attack mechanism?', answerHint: 'Malicious site triggers victim browser to send authenticated cookies to target site.' },
    { level: 'intermediate', question: 'SameSite=Lax effect?', answerHint: 'Cookies withheld on cross-site POST/subresource; sent on top-level GET navigation.' },
    { level: 'advanced', question: 'SPA with HttpOnly session cookie CSRF defense?', answerHint: 'CSRF token in meta/header double-submit; SameSite; or BFF issuing anti-CSRF.' },
  ],
  flashcards: [
    { front: 'CSRF prerequisite', back: 'Browser auto-sends auth cookies cross-site.' },
    { front: 'JWT Authorization header CSRF', back: 'Classic CSRF less relevant; XSS is bigger risk.' },
  ],
  quickRevision: [
    'Forged cookie requests',
    'CSRF token required',
    'SameSite helper',
    'Not fixed by CORS',
    'GET must not mutate',
    'JWT header safer pattern',
    'XSS breaks CSRF tokens',
  ],
}
