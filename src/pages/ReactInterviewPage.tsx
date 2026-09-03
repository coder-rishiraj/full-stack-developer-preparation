import { REACT_INTERVIEW_SECTIONS } from '@/content/interview/react'
import { InterviewGuidePage } from '@/pages/InterviewGuidePage'

export function ReactInterviewPage() {
  return (
    <InterviewGuidePage
      crumb="React"
      title="React Interview Questions"
      intro="Spoken-style answers, whiteboard snippets, and links into Track B React notes. Written for this site — not a paste of a public dump."
      sections={REACT_INTERVIEW_SECTIONS}
    />
  )
}
