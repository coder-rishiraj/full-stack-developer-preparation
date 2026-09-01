#!/usr/bin/env node
import { writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const OUT = join(dirname(fileURLToPath(import.meta.url)), '../src/content/topics')
mkdirSync(OUT, { recursive: true })

const CODE_KEYS = new Set(['code', 'mermaid', 'diagram'])

function escTemplate(s) {
  return s.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${')
}

function quoteString(s) {
  if (s.includes("'")) return JSON.stringify(s)
  if (s.includes('"')) return JSON.stringify(s)
  return JSON.stringify(s)
}

function serialize(value, indent = 0) {
  const sp = '  '.repeat(indent)
  const sp1 = '  '.repeat(indent + 1)
  if (value === null) return 'null'
  if (value === undefined) return 'undefined'
  const t = typeof value
  if (t === 'boolean' || t === 'number') return String(value)
  if (t === 'string') {
    if (value.includes('\n')) return '`' + escTemplate(value) + '`'
    return quoteString(value)
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]'
    const lines = value.map((v) => sp1 + serialize(v, indent + 1))
    return '[\n' + lines.join(',\n') + ',\n' + sp + ']'
  }
  if (t === 'object') {
    const keys = Object.keys(value)
    if (keys.length === 0) return '{}'
    const lines = keys.map((k) => {
      const v = value[k]
      const key = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k) ? k : JSON.stringify(k)
      let sv
      if (t === 'object' && CODE_KEYS.has(k) && typeof v === 'string') {
        sv = '`' + escTemplate(v) + '`'
      } else {
        sv = serialize(v, indent + 1)
      }
      return sp1 + key + ': ' + sv
    })
    return '{\n' + lines.join(',\n') + ',\n' + sp + '}'
  }
  throw new Error('Unsupported type: ' + t)
}

function writeTopic(id, content) {
  const body = serialize(content, 0)
  const file = join(OUT, `${id}.ts`)
  writeFileSync(
    file,
    "import type { TopicContent } from '@/domain/types'\n\nexport const content: TopicContent = " + body + '\n',
  )
}

