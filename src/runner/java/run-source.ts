import type { Runnable } from '../context'
import type { RunResult } from '../worker-run'
import { compileJava, runCompiledJava } from './run-edited'
import { harnessUnit, programUnit, topTypes, type CompileUnit } from './prepare'

export type SourceRun = { errors: string[]; run: RunResult | null; message?: string }

let harnesses: Promise<Record<string, { main: string; extra?: string }>> | null = null
const loadHarnesses = () => (harnesses ??= import('../generated/java-harness.json').then((m) => m.default as Record<string, { main: string; extra?: string }>))

/**
 * Earlier blocks of the lesson that a program may build on: nearest first, each type name
 * defined once (the same rule as scripts/build-lesson-runner.mjs).
 */
function companionsFor(code: string, earlier: string[]): string[] {
  const taken = new Set(topTypes(code).map((t) => t.name))
  const out: string[] = []
  for (const block of [...earlier].reverse()) {
    const names = topTypes(block).map((t) => t.name)
    if (names.length === 0 || names.some((n) => taken.has(n))) continue
    names.forEach((n) => taken.add(n))
    out.push(block)
  }
  return out
}

/**
 * Compiles the reader's Java in the browser and runs it. LeetCode-style problem programs get
 * their generated harness; lesson programs that use classes from earlier blocks of the
 * lesson are compiled together with those blocks.
 */
export async function runJavaSource(runnable: Runnable | null, source: string, input: string, earlier: string[] = []): Promise<SourceRun> {
  let unit: CompileUnit | { error: string }
  if (runnable?.format === 'leetcode') {
    const harness = (await loadHarnesses())[runnable.key]
    if (!harness) return { errors: [], run: null, message: 'This program has no harness to run it.' }
    unit = harnessUnit(source, input, harness.main, harness.extra)
  } else {
    unit = programUnit(source, input)
  }
  if ('error' in unit) return { errors: [unit.error], run: null }
  let compiled = await compileJava(unit)
  if (!compiled.ok && earlier.length > 0 && compiled.errors.some((e) => e.includes('cannot find symbol'))) {
    const companions = companionsFor(source, earlier)
    if (companions.length > 0) {
      const withCompanions = programUnit(source, input, companions)
      if (!('error' in withCompanions)) {
        const retry = await compileJava(withCompanions)
        if (retry.ok) compiled = retry
      }
    }
  }
  if (!compiled.ok) return { errors: compiled.errors, run: null, message: compiled.message }
  return { errors: compiled.errors, run: await runCompiledJava(compiled.wasm) }
}
