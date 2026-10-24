# Career Duo transformation — progress and how to continue

This file is the hand-over note for the multi-session rewrite of Career Duo into a full
lesson-based learning platform. The authoritative topic checklist is generated:
[CURRICULUM_CHECKLIST.md](CURRICULUM_CHECKLIST.md) (`npm run lessons:sync`).

## What is in place

**Lesson platform**
- Lessons are Markdown files in `src/content/lessons/<topic-id>.md`, parsed by an in-house
  parser (`src/lib/lesson-markdown.ts`, no dependency) and rendered by
  `src/components/lesson/LessonBlocks.tsx`.
- Nested curriculum concepts are taught inside their parent lesson under an anchored heading
  (`## HashMap {#a1-hashmap}`); the nested topic's page shows that section on its own.
- Writing standard: [LESSON_GUIDE.md](LESSON_GUIDE.md). Brief given to each writing session:
  [LESSON_AGENT_BRIEF.md](LESSON_AGENT_BRIEF.md). Quality bar: `src/content/lessons/a3-binary-search.md`.
- Validation: `npm run lessons:check` (vitest) and `npm run lessons:sync` (validates, writes
  `src/content/lessons/manifest.json` and the checklist). `npm run build` runs the sync first and
  fails on an invalid lesson.
- Topics without a lesson keep their previous condensed notes (or template outline) and say so.

**Design system and product**
- Six themes (Light, Dark, Midnight, Nord, Solarized Light, Solarized Dark) plus System, as CSS
  tokens in `src/styles/theme.css`; lesson typography in `src/styles/lesson.css`. Print is always light.
- Reading preferences (typeface, size, line length) and learning preferences (auto-track opened
  lessons, default view) in Settings; persisted with progress and included in export/import.
- Three-column topic layout: curriculum tree (left), lesson (centre), table of contents with
  scroll-spy, reading progress, prerequisites, related, next and practice links (right).
- Lesson / Study / Revision views; the revision view is built from each lesson's quick-revision,
  cheat-sheet and key-takeaways sections plus its quizzes.
- Dashboard: continue learning, recommended next, track cards with lesson counts, recently visited.
- Track pages: progress, module completion, lesson availability, difficulty and time estimates.
- DSA explorer: grouped by curriculum topic with links to lessons, `?topic=` filter.
- Favorites grouped by track with filter and remove; Print preview prints lessons;
  Capstone page renders a milestone-based project guide (`src/content/capstone/ticket-booking.md`)
  with persistent task checklists.

## How lessons are being written

The 1,289 classified topics are split into ~350 batches (`scripts/data/lesson-batches.json`).
`node scripts/module-brief.mjs --batch <N>` prints a batch's topics, nested concepts,
prerequisites and existing notes. Each batch is written by one session following
`docs/LESSON_AGENT_BRIEF.md`.

To continue: run `npm run lessons:sync`, open the checklist, and pick batches whose topics are
still unchecked (`node scripts/module-brief.mjs --batch N` shows what a batch covers).

## Known follow-ups

- `src/test/qc.test.ts` warns about graph-pack topics missing pattern-recognition and
  common-mistakes notes; it clears once the A8 graph lessons (batches 11–18) are written,
  because QC skips topics taught by a lesson.
