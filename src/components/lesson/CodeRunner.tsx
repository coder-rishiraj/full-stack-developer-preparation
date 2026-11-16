import { useState } from 'react'
import type { Runnable } from '@/runner/context'
import { check } from '@/runner/checkers'
import { RUN_TIME_LIMIT_MS, runJava, type RunResult } from '@/runner/worker-run'
import { EDITED_JAVA_TIME_LIMIT_MS } from '@/runner/java/run-edited'

/**
 * How the code is run: `precompiled` uses the build's verified JavaScript (unedited code);
 * `compile` compiles the current source in the browser first (edited code, or code the build
 * did not compile).
 */
type Mode = { kind: 'precompiled' } | { kind: 'compile'; source: string; earlier: string[] }

type Outcome = { run: RunResult | null; errors: string[]; message?: string }

async function execute(runnable: Runnable, mode: Mode, input: string): Promise<Outcome> {
  if (mode.kind === 'precompiled') return { run: await runJava(runnable, input), errors: [] }
  const { runJavaSource } = await import('@/runner/java/run-source')
  return runJavaSource(runnable.format === 'leetcode' ? runnable : null, mode.source, input, mode.earlier)
}

function CompileErrors({ outcome }: { outcome: Outcome }) {
  if (outcome.errors.length === 0 && !outcome.message) return null
  return (
    <div className="cd-run-output" data-state={outcome.run ? 'warn' : 'error'}>
      <div className="cd-run-status">
        <span>{outcome.run ? 'Compiler messages' : 'Compilation failed'}</span>
      </div>
      <pre tabIndex={0}>
        <code>{[...outcome.errors, ...(outcome.message ? [outcome.message] : [])].join('\n')}</code>
      </pre>
    </div>
  )
}

const busyLabel = (phase: string) => (phase === 'compiling' ? 'Compiling…' : 'Running…')

/** Longest output shown on the page; longer output is cut (the run itself is complete). */
const MAX_SHOWN = 20_000

function clip(text: string): { text: string; cut: number } {
  return text.length > MAX_SHOWN ? { text: text.slice(0, MAX_SHOWN), cut: text.length - MAX_SHOWN } : { text, cut: 0 }
}

function formatMs(ms: number): string {
  return ms < 1000 ? `${Math.max(1, Math.round(ms))} ms` : `${(ms / 1000).toFixed(2)} s`
}

/**
 * The "Run" panel under a runnable Java program: pick a sample or type any input, run
 * the program in the browser, and see its output, with a verdict when one is known.
 */
export function CodeRunner({ runnable, mode = { kind: 'precompiled' } }: { runnable: Runnable; mode?: Mode }) {
  const { samples } = runnable
  const [input, setInput] = useState(samples[0]?.input ?? '')
  const [running, setRunning] = useState<string | null>(null)
  const [result, setResult] = useState<{ input: string; outcome: Outcome } | null>(null)

  const sampleIndex = samples.findIndex((s) => s.input === input)

  async function run() {
    if (running) return
    setRunning(mode.kind === 'compile' ? 'compiling' : 'running')
    const ranInput = input
    const outcome = await execute(runnable, mode, ranInput)
    setResult({ input: ranInput, outcome })
    setRunning(null)
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault()
      void run()
    }
  }

  return (
    <section className="cd-run" aria-label="Run this program">
      <div className="cd-run-head">
        <span className="cd-run-label">Input</span>
        <div className="cd-run-samples" role="group" aria-label="Sample inputs">
          {samples.map((s, i) => (
            <button
              key={s.label}
              type="button"
              className="cd-run-sample"
              aria-pressed={i === sampleIndex}
              onClick={() => setInput(s.input)}
            >
              {s.label}
            </button>
          ))}
        </div>
        <button type="button" className="cd-run-button" onClick={() => void run()} disabled={running !== null}>
          {running ? busyLabel(running) : '▶ Run'}
        </button>
      </div>
      <textarea
        className="cd-run-input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={onKeyDown}
        spellCheck={false}
        rows={Math.min(8, Math.max(2, input.split('\n').length))}
        aria-label="Standard input for the program"
      />
      <p className="cd-run-note">
        {runnable.hint} Edit it and run again (⌘/Ctrl + Enter).{' '}
        {mode.kind === 'compile'
          ? 'Your edited code is compiled in your browser (the first run loads the Java compiler, about 7 MB).'
          : 'This exact code runs in your browser, compiled to JavaScript ahead of time.'}
      </p>
      {result && <CompileErrors outcome={result.outcome} />}
      {result?.outcome.run && <RunOutput runnable={runnable} input={result.input} run={result.outcome.run} />}
    </section>
  )
}

