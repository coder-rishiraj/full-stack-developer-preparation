import type {
  ContentBlock,
  TopicContent,
  TopicMeta,
  TopicKind,
} from '@/domain/types'

export type QcSeverity = 'error' | 'warn'

export type QcIssue = {
  severity: QcSeverity
  topicId?: string
  code: string
  message: string
}

export type QcReport = {
  topicCount: number
  classifiedCount: number
  nestedConceptCount: number
  contentCount: number
  errors: QcIssue[]
  warnings: QcIssue[]
}

function nonEmpty(s: string | undefined): boolean {
  return Boolean(s && s.trim().length > 0)
}

function blocksHaveSubstance(blocks: ContentBlock[] | undefined): boolean {
  if (!blocks?.length) return false
  return blocks.some((b) => {
    switch (b.type) {
      case 'paragraph':
      case 'callout':
        return nonEmpty(b.text)
      case 'list':
        return b.items.some((i) => nonEmpty(i))
      case 'table':
        return b.headers.length > 0 && b.rows.length > 0
      case 'code':
        return nonEmpty(b.code)
      case 'mermaid':
        return nonEmpty(b.diagram)
      default:
        return false
    }
  })
}

const FILLER_RE =
  /\b(lorem ipsum|TODO:|FIXME:|coming soon|content pending|write notes here)\b/i

const TEMPLATE_SMELL_RE =
  /provides repeatable structure for teams shipping fast|Prefer boring proven patterns over novelty|One-off hacks without shared pattern/

function scanText(topicId: string, field: string, text: string | undefined, out: QcIssue[]) {
  if (!text) return
  if (FILLER_RE.test(text)) {
    out.push({
      severity: 'error',
      topicId,
      code: 'filler_text',
      message: `${field} contains placeholder/filler text`,
    })
  }
  if (TEMPLATE_SMELL_RE.test(text)) {
    out.push({
      severity: 'error',
      topicId,
      code: 'template_smell',
      message: `${field} looks like generic template filler`,
    })
  }
}

function walkBlocks(topicId: string, field: string, blocks: ContentBlock[] | undefined, out: QcIssue[]) {
  if (!blocks) return
  for (const b of blocks) {
    switch (b.type) {
      case 'paragraph':
      case 'callout':
        scanText(topicId, field, b.text, out)
        break
      case 'list':
        for (const item of b.items) scanText(topicId, field, item, out)
        break
      case 'table':
        for (const h of b.headers) scanText(topicId, field, h, out)
        for (const row of b.rows) for (const cell of row) scanText(topicId, field, cell, out)
        break
      case 'code':
        if (!nonEmpty(b.code)) {
          out.push({
            severity: 'error',
            topicId,
            code: 'empty_code',
            message: `${field} has empty code block`,
          })
        }
        scanText(topicId, field, b.code, out)
        break
      case 'mermaid':
        if (!nonEmpty(b.diagram)) {
          out.push({
            severity: 'error',
            topicId,
            code: 'empty_mermaid',
            message: `${field} has empty mermaid diagram`,
          })
        }
        break
    }
  }
}

