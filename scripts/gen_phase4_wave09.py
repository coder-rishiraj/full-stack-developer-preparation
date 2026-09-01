#!/usr/bin/env python3
"""Generate Phase 4 wave-09 topic content (42 files)."""
import os

OUT = os.path.join(os.path.dirname(__file__), "../src/content/topics")


def q(s: str) -> str:
    return s.replace("\\", "\\\\").replace("'", "\\'").replace("\n", "\\n")


def block_list(items, indent=4, ordered=False):
    sp = " " * indent
    ord_part = ", ordered: true" if ordered else ""
    lines = [f"{sp}{{ type: 'list'{ord_part}, items: ["]
    for it in items:
        lines.append(f"{sp}  '{q(it)}',")
    lines.append(f"{sp}] }},")
    return "\n".join(lines)


def block_para(text, indent=4):
    sp = " " * indent
    return f"{sp}{{ type: 'paragraph', text: '{q(text)}' }},"


def block_code(lang, code, caption=None, indent=4):
    sp = " " * indent
    cap = f", caption: '{q(caption)}'" if caption else ""
    esc = code.replace("\\", "\\\\").replace("'", "\\'").replace("\n", "\\n")
    return f"{sp}{{ type: 'code', language: '{lang}', code: '{esc}'{cap} }},"


def block_mermaid(diagram, caption=None, indent=4):
    sp = " " * indent
    cap = f", caption: '{q(caption)}'" if caption else ""
    esc = diagram.replace("\\", "\\\\").replace("'", "\\'").replace("\n", "\\n")
    return f"{sp}{{ type: 'mermaid', diagram: '{esc}'{cap} }},"


def str_list(key, items, indent=2):
    sp = " " * indent
    lines = [f"{sp}{key}: ["]
    for it in items:
        lines.append(f"{sp}  '{q(it)}',")
    lines.append(f"{sp}],")
    return "\n".join(lines)


def prod_section(d):
    sp = "  "
    lines = [f"{sp}production: {{"]
    for k, v in d.items():
        lines.append(f"{sp}  {k}: [")
        for it in v:
            lines.append(f"{sp}    '{q(it)}',")
        lines.append(f"{sp}  ],")
    lines.append(f"{sp}}},")
    return "\n".join(lines)


def interview_section(d):
    sp = "  "
    lines = [f"{sp}interview: {{"]
    for k, v in d.items():
        lines.append(f"{sp}  {k}: [")
        for it in v:
            lines.append(f"{sp}    '{q(it)}',")
        lines.append(f"{sp}  ],")
    lines.append(f"{sp}}},")
    return "\n".join(lines)


def tradeoffs_section(d):
    sp = "  "
    lines = [f"{sp}tradeoffs: {{"]
    for k in ["advantages", "disadvantages", "alternatives", "whenToUse", "whenNotToUse"]:
        lines.append(f"{sp}  {k}: [")
        for it in d[k]:
            lines.append(f"{sp}    '{q(it)}',")
        lines.append(f"{sp}  ],")
    lines.append(f"{sp}}},")
    return "\n".join(lines)


def iq_section(items):
    sp = "  "
    lines = [f"{sp}interviewQuestions: ["]
    for it in items:
        lines.append(
            f"{sp}  {{ level: '{it['level']}', question: '{q(it['q'])}', answerHint: '{q(it['h'])}' }},"
        )
    lines.append(f"{sp}],")
    return "\n".join(lines)


def fc_section(items):
    sp = "  "
    lines = [f"{sp}flashcards: ["]
    for it in items:
        lines.append(f"{sp}  {{ front: '{q(it['f'])}', back: '{q(it['b'])}' }},")
    lines.append(f"{sp}],")
    return "\n".join(lines)


def system_design_section(sd):
    sp = "  "
    lines = [f"{sp}systemDesign: {{"]
    lines.append(f"{sp}  problem: '{q(sd['problem'])}',")
    lines.append(f"{sp}  requirements: {{")
    lines.append(f"{sp}    functional: [")
    for it in sd["requirements"]["functional"]:
        lines.append(f"{sp}      '{q(it)}',")
    lines.append(f"{sp}    ],")
    lines.append(f"{sp}    nonFunctional: [")
    for it in sd["requirements"]["nonFunctional"]:
        lines.append(f"{sp}      '{q(it)}',")
    lines.append(f"{sp}    ],")
    lines.append(f"{sp}  }},")
    for key in ["scaleAssumptions", "capacityEstimates", "dataFlow", "storage", "caching",
                "asyncProcessing", "scaling", "consistency", "reliability", "failureScenarios",
                "security", "observability", "bottlenecks", "alternatives", "tradeoffs",
                "interviewFollowUps"]:
        lines.append(f"{sp}  {key}: [")
        for it in sd[key]:
            lines.append(f"{sp}    '{q(it)}',")
        lines.append(f"{sp}  ],")
    lines.append(f"{sp}  api: [")
    for b in sd.get("api", []):
        if b["type"] == "code":
            lines.append(block_code(b["lang"], b["code"], b.get("caption"), 4))
    lines.append(f"{sp}  ],")
    lines.append(f"{sp}  dataModel: [")
    for b in sd.get("dataModel", []):
        if b["type"] == "list":
            lines.append(block_list(b["items"], 4))
    lines.append(f"{sp}  ],")
    lines.append(f"{sp}  highLevelArchitecture: [")
    for b in sd.get("highLevelArchitecture", []):
        if b["type"] == "paragraph":
            lines.append(block_para(b["text"], 4))
    lines.append(f"{sp}  ],")
    if "diagram" in sd:
        lines.append(f"{sp}  diagram: {{")
        lines.append(f"{sp}    mermaid: '{q(sd['diagram']['mermaid'])}',")
        if sd["diagram"].get("caption"):
            lines.append(f"{sp}    caption: '{q(sd['diagram']['caption'])}',")
        lines.append(f"{sp}  }},")
    lines.append(f"{sp}  evolution: [")
    for ev in sd["evolution"]:
        bottleneck = f", bottleneck: '{q(ev['bottleneck'])}'" if ev.get("bottleneck") else ""
        lines.append(
            f"{sp}    {{ stage: '{q(ev['stage'])}', description: '{q(ev['description'])}'{bottleneck} }},"
        )
    lines.append(f"{sp}  ],")
    lines.append(f"{sp}}},")
    return "\n".join(lines)


