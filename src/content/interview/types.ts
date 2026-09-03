import type { ContentBlock } from '@/domain/types'

export type ReactInterviewMcq = {
  options: string[]
  correctIndex: number
  explanation: string
}

export type ReactInterviewItem = {
  id: string
  question: string
  relatedTopicIds?: string[]
  answer: ContentBlock[]
  mcq?: ReactInterviewMcq
}

export type ReactInterviewSection = {
  id: string
  title: string
  blurb: string
  items: ReactInterviewItem[]
}
