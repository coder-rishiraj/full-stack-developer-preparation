import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { searchAll } from '@/lib/search'
import {
  ExecutionPriorityBadge,
  PriorityBadge,
  TrackBadge,
} from '@/components/ui/Badge'
import type { ExecutionPriority, Priority, TrackId } from '@/domain/types'
import { listCustomTopicsFromMap } from '@/domain/user-content'
import { useUserStore } from '@/stores/user-store'

function hrefForHit(type: string, id: string, topic?: string) {
  if (type === 'problem') return `/dsa/${id.replace('problem:', '')}`
  return `/topics/${topic ?? id.replace('topic:', '')}`
}

export function GlobalSearch() {
  const navigate = useNavigate()
  const listId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  const customTopicsMap = useUserStore((s) => s.customTopics)
  const customTopics = useMemo(
    () => listCustomTopicsFromMap(customTopicsMap),
    [customTopicsMap],
  )
  const results = useMemo(
    () => (query.trim() ? searchAll(query, 12, customTopics) : []),
    [query, customTopics],
  )

  useEffect(() => {
    setActiveIndex(0)
    setOpen(query.trim().length > 0)
  }, [query])

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        inputRef.current?.focus()
        setOpen(query.trim().length > 0)
      }
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [query])

  function goTo(index: number) {
    const hit = results[index]
    if (!hit) return
    setQuery('')
    setOpen(false)
    navigate(hrefForHit(hit.type, hit.id, hit.topic))
  }

  return (
    <div ref={rootRef} className="relative min-w-0 flex-1 max-w-xl">
      <input
        ref={inputRef}
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onFocus={() => {
          if (query.trim()) setOpen(true)
        }}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            setOpen(false)
            inputRef.current?.blur()
            return
          }
          if (!open || results.length === 0) return
          if (event.key === 'ArrowDown') {
            event.preventDefault()
            setActiveIndex((index) => (index + 1) % results.length)
          } else if (event.key === 'ArrowUp') {
            event.preventDefault()
            setActiveIndex((index) => (index - 1 + results.length) % results.length)
          } else if (event.key === 'Enter') {
            event.preventDefault()
            goTo(activeIndex)
          }
        }}
        placeholder="Search topics & DSA… ⌘K"
        aria-label="Search curriculum and DSA problems"
        aria-controls={listId}
        aria-expanded={open}
        aria-autocomplete="list"
        className="w-full rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-1.5 text-sm outline-none placeholder:text-[var(--text-faint)] focus:border-[var(--border-strong)]"
      />

      {open && (
        <div
          id={listId}
          role="listbox"
          className="absolute left-0 right-0 top-full z-50 mt-1 max-h-80 overflow-y-auto rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] shadow-lg"
        >
          {results.length === 0 ? (
            <p className="px-3 py-2 text-sm text-[var(--text-faint)]">No matches.</p>
          ) : (
            <ul>
              {results.map((hit, index) => {
                const href = hrefForHit(hit.type, hit.id, hit.topic)
                const active = index === activeIndex
                return (
                  <li key={hit.id} role="option" aria-selected={active}>
                    <Link
                      to={href}
                      className={`block px-3 py-2 text-sm hover:bg-[var(--bg-muted)] ${
                        active ? 'bg-[var(--bg-muted)]' : ''
                      }`}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => {
                        setQuery('')
                        setOpen(false)
                      }}
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-[10px] uppercase text-[var(--text-faint)]">
                          {hit.type}
                          {hit.topic?.startsWith('custom-') ? ' · custom' : ''}
                        </span>
                        {hit.track && <TrackBadge track={hit.track as TrackId} />}
                        {hit.tier && <PriorityBadge priority={hit.tier as Priority} />}
                        {hit.executionPriority && (
                          <ExecutionPriorityBadge
                            priority={hit.executionPriority as ExecutionPriority}
                          />
                        )}
                      </div>
                      <div className="mt-0.5 font-medium text-[var(--text)]">{hit.title}</div>
                      <div className="truncate text-xs text-[var(--text-muted)]">
                        …{hit.context}…
                      </div>
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
