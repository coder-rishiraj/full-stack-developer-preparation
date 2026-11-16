import { useEffect, useMemo, useRef, useState } from 'react'
import type { Runnable } from '@/runner/context'
import { isTypeScript, programMode, type SourceLang } from '@/runner/js/compile'
import { JS_TIME_LIMIT_MS, prepareJs, runJs, type JsRunResult } from '@/runner/js/run-js'
import type { OutputEvent } from '@/runner/js/runtime'
import { highlight } from './CodeBlock'

const LABEL: Record<SourceLang, string> = {
  js: 'JavaScript',
  ts: 'TypeScript',
  jsx: 'JSX',
  tsx: 'TSX',
}

type PageRun = {
  js: string
  diagnostics: string[] | null
  mode: 'script' | 'module'
  candidates: string[]
  nonce: number
}
const MAX_SHOWN = 20_000

/**
 * A lesson's JavaScript/TypeScript block that the reader can edit and run. It runs in the
 * browser the way Node runs it (TypeScript: type-checked like `tsc --strict`, then run), and
 * shows the type errors and what the program prints. The written output is kept for print.
 */
export function JsCodeBlock({
  code,
  language,
  title,
  writtenOutput,
  runnable,
}: {
  code: string
  language: string
  title?: string
  writtenOutput?: string
  runnable: Runnable
}) {
  const original = code.replace(/\s+$/, '')
  const lang = runnable.lang ?? 'js'
  const [source, setSource] = useState(original)
  const [editing, setEditing] = useState(false)
  const [phase, setPhase] = useState<'idle' | 'compiling' | 'running'>('idle')
  const [result, setResult] = useState<JsRunResult | null>(null)
  const [pageRun, setPageRun] = useState<PageRun | null>(null)
  const [pageError, setPageError] = useState<string | null>(null)
  const isPage = runnable.env === 'page'
  const [copied, setCopied] = useState(false)
  const editor = useRef<HTMLTextAreaElement>(null)
  const html = useMemo(() => highlight(source, language), [source, language])
  const edited = source !== original

  async function run() {
    if (phase !== 'idle') return
    if (isPage) {
      setPhase('compiling')
      const prepared = await prepareJs(source, lang)
      setPhase('idle')
      if (prepared.error) {
        setPageError(prepared.error)
        return
      }
      setPageError(null)
      setPageRun((prev) => ({
        js: prepared.js,
        diagnostics: prepared.diagnostics,
        mode: programMode(source),
        candidates: componentNames(source),
        nonce: (prev?.nonce ?? 0) + 1,
      }))
      return
    }
    const res = await runJs(source, lang, setPhase)
    setResult(res)
    setPhase('idle')
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(source)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* clipboard blocked */
    }
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault()
      void run()
    } else if (event.key === 'Tab' && !event.shiftKey) {
      event.preventDefault()
      const el = event.currentTarget
      const { selectionStart: start, selectionEnd: end } = el
      const next = `${source.slice(0, start)}  ${source.slice(end)}`
      setSource(next)
      requestAnimationFrame(() => {
        el.selectionStart = el.selectionEnd = start + 2
      })
    } else if (event.key === 'Escape') {
      setEditing(false)
    }
  }

  function startEditing() {
    setEditing(true)
    requestAnimationFrame(() => editor.current?.focus())
  }

  return (
    <figure className="cd-code not-prose">
      <div className="cd-code-bar">
        <span className="cd-code-lang">{LABEL[lang]}</span>
        {title && <span className="cd-code-title">{title}</span>}
        {edited && <span className="cd-code-edited">edited</span>}
        <span className="cd-code-actions">
          {edited && (
            <button type="button" className="cd-code-copy" onClick={() => setSource(original)}>
              Reset
            </button>
          )}
          <button type="button" className="cd-code-copy" onClick={() => (editing ? setEditing(false) : startEditing())}>
            {editing ? 'Done' : 'Edit'}
          </button>
          <button type="button" className="cd-code-copy" onClick={copy} aria-label="Copy code">
            {copied ? 'Copied' : 'Copy'}
          </button>
        </span>
      </div>
      {editing ? (
        <textarea
          ref={editor}
          className="cd-code-editor"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          onKeyDown={onKeyDown}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          rows={Math.max(3, source.split('\n').length + 1)}
          aria-label={`Edit the ${LABEL[lang]} code`}
        />
      ) : (
        <pre tabIndex={0} onDoubleClick={startEditing}>
          <code className={`hljs language-${language}`} dangerouslySetInnerHTML={{ __html: html }} />
        </pre>
      )}
      <section className="cd-run cd-run-lesson" aria-label="Run this code">
        <div className="cd-run-head">
          <button type="button" className="cd-run-button" onClick={() => void run()} disabled={phase !== 'idle'}>
            {phase === 'compiling'
              ? 'Loading TypeScript…'
              : phase === 'running'
                ? 'Running…'
                : result
                  ? '▶ Run again'
                  : '▶ Run'}
          </button>
          <span className="cd-run-note">
            {isPage
              ? 'Renders in a sandboxed page in your browser, with React.'
              : isTypeScript(lang)
                ? 'Type-checks and runs in your browser, like tsc and Node.'
                : 'Runs in your browser, like Node.'}{' '}
            Edit the code and run it again (⌘/Ctrl + Enter while editing).
          </span>
        </div>
        {isPage && pageError && (
          <div className="cd-run-output" data-state="error">
            <div className="cd-run-status">Could not compile the code: {pageError}</div>
          </div>
        )}
        {isPage && pageRun && (
          <>
            {isTypeScript(lang) && pageRun.diagnostics && (
              <TypeCheck
                diagnostics={pageRun.diagnostics}
                expected={source === original && expectsTypeErrors(original, writtenOutput)}
              />
            )}
            <PagePreview key={pageRun.nonce} run={pageRun} />
          </>
        )}
        {result && (
          <JsOutput
            result={result}
            lang={lang}
            expectsTypeErrors={source === original && expectsTypeErrors(original, writtenOutput)}
          />
        )}
        {runnable.verified === false && runnable.note && <p className="cd-run-note cd-run-caveat">{runnable.note}</p>}
        {writtenOutput !== undefined && runnable.verified === false && (
          <div className="cd-run-output" data-state="ok">
            <div className="cd-run-status">
              <span>Output shown in the lesson</span>
            </div>
            <pre tabIndex={0}>
              <code>{writtenOutput.replace(/\s+$/, '')}</code>
            </pre>
          </div>
        )}
        {writtenOutput !== undefined && runnable.verified !== false && (
          <div className="hidden print:block">
            <div className="cd-code-output-label">Output</div>
            <pre>
              <code>{writtenOutput.replace(/\s+$/, '')}</code>
            </pre>
          </div>
        )}
      </section>
    </figure>
  )
}

