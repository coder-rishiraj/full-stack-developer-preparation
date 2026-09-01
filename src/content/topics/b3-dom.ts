import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'The DOM (Document Object Model) is the browser\'s in-memory tree representation of HTML/XML documents. JavaScript interacts via APIs like document, Element, Node, querySelector, createElement, and classList to read structure, mutate nodes, and drive UI updates.',
  whyExists:
    'Pages start as markup strings. The browser parses them into a live object tree so scripts and CSS can query and modify content without full reloads. The DOM is the bridge between HTML, JavaScript, and rendering.',
  mentalModel:
    'HTML is the blueprint; DOM is the live building. Nodes are rooms (elements, text, comments). Traversal walks parent/child/sibling links. Mutations mark the tree dirty; the browser schedules layout and paint.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Document root → html → head/body → nested elements and text nodes.',
        'querySelector/querySelectorAll — CSS selector lookup.',
        'createElement, append, remove, replaceWith — structural mutations.',
        'textContent vs innerHTML — text safe; innerHTML parses HTML (XSS risk).',
        'classList, dataset, attributes — element state without inline handlers.',
        'Live vs static collections: NodeList from querySelectorAll is static; some older APIs live.',
      ],
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Reflow cost',
      text: 'Reading layout (offsetHeight) then writing style in a loop forces synchronous layout. Batch reads/writes; use DocumentFragment for bulk inserts.',
    },
  ],
  architecture: {
    mermaid: `flowchart TB
  Document[Document]
  Element[Element nodes]
  Text[Text nodes]
  JS[JavaScript APIs]
  Render[Layout / Paint]
  Document --> Element
  Element --> Text
  JS -->|mutate| Document
  Document -->|invalidates| Render`,
    caption: 'DOM tree mutations trigger rendering pipeline work',
  },
  example: [
    {
      type: 'code',
      language: 'javascript',
      caption: 'Query, create, and append',
      code: `const list = document.querySelector('#todo-list');

const item = document.createElement('li');
item.className = 'todo-item';
item.dataset.id = '42';
item.textContent = 'Learn DOM APIs';

list?.append(item);

// DocumentFragment — batch insert
const frag = document.createDocumentFragment();
for (const text of ['a', 'b', 'c']) {
  const li = document.createElement('li');
  li.textContent = text;
  frag.append(li);
}
list?.append(frag);`,
    },
    {
      type: 'code',
      language: 'typescript',
      caption: 'Typed DOM helpers',
      code: `function getById<T extends HTMLElement>(id: string): T | null {
  return document.getElementById(id) as T | null;
}

const form = getById<HTMLFormElement>('signup');
form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(form);
});`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Node types: ELEMENT_NODE, TEXT_NODE, DOCUMENT_NODE, etc.',
        'Shadow DOM encapsulates subtree for Web Components.',
        'MutationObserver watches DOM changes asynchronously.',
        'HTML parsing builds DOM; incremental parsing during download.',
        'React/Vue virtual DOM diff before touching real DOM for performance.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Universal browser API for dynamic UIs',
      'Fine-grained control without frameworks',
      'Standardized across engines (with minor quirks)',
    ],
    disadvantages: [
      'Manual DOM updates error-prone at scale',
      'Layout thrashing if misused',
      'innerHTML XSS if user content unsanitized',
    ],
    alternatives: ['Virtual DOM frameworks', 'Declarative templates (Web Components lit)', 'Canvas/WebGL for non-DOM UI'],
    whenToUse: ['Direct manipulation, legacy pages, small widgets, understanding framework foundations'],
    whenNotToUse: ['Large app state — prefer framework reconciliation'],
  },
  failureModes: [
    'Null from querySelector when selector wrong or element not yet parsed.',
    'XSS via innerHTML with user input.',
    'Memory leaks: detached DOM nodes held by JS references.',
    'Assuming NodeList is array — use for...of or Array.from.',
  ],
  production: {
    performance: ['Batch DOM writes; use requestAnimationFrame for visual updates', 'Avoid layout reads in loops'],
    reliability: ['Prefer textContent or sanitized HTML', 'Use event delegation for dynamic lists'],
    maintainability: ['Data attributes for JS hooks; BEM/classes for styling'],
    security: ['Never innerHTML untrusted input; use DOMPurify if HTML required'],
  },
  interview: {
    expectations: [
      'Explain DOM tree structure',
      'querySelector vs getElementById',
      'textContent vs innerHTML',
      'Why frameworks use virtual DOM',
    ],
    commonQuestions: ['What is the DOM?', 'Difference Node vs Element?', 'What causes reflow?'],
    followUps: ['DocumentFragment purpose?', 'Shadow DOM?'],
    misconceptions: ['DOM is the same as HTML source string'],
    traps: ['Live HTMLCollection vs static NodeList'],
    strongSignals: ['Mentions reflow, XSS, batching, MutationObserver'],
  },
  keyTakeaways: [
    'DOM = live tree API for documents.',
    'Prefer textContent; sanitize innerHTML.',
    'Batch mutations to reduce layout cost.',
    'querySelector uses CSS selectors.',
    'Frameworks abstract direct DOM for scale.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What is the DOM?',
      answerHint: 'Object tree representation of document; JS interface to read/mutate nodes.',
    },
    {
      level: 'intermediate',
      question: 'textContent vs innerHTML?',
      answerHint: 'textContent plain text; innerHTML parses HTML — XSS risk with user data.',
    },
    {
      level: 'advanced',
      question: 'What is layout thrashing?',
      answerHint: 'Interleaved layout reads/writes forcing sync reflow — batch reads then writes.',
    },
  ],
  flashcards: [
    { front: 'DOM', back: 'Document Object Model — live node tree' },
    { front: 'textContent', back: 'Plain text — no HTML parse' },
    { front: 'DocumentFragment', back: 'Off-DOM container for batch inserts' },
    { front: 'Reflow', back: 'Layout recalc after geometry-affecting change' },
  ],
  quickRevision: [
    'Tree: Document → Element → Text',
    'querySelector / createElement',
    'textContent not innerHTML for user text',
    'Batch DOM updates',
    'Node vs Element',
    'Frameworks diff before DOM touch',
  ],
}
