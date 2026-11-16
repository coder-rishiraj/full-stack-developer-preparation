/**
 * Imports LeetCode's official examples for the Check button on NeetCode problem pages.
 *
 *   npm run tests:leetcode
 *
 * LeetCode publishes only the examples in each statement (its judge's tests are private), so
 * a NeetCode problem's tests are those examples. For each problem this reads, from LeetCode's
 * public GraphQL API: the example inputs (exampleTestcaseList), the method signature
 * (metaData), the official Java starter code, and the statement, from which the expected
 * output of each example is parsed.
 *
 * Writes public/tests/leetcode/<problem-id>.json. Premium-only problems (no public statement)
 * are skipped and listed.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { root } from './java-runner-lib.mjs'

const outDir = path.join(root, 'public/tests/leetcode')
const cacheDir = path.join(root, 'node_modules/.cache/leetcode-examples')
mkdirSync(outDir, { recursive: true })
mkdirSync(cacheDir, { recursive: true })

const list = readFileSync(path.join(root, 'src/content/problems/neetcode250.ts'), 'utf8')
const problems = [...list.matchAll(/id:\s*"([^"]+)",[\s\S]*?sourceUrl:\s*"https:\/\/leetcode\.com\/problems\/([^/"]+)\/?"/g)].map((m) => ({ id: m[1], slug: m[2] }))

const QUERY = `query q($s: String!) { question(titleSlug: $s) { isPaidOnly content exampleTestcaseList metaData codeSnippets { langSlug code } } }`

async function fetchQuestion(slug) {
  const file = path.join(cacheDir, `${slug}.json`)
  if (existsSync(file)) return JSON.parse(readFileSync(file, 'utf8'))
  const res = await fetch('https://leetcode.com/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Referer: `https://leetcode.com/problems/${slug}/` },
    body: JSON.stringify({ query: QUERY, variables: { s: slug } }),
  })
  const data = (await res.json()).data?.question ?? null
  writeFileSync(file, JSON.stringify(data))
  await new Promise((r) => setTimeout(r, 500))
  return data
}

const decode = (s) =>
  s
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')

/** The expected outputs of the statement's examples, in order. */
function exampleOutputs(content) {
  const text = decode(content.replace(/<[^>]+>/g, ''))
  const outs = []
  for (const m of text.matchAll(/Output:?\s*([\s\S]*?)(?=\n\s*(?:Explanation|Example|Input|Constraints|Note|Follow[- ]up)\b|$)/g)) {
    outs.push(m[1].trim())
  }
  return outs
}

const summary = { written: 0, premium: [], mismatched: [] }
for (const p of problems) {
  const q = await fetchQuestion(p.slug)
  if (!q || q.isPaidOnly || !q.content) {
    summary.premium.push(p.id)
    continue
  }
  const meta = JSON.parse(q.metaData)
  const inputs = q.exampleTestcaseList ?? []
  const outputs = exampleOutputs(q.content)
  if (outputs.length < inputs.length) summary.mismatched.push(`${p.id} (${inputs.length} inputs, ${outputs.length} outputs)`)
  const design = Boolean(meta.classname)
  const tests = inputs.map((raw, i) => {
    const lines = raw.split('\n')
    const input = design || !meta.params ? raw : meta.params.map((param, k) => `${param.name} = ${lines[k] ?? ''}`).join('\n')
    return { name: `Example ${i + 1}`, input: input + '\n', output: outputs[i] ?? null }
  })
  const starter = q.codeSnippets?.find((c) => c.langSlug === 'java')?.code ?? null
  writeFileSync(
    path.join(outDir, `${p.id}.json`),
    JSON.stringify({
      problemId: p.id,
      source: 'leetcode',
      slug: p.slug,
      credit: 'Examples from the LeetCode problem statement',
      anyOrder: /\bany order\b/i.test(decode(q.content.replace(/<[^>]+>/g, ''))),
      meta,
      starter,
      tests,
    }) + '\n',
  )
  summary.written++
}
console.log(`Wrote examples for ${summary.written} NeetCode problems.`)
if (summary.premium.length) console.log(`Premium or unavailable (skipped): ${summary.premium.join(', ')}`)
if (summary.mismatched.length) console.log(`Fewer parsed outputs than inputs: ${summary.mismatched.join(', ')}`)