/**
 * Whether the lesson's example is meant to fail the type check: its comments mark lines as
 * errors, it uses @ts-expect-error, or its written output shows tsc errors.
 */
function expectsTypeErrors(code: string, writtenOutput?: string): boolean {
  return (
    /\/\/.*\b(errors?|rejected|not assignable|does not compile|won't compile|compile error)\b|@ts-expect-error/i.test(
      code,
    ) || /error TS\d+/.test(writtenOutput ?? '')
  )
}

function JsOutput({
  result,
  lang,
  expectsTypeErrors: expected,
}: {
  result: JsRunResult
  lang: SourceLang
  expectsTypeErrors: boolean
}) {
  if (result.status === 'failed') {
    return (
      <div className="cd-run-output" data-state="error">
        <div className="cd-run-status">Could not run the code: {result.message}</div>
      </div>
    )
  }
  let shown = 0
  const parts = result.events.map((e, i) => {
    if (shown >= MAX_SHOWN) return null
    const text = e.text.slice(0, MAX_SHOWN - shown)
    shown += text.length
    return e.stream === 'err' ? (
      <span key={i} className="cd-run-err">
        {text}
      </span>
    ) : (
      <span key={i}>{text}</span>
    )
  })
  const total = result.events.reduce((n, e) => n + e.text.length, 0)
  const ended =
    result.status === 'ok'
      ? null
      : result.status === 'error'
        ? 'Stopped by an uncaught error'
        : result.status === 'timeout'
          ? `Stopped after ${JS_TIME_LIMIT_MS / 1000} s`
          : result.status === 'stopped'
            ? 'Stopped: the program keeps scheduling timers'
            : `Exited with code ${result.status.slice(5)}`
  return (
    <>
      {isTypeScript(lang) && result.diagnostics && <TypeCheck diagnostics={result.diagnostics} expected={expected} />}
      <div className="cd-run-output" data-state={result.status === 'ok' || result.status === 'exit 0' ? 'ok' : 'error'}>
        <div className="cd-run-status">
          <span>{ended ?? 'Output'}</span>
          <span className="cd-run-time">
            {result.ms < 1000 ? `${Math.max(1, Math.round(result.ms))} ms` : `${(result.ms / 1000).toFixed(2)} s`}
          </span>
        </div>
        <pre tabIndex={0}>
          <code>{total === 0 ? 'The program printed nothing.' : parts}</code>
        </pre>
        {total > MAX_SHOWN && (
          <p className="cd-run-note">… {(total - MAX_SHOWN).toLocaleString()} more characters not shown.</p>
        )}
      </div>
    </>
  )
}

