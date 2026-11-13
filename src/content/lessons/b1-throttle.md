---
summary: Throttling lets a function run at most once per interval while events keep firing, so scroll, drag and mouse-move handlers stay responsive without doing hundreds of updates a second. You will implement timestamp and timer-based throttles, add a trailing call so the final event is never lost, and learn when requestAnimationFrame is the better throttle.
difficulty: intermediate
minutes: 35
objectives:
  - Explain what throttling guarantees and how it differs from debouncing
  - Implement a leading-edge throttle with a timestamp and explain which events it drops
  - Implement a throttle with a trailing call that always handles the latest event
  - Throttle visual updates with requestAnimationFrame and explain why frames are the right interval
  - Choose a throttle interval and clean up throttled handlers correctly
---

## Introduction

Scrolling a page fires `scroll` events very frequently — typically once per rendered frame, around 60 times a second on a common display and more on high-refresh screens — and `mousemove`, `pointermove` and `touchmove` behave similarly. If each event triggers real work — measuring elements, updating a progress bar, checking whether to load the next page of results, sending analytics — that work runs far more often than anyone can perceive, and it competes with the browser's own job of rendering frames. The page starts to stutter.

You cannot wait until the user stops, as a [[b1-debounce|debounce]] would, because the user expects to see the header shrink, the progress bar move and new items load *while* they scroll. What you need is a steady, limited rate: "handle at most one event every 100 ms, however many arrive". That is **throttling**. A throttled function runs at most once per **interval**; calls that arrive while the interval is still running are dropped or merged into a single later call.

Throttling is a small user-space pattern built on timestamps or timers, like debouncing. This lesson implements the common variants, shows exactly which events each one keeps, and introduces `requestAnimationFrame` as the natural throttle for anything visual. The side-by-side comparison with debouncing is in [[b1-debounce-vs-throttle]].

## Before you start

- **Timers** — `setTimeout`, `clearTimeout`, and the fact that callbacks run as later tasks. See [[b1-settimeout]] and [[b1-event-loop]].
- **Closures** — per-instance state in a returned function. See [[b1-closures]].
- **Debouncing** — the sibling pattern, useful for contrast. See [[b1-debounce]].

## The intuition

Think of a turnstile that unlocks once per second. People keep arriving in a crowd; one person passes, then the turnstile stays locked for a second, then the next person passes. The crowd moves steadily rather than all at once, and the rate never exceeds one per second. A debounce, by contrast, would be a door that opens only after nobody has arrived for a second — useless while the crowd keeps coming.

The analogy has one gap that matters in code: at a real turnstile the people who are blocked wait their turn, whereas a basic throttle simply *discards* the events that arrive while it is locked. That is usually fine — the next event carries newer information anyway — but it means the very last event can be lost, which is why most production throttles add a trailing call.

## A timestamp throttle

The simplest throttle remembers when it last ran and refuses to run again until the interval has passed.

```javascript title="throttle-timestamp.mjs"
function throttle(fn, wait) {
  let lastRun = -Infinity;
  return function throttled(...args) {
    const now = Date.now();
    if (now - lastRun >= wait) {       // window has passed: run and start a new one
      lastRun = now;
      fn.apply(this, args);
    }                                  // otherwise drop the call
  };
}

const start = Date.now();
const onScroll = throttle((y) => {
  console.log(`${Date.now() - start} ms: scrollY = ${y}`);
}, 100);

// A scroll event every 35 ms for 350 ms
for (let t = 0; t <= 350; t += 35) setTimeout(() => onScroll(t), t);
```

```output
0 ms: scrollY = 0
105 ms: scrollY = 105
210 ms: scrollY = 210
315 ms: scrollY = 315
```

The simulated events use their own time as the "scroll position", so you can see which ones were kept. Timings vary by a few milliseconds between runs. Trace it:

- At 0 ms, `lastRun` is `-Infinity`, so the call runs and `lastRun` becomes 0. Initialising with `-Infinity` (rather than `0`) guarantees the very first call runs even if the clock reads a small number.
- At 35 and 70 ms, less than 100 ms has passed since 0, so both calls are dropped.
- At 105 ms, 105 ms has passed, so it runs and `lastRun` becomes 105. The next run is at 210, then 315.
- The event at 350 ms arrives only 35 ms after the last run and is dropped.

Eleven events produced four runs, at most one per 100 ms, starting immediately. This is a **leading-edge** throttle: it reacts instantly to the first event of a burst. It needs no timers at all, so it is cheap and has nothing to clean up.

