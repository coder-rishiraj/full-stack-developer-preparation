# SE Prep — Software Engineering Preparation Platform

Personal learning OS for interview-ready software engineering depth (DSA, Frontend, Java/Backend, System Design, Applied AI).

## Phase status

- **Phase 1:** App foundation + 4 deep exemplar topics — done
- **Phase 2:** Full curriculum hierarchy (meta only) — done
- **Phase 3:** Full CSES + NeetCode 250 indexes — done
- **Phase 4:** Incremental deep content — done (all curriculum topics have deep notes)
- **Phase 5:** Quality control — **complete** (automated QC gate + print/screen fixes)

## Personal overlays (extra points + custom topics)

Your edits never rewrite curriculum `.ts` files. They live in IndexedDB with progress and export via Settings:

- **Extra points** — on any topic page, use **Your additions** to append bullets to Key Takeaways, Quick Revision, and related lists
- **Custom topics** — sidebar **My Topics** → create a topic (track, priority, notes); appears in roadmap, track pages, search, and favorites

## Phase 5 QC

Run the hard gate anytime:

```bash
npm run qc
npm test
```

Checks include:

- Every taxonomy topic has a content module (and vice versa)
- Broken prereq / related / next links
- DSA problem → topic link integrity
- Required revision/interview surfaces (`keyTakeaways`, `quickRevision`, `flashcards`, `interviewQuestions`, `whatIsIt`)
- DSA pattern extras (`patternRecognition`, `commonMistakes`, complexity, Java where applicable)
- System-design topics include a `systemDesign` block
- Filler / generic template smell
- Search finds topics and problems

Print CSS hides chrome (not callouts), wraps code for A4, and favors grayscale-readable tables/diagrams.

## Phase 4 content

Deep notes auto-register from `src/content/topics/<topic-id>.ts` (`export const content`).
`contentReady` is derived from that map. Modules load **lazily** on topic/print routes.

## Scripts

```bash
npm install
npm run dev
npm run build
npm test
npm run qc
npm run generate:dsa
```

Open `http://localhost:5173` — lands on the Dashboard.

Dev server is pinned to **port 5173** (`strictPort`). Normal edits hot-reload; a full browser refresh also picks up file changes. If the UI ever looks stale after big batches of new files:

```bash
npm run dev:fresh
```

That clears Vite’s cache and restarts on 5173.