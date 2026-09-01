import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Search engines index inverted indexes over text and structured fields for full-text search, fuzzy match, faceting, and ranking at scale. Examples: Elasticsearch, OpenSearch, Solr, Algolia. Complement primary databases — not replacement for source of truth.',
  whyExists:
    'SQL LIKE and unindexed JSON scans fail at scale for "find articles mentioning distributed systems published last week sorted by relevance." Inverted indexes tokenize text, map terms → document IDs, and score results (BM25, etc.).',
  mentalModel:
    'Specialized read-optimized index built from primary data via CDC/batch jobs. Query = parse → search index → score → aggregate facets. Writes go to primary DB; search index is eventually consistent replica optimized for queries.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Concept', 'Purpose', 'Note'],
      rows: [
        ['Inverted index', 'term → posting list', 'Core of full-text search'],
        ['Analyzer', 'Tokenize, lowercase, stem', 'Must match index and query time'],
        ['Shard', 'Split index horizontally', 'Each doc routed by _routing or id hash'],
        ['Replica', 'Copy shard for read scale', 'Leader shard handles indexing'],
        ['Mapping', 'Field types (text vs keyword)', 'keyword for exact filter; text for search'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'Index pipeline from source of truth',
      diagram: `flowchart LR
  PG[(Postgres)] -->|CDC/debezium| Kafka
  Kafka --> Indexer[Indexer worker]
  Indexer --> ES[(Elasticsearch cluster)]
  User[Search API] --> ES`,
    },
    {
      type: 'list',
      items: [
        'Near real-time: refresh interval (default 1s) before visible',
        'Bulk API for batch reindex',
        'Aggregations for facets (count by category)',
        'Synonyms, stopwords, custom analyzers for domain language',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'json',
      caption: 'Elasticsearch query sketch',
      code: `GET /products/_search
{
  "query": {
    "bool": {
      "must": [{ "match": { "title": "wireless keyboard" } }],
      "filter": [{ "term": { "category": "electronics" } }]
    }
  },
  "sort": [{ "_score": "desc" }, { "price": "asc" }],
  "aggs": { "by_brand": { "terms": { "field": "brand.keyword" } } }
}`,
    },
  ],
  tradeoffs: {
    advantages: ['Fast relevance search', 'Facets and aggregations', 'Horizontal scale'],
    disadvantages: ['Eventual consistency vs primary', 'Index size RAM/disk hungry', 'Reindex pain on mapping change'],
    alternatives: ['Postgres full-text for small scale', 'Managed Algolia for simplicity'],
    whenToUse: ['Product search, logs (ELK), autocomplete', 'Complex text + filter queries'],
    whenNotToUse: ['Primary transactional store', 'Strong consistency reads'],
  },
  failureModes: [
    'Mapping explosion (too many dynamic fields)',
    'Yellow cluster unassigned shards',
    'Heavy aggregations OOM coordinators',
    'Stale index after CDC lag',
    'Relevance drift without tuning boosts',
  ],
  production: {
    performance: ['Right shard count (20-50GB/shard guidance)', 'Filter context before scoring', 'Index only searchable fields'],
    scalability: ['Add data nodes; separate master-eligible nodes', 'Cross-cluster search for multi-region'],
    reliability: ['Replica shards ≥1', 'Snapshot to S3 daily'],
    observability: ['Cluster health, indexing lag, query latency, JVM heap'],
    maintainability: ['Versioned index templates', 'Blue/green reindex alias swap'],
    cost: ['Hot/warm/cold tiers for old logs'],
  },
  interview: {
    expectations: ['Inverted index concept', 'Sync from DB', 'text vs keyword fields'],
    commonQuestions: ['Elasticsearch vs DB?', 'Design product search?'],
    followUps: ['Reindex zero downtime?', 'Ranking tuning?'],
    misconceptions: ['ES is primary database', 'More shards always faster'],
    traps: ['Dynamic mapping on high-cardinality fields'],
    strongSignals: ['CDC pipeline', 'Alias swap reindex', 'Facets + pagination search_after'],
  },
  keyTakeaways: [
    'Search index is derived read model — source of truth elsewhere.',
    'Inverted index + analyzers power full-text.',
    'text vs keyword mapping drives query behavior.',
    'CDC/async sync; expect eventual consistency.',
    'Plan sharding and reindex strategy upfront.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Inverted index?', answerHint: 'Maps each term to list of documents containing it.' },
    { level: 'intermediate', question: 'Keep search index in sync with DB?', answerHint: 'CDC (Debezium), outbox events, or periodic batch; handle deletes.' },
    { level: 'advanced', question: 'Zero-downtime mapping change?', answerHint: 'New index version, reindex, alias swap (blue/green).' },
  ],
  flashcards: [
    { front: 'text vs keyword', back: 'text analyzed for search; keyword exact match/filter/facet' },
    { front: 'Search index SoT', back: 'No — primary DB is; ES is derived eventually consistent' },
    { front: 'BM25', back: 'Default relevance scoring based on term frequency and doc length' },
    { front: 'search_after', back: 'Deep pagination cursor better than offset for large result sets' },
  ],
  quickRevision: [
    'Derived inverted index',
    'CDC from primary',
    'text/keyword mapping',
    'Shards + replicas',
    'Alias reindex swap',
  ],
  systemDesign: {
    problem: 'Add full-text product search with filters and facets to e-commerce with 10M SKUs in Postgres.',
    requirements: {
      functional: ['Search by title/description', 'Filter category/price', 'Facets by brand', 'Sort relevance/price'],
      nonFunctional: ['Index lag < 5s', 'p99 search < 100ms', 'Zero-downtime reindex'],
    },
    scaleAssumptions: ['10M products', '2k search QPS', '100 updates/s'],
    capacityEstimates: ['~1KB/doc index → ~10GB + replicas', '3-5 primary shards'],
    api: [{ type: 'code', language: 'http', code: `GET /search?q=keyboard&category=electronics&sort=price` }],
    dataModel: [{ type: 'list', items: ['ES index products: id, title(text), brand(keyword), category(keyword), price(float)', 'Postgres remains SoT'] }],
    highLevelArchitecture: [{ type: 'paragraph', text: 'Debezium CDC Postgres → Kafka → ES consumer; search API queries ES only.' }],
    diagram: {
      mermaid: `flowchart LR
  PG --> CDC --> Kafka --> ESConsumer --> ES
  SearchAPI --> ES
  Admin --> PG`,
      caption: 'Postgres authoritative; ES query path',
    },
    dataFlow: ['CRUD Postgres → CDC event → upsert/delete ES doc', 'Search reads ES'],
    storage: ['ES cluster + Postgres SoT'],
    caching: ['Optional CDN for popular search result pages — careful personalization'],
    asyncProcessing: ['Kafka consumer indexing'],
    scaling: ['ES data nodes; Kafka partitions'],
    consistency: ['Eventual ≤5s lag SLA'],
    reliability: ['ES replicas; replay Kafka on failure'],
    failureScenarios: ['ES down → degrade to DB simple search or maintenance message'],
    security: ['Filter tenant_id in every query', 'No PII in index if not needed'],
    observability: ['Consumer lag, ES query latency, index rate'],
    bottlenecks: ['Heavy facet aggregations — cache popular filters'],
    alternatives: ['Algolia managed'],
    tradeoffs: ['Self-hosted ES ops vs managed cost'],
    interviewFollowUps: ['Delete propagation?', 'Personalized ranking?'],
    evolution: [
      { stage: '1. Simple design', description: 'Postgres LIKE.', bottleneck: 'Slow at scale.' },
      { stage: '2. Improve', description: 'ES + batch index.', bottleneck: 'Stale index.' },
      { stage: '3. Improve', description: 'CDC near-real-time.', bottleneck: 'Mapping changes.' },
      { stage: '4. Scale further', description: 'Learning-to-rank layer; alias reindex playbook.', bottleneck: 'Ranking infra cost.' },
    ],
  },
}
