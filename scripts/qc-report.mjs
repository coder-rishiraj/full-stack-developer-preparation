/**
 * Phase 5 QC report — run via: npm run qc
 * Prints error/warning totals and top codes. Exits 1 on errors.
 */
import { createServer } from 'vite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const server = await createServer({
  root,
  server: { middlewareMode: true },
  appType: 'custom',
})

try {
  const { TOPICS } = await server.ssrLoadModule('/src/content/taxonomy.ts')
  const { PROBLEMS } = await server.ssrLoadModule('/src/content/problems/index.ts')
  const topicsMod = await server.ssrLoadModule('/src/content/topics/index.ts')
  const { buildQcReport, summarizeByCode } = await server.ssrLoadModule('/src/domain/qc.ts')

  await topicsMod.preloadAllTopicContent()
  const contentIds = topicsMod.getReadyTopicIds()
  /** @type {Record<string, unknown>} */
  const contentById = {}
  for (const id of contentIds) {
    contentById[id] = topicsMod.getTopicContentSync(id)
  }

  const report = buildQcReport({
    topics: TOPICS,
    contentById,
    contentIds,
    problems: PROBLEMS,
  })

  console.log(`Concepts: ${report.topicCount}`)
  console.log(`Classified study items: ${report.classifiedCount}`)
  console.log(`Nested concepts: ${report.nestedConceptCount}`)
  console.log(`Content modules: ${report.contentCount}`)
  console.log(`Errors: ${report.errors.length}`)
  console.log(`Warnings: ${report.warnings.length}`)
  console.log('Error codes:', summarizeByCode(report.errors))
  console.log('Warning codes:', summarizeByCode(report.warnings))

  if (report.errors.length) {
    console.log('\nSample errors:')
    for (const e of report.errors.slice(0, 40)) {
      console.log(`- [${e.code}] ${e.topicId ?? '-'}: ${e.message}`)
    }
    process.exitCode = 1
  } else {
    console.log('\nQC hard gate: PASS')
  }
} finally {
  await server.close()
}
