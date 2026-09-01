import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Responding to interviewer hints means recognizing nudges—questions, suggested data structures, or "what if you tried X"—and incorporating them without ego defense. Hints often escalate when you are stuck or suboptimal; treat them as collaboration.',
  whyExists:
    'Interviewers want to see coachability and problem-solving with partial information—mirroring real teams. Ignoring hints wastes time and signals poor collaboration.',
  mentalModel:
    'Hints are GPS recalculations: reroute gracefully, acknowledge the suggestion, and integrate it into your plan.',
  howItWorks: [
    {
      type: 'list',
      items: [
        'Pause and repeat hint in your words.',
        'Explain how it changes your approach.',
        'Adjust code or plan visibly; do not silently continue wrong path.',
        'Thank briefly; avoid "I was going to do that".',
        'If hint unclear, ask one clarifying question.',
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Interviewer: "Could a HashMap help?" You: "Yes—instead of scanning for complement I can store value to index in a map for O(1) lookup. Let me refactor the inner loop."',
    },
  ],
  tradeoffs: {
    advantages: ['Unblocks progress', 'Shows collaboration', 'Often intended to help you succeed'],
    disadvantages: ['Over-reliance may reduce independent signal', 'Misinterpreted hint can derail'],
    alternatives: ['Ask for hint explicitly if stuck 3+ min', 'Paraphrase before changing course'],
    whenToUse: ['Whenever interviewer intervenes', 'When stuck after honest attempt'],
    whenNotToUse: ['Do not ask for hint in first 2 minutes without try'],
  },
  failureModes: [
    'Ignore hint and continue wrong approach.',
    'Defensive argument with interviewer.',
    'Blindly paste hint without understanding.',
  ],
  interview: {
    expectations: ['Acknowledge and integrate', 'Stay positive', 'Show adapted reasoning'],
    commonQuestions: ['Evaluate hint response in mock', 'When ask for hint?'],
    followUps: ['Does hint hurt score?', 'Multiple hints OK?'],
    misconceptions: ['Hints mean failure', 'Must solve alone'],
    traps: ['Pretend you thought of it dismissively', 'Change everything without trace'],
    strongSignals: ['Paraphrase hint', 'Update complexity after pivot'],
  },
  keyTakeaways: [
    'Hints are collaboration—integrate openly.',
    'Repeat hint and explain impact on approach.',
    'Pivot visibly; do not defend wrong path.',
    'Ask for hint if stuck several minutes after effort.',
    'Coachability is evaluated positively.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Interviewer suggests HashMap—response?', answerHint: 'Agree, explain O(1) lookup benefit, refactor approach.' },
    { level: 'intermediate', question: 'When ask for hint?', answerHint: 'After clarifying and attempting 3-5 min stuck; show what you tried.' },
    { level: 'advanced', question: 'Do hints reduce offer chances?', answerHint: 'Usually no if you integrate well; repeated hints on easy may weaken signal.' },
  ],
  flashcards: [
    { front: 'Receive hint first action', back: 'Paraphrase and explain how plan changes.' },
    { front: 'Stuck duration before asking hint', back: 'Several minutes after genuine attempt.' },
  ],
  quickRevision: [
    'Hints = collaboration',
    'Paraphrase back',
    'Integrate visibly',
    'No ego defense',
    'Ask if stuck after try',
    'Update complexity story',
    'Coachability matters',
  ],
}
