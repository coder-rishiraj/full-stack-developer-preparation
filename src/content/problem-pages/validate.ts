import { collectTopicLinks, inlineToText, type MdBlock } from '@/lib/lesson-markdown'
import type { DsaProblem } from '@/domain/types'
import { parseProblemPage, PRACTICE_SECTION, type ProblemPage } from './index'

/** The thirteen H2 sections every walkthrough has, in this order. */
export const PROBLEM_PAGE_SECTIONS = [
  '1. Problem restatement',
  PRACTICE_SECTION,
  '3. Interview script: understand the problem',
  '4. Think out loud: from first idea to best solution',
  '5. Comparison table',
  '6. Which solution to give, and when to stop optimizing',
  '7. Interview script: code it and test it',
  '8. Time plan for the interview',
  '9. Interviewer challenges',
  '10. Follow-up questions the interviewer might ask',
  '11. Common mistakes: reasoning and implementation',
  '12. Pattern recognition',
  '13. 60-second revision card',
] as const

/** Section 3 keeps facts apart by where they came from. */
export const FACT_SOURCES = ['Given constraints', 'Clarifications confirmed by the interviewer', 'My assumptions'] as const

/** Every approach in section 4 carries these H4 parts, in this order. */
export const APPROACH_PARTS = [
  'What I say out loud',
  'Intuition',
  'Algorithm',
  'Why it is correct',
  'Dry run',
  'Java code',
  'Time complexity',
  'Space complexity',
] as const

/** The two tables of section 5, identical on every page. */
export const COMPLEXITY_COLUMNS = ['Approach', 'Expected time', 'Worst-case time', 'Auxiliary space'] as const
export const TRADEOFF_COLUMNS = ['Approach', 'Pros', 'Cons', 'When to pick it'] as const

/** Every interviewer challenge in section 9 answers these four points. */
export const CHALLENGE_PARTS = ['What they are testing', 'How to reason', 'What I say', 'Nuance'] as const

export const MISTAKE_KINDS = ['Reasoning mistakes', 'Implementation mistakes'] as const

export type ProblemPageCheckContext = {
  getProblem: (id: string) => DsaProblem | undefined
  isTopic: (id: string) => boolean
}

export type ProblemPageCheck = { id: string; page: ProblemPage; errors: string[] }

const SOURCE_NAME: Record<DsaProblem['source'], string> = { neetcode250: 'neetcode', cses: 'cses' }

type Heading = Extract<MdBlock, { type: 'heading' }>
const isHeading = (b: MdBlock, level: number): b is Heading => b.type === 'heading' && b.level === level

/** Blocks of the H2 section whose title starts with `title` (without the heading itself). */
function sectionBlocks(blocks: MdBlock[], title: string): MdBlock[] {
  const start = blocks.findIndex((b) => isHeading(b, 2) && b.text.startsWith(title))
  if (start === -1) return []
  const end = blocks.findIndex((b, i) => i > start && isHeading(b, 2))
  return blocks.slice(start + 1, end === -1 ? undefined : end)
}

/** Splits blocks into groups, each opened by a heading of `level`. */
function groupsAt(blocks: MdBlock[], level: number): { name: string; blocks: MdBlock[] }[] {
  const groups: { name: string; blocks: MdBlock[] }[] = []
  for (const b of blocks) {
    // A shallower heading closes the current group without opening a named one.
    if (b.type === 'heading' && b.level <= level) groups.push({ name: b.level === level ? b.text : '', blocks: [] })
    else groups[groups.length - 1]?.blocks.push(b)
  }
  return groups.filter((g) => g.name)
}

/** The bold lead-ins of a group's paragraphs, e.g. "**What I say:** …" → "What I say:". */
function leadIns(blocks: MdBlock[]): string[] {
  return blocks.flatMap((b) => (b.type === 'paragraph' && b.inline[0]?.t === 'strong' ? [inlineToText(b.inline[0].c)] : []))
}

function hasTable(blocks: MdBlock[], columns: readonly string[]): boolean {
  return blocks.some(
    (b) => b.type === 'table' && b.header.length === columns.length && columns.every((c, i) => inlineToText(b.header[i]) === c),
  )
}