function TypeCheck({ diagnostics, expected }: { diagnostics: string[]; expected: boolean }) {
  return (
    <div className="cd-run-output" data-state={diagnostics.length === 0 || expected ? 'ok' : 'warn'}>
      <div className="cd-run-status">
        <span>
          {diagnostics.length === 0
            ? 'Type check'
            : expected
              ? `Type errors (${diagnostics.length}), as the example intends`
              : `Type errors (${diagnostics.length})`}
        </span>
      </div>
      <pre tabIndex={0}>
        <code>{diagnostics.length > 0 ? diagnostics.join('\n') : 'No type errors.'}</code>
      </pre>
      {diagnostics.length > 0 && (
        <p className="cd-run-note cd-run-explain">
          {expected
            ? 'This example is written to break the type rules: these are the errors the lesson explains. '
            : 'The compiler (tsc --strict) rejects these lines. '}
          Type errors do not stop the program: tsc still emits the JavaScript, and it ran below.
        </p>
      )}
    </div>
  )
}

/** Names of top-level components (capitalised functions, constants and classes). */
function componentNames(code: string): string[] {
  const names = new Set<string>()
  for (const m of code.matchAll(
    /^(?:export\s+(?:default\s+)?)?(?:async\s+)?(?:function\s*\*?\s*|const\s+|let\s+|var\s+|class\s+)([A-Z][A-Za-z0-9_]*)/gm,
  )) {
    names.add(m[1])
  }
  return [...names]
}

let pageRuntime: Promise<string> | null = null
function loadPageRuntime(): Promise<string> {
  pageRuntime ??= fetch(`${import.meta.env.BASE_URL}runner/page-runtime.js`).then((r) => {
    if (!r.ok) throw new Error(`could not load the preview runtime (${r.status})`)
    return r.text()
  })
  pageRuntime.catch(() => (pageRuntime = null))
  return pageRuntime
}

const FRAME_STYLE = `<style>html{color-scheme:light}body{margin:12px;font:14px/1.5 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#22201c;background:#fff}button{font:inherit}</style>`

/**
 * Renders lesson code in a sandboxed frame (opaque origin: no access to the site's storage or
 * sign-in) and shows the page and its console.
 */
function PagePreview({ run }: { run: PageRun }) {
  const frame = useRef<HTMLIFrameElement>(null)
  const [html, setHtml] = useState<string | null>(null)
  const [failed, setFailed] = useState<string | null>(null)
  const [height, setHeight] = useState(200)
  const [events, setEvents] = useState<OutputEvent[]>([])
  const [errors, setErrors] = useState<string[]>([])

  useEffect(() => {
    let cancelled = false
    loadPageRuntime()
      .then((runtime) => {
        if (cancelled) return
        const script = runtime.replace(/<\/script/gi, '<\\/script')
        setHtml(
          `<!doctype html><html><head><meta charset="utf-8">${FRAME_STYLE}</head><body><div id="root"></div><script>${script}</script></body></html>`,
        )
      })
      .catch((e: Error) => !cancelled && setFailed(e.message))
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.source !== frame.current?.contentWindow) return
      const data = event.data as {
        type: string
        stream?: 'out' | 'err'
        text?: string
        height?: number
      }
      if (data.type === 'ready') {
        frame.current?.contentWindow?.postMessage(
          {
            type: 'run',
            code: run.js,
            mode: run.mode,
            candidates: run.candidates,
          },
          '*',
        )
      } else if (data.type === 'output' && data.text !== undefined) {
        setEvents((list) => [...list, { stream: data.stream ?? 'out', text: data.text! }])
      } else if (data.type === 'error' && data.text) {
        setErrors((list) => [...list, data.text!])
      } else if (data.type === 'height' && data.height) {
        setHeight(Math.min(640, Math.max(60, data.height + 4)))
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [run])

  if (failed) {
    return (
      <div className="cd-run-output" data-state="error">
        <div className="cd-run-status">{failed}</div>
      </div>
    )
  }
  return (
    <>
      <div className="cd-run-output" data-state={errors.length ? 'error' : 'ok'}>
        <div className="cd-run-status">
          <span>Preview</span>
        </div>
        {html && (
          <div className="cd-run-frame-wrap">
            <iframe
              ref={frame}
              className="cd-run-frame"
              title="Preview of the code"
              sandbox="allow-scripts allow-modals allow-forms"
              srcDoc={html}
              style={{ height }}
            />
          </div>
        )}
      </div>
      {(events.length > 0 || errors.length > 0) && (
        <div className="cd-run-output" data-state={errors.length ? 'error' : 'ok'}>
          <div className="cd-run-status">
            <span>Console</span>
          </div>
          <pre tabIndex={0}>
            <code>
              {events.map((e, i) =>
                e.stream === 'err' ? (
                  <span key={i} className="cd-run-err">
                    {e.text}
                  </span>
                ) : (
                  <span key={i}>{e.text}</span>
                ),
              )}
              {errors.map((t, i) => (
                <span key={`e${i}`} className="cd-run-err">
                  {`Uncaught ${t.replace(/^Uncaught /, '')}\n`}
                </span>
              ))}
            </code>
          </pre>
        </div>
      )}
    </>
  )
}
