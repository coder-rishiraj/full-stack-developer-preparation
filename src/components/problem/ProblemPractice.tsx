import { useEffect, useMemo, useState } from 'react'
import type { DsaProblem } from '@/domain/types'
import { verdict, type TestVerdict } from '@/runner/practice-check'

type Test = { name: string; input: string; output: string | null }
type TestFile = {
  problemId: string
  source: 'cses' | 'leetcode'
  credit: string
  tests: Test[]
  total?: number
  anyAnswer?: boolean
  interactive?: boolean
  timeLimit?: string | null
  anyOrder?: boolean
  starter?: string | null
  meta?: import('@/runner/java/leetcode-harness').LeetCodeMeta
}

type Row = { test: Test; status: string; ms: number; stdout: string; stderr: string; verdict: TestVerdict | null }
type Outcome = { kind: 'compile-error'; errors: string[] } | { kind: 'done'; rows: Row[] } | { kind: 'message'; text: string }

const CSES_STARTER = `import java.io.*;
import java.util.*;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = new StringTokenizer(in.readLine());
        // Read the input, solve the problem, and print the answer.
    }
}
`

/** How long one test may run in the browser (Java here is slower than on the judge). */
const PER_TEST_LIMIT_MS = 6000
const SHOWN = 4000
const clip = (s: string) => (s.length > SHOWN ? `${s.slice(0, SHOWN)}\n… ${(s.length - SHOWN).toLocaleString()} more characters` : s)
const storageKey = (id: string) => `practice-code:${id}`

function loadCode(id: string): string | null {
  try {
    return localStorage.getItem(storageKey(id))
  } catch {
    return null
  }
}

function saveCode(id: string, code: string) {
  try {
    localStorage.setItem(storageKey(id), code)
  } catch {
    /* storage unavailable: the code stays for this visit */
  }
}

/**
 * Write a solution in Java and check it against the problem's tests: CSES's official test
 * data (public/tests/cses, `npm run tests:cses`) or the LeetCode statement's examples
 * (public/tests/leetcode, `npm run tests:leetcode`). The code is compiled with javac and run on
 * a real JVM in the browser (CheerpJ), once per test.
 */
