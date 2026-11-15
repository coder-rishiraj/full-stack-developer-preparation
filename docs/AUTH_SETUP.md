# Accounts & cloud progress sync (Firebase, free)

Sign-in and per-user progress saving run on **Firebase's free Spark plan** — no credit card, no
server to host, and the project is never paused for inactivity.

| What | Free allowance (Spark) | This app's usage |
| --- | --- | --- |
| Authentication (email/password, Google) | 50,000 monthly active users | 1 user = 1 MAU |
| Firestore storage | 1 GiB | one small document per user |
| Firestore reads / writes | 50,000 / 20,000 per day | ~1 read per visit, writes batched every 1.5 s of activity |

Without the env vars below the site runs exactly as before (guest mode, progress in this browser only).

## How it works

- **Guest** — progress lives in IndexedDB on this device (key `state`).
- **Sign in** (Google or email + password, with password reset and email verification) — the account's
  progress is loaded from Firestore `users/{uid}` and cached in IndexedDB (`state:{uid}`) for instant,
  offline-friendly loads.
- **First sign-in on a device** — any guest progress there is **merged into the account**
  (`src/domain/merge-user-state.ts`: newer/further topic & problem status wins, notes/bookmarks/lists
  are combined), then the guest copy is cleared.
- **Every change** (topic status, DSA status, notes, bookmarks, revision schedule, extra points, custom
  topics, theme/reading prefs, interview date) is saved locally and pushed to Firestore after 1.5 s.
  Unsent edits survive going offline or closing the tab and are sent on the next visit.
- **Other devices/tabs** receive changes live via a Firestore listener.
- **Sign out** — the last edits are flushed, then the site switches back to guest data.

Code: `src/lib/firebase.ts`, `src/lib/cloud-sync.ts`, `src/stores/auth-store.ts`,
`src/pages/LoginPage.tsx`, `src/components/layout/AccountMenu.tsx`,
`src/components/layout/AccountSettings.tsx`. Security rules: `firestore.rules`.

## Current setup (done 2026-11-16)

- Firebase project **`career-duo`** (Spark plan, Google Analytics and Gemini off), web app `career-duo-web`.
- Sign-in methods: **Email/Password** and **Google** (consent-screen name "Career Duo").
- Authorised domains: `localhost`, `career-duo.firebaseapp.com`, `career-duo.web.app`, **`career-duo.netlify.app`**.
- Firestore (Standard edition, `asia-south1` Mumbai, production mode) with [`firestore.rules`](../firestore.rules) published.
- Web config is committed in [`.env`](../.env), so local dev and the Netlify build use it with no dashboard
  settings. If you add a custom domain, add it under Authentication → Settings → Authorised domains.

## Setting up a new project from scratch (≈10 minutes)

1. **Create a project** — <https://console.firebase.google.com> → *Add project* (Google Analytics is
   optional; you can turn it off). It starts on the free Spark plan.
2. **Register a web app** — Project overview → *</>* (Web) → give it a name → *Register app*. Copy the
   `firebaseConfig` values it shows.
3. **Enable sign-in methods** — *Build → Authentication → Get started → Sign-in method*:
   - **Email/Password** → Enable → Save.
   - **Google** → Enable → choose a support email → Save.
4. **Create the database** — *Build → Firestore Database → Create database* → choose a location near
   your users → start in **production mode**.
5. **Apply the security rules** — Firestore → *Rules* tab → replace everything with the contents of
   [`firestore.rules`](../firestore.rules) → *Publish*. (Or with the CLI: `npx firebase-tools login`
   then `npx firebase-tools deploy --only firestore:rules --project <project-id>`.)
6. **Authorise your domains** — Authentication → *Settings → Authorized domains*. `localhost` is there
   by default; add your production domain (e.g. `your-site.netlify.app` and any custom domain).
7. **Add the config to the app** — put the six values in `.env` (committed; used by dev and production
   builds). `.env.local` overrides it on one machine, e.g. to point at a different project.

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=<project-id>.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=<project-id>
VITE_FIREBASE_STORAGE_BUCKET=<project-id>.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

These web config values are **public identifiers, not secrets** — it is normal for them to be in the
shipped JavaScript. What protects each learner's data is `firestore.rules`: a user can read and write
only `users/{their uid}`, and nothing else in the database is reachable.

## Optional polish

- **Branded emails** — Authentication → *Templates* lets you edit the verification / password-reset
  emails and sender name.
- **Stop abuse** — Authentication → *Settings → User actions* and *App Check* (also free) can be enabled
  later if the site becomes popular.
- **Limit** — one user's progress must stay under ~900 KB of JSON (thousands of topics/problems with
  notes fit easily); the app shows a clear message if it ever exceeds that.
