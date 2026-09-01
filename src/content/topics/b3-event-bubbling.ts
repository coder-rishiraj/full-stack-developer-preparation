import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Event bubbling is the propagation phase where an event travels from the target element up through ancestor nodes toward the window. Most events bubble by default (click, input), enabling parent listeners to observe child activity.',
  whyExists:
    'Without bubbling, every leaf element would need its own listener — painful for dynamic lists. Bubbling lets ancestors handle events from descendants, powering delegation and compound components.',
  mentalModel:
    'Ripple in a pond starting at the clicked button — ripple moves outward/up the family tree. Parent listeners on the bubble phase run after the target\'s own listeners (unless capture registered).',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Target phase: listeners on the element that triggered the event.',
        'Bubble phase: ancestors from parent to window — default addEventListener phase.',
        'event.target — deepest element that triggered; event.currentTarget — element whose listener runs.',
        'stopPropagation stops further bubbling to parents.',
        'Some events do not bubble: focus, blur, scroll (on element), load on img (varies).',
      ],
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'focusin vs focus',
      text: 'focus/blur do not bubble. focusin/focusout bubble — use when parent needs focus awareness.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'javascript',
      caption: 'Bubble order demonstration',
      code: `div.addEventListener('click', () => console.log('div bubble'));
button.addEventListener('click', () => console.log('button bubble'));

// click button logs:
// button bubble
// div bubble

button.addEventListener('click', (e) => {
  e.stopPropagation();
  console.log('stopped');
});
// only button logs if propagation stopped`,
    },
    {
      type: 'code',
      language: 'javascript',
      caption: 'target vs currentTarget',
      code: `list.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;
  const current = e.currentTarget as HTMLElement;

  // target — actual clicked node (maybe <span> inside <li>)
  // currentTarget — always <ul> list

  const li = target.closest('li');
  if (li && list.contains(li)) {
    console.log('row id', li.dataset.id);
  }
});`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Event path ordered list of nodes event travels through.',
        'Shadow DOM: retargeting may make event.target appear as host in some cases.',
        'Composed events (click) exit shadow roots; non-composed stay internal.',
        'Browser default actions may occur after bubbling handlers (link navigation).',
        'stopImmediatePropagation blocks other listeners on same element same phase.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Enables event delegation',
      'Fewer listeners on large lists',
      'Natural compound widget behavior',
    ],
    disadvantages: [
      'Unexpected parent handlers if propagation not stopped',
      'Debugging order across many listeners',
      'Non-bubbling events require direct binding',
    ],
    alternatives: ['Capture phase listening instead', 'Explicit per-element listeners'],
    whenToUse: ['Delegation, modal backdrop click-to-close, document-level shortcuts'],
    whenNotToUse: ['When only leaf should react and parents must never know — stopPropagation'],
  },
  failureModes: [
    'Click on nested interactive element triggers parent handler unintentionally.',
    'Assuming focus events bubble.',
    'stopPropagation breaks delegation expecting bubble.',
    'Confusing target with currentTarget in delegation.',
  ],
  production: {
    performance: ['One delegated listener vs thousands on list rows'],
    reliability: ['Use closest() to match intended delegate target'],
    maintainability: ['Document which handlers stop propagation'],
  },
  interview: {
    expectations: [
      'Explain bubble phase direction',
      'target vs currentTarget',
      'Which events do not bubble',
    ],
    commonQuestions: ['What is event bubbling?', 'Order of listener execution?', 'stopPropagation effect?'],
    followUps: ['Capture vs bubble?', 'Delegation implementation?'],
    misconceptions: ['All events bubble'],
    traps: ['focus bubbling question'],
    strongSignals: ['Mentions upward propagation, delegation, closest, focusin alternative'],
  },
  keyTakeaways: [
    'Bubble = event travels up from target to ancestors.',
    'Default listeners run in bubble phase.',
    'target = origin; currentTarget = listener owner.',
    'stopPropagation halts upward travel.',
    'focus/blur don\'t bubble; focusin/focusout do.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What direction does bubbling travel?',
      answerHint: 'From target up through parents to window.',
    },
    {
      level: 'intermediate',
      question: 'Difference event.target and event.currentTarget?',
      answerHint: 'target = clicked element; currentTarget = element with active listener.',
    },
    {
      level: 'advanced',
      question: 'Name events that do not bubble.',
      answerHint: 'focus, blur, load (element), scroll on element — focusin/focusout bubble instead.',
    },
  ],
  flashcards: [
    { front: 'Bubbling', back: 'Target → parent → ... → window' },
    { front: 'event.target', back: 'Deepest element that triggered event' },
    { front: 'stopPropagation', back: 'Stops further bubbling to ancestors' },
    { front: 'Non-bubbling', back: 'focus, blur — use focusin/focusout' },
  ],
  quickRevision: [
    'Bubble goes up tree',
    'Default listener phase',
    'target vs currentTarget',
    'stopPropagation stops bubble',
    'Delegation uses bubble',
    'focus doesn\'t bubble',
  ],
}
