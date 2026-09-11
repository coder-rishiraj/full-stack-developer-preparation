import { useMemo } from 'react'
import hljs from 'highlight.js/lib/core'
import java from 'highlight.js/lib/languages/java'
import cpp from 'highlight.js/lib/languages/cpp'

hljs.registerLanguage('java', java)
hljs.registerLanguage('cpp', cpp)

type Lang = 'java' | 'cpp'

/**
 * Editor-style syntax highlighting for core-algo solutions (Java / C++).
 */
export function HighlightedCode({
  code,
  language,
}: {
  code: string
  language: Lang
}) {
  const html = useMemo(() => {
    try {
      return hljs.highlight(code.trimEnd(), { language }).value
    } catch {
      return escapeHtml(code.trimEnd())
    }
  }, [code, language])

  return (
    <pre className="ga-code hljs">
      <code
        className={`language-${language}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </pre>
  )
}

function escapeHtml(s: string) {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}
