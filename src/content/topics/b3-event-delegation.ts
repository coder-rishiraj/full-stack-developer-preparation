import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Event delegation attaches a single listener on a stable ancestor instead of many listeners on dynamic children. When an event bubbles, the handler inspects event.target (often with closest) to determine which child was interacted with.',
  whyExists:
    'Lists, tables, and SPAs add/remove rows constantly. Per-row listeners leak memory and cost setup time. One delegated listener scales with DOM churn and matches how browsers naturally bubble events.',
  mentalModel:
    'One bouncer at the club entrance (parent) checks IDs (target/closest) instead of every guest (child) hiring their own bouncer. New guests automatically covered by the parent listener.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Attach listener on container (tbody, ul, document).',
        'On event, use e.target and closest(selector) to find matching child.',
        'Ignore clicks on non-matching targets or padding.',
        'Requires bubbling event type (click, not focus).',
        'Works with dynamically inserted nodes without rebinding.',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'React note',
      text: 'React 17+ synthetic events still support onClick on parent for delegation pattern — same idea as native.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'javascript',
      caption: 'Todo list delegation',
      code: `const list = document.querySelector('#todo-list');

list.addEventListener('click', (e) => {
  const btn = (e.target as HTMLElement).closest('[data-action]');
  if (!btn || !list.contains(btn)) return;

  const id = btn.closest('li')?.dataset.id;
  switch (btn.dataset.action) {
    case 'delete':
      deleteTodo(id);
      break;
    case 'toggle':
      toggleTodo(id);
      break;
  }
});

// New <li> elements work without new listeners`,
    },
    {
      type: 'code',
      language: 'typescript',
      caption: 'Typed delegation helper',
      code: `function delegate<K extends keyof HTMLElementEventMap>(
  root: Element,
  type: K,
  selector: string,
  handler: (e: HTMLElementEventMap[K], match: Element) => void
) {
  root.addEventListener(type, (e) => {
    const match = (e.target as Element).closest(selector);
    if (match && root.contains(match)) {
      handler(e as HTMLElementEventMap[K], match);
    }
  });
}

delegate(tbody, 'click', 'tr[data-row]', (e, row) => {
  console.log(row.getAttribute('data-row'));
});`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'event.target may be nested text node or icon inside button — closest essential.',
        'stopPropagation on child prevents delegation on ancestor.',
        'Capture-phase delegation possible but uncommon.',
        'Performance: one listener vs N; handler does slightly more work per event.',
        'Accessibility: ensure keyboard events delegated if custom widgets (keydown on container).',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Memory efficient for long lists',
      'Automatic handling of dynamic DOM',
      'Centralized event logic',
    ],
    disadvantages: [
      'More complex handler with closest checks',
      'Broken if child stops propagation',
      'Non-bubbling events cannot delegate',
    ],
    alternatives: ['Per-element listeners with cleanup on remove', 'Framework keyed lists with synthetic events'],
    whenToUse: ['Tables, menus, todo lists, any frequently updated collection'],
    whenNotToUse: ['Single static button', 'focus/blur without focusin delegation pattern'],
  },
  failureModes: [
    'Click on inner SVG/text misses button handler without closest.',
    'Child stopPropagation — parent never notified.',
    'Wrong container — contains check missing, false positives.',
    'Forgetting keyboard accessibility on delegated widgets.',
  ],
  production: {
    performance: ['One listener on tbody vs 1000 row listeners — major win'],
    reliability: ['Always closest + contains guard', 'Handle disabled elements'],
    maintainability: ['data-action attributes for clear dispatch switches'],
  },
  interview: {
    expectations: [
      'Explain why delegate vs N listeners',
      'Implement list click with closest',
      'Know bubbling requirement',
    ],
    commonQuestions: ['What is event delegation?', 'Benefits?', 'How identify clicked row?'],
    followUps: ['What if child stops propagation?', 'Delegate focus events?'],
    misconceptions: ['Delegation works for all event types'],
    traps: ['target vs currentTarget in delegation answer'],
    strongSignals: ['closest, single parent listener, dynamic nodes, memory leak prevention'],
  },
  keyTakeaways: [
    'One listener on ancestor; use target + closest.',
    'Ideal for dynamic lists and tables.',
    'Requires bubbling events (click, etc.).',
    'stopPropagation on child breaks delegation.',
    'Always verify match inside container with contains.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Why use event delegation on a todo list?',
      answerHint: 'One listener handles current and future items; saves memory/setup.',
    },
    {
      level: 'intermediate',
      question: 'How know which list item was clicked?',
      answerHint: 'e.target.closest("li") within bubbled click handler on ul.',
    },
    {
      level: 'advanced',
      question: 'When does delegation fail?',
      answerHint: 'Non-bubbling events, child stopPropagation, wrong closest selector.',
    },
  ],
  flashcards: [
    { front: 'Event delegation', back: 'Parent listener handles child events via bubble' },
    { front: 'closest', back: 'Find nearest ancestor matching selector from target' },
    { front: 'Why delegate', back: 'Dynamic DOM + fewer listeners + less leak risk' },
    { front: 'Requirement', back: 'Event must bubble to ancestor' },
  ],
  quickRevision: [
    'Listener on stable parent',
    'target + closest(selector)',
    'contains() guard',
    'Works for new children',
    'Needs bubbling event',
    'stopPropagation breaks it',
  ],
}
