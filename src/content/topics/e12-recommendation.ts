import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    "A recommendation/personalization system ranks items (products, videos, articles) for each user using behavioral signals, content features, and often LLM-generated summaries or embeddings. Modern stacks blend classical ML (matrix factorization, two-tower) with real-time features and GenAI for cold-start and explainability.",
  whyExists:
    "Users cannot browse millions of items. Personalization increases engagement, conversion, and retention. AI layers add semantic understanding (similar items by meaning), natural-language taste profiles, and dynamic explanations — beyond click-only collaborative filtering.",
  mentalModel:
    "Offline: train or embed items/users from history → candidate index. Online: user request → recall hundreds of candidates fast → rank with fresh features → re-rank for diversity/business rules → serve. LLM assists cold-start (content embeddings), session understanding, and \"because you liked X\" explanations — not usually the sole ranker at scale.",
  howItWorks: [
    {
      type: "paragraph",
      text: "Event pipeline captures impressions, clicks, purchases with user_id, item_id, timestamp. Feature store materializes user/item features (last 10 clicks, category affinities, item embeddings). Retrieval uses ANN on item vectors or inverted indexes (collaborative neighbors). Ranking model scores (user, item) pairs. LLM may enrich item metadata or build session summaries for contextual bandits.",
    },
    {
      type: "list",
      items: [
        "Recall: ANN on two-tower embeddings, co-occurrence, trending, category rules.",
        "Rank: gradient-boosted trees or deep ranker on dense + sparse features.",
        "Re-rank: diversity (MMR), freshness, inventory, fairness constraints.",
        "Real-time: update short-term user vector from last N events in session.",
        "GenAI: embed catalog text/images; generate explanations; LLM rerank small candidate set only.",
      ],
    },
  ],
  example: [
    {
      type: "code",
      language: "http",
      caption: "Home feed recommendation API",
      code: `GET /v1/recommendations?user_id=u42&surface=home&limit=20

→ 200 {
  "items": [
    { "item_id": "p991", "score": 0.87, "reason": "Similar to your recent view: Wireless Headphones" },
    ...
  ],
  "request_id": "rec_8f3a"
}`,
    },
  ],
  keyTakeaways: [
    "Separate recall (fast, broad) from rank (slow, precise) — two-stage is standard.",
    "Feature store bridges batch training and online serving with point-in-time correctness.",
    "LLM at full-catalog rank is too slow; use for embeddings, cold-start, or top-50 rerank.",
    "Log impressions with request_id for offline evaluation and counterfactual analysis.",
    "Evolve: trending → CF → two-tower ANN → real-time features + business re-ranker.",
  ],
  interviewQuestions: [
    {
      level: "basic",
      question: "Collaborative filtering vs content-based?",
      answerHint: "CF uses user-item interactions; content-based uses item attributes/embeddings; hybrid combines both.",
    },
    {
      level: "intermediate",
      question: "Why two-stage recall + rank?",
      answerHint: "Recall cheaply narrows millions to hundreds; ranker uses rich features on small set.",
    },
    {
      level: "advanced",
      question: "Where does an LLM fit without killing latency?",
      answerHint: "Offline item embeddings, session summarization, explainability, rerank top-k; not full-catalog scoring.",
    },
  ],
  flashcards: [
    { front: "Two-tower model", back: "Separate user and item encoders; score = dot product; ANN on item tower" },
    { front: "Exploration vs exploitation", back: "Bandits/epsilon-greedy inject novelty; avoid filter bubble" },
    { front: "Point-in-time features", back: "Feature store serves values valid at event time — prevents label leakage" },
    { front: "Impression logging", back: "Log shown items + request_id even if no click — needed for unbiased metrics" },
  ],
  quickRevision: [
    "Events → feature store → recall → rank → re-rank",
    "Two-tower + ANN for semantic recall",
    "LLM for embed/explain/cold-start, not full rank",
    "Impression logs + request_id for eval",
    "Diversity and business rules in re-rank",
    "Real-time session features in Redis",
  ],
  systemDesign: {
    problem:
      "Design a personalization system for an e-commerce home feed (Amazon-scale catalog: 100M SKUs, 200M DAU) blending classical recsys with embedding/LLM enrichment — p99 feed latency < 150ms.",
    requirements: {
      functional: [
        "Personalized home feed and similar-items widgets",
        "Cold-start for new users and new products",
        "Category and brand diversity constraints",
        "Optional natural-language explanation per item",
        "A/B experiment assignment per request",
      ],
      nonFunctional: [
        "p99 latency < 150ms for 20-item feed",
        "Fresh signals within minutes (recent clicks affect feed)",
        "Handle catalog updates (new SKUs indexed within hours)",
        "Measurable uplift via logged experiments",
      ],
    },
    scaleAssumptions: [
      "200M DAU, 500M sessions/day",
      "100M active SKUs",
      "Peak 300k recommendation QPS",
      "Avg user history: 500 events lifetime; 5 events/session",
    ],
    capacityEstimates: [
      "300k QPS × 500 candidates scored ≈ 150M rank inferences/s → need lightweight ranker + GPU batch for heavy models off critical path",
      "Item embeddings: 100M × 256 dims × 4 B ≈ 100 GB ANN index (sharded)",
      "Event ingest: 2B events/day → Kafka → feature store updates",
    ],
    api: [
      {
        type: "code",
        language: "http",
        caption: "Serving and feedback APIs",
        code: `GET  /v1/feeds/home?user_id=&limit=20&experiment=
POST /v1/events  # impression, click, purchase
GET  /v1/items/{id}/similar?limit=10
POST /internal/reindex  # catalog update trigger`,
      },
    ],
    dataModel: [
      {
        type: "list",
        items: [
          "UserEvent: user_id, item_id, event_type, ts, session_id, surface",
          "Item: item_id, title, category, price, text_embedding, image_embedding, inventory",
          "UserFeatures: user_id, affinities{}, last_clicks[], segment, embedding",
          "RecommendationLog: request_id, user_id, candidate_ids[], scores[], served_ids[], experiment_arm",
          "Experiment: id, arms[], traffic_split",
        ],
      },
    ],
    highLevelArchitecture: [
      {
        type: "paragraph",
        text: "Event collectors write to Kafka. Flink/Spark builds training data and refreshes item/user embeddings nightly; near-line jobs update session features in Redis. Recommendation service: fetch user features → multi-source recall (ANN, trending, rules) → merge/dedupe → rank (GBDT or small DNN) → re-rank → optional LLM explanation for top 3 async or precomputed. Vector DB holds item embeddings from catalog text+images via multimodal encoder.",
      },
    ],
    diagram: {
      mermaid: `flowchart LR
  App --> RS[Recommendation Service]
  App --> EV[Event API]
  EV --> Kafka[Kafka]
  Kafka --> FS[Feature Store]
  Kafka --> Train[Training Pipeline]
  Train --> ANN[(Vector ANN Index)]
  Train --> RankModel[Rank Model]
  RS --> FS
  RS --> ANN
  RS --> RankModel
  RS --> Redis[(Session Features)]
  RS --> LLM[LLM Explain Cache]
  Catalog[(Item Catalog)] --> Train`,
      caption: "Online serving path with offline training and near-line features",
    },
    dataFlow: [
      "User opens home → RS loads user features from feature store + Redis session",
      "Parallel recall: ANN (user embedding · item embeddings), co-click, trending",
      "Merge ~500 candidates; rank with fresh features (inventory, price, affinity)",
      "Re-rank for diversity, dedupe categories, apply business boosts",
      "Return 20 items; log impression with request_id",
      "Click event → Kafka → updates session features within seconds",
    ],
    storage: [
      "Feature store (Feast/Tecton): user/item historical features",
      "Redis: session-level last-N clicks, real-time counters",
      "Vector ANN (ScaNN/FAISS managed): item embeddings sharded",
      "S3: training parquet, model artifacts",
      "Postgres: experiment config, catalog metadata",
    ],
    caching: [
      "Precomputed feeds for anonymous/cold users (trending)",
      "Similar-items cache per item_id",
      "LLM explanations precomputed for head catalog SKUs",
      "User feature snapshot cached 30s for repeat requests",
    ],
    asyncProcessing: [
      "Nightly embedding refresh for new/changed catalog items",
      "Model retraining weekly; shadow deploy new ranker",
      "Batch explanation generation for top 1M SKUs",
      "Data quality monitors on event pipeline lag",
    ],
    scaling: [
      "Horizontally scale stateless RS pods",
      "Shard ANN by item_id; replicate hot shards",
      "Separate recall and rank thread pools; timeout slow sources",
      "Geo-regional serving with replicated indexes",
    ],
    consistency: [
      "Features point-in-time for training; online may lag minutes (acceptable)",
      "Inventory/pricing from catalog service — eventual consistency; filter out-of-stock in rank",
      "Experiment assignment sticky per user session",
    ],
    reliability: [
      "Fallback to trending if ANN or ranker fails",
      "Degrade explanations first to meet latency SLO",
      "Circuit-break slow recall sources; partial candidate set OK",
    ],
    failureScenarios: [
      "Feature store stale → repetitive recommendations; monitor freshness SLI",
      "ANN index corruption → fallback to category trending",
      "Feedback loop / popularity bias → inject exploration slots",
      "New user cold-start → content embeddings + onboarding quiz",
    ],
    security: [
      "Do not leak other users purchase history in explanations",
      "Rate limit event API against spam bots skewing models",
      "PII minimization in logs; hash user_id in analytics exports",
    ],
    observability: [
      "Latency breakdown: recall vs rank vs re-rank",
      "CTR/CVR by experiment arm",
      "Catalog coverage (% SKUs ever recommended)",
      "Diversity metrics (intra-list category spread)",
    ],
    bottlenecks: [
      "Rank 500 candidates under 50ms",
      "ANN recall at 100M scale",
      "Feature store read QPS during peak",
      "Training-serving skew",
    ],
    alternatives: [
      "Hosted recsys (AWS Personalize, Google Recommendations AI)",
      "Pure LLM \"pick 20 from catalog sample\" (prototype only)",
      "Graph-based PPR on item co-click graph",
    ],
    tradeoffs: [
      "Model accuracy vs serving latency",
      "Exploration (novelty) vs exploitation (CTR)",
      "LLM explanations quality vs cost/latency",
      "Real-time features complexity vs freshness gain",
    ],
    interviewFollowUps: [
      "How evaluate a new ranker without full online A/B?",
      "Filter bubble and diversity — how quantify?",
      "New item launched hour ago — when recommendable?",
      "Handle seasonal and out-of-stock items?",
    ],
    evolution: [
      {
        stage: "1. Simple design",
        description: "Manual trending + category rules; Postgres order by sales.",
        bottleneck: "No personalization; poor long-tail discovery.",
      },
      {
        stage: "2. Improve",
        description: "Item-item CF + content embeddings; batch daily; Redis session clicks.",
        bottleneck: "Latency of full CF at scale; cold-start weak.",
      },
      {
        stage: "3. Improve",
        description: "Two-tower ANN recall + GBDT rank; feature store; impression logging.",
        bottleneck: "Rank latency; training-serving skew.",
      },
      {
        stage: "4. Scale further",
        description: "Multi-source recall, real-time Flink features, LLM explanations cache, geo-sharded ANN.",
        bottleneck: "Experimentation velocity; fairness and bias audits.",
      },
    ],
  },
  tradeoffs: {
    advantages: [
      "Higher engagement and conversion",
      "Semantic recall via embeddings handles sparse interactions",
      "LLM adds explainability and cold-start from catalog text",
    ],
    disadvantages: [
      "Feedback loops amplify popularity bias",
      "Complex feature pipeline to maintain",
      "Hard to debug \"why this item?\" without logging",
    ],
    alternatives: [
      "Editorial curation only",
      "Third-party personalization SaaS",
      "Search-only UX without feeds",
    ],
    whenToUse: [
      "Large catalogs with repeat visits",
      "Surfaces with measurable CTR/CVR goals",
    ],
    whenNotToUse: [
      "Tiny catalogs browsable in one page",
      "Regulated domains requiring fully deterministic ordering",
    ],
  },
  failureModes: [
    "Training-serving skew degrades rank quality silently",
    "Popularity echo chamber; filter bubble",
    "Stale inventory recommends out-of-stock items",
    "Missing impression logs bias offline metrics",
    "LLM explanations hallucinate product attributes",
  ],
  production: {
    performance: [
      "Parallel recall with per-source timeouts",
      "Quantized ranker or distilled model for p99",
      "Precompute head-user segments",
    ],
    scalability: [
      "Shard ANN; cache similar-items",
      "Autoscale RS on QPS",
    ],
    reliability: [
      "Trending fallback always available",
      "Shadow traffic for new models",
    ],
    security: [
      "Sanitize explanations; no cross-user data leakage",
      "Bot detection on event stream",
    ],
    observability: [
      "CTR/CVR dashboards per experiment",
      "Latency SLO per pipeline stage",
    ],
    cost: [
      "LLM explanations only for head SKUs or on-demand",
      "Embedding refresh incremental not full rebuild daily",
    ],
    maintainability: [
      "Feature registry with ownership",
      "Standard request_id tracing through recall/rank",
    ],
  },
  interview: {
    expectations: [
      "Draw recall → rank → re-rank pipeline",
      "Explain two-tower and ANN role",
      "Place LLM appropriately (not full ranker)",
    ],
    commonQuestions: [
      "Design YouTube/Amazon home feed",
      "Cold-start user and item?",
      "How measure recommendation quality?",
    ],
    followUps: [
      "Counterfactual evaluation?",
      "Real-time vs batch features?",
      "Diversity constraints?",
    ],
    misconceptions: [
      "LLM replaces entire recsys stack",
      "Click-only training needs no impression logs",
    ],
    traps: [
      "Scoring full 100M catalog per request",
      "Ignoring inventory and business rules in rank",
    ],
    strongSignals: [
      "Two-stage architecture",
      "Feature store + point-in-time",
      "Impression logging and A/B framework",
      "Fallback and latency budgets per stage",
    ],
  },
}