def write_topic(tid, t):
    parts = [
        "import type { TopicContent } from '@/domain/types'",
        "",
        "export const content: TopicContent = {",
        f"  whatIsIt: '{q(t['whatIsIt'])}',",
        f"  whyExists: '{q(t['whyExists'])}',",
        f"  mentalModel: '{q(t['mentalModel'])}',",
        "  howItWorks: [",
    ]
    for b in t.get("howItWorks", []):
        if b["type"] == "list":
            parts.append(block_list(b["items"], 4, b.get("ordered", False)))
        elif b["type"] == "paragraph":
            parts.append(block_para(b["text"], 4))
        elif b["type"] == "code":
            parts.append(block_code(b["lang"], b["code"], b.get("caption"), 4))
        elif b["type"] == "mermaid":
            parts.append(block_mermaid(b["diagram"], b.get("caption"), 4))
    parts.append("  ],")
    parts.append("  example: [")
    for b in t.get("example", []):
        if b["type"] == "paragraph":
            parts.append(block_para(b["text"], 4))
        elif b["type"] == "code":
            parts.append(block_code(b["lang"], b["code"], b.get("caption"), 4))
        elif b["type"] == "list":
            parts.append(block_list(b["items"], 4))
    parts.append("  ],")
    parts.append(tradeoffs_section(t["tradeoffs"]))
    parts.append(str_list("failureModes", t["failureModes"]))
    parts.append(prod_section(t["production"]))
    parts.append(interview_section(t["interview"]))
    parts.append(str_list("keyTakeaways", t["keyTakeaways"]))
    parts.append(iq_section(t["iq"]))
    parts.append(fc_section(t["flashcards"]))
    parts.append(str_list("quickRevision", t["quickRevision"]))
    if "systemDesign" in t:
        parts.append(system_design_section(t["systemDesign"]))
    parts.append("}")
    parts.append("")
    path = os.path.join(OUT, f"{tid}.ts")
    with open(path, "w", encoding="utf-8") as f:
        f.write("\n".join(parts))
    return path


def T(**kwargs):
    return kwargs


def sd(problem, func, nonfunc, **kwargs):
    base = {
        "problem": problem,
        "requirements": {"functional": func, "nonFunctional": nonfunc},
        "scaleAssumptions": kwargs.get("scale", []),
        "capacityEstimates": kwargs.get("capacity", []),
        "api": kwargs.get("api", [{"type": "code", "lang": "http", "code": "GET /health → 200"}]),
        "dataModel": kwargs.get("dataModel", [{"type": "list", "items": ["Entity: id, timestamps"]}]),
        "highLevelArchitecture": kwargs.get("arch", [{"type": "paragraph", "text": "Clients → LB → stateless services → data stores."}]),
        "diagram": kwargs.get("diagram", {"mermaid": "flowchart LR\n  C[Client] --> API[API]\n  API --> DB[(Store)]", "caption": "High-level path"}),
        "dataFlow": kwargs.get("dataFlow", ["Request → validate → persist → respond"]),
        "storage": kwargs.get("storage", ["Primary DB + object store as needed"]),
        "caching": kwargs.get("caching", ["Redis hot aggregates"]),
        "asyncProcessing": kwargs.get("async", ["Stream processing for rollups"]),
        "scaling": kwargs.get("scaling", ["Horizontal stateless tier"]),
        "consistency": kwargs.get("consistency", ["Eventual for analytics; strong for billing"]),
        "reliability": kwargs.get("reliability", ["Idempotent writes; retries with backoff"]),
        "failureScenarios": kwargs.get("failures", ["Hot keys; worker crash; partial outage"]),
        "security": kwargs.get("security", ["AuthN/Z; rate limits; input validation"]),
        "observability": kwargs.get("observability", ["Metrics, tracing, SLO dashboards"]),
        "bottlenecks": kwargs.get("bottlenecks", ["Write amplification on hot advertisers"]),
        "alternatives": kwargs.get("alternatives", ["Batch ETL instead of real-time"]),
        "tradeoffs": kwargs.get("tradeoffs", ["Accuracy vs latency"]),
        "interviewFollowUps": kwargs.get("followUps", ["How handle late events?"]),
        "evolution": kwargs.get("evolution", [
            {"stage": "1. MVP", "description": "Monolith + SQL aggregates.", "bottleneck": "Write load."},
            {"stage": "2. Scale", "description": "Kafka + stream processors.", "bottleneck": "Ops complexity."},
            {"stage": "3. Global", "description": "Regional shards + merge.", "bottleneck": "Cross-region consistency."},
        ]),
    }
    return base


TOPICS = {}

