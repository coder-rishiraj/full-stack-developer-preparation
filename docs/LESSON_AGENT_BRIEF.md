# Brief for a lesson-writing session

You are writing lessons for **Career Duo**, a software-engineering learning platform. Your job is
to turn one batch of curriculum topics into complete, textbook-quality lessons.

## Steps

1. Read `docs/LESSON_GUIDE.md` in full. It is the standard; follow it exactly.
2. Read `src/content/lessons/a3-binary-search.md`. It is the quality bar for depth, tone,
   structure and formatting. Your lessons should feel like they were written by the same author.
3. Run `node scripts/module-brief.mjs --batch <N>` to get your topics, their nested concepts,
   prerequisites, related topics and existing notes.
4. For each topic, read its existing notes file if one is listed (`src/content/topics/<id>.ts`,
   and for nested concepts their own notes files). Treat the notes as a checklist of coverage:
   every correct fact, subtopic, variation and pitfall they mention should be taught in your
   lesson — explained properly, not copied as terse bullets. Fix anything in the notes that is
   wrong or outdated. Files described as "generic template only" carry no real content; ignore
   them. Graph topics may draw on the reference packs in `src/content/topics/_graph-*.ts`.
5. Write `src/content/lessons/<topic-id>.md` for each classified topic in the batch. Teach every
   nested concept under a heading anchored with its id, e.g. `## HashMap {#a1-hashmap}`.
6. Validate each file and fix every error:
   `npx vitest run src/test/lessons.test.ts -t "<topic-id>.md"`
7. Re-read each lesson once as a beginner would. Fix anything that assumes knowledge the lesson
   has not given or linked, any paragraph that is really a list of notes, and any example that
   does not show real behaviour.

## Rules

- Create files only in `src/content/lessons/`, only for the topic ids in your batch. Do not edit
  any other file. Do not run `npm run lessons:sync`, `git`, `npm install`, or start servers.
- `[[topic-id]]` links must be real ids. Use ids from the brief, or find them with
  `grep -rho "id: '[a-z0-9-]*'" src/content/curriculum/ | sort -u` (or grep for a keyword).
- Technical accuracy comes first. If behaviour depends on a version, name the version. Prefer
  saying less over saying something wrong. Code must compile/run as shown, and shown output must
  be what the code really prints.
- Depth follows importance: tier1 topics and topics with many nested concepts deserve the most
  thorough treatment. Nested-concept sections are usually 300–900 words each; they must make
  sense when shown on their own page.
- Do not pad. No filler sentences, no repetition between sections.

## Report

When done, reply with at most ~120 words: one line per file (`id — words — one-phrase note`),
then any topic where you were unsure of a fact or had to make a judgement call.
