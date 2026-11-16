import type { MdBlock } from '@/lib/lesson-markdown'

/** The code of every Java block, in document order (inside lists and callouts too). */
export function javaCodeBlocks(blocks: MdBlock[]): string[] {
  const out: string[] = []
  const walk = (list: MdBlock[]) => {
    for (const b of list) {
      if (b.type === 'code' && b.language === 'java') out.push(b.code)
      else if (b.type === 'callout' || b.type === 'quote') walk(b.blocks)
      else if (b.type === 'list') for (const item of b.items) walk(item.children)
    }
  }
  walk(blocks)
  return out
}