# --- d10 ---
TOPICS["d10-ad-aggregation"] = T(
    whatIsIt="Ad-click aggregation counts and bills ad impressions/clicks in near real time — ingest high-volume click events, dedupe fraud, roll up by campaign/advertiser/time window, expose dashboards and billing APIs.",
    whyExists="Advertisers pay per click/impression. Raw events are billions/day; billing needs accurate, timely aggregates with audit trails and fraud filtering.",
    mentalModel="Firehose of click JSON → stream processor windows counts per ad_id/minute → materialized counters in KV/OLAP → billing job reads daily totals.",
    howItWorks=[
        {"type": "list", "items": [
            "Ingest: beacon pixel or redirect logs click with ad_id, user_id hash, timestamp, request_id.",
            "Stream: Kafka partition by ad_id; Flink/Spark streaming tumbling windows.",
            "Dedupe: idempotent on request_id; bot filter via rate/heuristics.",
            "Store: Redis HyperLogLog or counters for real-time; ClickHouse/BigQuery for analytics.",
            "Billing: daily batch reconciles stream totals with audit log.",
        ]},
        {"type": "mermaid", "caption": "Click aggregation pipeline", "diagram": "flowchart LR\n  Ad[Ad beacon] --> K[Kafka]\n  K --> SP[Stream processor]\n  SP --> R[(Redis counters)]\n  SP --> OLAP[(ClickHouse)]\n  OLAP --> Bill[Billing]"},
    ],
    example=[{"type": "code", "lang": "json", "code": '{"ad_id":"a1","campaign":"c9","ts":1710000000,"req_id":"uuid"}', "caption": "Click event"}],
    tradeoffs={"advantages": ["Real-time dashboards", "Scalable via partitioning"], "disadvantages": ["Eventual counts; dedupe complexity"], "alternatives": ["Batch-only Hadoop nightly"], "whenToUse": ["Ad networks, attribution"], "whenNotToUse": ["Low-volume internal analytics"]},
    failureModes=["Duplicate billing without idempotent req_id", "Hot ad_id skews partition", "Late events miss window without allowed lateness", "Bot traffic inflates counts"],
    production={"performance": ["Partition by ad_id", "Pre-aggregate in stream"], "scalability": ["Kafka + horizontal Flink"], "reliability": ["At-least-once + dedupe store"], "observability": ["Lag, duplicate rate, fraud block %"], "cost": ["Tier cold analytics to columnar store"]},
    interview={"expectations": ["Stream windows, dedupe, hot keys"], "commonQuestions": ["Design ad click aggregator"], "followUps": ["Fraud detection?", "Exactly-once billing?"], "misconceptions": ["SQL GROUP BY on raw table at scale"], "traps": ["Synchronous counter UPDATE per click"], "strongSignals": ["Kafka, idempotent keys, OLAP, late data handling"]},
    keyTakeaways=["Ingest at scale via log/stream", "Idempotent dedupe essential", "Windowed aggregation not per-row SQL", "Separate real-time vs billing batch", "Watch hot key skew"],
    iq=[{"level": "basic", "q": "Why stream not DB update per click?", "h": "Write QPS exceeds DB; partition stream scales."}, {"level": "intermediate", "q": "Dedupe strategy?", "h": "Unique req_id in Redis/Bloom with TTL."}, {"level": "advanced", "q": "Late arriving clicks?", "h": "Allowed lateness + watermark; reconcile in batch."}],
    flashcards=[{"f": "Tumbling window", "b": "Fixed non-overlapping time buckets for counts"}, {"f": "Idempotent click", "b": "Same req_id processed once for billing"}, {"f": "Hot key", "b": "Viral ad skews one partition — salting mitigates"}],
    quickRevision=["Beacon → Kafka", "Stream windows", "Dedupe req_id", "Redis real-time", "OLAP analytics", "Batch billing reconcile"],
    systemDesign=sd(
        "Design ad-click aggregation: 10B clicks/day, p99 dashboard lag < 1 min, billing accuracy 99.99%.",
        ["Ingest clicks", "Real-time counts per ad/campaign", "Advertiser dashboard", "Daily billing export", "Fraud filter"],
        ["Ingest 100k+ events/sec", "Idempotent dedupe", "Audit trail 7 years", "Dashboard p99 < 60s lag"],
        scale=["10B clicks/day", "100k peak QPS", "1M active ads"],
        capacity=["Kafka ~500 partitions", "Flink 50 workers", "ClickHouse columnar for queries"],
        api=[{"type": "code", "lang": "http", "code": "POST /v1/click {ad_id, req_id}\nGET /v1/campaigns/{id}/stats?window=1h"}],
        dataModel=[{"type": "list", "items": ["ClickEvent: req_id PK, ad_id, ts, user_hash", "AggregateMinute: ad_id, window, count", "BillingDaily: advertiser_id, date, amount"]}],
        diagram={"mermaid": "flowchart TB\n  B[Beacon] --> Ingest[Ingest API]\n  Ingest --> K[Kafka]\n  K --> F[Flink]\n  F --> Redis[(Redis)]\n  F --> CH[(ClickHouse)]\n  Dash[Dashboard] --> Redis\n  Bill[Billing] --> CH", "caption": "Aggregation architecture"},
        dataFlow=["Click POST → validate → Kafka", "Flink window aggregate → Redis + CH", "Dashboard reads Redis", "Nightly billing reads CH"],
        bottlenecks=["Hot campaign partition", "CH query cost on raw events"],
        followUps=["Attribution multi-touch?", "Click fraud ML pipeline?"],
    ),
)

