import { GRAPH_CORE_CPP } from '@/content/topics/_graph-core-cpp'
import { GRAPH_ALGO_CPP_EXTRA } from '@/content/topics/_graph-algo-cpp-extra'
import type { TopicContent } from '@/domain/types'

export type GraphCppSolution = { caption: string; code: string }

/** Core pack wins on overlap; extra covers the remaining curriculum topics. */
export function getGraphCppSolution(topicId: string): GraphCppSolution | undefined {
  return GRAPH_CORE_CPP[topicId] ?? GRAPH_ALGO_CPP_EXTRA[topicId]
}

/** Attach C++ template(s) alongside existing Java templates. */
export function withGraphCppSolutions(
  topicId: string,
  content: TopicContent,
): TopicContent {
  const javaTemplates = (content.templates ?? []).map((t) => ({
    ...t,
    language: t.language || 'java',
  }))
  const cpp = getGraphCppSolution(topicId)
  const templates = cpp
    ? [...javaTemplates, { language: 'cpp', caption: cpp.caption, code: cpp.code }]
    : javaTemplates
  return { ...content, templates }
}
