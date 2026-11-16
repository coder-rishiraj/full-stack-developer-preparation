import type { Runnable } from '../context'
import type { RunResult } from '../worker-run'
import { runOnJvm } from './cheerpj'
import { harnessUnit, programUnit, topTypes, type CompileUnit } from './prepare'

export type SourceRun = { errors: string[]; run: RunResult | null; message?: string }

let harnesses: Promise<Record<string, { main: string; extra?: string }>> | null = null
const loadHarnesses = () =>
  (harnesses ??= import('../generated/java-harness.json').then((m) => m.default as Record<string, { main: string; extra?: string }>))

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
 * Compiles the reader's Java with javac and runs it on a real JVM (CheerpJ) in the browser.
 * LeetCode-style problem programs get their generated harness; lesson programs that use
 * classes from earlier blocks of the lesson are compiled together with those blocks.
 */
export async function runJavaSource(
  runnable: Runnable | null,
  source: string,
  input: string,
  earlier: string[] = [],
  onPhase?: (phase: 'starting' | 'running') => void,
): Promise<SourceRun> {
  let unit: CompileUnit | { error: string }
  if (runnable?.format === 'leetcode') {
    const harness = (await loadHarnesses())[runnable.key]
    if (!harness) return { errors: [], run: null, message: 'This program has no harness to run it.' }
    unit = harnessUnit(source, harness.main, harness.extra)
  } else {
    unit = programUnit(source)
  }
  if ('error' in unit) return { errors: [unit.error], run: null }
  let result = await runOnJvm(unit.files, unit.mainClass, input, onPhase)
  if (!result.run && earlier.length > 0 && result.compileErrors.some((e) => e.includes('cannot find symbol'))) {
    const companions = companionsFor(source, earlier)
    const withCompanions = companions.length > 0 ? programUnit(source, companions) : null
    if (withCompanions && !('error' in withCompanions)) {
      const retry = await runOnJvm(withCompanions.files, withCompanions.mainClass, input, onPhase)
      if (retry.run) result = retry
    }
  }
  return { errors: result.compileErrors, run: result.run, message: result.message }
}