TOPICS["d10-web-crawler"] = T(
    whatIsIt="A web crawler systematically discovers and fetches web pages — frontier queue of URLs, politeness (robots.txt, rate limits), fetcher workers, parser extracts links, dedupe visited, store raw HTML for search index.",
    whyExists="Search engines and archivers need fresh copies of the public web. Manual indexing impossible at billions of pages; crawlers automate discovery respecting site policies.",
    mentalModel="BFS over the web graph: seed URLs → fetch → parse links → enqueue unseen → repeat. Separate URL frontier, fetch pool, content store, and index pipeline.",
    howItWorks=[
        {"type": "list", "ordered": True, "items": [
            "Seed URLs enqueued to frontier (priority queue per domain).",
            "Scheduler picks URL respecting per-host rate limit and robots.txt.",
            "Fetcher HTTP GET with timeouts; store response + headers.",
            "Parser extracts links; normalize URL (canonical, strip fragments).",
            "Dedupe bloom/set for seen URLs; enqueue new links.",
            "Hand off HTML to indexer pipeline asynchronously.",
        ]},
        {"type": "mermaid", "caption": "Crawler components", "diagram": "flowchart LR\n  F[Frontier] --> Sch[Scheduler]\n  Sch --> Fetch[Fetchers]\n  Fetch --> Store[(Blob)]\n  Fetch --> Parse[Parser]\n  Parse --> F\n  Store --> Idx[Index pipeline]"},
    ],
    example=[{"type": "code", "lang": "python", "code": "# politeness: max 1 req/sec per host\nif now - last_fetch[host] < 1.0: requeue(url)\nelse: fetch(url); last_fetch[host] = now", "caption": "Per-host rate limit"}],
    tradeoffs={"advantages": ["Discovers deep web", "Fresh index"], "disadvantages": ["Politeness limits throughput", "Duplicate/near-duplicate content"], "alternatives": ["Sitemap-only ingest", "RSS feeds"], "whenToUse": ["Search engine", "Archival"], "whenNotToUse": ["Single-site scrape with known URLs"]},
    failureModes=["Ignore robots.txt → IP ban", "Infinite URL traps (calendars)", "Redirect loops", "Memory blow-up on frontier without disk spill"],
    production={"performance": ["Async fetch pool", "DNS cache"], "scalability": ["Distributed frontier sharded by URL hash"], "reliability": ["Retry transient 5xx with backoff"], "observability": ["Fetch success rate, queue depth per host"], "cost": ["Store only changed content via hash"]},
    interview={"expectations": ["Frontier, politeness, dedupe, parser"], "commonQuestions": ["Design web crawler"], "followUps": ["Detect duplicate pages?", "Priority crawling?"], "misconceptions": ["Unlimited parallel fetch OK"], "traps": ["No per-domain rate limit"], "strongSignals": ["robots.txt, bloom dedupe, async index handoff"]},
    keyTakeaways=["Frontier + scheduler + fetchers", "Politeness per host mandatory", "URL normalization + dedupe", "Separate crawl from index pipeline", "Trap detection for infinite URLs"],
    iq=[{"level": "basic", "q": "Why rate limit per domain?", "h": "Avoid overloading sites; robots.txt compliance."}, {"level": "intermediate", "q": "URL dedupe at scale?", "h": "Bloom filter + disk-backed seen set; canonicalize URLs."}, {"level": "advanced", "q": "Priority crawl for news?", "h": "Boost PageRank/recency in frontier priority queue."}],
    flashcards=[{"f": "Frontier", "b": "Queue of URLs waiting to be fetched"}, {"f": "robots.txt", "b": "Site policy for allowed paths and crawl rate"}, {"f": "Canonical URL", "b": "Normalized form to dedupe http/https/www variants"}],
    quickRevision=["Seed → frontier", "Per-host politeness", "Fetch → parse links", "Dedupe bloom", "Blob store → indexer", "Trap detection"],
    systemDesign=sd(
        "Design web crawler: crawl 1B pages/month, respect robots, detect duplicates, feed search indexer.",
        ["Discover URLs from seeds and links", "Fetch and store page content", "Extract links for frontier", "Respect robots.txt", "Prioritize important pages"],
        ["Politeness 1 req/s/host default", "Dedupe across cluster", "Handle 404/redirects", "Fresh news within hours"],
        scale=["1B pages/month", "10k fetch workers", "100M URL frontier"],
        api=[{"type": "code", "lang": "http", "code": "POST /admin/seeds {urls[]}\nGET /stats frontier_depth fetch_rate"}],
        dataModel=[{"type": "list", "items": ["UrlEntry: url_hash, status pending|done, priority, host", "FetchResult: url, status_code, content_hash, fetched_at", "HostPolicy: host, robots_rules, last_fetch_ts"]}],
        diagram={"mermaid": "flowchart TB\n  Seed[Seeds] --> Q[Frontier PQ]\n  Q --> Sched[Scheduler]\n  Sched --> W[Worker pool]\n  W --> S3[(Page store)]\n  W --> P[Link parser]\n  P --> Q\n  S3 --> Idx[Indexer]", "caption": "Distributed crawler"},
        dataFlow=["Enqueue seed URLs", "Scheduler rate-limits per host", "Worker fetches → store blob", "Parser enqueues new URLs", "Indexer consumes new pages"],
        storage=["Blob store for HTML", "Cassandra for URL state"],
        caching=["DNS cache", "robots.txt cache per host"],
        followUps=["How detect near-duplicate content?", "Deep web vs surface?"],
    ),
)

