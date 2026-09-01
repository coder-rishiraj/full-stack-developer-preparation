import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Event capturing ( trickling ) is the phase where an event travels from the window down through ancestors to the target, before the target and bubble phases. Register with addEventListener(..., { capture: true }) to run listeners during this downward journey.',
  whyExists:
    'Capture lets ancestors intercept or prepare before the target handles an event — useful for global shortcuts, logging, or stopping events before they reach nested components. Full event model requires both directions.',
  mentalModel:
    'Waterfall from the sky (window) down to the leaf (target), then bubbles back up. Capture listeners are the nets at each tier on the way down; bubble listeners catch on the way up.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Order: capture phase → target phase → bubble phase.',
        'Same element with both capture and bubble listeners: capture runs first.',
        'Legacy third param true = capture; false/omit = bubble.',
        'stopPropagation during capture prevents reaching target and bubble.',
        'Most app code uses bubble; capture for interception patterns.',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Interview ordering',
      text: 'window capture → ... → target capture → target bubble → ... → window bubble. Same node: capture before bubble.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'javascript',
      caption: 'Capture vs bubble order',
      code: `outer.addEventListener('click', () => console.log('outer capture'), true);
inner.addEventListener('click', () => console.log('inner capture'), true);
outer.addEventListener('click', () => console.log('outer bubble'));
inner.addEventListener('click', () => console.log('inner bubble'));

// click inner:
// outer capture → inner capture → inner bubble → outer bubble`,
    },
    {
      type: 'code',
      language: 'javascript',
      caption: 'Intercept before children',
      code: `document.addEventListener('click', (e) => {
  const link = (e.target as HTMLElement).closest('a');
  if (link && link.dataset.external === 'true') {
    e.preventDefault();
    openExternal(link.href);
  }
}, true); // capture — run before nested handlers`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Event.NONE = 0, CAPTURING_PHASE = 1, AT_TARGET = 2, BUBBLING_PHASE = 3.',
        'event.eventPhase indicates current phase.',
        'Not all events participate in capture meaningfully — same events as bubble set mostly.',
        'Browser devtools “Event listeners” panel shows capture flag.',
        'React 17+ delegates at root in bubble phase by default — know test differences.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Global interception before target handlers',
      'Implement document-level policies early',
      'Complete mental model of DOM events',
    ],
    disadvantages: [
      'Surprising order for developers expecting only bubble',
      'Overuse complicates debugging',
      'stopPropagation in capture blocks children entirely',
    ],
    alternatives: ['Bubble-phase delegation with closest()', 'Pointer capture API for drag (different concept)'],
    whenToUse: ['Document-level guards, analytics capture, blocking nested clicks'],
    whenNotToUse: ['Routine button clicks — bubble + delegation suffices'],
  },
  failureModes: [
    'Capture listener stopPropagation — child never receives event.',
    'Mixing capture and bubble without documenting order.',
    'Confusing pointer capture (setPointerCapture) with event capture phase.',
    'Assuming React always matches native capture order in tests.',
  ],
  production: {
    maintainability: ['Rare capture — comment why capture: true chosen'],
    reliability: ['Avoid stopPropagation in capture unless intentional firewall'],
  },
  interview: {
    expectations: [
      'State full three-phase order',
      'Register capture listener syntax',
      'Contrast with bubbling direction',
    ],
    commonQuestions: ['Capture vs bubble?', 'Listener execution order click nested divs?'],
    followUps: ['stopPropagation in capture?', 'Pointer capture same thing?'],
    misconceptions: ['Capture is deprecated — it is not'],
    traps: ['Pointer capture vs event capture phase'],
    strongSignals: ['window→target→window diagram, capture:true, eventPhase'],
  },
  keyTakeaways: [
    'Capture travels window → target before bubble.',
    'addEventListener(..., { capture: true }).',
    'Same node: capture listeners before bubble listeners.',
    'stopPropagation in capture blocks target and bubble.',
    'Pointer capture is separate API for drag tracking.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Which runs first — capture or bubble listener on same element?',
      answerHint: 'Capture runs before bubble on the same element.',
    },
    {
      level: 'intermediate',
      question: 'Full order clicking nested inner inside outer?',
      answerHint: 'outer capture → inner capture → inner bubble → outer bubble (simplified).',
    },
    {
      level: 'advanced',
      question: 'Is pointer capture the same as capture phase?',
      answerHint: 'No — setPointerCapture routes pointer events to an element during drag.',
    },
  ],
  flashcards: [
    { front: 'Capture phase', back: 'Window down to target' },
    { front: 'capture: true', back: 'Register listener for capture phase' },
    { front: 'Three phases', back: 'Capture → target → bubble' },
    { front: 'Pointer capture', back: 'Different — retargets pointer events to element' },
  ],
  quickRevision: [
    'Capture = top-down',
    'Bubble = bottom-up',
    'capture:true option',
    'Capture before bubble on same node',
    'stopPropagation blocks later phases',
    'Not pointer capture',
  ],
}