/** Soft DoD for deep notes — required revision/interview surfaces + core explainer. */
export function auditTopicContent(
  meta: TopicMeta,
  content: TopicContent | undefined,
): QcIssue[] {
  const out: QcIssue[] = []
  const id = meta.id

  if (!content) {
    out.push({
      severity: 'error',
      topicId: id,
      code: 'missing_content',
      message: 'No content module loaded',
    })
    return out
  }

  if (!content.keyTakeaways?.length) {
    out.push({ severity: 'error', topicId: id, code: 'missing_keyTakeaways', message: 'keyTakeaways empty' })
  }
  if (!content.quickRevision?.length) {
    out.push({ severity: 'error', topicId: id, code: 'missing_quickRevision', message: 'quickRevision empty' })
  }
  if (!content.flashcards?.length) {
    out.push({ severity: 'error', topicId: id, code: 'missing_flashcards', message: 'flashcards empty' })
  }
  if (!content.interviewQuestions?.length) {
    out.push({
      severity: 'error',
      topicId: id,
      code: 'missing_interviewQuestions',
      message: 'interviewQuestions empty',
    })
  }

  if (!nonEmpty(content.whatIsIt)) {
    out.push({ severity: 'error', topicId: id, code: 'missing_whatIsIt', message: 'whatIsIt missing' })
  }
  if (!nonEmpty(content.whyExists)) {
    out.push({ severity: 'warn', topicId: id, code: 'missing_whyExists', message: 'whyExists missing' })
  }
  if (!nonEmpty(content.mentalModel)) {
    out.push({ severity: 'warn', topicId: id, code: 'missing_mentalModel', message: 'mentalModel missing' })
  }
  if (!blocksHaveSubstance(content.howItWorks) && !blocksHaveSubstance(content.example)) {
    out.push({
      severity: 'error',
      topicId: id,
      code: 'thin_explanation',
      message: 'Need howItWorks or example with substance',
    })
  }
  if (!content.interview?.expectations?.length && !content.interview?.commonQuestions?.length) {
    out.push({
      severity: 'warn',
      topicId: id,
      code: 'thin_interview',
      message: 'interview section thin or missing',
    })
  }

  scanText(id, 'whatIsIt', content.whatIsIt, out)
  scanText(id, 'whyExists', content.whyExists, out)
  scanText(id, 'mentalModel', content.mentalModel, out)
  walkBlocks(id, 'howItWorks', content.howItWorks, out)
  walkBlocks(id, 'example', content.example, out)
  walkBlocks(id, 'internals', content.internals, out)
  for (const line of content.keyTakeaways ?? []) scanText(id, 'keyTakeaways', line, out)
  for (const line of content.quickRevision ?? []) scanText(id, 'quickRevision', line, out)

  if (meta.kind === 'dsa-pattern') {
    if (!content.patternRecognition?.length) {
      out.push({
        severity: 'warn',
        topicId: id,
        code: 'dsa_missing_patternRecognition',
        message: 'DSA topic missing patternRecognition',
      })
    }
    if (!content.commonMistakes?.length) {
      out.push({
        severity: 'warn',
        topicId: id,
        code: 'dsa_missing_commonMistakes',
        message: 'DSA topic missing commonMistakes',
      })
    }
    if (!content.complexity) {
      out.push({
        severity: 'warn',
        topicId: id,
        code: 'dsa_missing_complexity',
        message: 'DSA topic missing complexity',
      })
    }
    const hasJava =
      content.templates?.some((t) => /java/i.test(t.language)) ||
      content.implementation?.some((t) => /java/i.test(t.language))
    if (!hasJava) {
      out.push({
        severity: 'warn',
        topicId: id,
        code: 'dsa_missing_java',
        message: 'DSA topic missing Java template/implementation',
      })
    }
  }

  if (meta.kind === 'system-design') {
    if (!content.systemDesign?.problem || !content.systemDesign.requirements) {
      out.push({
        severity: 'warn',
        topicId: id,
        code: 'sd_missing_systemDesign',
        message: 'System-design topic missing systemDesign block',
      })
    }
  }

  if (content.tradeoffs) {
    const t = content.tradeoffs
    for (const key of ['advantages', 'disadvantages', 'alternatives', 'whenToUse', 'whenNotToUse'] as const) {
      if (!t[key]?.length) {
        out.push({
          severity: 'warn',
          topicId: id,
          code: `tradeoffs_empty_${key}`,
          message: `tradeoffs.${key} empty`,
        })
      }
    }
  }

  return out
}

export function auditCurriculumGraph(topics: TopicMeta[]): QcIssue[] {
  const out: QcIssue[] = []
  const ids = new Set(topics.map((t) => t.id))

  if (ids.size !== topics.length) {
    out.push({
      severity: 'error',
      code: 'duplicate_topic_ids',
      message: `Duplicate topic ids: ${topics.length - ids.size}`,
    })
  }

  for (const t of topics) {
    if (!t.priority) {
      out.push({ severity: 'error', topicId: t.id, code: 'missing_priority', message: 'priority missing' })
    }
    if (!['p0', 'p1', 'p2', 'later'].includes(t.executionPriority)) {
      out.push({
        severity: 'error',
        topicId: t.id,
        code: 'missing_execution_priority',
        message: 'executionPriority missing or invalid',
      })
    }
    if (
      t.curriculumLevel !== 'classified-item' &&
      t.curriculumLevel !== 'nested-concept'
    ) {
      out.push({
        severity: 'error',
        topicId: t.id,
        code: 'invalid_curriculum_level',
        message: 'curriculumLevel missing or invalid',
      })
    }
    if (t.curriculumLevel === 'nested-concept') {
      if (!t.parentTopicId || !ids.has(t.parentTopicId)) {
        out.push({
          severity: 'error',
          topicId: t.id,
          code: 'broken_nested_parent',
          message: `nested parent "${t.parentTopicId ?? ''}" not in curriculum`,
        })
      } else {
        const parent = topics.find((candidate) => candidate.id === t.parentTopicId)
        if (parent?.sectionId !== t.sectionId) {
          out.push({
            severity: 'warn',
            topicId: t.id,
            code: 'cross_section_nested_parent',
            message: `nested parent "${t.parentTopicId}" is in another section`,
          })
        }
      }
    }
    if (!t.targetMonths?.length) {
      out.push({ severity: 'error', topicId: t.id, code: 'missing_months', message: 'targetMonths empty' })
    }
    if (!t.sectionId || !t.sectionTitle) {
      out.push({ severity: 'error', topicId: t.id, code: 'missing_section', message: 'section missing' })
    }
    for (const ref of t.prerequisites) {
      if (!ids.has(ref)) {
        out.push({
          severity: 'error',
          topicId: t.id,
          code: 'broken_prereq',
          message: `prereq "${ref}" not in curriculum`,
        })
      }
    }
    for (const ref of t.relatedTopics) {
      if (!ids.has(ref)) {
        out.push({
          severity: 'error',
          topicId: t.id,
          code: 'broken_related',
          message: `related "${ref}" not in curriculum`,
        })
      }
    }
    for (const ref of t.nextTopics) {
      if (!ids.has(ref)) {
        out.push({
          severity: 'error',
          topicId: t.id,
          code: 'broken_next',
          message: `next "${ref}" not in curriculum`,
        })
      }
    }
  }

  return out
}

