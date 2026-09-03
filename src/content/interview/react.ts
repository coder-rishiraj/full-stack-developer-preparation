import { REACT_INTERVIEW_ARCHITECTURE, REACT_INTERVIEW_MODERN } from './react-architecture'
import { REACT_INTERVIEW_EXPERIENCED } from './react-experienced'
import { REACT_INTERVIEW_FRESHERS } from './react-freshers'
import { REACT_INTERVIEW_MCQ } from './react-mcq'
import type { ReactInterviewSection } from './types'

export type { ReactInterviewItem, ReactInterviewMcq, ReactInterviewSection } from './types'

export const REACT_INTERVIEW_SECTIONS: ReactInterviewSection[] = [
  {
    id: 'freshers',
    title: 'Freshers',
    blurb: 'Definitions you should answer in 60–90 seconds: React, JSX, state, props, Hooks.',
    items: REACT_INTERVIEW_FRESHERS,
  },
  {
    id: 'experienced',
    title: 'Experienced',
    blurb: 'Routing, lifecycle, HOCs, styling, and how you would actually structure a feature.',
    items: REACT_INTERVIEW_EXPERIENCED,
  },
  {
    id: 'architecture',
    title: 'Architecture & advanced',
    blurb: 'Reconciliation, refs, SSR vs CSR, and how you pick a state tool.',
    items: REACT_INTERVIEW_ARCHITECTURE,
  },
  {
    id: 'modern',
    title: 'Modern patterns & performance',
    blurb: 'Context, memoization, Suspense, portals, and layout effects.',
    items: REACT_INTERVIEW_MODERN,
  },
  {
    id: 'mcq',
    title: 'MCQ drill',
    blurb: 'Pick an answer, then reveal why. These are the quiz items interviewers still recycle.',
    items: REACT_INTERVIEW_MCQ,
  },
]

export function getReactInterviewItem(sectionId: string, itemId: string) {
  const section = REACT_INTERVIEW_SECTIONS.find((s) => s.id === sectionId)
  return section?.items.find((item) => item.id === itemId)
}