# --- b1 ---
for tid, title, what, why, model, items, ex_lang, ex_code, adv, dis, alt, use, nouse, fails, prod, exp, kts, iqs, fcs, qr in [
    ("b1-generators", "Generators",
     "Generator functions (function*) yield values lazily one at a time, pausing execution between yields. They implement the iterable protocol via yield and return.",
     "Eager arrays materialize entire sequences in memory. Generators stream infinite or large sequences, pipeline transformations, and simplify async iteration patterns.",
     "Pause/resume coroutine: call next() runs until yield, returns {value, done}. Each yield saves stack frame — lazy pipeline not bulk allocation.",
     ["function* defines generator; yields produce values", "next() resumes; return ends with done:true", "for...of consumes iterables including generators", "yield* delegates to another iterable", "Generators are both iterable and iterator"],
     "javascript", "function* range(n) {\n  for (let i = 0; i < n; i++) yield i;\n}\nconst g = range(3);\ng.next(); // {value:0,done:false}",
     ["Lazy evaluation saves memory", "Composable pipelines with yield*", "Infinite sequences possible"],
     ["Cannot index arbitrary position without advancing", "Debugging harder with suspended state"],
     ["Array methods", "Async generators for streams"],
     ["Large/infinite sequences", "Custom iterables"],
     ["When simple array suffices"],
     ["Forgetting generator not array — no .map without wrapping", "Not calling .return() on early break leaks finally blocks"],
     {"performance": ["Prefer generators for streaming parsers"], "maintainability": ["Name generator functions clearly *suffix optional"]},
     ["Define generator vs iterator", "Explain lazy evaluation benefit"],
     ["Generators enable lazy IO", "yield* delegation", "Generator.return/throw"],
     [{"level": "basic", "q": "What does yield do?", "h": "Pauses fn, returns value to consumer via next()."}, {"level": "intermediate", "q": "Generator vs array?", "h": "Lazy O(1) memory vs eager materialization."}, {"level": "advanced", "q": "Use case for infinite generator?", "h": "ID stream, paginated API walk without loading all."}],
     [{"f": "function*", "b": "Declares generator function"}, {"f": "Lazy", "b": "Values produced on demand not upfront"}],
     ["function* + yield", "Lazy iterable", "next() pause/resume", "yield* delegate", "Not a real array"]),
    ("b1-iterators", "Iterators",
     "An iterator is an object with next() returning {value, done}. Iterables expose Symbol.iterator() producing an iterator — consumed by for...of, spread, destructuring.",
     "Uniform protocol lets any custom collection work with language constructs. Separates traversal logic from data structure.",
     "Hand crank: each next() gives one item until done:true. Iterable is factory; iterator is cursor.",
     ["Symbol.iterator method on iterable returns fresh iterator", "next() returns {value, done}", "for...of calls iterator internally", "Manual iterables: { [Symbol.iterator]() { return this; }, next() {...} }", "Generators are syntactic sugar for iterators"],
     "javascript", "const it = [1,2][Symbol.iterator]();\nit.next(); // {value:1,done:false}",
     ["Language-level consumption", "Custom traversal order", "Lazy sequences"],
     ["Verbose without generators", "Iterator exhaustion — need new iterable"],
     ["Index loops", "Generators"],
     ["Custom collections", "Tree/graph walks"],
     ["Hot paths where index loop faster"],
     ["Reusing exhausted iterator", "Mutating collection during iteration"],
     {"performance": ["Iterator vs index loop negligible unless micro-opt"], "maintainability": ["Implement Symbol.iterator on public collections"]},
     ["Iterator protocol fields", "Iterable vs iterator difference"],
     ["Protocol powers for...of", "Map/Set implement iterable", "Iterator helpers ES2024"],
     [{"level": "basic", "q": "Iterator vs iterable?", "h": "Iterable has Symbol.iterator; iterator has next()."}, {"level": "intermediate", "q": "Can you reuse iterator?", "h": "Exhausted — call Symbol.iterator again for fresh cursor."}, {"level": "advanced", "q": "Implement range iterable?", "h": "Return object with next incrementing until end."}],
     [{"f": "Symbol.iterator", "b": "Well-known key returning iterator factory"}, {"f": "done:true", "b": "Signals iteration complete"}],
     ["next() → {value,done}", "Symbol.iterator on iterable", "for...of uses protocol", "Generators implement iterator", "Fresh iterator per loop"]),
    ("b1-proxy", "Proxy",
     "Proxy wraps a target object and intercepts operations (get, set, delete, apply) via handler traps — meta-programming for validation, logging, reactivity.",
     "Need centralized interception without mutating every call site. Vue 3 reactivity and ORM lazy loading use Proxy patterns.",
     "Transparent wrapper: client talks to Proxy; traps run your code then forward (or block) to target.",
     ["new Proxy(target, handler)", "Traps: get, set, has, deleteProperty, apply, construct", "Reflect methods match trap semantics", "RevocableProxy via Proxy.revocable", "Invariants prevent inconsistent trap behavior"],
     "javascript", "const p = new Proxy(user, {\n  set(t, k, v) { if (k==='age' && v<0) throw Error(); return Reflect.set(t,k,v); }\n});",
     ["Centralized validation/logging", "Virtual properties via get trap", "Reactive systems"],
     ["Performance overhead vs direct access", "Hard to debug indirection", "Cannot proxy some builtins easily"],
     ["Manual getters/setters", "Decorators (stage 3)"],
     ["Validation layers", "Observability", "Reactive state"],
     ["Simple objects without cross-cutting needs"],
     ["Infinite recursion if trap reads same property unguarded", "Forgetting Reflect.set return value"],
     {"performance": ["Avoid Proxy on hot inner loops"], "security": ["Do not expose Proxy to untrusted code for sandbox alone"]},
     ["Common traps", "Proxy vs Object.defineProperty"],
     ["Vue 3 reactivity uses Proxy", "Reflect aligns with traps"],
     [{"level": "basic", "q": "What is a Proxy trap?", "h": "Handler method intercepting object operation."}, {"level": "intermediate", "q": "Why Reflect with Proxy?", "h": "Default forwarding + matches trap invariants."}, {"level": "advanced", "q": "Proxy for validation example?", "h": "set trap rejects invalid values before target update."}],
     [{"f": "Proxy", "b": "Wrapper intercepting object ops"}, {"f": "Reflect.set", "b": "Forwards set in trap correctly"}],
     ["Proxy(target, handler)", "Traps intercept ops", "Use Reflect in traps", "Revocable for cleanup", "Vue3 reactivity"]),
    ("b1-reflect", "Reflect",
     "Reflect is a built-in object with methods mirroring Proxy trap names — default object operation behavior callable programmatically (get, set, defineProperty, etc.).",
     "Proxy traps need reliable forwarding to default behavior. Reflect provides single API matching meta-object protocol invariants.",
     "Object ops as functions: Reflect.get(obj,key) instead of obj[key] — same semantics, usable inside traps.",
     ["Methods correspond 1:1 to Proxy traps", "Reflect.construct replaces new with arg array", "Reflect.ownKeys = keys+symbols", "Returns boolean success for defineProperty/delete", "Prefer Reflect in Proxy traps for forwarding"],
     "javascript", "const handler = {\n  get(t, k, r) { console.log(k); return Reflect.get(t, k, r); }\n};",
     ["Clean trap forwarding", "Functional object ops", "Matches Proxy invariants"],
     ["Less familiar API", "Verbose vs dot syntax"],
     ["Direct property access", "Object.* legacy methods"],
     ["Inside Proxy handlers", "Meta-programming libraries"],
     ["Normal application code paths"],
     ["Using target[k] in trap breaking receiver `this`", "Ignoring boolean return of defineProperty"],
     {"maintainability": ["Use Reflect in all Proxy traps consistently"]},
     ["Reflect vs Object methods", "Why receiver matters in Reflect.get"],
     ["Reflect completes ES6 meta protocol with Proxy"],
     [{"level": "basic", "q": "Reflect.get purpose?", "h": "Invokes [[Get]] internal method; honors receiver."}, {"level": "intermediate", "q": "Reflect in Proxy trap?", "h": "Forward default behavior preserving invariants."}, {"level": "advanced", "q": "Reflect.construct use?", "h": "Call constructor with newTarget and args array."}],
     [{"f": "Reflect", "b": "Built-in meta-object operation methods"}, {"f": "Receiver", "b": "Third arg to Reflect.get for correct this binding"}],
     ["Mirrors Proxy traps", "Use in handlers", "Reflect.get/set/construct", "Boolean results", "Meta-object protocol"]),
    ("b1-symbols", "Symbols",
     "Symbol is a primitive type for unique property keys — Symbol() or well-known Symbol.* (iterator, toStringTag) avoid name collisions on objects.",
     "String keys collide across libraries. Symbols create guaranteed-unique keys for metadata, protocols, and pseudo-private fields.",
     "Unique stamp: each Symbol() !== any other; well-known symbols are shared protocol hooks.",
     ["Symbol('desc') always unique", "Not enumerable in Object.keys — use getOwnPropertySymbols", "Well-known: Symbol.iterator, Symbol.toStringTag, Symbol.hasInstance", "Global registry: Symbol.for(key) shared", "Cannot coerce with + or implicit string without String()"],
     "javascript", "const ID = Symbol('id');\nobj[ID] = 42;\nObject.keys(obj); // [] — symbol not listed",
     ["Collision-free metadata keys", "Define language protocols", "Semi-private properties"],
     ["Not true privacy — still accessible via getOwnPropertySymbols", "Serialization skips symbols by default"],
     ["WeakMap for private data", "Private class fields #"],
     ["Library extensibility", "Custom iteration/toStringTag"],
     ["When string key fine"],
     ["Assuming Symbol.for creates unique each call — it reuses global", "JSON.stringify drops symbol props silently"],
     {"maintainability": ["Document well-known symbol usage on public APIs"]},
     ["Symbol uniqueness", "Well-known symbols list"],
     ["Powers iterable protocol", "Symbol.for global registry"],
     [{"level": "basic", "q": "Are two Symbol('x') equal?", "h": "No — each call creates unique value."}, {"level": "intermediate", "q": "Why not enumerable?", "h": "Hidden from normal iteration; protocol/metadata use."}, {"level": "advanced", "q": "Symbol.for vs Symbol()?", "h": "for returns global registered symbol; () always new."}],
     [{"f": "Symbol.iterator", "b": "Method key making object iterable"}, {"f": "Symbol.for", "b": "Global symbol registry lookup/create"}],
     ["Unique property keys", "Not in Object.keys", "Well-known protocol symbols", "Symbol.for global", "JSON skips symbols"]),
]:
    TOPICS[tid] = T(
        whatIsIt=what, whyExists=why, mentalModel=model,
        howItWorks=[{"type": "list", "items": items}],
        example=[{"type": "code", "lang": ex_lang, "code": ex_code}],
        tradeoffs={"advantages": adv, "disadvantages": dis, "alternatives": alt, "whenToUse": use, "whenNotToUse": nouse},
        failureModes=fails,
        production=prod,
        interview={"expectations": exp, "commonQuestions": [f"Explain {title}"], "followUps": ["Real-world use?"], "misconceptions": ["Superficial definition only"], "traps": ["Common pitfall in " + title.lower()], "strongSignals": kts[:3]},
        keyTakeaways=kts, iq=iqs, flashcards=fcs, quickRevision=qr,
    )

