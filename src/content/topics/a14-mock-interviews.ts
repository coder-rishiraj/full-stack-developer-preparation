import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Mock interviews simulate real hiring loops—timed problem, interviewer interaction, feedback on communication, correctness, and complexity. Formats include peer practice, platforms (Pramp, Interviewing.io), and paid coaching.',
  whyExists:
    'Solo LeetCode misses communication pressure and ambiguous prompts. Mocks expose gaps in thinking aloud, pacing, and hint response before high-stakes onsite.',
  mentalModel:
    'Dress rehearsal: same constraints as show night, then review recording or feedback notes like a coach.',
  howItWorks: [
    {
      type: 'list',
      items: [
        'Schedule 1-2 mocks per week during prep peak.',
        'Use varied formats: coding, system design, behavioral.',
        'Record or take notes on feedback themes.',
        'Retry missed patterns untimed then timed.',
        'Alternate easy warm-up and medium/hard target level.',
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Week 4 mock surfaces weak thinking aloud; week 5 drill fixes silence during optimize phase.',
    },
  ],
  tradeoffs: {
    advantages: ['Realistic pressure', 'Actionable feedback', 'Builds stamina'],
    disadvantages: ['Time cost', 'Variable peer quality', 'Can discourage if only hard mocks'],
    alternatives: ['Self-timed with rubric checklist', 'Explain solution to rubber duck recorded'],
    whenToUse: ['4-8 weeks before interviews', 'After baseline pattern study'],
    whenNotToUse: ['Day one before learning patterns—build foundation first'],
  },
  failureModes: [
    'Only solo grind no mocks.',
    'Ignore recurring feedback themes.',
    'Treat mock as pass/fail not learning.',
  ],
  interview: {
    expectations: ['Treat mock like real', 'Apply feedback next session', 'Balance coding and design mocks'],
    commonQuestions: ['How many mocks needed?', 'Platform choice?'],
    followUps: ['Behavioral prep?', 'System design mocks?'],
    misconceptions: ['Mocks replace problem practice', 'More mocks always better without review'],
    traps: ['Memorize mock problem then fail new one', 'No feedback capture'],
    strongSignals: ['Improving scores on same rubric', 'Fixed thinking aloud after feedback'],
  },
  keyTakeaways: [
    'Mocks test communication not just code.',
    '1-2 per week during active prep.',
    'Log feedback; drill weak themes.',
    'Mix coding, design, behavioral.',
    'Review mistakes untimed then retry timed.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Why do mock interviews?', answerHint: 'Practice communication, pacing, and pressure with feedback before real loops.' },
    { level: 'intermediate', question: 'How use mock feedback?', answerHint: 'Track recurring themes; targeted drills; retry similar problems timed.' },
    { level: 'advanced', question: 'Mock cadence before onsite?', answerHint: 'Ramp 1-2 weekly last month; include design/behavioral not only coding.' },
  ],
  flashcards: [
    { front: 'Mock interview purpose', back: 'Realistic practice with feedback on full loop skills.' },
    { front: 'Recommended mock frequency peak prep', back: 'About 1-2 per week.' },
  ],
  quickRevision: [
    'Simulate real loop',
    '1-2 mocks weekly',
    'Log feedback themes',
    'Mix problem types',
    'Retry weak areas',
    'Not replacement for study',
    'Treat seriously',
  ],
}