const topics = [
  // === E6 RAG ===
  ['e6-grounding', {
    whatIsIt: 'Grounding in RAG ties LLM answers to retrieved source chunks via inline citations, span references, or structured source metadata. Citations let users verify claims and reduce hallucination risk when the model must stay within evidence.',
    whyExists: 'Pure generation drifts from documents. Production RAG systems need traceability for compliance, debugging bad answers, and user trust. Grounding forces the model to quote or reference retrieved passages rather than invent facts.',
    mentalModel: 'Retrieval supplies evidence slots; generation fills answers only from those slots. Each factual sentence should map to chunk_id + offset or page. If no chunk supports a claim, the system abstains or says unknown.',
    howItWorks: [{ type: 'list', items: [
      'Retrieve top-k chunks with scores and metadata (doc_id, page, section).',
      'Prompt instructs: answer only from context; cite [1][2] per claim.',
      'Post-process: verify cited indices exist; optional NLI check claim ⊆ chunk.',
      'UI renders footnotes linking to original PDF/HTML spans.',
      'Abstention policy when max similarity below threshold or no supporting span.',
    ]}],
    example: [{ type: 'code', language: 'text', caption: 'Grounded prompt pattern', code: `Context:
[1] Refund policy: returns within 30 days with receipt.
[2] Shipping: free over $50.

Question: Can I return after 45 days?
Answer using only context. Cite [n] per sentence.` }],
    production: { reliability: ['Abstain below similarity threshold', 'Log chunk_ids used per answer'], security: ['Strip PII from cited spans in logs', 'AuthZ on source documents'], observability: ['Track citation rate and orphan claims'] },
    tradeoffs: { advantages: ['Reduces hallucination', 'Audit trail for compliance', 'User can verify'], disadvantages: ['Verbose prompts cost tokens', 'Citation format brittle', 'NLI adds latency'], alternatives: ['Tool-calling with fetch_doc(id)', 'Structured JSON answer + sources array'], whenToUse: ['Support bots', 'Legal/medical summaries', 'Enterprise search'], whenNotToUse: ['Creative writing without sources', 'When latency budget forbids verification'] },
    failureModes: ['Model cites wrong index', 'Paraphrase not in chunk but sounds right', 'Stale chunks after doc update', 'Over-citation noise'],
    interview: { expectations: ['Explain citation grounding vs fine-tuning', 'Abstention when retrieval weak'], commonQuestions: ['How reduce hallucination in RAG?', 'What if model ignores context?'], followUps: ['Automated faithfulness metrics?', 'Inline vs footnote citations?'], misconceptions: ['Grounding eliminates all hallucinations', 'More chunks always better for grounding'], traps: ['No threshold → confident wrong answers'], strongSignals: ['Mentions RAGAS faithfulness', 'Abstain + log sources'] },
    keyTakeaways: ['Ground = answer anchored to retrieved spans', 'Citations enable verification', 'Abstain when evidence weak', 'Post-check claims against chunks', 'Log source_ids for audit'],
    interviewQuestions: [
      { level: 'basic', question: 'Why citations in RAG?', answerHint: 'Trace claims to source chunks; reduce hallucination; compliance.' },
      { level: 'intermediate', question: 'What if LLM cites nonexistent [3]?', answerHint: 'Validate indices; rerank prompt; NLI entailment check; penalize in eval.' },
      { level: 'advanced', question: 'Faithfulness metrics?', answerHint: 'RAGAS faithfulness, NLI entailment, human eval on claim-source pairs.' },
    ],
    flashcards: [
      { front: 'Grounding in RAG', back: 'Answers tied to retrieved source spans with citations' },
      { front: 'Abstention trigger', back: 'Low retrieval score or no supporting chunk for claim' },
    ],
    quickRevision: ['Retrieve → cite → generate', 'Abstain if weak evidence', 'Validate citation indices', 'Log chunk_ids', 'NLI optional faithfulness', 'UI link to sources', 'Compliance audit trail'],
  }],

  ['e6-hybrid-retrieval', {
    whatIsIt: 'Hybrid retrieval combines lexical search (BM25/keyword) with dense vector similarity, then fuses rankings—commonly Reciprocal Rank Fusion (RRF) or weighted score merge—to capture both exact token matches and semantic paraphrases.',
    whyExists: 'Vectors miss rare SKUs, acronyms, and exact codes; BM25 misses paraphrases. Hybrid improves recall on real queries mixing both styles without maintaining two separate user-facing search paths.',
    mentalModel: 'Two librarians: one finds exact words (BM25), one finds meaning (embeddings). Fusion merges their ranked lists—document strong in either channel can surface.',
    howItWorks: [{ type: 'list', items: [
      'Index same chunks in inverted index (BM25) and vector store (HNSW).',
      'Query: embed query + tokenize for BM25 in parallel.',
      'Retrieve top-k from each channel (e.g. k=50 each).',
      'RRF: score(d) = Σ 1/(rank_i(d) + c) across lists; c≈60.',
      'Optional cross-encoder rerank on fused top-N.',
    ]}, { type: 'table', headers: ['Method', 'Strength'], rows: [['BM25', 'Exact terms, rare tokens'], ['Dense', 'Paraphrase, semantic'], ['RRF', 'Robust fusion without score calibration']] }],
    example: [{ type: 'paragraph', text: 'Query "error 0x803" → BM25 ranks log doc #1; vector ranks troubleshooting guide #1. RRF promotes both; reranker picks log snippet with exact code.' }],
    production: { performance: ['Parallel BM25 + vector queries', 'Cache query embeddings'], scalability: ['Shard both indexes consistently by chunk_id'], cost: ['Two indexes increase storage ~1.5–2x'] },
    tradeoffs: { advantages: ['Better recall than either alone', 'Handles codes + natural language'], disadvantages: ['Dual index maintenance', 'Tuning fusion weights', 'Higher query latency'], alternatives: ['Sparse-dense single model (SPLADE)', 'Learned fusion'], whenToUse: ['Enterprise search', 'Support KB with SKUs'], whenNotToUse: ['Tiny corpus where BM25 alone suffices'] },
    failureModes: ['Duplicate chunks inflate RRF', 'BM25 stopwords dominate short queries', 'Mismatched chunk boundaries between indexes'],
    interview: { expectations: ['Explain RRF formula intuition', 'When hybrid beats pure vector'], commonQuestions: ['BM25 vs embeddings?', 'How fuse rankings?'], followUps: ['SPLADE vs dual index?', 'Weight tuning?'], misconceptions: ['Always weighted average of raw scores works', 'Hybrid doubles latency always'], traps: ['Different chunk splits per index'], strongSignals: ['RRF with c=60', 'Same chunk_id in both indexes'] },
    keyTakeaways: ['BM25 + dense = hybrid recall', 'RRF fuses ranks without score scale', 'Same chunk boundaries in both indexes', 'Rerank after fusion', 'Parallel query both channels'],
    interviewQuestions: [
      { level: 'basic', question: 'Why hybrid over vector only?', answerHint: 'Exact tokens, SKUs, rare terms BM25 catches; vectors catch paraphrase.' },
      { level: 'intermediate', question: 'RRF formula?', answerHint: 'Sum 1/(rank+c) per list; documents appearing in both lists score higher.' },
      { level: 'advanced', question: 'SPLADE vs dual-index hybrid?', answerHint: 'SPLADE learned sparse+dense in one model; dual-index simpler ops, proven BM25.' },
    ],
    flashcards: [
      { front: 'RRF', back: 'Reciprocal Rank Fusion: score = Σ 1/(rank+c)' },
      { front: 'Hybrid retrieval', back: 'BM25 lexical + dense vector, fused rankings' },
    ],
    quickRevision: ['BM25 exact + vector semantic', 'RRF rank fusion', 'Same chunk_id both indexes', 'Parallel retrieve', 'Rerank top-N', 'Watch duplicate chunks', 'Tune k per channel'],
  }],

  ['e6-indexing', {
    whatIsIt: 'Vector indexing structures embeddings for approximate nearest neighbor (ANN) search—HNSW graphs, IVF partitions, or flat brute force—trading build cost, memory, recall@k, and query latency at scale.',
    whyExists: 'Brute-force cosine over millions of vectors is O(n) per query. ANN indexes reduce to sublinear search with tunable recall—essential for production RAG latency and cost.',
    mentalModel: 'HNSW: multi-layer skip graph—greedy walk from entry to neighbors closer to query. IVF: cluster centroids, search only nearest clusters. More layers/clusters = faster but may miss true nearest.',
    howItWorks: [{ type: 'list', items: [
      'Embed chunks offline; store vector + metadata payload.',
      'HNSW: M neighbors per node, efConstruction at build, efSearch at query.',
      'IVF: train k centroids; assign vectors; probe nprobe clusters at query.',
      'Rebuild or incremental update on corpus change; version indexes.',
      'Monitor recall@k vs brute force on sample queries.',
    ]}, { type: 'table', headers: ['Index', 'Build', 'Query', 'Recall'], rows: [['Flat', 'None', 'Slow exact', '100%'], ['HNSW', 'Medium', 'Fast', 'High tunable'], ['IVF', 'Train clusters', 'Fast large n', 'Depends nprobe']] }],
    example: [{ type: 'paragraph', text: '1M chunks, 1536-dim: flat ~200ms/query; HNSW ef=128 ~5ms at 98% recall@10. Increase efSearch for critical queries.' }],
    production: { performance: ['Tune efSearch vs latency SLO', 'Warm index on deploy'], scalability: ['Shard by tenant or hash', 'Replicate read replicas'], reliability: ['Blue-green index swap on reindex'] },
    tradeoffs: { advantages: ['Sublinear ANN query', 'Mature libraries (FAISS, pgvector HNSW)'], disadvantages: ['Approximate misses neighbors', 'Rebuild on major model change'], alternatives: ['DiskANN for billion scale', 'Product quantization for memory'], whenToUse: ['>100k vectors', 'Interactive RAG'], whenNotToUse: ['Tiny corpus (<5k) flat is fine'] },
    failureModes: ['Stale index after ingestion lag', 'Wrong embedding model dimension', 'ef too low → wrong context', 'Hot shard imbalance'],
    interview: { expectations: ['HNSW vs IVF tradeoffs', 'Recall-latency knob'], commonQuestions: ['How vector DB scales?', 'What is HNSW?'], followUps: ['Reindex strategy?', 'PQ compression?'], misconceptions: ['ANN always exact', 'Index never needs rebuild'], traps: ['Mixing embedding models on same index'], strongSignals: ['efSearch tuning', 'Recall eval set'] },
    keyTakeaways: ['ANN for scale; flat for tiny', 'HNSW: graph greedy search', 'IVF: cluster probe', 'Match embedding model to index', 'Monitor recall@k'],
    interviewQuestions: [
      { level: 'basic', question: 'Why not brute force all vectors?', answerHint: 'O(n) per query too slow at millions; ANN sublinear with tunable recall.' },
      { level: 'intermediate', question: 'HNSW query knobs?', answerHint: 'efSearch higher → better recall, slower; M at build affects graph quality.' },
      { level: 'advanced', question: 'Reindex without downtime?', answerHint: 'Build new index version; dual-write; swap alias; drain old queries.' },
    ],
    flashcards: [
      { front: 'HNSW', back: 'Hierarchical navigable small world graph for ANN' },
      { front: 'efSearch', back: 'HNSW query-time beam width; higher = better recall, slower' },
    ],
    quickRevision: ['ANN not exact', 'HNSW graph walk', 'IVF cluster probe', 'Recall@k eval', 'Reindex on model change', 'Shard large indexes', 'efSearch latency tradeoff'],
  }],

  ['e6-ingestion', {
    whatIsIt: 'Document ingestion is the offline pipeline that fetches sources, parses content, chunks text, embeds vectors, and upserts into search indexes—with idempotent job tracking and schema versioning.',
    whyExists: 'RAG quality starts before retrieval. Bad ingestion (wrong splits, missing updates, duplicate chunks) poisons every downstream answer. Production needs reliable batch/stream ingestion with observability.',
    mentalModel: 'ETL for knowledge: Extract (S3, Confluence, DB) → Transform (parse, clean, chunk) → Load (embed, index metadata + vector). Each document version gets stable chunk_ids.',
    howItWorks: [{ type: 'list', ordered: true, items: [
      'Discover sources (webhook, cron, CDC).',
      'Parse to text (PDF, HTML, DOCX) preserving structure hints.',
      'Chunk with overlap; attach metadata (title, ACL, updated_at).',
      'Embed batch; upsert vector + keyword index.',
      'Mark job complete; tombstone deleted docs.',
    ]}],
    example: [{ type: 'code', language: 'text', caption: 'Chunk metadata payload', code: `{
  "chunk_id": "doc42#p3-c2",
  "doc_id": "doc42",
  "text": "...",
  "page": 3,
  "acl": ["team:eng"],
  "updated_at": "2026-01-15T10:00:00Z"
}` }],
    production: { reliability: ['Idempotent upsert by chunk_id', 'DLQ for failed parses'], observability: ['Ingestion lag metric', 'Chunk count per source'], scalability: ['Parallel workers per partition'], maintainability: ['Schema version in metadata'] },
    tradeoffs: { advantages: ['Central quality gate', 'Replayable pipelines'], disadvantages: ['Lag until indexed', 'Complex parsers'], alternatives: ['Real-time stream per edit', 'Lazy embed on first query'], whenToUse: ['Any production RAG corpus'], whenNotToUse: ['Single static file demo'] },
    failureModes: ['Partial ingest → missing sections', 'Duplicate chunks on re-run without idempotency', 'ACL not copied → data leak', 'Embedding model change without reindex'],
    interview: { expectations: ['End-to-end ingest flow', 'Idempotency and deletes'], commonQuestions: ['How keep RAG corpus fresh?', 'Chunking strategy?'], followUps: ['CDC vs batch?', 'Handle PDF tables?'], misconceptions: ['Ingest once is enough', 'Chunk size one-size-fits-all'], traps: ['No tombstone on doc delete'], strongSignals: ['chunk_id scheme', 'ACL on metadata'] },
    keyTakeaways: ['Ingest = parse → chunk → embed → index', 'Idempotent chunk_id upserts', 'Metadata carries ACL + timestamps', 'Tombstone deletes', 'Monitor ingestion lag'],
    interviewQuestions: [
      { level: 'basic', question: 'Ingestion pipeline steps?', answerHint: 'Fetch, parse, chunk, embed, upsert indexes, track job status.' },
      { level: 'intermediate', question: 'Handle document updates?', answerHint: 'Version doc; delete old chunk_ids; upsert new; or CDC delta.' },
      { level: 'advanced', question: 'Idempotent re-ingest?', answerHint: 'Deterministic chunk_id from doc_id + offset; upsert overwrites same key.' },
    ],
    flashcards: [
      { front: 'Ingestion idempotency', back: 'Stable chunk_id; upsert same key on re-run' },
      { front: 'Tombstone', back: 'Delete vectors/metadata when source doc removed' },
    ],
    quickRevision: ['ETL for RAG', 'Parse chunk embed index', 'chunk_id stable', 'ACL in metadata', 'Tombstone deletes', 'Monitor lag', 'Schema version tags'],
  }],

  ['e6-metadata-filtering', {
    whatIsIt: 'Metadata filtering applies structured predicates (tenant, date range, product, ACL) before or during vector search so retrieval returns only chunks the user may access and that match business constraints.',
    whyExists: 'Semantic search alone retrieves semantically similar but wrong-tenant or outdated docs. Filters enforce security, freshness, and domain scope—critical in multi-tenant enterprise RAG.',
    mentalModel: 'Pre-filter narrows the search space to allowed docs; post-filter drops hits failing predicates. Vector DBs support filter + ANN in one query when metadata is indexed.',
    howItWorks: [{ type: 'list', items: [
      'Store filterable fields on each vector payload (tenant_id, category, valid_until).',
      'Query: embed + filter expression e.g. tenant_id = X AND date > Y.',
      'Pre-filter: bitmap/postings restrict ANN graph traversal.',
      'Post-filter fallback if DB lacks native pre-filter.',
      'Never rely on LLM to enforce ACL—filter at retrieval.',
    ]}],
    example: [{ type: 'paragraph', text: 'Support bot: filter product=Widget AND region=EU before top-k; prevents US policy chunks answering EU users.' }],
    production: { security: ['ACL filter mandatory', 'Deny by default'], performance: ['Index filter columns', 'Avoid post-filter on huge k'], reliability: ['Validate filter schema at ingest'] },
    tradeoffs: { advantages: ['Security + relevance', 'Smaller search space'], disadvantages: ['Over-filter → empty results', 'Schema rigidity'], alternatives: ['Separate index per tenant', 'Metadata as query prefix'], whenToUse: ['Multi-tenant RAG', 'Time-sensitive docs'], whenNotToUse: ['Single public corpus'] },
    failureModes: ['Missing ACL field → leak', 'Too many filters → zero hits silently', 'Timezone bugs on date filters'],
    interview: { expectations: ['Pre vs post filter', 'ACL at retrieval not generation'], commonQuestions: ['Multi-tenant RAG isolation?'], followUps: ['Filter + HNSW together?'], misconceptions: ['Prompt can enforce security'], traps: ['Post-filter only with large k'], strongSignals: ['Indexed metadata fields', 'Deny default ACL'] },
    keyTakeaways: ['Filter at retrieval for ACL', 'Pre-filter in vector DB preferred', 'Metadata indexed with vectors', 'Over-filter risks empty context', 'Never trust LLM for authZ'],
    interviewQuestions: [
      { level: 'basic', question: 'Why metadata filters in RAG?', answerHint: 'Tenant isolation, freshness, product scope; security before generation.' },
      { level: 'intermediate', question: 'Pre-filter vs post-filter?', answerHint: 'Pre-filter during ANN saves work; post-filter after k retrieval if DB limited.' },
      { level: 'advanced', question: 'Empty results after filter?', answerHint: 'Relax filters progressively; broaden date; fallback message; log filter stats.' },
    ],
    flashcards: [
      { front: 'Metadata filtering', back: 'Structured predicates on vector payload before/during search' },
      { front: 'ACL in RAG', back: 'Enforce at retrieval index query, not in LLM prompt' },
    ],
    quickRevision: ['Filter tenant ACL date', 'Pre-filter in ANN', 'Index metadata fields', 'Deny by default', 'Relax if empty', 'No LLM authZ', 'Log filter misses'],
  }],

  ['e6-parsing', {
    whatIsIt: 'Document parsing converts PDFs, HTML, DOCX, slides, and tables into clean text (and optional structure) for chunking—handling layout, headers, footers, OCR, and embedded images.',
    whyExists: 'Raw bytes are unusable for embeddings. Parsing quality determines whether chunks contain coherent sentences vs broken columns, headers repeated on every page, or lost table data.',
    mentalModel: 'Reverse the authoring layout: detect reading order, strip boilerplate, preserve headings as metadata, OCR scanned pages. Parser output is markdown-like structure + plain text fallback.',
    howItWorks: [{ type: 'list', items: [
      'Format-specific loaders (PyMuPDF, Tika, Unstructured).',
      'Layout analysis: blocks, columns, tables.',
      'OCR for scanned PDFs (Tesseract, cloud OCR).',
      'Extract title, headings, page numbers into metadata.',
      'Normalize whitespace; dedupe repeated headers/footers.',
    ]}],
    example: [{ type: 'paragraph', text: 'Two-column PDF parsed row-wise merges unrelated sentences—use layout-aware parser or per-column extraction before chunking.' }],
    production: { reliability: ['Fallback parser chain', 'Human review queue for low confidence OCR'], maintainability: ['Parser version in chunk metadata'], cost: ['OCR only when text layer empty'] },
    tradeoffs: { advantages: ['Unlocks enterprise PDFs', 'Structure aids chunk boundaries'], disadvantages: ['Fragile on complex layouts', 'OCR cost/latency'], alternatives: ['Vision LLM page describe', 'Manual curation for critical docs'], whenToUse: ['PDF-heavy corpora'], whenNotToUse: ['Already clean markdown API'] },
    failureModes: ['Table → garbled text', 'Header on every chunk', 'Wrong reading order', 'Scanned PDF without OCR'],
    interview: { expectations: ['Layout vs naive text extract', 'OCR when needed'], commonQuestions: ['Parse PDF for RAG?'], followUps: ['Tables in RAG?'], misconceptions: ['pdf.extractText() enough'], traps: ['Chunk before cleaning headers'], strongSignals: ['Layout-aware pipeline', 'OCR fallback'] },
    keyTakeaways: ['Parsing quality = RAG ceiling', 'Layout-aware for PDFs', 'OCR scanned docs', 'Strip repeated headers', 'Preserve heading metadata'],
    interviewQuestions: [
      { level: 'basic', question: 'Why not plain PDF text extract?', answerHint: 'Loses layout; columns merge; tables break; headers repeat.' },
      { level: 'intermediate', question: 'Handle tables?', answerHint: 'HTML/markdown table serialize; or row JSON; specialized table parsers.' },
      { level: 'advanced', question: 'Vision LLM vs traditional parse?', answerHint: 'Vision good on messy scans; costlier; hybrid: OCR + layout + VLM for hard pages.' },
    ],
    flashcards: [
      { front: 'Layout-aware parsing', back: 'Respect columns, blocks, reading order vs raw text dump' },
      { front: 'OCR trigger', back: 'When PDF has no selectable text layer' },
    ],
    quickRevision: ['Format-specific loaders', 'Layout reading order', 'OCR scanned PDFs', 'Strip headers footers', 'Table serialization', 'Title in metadata', 'Parser version tag'],
  }],

  ['e6-reranking', {
    whatIsIt: 'Reranking re-scores initial retrieval candidates with a cross-encoder or lightweight model that jointly encodes query + document—producing better ordering than bi-encoder cosine alone for top-N precision.',
    whyExists: 'Bi-encoders embed query and doc separately—fast but shallow interaction. Reranking on top-50→top-5 dramatically improves answer quality before LLM context window fills with noise.',
    mentalModel: 'Retrieval casts a wide net (bi-encoder/BM25); reranker reads query+each candidate together like a relevance judge—expensive per pair but only on N candidates.',
    howItWorks: [{ type: 'list', items: [
      'Retrieve k=50–200 with bi-encoder or hybrid.',
      'Cross-encoder scores each (query, chunk) pair.',
      'Sort by rerank score; take top 5–10 for LLM context.',
      'Optional cascade: cheap reranker then expensive one.',
      'Cache rerank scores for repeated queries if applicable.',
    ]}],
    example: [{ type: 'paragraph', text: 'Query "disable 2FA" retrieves generic security pages at rank 1–3; cross-encoder promotes exact "two-factor settings" chunk to rank 1.' }],
    production: { performance: ['Limit N to 50–100', 'GPU batch scoring', 'Skip rerank on cache hit'], cost: ['Cross-encoder GPU cost per query'], performance: ['Budget 100–300ms for rerank stage'] },
    tradeoffs: { advantages: ['Large precision gain', 'Fixes bi-encoder misses'], disadvantages: ['Latency + compute', 'Not for huge N'], alternatives: ['ColBERT late interaction', 'LLM listwise rerank'], whenToUse: ['Quality-critical RAG'], whenNotToUse: ['Ultra-low latency without GPU'] },
    failureModes: ['N too small misses true doc', 'N too large blows latency', 'Domain mismatch reranker model'],
    interview: { expectations: ['Bi vs cross-encoder', 'Retrieve wide rerank narrow'], commonQuestions: ['Why rerank after vector search?'], followUps: ['ColBERT vs cross-encoder?'], misconceptions: ['Bigger k in LLM replaces rerank'], traps: ['Rerank entire corpus'], strongSignals: ['k=50→5 pattern', 'Latency budget'] },
    keyTakeaways: ['Bi-encoder fast; cross-encoder accurate', 'Retrieve many, rerank few', 'Top-5 to LLM typical', 'Batch GPU scoring', 'Domain-tuned reranker helps'],
    interviewQuestions: [
      { level: 'basic', question: 'Bi-encoder vs cross-encoder?', answerHint: 'Bi: separate embeddings, fast ANN; cross: joint encoding, slow, accurate per pair.' },
      { level: 'intermediate', question: 'Typical k before rerank?', answerHint: '50–200 retrieve; rerank to 5–10 for context.' },
      { level: 'advanced', question: 'ColBERT?', answerHint: 'Late interaction: token embeddings + MaxSim; middle ground speed/quality.' },
    ],
    flashcards: [
      { front: 'Cross-encoder rerank', back: 'Joint query+doc scoring on retrieved candidates' },
      { front: 'Retrieve vs rerank k', back: 'Wide retrieve (50+), narrow rerank (5–10)' },
    ],
    quickRevision: ['Bi-encoder retrieve', 'Cross-encoder rerank', 'k wide → narrow', 'GPU batch pairs', 'Latency budget', 'ColBERT alternative', 'Domain-tuned model'],
  }],

  ['e6-retrieval', {
    whatIsIt: 'Retrieval is the RAG stage that maps a user query to ranked document chunks from an index—via embedding similarity, keyword search, or hybrid fusion—supplying context for the generator.',
    whyExists: 'LLM parametric memory is static and opaque. Retrieval injects fresh, attributable knowledge per query—the core of open-book QA over private corpora.',
    mentalModel: 'Question → query representation → search index → ranked evidence list. Garbage retrieval guarantees garbage answers regardless of model size.',
    howItWorks: [{ type: 'list', ordered: true, items: [
      'Rewrite/expand query (optional HyDE, multi-query).',
      'Search vector and/or keyword index with filters.',
      'Fuse and dedupe results.',
      'Rerank top candidates.',
      'Pack chunks into context window budget.',
    ]}, { type: 'mermaid', diagram: `flowchart LR
  Q[Query] --> E[Embed / tokenize]
  E --> V[Vector search]
  E --> B[BM25 search]
  V --> F[Fusion]
  B --> F
  F --> R[Rerank]
  R --> C[Context pack]`, caption: 'Retrieval pipeline' }],
    example: [{ type: 'paragraph', text: 'Weak retrieval: top chunk is FAQ intro, not answer paragraph. Fix: better chunking, hybrid search, reranker—not bigger LLM.' }],
    production: { observability: ['Log retrieval scores', 'Hit rate @k', 'MRR on eval set'], performance: ['Cache frequent queries'], reliability: ['Fallback when empty results'] },
    tradeoffs: { advantages: ['Fresh knowledge', 'Smaller models viable'], disadvantages: ['Pipeline complexity', 'Retrieval errors dominate'], alternatives: ['Long-context only no RAG', 'Fine-tune on corpus'], whenToUse: ['Dynamic private knowledge'], whenNotToUse: ['Static small doc fits in prompt'] },
    failureModes: ['Wrong chunk granularity', 'Semantic drift', 'No results → hallucination', 'Duplicate redundant chunks waste tokens'],
    interview: { expectations: ['Full retrieve pipeline', 'Diagnose bad answers via retrieval'], commonQuestions: ['RAG retrieval steps?'], followUps: ['Query expansion?'], misconceptions: ['Embedding alone is full RAG'], traps: ['Skip eval on retrieval metrics'], strongSignals: ['MRR/recall@k tracking', 'Hybrid + rerank'] },
    keyTakeaways: ['Retrieval supplies LLM context', 'Quality > model size', 'Hybrid + rerank common', 'Filter + dedupe chunks', 'Measure recall@k'],
    interviewQuestions: [
      { level: 'basic', question: 'Retrieval role in RAG?', answerHint: 'Find relevant chunks for query to pass as context to LLM.' },
      { level: 'intermediate', question: 'Debug wrong RAG answer?', answerHint: 'Inspect retrieved chunks first; fix chunking/index before prompt.' },
      { level: 'advanced', question: 'Multi-query retrieval?', answerHint: 'Generate paraphrases; retrieve each; union + dedupe + rerank.' },
    ],
    flashcards: [
      { front: 'RAG retrieval', back: 'Query → index search → ranked chunks for context' },
      { front: 'First debug step bad RAG', back: 'Inspect retrieved chunks quality and rank' },
    ],
    quickRevision: ['Query → search → rank', 'Hybrid fusion', 'Metadata filters', 'Rerank top-N', 'Dedupe chunks', 'Recall@k metric', 'Empty → abstain'],
  }],

  ['e6-top-k', {
    whatIsIt: 'Top-k retrieval returns the k highest-scoring chunks from search. Choosing k balances context richness vs noise, token cost, and latency—often 3–10 after reranking, higher before rerank.',
    whyExists: 'Too few chunks miss evidence; too many dilute attention and blow token budget. k is a primary tuning knob linking retrieval recall to LLM context limits.',
    mentalModel: 'k is how many evidence cards you hand the LLM. Start with recall@k on eval set; shrink k after reranking improves precision.',
    howItWorks: [{ type: 'list', items: [
      'Initial retrieval k_retrieval: 20–100 for reranker input.',
      'Post-rerank k_context: 3–10 into prompt.',
      'Score threshold: drop below min similarity.',
      'Token budget: pack chunks until max tokens.',
      'Deduplicate overlapping chunks from same doc.',
    ]}, { type: 'table', headers: ['Stage', 'Typical k'], rows: [['ANN retrieve', '50–200'], ['After rerank', '5–10'], ['LLM context', '3–7 chunks often']] }],
    example: [{ type: 'paragraph', text: 'k=20 without rerank floods prompt with tangential FAQ hits; k=5 after rerank keeps answer focused with citations.' }],
    production: { cost: ['Token cost scales with k_context'], performance: ['Lower k reduces LLM latency'], observability: ['Track k vs answer quality A/B'] },
    tradeoffs: { advantages: ['Simple knob', 'Easy A/B'], disadvantages: ['Not adaptive to query difficulty'], alternatives: ['Dynamic k by score gap', 'Token-budget packing'], whenToUse: ['All vector retrieval'], whenNotToUse: ['When fixed k ignores score quality'] },
    failureModes: ['k=1 misses multi-hop evidence', 'Large k confuses LLM', 'Same doc chunks redundant'],
    interview: { expectations: ['Two-stage k concept', 'Token budget packing'], commonQuestions: ['How choose k?'], followUps: ['Dynamic k?'], misconceptions: ['Max k always better'], traps: ['k=1 for multi-source questions'], strongSignals: ['Retrieve wide context narrow', 'Eval recall@k'] },
    keyTakeaways: ['Two k values: retrieve vs context', 'Rerank then small k to LLM', 'Score threshold filters weak hits', 'Token budget caps effective k', 'Eval recall@k to tune'],
    interviewQuestions: [
      { level: 'basic', question: 'What is top-k retrieval?', answerHint: 'Return k highest-scoring chunks from similarity search.' },
      { level: 'intermediate', question: 'k before vs after rerank?', answerHint: 'Large k retrieve (50+); small k context (5–10) after rerank.' },
      { level: 'advanced', question: 'Dynamic k?', answerHint: 'Stop when score gap large or token budget full; MMR diversity.' },
    ],
    flashcards: [
      { front: 'Top-k two stages', back: 'Large k retrieve; small k after rerank to LLM' },
      { front: 'recall@k', back: 'Fraction of queries where true doc in top k results' },
    ],
    quickRevision: ['k retrieve vs k context', 'Typical 5–10 to LLM', 'Score threshold', 'Token budget pack', 'Dedupe same doc', 'recall@k eval', 'MMR diversity optional'],
  }],


  ['a1-java-streams-interviews', {
    whatIsIt: "Java Stream API (java.util.stream) models bulk data ops as a pipeline of intermediate ops (map/filter/sorted) and terminal ops (collect/reduce/count)—lazy until terminal, often clearer than loops in interviews.",
    whyExists: "Loops hide intent; streams express filter-map-collect pipelines and optional parallelism. Interviewers test grouping, flatMap, collectors, and primitive streams.",
    mentalModel: "Water pipe: elements flow through filters/transformers; the terminal valve opens flow and produces a result.",
    howItWorks: [{ type: 'list', items: [
      'Source → intermediate ops (lazy) → terminal (eager).',
      'No reuse after terminal; each stream consumed once.',
      'collect(Collectors.groupingBy) for frequency maps.',
      'flatMap flattens nested lists or Optional chains.',
      'Avoid side effects in lambdas; map beats peek for transforms.',
    ]}],
    example: [{ type: 'paragraph', text: 'Group trimmed words by length, then take the longest-length bucket—one pipeline with groupingBy and optional max by key.' }],
    templates: [{ language: 'java', caption: 'Stream pipeline skeleton', code: `List<String> words = list.stream()
    .filter(s -> !s.isBlank())
    .map(String::trim)
    .toList();
Map<Integer, Long> freq = words.stream()
    .collect(Collectors.groupingBy(String::length, Collectors.counting()));` }],
    tradeoffs: { advantages: ['Declarative pipelines', 'Rich collectors'], disadvantages: ['Harder to debug than loops', 'Boxing in Stream<Integer>'], alternatives: ['Enhanced for-loops', 'Records + explicit steps'], whenToUse: ['Filter/map/aggregate in one pass'], whenNotToUse: ['Tight numeric hot loops without profiling'] },
    failureModes: ['Reusing stream after terminal', 'parallelStream on small n or IO-bound work', 'Null elements without filter'],
    production: { performance: ['Use IntStream/LongStream for numeric bulk', 'Avoid parallelStream unless profiled CPU-bound'], maintainability: ['Keep pipelines short; extract named methods'], reliability: ['Handle empty Optional from findFirst/min/max'] },
    interview: { expectations: ['Lazy vs terminal', 'groupingBy/counting', 'flatMap vs map'], commonQuestions: ['Most frequent element via streams?', 'Difference map vs flatMap?'], followUps: ['Custom collector?', 'parallelStream pitfalls?'], misconceptions: ['Streams always multithreaded', 'peek is for mapping'], traps: ['Mutating external list in forEach'], strongSignals: ['Names collectors correctly', 'Avoids parallelStream by default'] },
    keyTakeaways: ['Terminal op triggers pipeline', 'Intermediates are lazy', 'Collectors.groupingBy/counting', 'flatMap flattens one level', 'One stream → one terminal'],
    interviewQuestions: [
      { level: 'basic', question: 'Lazy vs eager in streams?', answerHint: 'Intermediate ops lazy until terminal executes.' },
      { level: 'intermediate', question: 'groupingBy vs toMap?', answerHint: 'groupingBy groups into lists; toMap needs merge function on duplicate keys.' },
      { level: 'advanced', question: 'When parallelStream?', answerHint: 'Large CPU-bound pure ops on in-memory data; not IO; measure first.' },
    ],
    flashcards: [
      { front: 'Terminal operation', back: 'Eager; triggers pipeline e.g. collect, reduce, forEach' },
      { front: 'flatMap', back: 'Map to stream then flatten one level' },
    ],
    quickRevision: ['Source → intermediate → terminal', 'Lazy until terminal', 'groupingBy/counting', 'flatMap flatten', 'No stream reuse', 'Careful parallelStream', 'Method references'],
    patternRecognition: ['Frequency via groupingBy', 'Top-K often clearer with heap'],
    commonMistakes: ['Side effects in peek', 'Boxing overhead on primitives'],
  }],

  ['a2-difference-arrays', {
    whatIsIt: "Difference array applies range updates in O(1) per update by marking start/end deltas; prefix sum reconstructs final array\u2014classic for range add on static base or offline queries.",
    whyExists: "Repeated range updates on array naive O(n) each. Diff array + prefix sum handles many updates then one materialize in O(n+U).",
    mentalModel: "Timeline of +v from L to R: increment diff[L], decrement diff[R+1]; prefix sum spreads the ink.",
    howItWorks: [
      {
        type: "list",
        items: [
          "Build diff[n+1] zeros.",
          "Range [l,r] add v: diff[l]+=v; diff[r+1]-=v.",
          "Prefix sum diff \u2192 result array.",
          "Works on top of existing base if add base[i] to result.",
          "2D diff for submatrix updates (interview rare).",
        ],
      },
    ],
    example: [
      {
        type: "paragraph",
        text: "Array [0,0,0,0], add 2 on [1,3]: diff[1]+=2, diff[4]-=2 \u2192 prefix [0,2,2,2,0].",
      },
    ],
    templates: [
      {
        language: "java",
        caption: "Range add on diff array",
        code: `void rangeAdd(int[] diff, int l, int r, int v) {
    diff[l] += v;
    if (r + 1 < diff.length) diff[r + 1] -= v;
}
int[] prefix(int[] diff) {
    for (int i = 1; i < diff.length; i++) diff[i] += diff[i - 1];
    return diff;
}`,
      },
    ],
    tradeoffs: {
      advantages: [
        "Fast range updates",
        "Simple offline pattern",
      ],
      disadvantages: [
        "Not for dynamic point queries without rebuild",
        "2D trickier",
      ],
      alternatives: [
        "Segment tree/Fenwick online",
        "Brute force small n",
      ],
      whenToUse: [
        "Many range adds then final array",
        "Corporate flight capacity style",
      ],
      whenNotToUse: [
        "Point queries during updates",
      ],
    },
    failureModes: [
      "Forgot decrement at r+1",
      "Off-by-one inclusive vs exclusive",
      "Prefix before all updates applied",
    ],
    interview: {
      expectations: [
        "O(1) range update",
        "Prefix restore",
      ],
      commonQuestions: [
        "Difference array technique?",
        "Flight booking capacity?",
      ],
      followUps: [
        "2D diff?",
        "Combine with base array?",
      ],
      misconceptions: [
        "Same as Fenwick always",
        "In-place on original without diff",
      ],
      traps: [
        "r+1 out of bounds",
      ],
      strongSignals: [
        "States diff[l] and diff[r+1]",
      ],
    },
    keyTakeaways: [
      "diff[l]+=v diff[r+1]-=v",
      "Prefix sum materialize",
      "O(1) per range update",
      "Offline batch updates",
      "Watch inclusive bounds",
      "Flight capacity template",
    ],
    interviewQuestions: [
      {
        level: "basic",
        question: "Why diff[r+1]-=v?",
        answerHint: "Cancels increment after range end at prefix time.",
      },
      {
        level: "intermediate",
        question: "Corporate flight bookings?",
        answerHint: "Diff on days; prefix > capacity => false.",
      },
      {
        level: "advanced",
        question: "Diff vs segment tree?",
        answerHint: "Diff offline batch; segtree online queries/updates.",
      },
    ],
    flashcards: [
      {
        front: "Range update diff",
        back: "diff[l]+=v; diff[r+1]-=v",
      },
      {
        front: "Restore",
        back: "Prefix sum diff array",
      },
    ],
    quickRevision: [
      "O(1) range add",
      "Prefix to rebuild",
      "r+1 decrement",
      "Inclusive [l,r]",
      "Offline updates",
      "Capacity check pattern",
      "Not online point query",
    ],
    complexity: {
      average: "O(1) per update, O(n) build",
      space: "O(n)",
    },
  }],

  ['a3-bucket-sort', {
    whatIsIt: "Bucket sort distributes elements into buckets by key range (often uniform), sorts buckets individually, concatenates\u2014O(n) average when input uniform over [0,1) or small integer range.",
    whyExists: "Comparison sorts lower bound O(n log n). Bucket sort beats it when keys distribute evenly into O(n) buckets each O(1) size.",
    mentalModel: "Sort mail into zip-code bins; sort each bin separately; stack bins in order.",
    howItWorks: [
      {
        type: "list",
        items: [
          "Choose bucket count ~ n.",
          "Map value to bucket index via (val-min)*m/(max-min+1).",
          "Sort each bucket (insertion sort for small).",
          "Concatenate buckets in order.",
          "Float keys in [0,1) classic interview variant.",
        ],
      },
    ],
    example: [
      {
        type: "paragraph",
        text: "Values 0.42,0.12,0.91 in 3 buckets \u2192 sort each \u2192 ordered output.",
      },
    ],
    templates: [
      {
        language: "java",
        caption: "Bucket sort [0,1) floats",
        code: `void bucketSort(float[] a) {
    int n = a.length;
    List<List<Float>> buckets = new ArrayList<>();
    for (int i = 0; i < n; i++) buckets.add(new ArrayList<>());
    for (float v : a) buckets.get((int)(n * v)).add(v);
    for (List<Float> b : buckets) Collections.sort(b);
    int i = 0;
    for (List<Float> b : buckets)
        for (float v : b) a[i++] = v;
}`,
      },
    ],
    tradeoffs: {
      advantages: [
        "Linear average on uniform data",
        "Stable if bucket sort stable",
      ],
      disadvantages: [
        "Worst case one bucket",
        "Needs range knowledge",
      ],
      alternatives: [
        "Counting sort integers",
        "Radix sort",
      ],
      whenToUse: [
        "Uniform float [0,1)",
        "Known small range",
      ],
      whenNotToUse: [
        "Adversarial clustered keys",
      ],
    },
    failureModes: [
      "All elements same bucket \u2192 O(n\u00b2)",
      "Wrong bucket index formula",
      "Integer overflow in index",
    ],
    interview: {
      expectations: [
        "When O(n)",
        "Worst case",
      ],
      commonQuestions: [
        "Bucket sort vs counting?",
        "When fails?",
      ],
      followUps: [
        "Combine with radix?",
      ],
      misconceptions: [
        "Always O(n)",
      ],
      traps: [
        "Negative floats without shift",
      ],
      strongSignals: [
        "Explains uniform assumption",
      ],
    },
    keyTakeaways: [
      "Map to bucket index",
      "Sort small buckets",
      "Concatenate",
      "O(n) average uniform",
      "O(n\u00b2) worst cluster",
      "Not comparison sort",
    ],
    interviewQuestions: [
      {
        level: "basic",
        question: "Bucket sort time?",
        answerHint: "O(n) average uniform; O(n\u00b2) if one bucket.",
      },
      {
        level: "intermediate",
        question: "Stable bucket sort?",
        answerHint: "Yes if bucket sorts stable (insertion/merge).",
      },
      {
        level: "advanced",
        question: "vs radix?",
        answerHint: "Radix digit buckets; bucket sort range buckets; radix for fixed width ints.",
      },
    ],
    flashcards: [
      {
        front: "Bucket sort avg",
        back: "O(n) when buckets evenly sized",
      },
      {
        front: "Worst case",
        back: "All elements land in one bucket",
      },
    ],
    quickRevision: [
      "n buckets ~ n",
      "Index from range",
      "Sort each bucket",
      "Concat in order",
      "Uniform input key",
      "Worst O(n\u00b2)",
      "Float [0,1) classic",
    ],
    complexity: {
      average: "O(n) uniform",
      worst: "O(n\u00b2) all in one bucket",
      space: "O(n)",
    },
  }],

  ['a3-counting-sort', {
    whatIsIt: "Counting sort non-comparison integer sort by frequency array.",
    whyExists: "Interview problems need counting sort for performance or simplicity on bounded domains.",
    mentalModel: "Focus on invariant and index math like other linear sorts/selection.",
    howItWorks: [
      {
        type: "list",
        items: [
          "Core idea: non-comparison integer sort.",
          "Watch value range k vs n.",
          "Stable variant walks backwards on output.",
          "Use when k small vs n.",
          "Randomized pivot for quickselect.",
        ],
      },
    ],
    example: [
      {
        type: "paragraph",
        text: "Example applies Counting sort on small bounded array.",
      },
    ],
    templates: [
      {
        language: "java",
        caption: "Counting sort",
        code: `int[] countingSort(int[] a, int k) {
    int[] cnt = new int[k + 1];
    for (int v : a) cnt[v]++;
    for (int i = 1; i <= k; i++) cnt[i] += cnt[i - 1];
    int[] out = new int[a.length];
    for (int i = a.length - 1; i >= 0; i--) {
        int v = a[i];
        out[--cnt[v]] = v;
    }
    return out;
}`,
      },
    ],
    tradeoffs: {
      advantages: [
        "Fast on bounded keys",
        "Simple arrays",
      ],
      disadvantages: [
        "Large k space",
        "Not general compare",
      ],
      alternatives: [
        "Sort + index",
        "Heap O(n log k)",
      ],
      whenToUse: [
        "Small integer range",
        "Kth element",
      ],
      whenNotToUse: [
        "Large universe k",
      ],
    },
    failureModes: [
      "Off-by-one in prefix",
      "Unstable naive forward fill",
      "Bad pivot quadratic",
    ],
    interview: {
      expectations: [
        "Counting sort complexity",
        "When use",
      ],
      commonQuestions: [
        "Counting sort vs merge sort?",
      ],
      followUps: [
        "Stable counting?",
      ],
      misconceptions: [
        "Always O(n)",
      ],
      traps: [
        "k huge",
      ],
      strongSignals: [
        "States O(n+k)",
      ],
    },
    keyTakeaways: [
      "Counting sort on bounded range",
      "Mind space O(k)",
      "Stable counting reverse loop",
      "Quickselect partition",
      "Randomized pivot",
    ],
    interviewQuestions: [
      {
        level: "basic",
        question: "Counting sort idea?",
        answerHint: "non-comparison integer sort by frequency array",
      },
      {
        level: "intermediate",
        question: "Complexity?",
        answerHint: "{'average': 'O(n+k)', 'space': 'O(k)'}",
      },
      {
        level: "advanced",
        question: "Worst case?",
        answerHint: "depends",
      },
    ],
    flashcards: [
      {
        front: "Counting sort",
        back: "non-comparison integer sort by frequency array",
      },
      {
        front: "Space",
        back: "O(k)",
      },
    ],
    quickRevision: [
      "Counting sort",
      "Bounded range",
      "Prefix tricks",
      "Stable reverse",
      "Quickselect partition",
      "Avg O(n)",
      "Watch worst case",
    ],
    complexity: {
      average: "O(n+k)",
      space: "O(k)",
    },
  }],

  ['a3-quickselect', {
    whatIsIt: "Quickselect kth smallest via partition like quicksort O(n) average.",
    whyExists: "Interview problems need quickselect for performance or simplicity on bounded domains.",
    mentalModel: "Focus on invariant and index math like other linear sorts/selection.",
    howItWorks: [
      {
        type: "list",
        items: [
          "Core idea: kth smallest via partition like quicksort O(n) average.",
          "Watch value range k vs n.",
          "Stable variant walks backwards on output.",
          "Use when k small vs n.",
          "Randomized pivot for quickselect.",
        ],
      },
    ],
    example: [
      {
        type: "paragraph",
        text: "Example applies Quickselect on small bounded array.",
      },
    ],
    templates: [
      {
        language: "java",
        caption: "Quickselect",
        code: `int quickselect(int[] a, int l, int r, int k) {
    if (l == r) return a[l];
    int p = partition(a, l, r);
    if (k == p) return a[p];
    if (k < p) return quickselect(a, l, p - 1, k);
    return quickselect(a, p + 1, r, k);
}`,
      },
    ],
    tradeoffs: {
      advantages: [
        "Fast on bounded keys",
        "Simple arrays",
      ],
      disadvantages: [
        "Large k space",
        "Not general compare",
      ],
      alternatives: [
        "Sort + index",
        "Heap O(n log k)",
      ],
      whenToUse: [
        "Small integer range",
        "Kth element",
      ],
      whenNotToUse: [
        "Large universe k",
      ],
    },
    failureModes: [
      "Off-by-one in prefix",
      "Unstable naive forward fill",
      "Bad pivot quadratic",
    ],
    interview: {
      expectations: [
        "Quickselect complexity",
        "When use",
      ],
      commonQuestions: [
        "Quickselect vs merge sort?",
      ],
      followUps: [
        "Stable counting?",
      ],
      misconceptions: [
        "Always O(n)",
      ],
      traps: [
        "k huge",
      ],
      strongSignals: [
        "States O(n) average",
      ],
    },
    keyTakeaways: [
      "Quickselect on bounded range",
      "Mind space O(k)",
      "Stable counting reverse loop",
      "Quickselect partition",
      "Randomized pivot",
    ],
    interviewQuestions: [
      {
        level: "basic",
        question: "Quickselect idea?",
        answerHint: "kth smallest via partition like quicksort O(n) average",
      },
      {
        level: "intermediate",
        question: "Complexity?",
        answerHint: "{'average': 'O(n) average', 'worst': 'O(n\u00b2)', 'space': 'O(1) iterative with care'}",
      },
      {
        level: "advanced",
        question: "Worst case?",
        answerHint: "O(n\u00b2)",
      },
    ],
    flashcards: [
      {
        front: "Quickselect",
        back: "kth smallest via partition like quicksort O(n) average",
      },
      {
        front: "Space",
        back: "O(1) iterative with care",
      },
    ],
    quickRevision: [
      "Quickselect",
      "Bounded range",
      "Prefix tricks",
      "Stable reverse",
      "Quickselect partition",
      "Avg O(n)",
      "Watch worst case",
    ],
    complexity: {
      average: "O(n) average",
      worst: "O(n\u00b2)",
      space: "O(1) iterative with care",
    },
  }],

  ['a6-nary-trees', {
    whatIsIt: "N-ary trees: Each node has List<Node> children; BFS/DFS with loop over children; encode to binary via left-child right-sibling.",
    whyExists: "N-ary trees appears in tree interview patterns requiring precise invariants and complexity.",
    mentalModel: "Visualize tree structure and invariant before coding.",
    howItWorks: [
      {
        type: "list",
        items: [
          "Each node has List<Node> children; BFS/DFS with loop over children; encode to binary via left-child right-sibling.",
          "State transition or traversal order clearly defined.",
          "Edge cases: empty, single node, disconnected.",
          "Use Java collections idiomatically.",
          "Name complexity from V,E,n,L as appropriate.",
        ],
      },
    ],
    example: [
      {
        type: "paragraph",
        text: "Walk through tiny N-ary trees example on paper.",
      },
    ],
    templates: [
      {
        language: "java",
        caption: "N-ary trees template",
        code: `class Node { public int val; public List<Node> children; }`,
      },
    ],
    tradeoffs: {
      advantages: [
        "Pattern matches many problems",
        "Clear complexity",
      ],
      disadvantages: [
        "Easy to miss edge case",
        "Off-by-one",
      ],
      alternatives: [
        "Alternative algorithm",
      ],
      whenToUse: [
        "tree problems",
      ],
      whenNotToUse: [
        "When constraints blow complexity",
      ],
    },
    failureModes: [
      "Wrong traversal order",
      "Integer overflow INF",
      "Modifying collection while iterating",
    ],
    interview: {
      expectations: [
        "N-ary trees invariant",
        "Complexity",
      ],
      commonQuestions: [
        "When N-ary trees?",
      ],
      followUps: [
        "Optimize space?",
      ],
      misconceptions: [
        "Confuse with similar pattern",
      ],
      traps: [
        "Forget directed vs undirected",
      ],
      strongSignals: [
        "Explains Each node has List<Node> children; BFS/D",
      ],
    },
    keyTakeaways: [
      "N-ary trees",
      "Each node has List<Node> children",
      "Complexity stated",
      "Edge cases",
      "Java template ready",
    ],
    interviewQuestions: [
      {
        level: "basic",
        question: "N-ary trees idea?",
        answerHint: "Each node has List<Node> children; BFS/DFS with loop over children; encode to binary via left-child right-sibling.",
      },
      {
        level: "intermediate",
        question: "Complexity?",
        answerHint: "{'average': 'O(n) traverse', 'space': 'O(h) stack'}",
      },
      {
        level: "advanced",
        question: "Follow-up optimization?",
        answerHint: "Space roll, iterative, or better algorithm.",
      },
    ],
    flashcards: [
      {
        front: "N-ary trees",
        back: "Each node has List<Node> children; BFS/DFS with loop over children; en",
      },
      {
        front: "Tag",
        back: "tree",
      },
    ],
    quickRevision: [
      "N-ary trees",
      "tree",
      "Template",
      "Edges",
      "Complexity",
      "Interview",
      "Practice",
    ],
    complexity: {
      average: "O(n) traverse",
      space: "O(h) stack",
    },
  }],

  ['a6-tree-views', {
    whatIsIt: "Tree views: Right/left/top/bottom views use BFS level or DFS with depth/order maps; right view = last node per depth.",
    whyExists: "Tree views appears in tree interview patterns requiring precise invariants and complexity.",
    mentalModel: "Visualize tree structure and invariant before coding.",
    howItWorks: [
      {
        type: "list",
        items: [
          "Right/left/top/bottom views use BFS level or DFS with depth/order maps; right view = last node per depth.",
          "State transition or traversal order clearly defined.",
          "Edge cases: empty, single node, disconnected.",
          "Use Java collections idiomatically.",
          "Name complexity from V,E,n,L as appropriate.",
        ],
      },
    ],
    example: [
      {
        type: "paragraph",
        text: "Walk through tiny Tree views example on paper.",
      },
    ],
    templates: [
      {
        language: "java",
        caption: "Tree views template",
        code: `void dfs(Node root, int d, Map<Integer,Integer> right) { if (root==null) return; right.putIfAbsent(d, root.val); dfs(root.right,d+1,right); dfs(root.left,d+1,right); }`,
      },
    ],
    tradeoffs: {
      advantages: [
        "Pattern matches many problems",
        "Clear complexity",
      ],
      disadvantages: [
        "Easy to miss edge case",
        "Off-by-one",
      ],
      alternatives: [
        "Alternative algorithm",
      ],
      whenToUse: [
        "tree problems",
      ],
      whenNotToUse: [
        "When constraints blow complexity",
      ],
    },
    failureModes: [
      "Wrong traversal order",
      "Integer overflow INF",
      "Modifying collection while iterating",
    ],
    interview: {
      expectations: [
        "Tree views invariant",
        "Complexity",
      ],
      commonQuestions: [
        "When Tree views?",
      ],
      followUps: [
        "Optimize space?",
      ],
      misconceptions: [
        "Confuse with similar pattern",
      ],
      traps: [
        "Forget directed vs undirected",
      ],
      strongSignals: [
        "Explains Right/left/top/bottom views use BFS leve",
      ],
    },
    keyTakeaways: [
      "Tree views",
      "Right/left/top/bottom views use BFS level or DFS with depth/order maps",
      "Complexity stated",
      "Edge cases",
      "Java template ready",
    ],
    interviewQuestions: [
      {
        level: "basic",
        question: "Tree views idea?",
        answerHint: "Right/left/top/bottom views use BFS level or DFS with depth/order maps; right view = last node per depth.",
      },
      {
        level: "intermediate",
        question: "Complexity?",
        answerHint: "see pattern",
      },
      {
        level: "advanced",
        question: "Follow-up optimization?",
        answerHint: "Space roll, iterative, or better algorithm.",
      },
    ],
    flashcards: [
      {
        front: "Tree views",
        back: "Right/left/top/bottom views use BFS level or DFS with depth/order maps",
      },
      {
        front: "Tag",
        back: "tree",
      },
    ],
    quickRevision: [
      "Tree views",
      "tree",
      "Template",
      "Edges",
      "Complexity",
      "Interview",
      "Practice",
    ],
    complexity: {
      average: "Problem dependent",
      space: "O(n)",
    },
  }],

  ['a7-two-heap-pattern', {
    whatIsIt: "Two-heap pattern: Max-heap lower half + min-heap upper half maintains median; sizes differ by at most 1.",
    whyExists: "Two-heap pattern appears in heap interview patterns requiring precise invariants and complexity.",
    mentalModel: "Visualize heap structure and invariant before coding.",
    howItWorks: [
      {
        type: "list",
        items: [
          "Max-heap lower half + min-heap upper half maintains median; sizes differ by at most 1.",
          "State transition or traversal order clearly defined.",
          "Edge cases: empty, single node, disconnected.",
          "Use Java collections idiomatically.",
          "Name complexity from V,E,n,L as appropriate.",
        ],
      },
    ],
    example: [
      {
        type: "paragraph",
        text: "Walk through tiny Two-heap pattern example on paper.",
      },
    ],
    templates: [
      {
        language: "java",
        caption: "Two-heap pattern template",
        code: `PriorityQueue<Integer> lo=new PriorityQueue<>((a,b)->b-a), hi=new PriorityQueue<>();`,
      },
    ],
    tradeoffs: {
      advantages: [
        "Pattern matches many problems",
        "Clear complexity",
      ],
      disadvantages: [
        "Easy to miss edge case",
        "Off-by-one",
      ],
      alternatives: [
        "Alternative algorithm",
      ],
      whenToUse: [
        "heap problems",
      ],
      whenNotToUse: [
        "When constraints blow complexity",
      ],
    },
    failureModes: [
      "Wrong traversal order",
      "Integer overflow INF",
      "Modifying collection while iterating",
    ],
    interview: {
      expectations: [
        "Two-heap pattern invariant",
        "Complexity",
      ],
      commonQuestions: [
        "When Two-heap pattern?",
      ],
      followUps: [
        "Optimize space?",
      ],
      misconceptions: [
        "Confuse with similar pattern",
      ],
      traps: [
        "Forget directed vs undirected",
      ],
      strongSignals: [
        "Explains Max-heap lower half + min-heap upper hal",
      ],
    },
    keyTakeaways: [
      "Two-heap pattern",
      "Max-heap lower half + min-heap upper half maintains median",
      "Complexity stated",
      "Edge cases",
      "Java template ready",
    ],
    interviewQuestions: [
      {
        level: "basic",
        question: "Two-heap pattern idea?",
        answerHint: "Max-heap lower half + min-heap upper half maintains median; sizes differ by at most 1.",
      },
      {
        level: "intermediate",
        question: "Complexity?",
        answerHint: "{'average': 'O(log n) per add', 'space': 'O(n)'}",
      },
      {
        level: "advanced",
        question: "Follow-up optimization?",
        answerHint: "Space roll, iterative, or better algorithm.",
      },
    ],
    flashcards: [
      {
        front: "Two-heap pattern",
        back: "Max-heap lower half + min-heap upper half maintains median; sizes diff",
      },
      {
        front: "Tag",
        back: "heap",
      },
    ],
    quickRevision: [
      "Two-heap pattern",
      "heap",
      "Template",
      "Edges",
      "Complexity",
      "Interview",
      "Practice",
    ],
    complexity: {
      average: "O(log n) per add",
      space: "O(n)",
    },
  }],

  ['a8-bellman-ford', {
    whatIsIt: "Bellman-Ford: Relax all edges V-1 times; detects negative cycles; works with negative weights unlike Dijkstra.",
    whyExists: "Bellman-Ford appears in graph interview patterns requiring precise invariants and complexity.",
    mentalModel: "Visualize graph structure and invariant before coding.",
    howItWorks: [
      {
        type: "list",
        items: [
          "Relax all edges V-1 times; detects negative cycles; works with negative weights unlike Dijkstra.",
          "State transition or traversal order clearly defined.",
          "Edge cases: empty, single node, disconnected.",
          "Use Java collections idiomatically.",
          "Name complexity from V,E,n,L as appropriate.",
        ],
      },
    ],
    example: [
      {
        type: "paragraph",
        text: "Walk through tiny Bellman-Ford example on paper.",
      },
    ],
    templates: [
      {
        language: "java",
        caption: "Bellman-Ford template",
        code: `for (int i=0;i<n-1;i++) for (edge: edges) relax;`,
      },
    ],
    tradeoffs: {
      advantages: [
        "Pattern matches many problems",
        "Clear complexity",
      ],
      disadvantages: [
        "Easy to miss edge case",
        "Off-by-one",
      ],
      alternatives: [
        "Alternative algorithm",
      ],
      whenToUse: [
        "graph problems",
      ],
      whenNotToUse: [
        "When constraints blow complexity",
      ],
    },
    failureModes: [
      "Wrong traversal order",
      "Integer overflow INF",
      "Modifying collection while iterating",
    ],
    interview: {
      expectations: [
        "Bellman-Ford invariant",
        "Complexity",
      ],
      commonQuestions: [
        "When Bellman-Ford?",
      ],
      followUps: [
        "Optimize space?",
      ],
      misconceptions: [
        "Confuse with similar pattern",
      ],
      traps: [
        "Forget directed vs undirected",
      ],
      strongSignals: [
        "Explains Relax all edges V-1 times; detects negat",
      ],
    },
    keyTakeaways: [
      "Bellman-Ford",
      "Relax all edges V-1 times",
      "Complexity stated",
      "Edge cases",
      "Java template ready",
    ],
    interviewQuestions: [
      {
        level: "basic",
        question: "Bellman-Ford idea?",
        answerHint: "Relax all edges V-1 times; detects negative cycles; works with negative weights unlike Dijkstra.",
      },
      {
        level: "intermediate",
        question: "Complexity?",
        answerHint: "{'average': 'O(VE)', 'space': 'O(V)'}",
      },
      {
        level: "advanced",
        question: "Follow-up optimization?",
        answerHint: "Space roll, iterative, or better algorithm.",
      },
    ],
    flashcards: [
      {
        front: "Bellman-Ford",
        back: "Relax all edges V-1 times; detects negative cycles; works with negativ",
      },
      {
        front: "Tag",
        back: "graph",
      },
    ],
    quickRevision: [
      "Bellman-Ford",
      "graph",
      "Template",
      "Edges",
      "Complexity",
      "Interview",
      "Practice",
    ],
    complexity: {
      average: "O(VE)",
      space: "O(V)",
    },
  }],

  ['a8-bipartite', {
    whatIsIt: "Bipartite check: 2-color BFS/DFS; no same color on edge; or only even cycles.",
    whyExists: "Bipartite check appears in graph interview patterns requiring precise invariants and complexity.",
    mentalModel: "Visualize graph structure and invariant before coding.",
    howItWorks: [
      {
        type: "list",
        items: [
          "2-color BFS/DFS; no same color on edge; or only even cycles.",
          "State transition or traversal order clearly defined.",
          "Edge cases: empty, single node, disconnected.",
          "Use Java collections idiomatically.",
          "Name complexity from V,E,n,L as appropriate.",
        ],
      },
    ],
    example: [
      {
        type: "paragraph",
        text: "Walk through tiny Bipartite check example on paper.",
      },
    ],
    templates: [
      {
        language: "java",
        caption: "Bipartite check template",
        code: `boolean bfs(int[][] g,int n){int[] c=new int[n]; ...}`,
      },
    ],
    tradeoffs: {
      advantages: [
        "Pattern matches many problems",
        "Clear complexity",
      ],
      disadvantages: [
        "Easy to miss edge case",
        "Off-by-one",
      ],
      alternatives: [
        "Alternative algorithm",
      ],
      whenToUse: [
        "graph problems",
      ],
      whenNotToUse: [
        "When constraints blow complexity",
      ],
    },
    failureModes: [
      "Wrong traversal order",
      "Integer overflow INF",
      "Modifying collection while iterating",
    ],
    interview: {
      expectations: [
        "Bipartite check invariant",
        "Complexity",
      ],
      commonQuestions: [
        "When Bipartite check?",
      ],
      followUps: [
        "Optimize space?",
      ],
      misconceptions: [
        "Confuse with similar pattern",
      ],
      traps: [
        "Forget directed vs undirected",
      ],
      strongSignals: [
        "Explains 2-color BFS/DFS; no same color on edge; ",
      ],
    },
    keyTakeaways: [
      "Bipartite check",
      "2-color BFS/DFS",
      "Complexity stated",
      "Edge cases",
      "Java template ready",
    ],
    interviewQuestions: [
      {
        level: "basic",
        question: "Bipartite check idea?",
        answerHint: "2-color BFS/DFS; no same color on edge; or only even cycles.",
      },
      {
        level: "intermediate",
        question: "Complexity?",
        answerHint: "{'average': 'O(V+E)', 'space': 'O(V)'}",
      },
      {
        level: "advanced",
        question: "Follow-up optimization?",
        answerHint: "Space roll, iterative, or better algorithm.",
      },
    ],
    flashcards: [
      {
        front: "Bipartite check",
        back: "2-color BFS/DFS; no same color on edge; or only even cycles.",
      },
      {
        front: "Tag",
        back: "graph",
      },
    ],
    quickRevision: [
      "Bipartite check",
      "graph",
      "Template",
      "Edges",
      "Complexity",
      "Interview",
      "Practice",
    ],
    complexity: {
      average: "O(V+E)",
      space: "O(V)",
    },
  }],

  ['a8-floyd-warshall', {
    whatIsIt: "Floyd-Warshall: All-pairs shortest paths DP on k,i,j intermediates; O(V\u00b3).",
    whyExists: "Floyd-Warshall appears in graph interview patterns requiring precise invariants and complexity.",
    mentalModel: "Visualize graph structure and invariant before coding.",
    howItWorks: [
      {
        type: "list",
        items: [
          "All-pairs shortest paths DP on k,i,j intermediates; O(V\u00b3).",
          "State transition or traversal order clearly defined.",
          "Edge cases: empty, single node, disconnected.",
          "Use Java collections idiomatically.",
          "Name complexity from V,E,n,L as appropriate.",
        ],
      },
    ],
    example: [
      {
        type: "paragraph",
        text: "Walk through tiny Floyd-Warshall example on paper.",
      },
    ],
    templates: [
      {
        language: "java",
        caption: "Floyd-Warshall template",
        code: `for k for i for j dist[i][j]=min(dist[i][j],dist[i][k]+dist[k][j]);`,
      },
    ],
    tradeoffs: {
      advantages: [
        "Pattern matches many problems",
        "Clear complexity",
      ],
      disadvantages: [
        "Easy to miss edge case",
        "Off-by-one",
      ],
      alternatives: [
        "Alternative algorithm",
      ],
      whenToUse: [
        "graph problems",
      ],
      whenNotToUse: [
        "When constraints blow complexity",
      ],
    },
    failureModes: [
      "Wrong traversal order",
      "Integer overflow INF",
      "Modifying collection while iterating",
    ],
    interview: {
      expectations: [
        "Floyd-Warshall invariant",
        "Complexity",
      ],
      commonQuestions: [
        "When Floyd-Warshall?",
      ],
      followUps: [
        "Optimize space?",
      ],
      misconceptions: [
        "Confuse with similar pattern",
      ],
      traps: [
        "Forget directed vs undirected",
      ],
      strongSignals: [
        "Explains All-pairs shortest paths DP on k,i,j int",
      ],
    },
    keyTakeaways: [
      "Floyd-Warshall",
      "All-pairs shortest paths DP on k,i,j intermediates",
      "Complexity stated",
      "Edge cases",
      "Java template ready",
    ],
    interviewQuestions: [
      {
        level: "basic",
        question: "Floyd-Warshall idea?",
        answerHint: "All-pairs shortest paths DP on k,i,j intermediates; O(V\u00b3).",
      },
      {
        level: "intermediate",
        question: "Complexity?",
        answerHint: "{'average': 'O(V\u00b3)', 'space': 'O(V\u00b2)'}",
      },
      {
        level: "advanced",
        question: "Follow-up optimization?",
        answerHint: "Space roll, iterative, or better algorithm.",
      },
    ],
    flashcards: [
      {
        front: "Floyd-Warshall",
        back: "All-pairs shortest paths DP on k,i,j intermediates; O(V\u00b3).",
      },
      {
        front: "Tag",
        back: "graph",
      },
    ],
    quickRevision: [
      "Floyd-Warshall",
      "graph",
      "Template",
      "Edges",
      "Complexity",
      "Interview",
      "Practice",
    ],
    complexity: {
      average: "O(V\u00b3)",
      space: "O(V\u00b2)",
    },
  }],

  ['a8-mst-kruskal', {
    whatIsIt: "Kruskal MST: Sort edges by weight; union-find add if connects different components.",
    whyExists: "Kruskal MST appears in graph interview patterns requiring precise invariants and complexity.",
    mentalModel: "Visualize graph structure and invariant before coding.",
    howItWorks: [
      {
        type: "list",
        items: [
          "Sort edges by weight; union-find add if connects different components.",
          "State transition or traversal order clearly defined.",
          "Edge cases: empty, single node, disconnected.",
          "Use Java collections idiomatically.",
          "Name complexity from V,E,n,L as appropriate.",
        ],
      },
    ],
    example: [
      {
        type: "paragraph",
        text: "Walk through tiny Kruskal MST example on paper.",
      },
    ],
    templates: [
      {
        language: "java",
        caption: "Kruskal MST template",
        code: `Arrays.sort(edges); UnionFind uf; ...`,
      },
    ],
    tradeoffs: {
      advantages: [
        "Pattern matches many problems",
        "Clear complexity",
      ],
      disadvantages: [
        "Easy to miss edge case",
        "Off-by-one",
      ],
      alternatives: [
        "Alternative algorithm",
      ],
      whenToUse: [
        "graph problems",
      ],
      whenNotToUse: [
        "When constraints blow complexity",
      ],
    },
    failureModes: [
      "Wrong traversal order",
      "Integer overflow INF",
      "Modifying collection while iterating",
    ],
    interview: {
      expectations: [
        "Kruskal MST invariant",
        "Complexity",
      ],
      commonQuestions: [
        "When Kruskal MST?",
      ],
      followUps: [
        "Optimize space?",
      ],
      misconceptions: [
        "Confuse with similar pattern",
      ],
      traps: [
        "Forget directed vs undirected",
      ],
      strongSignals: [
        "Explains Sort edges by weight; union-find add if ",
      ],
    },
    keyTakeaways: [
      "Kruskal MST",
      "Sort edges by weight",
      "Complexity stated",
      "Edge cases",
      "Java template ready",
    ],
    interviewQuestions: [
      {
        level: "basic",
        question: "Kruskal MST idea?",
        answerHint: "Sort edges by weight; union-find add if connects different components.",
      },
      {
        level: "intermediate",
        question: "Complexity?",
        answerHint: "{'average': 'O(E log E)', 'space': 'O(V)'}",
      },
      {
        level: "advanced",
        question: "Follow-up optimization?",
        answerHint: "Space roll, iterative, or better algorithm.",
      },
    ],
    flashcards: [
      {
        front: "Kruskal MST",
        back: "Sort edges by weight; union-find add if connects different components.",
      },
      {
        front: "Tag",
        back: "graph",
      },
    ],
    quickRevision: [
      "Kruskal MST",
      "graph",
      "Template",
      "Edges",
      "Complexity",
      "Interview",
      "Practice",
    ],
    complexity: {
      average: "O(E log E)",
      space: "O(V)",
    },
  }],

  ['a8-mst-prim', {
    whatIsIt: "Prim MST: Grow tree from source; PQ edges by weight like Dijkstra on undirected.",
    whyExists: "Prim MST appears in graph interview patterns requiring precise invariants and complexity.",
    mentalModel: "Visualize graph structure and invariant before coding.",
    howItWorks: [
      {
        type: "list",
        items: [
          "Grow tree from source; PQ edges by weight like Dijkstra on undirected.",
          "State transition or traversal order clearly defined.",
          "Edge cases: empty, single node, disconnected.",
          "Use Java collections idiomatically.",
          "Name complexity from V,E,n,L as appropriate.",
        ],
      },
    ],
    example: [
      {
        type: "paragraph",
        text: "Walk through tiny Prim MST example on paper.",
      },
    ],
    templates: [
      {
        language: "java",
        caption: "Prim MST template",
        code: `PriorityQueue<int[]> pq; ...`,
      },
    ],
    tradeoffs: {
      advantages: [
        "Pattern matches many problems",
        "Clear complexity",
      ],
      disadvantages: [
        "Easy to miss edge case",
        "Off-by-one",
      ],
      alternatives: [
        "Alternative algorithm",
      ],
      whenToUse: [
        "graph problems",
      ],
      whenNotToUse: [
        "When constraints blow complexity",
      ],
    },
    failureModes: [
      "Wrong traversal order",
      "Integer overflow INF",
      "Modifying collection while iterating",
    ],
    interview: {
      expectations: [
        "Prim MST invariant",
        "Complexity",
      ],
      commonQuestions: [
        "When Prim MST?",
      ],
      followUps: [
        "Optimize space?",
      ],
      misconceptions: [
        "Confuse with similar pattern",
      ],
      traps: [
        "Forget directed vs undirected",
      ],
      strongSignals: [
        "Explains Grow tree from source; PQ edges by weigh",
      ],
    },
    keyTakeaways: [
      "Prim MST",
      "Grow tree from source",
      "Complexity stated",
      "Edge cases",
      "Java template ready",
    ],
    interviewQuestions: [
      {
        level: "basic",
        question: "Prim MST idea?",
        answerHint: "Grow tree from source; PQ edges by weight like Dijkstra on undirected.",
      },
      {
        level: "intermediate",
        question: "Complexity?",
        answerHint: "{'average': 'O(E log V)', 'space': 'O(V+E)'}",
      },
      {
        level: "advanced",
        question: "Follow-up optimization?",
        answerHint: "Space roll, iterative, or better algorithm.",
      },
    ],
    flashcards: [
      {
        front: "Prim MST",
        back: "Grow tree from source; PQ edges by weight like Dijkstra on undirected.",
      },
      {
        front: "Tag",
        back: "graph",
      },
    ],
    quickRevision: [
      "Prim MST",
      "graph",
      "Template",
      "Edges",
      "Complexity",
      "Interview",
      "Practice",
    ],
    complexity: {
      average: "O(E log V)",
      space: "O(V+E)",
    },
  }],

  ['a8-scc', {
    whatIsIt: "Strongly connected components: Kosaraju or Tarjan; SCCs in directed graph.",
    whyExists: "Strongly connected components appears in graph interview patterns requiring precise invariants and complexity.",
    mentalModel: "Visualize graph structure and invariant before coding.",
    howItWorks: [
      {
        type: "list",
        items: [
          "Kosaraju or Tarjan; SCCs in directed graph.",
          "State transition or traversal order clearly defined.",
          "Edge cases: empty, single node, disconnected.",
          "Use Java collections idiomatically.",
          "Name complexity from V,E,n,L as appropriate.",
        ],
      },
    ],
    example: [
      {
        type: "paragraph",
        text: "Walk through tiny Strongly connected components example on paper.",
      },
    ],
    templates: [
      {
        language: "java",
        caption: "Strongly connected components template",
        code: `Tarjan low-link DFS stack.`,
      },
    ],
    tradeoffs: {
      advantages: [
        "Pattern matches many problems",
        "Clear complexity",
      ],
      disadvantages: [
        "Easy to miss edge case",
        "Off-by-one",
      ],
      alternatives: [
        "Alternative algorithm",
      ],
      whenToUse: [
        "graph problems",
      ],
      whenNotToUse: [
        "When constraints blow complexity",
      ],
    },
    failureModes: [
      "Wrong traversal order",
      "Integer overflow INF",
      "Modifying collection while iterating",
    ],
    interview: {
      expectations: [
        "Strongly connected components invariant",
        "Complexity",
      ],
      commonQuestions: [
        "When Strongly connected components?",
      ],
      followUps: [
        "Optimize space?",
      ],
      misconceptions: [
        "Confuse with similar pattern",
      ],
      traps: [
        "Forget directed vs undirected",
      ],
      strongSignals: [
        "Explains Kosaraju or Tarjan; SCCs in directed gra",
      ],
    },
    keyTakeaways: [
      "Strongly connected components",
      "Kosaraju or Tarjan",
      "Complexity stated",
      "Edge cases",
      "Java template ready",
    ],
    interviewQuestions: [
      {
        level: "basic",
        question: "Strongly connected components idea?",
        answerHint: "Kosaraju or Tarjan; SCCs in directed graph.",
      },
      {
        level: "intermediate",
        question: "Complexity?",
        answerHint: "{'average': 'O(V+E)', 'space': 'O(V)'}",
      },
      {
        level: "advanced",
        question: "Follow-up optimization?",
        answerHint: "Space roll, iterative, or better algorithm.",
      },
    ],
    flashcards: [
      {
        front: "Strongly connected components",
        back: "Kosaraju or Tarjan; SCCs in directed graph.",
      },
      {
        front: "Tag",
        back: "graph",
      },
    ],
    quickRevision: [
      "Strongly connected components",
      "graph",
      "Template",
      "Edges",
      "Complexity",
      "Interview",
      "Practice",
    ],
    complexity: {
      average: "O(V+E)",
      space: "O(V)",
    },
  }],

  ['a11-state-machine-dp', {
    whatIsIt: "State-machine DP: DP[state][i] transitions on input char; regex/parsing/stock with cooldown states.",
    whyExists: "State-machine DP appears in dp interview patterns requiring precise invariants and complexity.",
    mentalModel: "Visualize dp structure and invariant before coding.",
    howItWorks: [
      {
        type: "list",
        items: [
          "DP[state][i] transitions on input char; regex/parsing/stock with cooldown states.",
          "State transition or traversal order clearly defined.",
          "Edge cases: empty, single node, disconnected.",
          "Use Java collections idiomatically.",
          "Name complexity from V,E,n,L as appropriate.",
        ],
      },
    ],
    example: [
      {
        type: "paragraph",
        text: "Walk through tiny State-machine DP example on paper.",
      },
    ],
    templates: [
      {
        language: "java",
        caption: "State-machine DP template",
        code: `int[][] dp = new int[n][states];`,
      },
    ],
    tradeoffs: {
      advantages: [
        "Pattern matches many problems",
        "Clear complexity",
      ],
      disadvantages: [
        "Easy to miss edge case",
        "Off-by-one",
      ],
      alternatives: [
        "Alternative algorithm",
      ],
      whenToUse: [
        "dp problems",
      ],
      whenNotToUse: [
        "When constraints blow complexity",
      ],
    },
    failureModes: [
      "Wrong traversal order",
      "Integer overflow INF",
      "Modifying collection while iterating",
    ],
    interview: {
      expectations: [
        "State-machine DP invariant",
        "Complexity",
      ],
      commonQuestions: [
        "When State-machine DP?",
      ],
      followUps: [
        "Optimize space?",
      ],
      misconceptions: [
        "Confuse with similar pattern",
      ],
      traps: [
        "Forget directed vs undirected",
      ],
      strongSignals: [
        "Explains DP[state][i] transitions on input char; ",
      ],
    },
    keyTakeaways: [
      "State-machine DP",
      "DP[state][i] transitions on input char",
      "Complexity stated",
      "Edge cases",
      "Java template ready",
    ],
    interviewQuestions: [
      {
        level: "basic",
        question: "State-machine DP idea?",
        answerHint: "DP[state][i] transitions on input char; regex/parsing/stock with cooldown states.",
      },
      {
        level: "intermediate",
        question: "Complexity?",
        answerHint: "{'average': 'O(n*states)', 'space': 'O(states)'}",
      },
      {
        level: "advanced",
        question: "Follow-up optimization?",
        answerHint: "Space roll, iterative, or better algorithm.",
      },
    ],
    flashcards: [
      {
        front: "State-machine DP",
        back: "DP[state][i] transitions on input char; regex/parsing/stock with coold",
      },
      {
        front: "Tag",
        back: "dp",
      },
    ],
    quickRevision: [
      "State-machine DP",
      "dp",
      "Template",
      "Edges",
      "Complexity",
      "Interview",
      "Practice",
    ],
    complexity: {
      average: "O(n*states)",
      space: "O(states)",
    },
  }],

  ['a11-tree-dp', {
    whatIsIt: "Tree DP: Post-order compute best including/excluding node; house robber III, diameter.",
    whyExists: "Tree DP appears in dp interview patterns requiring precise invariants and complexity.",
    mentalModel: "Visualize dp structure and invariant before coding.",
    howItWorks: [
      {
        type: "list",
        items: [
          "Post-order compute best including/excluding node; house robber III, diameter.",
          "State transition or traversal order clearly defined.",
          "Edge cases: empty, single node, disconnected.",
          "Use Java collections idiomatically.",
          "Name complexity from V,E,n,L as appropriate.",
        ],
      },
    ],
    example: [
      {
        type: "paragraph",
        text: "Walk through tiny Tree DP example on paper.",
      },
    ],
    templates: [
      {
        language: "java",
        caption: "Tree DP template",
        code: `int[] dfs(Node u){ int inc=u.val, exc=0; for child...}`,
      },
    ],
    tradeoffs: {
      advantages: [
        "Pattern matches many problems",
        "Clear complexity",
      ],
      disadvantages: [
        "Easy to miss edge case",
        "Off-by-one",
      ],
      alternatives: [
        "Alternative algorithm",
      ],
      whenToUse: [
        "dp problems",
      ],
      whenNotToUse: [
        "When constraints blow complexity",
      ],
    },
    failureModes: [
      "Wrong traversal order",
      "Integer overflow INF",
      "Modifying collection while iterating",
    ],
    interview: {
      expectations: [
        "Tree DP invariant",
        "Complexity",
      ],
      commonQuestions: [
        "When Tree DP?",
      ],
      followUps: [
        "Optimize space?",
      ],
      misconceptions: [
        "Confuse with similar pattern",
      ],
      traps: [
        "Forget directed vs undirected",
      ],
      strongSignals: [
        "Explains Post-order compute best including/exclud",
      ],
    },
    keyTakeaways: [
      "Tree DP",
      "Post-order compute best including/excluding node",
      "Complexity stated",
      "Edge cases",
      "Java template ready",
    ],
    interviewQuestions: [
      {
        level: "basic",
        question: "Tree DP idea?",
        answerHint: "Post-order compute best including/excluding node; house robber III, diameter.",
      },
      {
        level: "intermediate",
        question: "Complexity?",
        answerHint: "{'average': 'O(n)', 'space': 'O(h)'}",
      },
      {
        level: "advanced",
        question: "Follow-up optimization?",
        answerHint: "Space roll, iterative, or better algorithm.",
      },
    ],
    flashcards: [
      {
        front: "Tree DP",
        back: "Post-order compute best including/excluding node; house robber III, di",
      },
      {
        front: "Tag",
        back: "dp",
      },
    ],
    quickRevision: [
      "Tree DP",
      "dp",
      "Template",
      "Edges",
      "Complexity",
      "Interview",
      "Practice",
    ],
    complexity: {
      average: "O(n)",
      space: "O(h)",
    },
  }],

  ['a12-prefix-matching', {
    whatIsIt: "Prefix matching: Trie or KMP for prefix queries; autocomplete startsWith.",
    whyExists: "Prefix matching appears in trie interview patterns requiring precise invariants and complexity.",
    mentalModel: "Visualize trie structure and invariant before coding.",
    howItWorks: [
      {
        type: "list",
        items: [
          "Trie or KMP for prefix queries; autocomplete startsWith.",
          "State transition or traversal order clearly defined.",
          "Edge cases: empty, single node, disconnected.",
          "Use Java collections idiomatically.",
          "Name complexity from V,E,n,L as appropriate.",
        ],
      },
    ],
    example: [
      {
        type: "paragraph",
        text: "Walk through tiny Prefix matching example on paper.",
      },
    ],
    templates: [
      {
        language: "java",
        caption: "Prefix matching template",
        code: `class TrieNode { Map<Character,TrieNode> next; }`,
      },
    ],
    tradeoffs: {
      advantages: [
        "Pattern matches many problems",
        "Clear complexity",
      ],
      disadvantages: [
        "Easy to miss edge case",
        "Off-by-one",
      ],
      alternatives: [
        "Alternative algorithm",
      ],
      whenToUse: [
        "trie problems",
      ],
      whenNotToUse: [
        "When constraints blow complexity",
      ],
    },
    failureModes: [
      "Wrong traversal order",
      "Integer overflow INF",
      "Modifying collection while iterating",
    ],
    interview: {
      expectations: [
        "Prefix matching invariant",
        "Complexity",
      ],
      commonQuestions: [
        "When Prefix matching?",
      ],
      followUps: [
        "Optimize space?",
      ],
      misconceptions: [
        "Confuse with similar pattern",
      ],
      traps: [
        "Forget directed vs undirected",
      ],
      strongSignals: [
        "Explains Trie or KMP for prefix queries; autocomp",
      ],
    },
    keyTakeaways: [
      "Prefix matching",
      "Trie or KMP for prefix queries",
      "Complexity stated",
      "Edge cases",
      "Java template ready",
    ],
    interviewQuestions: [
      {
        level: "basic",
        question: "Prefix matching idea?",
        answerHint: "Trie or KMP for prefix queries; autocomplete startsWith.",
      },
      {
        level: "intermediate",
        question: "Complexity?",
        answerHint: "{'average': 'O(L)', 'space': 'O(total chars)'}",
      },
      {
        level: "advanced",
        question: "Follow-up optimization?",
        answerHint: "Space roll, iterative, or better algorithm.",
      },
    ],
    flashcards: [
      {
        front: "Prefix matching",
        back: "Trie or KMP for prefix queries; autocomplete startsWith.",
      },
      {
        front: "Tag",
        back: "trie",
      },
    ],
    quickRevision: [
      "Prefix matching",
      "trie",
      "Template",
      "Edges",
      "Complexity",
      "Interview",
      "Practice",
    ],
    complexity: {
      average: "O(L)",
      space: "O(total chars)",
    },
  }],

  ['a12-segment-trees', {
    whatIsIt: "Segment trees: Binary tree over intervals; point/range update and query O(log n).",
    whyExists: "Segment trees appears in range interview patterns requiring precise invariants and complexity.",
    mentalModel: "Visualize range structure and invariant before coding.",
    howItWorks: [
      {
        type: "list",
        items: [
          "Binary tree over intervals; point/range update and query O(log n).",
          "State transition or traversal order clearly defined.",
          "Edge cases: empty, single node, disconnected.",
          "Use Java collections idiomatically.",
          "Name complexity from V,E,n,L as appropriate.",
        ],
      },
    ],
    example: [
      {
        type: "paragraph",
        text: "Walk through tiny Segment trees example on paper.",
      },
    ],
    templates: [
      {
        language: "java",
        caption: "Segment trees template",
        code: `build(0,n-1); update(node,l,r,idx,val); query(node,l,r,ql,qr);`,
      },
    ],
    tradeoffs: {
      advantages: [
        "Pattern matches many problems",
        "Clear complexity",
      ],
      disadvantages: [
        "Easy to miss edge case",
        "Off-by-one",
      ],
      alternatives: [
        "Alternative algorithm",
      ],
      whenToUse: [
        "range problems",
      ],
      whenNotToUse: [
        "When constraints blow complexity",
      ],
    },
    failureModes: [
      "Wrong traversal order",
      "Integer overflow INF",
      "Modifying collection while iterating",
    ],
    interview: {
      expectations: [
        "Segment trees invariant",
        "Complexity",
      ],
      commonQuestions: [
        "When Segment trees?",
      ],
      followUps: [
        "Optimize space?",
      ],
      misconceptions: [
        "Confuse with similar pattern",
      ],
      traps: [
        "Forget directed vs undirected",
      ],
      strongSignals: [
        "Explains Binary tree over intervals; point/range ",
      ],
    },
    keyTakeaways: [
      "Segment trees",
      "Binary tree over intervals",
      "Complexity stated",
      "Edge cases",
      "Java template ready",
    ],
    interviewQuestions: [
      {
        level: "basic",
        question: "Segment trees idea?",
        answerHint: "Binary tree over intervals; point/range update and query O(log n).",
      },
      {
        level: "intermediate",
        question: "Complexity?",
        answerHint: "{'average': 'O(log n) query/update', 'space': 'O(n)'}",
      },
      {
        level: "advanced",
        question: "Follow-up optimization?",
        answerHint: "Space roll, iterative, or better algorithm.",
      },
    ],
    flashcards: [
      {
        front: "Segment trees",
        back: "Binary tree over intervals; point/range update and query O(log n).",
      },
      {
        front: "Tag",
        back: "range",
      },
    ],
    quickRevision: [
      "Segment trees",
      "range",
      "Template",
      "Edges",
      "Complexity",
      "Interview",
      "Practice",
    ],
    complexity: {
      average: "O(log n) query/update",
      space: "O(n)",
    },
  }],

  ['a12-trie', {
    whatIsIt: "Trie: Prefix tree for insert/search/startsWith O(L).",
    whyExists: "Trie appears in string interview patterns requiring precise invariants and complexity.",
    mentalModel: "Visualize string structure and invariant before coding.",
    howItWorks: [
      {
        type: "list",
        items: [
          "Prefix tree for insert/search/startsWith O(L).",
          "State transition or traversal order clearly defined.",
          "Edge cases: empty, single node, disconnected.",
          "Use Java collections idiomatically.",
          "Name complexity from V,E,n,L as appropriate.",
        ],
      },
    ],
    example: [
      {
        type: "paragraph",
        text: "Walk through tiny Trie example on paper.",
      },
    ],
    templates: [
      {
        language: "java",
        caption: "Trie template",
        code: `TrieNode[] children = new TrieNode[26];`,
      },
    ],
    tradeoffs: {
      advantages: [
        "Pattern matches many problems",
        "Clear complexity",
      ],
      disadvantages: [
        "Easy to miss edge case",
        "Off-by-one",
      ],
      alternatives: [
        "Alternative algorithm",
      ],
      whenToUse: [
        "string problems",
      ],
      whenNotToUse: [
        "When constraints blow complexity",
      ],
    },
    failureModes: [
      "Wrong traversal order",
      "Integer overflow INF",
      "Modifying collection while iterating",
    ],
    interview: {
      expectations: [
        "Trie invariant",
        "Complexity",
      ],
      commonQuestions: [
        "When Trie?",
      ],
      followUps: [
        "Optimize space?",
      ],
      misconceptions: [
        "Confuse with similar pattern",
      ],
      traps: [
        "Forget directed vs undirected",
      ],
      strongSignals: [
        "Explains Prefix tree for insert/search/startsWith",
      ],
    },
    keyTakeaways: [
      "Trie",
      "Prefix tree for insert/search/startsWith O(L).",
      "Complexity stated",
      "Edge cases",
      "Java template ready",
    ],
    interviewQuestions: [
      {
        level: "basic",
        question: "Trie idea?",
        answerHint: "Prefix tree for insert/search/startsWith O(L).",
      },
      {
        level: "intermediate",
        question: "Complexity?",
        answerHint: "{'average': 'O(L)', 'space': 'O(total L)'}",
      },
      {
        level: "advanced",
        question: "Follow-up optimization?",
        answerHint: "Space roll, iterative, or better algorithm.",
      },
    ],
    flashcards: [
      {
        front: "Trie",
        back: "Prefix tree for insert/search/startsWith O(L).",
      },
      {
        front: "Tag",
        back: "string",
      },
    ],
    quickRevision: [
      "Trie",
      "string",
      "Template",
      "Edges",
      "Complexity",
      "Interview",
      "Practice",
    ],
    complexity: {
      average: "O(L)",
      space: "O(total L)",
    },
  }],

  ['a13-bitmasking', {
    whatIsIt: "Bitmask DP: Encode subset as int mask; iterate submasks; TSP small n.",
    whyExists: "Bitmask DP appears in bits interview patterns requiring precise invariants and complexity.",
    mentalModel: "Visualize bits structure and invariant before coding.",
    howItWorks: [
      {
        type: "list",
        items: [
          "Encode subset as int mask; iterate submasks; TSP small n.",
          "State transition or traversal order clearly defined.",
          "Edge cases: empty, single node, disconnected.",
          "Use Java collections idiomatically.",
          "Name complexity from V,E,n,L as appropriate.",
        ],
      },
    ],
    example: [
      {
        type: "paragraph",
        text: "Walk through tiny Bitmask DP example on paper.",
      },
    ],
    templates: [
      {
        language: "java",
        caption: "Bitmask DP template",
        code: `for (int mask=0; mask<(1<<n); mask++)`,
      },
    ],
    tradeoffs: {
      advantages: [
        "Pattern matches many problems",
        "Clear complexity",
      ],
      disadvantages: [
        "Easy to miss edge case",
        "Off-by-one",
      ],
      alternatives: [
        "Alternative algorithm",
      ],
      whenToUse: [
        "bits problems",
      ],
      whenNotToUse: [
        "When constraints blow complexity",
      ],
    },
    failureModes: [
      "Wrong traversal order",
      "Integer overflow INF",
      "Modifying collection while iterating",
    ],
    interview: {
      expectations: [
        "Bitmask DP invariant",
        "Complexity",
      ],
      commonQuestions: [
        "When Bitmask DP?",
      ],
      followUps: [
        "Optimize space?",
      ],
      misconceptions: [
        "Confuse with similar pattern",
      ],
      traps: [
        "Forget directed vs undirected",
      ],
      strongSignals: [
        "Explains Encode subset as int mask; iterate subma",
      ],
    },
    keyTakeaways: [
      "Bitmask DP",
      "Encode subset as int mask",
      "Complexity stated",
      "Edge cases",
      "Java template ready",
    ],
    interviewQuestions: [
      {
        level: "basic",
        question: "Bitmask DP idea?",
        answerHint: "Encode subset as int mask; iterate submasks; TSP small n.",
      },
      {
        level: "intermediate",
        question: "Complexity?",
        answerHint: "{'average': 'O(n\u00b72^n)', 'space': 'O(2^n)'}",
      },
      {
        level: "advanced",
        question: "Follow-up optimization?",
        answerHint: "Space roll, iterative, or better algorithm.",
      },
    ],
    flashcards: [
      {
        front: "Bitmask DP",
        back: "Encode subset as int mask; iterate submasks; TSP small n.",
      },
      {
        front: "Tag",
        back: "bits",
      },
    ],
    quickRevision: [
      "Bitmask DP",
      "bits",
      "Template",
      "Edges",
      "Complexity",
      "Interview",
      "Practice",
    ],
    complexity: {
      average: "O(n\u00b72^n)",
      space: "O(2^n)",
    },
  }],

  ['a13-xor-tricks', {
    whatIsIt: "XOR tricks: x^x=0, pairs, missing number, swap without temp at index level.",
    whyExists: "XOR tricks appears in bits interview patterns requiring precise invariants and complexity.",
    mentalModel: "Visualize bits structure and invariant before coding.",
    howItWorks: [
      {
        type: "list",
        items: [
          "x^x=0, pairs, missing number, swap without temp at index level.",
          "State transition or traversal order clearly defined.",
          "Edge cases: empty, single node, disconnected.",
          "Use Java collections idiomatically.",
          "Name complexity from V,E,n,L as appropriate.",
        ],
      },
    ],
    example: [
      {
        type: "paragraph",
        text: "Walk through tiny XOR tricks example on paper.",
      },
    ],
    templates: [
      {
        language: "java",
        caption: "XOR tricks template",
        code: `int xor=0; for (int x:a) xor^=x;`,
      },
    ],
    tradeoffs: {
      advantages: [
        "Pattern matches many problems",
        "Clear complexity",
      ],
      disadvantages: [
        "Easy to miss edge case",
        "Off-by-one",
      ],
      alternatives: [
        "Alternative algorithm",
      ],
      whenToUse: [
        "bits problems",
      ],
      whenNotToUse: [
        "When constraints blow complexity",
      ],
    },
    failureModes: [
      "Wrong traversal order",
      "Integer overflow INF",
      "Modifying collection while iterating",
    ],
    interview: {
      expectations: [
        "XOR tricks invariant",
        "Complexity",
      ],
      commonQuestions: [
        "When XOR tricks?",
      ],
      followUps: [
        "Optimize space?",
      ],
      misconceptions: [
        "Confuse with similar pattern",
      ],
      traps: [
        "Forget directed vs undirected",
      ],
      strongSignals: [
        "Explains x^x=0, pairs, missing number, swap witho",
      ],
    },
    keyTakeaways: [
      "XOR tricks",
      "x^x=0, pairs, missing number, swap without temp at index level.",
      "Complexity stated",
      "Edge cases",
      "Java template ready",
    ],
    interviewQuestions: [
      {
        level: "basic",
        question: "XOR tricks idea?",
        answerHint: "x^x=0, pairs, missing number, swap without temp at index level.",
      },
      {
        level: "intermediate",
        question: "Complexity?",
        answerHint: "{'average': 'O(n)', 'space': 'O(1)'}",
      },
      {
        level: "advanced",
        question: "Follow-up optimization?",
        answerHint: "Space roll, iterative, or better algorithm.",
      },
    ],
    flashcards: [
      {
        front: "XOR tricks",
        back: "x^x=0, pairs, missing number, swap without temp at index level.",
      },
      {
        front: "Tag",
        back: "bits",
      },
    ],
    quickRevision: [
      "XOR tricks",
      "bits",
      "Template",
      "Edges",
      "Complexity",
      "Interview",
      "Practice",
    ],
    complexity: {
      average: "O(n)",
      space: "O(1)",
    },
  }],

  ['c1-method-references', {
    whatIsIt: "Method references: ClassName::staticMethod, instance::method, Type::new\u2014shorthand for lambdas when signature matches functional interface.",
    whyExists: "Production Java services need method references knowledge for debugging and design interviews.",
    mentalModel: "Think ops + language/runtime interaction for Method references.",
    howItWorks: [
      {
        type: "list",
        items: [
          "ClassName::staticMethod, instance::method, Type::new\u2014shorthand for lambdas when signature matches functional interface.",
          "Know flags/tools not just API.",
          "Link to observability metrics.",
          "Security and classloader boundaries where relevant.",
          "Contrast old vs new (HTTP1 vs 2 vs 3).",
        ],
      },
    ],
    example: [
      {
        type: "paragraph",
        text: "On-call scenario using Method references.",
      },
    ],
    templates: [
      {
        language: "java",
        caption: "Method references example",
        code: `list.sort(String::compareToIgnoreCase);`,
      },
    ],
    tradeoffs: {
      advantages: [
        "Industry standard",
        "Deep signals in senior interviews",
      ],
      disadvantages: [
        "Version/tooling churn",
        "Misconfiguration cost",
      ],
      alternatives: [
        "Alternative stack",
      ],
      whenToUse: [
        "Java backend roles",
      ],
      whenNotToUse: [
        "When simpler protocol enough",
      ],
    },
    failureModes: [
      "Wrong tool flag",
      "Misreading dump",
      "Pinning carriers with synchronized in virtual threads",
    ],
    interview: {
      expectations: [
        "Method references mechanics",
        "Prod tooling",
      ],
      commonQuestions: [
        "Explain Method references?",
      ],
      followUps: [
        "Tuning follow-ups?",
      ],
      misconceptions: [
        "Confuse terms",
      ],
      traps: [
        "Unsafe in prod without capture plan",
      ],
      strongSignals: [
        "Names real tools for Method references",
      ],
    },
    keyTakeaways: [
      "Method references",
      "ClassName::staticMethod, instance::method, Type::new\u2014shorthand for lambdas when signature matches functional interface.",
      "Know CLI flags",
      "Prod observability",
      "Pitfalls listed",
    ],
    interviewQuestions: [
      {
        level: "basic",
        question: "What is Method references?",
        answerHint: "ClassName::staticMethod, instance::method, Type::new\u2014shorthand for lambdas when signature matches functional interface.",
      },
      {
        level: "intermediate",
        question: "Prod use?",
        answerHint: "See ['performance', 'readability']",
      },
      {
        level: "advanced",
        question: "Failure mode?",
        answerHint: "Misconfig, leak, deadlock, or protocol fallback.",
      },
    ],
    flashcards: [
      {
        front: "Method references",
        back: "ClassName::staticMethod, instance::method, Type::new\u2014shorthand for lam",
      },
      {
        front: "Tools",
        back: "list.sort(String::compareToIgnoreCase);",
      },
    ],
    quickRevision: [
      "Method references",
      "Tools/flags",
      "Prod notes",
      "Pitfalls",
      "Interview",
      "Contrast prior gen",
      "Observability",
    ],
    production: {
      performance: [
        "Method references: production concern on performance",
      ],
      readability: [
        "Method references: production concern on readability",
      ],
      maintainability: [
        "Document Method references usage in runbooks",
      ],
    },
  }],

  ['c2-class-loading', {
    whatIsIt: "Class loading: Loaders hierarchy bootstrap\u2192platform\u2192app; load/link/initialize; parent delegation.",
    whyExists: "Production Java services need class loading knowledge for debugging and design interviews.",
    mentalModel: "Think ops + language/runtime interaction for Class loading.",
    howItWorks: [
      {
        type: "list",
        items: [
          "Loaders hierarchy bootstrap\u2192platform\u2192app; load/link/initialize; parent delegation.",
          "Know flags/tools not just API.",
          "Link to observability metrics.",
          "Security and classloader boundaries where relevant.",
          "Contrast old vs new (HTTP1 vs 2 vs 3).",
        ],
      },
    ],
    example: [
      {
        type: "paragraph",
        text: "On-call scenario using Class loading.",
      },
    ],
    templates: [
      {
        language: "java",
        caption: "Class loading example",
        code: `Class.forName("com.app.Service");`,
      },
    ],
    tradeoffs: {
      advantages: [
        "Industry standard",
        "Deep signals in senior interviews",
      ],
      disadvantages: [
        "Version/tooling churn",
        "Misconfiguration cost",
      ],
      alternatives: [
        "Alternative stack",
      ],
      whenToUse: [
        "Java backend roles",
      ],
      whenNotToUse: [
        "When simpler protocol enough",
      ],
    },
    failureModes: [
      "Wrong tool flag",
      "Misreading dump",
      "Pinning carriers with synchronized in virtual threads",
    ],
    interview: {
      expectations: [
        "Class loading mechanics",
        "Prod tooling",
      ],
      commonQuestions: [
        "Explain Class loading?",
      ],
      followUps: [
        "Tuning follow-ups?",
      ],
      misconceptions: [
        "Confuse terms",
      ],
      traps: [
        "Unsafe in prod without capture plan",
      ],
      strongSignals: [
        "Names real tools for Class loading",
      ],
    },
    keyTakeaways: [
      "Class loading",
      "Loaders hierarchy bootstrap\u2192platform\u2192app",
      "Know CLI flags",
      "Prod observability",
      "Pitfalls listed",
    ],
    interviewQuestions: [
      {
        level: "basic",
        question: "What is Class loading?",
        answerHint: "Loaders hierarchy bootstrap\u2192platform\u2192app; load/link/initialize; parent delegation.",
      },
      {
        level: "intermediate",
        question: "Prod use?",
        answerHint: "See ['reliability', 'security']",
      },
      {
        level: "advanced",
        question: "Failure mode?",
        answerHint: "Misconfig, leak, deadlock, or protocol fallback.",
      },
    ],
    flashcards: [
      {
        front: "Class loading",
        back: "Loaders hierarchy bootstrap\u2192platform\u2192app; load/link/initialize; parent",
      },
      {
        front: "Tools",
        back: "Class.forName(\"com.app.Service\");",
      },
    ],
    quickRevision: [
      "Class loading",
      "Tools/flags",
      "Prod notes",
      "Pitfalls",
      "Interview",
      "Contrast prior gen",
      "Observability",
    ],
    production: {
      reliability: [
        "Class loading: production concern on reliability",
      ],
      security: [
        "Class loading: production concern on security",
      ],
      maintainability: [
        "Document Class loading usage in runbooks",
      ],
    },
  }],

  ['c2-heap-dumps', {
    whatIsIt: "Heap dumps: jmap -dump:format=b,file=heap.hprof PID; analyze dominators, leaks in MAT.",
    whyExists: "Production Java services need heap dumps knowledge for debugging and design interviews.",
    mentalModel: "Think ops + language/runtime interaction for Heap dumps.",
    howItWorks: [
      {
        type: "list",
        items: [
          "jmap -dump:format=b,file=heap.hprof PID; analyze dominators, leaks in MAT.",
          "Know flags/tools not just API.",
          "Link to observability metrics.",
          "Security and classloader boundaries where relevant.",
          "Contrast old vs new (HTTP1 vs 2 vs 3).",
        ],
      },
    ],
    example: [
      {
        type: "paragraph",
        text: "On-call scenario using Heap dumps.",
      },
    ],
    templates: [
      {
        language: "java",
        caption: "Heap dumps example",
        code: `jcmd <pid> GC.heap_dump heap.hprof`,
      },
    ],
    tradeoffs: {
      advantages: [
        "Industry standard",
        "Deep signals in senior interviews",
      ],
      disadvantages: [
        "Version/tooling churn",
        "Misconfiguration cost",
      ],
      alternatives: [
        "Alternative stack",
      ],
      whenToUse: [
        "Java backend roles",
      ],
      whenNotToUse: [
        "When simpler protocol enough",
      ],
    },
    failureModes: [
      "Wrong tool flag",
      "Misreading dump",
      "Pinning carriers with synchronized in virtual threads",
    ],
    interview: {
      expectations: [
        "Heap dumps mechanics",
        "Prod tooling",
      ],
      commonQuestions: [
        "Explain Heap dumps?",
      ],
      followUps: [
        "Tuning follow-ups?",
      ],
      misconceptions: [
        "Confuse terms",
      ],
      traps: [
        "Unsafe in prod without capture plan",
      ],
      strongSignals: [
        "Names real tools for Heap dumps",
      ],
    },
    keyTakeaways: [
      "Heap dumps",
      "jmap -dump:format=b,file=heap.hprof PID",
      "Know CLI flags",
      "Prod observability",
      "Pitfalls listed",
    ],
    interviewQuestions: [
      {
        level: "basic",
        question: "What is Heap dumps?",
        answerHint: "jmap -dump:format=b,file=heap.hprof PID; analyze dominators, leaks in MAT.",
      },
      {
        level: "intermediate",
        question: "Prod use?",
        answerHint: "See ['observability', 'reliability']",
      },
      {
        level: "advanced",
        question: "Failure mode?",
        answerHint: "Misconfig, leak, deadlock, or protocol fallback.",
      },
    ],
    flashcards: [
      {
        front: "Heap dumps",
        back: "jmap -dump:format=b,file=heap.hprof PID; analyze dominators, leaks in ",
      },
      {
        front: "Tools",
        back: "jcmd <pid> GC.heap_dump heap.hprof",
      },
    ],
    quickRevision: [
      "Heap dumps",
      "Tools/flags",
      "Prod notes",
      "Pitfalls",
      "Interview",
      "Contrast prior gen",
      "Observability",
    ],
    production: {
      observability: [
        "Heap dumps: production concern on observability",
      ],
      reliability: [
        "Heap dumps: production concern on reliability",
      ],
      maintainability: [
        "Document Heap dumps usage in runbooks",
      ],
    },
  }],

  ['c2-jit', {
    whatIsIt: "JIT compilation: C1/C2 tiers; hot methods compiled; OSR; deoptimization on invalid assumptions.",
    whyExists: "Production Java services need jit compilation knowledge for debugging and design interviews.",
    mentalModel: "Think ops + language/runtime interaction for JIT compilation.",
    howItWorks: [
      {
        type: "list",
        items: [
          "C1/C2 tiers; hot methods compiled; OSR; deoptimization on invalid assumptions.",
          "Know flags/tools not just API.",
          "Link to observability metrics.",
          "Security and classloader boundaries where relevant.",
          "Contrast old vs new (HTTP1 vs 2 vs 3).",
        ],
      },
    ],
    example: [
      {
        type: "paragraph",
        text: "On-call scenario using JIT compilation.",
      },
    ],
    templates: [
      {
        language: "java",
        caption: "JIT compilation example",
        code: `-XX:+PrintCompilation`,
      },
    ],
    tradeoffs: {
      advantages: [
        "Industry standard",
        "Deep signals in senior interviews",
      ],
      disadvantages: [
        "Version/tooling churn",
        "Misconfiguration cost",
      ],
      alternatives: [
        "Alternative stack",
      ],
      whenToUse: [
        "Java backend roles",
      ],
      whenNotToUse: [
        "When simpler protocol enough",
      ],
    },
    failureModes: [
      "Wrong tool flag",
      "Misreading dump",
      "Pinning carriers with synchronized in virtual threads",
    ],
    interview: {
      expectations: [
        "JIT compilation mechanics",
        "Prod tooling",
      ],
      commonQuestions: [
        "Explain JIT compilation?",
      ],
      followUps: [
        "Tuning follow-ups?",
      ],
      misconceptions: [
        "Confuse terms",
      ],
      traps: [
        "Unsafe in prod without capture plan",
      ],
      strongSignals: [
        "Names real tools for JIT compilation",
      ],
    },
    keyTakeaways: [
      "JIT compilation",
      "C1/C2 tiers",
      "Know CLI flags",
      "Prod observability",
      "Pitfalls listed",
    ],
    interviewQuestions: [
      {
        level: "basic",
        question: "What is JIT compilation?",
        answerHint: "C1/C2 tiers; hot methods compiled; OSR; deoptimization on invalid assumptions.",
      },
      {
        level: "intermediate",
        question: "Prod use?",
        answerHint: "See ['performance', 'observability']",
      },
      {
        level: "advanced",
        question: "Failure mode?",
        answerHint: "Misconfig, leak, deadlock, or protocol fallback.",
      },
    ],
    flashcards: [
      {
        front: "JIT compilation",
        back: "C1/C2 tiers; hot methods compiled; OSR; deoptimization on invalid assu",
      },
      {
        front: "Tools",
        back: "-XX:+PrintCompilation",
      },
    ],
    quickRevision: [
      "JIT compilation",
      "Tools/flags",
      "Prod notes",
      "Pitfalls",
      "Interview",
      "Contrast prior gen",
      "Observability",
    ],
    production: {
      performance: [
        "JIT compilation: production concern on performance",
      ],
      observability: [
        "JIT compilation: production concern on observability",
      ],
      maintainability: [
        "Document JIT compilation usage in runbooks",
      ],
    },
  }],

  ['c2-memory-leaks', {
    whatIsIt: "Memory leaks: Retained objects via static maps, listeners, class loaders; weak refs for caches.",
    whyExists: "Production Java services need memory leaks knowledge for debugging and design interviews.",
    mentalModel: "Think ops + language/runtime interaction for Memory leaks.",
    howItWorks: [
      {
        type: "list",
        items: [
          "Retained objects via static maps, listeners, class loaders; weak refs for caches.",
          "Know flags/tools not just API.",
          "Link to observability metrics.",
          "Security and classloader boundaries where relevant.",
          "Contrast old vs new (HTTP1 vs 2 vs 3).",
        ],
      },
    ],
    example: [
      {
        type: "paragraph",
        text: "On-call scenario using Memory leaks.",
      },
    ],
    templates: [
      {
        language: "java",
        caption: "Memory leaks example",
        code: `static Map<K,V> CACHE = new HashMap<>(); // leak if keys live forever`,
      },
    ],
    tradeoffs: {
      advantages: [
        "Industry standard",
        "Deep signals in senior interviews",
      ],
      disadvantages: [
        "Version/tooling churn",
        "Misconfiguration cost",
      ],
      alternatives: [
        "Alternative stack",
      ],
      whenToUse: [
        "Java backend roles",
      ],
      whenNotToUse: [
        "When simpler protocol enough",
      ],
    },
    failureModes: [
      "Wrong tool flag",
      "Misreading dump",
      "Pinning carriers with synchronized in virtual threads",
    ],
    interview: {
      expectations: [
        "Memory leaks mechanics",
        "Prod tooling",
      ],
      commonQuestions: [
        "Explain Memory leaks?",
      ],
      followUps: [
        "Tuning follow-ups?",
      ],
      misconceptions: [
        "Confuse terms",
      ],
      traps: [
        "Unsafe in prod without capture plan",
      ],
      strongSignals: [
        "Names real tools for Memory leaks",
      ],
    },
    keyTakeaways: [
      "Memory leaks",
      "Retained objects via static maps, listeners, class loaders",
      "Know CLI flags",
      "Prod observability",
      "Pitfalls listed",
    ],
    interviewQuestions: [
      {
        level: "basic",
        question: "What is Memory leaks?",
        answerHint: "Retained objects via static maps, listeners, class loaders; weak refs for caches.",
      },
      {
        level: "intermediate",
        question: "Prod use?",
        answerHint: "See ['reliability', 'performance']",
      },
      {
        level: "advanced",
        question: "Failure mode?",
        answerHint: "Misconfig, leak, deadlock, or protocol fallback.",
      },
    ],
    flashcards: [
      {
        front: "Memory leaks",
        back: "Retained objects via static maps, listeners, class loaders; weak refs ",
      },
      {
        front: "Tools",
        back: "static Map<K,V> CACHE = new HashMap<>();",
      },
    ],
    quickRevision: [
      "Memory leaks",
      "Tools/flags",
      "Prod notes",
      "Pitfalls",
      "Interview",
      "Contrast prior gen",
      "Observability",
    ],
    production: {
      reliability: [
        "Memory leaks: production concern on reliability",
      ],
      performance: [
        "Memory leaks: production concern on performance",
      ],
      maintainability: [
        "Document Memory leaks usage in runbooks",
      ],
    },
  }],

  ['c2-profiling', {
    whatIsIt: "JVM profiling: async-profiler, JFR, flame graphs for CPU/allocation hotspots.",
    whyExists: "Production Java services need jvm profiling knowledge for debugging and design interviews.",
    mentalModel: "Think ops + language/runtime interaction for JVM profiling.",
    howItWorks: [
      {
        type: "list",
        items: [
          "async-profiler, JFR, flame graphs for CPU/allocation hotspots.",
          "Know flags/tools not just API.",
          "Link to observability metrics.",
          "Security and classloader boundaries where relevant.",
          "Contrast old vs new (HTTP1 vs 2 vs 3).",
        ],
      },
    ],
    example: [
      {
        type: "paragraph",
        text: "On-call scenario using JVM profiling.",
      },
    ],
    templates: [
      {
        language: "java",
        caption: "JVM profiling example",
        code: `async-profiler -d 30 -f flame.html <pid>`,
      },
    ],
    tradeoffs: {
      advantages: [
        "Industry standard",
        "Deep signals in senior interviews",
      ],
      disadvantages: [
        "Version/tooling churn",
        "Misconfiguration cost",
      ],
      alternatives: [
        "Alternative stack",
      ],
      whenToUse: [
        "Java backend roles",
      ],
      whenNotToUse: [
        "When simpler protocol enough",
      ],
    },
    failureModes: [
      "Wrong tool flag",
      "Misreading dump",
      "Pinning carriers with synchronized in virtual threads",
    ],
    interview: {
      expectations: [
        "JVM profiling mechanics",
        "Prod tooling",
      ],
      commonQuestions: [
        "Explain JVM profiling?",
      ],
      followUps: [
        "Tuning follow-ups?",
      ],
      misconceptions: [
        "Confuse terms",
      ],
      traps: [
        "Unsafe in prod without capture plan",
      ],
      strongSignals: [
        "Names real tools for JVM profiling",
      ],
    },
    keyTakeaways: [
      "JVM profiling",
      "async-profiler, JFR, flame graphs for CPU/allocation hotspots.",
      "Know CLI flags",
      "Prod observability",
      "Pitfalls listed",
    ],
    interviewQuestions: [
      {
        level: "basic",
        question: "What is JVM profiling?",
        answerHint: "async-profiler, JFR, flame graphs for CPU/allocation hotspots.",
      },
      {
        level: "intermediate",
        question: "Prod use?",
        answerHint: "See ['observability', 'performance']",
      },
      {
        level: "advanced",
        question: "Failure mode?",
        answerHint: "Misconfig, leak, deadlock, or protocol fallback.",
      },
    ],
    flashcards: [
      {
        front: "JVM profiling",
        back: "async-profiler, JFR, flame graphs for CPU/allocation hotspots.",
      },
      {
        front: "Tools",
        back: "async-profiler -d 30 -f flame.html <pid>",
      },
    ],
    quickRevision: [
      "JVM profiling",
      "Tools/flags",
      "Prod notes",
      "Pitfalls",
      "Interview",
      "Contrast prior gen",
      "Observability",
    ],
    production: {
      observability: [
        "JVM profiling: production concern on observability",
      ],
      performance: [
        "JVM profiling: production concern on performance",
      ],
      maintainability: [
        "Document JVM profiling usage in runbooks",
      ],
    },
  }],

  ['c2-thread-dumps', {
    whatIsIt: "Thread dumps: jstack or jcmd Thread.print; find deadlocks, blocked pools, stuck locks.",
    whyExists: "Production Java services need thread dumps knowledge for debugging and design interviews.",
    mentalModel: "Think ops + language/runtime interaction for Thread dumps.",
    howItWorks: [
      {
        type: "list",
        items: [
          "jstack or jcmd Thread.print; find deadlocks, blocked pools, stuck locks.",
          "Know flags/tools not just API.",
          "Link to observability metrics.",
          "Security and classloader boundaries where relevant.",
          "Contrast old vs new (HTTP1 vs 2 vs 3).",
        ],
      },
    ],
    example: [
      {
        type: "paragraph",
        text: "On-call scenario using Thread dumps.",
      },
    ],
    templates: [
      {
        language: "java",
        caption: "Thread dumps example",
        code: `jcmd <pid> Thread.print`,
      },
    ],
    tradeoffs: {
      advantages: [
        "Industry standard",
        "Deep signals in senior interviews",
      ],
      disadvantages: [
        "Version/tooling churn",
        "Misconfiguration cost",
      ],
      alternatives: [
        "Alternative stack",
      ],
      whenToUse: [
        "Java backend roles",
      ],
      whenNotToUse: [
        "When simpler protocol enough",
      ],
    },
    failureModes: [
      "Wrong tool flag",
      "Misreading dump",
      "Pinning carriers with synchronized in virtual threads",
    ],
    interview: {
      expectations: [
        "Thread dumps mechanics",
        "Prod tooling",
      ],
      commonQuestions: [
        "Explain Thread dumps?",
      ],
      followUps: [
        "Tuning follow-ups?",
      ],
      misconceptions: [
        "Confuse terms",
      ],
      traps: [
        "Unsafe in prod without capture plan",
      ],
      strongSignals: [
        "Names real tools for Thread dumps",
      ],
    },
    keyTakeaways: [
      "Thread dumps",
      "jstack or jcmd Thread.print",
      "Know CLI flags",
      "Prod observability",
      "Pitfalls listed",
    ],
    interviewQuestions: [
      {
        level: "basic",
        question: "What is Thread dumps?",
        answerHint: "jstack or jcmd Thread.print; find deadlocks, blocked pools, stuck locks.",
      },
      {
        level: "intermediate",
        question: "Prod use?",
        answerHint: "See ['observability', 'reliability']",
      },
      {
        level: "advanced",
        question: "Failure mode?",
        answerHint: "Misconfig, leak, deadlock, or protocol fallback.",
      },
    ],
    flashcards: [
      {
        front: "Thread dumps",
        back: "jstack or jcmd Thread.print; find deadlocks, blocked pools, stuck lock",
      },
      {
        front: "Tools",
        back: "jcmd <pid> Thread.print",
      },
    ],
    quickRevision: [
      "Thread dumps",
      "Tools/flags",
      "Prod notes",
      "Pitfalls",
      "Interview",
      "Contrast prior gen",
      "Observability",
    ],
    production: {
      observability: [
        "Thread dumps: production concern on observability",
      ],
      reliability: [
        "Thread dumps: production concern on reliability",
      ],
      maintainability: [
        "Document Thread dumps usage in runbooks",
      ],
    },
  }],

  ['c3-forkjoin', {
    whatIsIt: "ForkJoinPool: Work-stealing for divide-conquer; parallelStream default pool; RecursiveTask.",
    whyExists: "Production Java services need forkjoinpool knowledge for debugging and design interviews.",
    mentalModel: "Think ops + language/runtime interaction for ForkJoinPool.",
    howItWorks: [
      {
        type: "list",
        items: [
          "Work-stealing for divide-conquer; parallelStream default pool; RecursiveTask.",
          "Know flags/tools not just API.",
          "Link to observability metrics.",
          "Security and classloader boundaries where relevant.",
          "Contrast old vs new (HTTP1 vs 2 vs 3).",
        ],
      },
    ],
    example: [
      {
        type: "paragraph",
        text: "On-call scenario using ForkJoinPool.",
      },
    ],
    templates: [
      {
        language: "java",
        caption: "ForkJoinPool example",
        code: `new ForkJoinPool(par).invoke(new MyTask());`,
      },
    ],
    tradeoffs: {
      advantages: [
        "Industry standard",
        "Deep signals in senior interviews",
      ],
      disadvantages: [
        "Version/tooling churn",
        "Misconfiguration cost",
      ],
      alternatives: [
        "Alternative stack",
      ],
      whenToUse: [
        "Java backend roles",
      ],
      whenNotToUse: [
        "When simpler protocol enough",
      ],
    },
    failureModes: [
      "Wrong tool flag",
      "Misreading dump",
      "Pinning carriers with synchronized in virtual threads",
    ],
    interview: {
      expectations: [
        "ForkJoinPool mechanics",
        "Prod tooling",
      ],
      commonQuestions: [
        "Explain ForkJoinPool?",
      ],
      followUps: [
        "Tuning follow-ups?",
      ],
      misconceptions: [
        "Confuse terms",
      ],
      traps: [
        "Unsafe in prod without capture plan",
      ],
      strongSignals: [
        "Names real tools for ForkJoinPool",
      ],
    },
    keyTakeaways: [
      "ForkJoinPool",
      "Work-stealing for divide-conquer",
      "Know CLI flags",
      "Prod observability",
      "Pitfalls listed",
    ],
    interviewQuestions: [
      {
        level: "basic",
        question: "What is ForkJoinPool?",
        answerHint: "Work-stealing for divide-conquer; parallelStream default pool; RecursiveTask.",
      },
      {
        level: "intermediate",
        question: "Prod use?",
        answerHint: "See ['performance', 'scalability']",
      },
      {
        level: "advanced",
        question: "Failure mode?",
        answerHint: "Misconfig, leak, deadlock, or protocol fallback.",
      },
    ],
    flashcards: [
      {
        front: "ForkJoinPool",
        back: "Work-stealing for divide-conquer; parallelStream default pool; Recursi",
      },
      {
        front: "Tools",
        back: "new ForkJoinPool(par).invoke(new MyTask(",
      },
    ],
    quickRevision: [
      "ForkJoinPool",
      "Tools/flags",
      "Prod notes",
      "Pitfalls",
      "Interview",
      "Contrast prior gen",
      "Observability",
    ],
    production: {
      performance: [
        "ForkJoinPool: production concern on performance",
      ],
      scalability: [
        "ForkJoinPool: production concern on scalability",
      ],
      maintainability: [
        "Document ForkJoinPool usage in runbooks",
      ],
    },
  }],

  ['c3-virtual-threads', {
    whatIsIt: "Virtual threads: Project Loom lightweight threads; block cheap; use per task not pool for carrier pinning awareness.",
    whyExists: "Production Java services need virtual threads knowledge for debugging and design interviews.",
    mentalModel: "Think ops + language/runtime interaction for Virtual threads.",
    howItWorks: [
      {
        type: "list",
        items: [
          "Project Loom lightweight threads; block cheap; use per task not pool for carrier pinning awareness.",
          "Know flags/tools not just API.",
          "Link to observability metrics.",
          "Security and classloader boundaries where relevant.",
          "Contrast old vs new (HTTP1 vs 2 vs 3).",
        ],
      },
    ],
    example: [
      {
        type: "paragraph",
        text: "On-call scenario using Virtual threads.",
      },
    ],
    templates: [
      {
        language: "java",
        caption: "Virtual threads example",
        code: `Thread.startVirtualThread(() -> service.call());`,
      },
    ],
    tradeoffs: {
      advantages: [
        "Industry standard",
        "Deep signals in senior interviews",
      ],
      disadvantages: [
        "Version/tooling churn",
        "Misconfiguration cost",
      ],
      alternatives: [
        "Alternative stack",
      ],
      whenToUse: [
        "Java backend roles",
      ],
      whenNotToUse: [
        "When simpler protocol enough",
      ],
    },
    failureModes: [
      "Wrong tool flag",
      "Misreading dump",
      "Pinning carriers with synchronized in virtual threads",
    ],
    interview: {
      expectations: [
        "Virtual threads mechanics",
        "Prod tooling",
      ],
      commonQuestions: [
        "Explain Virtual threads?",
      ],
      followUps: [
        "Tuning follow-ups?",
      ],
      misconceptions: [
        "Confuse terms",
      ],
      traps: [
        "Unsafe in prod without capture plan",
      ],
      strongSignals: [
        "Names real tools for Virtual threads",
      ],
    },
    keyTakeaways: [
      "Virtual threads",
      "Project Loom lightweight threads",
      "Know CLI flags",
      "Prod observability",
      "Pitfalls listed",
    ],
    interviewQuestions: [
      {
        level: "basic",
        question: "What is Virtual threads?",
        answerHint: "Project Loom lightweight threads; block cheap; use per task not pool for carrier pinning awareness.",
      },
      {
        level: "intermediate",
        question: "Prod use?",
        answerHint: "See ['scalability', 'performance']",
      },
      {
        level: "advanced",
        question: "Failure mode?",
        answerHint: "Misconfig, leak, deadlock, or protocol fallback.",
      },
    ],
    flashcards: [
      {
        front: "Virtual threads",
        back: "Project Loom lightweight threads; block cheap; use per task not pool f",
      },
      {
        front: "Tools",
        back: "Thread.startVirtualThread(() -> service.",
      },
    ],
    quickRevision: [
      "Virtual threads",
      "Tools/flags",
      "Prod notes",
      "Pitfalls",
      "Interview",
      "Contrast prior gen",
      "Observability",
    ],
    production: {
      scalability: [
        "Virtual threads: production concern on scalability",
      ],
      performance: [
        "Virtual threads: production concern on performance",
      ],
      maintainability: [
        "Document Virtual threads usage in runbooks",
      ],
    },
  }],

  ['c4-grpc', {
    whatIsIt: "gRPC: HTTP/2 protobuf RPC; streaming; strong contracts via .proto; status codes.",
    whyExists: "Production Java services need grpc knowledge for debugging and design interviews.",
    mentalModel: "Think ops + language/runtime interaction for gRPC.",
    howItWorks: [
      {
        type: "list",
        items: [
          "HTTP/2 protobuf RPC; streaming; strong contracts via .proto; status codes.",
          "Know flags/tools not just API.",
          "Link to observability metrics.",
          "Security and classloader boundaries where relevant.",
          "Contrast old vs new (HTTP1 vs 2 vs 3).",
        ],
      },
    ],
    example: [
      {
        type: "paragraph",
        text: "On-call scenario using gRPC.",
      },
    ],
    templates: [
      {
        language: "java",
        caption: "gRPC example",
        code: `ManagedChannel channel = ManagedChannelBuilder.forAddress(host,443).build();`,
      },
    ],
    tradeoffs: {
      advantages: [
        "Industry standard",
        "Deep signals in senior interviews",
      ],
      disadvantages: [
        "Version/tooling churn",
        "Misconfiguration cost",
      ],
      alternatives: [
        "Alternative stack",
      ],
      whenToUse: [
        "Java backend roles",
      ],
      whenNotToUse: [
        "When simpler protocol enough",
      ],
    },
    failureModes: [
      "Wrong tool flag",
      "Misreading dump",
      "Pinning carriers with synchronized in virtual threads",
    ],
    interview: {
      expectations: [
        "gRPC mechanics",
        "Prod tooling",
      ],
      commonQuestions: [
        "Explain gRPC?",
      ],
      followUps: [
        "Tuning follow-ups?",
      ],
      misconceptions: [
        "Confuse terms",
      ],
      traps: [
        "Unsafe in prod without capture plan",
      ],
      strongSignals: [
        "Names real tools for gRPC",
      ],
    },
    keyTakeaways: [
      "gRPC",
      "HTTP/2 protobuf RPC",
      "Know CLI flags",
      "Prod observability",
      "Pitfalls listed",
    ],
    interviewQuestions: [
      {
        level: "basic",
        question: "What is gRPC?",
        answerHint: "HTTP/2 protobuf RPC; streaming; strong contracts via .proto; status codes.",
      },
      {
        level: "intermediate",
        question: "Prod use?",
        answerHint: "See ['performance', 'reliability']",
      },
      {
        level: "advanced",
        question: "Failure mode?",
        answerHint: "Misconfig, leak, deadlock, or protocol fallback.",
      },
    ],
    flashcards: [
      {
        front: "gRPC",
        back: "HTTP/2 protobuf RPC; streaming; strong contracts via .proto; status co",
      },
      {
        front: "Tools",
        back: "ManagedChannel channel = ManagedChannelB",
      },
    ],
    quickRevision: [
      "gRPC",
      "Tools/flags",
      "Prod notes",
      "Pitfalls",
      "Interview",
      "Contrast prior gen",
      "Observability",
    ],
    production: {
      performance: [
        "gRPC: production concern on performance",
      ],
      reliability: [
        "gRPC: production concern on reliability",
      ],
      maintainability: [
        "Document gRPC usage in runbooks",
      ],
    },
  }],

  ['c4-http2', {
    whatIsIt: "HTTP/2: Multiplexed streams on one TCP; HPACK header compression; server push rare; foundation for gRPC.",
    whyExists: "Production Java services need http/2 knowledge for debugging and design interviews.",
    mentalModel: "Think ops + language/runtime interaction for HTTP/2.",
    howItWorks: [
      {
        type: "list",
        items: [
          "Multiplexed streams on one TCP; HPACK header compression; server push rare; foundation for gRPC.",
          "Know flags/tools not just API.",
          "Link to observability metrics.",
          "Security and classloader boundaries where relevant.",
          "Contrast old vs new (HTTP1 vs 2 vs 3).",
        ],
      },
    ],
    example: [
      {
        type: "paragraph",
        text: "On-call scenario using HTTP/2.",
      },
    ],
    templates: [
      {
        language: "java",
        caption: "HTTP/2 example",
        code: `HTTP/2 binary framing vs HTTP/1.1 text`,
      },
    ],
    tradeoffs: {
      advantages: [
        "Industry standard",
        "Deep signals in senior interviews",
      ],
      disadvantages: [
        "Version/tooling churn",
        "Misconfiguration cost",
      ],
      alternatives: [
        "Alternative stack",
      ],
      whenToUse: [
        "Java backend roles",
      ],
      whenNotToUse: [
        "When simpler protocol enough",
      ],
    },
    failureModes: [
      "Wrong tool flag",
      "Misreading dump",
      "Pinning carriers with synchronized in virtual threads",
    ],
    interview: {
      expectations: [
        "HTTP/2 mechanics",
        "Prod tooling",
      ],
      commonQuestions: [
        "Explain HTTP/2?",
      ],
      followUps: [
        "Tuning follow-ups?",
      ],
      misconceptions: [
        "Confuse terms",
      ],
      traps: [
        "Unsafe in prod without capture plan",
      ],
      strongSignals: [
        "Names real tools for HTTP/2",
      ],
    },
    keyTakeaways: [
      "HTTP/2",
      "Multiplexed streams on one TCP",
      "Know CLI flags",
      "Prod observability",
      "Pitfalls listed",
    ],
    interviewQuestions: [
      {
        level: "basic",
        question: "What is HTTP/2?",
        answerHint: "Multiplexed streams on one TCP; HPACK header compression; server push rare; foundation for gRPC.",
      },
      {
        level: "intermediate",
        question: "Prod use?",
        answerHint: "See ['performance', 'scalability']",
      },
      {
        level: "advanced",
        question: "Failure mode?",
        answerHint: "Misconfig, leak, deadlock, or protocol fallback.",
      },
    ],
    flashcards: [
      {
        front: "HTTP/2",
        back: "Multiplexed streams on one TCP; HPACK header compression; server push ",
      },
      {
        front: "Tools",
        back: "HTTP/2 binary framing vs HTTP/1.1 text",
      },
    ],
    quickRevision: [
      "HTTP/2",
      "Tools/flags",
      "Prod notes",
      "Pitfalls",
      "Interview",
      "Contrast prior gen",
      "Observability",
    ],
    production: {
      performance: [
        "HTTP/2: production concern on performance",
      ],
      scalability: [
        "HTTP/2: production concern on scalability",
      ],
      maintainability: [
        "Document HTTP/2 usage in runbooks",
      ],
    },
  }],

  ['c4-http3', {
    whatIsIt: "HTTP/3: QUIC over UDP; independent streams; faster handshakes; loss recovery per stream.",
    whyExists: "Production Java services need http/3 knowledge for debugging and design interviews.",
    mentalModel: "Think ops + language/runtime interaction for HTTP/3.",
    howItWorks: [
      {
        type: "list",
        items: [
          "QUIC over UDP; independent streams; faster handshakes; loss recovery per stream.",
          "Know flags/tools not just API.",
          "Link to observability metrics.",
          "Security and classloader boundaries where relevant.",
          "Contrast old vs new (HTTP1 vs 2 vs 3).",
        ],
      },
    ],
    example: [
      {
        type: "paragraph",
        text: "On-call scenario using HTTP/3.",
      },
    ],
    templates: [
      {
        language: "java",
        caption: "HTTP/3 example",
        code: `QUIC replaces TCP for HTTP/3`,
      },
    ],
    tradeoffs: {
      advantages: [
        "Industry standard",
        "Deep signals in senior interviews",
      ],
      disadvantages: [
        "Version/tooling churn",
        "Misconfiguration cost",
      ],
      alternatives: [
        "Alternative stack",
      ],
      whenToUse: [
        "Java backend roles",
      ],
      whenNotToUse: [
        "When simpler protocol enough",
      ],
    },
    failureModes: [
      "Wrong tool flag",
      "Misreading dump",
      "Pinning carriers with synchronized in virtual threads",
    ],
    interview: {
      expectations: [
        "HTTP/3 mechanics",
        "Prod tooling",
      ],
      commonQuestions: [
        "Explain HTTP/3?",
      ],
      followUps: [
        "Tuning follow-ups?",
      ],
      misconceptions: [
        "Confuse terms",
      ],
      traps: [
        "Unsafe in prod without capture plan",
      ],
      strongSignals: [
        "Names real tools for HTTP/3",
      ],
    },
    keyTakeaways: [
      "HTTP/3",
      "QUIC over UDP",
      "Know CLI flags",
      "Prod observability",
      "Pitfalls listed",
    ],
    interviewQuestions: [
      {
        level: "basic",
        question: "What is HTTP/3?",
        answerHint: "QUIC over UDP; independent streams; faster handshakes; loss recovery per stream.",
      },
      {
        level: "intermediate",
        question: "Prod use?",
        answerHint: "See ['performance', 'reliability']",
      },
      {
        level: "advanced",
        question: "Failure mode?",
        answerHint: "Misconfig, leak, deadlock, or protocol fallback.",
      },
    ],
    flashcards: [
      {
        front: "HTTP/3",
        back: "QUIC over UDP; independent streams; faster handshakes; loss recovery p",
      },
      {
        front: "Tools",
        back: "QUIC replaces TCP for HTTP/3",
      },
    ],
    quickRevision: [
      "HTTP/3",
      "Tools/flags",
      "Prod notes",
      "Pitfalls",
      "Interview",
      "Contrast prior gen",
      "Observability",
    ],
    production: {
      performance: [
        "HTTP/3: production concern on performance",
      ],
      reliability: [
        "HTTP/3: production concern on reliability",
      ],
      maintainability: [
        "Document HTTP/3 usage in runbooks",
      ],
    },
  }]

]

const ids = topics.map(([id]) => id)
if (ids.length !== 42) {
  console.error(`Expected 42 topics, got ${ids.length}`)
  process.exit(1)
}

for (const [id, content] of topics) {
  writeTopic(id, content)
}

console.log(`Generated ${topics.length} topic files:`)
console.log(ids.join('\n'))
