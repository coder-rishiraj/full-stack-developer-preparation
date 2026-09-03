import { JAVA_INTERVIEW_SECTIONS } from '@/content/interview/java'
import { InterviewGuidePage } from '@/pages/InterviewGuidePage'

export function JavaInterviewPage() {
  return (
    <InterviewGuidePage
      crumb="Java"
      title="Java Interview Questions"
      intro="Core language, Java 8, JVM internals, concurrency, networking, Spring, SQL, PostgreSQL, and classic output traps with links into Track C notes."
      sections={JAVA_INTERVIEW_SECTIONS}
    />
  )
}