# --- b2 ---
TOPICS["b2-conditional-types"] = T(
    whatIsIt="Conditional types select one of two types based on a type relationship: T extends U ? X : Y. They enable type-level if/else for generics, overload simulation, and utility type libraries.",
    whyExists="Generics alone cannot branch on input shape. Conditional types express API return types that depend on argument types (e.g. unwrap Promise, filter nullable).",
    mentalModel="Type-level ternary: compiler evaluates extends check at compile time; distributes over unions in T.",
    howItWorks=[{"type": "list", "items": [
        "Syntax: A extends B ? C : D",
        "Distributive when T is naked type parameter: Union<T> distributes",
        "Wrap in tuple [T] extends [U] to disable distribution",
        "Combine with infer for extracting inner types",
        "Often nested for multi-branch logic",
    ]}],
    example=[{"type": "code", "lang": "typescript", "code": "type IsString<T> = T extends string ? true : false;\ntype A = IsString<'hi'>; // true\ntype B = IsString<number>; // false", "caption": "Simple conditional"}],
    tradeoffs={"advantages": ["Precise dependent types", "Powers Exclude/Extract utilities"], "disadvantages": ["Hard to read/debug", "Instantiations can slow tsc"], "alternatives": ["Function overloads", "Runtime checks only"], "whenToUse": ["Library typings", "Type-safe wrappers"], "whenNotToUse": ["Simple fixed return types"]},
    failureModes=["Unexpected union distribution", "Infinite recursion in nested conditionals", "any disables extends checks"],
    production={"maintainability": ["Alias complex conditionals with descriptive names", "Add comment examples for distributive cases"]},
    interview={"expectations": ["extends ternary syntax", "Distribution behavior"], "commonQuestions": ["What is T extends U ? X : Y?"], "followUps": ["Distributive conditional types?"], "misconceptions": ["Runtime if statement"], "traps": ["Union distribution surprise"], "strongSignals": ["Mentions infer, distributive, utility types"]},
    keyTakeaways=["Type-level if via extends", "Distributive over naked union T", "Disable with [T] extends [U]", "Pairs with infer", "Powers Exclude/Omit patterns"],
    iq=[{"level": "basic", "q": "Conditional type syntax?", "h": "T extends U ? X : Y evaluated at compile time."}, {"level": "intermediate", "q": "Distributive behavior?", "h": "T extends U ? X : Y maps over each union member of T."}, {"level": "advanced", "q": "Non-distributive trick?", "h": "Wrap: [T] extends [U] ? X : Y."}],
    flashcards=[{"f": "Conditional type", "b": "T extends U ? X : Y type selection"}, {"f": "Distributive", "b": "Union T splits into per-member conditionals"}],
    quickRevision=["extends ? :", "Compile-time branch", "Union distributes", "[T] disable distribute", "Use with infer"],
)

TOPICS["b2-infer"] = T(
    whatIsIt="infer keyword inside conditional types declares a type variable to capture from matched position — extract function return type, promise unwrap, tuple element types.",
    whyExists="Need to parse/compute types from existing types without manual duplication. infer lets compiler pattern-match type structure.",
    mentalModel="Regex capture group for types: if shape matches, bind captured part to infer U.",
    howItWorks=[{"type": "list", "items": [
        "Only valid in extends clause of conditional type",
        "infer U captures matched subtype",
        "Multiple infer in same clause allowed",
        "ReturnType<T> = T extends (...args: any) => infer R ? R : never",
        "Can infer in contravariant positions with care",
    ]}],
    example=[{"type": "code", "lang": "typescript", "code": "type ElementType<T> = T extends (infer E)[] ? E : T;\ntype X = ElementType<string[]>; // string", "caption": "Extract array element"}],
    tradeoffs={"advantages": ["DRY type extraction", "Enables advanced utilities"], "disadvantages": ["Opaque errors when match fails"], "alternatives": ["Manual generic params"], "whenToUse": ["ReturnType, Parameters, Awaited"], "whenNotToUse": ["When explicit generic simpler"]},
    failureModes=["infer never matches → never branch", "Covariant infer in function params pitfalls"],
    production={"maintainability": ["Reuse built-in Awaited/ReturnType before custom infer"]},
    interview={"expectations": ["infer in conditional types", "ReturnType implementation"], "commonQuestions": ["How does infer work?"], "followUps": ["Implement UnwrapPromise?"], "misconceptions": ["Runtime variable"], "traps": ["infer outside extends clause"], "strongSignals": ["Can write ReturnType from scratch"]},
    keyTakeaways=["infer captures in extends match", "Powers ReturnType/Awaited", "Only inside conditional extends", "Fails to never if no match", "Multiple infer supported"],
    iq=[{"level": "basic", "q": "Where is infer allowed?", "h": "In extends clause of conditional type."}, {"level": "intermediate", "q": "Implement ReturnType?", "h": "T extends (...args:any)=>infer R ? R : never."}, {"level": "advanced", "q": "Unwrap nested Promise?", "h": "Recursive conditional with infer R on Promise."}],
    flashcards=[{"f": "infer", "b": "Capture type variable from pattern match"}, {"f": "ReturnType", "b": "Built-in using infer on function return"}],
    quickRevision=["infer in extends", "Pattern capture", "ReturnType idiom", "never if no match", "Recursive infer unwrap"],
)

