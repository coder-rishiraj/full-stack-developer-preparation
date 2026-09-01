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
      dot > 0 && (prefix === 'B1' || prefix === 'B2' || prefix === 'B3')

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