export function auditProblemLinks(
  problems: { id: string; primaryTopic: string; sourceUrl: string; urlVerified: boolean }[],
  topicIds: Set<string>,
): QcIssue[] {
  const out: QcIssue[] = []
  for (const p of problems) {
    if (!topicIds.has(p.primaryTopic)) {
      out.push({
        severity: 'error',
        topicId: p.primaryTopic,
        code: 'problem_orphan_topic',
        message: `problem ${p.id} primaryTopic "${p.primaryTopic}" missing`,
      })
    }
    if (!p.sourceUrl) {
      out.push({
        severity: 'error',
        code: 'problem_missing_url',
        message: `problem ${p.id} missing sourceUrl`,
      })
    }
    if (!p.urlVerified) {
      out.push({
        severity: 'warn',
        code: 'problem_url_unverified',
        message: `problem ${p.id} urlVerified=false`,
      })
    }
  }
  return out
}

export function auditOrphanContent(
  topicIds: Set<string>,
  contentIds: string[],
): QcIssue[] {
  const out: QcIssue[] = []
  for (const id of contentIds) {
    if (!topicIds.has(id)) {
      out.push({
        severity: 'warn',
        topicId: id,
        code: 'orphan_content_module',
        message: 'Content module has no matching taxonomy topic',
      })
    }
  }
  for (const id of topicIds) {
    if (!contentIds.includes(id)) {
      out.push({
        severity: 'error',
        topicId: id,
        code: 'missing_content_module',
        message: 'Taxonomy topic has no content module',
      })
    }
  }
  return out
}

export function buildQcReport(input: {
  topics: TopicMeta[]
  contentById: Record<string, TopicContent | undefined>
  contentIds: string[]
  problems: { id: string; primaryTopic: string; sourceUrl: string; urlVerified: boolean }[]
}): QcReport {
  const topicIds = new Set(input.topics.map((t) => t.id))
  const issues: QcIssue[] = [
    ...auditCurriculumGraph(input.topics),
    ...auditOrphanContent(topicIds, input.contentIds),
    ...auditProblemLinks(input.problems, topicIds),
  ]

  for (const t of input.topics) {
    issues.push(...auditTopicContent(t, input.contentById[t.id]))
  }

  const errors = issues.filter((i) => i.severity === 'error')
  const warnings = issues.filter((i) => i.severity === 'warn')
  return {
    topicCount: input.topics.length,
    classifiedCount: input.topics.filter(
      (topic) => topic.curriculumLevel === 'classified-item',
    ).length,
    nestedConceptCount: input.topics.filter(
      (topic) => topic.curriculumLevel === 'nested-concept',
    ).length,
    contentCount: input.contentIds.length,
    errors,
    warnings,
  }
}

export function summarizeByCode(issues: QcIssue[]): Record<string, number> {
  const counts: Record<string, number> = {}
  for (const i of issues) {
    counts[i.code] = (counts[i.code] ?? 0) + 1
  }
  return counts
}

/** Topics that usually warrant DSA DoD extras. */
export function isDsaHeavyKind(kind: TopicKind): boolean {
  return kind === 'dsa-pattern'
}
