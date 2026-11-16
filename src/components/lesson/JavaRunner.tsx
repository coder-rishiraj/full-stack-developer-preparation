import { useMemo, useRef, useState } from 'react'
import type { Runnable } from '@/runner/context'
import { mainClassOf } from '@/runner/java/prepare'
import { highlight } from './CodeBlock'
import { CodeRunner, LessonRun } from './CodeRunner'

/** A runnable stand-in for Java the build did not compile: it runs with the in-browser compiler. */
function compileOnly(code: string): Runnable {
  const note = mainClassOf(code)
    ? 'This example runs with the in-browser Java compiler; it was not checked against the JVM, so its output may differ slightly from the lesson.'
    : 'This is a fragment (it has no main method), so it cannot run as written. Edit it into a complete program, with public static void main(String[] args), to run it.'
  return { key: '', chunk: '', problemId: '', format: 'lesson', hint: '', check: 'exact', samples: [], verified: false, note }
}

/**
 * Any Java block on a lesson or walkthrough page: editable, and runnable. Unedited code that
 * the build verified runs from its precompiled JavaScript; edited code (and code the build did
 * not compile) is compiled in the browser with javac and TeaVM.
 */
export function JavaCodeBlock({
  code,
  title,
  writtenOutput,
  runnable,
  earlier,
}: {
  code: string
  title?: string
  writtenOutput?: string
  runnable: Runnable | null
  earlier: string[]
}) {
  const original = code.replace(/\s+$/, '')
  const [source, setSource] = useState(original)
  const [editing, setEditing] = useState(false)
  const [copied, setCopied] = useState(false)
  const editor = useRef<HTMLTextAreaElement>(null)
  const html = useMemo(() => highlight(source, 'java'), [source])
  const edited = source !== original
  const precompiled = runnable !== null && runnable.chunk !== '' && !edited
  const mode = precompiled ? ({ kind: 'precompiled' } as const) : ({ kind: 'compile', source, earlier } as const)
  const target = runnable ?? compileOnly(original)
  const shownRunnable = edited && target.verified !== false ? { ...target, verified: true } : target

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
    if (event.key === 'Tab' && !event.shiftKey) {
      event.preventDefault()
      const el = event.currentTarget
      const { selectionStart: start, selectionEnd: end } = el
      setSource(`${source.slice(0, start)}    ${source.slice(end)}`)
      requestAnimationFrame(() => {
        el.selectionStart = el.selectionEnd = start + 4
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
        <span className="cd-code-lang">Java</span>
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
          aria-label="Edit the Java code"
        />
      ) : (
        <pre tabIndex={0} onDoubleClick={startEditing}>
          <code className="hljs language-java" dangerouslySetInnerHTML={{ __html: html }} />
        </pre>
      )}
      {target.format === 'stdin' || target.format === 'leetcode' ? (
        <CodeRunner runnable={target} mode={mode} />
      ) : (
        <LessonRun runnable={shownRunnable} writtenOutput={writtenOutput} mode={mode} />
      )}
    </figure>
  )
}