TOPICS["b2-mapped-types"] = T(
    whatIsIt="Mapped types transform properties of an existing type by iterating keys: { [K in keyof T]: ... }. They bulk rename, optionalize, or remap fields type-safely.",
    whyExists="Manually duplicating object shapes for Partial/Readonly variants violates DRY. Mapped types generate variants from a source type.",
    mentalModel="for-loop over keys at type level: each property K gets transformed expression.",
    howItWorks=[{"type": "list", "items": [
        "{ [K in keyof T]: T[K] } identity map",
        "Modifiers: +readonly, -readonly, +?, -?",
        "Key remapping: [K in keyof T as NewKey]",
        "Combine with conditional on K or T[K]",
        "Powers Partial, Required, Pick, Record",
    ]}],
    example=[{"type": "code", "lang": "typescript", "code": "type Optional<T> = { [K in keyof T]?: T[K] };\ntype ReadonlyFields<T> = { readonly [K in keyof T]: T[K] };", "caption": "Mapped modifiers"}],
    tradeoffs={"advantages": ["DRY type transforms", "Key remapping in TS 4.1+"], "disadvantages": ["Complex maps hurt readability", "Large unions of keys slow tsc"], "alternatives": ["Manual interfaces", "Codegen"], "whenToUse": ["API DTO variants", "Form state types"], "whenNotToUse": ["Unrelated object shapes"]},
    failureModes=["as clause producing duplicate keys error", "Mapped over non-object never"],
    production={"maintainability": ["Export named mapped aliases not inline 5-level maps"]},
    interview={"expectations": ["keyof T iteration syntax", "Partial/Readonly implementation"], "commonQuestions": ["Implement Partial<T>?"], "followUps": ["Key remapping with as?"], "misconceptions": ["Runtime object map"], "traps": ["Forgetting ? modifier"], "strongSignals": ["Writes Pick/Omit from scratch"]},
    keyTakeaways=["[K in keyof T] iterates properties", "Modifiers +? -readonly", "Key remapping via as", "Builds utility types", "Type-level only"],
    iq=[{"level": "basic", "q": "Mapped type syntax?", "h": "{ [K in keyof T]: ... } transforms each property."}, {"level": "intermediate", "q": "Make all props optional?", "h": "Partial: { [K in keyof T]?: T[K] }."}, {"level": "advanced", "q": "Rename keys with prefix?", "h": "[K in keyof T as `get${Capitalize<string&K>}`]: T[K]."}],
    flashcards=[{"f": "Mapped type", "b": "Transform all keys of T uniformly"}, {"f": "key remapping", "b": "K in keyof T as NewName"}],
    quickRevision=["K in keyof T", "Partial/Readonly/Pick", "Modifiers +? -readonly", "Key remapping as", "Conditional in map"],
)

# --- b3 ---
TOPICS["b3-service-workers"] = T(
    whatIsIt="Service workers are browser background scripts on separate thread — intercept network via fetch event, enable offline caching, push notifications, and PWA install without blocking main thread.",
    whyExists="Web apps need offline resilience and faster repeat loads. SW decouples asset caching and background sync from page lifecycle.",
    mentalModel="Proxy sitting between app and network: install → cache assets → fetch handler serves cache-first or network-first → update on new SW version.",
    howItWorks=[{"type": "list", "ordered": True, "items": [
        "Register navigator.serviceWorker.register('/sw.js')",
        "install event — precache shell assets",
        "activate event — delete old caches",
        "fetch event — respond from cache or network strategy",
        "skipWaiting + clients.claim for immediate takeover",
        "HTTPS required (localhost excepted)",
    ]}],
    example=[{"type": "code", "lang": "javascript", "code": "self.addEventListener('fetch', (e) => {\n  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));\n});", "caption": "Cache-first strategy"}],
    tradeoffs={"advantages": ["Offline support", "Background sync/push"], "disadvantages": ["Cache invalidation complexity", "Debugging harder"], "alternatives": ["HTTP cache headers only", "App shell SSR"], "whenToUse": ["PWA", "Offline-first apps"], "whenNotToUse": ["Simple sites with always-online"]},
    failureModes=["Stale cache serves old JS forever", "SW not updating — users stuck on old version", "Caching API responses incorrectly", "Scope too narrow — fails to control routes"],
    production={"reliability": ["Version cache names; purge on activate"], "security": ["Never cache authenticated API blindly"], "observability": ["Log SW lifecycle in analytics"]},
    interview={"expectations": ["Lifecycle install/activate/fetch", "Caching strategies"], "commonQuestions": ["Service worker lifecycle?"], "followUps": ["Cache-first vs network-first?"], "misconceptions": ["Same as web worker"], "traps": ["No cache bust on deploy"], "strongSignals": ["skipWaiting, cache versioning, scope"]},
    keyTakeaways=["Background network proxy", "install/activate/fetch lifecycle", "Cache strategies matter", "HTTPS required", "Version caches on deploy"],
    iq=[{"level": "basic", "q": "Main SW events?", "h": "install, activate, fetch."}, {"level": "intermediate", "q": "Cache-first vs network-first?", "h": "Offline shell vs fresh API data tradeoff."}, {"level": "advanced", "q": "Force SW update?", "h": "New sw.js → skipWaiting → clients.claim."}],
    flashcards=[{"f": "Service worker", "b": "Background script intercepting fetch"}, {"f": "activate", "b": "Cleanup old caches after new SW installs"}],
    quickRevision=["Register SW", "install precache", "fetch intercept", "Cache versioning", "HTTPS only", "skipWaiting update"],
)

