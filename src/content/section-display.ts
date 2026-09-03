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
        prefix === 'C7')

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