export function ProblemPractice({ problem }: { problem: DsaProblem }) {
  const [data, setData] = useState<TestFile | null | 'missing'>(null)
  const [code, setCode] = useState('')
  const [selected, setSelected] = useState(0)
  const [phase, setPhase] = useState<string | null>(null)
  const [outcome, setOutcome] = useState<Outcome | null>(null)
  const [open, setOpen] = useState<number | null>(null)
  const [progress, setProgress] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setData(null)
    setOutcome(null)
    const dir = problem.source === 'cses' ? 'cses' : 'leetcode'
    fetch(`${import.meta.env.BASE_URL}tests/${dir}/${problem.id}.json`)
      .then((r) => (r.ok ? (r.json() as Promise<TestFile>) : null))
      .catch(() => null)
      .then((d) => {
        if (cancelled) return
        setData(d ?? 'missing')
        const starter = d?.source === 'leetcode' ? (d.starter ?? '') : CSES_STARTER
        setCode(loadCode(problem.id) ?? starter)
      })
    return () => {
      cancelled = true
    }
  }, [problem.id, problem.source])

  const starter = useMemo(() => (data && data !== 'missing' ? (data.source === 'leetcode' ? (data.starter ?? '') : CSES_STARTER) : ''), [data])

  if (data === null) return null
  if (data === 'missing' || data.tests.length === 0) {
    return (
      <section className="cd-practice" aria-labelledby="practice-title">
        <h2 id="practice-title">Write and check your solution</h2>
        <p className="cd-run-note">
          {problem.source !== 'cses'
            ? 'This problem is premium-only on LeetCode, so its examples are not available here.'
            : data !== 'missing' && (data.total ?? 0) > 0
              ? `All ${data.total} official tests for this problem are too large to run in the browser.`
              : 'No test data is available for this problem.'}
        </p>
      </section>
    )
  }
  const tests = data
  if (tests.interactive) {
    return (
      <section className="cd-practice" aria-labelledby="practice-title">
        <h2 id="practice-title">Write and check your solution</h2>
        <p className="cd-run-note">This is an interactive problem: the judge answers your queries, so it cannot be checked with fixed test files.</p>
      </section>
    )
  }

  function edit(value: string) {
    setCode(value)
    saveCode(problem.id, value)
  }

  async function execute(indices: number[]) {
    if (phase) return
    setPhase('compiling')
    setOutcome(null)
    setOpen(null)
    const [{ runTestsOnJvm }, prepare, harness] = await Promise.all([
      import('@/runner/java/cheerpj'),
      import('@/runner/java/prepare'),
      import('@/runner/java/leetcode-harness'),
    ])
    let files: Record<string, string>
    let mainClass: string
    if (tests.source === 'leetcode') {
      const h = harness.leetcodeHarness(tests.meta ?? { params: [] })
      if ('error' in h) {
        setOutcome({ kind: 'message', text: h.error })
        setPhase(null)
        return
      }
      files = { ...h.files, [prepare.fileNameFor(code, tests.meta?.classname ?? 'Solution')]: code }
      mainClass = h.mainClass
    } else {
      const unit = prepare.programUnit(code)
      if ('error' in unit) {
        setOutcome({ kind: 'message', text: unit.error })
        setPhase(null)
        return
      }
      files = unit.files
      mainClass = unit.mainClass
    }
    const chosen = indices.map((i) => tests.tests[i])
    const rows: Row[] = []
    let needsCompile = true
    // One test per call, each with its own time limit, so one endless test does not hide the others.
    for (let k = 0; k < chosen.length; k++) {
      const test = chosen[k]
      setProgress(chosen.length > 1 ? `Running test ${k + 1} of ${chosen.length}…` : null)
      // The first test (and the first after a restart) also compiles the program.
      const limit = (needsCompile ? 20_000 : 0) + PER_TEST_LIMIT_MS
      const result = await runTestsOnJvm(files, mainClass, [test.input], (p) => setPhase(p === 'starting' ? 'starting' : 'running'), limit)
      if (result.kind === 'compile-error') {
        setOutcome({ kind: 'compile-error', errors: result.errors })
        setPhase(null)
        setProgress(null)
        return
      }
      if (result.kind === 'failed') {
        setOutcome({ kind: 'message', text: result.message })
        setPhase(null)
        setProgress(null)
        return
      }
      if (result.kind === 'timeout') {
        rows.push({ test, status: 'timeout', ms: limit, stdout: '', stderr: '', verdict: { result: 'fail', note: `Time limit exceeded: stopped after ${limit / 1000} s (an endless loop, or too slow).` } })
        needsCompile = true
        continue
      }
      needsCompile = false
      const run = result.tests[0]
      const v: TestVerdict =
        run.status === 'ok'
          ? verdict({ source: tests.source, problemId: problem.id, anyAnswer: !!tests.anyAnswer, interactive: false, anyOrder: !!tests.anyOrder }, test.input, run.stdout, test.output)
          : { result: 'fail', note: run.status === 'error' ? 'Runtime error' : `Exited with ${run.status}` }
      rows.push({ test, status: run.status, ms: run.ms, stdout: run.stdout, stderr: run.stderr, verdict: v })
    }
    setProgress(null)
    setOutcome({ kind: 'done', rows })
    if (rows.length === 1) setOpen(0)
    else {
      const firstFail = rows.findIndex((r) => r.verdict?.result !== 'pass')
      setOpen(firstFail >= 0 ? firstFail : null)
    }
    setPhase(null)
  }

  const rows = outcome?.kind === 'done' ? outcome.rows : []
  const passed = rows.filter((r) => r.verdict?.result === 'pass').length
  const unknown = rows.filter((r) => r.verdict?.result === 'unknown').length
  const busy =
    phase === 'starting' ? 'Starting Java…' : phase === 'compiling' ? 'Preparing…' : phase === 'running' ? (progress ?? 'Compiling and running…') : null

  return (
    <section className="cd-practice" aria-labelledby="practice-title">
      <h2 id="practice-title">Write and check your solution</h2>
      <p className="cd-run-note">
        Write your solution in Java{tests.source === 'cses' ? ' (a whole program reading standard input)' : ' (LeetCode’s template)'} and
        check it against {tests.tests.length} {tests.source === 'cses' ? 'official CSES tests' : 'examples from the LeetCode statement'}.
        Your code is saved in this browser.
      </p>
      <figure className="cd-code not-prose">
        <div className="cd-code-bar">
          <span className="cd-code-lang">Java</span>
          <span className="cd-code-title">{tests.source === 'cses' ? 'Main.java' : `${tests.meta?.classname ?? 'Solution'}.java`}</span>
          <span className="cd-code-actions">
            {code !== starter && (
              <button
                type="button"
                className="cd-code-copy"
                onClick={() => {
                  if (window.confirm('Replace your code with the starter template?')) edit(starter)
                }}
              >
                Reset
              </button>
            )}
          </span>
        </div>
        <textarea
          className="cd-code-editor cd-practice-editor"
          value={code}
          onChange={(e) => edit(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
              e.preventDefault()
              void execute(tests.tests.map((_, i) => i))
            } else if (e.key === 'Tab' && !e.shiftKey) {
              e.preventDefault()
              const el = e.currentTarget
              const { selectionStart: s, selectionEnd: t } = el
              edit(`${code.slice(0, s)}    ${code.slice(t)}`)
              requestAnimationFrame(() => {
                el.selectionStart = el.selectionEnd = s + 4
              })
            }
          }}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          rows={Math.min(30, Math.max(12, code.split('\n').length + 2))}
          aria-label="Your Java solution"
        />
        <section className="cd-run cd-run-lesson" aria-label="Check your solution">
          <div className="cd-run-head">
            <button type="button" className="cd-run-button" onClick={() => void execute(tests.tests.map((_, i) => i))} disabled={phase !== null}>
              {busy ?? `✓ Check all ${tests.tests.length} tests`}
            </button>
            <select
              className="cd-run-sample"
              value={selected}
              onChange={(e) => setSelected(Number(e.target.value))}
              aria-label="Test to run on its own"
            >
              {tests.tests.map((t, i) => (
                <option key={t.name} value={i}>
                  {t.name}
                </option>
              ))}
            </select>
            <button type="button" className="cd-run-sample" onClick={() => void execute([selected])} disabled={phase !== null}>
              ▶ Run this test
            </button>
          </div>
          <p className="cd-run-note">
            {tests.source === 'cses'
              ? `${tests.credit}: ${tests.tests.length} of ${tests.total ?? tests.tests.length} tests (the largest are left out so the page stays fast).${tests.anyAnswer ? ' This problem accepts any valid answer.' : ''}`
              : `${tests.credit}.${tests.anyOrder ? ' The answer may be in any order.' : ''} LeetCode’s full judge tests are private.`}{' '}
            Compiled with javac and run on Java 21 in your browser (
            <a href="https://cheerpj.com" target="_blank" rel="noreferrer">
              Built with CheerpJ
            </a>
            ). The first check starts Java and takes a few seconds.
          </p>
          {outcome?.kind === 'message' && (
            <div className="cd-run-output" data-state="error">
              <div className="cd-run-status">{outcome.text}</div>
            </div>
          )}
          {outcome?.kind === 'compile-error' && (
            <div className="cd-run-output" data-state="error">
              <div className="cd-run-status">
                <span>Compilation failed</span>
              </div>
              <pre tabIndex={0}>
                <code>{outcome.errors.join('\n')}</code>
              </pre>
            </div>
          )}
          {outcome?.kind === 'done' && (
            <div className="cd-practice-results">
              <div className="cd-practice-summary" data-ok={passed === rows.length}>
                {passed === rows.length
                  ? `✓ All ${rows.length} passed`
                  : `${passed} of ${rows.length} passed${unknown ? `, ${unknown} to check by hand` : ''}`}
              </div>
              <ul>
                {rows.map((row, i) => (
                  <li key={row.test.name} data-result={row.verdict?.result}>
                    <button type="button" className="cd-practice-row" onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i}>
                      <span className="cd-practice-mark">{row.verdict?.result === 'pass' ? '✓' : row.verdict?.result === 'unknown' ? '?' : '✗'}</span>
                      <span>{row.test.name}</span>
                      <span className="cd-run-time">{row.status === 'timeout' ? 'time limit' : `${row.ms} ms`}</span>
                    </button>
                    {open === i && (
                      <div className="cd-practice-detail">
                        {row.verdict?.note && <p className="cd-run-note">{row.verdict.note}</p>}
                        <div className="cd-code-output-label">Input</div>
                        <pre>
                          <code>{clip(row.test.input)}</code>
                        </pre>
                        <div className="cd-code-output-label">Expected</div>
                        <pre>
                          <code>{row.test.output === null ? '(not available)' : clip(row.test.output)}</code>
                        </pre>
                        <div className="cd-code-output-label">Your output</div>
                        <pre>
                          <code>{row.stdout ? clip(row.stdout) : '(nothing printed)'}</code>
                        </pre>
                        {row.stderr && (
                          <pre className="cd-run-stderr">
                            <code>{clip(row.stderr)}</code>
                          </pre>
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </figure>
    </section>
  )
}