Its weakness is visible in the output: the final event, `350`, was never handled. If the handler positions a "back to top" button or records how far the user scrolled, the UI is left showing a position from 35 ms before the scroll ended. For scrolling that ends at the bottom of the page, that may mean the "load more" check never sees the user reach the bottom.

## Adding a trailing call

To guarantee the latest event is handled, the throttle must remember the most recent call that arrived during an interval and run it when the interval ends. That needs a timer.

```javascript title="throttle.mjs"
function throttle(fn, wait, { leading = true, trailing = true } = {}) {
  let timerId = null;           // non-null while a window is open
  let pendingArgs = null;       // latest call made during the window
  let pendingThis = null;

  function endWindow() {
    if (trailing && pendingArgs) {
      fn.apply(pendingThis, pendingArgs);
      pendingArgs = pendingThis = null;
      timerId = setTimeout(endWindow, wait);   // the trailing call opens a new window
    } else {
      timerId = null;
    }
  }

  function throttled(...args) {
    if (timerId === null) {                    // no window open: start one
      if (leading) fn.apply(this, args);
      else { pendingArgs = args; pendingThis = this; }
      timerId = setTimeout(endWindow, wait);
    } else {
      pendingArgs = args;                      // remember only the latest call
      pendingThis = this;
    }
  }

  throttled.cancel = () => {
    clearTimeout(timerId);
    timerId = pendingArgs = pendingThis = null;
  };
  return throttled;
}

const start = Date.now();
const onScroll = throttle((y) => {
  console.log(`${Date.now() - start} ms: scrollY = ${y}`);
}, 100);

// A scroll event every 35 ms for 350 ms
for (let t = 0; t <= 350; t += 35) setTimeout(() => onScroll(t), t);
```

```output
1 ms: scrollY = 0
104 ms: scrollY = 70
205 ms: scrollY = 175
306 ms: scrollY = 280
408 ms: scrollY = 350
```

The same eleven events now produce five runs, and the last one handles `350`, the final position. Step through the windows:

| Window | Events arriving | What runs at the window's end |
|---|---|---|
| 0–100 ms | 0 (runs immediately, leading), 35, 70 | 70, the latest pending call; opens the next window |
| ~100–200 ms | 105, 140, 175 | 175; opens the next window |
| ~200–300 ms | 210, 245, 280 | 280; opens the next window |
| ~300–400 ms | 315, 350 | 350; opens the next window |
| ~400–500 ms | none | nothing; the throttle becomes idle |

Three design choices make this correct.

**Only the latest pending call is kept.** Storing every dropped call and replaying them would defeat the purpose. Newer scroll positions supersede older ones.

**A trailing run opens a new window.** Without the `setTimeout(endWindow, wait)` after the trailing call, a new event arriving 1 ms after the trailing run would start a fresh window and run immediately (leading), giving two runs 1 ms apart and breaking the "at most once per interval" guarantee.

**The timer is the state.** `timerId !== null` means "an interval is in progress". That makes `cancel()` simple and gives a component one thing to clean up.

Notice the trade-off between the two versions. The timestamp throttle's runs line up with incoming events (it can only run *during* a call); the timer version runs some calls slightly after they arrived — the event at 70 ms was handled at about 100 ms. That delay is at most one interval, and it is the price of never losing the final event.

### Leading and trailing options

| `leading` | `trailing` | Behaviour |
|---|---|---|
| `true` | `true` | Run immediately, then at most once per interval with the latest call, including a final one. A good default. |
| `true` | `false` | Same as the timestamp throttle: immediate, drops calls during the interval, may miss the last event. |
| `false` | `true` | Wait for the first interval to end, then run with the latest call; nothing runs at the start. |

Lodash's `throttle(fn, wait, { leading, trailing })` defaults to both edges and is implemented as a debounce with `maxWait` equal to `wait` — a reminder that the two patterns are close relatives that differ in one guarantee.

## Throttling to the frame: requestAnimationFrame

For work that changes what is on screen, the right interval is not an arbitrary number of milliseconds but the display's **frame**. The browser paints at the display's refresh rate (about every 16.7 ms at 60 Hz, 8.3 ms at 120 Hz). Updating a style three times between two paints wastes two of the updates; updating it in the middle of a frame can also force extra layout work. `requestAnimationFrame(callback)` schedules a callback to run just before the next paint, which makes it a natural throttle: at most one update per frame, at exactly the right moment.

