import { useState } from 'react'
import type { Runnable } from '@/runner/context'
import { check } from '@/runner/checkers'
import { RUN_TIME_LIMIT_MS, runJava, type RunResult } from '@/runner/worker-run'

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
export function CodeRunner({ runnable }: { runnable: Runnable }) {
  const { samples } = runnable
  const [input, setInput] = useState(samples[0]?.input ?? '')
  const [running, setRunning] = useState(false)
  const [result, setResult] = useState<{ input: string; run: RunResult } | null>(null)

  const sampleIndex = samples.findIndex((s) => s.input === input)

  async function execute() {
    if (running) return
    setRunning(true)
    const ranInput = input
    const run = await runJava(runnable, ranInput)
    setResult({ input: ranInput, run })
    setRunning(false)
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault()
      void execute()
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
        <button type="button" className="cd-run-button" onClick={() => void execute()} disabled={running}>
          {running ? 'Running…' : '▶ Run'}
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
        {runnable.hint} Edit it and run again (⌘/Ctrl + Enter). This exact code runs in your browser, compiled to
        JavaScript ahead of time.
      </p>
      {result && <RunOutput runnable={runnable} input={result.input} run={result.run} />}
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
export function LessonRun({ runnable, writtenOutput }: { runnable: Runnable; writtenOutput?: string }) {
  const [input, setInput] = useState('')
  const [running, setRunning] = useState(false)
  const [run, setRun] = useState<RunResult | null>(null)

  async function execute() {
    if (running) return
    setRunning(true)
    setRun(await runJava(runnable, input))
    setRunning(false)
  }

  return (
    <section className="cd-run cd-run-lesson" aria-label="Run this program">
      {runnable.stdin && (
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
        <button type="button" className="cd-run-button" onClick={() => void execute()} disabled={running}>
          {running ? 'Running…' : run ? '▶ Run again' : '▶ Run'}
        </button>
        <span className="cd-run-note">Runs this program in your browser and shows what it prints.</span>
      </div>
      {run && <LessonOutput run={run} />}
      {writtenOutput !== undefined && (
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
          {run.kind === 'timeout' ? `Stopped after ${RUN_TIME_LIMIT_MS / 1000} s.` : `Could not start the program: ${run.message}`}
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
