import { describe, expect, test } from 'vitest'
import { TOPICS, getTopicMeta } from '@/content/taxonomy'
import { checkLesson } from '@/content/lessons/validate'
import { extractSection, parseLesson } from '@/lib/lesson-markdown'

const sources = import.meta.glob<string>('../content/lessons/*.md', { query: '?raw', import: 'default', eager: true })
const SOURCE_BY_FILE = Object.fromEntries(
  Object.entries(sources).map(([p, src]) => [p.split('/').pop()!, src]),
)
const files = Object.keys(SOURCE_BY_FILE).sort()
const ids = new Set(files.map((f) => f.replace(/\.md$/, '')))

const ctx = {
  getTopic: getTopicMeta,
  childrenOf: (id: string) => TOPICS.filter((t) => t.parentTopicId === id),
  hasOwnLesson: (id: string) => ids.has(id),
}

describe('lesson markdown parser', () => {
  test('parses the lesson dialect', () => {
    const doc = parseLesson(`---
summary: A test lesson.
difficulty: beginner
minutes: 10
objectives:
  - one
  - two
---
## Intro {#intro}

Some **bold**, *italic*, \`code\` and [[a1-recursion|recursion]].

> [!TIP] Remember
> Callout body.

\`\`\`java title="Main.java"
System.out.println(1);
\`\`\`
\`\`\`output
1
\`\`\`

| A | B |
|---|---|
| 1 | 2 |

- item
  - nested

### Sub

\`\`\`quiz
Q: Pick one
- [ ] no
- [x] yes
> because
\`\`\`
`)
    expect(doc.issues).toEqual([])
    expect(doc.frontmatter.objectives).toEqual(['one', 'two'])
    const code = doc.blocks.find((b) => b.type === 'code')
    expect(code).toMatchObject({ language: 'java', title: 'Main.java', output: '1' })
    expect(doc.blocks.find((b) => b.type === 'callout')).toMatchObject({ variant: 'tip' })
    expect(doc.outline.map((o) => o.id)).toEqual(['intro', 'sub'])
    expect(extractSection(doc.blocks, 'sub')?.length).toBe(2)
    const list = doc.blocks.find((b) => b.type === 'list')
    expect(list && list.type === 'list' && list.items[0].children.length).toBe(1)
  })

  test('reports structural problems', () => {
    const doc = parseLesson('# Title\n\n#### Skipped\n\n```\nno lang\n```\n')
    expect(doc.issues.join('\n')).toMatch(/H1/)
    expect(doc.issues.join('\n')).toMatch(/skips/)
    expect(doc.issues.join('\n')).toMatch(/without a language/)
  })
})

describe('lessons', () => {
  test('lesson directory is readable', () => {
    expect(Array.isArray(files)).toBe(true)
  })

  test.each(files)('%s', (file: string) => {
    const id = file.replace(/\.md$/, '')
    const result = checkLesson(id, SOURCE_BY_FILE[file], ctx)
    expect(result.errors, `${file}:\n  ${result.errors.join('\n  ')}`).toEqual([])
  })
})