function RunOutput({ runnable, input, run }: { runnable: Runnable; input: string; run: RunResult }) {
  if (run.kind === 'failed') {
    return (
      <div className="cd-run-output" data-state="error">
        <div className="cd-run-status">Could not start the program: {run.message}</div>
      </div>
    )
  }
  if (run.kind === 'timeout') {
    return (
      <div className="cd-run-output" data-state="error">
        <div className="cd-run-status">
          Stopped after {RUN_TIME_LIMIT_MS / 1000} s. The input may be too large to run in the browser.
        </div>
      </div>
    )
  }

  const sample = runnable.samples.find((s) => s.input === input)
  const ok = run.status === 'ok' || run.status === 'exit 0'
  const verdict = ok ? check(runnable, input, run.stdout, sample?.output) : null
  const out = clip(run.stdout)
  const byRule = runnable.check === 'permutations' || runnable.check === 'two-sets'
  const showExpected = sample && verdict && !verdict.ok && !byRule

  return (
    <div className="cd-run-output" data-state={ok ? 'ok' : 'error'}>
      <div className="cd-run-status">
        <span>{ok ? 'Output' : run.status.startsWith('exit') ? `Exited with status ${run.status.slice(5)}` : 'Runtime error'}</span>
        <span className="cd-run-time">{formatMs(run.ms)}</span>
      </div>
      <pre tabIndex={0}>
        <code>{out.text.replace(/\s+$/, '') || 'The program printed nothing.'}</code>
      </pre>
      {out.cut > 0 && <p className="cd-run-note">… {out.cut.toLocaleString()} more characters not shown.</p>}
      {run.stderr && (
        <pre className="cd-run-stderr" tabIndex={0}>
          <code>{run.stderr.replace(/\s+$/, '')}</code>
        </pre>
      )}
      {verdict && (
        <div className="cd-run-verdict" data-ok={verdict.ok}>
          {verdict.ok ? '✓' : '✗'} {verdict.message}
          {sample && byRule && verdict.ok && sample.output.trim() !== run.stdout.trim() && (
            <> Any valid answer is accepted; the statement shows another one.</>
          )}
        </div>
      )}
      {showExpected && (
        <>
          <div className="cd-code-output-label">Expected</div>
          <pre tabIndex={0}>
            <code>{sample.output.replace(/\s+$/, '')}</code>
          </pre>
        </>
      )}
    </div>
  )
}

/**
 * The Run button under a lesson program: runs the program as it is (no input, unless it
 * reads standard input) and shows what it prints. The written output stays in print only.
 */
export function LessonRun({
  runnable,
  writtenOutput,
  mode = { kind: 'precompiled' },
}: {
  runnable: Runnable
  writtenOutput?: string
  mode?: Mode
}) {
  const [input, setInput] = useState('')
  const [running, setRunning] = useState<string | null>(null)
  const [outcome, setOutcome] = useState<Outcome | null>(null)
  const run = outcome?.run ?? null
  const unverified = runnable.verified === false
  const usesStdin = mode.kind === 'compile' ? /\bSystem\.in\b/.test(mode.source) : runnable.stdin

  async function go() {
    if (running) return
    setRunning(mode.kind === 'compile' ? 'compiling' : 'running')
    setOutcome(await execute(runnable, mode, input))
    setRunning(null)
  }

  return (
    <section className="cd-run cd-run-lesson" aria-label="Run this program">
      {usesStdin && (
        <textarea
          className="cd-run-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          spellCheck={false}
          rows={2}
          placeholder="Standard input for the program"
          aria-label="Standard input for the program"
        />
      )}
      <div className="cd-run-head">
        <button type="button" className="cd-run-button" onClick={() => void go()} disabled={running !== null}>
          {running ? busyLabel(running) : outcome ? '▶ Run again' : '▶ Run'}
        </button>
        <span className="cd-run-note">
          {mode.kind === 'compile'
            ? 'Compiles and runs this code in your browser (the first run loads the Java compiler, about 7 MB).'
            : 'Runs this program in your browser and shows what it prints.'}
        </span>
      </div>
      {unverified && runnable.note && <p className="cd-run-note cd-run-caveat">{runnable.note}</p>}
      {outcome && <CompileErrors outcome={outcome} />}
      {run && <LessonOutput run={run} />}
      {writtenOutput !== undefined && unverified && (
        <div className="cd-run-output" data-state="ok">
          <div className="cd-run-status">
            <span>Output shown in the lesson</span>
          </div>
          <pre tabIndex={0}>
            <code>{writtenOutput.replace(/\s+$/, '')}</code>
          </pre>
        </div>
      )}
      {writtenOutput !== undefined && !unverified && (
        <div className="hidden print:block">
          <div className="cd-code-output-label">Output</div>
          <pre>
            <code>{writtenOutput.replace(/\s+$/, '')}</code>
          </pre>
        </div>
      )}
    </section>
  )
}

function LessonOutput({ run }: { run: RunResult }) {
  if (run.kind !== 'done') {
    return (
      <div className="cd-run-output" data-state="error">
        <div className="cd-run-status">
          {run.kind === 'timeout'
            ? `Stopped after ${Math.max(RUN_TIME_LIMIT_MS, EDITED_JAVA_TIME_LIMIT_MS) / 1000} s.`
            : `Could not start the program: ${run.message}`}
        </div>
      </div>
    )
  }
  const ok = run.status === 'ok' || run.status === 'exit 0'
  const out = clip(run.stdout)
  return (
    <div className="cd-run-output" data-state={ok ? 'ok' : 'error'}>
      <div className="cd-run-status">
        <span>{ok ? 'Output' : run.status.startsWith('exit') ? `Exited with status ${run.status.slice(5)}` : 'Runtime error'}</span>
        <span className="cd-run-time">{formatMs(run.ms)}</span>
      </div>
      <pre tabIndex={0}>
        <code>{out.text.replace(/\s+$/, '') || 'The program printed nothing.'}</code>
      </pre>
      {out.cut > 0 && <p className="cd-run-note">… {out.cut.toLocaleString()} more characters not shown.</p>}
      {run.stderr && (
        <pre className="cd-run-stderr" tabIndex={0}>
          <code>{run.stderr.replace(/\s+$/, '')}</code>
        </pre>
      )}
    </div>
  )
}
