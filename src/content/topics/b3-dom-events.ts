import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'DOM events are the browser\'s notification system — user input, network, animation, and custom signals propagate as Event objects through targets. Core APIs: addEventListener, removeEventListener, dispatchEvent, and typed events (MouseEvent, KeyboardEvent, InputEvent).',
  whyExists:
    'UIs are reactive. Instead of polling, the browser emits events when actions occur. Decoupled listeners keep HTML, CSS, and JS maintainable and enable accessibility, delegation, and framework synthetic event layers.',
  mentalModel:
    'Something happens on a node → browser creates Event → delivery follows capture/target/bubble phases → listeners run. preventDefault blocks default browser action; stopPropagation limits further propagation.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'addEventListener(type, handler, options) — options: capture, once, passive, signal.',
        'Event phases: capture (window → target), target, bubble (target → window).',
        'preventDefault — e.g. block form submit or link navigation.',
        'stopPropagation / stopImmediatePropagation — control listener chain.',
        'CustomEvent for app-level signals with detail payload.',
        'Passive listeners — scroll/touch cannot preventDefault (performance).',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Modern listener hygeine',
      text: 'Use { signal: abortController.signal } to remove all listeners on unmount. Prefer { passive: true } on scroll unless you must preventDefault.',
    },
  ],
  architecture: {
    mermaid: `flowchart LR
  Source[User / Network / Timer]
  Target[Event target node]
  Listeners[Registered listeners]
  Default[Default browser action]
  Source --> Target
  Target --> Listeners
  Listeners -->|preventDefault| Default`,
    caption: 'Events flow through phases; listeners can cancel default behavior',
  },
  example: [
    {
      type: 'code',
      language: 'javascript',
      caption: 'Listeners with options and cleanup',
      code: `const controller = new AbortController();
const { signal } = controller;

button.addEventListener('click', (e) => {
  e.preventDefault();
  console.log('clicked', e.currentTarget);
}, { signal, once: false });

// cleanup on route change
function unmount() {
  controller.abort(); // removes all listeners using this signal
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(form);
}, { signal });`,
    },
    {
      type: 'code',
      language: 'typescript',
      caption: 'Typed events and custom dispatch',
      code: `const bus = document.createElement('div');

type CartUpdateDetail = { itemId: string; qty: number };

bus.addEventListener('cart:update', ((e: CustomEvent<CartUpdateDetail>) => {
  console.log(e.detail.itemId, e.detail.qty);
}) as EventListener);

bus.dispatchEvent(
  new CustomEvent<CartUpdateDetail>('cart:update', {
    detail: { itemId: 'sku-1', qty: 2 },
    bubbles: true,
  })
);`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'EventTarget interface on Element, Document, Window.',
        'Composed events cross shadow DOM boundary when composed: true.',
        'Focus events do not bubble (focusin/focusout do).',
        'Pointer events unify mouse/touch/pen.',
        'React 17+ attaches to root — know native vs synthetic ordering in tests.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Decoupled reactive UI',
      'Delegation handles dynamic children',
      'Standard across browsers for core types',
    ],
    disadvantages: [
      'Listener leaks if not removed',
      'Wrong phase/capture confuses debugging',
      'Non-passive scroll handlers hurt performance',
    ],
    alternatives: ['Event delegation pattern', 'Framework event systems', 'RxJS fromEvent'],
    whenToUse: ['All interactive UI, form handling, custom app events'],
    whenNotToUse: ['Heavy logic in capture on document without need — prefer targeted listeners'],
  },
  failureModes: [
    'Forgetting removeEventListener — same function reference required.',
    'Stale closure in handler reading old state.',
    'preventDefault on passive listener — ignored with console warning.',
    'Assuming all events bubble — focus/blur do not.',
  ],
  production: {
    performance: ['Passive scroll/touch listeners', 'Debounce expensive handlers'],
    reliability: ['AbortSignal cleanup in SPAs', 'Pointer events for unified input'],
    maintainability: ['One listener + delegation vs N listeners on list items'],
  },
  interview: {
    expectations: [
      'addEventListener phases and options',
      'preventDefault vs stopPropagation',
      'CustomEvent pattern',
    ],
    commonQuestions: ['Event phases?', 'passive listener?', 'How remove listeners?'],
    followUps: ['Delegation?', 'React synthetic events?'],
    misconceptions: ['stopPropagation stops default action'],
    traps: ['focus vs focusin bubbling'],
    strongSignals: ['AbortSignal, passive, capture flag, CustomEvent detail'],
  },
  keyTakeaways: [
    'Events notify listeners on targets with capture/target/bubble phases.',
    'preventDefault blocks default; stopPropagation stops propagation.',
    'Use signal option for bulk cleanup.',
    'Passive listeners for scroll performance.',
    'CustomEvent for app-level pub/sub on nodes.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What does preventDefault do?',
      answerHint: 'Cancels default browser behavior if cancelable — e.g. form submit.',
    },
    {
      level: 'intermediate',
      question: 'Third argument to addEventListener?',
      answerHint: 'Options: capture, once, passive, signal — or legacy useCapture boolean.',
    },
    {
      level: 'advanced',
      question: 'Why use passive: true on scroll listeners?',
      answerHint: 'Browser can scroll without waiting to see if preventDefault called — smoother.',
    },
  ],
  flashcards: [
    { front: 'preventDefault', back: 'Block default browser action' },
    { front: 'stopPropagation', back: 'Stop event traveling to other nodes' },
    { front: 'passive listener', back: 'Cannot preventDefault — faster scroll' },
    { front: 'CustomEvent', back: 'App events with detail payload' },
  ],
  quickRevision: [
    'Capture → target → bubble',
    'preventDefault vs stopPropagation',
    'AbortSignal cleanup',
    'passive for scroll',
    'focus does not bubble',
    'CustomEvent + dispatchEvent',
  ],
}
