import type { TopicMeta } from '@/domain/types'

export type DisplaySection = {
  id: string
  title: string
  sections: Array<{ id: string; title: string }>
}

const TRACK_SUBSECTION_PREFIX: Record<string, { id: string; title: string }> = {
  B1: { id: 'B1', title: 'JavaScript' },
  B2: { id: 'B2', title: 'TypeScript' },
  B3: { id: 'B3', title: 'Browser & Web Platform' },
  B4: { id: 'B4', title: 'React' },
  B5: { id: 'B5', title: 'CSS / UI Engineering' },
  B6: { id: 'B6', title: 'Frontend System Design' },
  C1: { id: 'C1', title: 'Core Java' },
  C2: { id: 'C2', title: 'JVM' },
  C3: { id: 'C3', title: 'Java Concurrency' },
  C4: { id: 'C4', title: 'Networking & Web' },
  C5: { id: 'C5', title: 'Spring Core' },
  C6: { id: 'C6', title: 'Spring Boot' },
  C7: { id: 'C7', title: 'SQL & PostgreSQL' },
  C8: { id: 'C8', title: 'JPA / Hibernate' },
  C9: { id: 'C9', title: 'Security' },
  C10: { id: 'C10', title: 'Redis' },
  C11: { id: 'C11', title: 'Kafka & Event-Driven Systems' },
  C12: { id: 'C12', title: 'Backend Reliability' },
  C13: { id: 'C13', title: 'Testing' },
  C14: { id: 'C14', title: 'Docker / DevOps' },
  C15: { id: 'C15', title: 'AWS / Cloud' },
  C16: { id: 'C16', title: 'Observability' },
  D4: { id: 'D4', title: 'Distributed Systems Foundations' },
  D5: { id: 'D5', title: 'Data & Storage Architecture' },
  D6: { id: 'D6', title: 'API & Communication Design' },
  D7: { id: 'D7', title: 'Scalability, Reliability & Architecture' },
  D8: { id: 'D8', title: 'Capacity Estimation' },
  D9: { id: 'D9', title: 'System Design Interview Method' },
  D10: { id: 'D10', title: 'System Design Practice' },
  E1: { id: 'E1', title: 'Foundations & AI Tool Mastery' },
  E2: { id: 'E2', title: 'ML, Deep Learning & LLM Internals' },
  E3: { id: 'E3', title: 'LLM Application Engineering' },
  E4: { id: 'E4', title: 'Prompt & Context Engineering' },
  E5: { id: 'E5', title: 'Embeddings & Semantic Search' },
  E6: { id: 'E6', title: 'Retrieval-Augmented Generation' },
  E7: { id: 'E7', title: 'Agents, Workflows & MCP' },
  E8: { id: 'E8', title: 'Advanced Models & Multimodal AI' },
  E9: { id: 'E9', title: 'AI Evaluation & Testing' },
  E10: { id: 'E10', title: 'Production AI & Product Engineering' },
  E11: { id: 'E11', title: 'AI Security & Responsible AI' },
  E12: { id: 'E12', title: 'Applied AI Project Ladder' },
}

function flushBuffer(
  groups: DisplaySection[],
  prefix: string,
  buffer: Array<{ id: string; title: string }>,
) {
  if (buffer.length === 0) return
  const meta = TRACK_SUBSECTION_PREFIX[prefix]
  groups.push({
    id: meta.id,
    title: meta.title,
    sections: buffer,
  })
}

export function groupSectionsForDisplay(
  sections: Array<{ id: string; title: string }>,
): DisplaySection[] {
  const groups: DisplaySection[] = []
  let buffer: Array<{ id: string; title: string }> = []
  let bufferPrefix = ''

  for (const section of sections) {
    const dot = section.id.indexOf('.')
    const prefix = dot > 0 ? section.id.slice(0, dot) : section.id
    const isSubsection =
      dot > 0 &&
      (prefix === 'B1' ||
        prefix === 'B2' ||
        prefix === 'B3' ||
        prefix === 'B4' ||
        prefix === 'B5' ||
        prefix === 'B6' ||
        prefix === 'C1' ||
        prefix === 'C2' ||
        prefix === 'C3' ||
        prefix === 'C4' ||
        prefix === 'C5' ||
        prefix === 'C6' ||
        prefix === 'C7' ||
        prefix === 'C8' ||
        prefix === 'C9' ||
        prefix === 'C10' ||
        prefix === 'C11' ||
        prefix === 'C12' ||
        prefix === 'C13' ||
        prefix === 'C14' ||
        prefix === 'C15' ||
        prefix === 'C16' ||
        prefix === 'D4' ||
        prefix === 'D5' ||
        prefix === 'D6' ||
        prefix === 'D7' ||
        prefix === 'D8' ||
        prefix === 'D9' ||
        prefix === 'D10' ||
        prefix === 'E1' ||
        prefix === 'E2' ||
        prefix === 'E3' ||
        prefix === 'E4' ||
        prefix === 'E5' ||
        prefix === 'E6' ||
        prefix === 'E7' ||
        prefix === 'E8' ||
        prefix === 'E9' ||
        prefix === 'E10' ||
        prefix === 'E11' ||
        prefix === 'E12')

    if (isSubsection) {
      if (bufferPrefix && bufferPrefix !== prefix) {
        flushBuffer(groups, bufferPrefix, buffer)
        buffer = []
      }
      bufferPrefix = prefix
      buffer.push(section)
    } else {
      flushBuffer(groups, bufferPrefix, buffer)
      buffer = []
      bufferPrefix = ''
      groups.push({ id: section.id, title: section.title, sections: [section] })
    }
  }
  flushBuffer(groups, bufferPrefix, buffer)
  return groups
}

export function topicsInDisplaySection(
  topics: TopicMeta[],
  group: DisplaySection,
): TopicMeta[] {
  const ids = new Set(group.sections.map((section) => section.id))
  return topics.filter((topic) => ids.has(topic.sectionId))
}

export function countDisplaySection(topics: TopicMeta[]) {
  const classified = topics.filter((t) => t.curriculumLevel === 'classified-item').length
  return {
    classified,
    nested: topics.length - classified,
  }
}
