# Prompt for continuing the lesson rewrite

Paste the block below into a new Claude Code session opened in this repository.

---

```text
Continue the Career Duo lesson rewrite in this repository. We are working through Track B
(Frontend Engineering), then the remaining tracks, turning every curriculum topic into a full
lesson.

Read these first:
- docs/TRANSFORMATION_PROGRESS.md: what is built, how lessons are written, known follow-ups
- docs/LESSON_GUIDE.md: the writing standard
- docs/LESSON_AGENT_BRIEF.md: the brief each lesson-writing agent follows

How to work:
1. Run `npm run lessons:sync`, then `node scripts/pending-batches.mjs B` to list Track B
   batches that still have missing lessons, in order. A batch where only some files are
   missing was interrupted part-way.
2. Keep about six background agents running, one batch each, in batch order. Give each agent
   this prompt (replace N):
   "Work in the repository at <repo path>. Follow docs/LESSON_AGENT_BRIEF.md exactly for
   lesson batch N (run `node scripts/module-brief.mjs --batch N`). First check whether any of
   the batch's lesson files already exist in src/content/lessons/ (if so, review and validate
   rather than rewrite). Keep your context lean: verify snippets in small groups and avoid
   printing large files repeatedly. Write any scratch files under /tmp, not in the repo; when
   pasting output that contains a file path, use a neutral path like /app/example.js rather
   than the /tmp path."
3. When an agent finishes, read its report, pass on any wrong facts it corrected or claims
   it could not verify, and start the next pending batch.
4. If agents stop on a usage limit, resume them with SendMessage once it resets. If they
   cannot be resumed, start a fresh agent for the same batch; the prompt above makes it
   pick up existing files.
5. Before committing, move aside the lesson files of any batch whose agent has not
   finished (they may be incomplete), run `npm run lessons:sync` and
   `npx vitest run src/test/lessons.test.ts`, commit to main, then move the files back.
   Commit or push only when I ask.

Do not start Tracks C, D or E until Track B is finished, unless I say so. Unfinished batches
in other tracks: 177 (Java C1.7) and 298 (LLD D3) were stopped part-way.
```

---

Progress at the time this was written: 455 of 1,289 classified topics had lessons
(Track A complete). Track B batches 28–81 were written (JavaScript, TypeScript, and the first
browser-architecture module); the next unstarted batch was 82.
