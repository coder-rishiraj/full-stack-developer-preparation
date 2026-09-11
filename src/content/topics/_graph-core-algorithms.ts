import { TRACK_A_GRAPH_SECTIONS } from '@/content/curriculum/track-a-graphs'
import type { TopicContent } from '@/domain/types'

/**
 * Graph algorithms memorize catalog — every algorithmic topic in Track A Graphs
 * curriculum order (A8.1–A8.17), excluding interview meta / comparisons / theory
 * that are not algorithms to memorize.
 */

export type GraphAlgorithmEntry = {
  number: string
  title: string
  topicId: string
  sectionId: string
  sectionTitle: string
}

/** Topics that are not algorithms (terminology, comparisons, theory, interview meta). */
const NON_ALGORITHM_IDS = new Set([
  'a8-graph-types',
  'a8-graph-terminology',
  'a8-when-to-use-representation',
  'a8-bfs-vs-dfs',
  'a8-odd-cycle-bipartite',
  'a8-shortest-path-decision',
  'a8-prim-vs-kruskal',
  'a8-spanning-tree-basics',
  'a8-mst-applications',
  'a8-kosaraju-vs-tarjan',
  'a8-bridges-vs-articulation',
  'a8-euler-vs-hamiltonian',
  'a8-erdos-renyi',
  'a8-peterson-graph',
  'a8-seven-bridges-konigsberg',
  'a8-gfg-must-do-extras',
  // A8.16 — interview framework (not algorithms)
  'a8-graph-interview-framework',
  'a8-identify-vertices-edges',
  'a8-constraint-driven-choice',
  'a8-common-graph-mistakes',
  'a8-must-do-graph-patterns',
  'a8-complexity-cheat-sheet',
])

const SKIP_SECTION_IDS = new Set(['A8.16'])

function isAlgorithmTopic(id: string, sectionId: string): boolean {
  if (SKIP_SECTION_IDS.has(sectionId)) return false
  if (NON_ALGORITHM_IDS.has(id)) return false
  return true
}

/** All graph algorithms in curriculum order, numbered 1…N. */
export const GRAPH_ALGORITHMS: GraphAlgorithmEntry[] = (() => {
  const out: GraphAlgorithmEntry[] = []
  let n = 0
  for (const section of TRACK_A_GRAPH_SECTIONS) {
    for (const topic of section.topics) {
      if (!isAlgorithmTopic(topic.id, section.id)) continue
      n += 1
      out.push({
        number: String(n),
        title: topic.title,
        topicId: topic.id,
        sectionId: section.id,
        sectionTitle: section.title,
      })
    }
  }
  return out
})()

/** @deprecated Prefer GRAPH_ALGORITHMS — kept for older imports. */
export const CORE_GRAPH_ALGORITHMS = GRAPH_ALGORITHMS

export function getGraphAlgorithmIds(): string[] {
  return GRAPH_ALGORITHMS.map((a) => a.topicId)
}

export function getCoreGraphAlgorithmIds(): string[] {
  return getGraphAlgorithmIds()
}

/**
 * Strip interview Qs, flashcards, examples, and factory study-scaffold fluff so
 * the memorize view is only Problem / Intuition / Steps / Code / Complexity.
 */
export function toMemorizeContent(content: TopicContent): TopicContent {
  const scrub = (text: string | undefined): string | undefined => {
    if (!text) return text
    let t = text
      // Old factory boilerplate (and any leftover copy)
      .replace(
        /\s*Study it with the same structure as the printable reference:[^.]*\.\s*/gi,
        ' ',
      )
      .replace(
        /\s*Name the vertices, edges, direction, and weights first[^.]*\.\s*/gi,
        ' ',
      )
      .replace(/\s+/g, ' ')
      .trim()
    return t || undefined
  }

  const howItWorks = (content.howItWorks ?? []).filter((b) => {
    if (b.type === 'list') {
      // Old factory scaffold steps ("Problem: state exactly what … asks")
      const scaffold = b.items.some((item) =>
        /state exactly what .+ asks you to compute/i.test(item),
      )
      return !scaffold
    }
    if (b.type === 'callout') {
      const title = b.title ?? ''
      if (/interview|framing/i.test(title)) return false
      if (/complexity|analysis/i.test(title)) return true
      if (/^notes?$/i.test(title)) return true
      return false
    }
    return false
  })

  const templates = (content.templates ?? []).filter((t) => {
    const cap = t.caption ?? ''
    if (/adjacency-list BFS skeleton/i.test(cap)) return false
    if (/DFS skeleton \(adapt/i.test(cap)) return false
    return true
  })

  const whatIsIt = scrub(content.whatIsIt)
  const whyExists = scrub(content.whyExists)
  // Drop mentalModel when it only repeats intuition
  const mentalModelRaw = scrub(content.mentalModel)
  const mentalModel =
    mentalModelRaw && mentalModelRaw !== whyExists ? mentalModelRaw : undefined

  return {
    whatIsIt,
    whyExists,
    mentalModel,
    howItWorks,
    templates,
    complexity: content.complexity,
    flashcards: [],
    interviewQuestions: [],
    keyTakeaways: content.keyTakeaways ?? [],
    quickRevision: [],
  }
}