```javascript title="raf-throttle.js"
function rafThrottle(fn) {
  let frameId = null;
  let latestArgs = null;

  function throttled(...args) {
    latestArgs = args;                     // keep only the newest event
    if (frameId !== null) return;          // an update is already scheduled
    frameId = requestAnimationFrame(() => {
      frameId = null;
      fn(...latestArgs);
    });
  }
  throttled.cancel = () => {
    if (frameId !== null) cancelAnimationFrame(frameId);
    frameId = null;
  };
  return throttled;
}

const header = document.querySelector('header');
const onScroll = rafThrottle(() => {
  header.classList.toggle('compact', window.scrollY > 80);
});
window.addEventListener('scroll', onScroll, { passive: true });
```

This needs a browser page, so it was not run here. Many events within one frame collapse into a single update that uses the newest value, and the update runs right before paint. The rate adapts automatically to the display, and browsers pause `requestAnimationFrame` callbacks in background tabs, so a hidden page does no work. The `{ passive: true }` option tells the browser the listener will not call `preventDefault()`, which lets it keep scrolling smoothly without waiting for JavaScript. [[b1-requestanimationframe-js]] and [[b3-raf]] cover the frame callback in depth.

Use a millisecond throttle when the work is not visual or when you want a rate lower than the frame rate — sending a position to the server every 500 ms, checking an expensive condition every 200 ms, reporting progress. Use `requestAnimationFrame` when the work reads or writes layout or styles.

> [!TIP] Prefer frames for visual work
> If the handler changes styles, classes or positions, start with a `requestAnimationFrame` throttle. Reach for a millisecond interval only when you need a rate lower than the frame rate or the work is not visual.

## Throttling in real code

**Infinite scroll.** A throttled scroll handler that checks "are we within 500 px of the bottom?" was the classic approach. Today an [[b3-intersection-observer|IntersectionObserver]] watching a sentinel element at the end of the list is better: the browser reports visibility changes without running your code on every scroll event at all.

**Drag and pointer tracking.** Dragging an element should update its position every frame (`requestAnimationFrame`), while syncing the position to collaborators over a WebSocket might be throttled to every 50–100 ms to save bandwidth.

**Analytics and telemetry.** Scroll-depth tracking, cursor heatmaps and "user is typing…" indicators are throttled to a few updates per second.

**Server side.** Throttling also describes rate limiting at a larger scale — API rate limits and backpressure — but those protect shared resources across many clients and use algorithms such as token buckets. The UI pattern here concerns one function in one process.

In a component, create the throttled function once (for example with `useMemo` or a ref in React), attach it as the listener, and in cleanup both remove the listener and call `cancel()`, so a pending trailing call cannot run after the component is gone. The cleanup reasoning is the same as for listeners in [[b1-memory-leaks]].

## Trade-offs and alternatives

A shorter interval gives smoother feedback but more work; a longer one saves work but feels choppy. As a guide: frame rate (`requestAnimationFrame`) for anything visual; 50–100 ms for things that should feel live but do not draw; several hundred milliseconds for network-bound reporting.

| Technique | Strength | Limitation |
|---|---|---|
| Timestamp throttle (leading only) | Simplest; no timers; instant response | Can drop the final event |
| Timer throttle with trailing call | Never loses the latest event | Some calls handled up to one interval late; needs cancellation |
| `requestAnimationFrame` throttle | Matches paint timing and display rate; paused in background tabs | Browser only; not for non-visual rate limits |
| Debounce | One call after activity ends | Nothing happens during the activity |
| Observers (`IntersectionObserver`, `ResizeObserver`) | No per-event JavaScript at all | Only for the conditions they observe |

Throttling also does not make expensive work cheap. If each run takes 80 ms, a 100 ms throttle still keeps the main thread busy most of the time; the fix is to make the work smaller or move it off the main thread, as [[b1-long-tasks]] explains.

## Common mistakes

**Debouncing instead of throttling for scroll.** The UI updates only after scrolling stops and feels broken. Use a throttle or `requestAnimationFrame`.

**Losing the final event.** A leading-only throttle can leave the UI one step behind at the end of a gesture. Use a trailing call when the final value matters.

**Running a trailing call without opening a new interval.** The next event then runs immediately, producing two runs a few milliseconds apart.

**Creating a new throttled function per event or render.** Each instance has its own state, so nothing is throttled. Create it once.

**Forgetting cleanup.** Remove the listener and cancel any pending trailing timer or animation frame when the component unmounts.

**Throttling with a fixed 16 ms timer for animation.** `setTimeout(…, 16)` drifts relative to the display's refresh, runs in background tabs, and is wrong on 120 Hz screens. Use `requestAnimationFrame` for visual updates.