TOPICS["b3-sse"] = T(
    whatIsIt="Server-Sent Events (SSE) is HTTP one-way push — client opens long-lived GET; server streams text/event-stream messages. Native EventSource API; auto-reconnect with Last-Event-ID.",
    whyExists="Polling wastes bandwidth. WebSockets heavy for simple server→client feeds. SSE reuses HTTP, works through proxies, simpler for dashboards and notifications.",
    mentalModel="Radio broadcast one direction: browser tunes EventSource URL; server sends event frames when data arrives.",
    howItWorks=[{"type": "list", "items": [
        "Content-Type: text/event-stream",
        "Fields: data, event, id, retry",
        "EventSource auto-reconnects with Last-Event-ID",
        "HTTP/1.1 connection limits — HTTP/2 multiplex helps",
        "Text only — binary needs base64 or WebSocket",
    ]}],
    example=[{"type": "code", "lang": "javascript", "code": "const es = new EventSource('/events');\nes.onmessage = (e) => console.log(JSON.parse(e.data));", "caption": "Client EventSource"}],
    tradeoffs={"advantages": ["Simple HTTP push", "Auto reconnect", "Native browser API"], "disadvantages": ["Server→client only", "Proxy buffering issues"], "alternatives": ["WebSocket", "Long polling"], "whenToUse": ["Live feeds", "Build logs", "Stock ticks"], "whenNotToUse": ["Bidirectional chat", "Binary protocols"]},
    failureModes=["Proxy/nginx buffering without X-Accel-Buffering no", "No heartbeat — LB drops idle connection", "Exceed browser connection limit HTTP/1.1"],
    production={"reliability": ["Heartbeat comment every 15-30s", "Replay buffer for Last-Event-ID"], "scalability": ["Redis pub/sub fan-out across SSE instances"], "security": ["Authorize stream per user"]},
    interview={"expectations": ["One-way HTTP push", "EventSource vs WebSocket"], "commonQuestions": ["When SSE over WebSocket?"], "followUps": ["Reconnect behavior?"], "misconceptions": ["Bidirectional"], "traps": ["Missing heartbeat"], "strongSignals": ["Last-Event-ID, text/event-stream"]},
    keyTakeaways=["HTTP one-way push stream", "EventSource native client", "Auto reconnect Last-Event-ID", "Heartbeats for LB", "Not for binary/bidi"],
    iq=[{"level": "basic", "q": "SSE direction?", "h": "Server to client only."}, {"level": "intermediate", "q": "Reconnect mechanism?", "h": "EventSource resends with Last-Event-ID header."}, {"level": "advanced", "q": "Scale SSE horizontally?", "h": "Pub/sub bus; sticky or shared replay buffer."}],
    flashcards=[{"f": "text/event-stream", "b": "SSE MIME type"}, {"f": "Last-Event-ID", "b": "Client header to resume after disconnect"}],
    quickRevision=["GET long-lived", "EventSource client", "data: lines", "Heartbeats", "One-way only", "Reconnect id"],
)

TOPICS["b3-websockets"] = T(
    whatIsIt="WebSockets provide full-duplex persistent TCP connection over HTTP upgrade — low-latency bidirectional frames for chat, games, collaborative editing after initial handshake.",
    whyExists="HTTP request/response adds overhead for frequent bidirectional messages. WebSocket single connection both directions after upgrade.",
    mentalModel="Phone call vs letters: upgrade HTTP to persistent socket; both sides send frames anytime.",
    howItWorks=[{"type": "list", "items": [
        "Client HTTP Upgrade: websocket; server 101 Switching Protocols",
        "Frames: text/binary with opcode ping/pong/close",
        "No automatic reconnect — app must implement",
        "Sticky sessions or pub/sub for multi-server fan-out",
        "wss:// required in production",
    ]}],
    example=[{"type": "code", "lang": "javascript", "code": "const ws = new WebSocket('wss://api.example.com/ws');\nws.onmessage = (e) => console.log(e.data);\nws.send(JSON.stringify({ type: 'ping' }));", "caption": "Browser WebSocket client"}],
    tradeoffs={"advantages": ["Low latency bidi", "Binary frames"], "disadvantages": ["Connection state on server", "LB sticky complexity"], "alternatives": ["SSE one-way", "HTTP/2 server push deprecated"], "whenToUse": ["Chat", "Live games", "Collaborative docs"], "whenNotToUse": ["Simple notifications — use SSE"]},
    failureModes=["No heartbeat — ghost connections", "Broadcast storm to all clients", "Missing auth on upgrade", "Message ordering across reconnect"],
    production={"scalability": ["Redis pub/sub or dedicated WS gateway", "Connection limits per instance"], "reliability": ["App-level ping/pong heartbeat", "Exponential backoff reconnect"], "security": ["Auth token at upgrade; validate origin"]},
    interview={"expectations": ["HTTP upgrade handshake", "Scaling with pub/sub"], "commonQuestions": ["WebSocket vs SSE?"], "followUps": ["Scale across servers?"], "misconceptions": ["Automatic reconnect built-in"], "traps": ["No auth on WS URL"], "strongSignals": ["Sticky vs shared pub/sub, heartbeats"]},
    keyTakeaways=["HTTP upgrade to persistent bidi socket", "App handles reconnect", "Scale via pub/sub gateway", "Heartbeats detect dead peers", "wss in production"],
    iq=[{"level": "basic", "q": "WebSocket vs HTTP polling?", "h": "Persistent connection; lower overhead per message."}, {"level": "intermediate", "q": "Scale WS cluster?", "h": "Pub/sub backplane; route user to any node."}, {"level": "advanced", "q": "Backpressure on WS?", "h": "bufferedAmount; pause send; drop/slow consumer policy."}],
    flashcards=[{"f": "101 Switching Protocols", "b": "HTTP upgrade response for WS"}, {"f": "wss://", "b": "TLS WebSocket required in prod"}],
    quickRevision=["HTTP upgrade", "Full duplex frames", "No auto reconnect", "Pub/sub scale", "Heartbeats", "Auth at handshake"],
)

# Continue with remaining topics in part 2 of script...
exec(open(os.path.join(os.path.dirname(__file__), "gen_phase4_wave09_b.py")).read())