export function checkProblemPage(id: string, source: string, ctx: ProblemPageCheckContext): ProblemPageCheck {
  const page = parseProblemPage(source)
  const { frontmatter: fm, doc } = page
  const errors = [...doc.issues]
  const problem = ctx.getProblem(id)

  if (!problem) {
    errors.push(`"${id}" is not a problem id (file name must equal the id in src/content/problems)`)
  } else {
    if (fm.problemId !== id) errors.push(`frontmatter: problemId must be "${id}"`)
    if (fm.title !== problem.name) errors.push(`frontmatter: title must be "${problem.name}"`)
    if (fm.source !== SOURCE_NAME[problem.source]) errors.push(`frontmatter: source must be "${SOURCE_NAME[problem.source]}"`)
    if (fm.sourceUrl !== problem.sourceUrl) errors.push(`frontmatter: sourceUrl must be "${problem.sourceUrl}"`)
    if (problem.difficulty !== 'unknown' && fm.difficulty !== problem.difficulty) {
      errors.push(`frontmatter: difficulty must be "${problem.difficulty}"`)
    }
    if (fm.patterns[0] !== problem.primaryPattern) errors.push(`frontmatter: patterns must start with "${problem.primaryPattern}"`)
  }
  if (!fm.difficulty || !['easy', 'medium', 'hard'].includes(fm.difficulty)) errors.push('frontmatter: difficulty must be easy | medium | hard')
  if (typeof fm.timeToSolve !== 'number' || fm.timeToSolve < 5 || fm.timeToSolve > 60) {
    errors.push('frontmatter: timeToSolve must be a number of minutes between 5 and 60')
  }
  if (fm.relatedLessons.length === 0) errors.push('frontmatter: relatedLessons needs at least one lesson id')
  for (const lesson of fm.relatedLessons) {
    if (!ctx.isTopic(lesson)) errors.push(`frontmatter: relatedLessons has unknown lesson id "${lesson}"`)
  }

  // Sections: exactly the template's H2s, in order (a time hint such as "(≈2 min)" may follow).
  const h2 = doc.outline.filter((o) => o.level === 2).map((o) => o.text)
  PROBLEM_PAGE_SECTIONS.forEach((want, i) => {
    if (!h2[i]?.startsWith(want)) errors.push(`section ${i + 1} must be "## ${want}" (found "${h2[i] ?? 'nothing'}")`)
  })
  if (h2.length > PROBLEM_PAGE_SECTIONS.length) errors.push(`unexpected extra H2 "${h2[PROBLEM_PAGE_SECTIONS.length]}"`)
  const section = (n: number) => sectionBlocks(doc.blocks, PROBLEM_PAGE_SECTIONS[n - 1])

  // Section 2: progressive hints, closed by default, and no code that gives the answer away.
  const practice = section(2)
  const hints = practice.filter((b) => b.type === 'callout' && b.variant === 'hint')
  if (hints.length < 3) errors.push(`section 2 has ${hints.length} "> [!HINT]" blocks — it needs three progressive hints`)
  if (practice.some((b) => b.type === 'code') || hints.some((h) => h.type === 'callout' && h.blocks.some((b) => b.type === 'code'))) {
    errors.push('section 2 must not contain code — hints point the way without showing the solution')
  }

  // Section 3: given constraints, confirmed clarifications and assumptions are kept apart.
  const understand = groupsAt(section(3), 3).map((g) => g.name)
  for (const want of FACT_SOURCES) {
    if (!understand.some((n) => n.startsWith(want))) errors.push(`section 3 is missing "### ${want}"`)
  }

  // Section 4: at least two approaches, each with every part.
  const approaches = groupsAt(section(4), 3).filter((a) => /^Approach \d/.test(a.name))
  if (approaches.length < 2) errors.push('section 4 needs at least two "### Approach N: …" subsections (naive → optimal)')
  approaches.forEach((a, index) => {
    const parts = a.blocks.filter((b) => isHeading(b, 4)).map((b) => (b as Heading).text)
    let at = -1
    for (const part of APPROACH_PARTS) {
      const found = parts.findIndex((p, i) => i > at && p.startsWith(part))
      if (found === -1) errors.push(`"${a.name}" is missing "#### ${part}" (or it is out of order)`)
      else at = found
    }
    if (!a.blocks.some((b) => b.type === 'code' && b.language === 'java')) errors.push(`"${a.name}" has no \`\`\`java code block`)
    if (index < approaches.length - 1 && !parts.some((p) => p.startsWith('The bridge'))) {
      errors.push(`"${a.name}" is missing "#### The bridge to the next approach"`)
    }
  })

  // Section 5: the same two tables on every page.
  if (!hasTable(section(5), COMPLEXITY_COLUMNS)) errors.push(`section 5 needs the complexity table: ${COMPLEXITY_COLUMNS.join(' | ')}`)
  if (!hasTable(section(5), TRADEOFF_COLUMNS)) errors.push(`section 5 needs the trade-off table: ${TRADEOFF_COLUMNS.join(' | ')}`)

  // Section 8: a time split as a table.
  if (!section(8).some((b) => b.type === 'table')) errors.push('section 8 needs a table with the suggested time split')

  // Section 9: each challenge is an H4 question answered in four labelled paragraphs.
  const challenges = groupsAt(section(9), 4)
  if (challenges.length < 3) errors.push(`section 9 has ${challenges.length} challenges (#### question) — it needs at least 3`)
  for (const c of challenges) {
    const leads = leadIns(c.blocks)
    for (const part of CHALLENGE_PARTS) {
      if (!leads.some((l) => l.startsWith(part))) errors.push(`challenge "${c.name}" is missing a "**${part}:**" paragraph`)
    }
  }

  // Section 10: at least three follow-ups.
  const followUps = leadIns(section(10)).length
  if (followUps < 3) errors.push(`section 10 has ${followUps} follow-ups (paragraphs opening with the bold question) — it needs at least 3`)

  // Section 11: reasoning mistakes and implementation mistakes are separate.
  const mistakes = groupsAt(section(11), 3).map((g) => g.name)
  for (const want of MISTAKE_KINDS) {
    if (!mistakes.some((n) => n.startsWith(want))) errors.push(`section 11 is missing "### ${want}"`)
  }

  // Links: every [[id]] is a curriculum topic or a problem; section 12 links 3+ other problems.
  for (const link of new Set(collectTopicLinks(doc.blocks))) {
    if (!ctx.getProblem(link) && !ctx.isTopic(link)) errors.push(`broken link [[${link}]] — not a topic id or a problem id`)
  }
  const related = new Set(collectTopicLinks(section(12)).filter((l) => l !== id && ctx.getProblem(l))).size
  if (related < 3) errors.push(`section 12 links ${related} related problems — it needs at least 3, linked as [[problem-id|Name]]`)

  // Nothing above the practice gate may link to a lesson or problem that names the technique.
  if (collectTopicLinks([...section(1), ...practice]).length > 0) {
    errors.push('sections 1–2 must not contain [[links]] — lesson and problem names give the approach away before practice')
  }

  // A floor, not a target: depth follows the problem (docs/PROBLEM_PAGE_GUIDE.md §3).
  if (doc.wordCount < 1500) errors.push(`only ${doc.wordCount} words — a full walkthrough needs at least 1500`)

  return { id, page, errors }
}