> [!MISTAKE] Throttling does not shorten each run
> A 100 ms throttle around an 80 ms handler still keeps the main thread busy 80% of the time during scrolling. Measure the handler itself before tuning the interval.

## Interview perspective

**"Implement throttle."** Start with the timestamp version and explain `lastRun`, why it starts at `-Infinity`, and which calls are dropped. Then point out that the last event can be lost and implement the trailing version, explaining why only the latest call is kept and why the trailing run opens a new window. Interviewers often ask you to trace a timeline; a table like the one above is a clear way to do it.

**"Throttle or debounce for X?"** Ask whether the user needs feedback during the activity. Scroll, resize-while-dragging, mouse movement: throttle. Search input, autosave, validation: debounce.

**"How would you throttle a scroll animation?"** `requestAnimationFrame`, because it aligns updates with paints and adapts to the refresh rate; mention passive listeners as a bonus.

## Practice

1. Predict what `throttle.mjs` prints for the same event stream with `{ leading: false }`, then run it and explain any difference from your prediction.
2. Add a `flush()` method that immediately runs a pending trailing call.
3. Build a scroll-progress bar that uses a `requestAnimationFrame` throttle and reads `scrollY` only once per frame.
4. Replace a throttled "load more when near the bottom" scroll handler with an `IntersectionObserver`, and explain what work is no longer done on each scroll event.
5. Given events every 30 ms from 0 to 300 ms and a 100 ms throttle with both edges, write down when each run happens and which event it handles. Then run the code and compare.

## Quick revision {#quick-revision}

- Throttle: run at most once per interval while calls keep arriving; extra calls are dropped or merged.
- Timestamp throttle: `if (now - lastRun >= wait) { lastRun = now; fn() }` — leading only, no timers, may lose the last event.
- Trailing throttle: remember the latest call during the window, run it when the window ends, and open a new window after that run.
- Options: leading + trailing (default in Lodash), leading only, trailing only.
- `requestAnimationFrame` throttle: at most one update per frame, right before paint, paused in background tabs; best for visual work.
- Throttle for scroll, drag, pointer movement and progress; debounce for search, autosave and validation.
- Prefer observers (`IntersectionObserver`, `ResizeObserver`) over throttled event handlers when they fit.
- Create once, remove the listener and cancel pending timers or frames on unmount.

## Key takeaways {#key-takeaways}

- Throttling gives continuous feedback at a capped rate, which is what users expect during scrolling and dragging.
- A leading-only throttle is simplest but can drop the final event; a trailing call fixes that at the cost of up to one interval of delay.
- For anything that changes the screen, the display frame is the right interval, so use `requestAnimationFrame`.
- Throttling reduces how often work runs, not how expensive each run is.
- Debounce and throttle answer different questions: "has the user finished?" versus "what is happening now?".

```quiz
Q: A leading-only timestamp throttle with a 100 ms interval receives calls at 0, 40, 80, 120 and 150 ms. Which calls run?
- [ ] Only the call at 150 ms
- [x] The calls at 0 and 120 ms
- [ ] The calls at 0, 80 and 150 ms
- [ ] All five, 100 ms apart
> The call at 0 runs and sets `lastRun = 0`. Calls at 40 and 80 are within 100 ms and are dropped. At 120, 120 ms have passed, so it runs and sets `lastRun = 120`. At 150 only 30 ms have passed, so it is dropped. Nothing is queued in this version, so calls are never replayed later.
```

```quiz
Q: In a throttle with a trailing call, why must the trailing run start a new interval?
- [ ] To make the leading call run again
- [x] Otherwise a call arriving just after the trailing run would run immediately, breaking the once-per-interval limit
- [ ] Because `setTimeout` cannot be cancelled once it has fired
- [ ] To keep a list of all dropped calls
> After the trailing run, the throttle would look idle, so the next call would be treated as the start of a new burst and run at once. Two runs only milliseconds apart violate the throttle's guarantee. Opening a new window after the trailing run prevents that.
```

```quiz
Q: Why is `requestAnimationFrame` usually better than `setTimeout(fn, 16)` for throttling a scroll-driven visual update?
- [ ] It runs more often than `setTimeout`
- [ ] It runs on a separate thread
- [x] It runs once per frame just before the browser paints, adapts to the display's refresh rate, and pauses in background tabs
- [ ] It guarantees the callback takes less than 16 ms
> Frame callbacks are aligned with rendering, so each update is painted and none are wasted between paints. A 16 ms timer drifts relative to the display, is wrong for 120 Hz screens, and keeps running in hidden tabs. `requestAnimationFrame` still runs on the main thread and does not limit how long the callback takes.
```
