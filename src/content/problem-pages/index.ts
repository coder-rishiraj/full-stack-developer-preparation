import { parseLesson, type MdBlock, type ParsedLesson } from '@/lib/lesson-markdown'

/**
 * Interview walkthrough pages live in `src/content/problem-pages/<problem-id>.md`.
 *
 * The file name equals the problem's `id` in `src/content/problems/*.ts`. Pages use
 * the lesson Markdown dialect (see docs/LESSON_GUIDE.md); `[[id|label]]` links may
 * point at a curriculum topic or at another problem. Standards: docs/PROBLEM_PAGE_GUIDE.md.
 * `npm run problems:check` checks the template (`validate.ts`); `npm run problems:verify`
 * compiles every Java solution and runs it against `tests/<problem-id>.java`.
 */
const files = import.meta.glob<string>(['./*.md', '!./PROGRESS.md'], { query: '?raw', import: 'default' })

const LOADERS: Record<string, () => Promise<string>> = {}
for (const [path, loader] of Object.entries(files)) {
  const id = path.match(/\.\/([^/]+)\.md$/)?.[1]
  if (id) LOADERS[id] = loader
}

export type ProblemPageFrontmatter = {
  problemId?: string
  title?: string
  source?: string
  sourceUrl?: string
  difficulty?: string
  patterns: string[]
  relatedLessons: string[]
  companies: string[]
  /** Target minutes to reach a tested optimal solution in an interview. */
  timeToSolve?: number
}

export type ProblemPage = {
  frontmatter: ProblemPageFrontmatter
  doc: ParsedLesson
}

/** Accepts both `key: [a, b]` and the dash-list form the lesson parser produces. */
function toList(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String)
  if (typeof value !== 'string') return []
  const inner = value.trim().replace(/^\[/, '').replace(/\]$/, '')
  return inner
    .split(',')
    .map((s) => s.trim().replace(/^["']|["']$/g, ''))
    .filter(Boolean)
}

const str = (v: unknown): string | undefined => (typeof v === 'string' && v ? v : undefined)

export function parseProblemPage(source: string): ProblemPage {
  const doc = parseLesson(source)
  const fm = doc.frontmatter
  return {
    doc,
    frontmatter: {
      problemId: str(fm.problemId),
      title: str(fm.title),
      source: str(fm.source),
      sourceUrl: str(fm.sourceUrl),
      difficulty: str(fm.difficulty),
      patterns: toList(fm.patterns),
      relatedLessons: toList(fm.relatedLessons),
      companies: toList(fm.companies),
      timeToSolve: typeof fm.timeToSolve === 'number' ? fm.timeToSolve : undefined,
    },
  }
}

/** Heading of the self-practice section; everything after that section is a spoiler. */
export const PRACTICE_SECTION = '2. Practice first'

/**
 * Index of the first block after the practice section, or -1 when the page has none.
 * The problem page hides blocks from here on until the reader reveals the walkthrough.
 */
export function practiceGateIndex(blocks: MdBlock[]): number {
  const start = blocks.findIndex((b) => b.type === 'heading' && b.level === 2 && b.text.startsWith(PRACTICE_SECTION))
  if (start === -1) return -1
  return blocks.findIndex((b, i) => i > start && b.type === 'heading' && b.level === 2)
}

export function hasProblemPage(problemId: string): boolean {
  return Boolean(LOADERS[problemId])
}

export function problemPageIds(): string[] {
  return Object.keys(LOADERS).sort()
}

const CACHE = new Map<string, ProblemPage>()

export async function loadProblemPage(problemId: string): Promise<ProblemPage | undefined> {
  const hit = CACHE.get(problemId)
  if (hit) return hit
  const loader = LOADERS[problemId]
  if (!loader) return undefined
  const page = parseProblemPage(await loader())
  CACHE.set(problemId, page)
  return page
}
