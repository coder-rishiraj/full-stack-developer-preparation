import type { Priority } from '@/domain/types'
import type { SectionSeed, TopicSeed } from './build'

const M13 = [1, 3]
const M69 = [6, 9]
const M912 = [9, 12]

function item(
  id: string,
  title: string,
  priority: Priority = 'tier1',
  extra: Partial<TopicSeed> = {},
): TopicSeed {
  const { tags, executionPriority, months, ...rest } = extra
  return {
    id,
    title,
    priority,
    months:
      months ??
      (priority === 'tier1' ? M13 : priority === 'tier2' ? M69 : M912),
    tags: ['applied-ai', ...(tags ?? [])],
    executionPriority:
      executionPriority ??
      (priority === 'tier1' ? 'p0' : priority === 'tier2' ? 'p1' : 'later'),
    ...rest,
  }
}

function nest(
  parent: string,
  id: string,
  title: string,
  priority: Priority = 'tier1',
  extra: Partial<TopicSeed> = {},
): TopicSeed {
  return item(id, title, priority, {
    ...extra,
    curriculumLevel: 'nested-concept',
    parentTopicId: parent,
  })
}

function section(
  id: string,
  title: string,
  order: number,
  topics: TopicSeed[],
  kind: SectionSeed['defaultKind'] = 'theory',
): SectionSeed {
  return {
    id,
    track: 'E',
    title,
    order,
    defaultKind: kind,
    defaultDepth: 'deep',
    topics,
  }
}

/**
 * Applied AI learning order:
 * build early → understand internals → retrieval → agents/MCP → eval/security/
 * production → open models/multimodal/fine-tuning → deeper ML infrastructure.
 *
 * Existing E1–E12 IDs remain stable. Provider/framework names are examples;
 * durable capabilities and decision-making are the curriculum backbone.
 */
export const TRACK_E_APPLIED_AI_SECTIONS: SectionSeed[] = [
  section('E1.1', 'Applied AI Landscape & Engineering Roles', 1, [
    item('e1-ai-landscape', 'Applied AI Engineering Landscape'),
    nest('e1-ai-landscape', 'e1-ai-ml-dl-genai', 'AI → ML → Deep Learning → Generative AI'),
    nest('e1-ai-landscape', 'e1-foundation-llm-multimodal', 'Foundation, Language & Multimodal Models'),
    nest('e1-ai-landscape', 'e1-ai-vs-ml-engineer', 'AI Engineer vs ML Engineer vs Data Scientist vs Researcher'),
    nest('e1-ai-landscape', 'e1-model-ecosystem', 'Frontier, Open-Weight, Small & Reasoning Models'),
    nest('e1-ai-landscape', 'e1-applied-ai-decision', 'Deterministic Software vs AI Decision'),
  ]),

  section('E1.2', 'AI Power-User & Coding-Agent Workflows', 2, [
    item('e1-ai-tool-mastery', 'AI Tool Mastery'),
    nest('e1-ai-tool-mastery', 'e1-assistant-ecosystems', 'ChatGPT, Claude, Gemini & Research Tools'),
    nest('e1-ai-tool-mastery', 'e1-model-strengths', 'Compare Model Strengths, Limits & Outputs'),
    nest('e1-ai-tool-mastery', 'e1-coding-agents', 'Cursor, Copilot & Coding-Agent Workflows'),
    nest('e1-ai-tool-mastery', 'e1-repository-assistance', 'Repository Research, Refactoring, Debugging & Tests'),
    nest('e1-ai-tool-mastery', 'e1-delegation-verification', 'Delegate, Verify & Retain Human Ownership'),
    nest('e1-ai-tool-mastery', 'e1-deep-research', 'Research Synthesis, Citations & Fact Checking'),
  ]),

  section('E1.3', 'Python Essentials for AI Engineers', 3, [
    item('e1-syntax', 'Python Essentials'),
    nest('e1-syntax', 'e1-collections', 'Collections'),
    nest('e1-syntax', 'e1-functions', 'Functions, Iterators & Exceptions'),
    nest('e1-syntax', 'e1-classes', 'Classes & Dataclasses'),
    nest('e1-syntax', 'e1-type-hints', 'Type Hints'),
    nest('e1-syntax', 'e1-packages', 'Modules & Package Management'),
    nest('e1-syntax', 'e1-venvs', 'Virtual Environments'),
  ]),

  section('E1.4', 'Python AI Backend & Data Stack', 4, [
    item('e1-async', 'Python AI Backend Engineering'),
    nest('e1-async', 'e1-pydantic', 'Pydantic Models & Validation'),
    nest('e1-async', 'e1-fastapi', 'FastAPI & Typed REST APIs'),
    nest('e1-async', 'e1-python-streaming', 'Async/Await, SSE & WebSockets'),
    nest('e1-async', 'e1-background-jobs', 'Background Jobs & Queues'),
    nest('e1-async', 'e1-numpy', 'NumPy Basics', 'tier2'),
    nest('e1-async', 'e1-pandas', 'Pandas, Jupyter & Data Exploration', 'tier2'),
  ]),

  section('E2.1', 'Machine Learning Foundations', 5, [
    item('e2-ml-vs-dl-vs-genai', 'ML, Deep Learning & Generative AI'),
    nest('e2-ml-vs-dl-vs-genai', 'e2-datasets-features-labels', 'Datasets, Features, Labels & Targets'),
    nest('e2-ml-vs-dl-vs-genai', 'e2-parameters-hyperparameters', 'Parameters vs Hyperparameters'),
    nest('e2-ml-vs-dl-vs-genai', 'e2-training-vs-inference', 'Training vs Inference'),
    nest('e2-ml-vs-dl-vs-genai', 'e2-model-generalization', 'Generalization, Distribution Shift & Baselines'),
  ]),

  section('E2.2', 'Learning Paradigms & Core ML Problems', 6, [
    item('e2-supervised-unsupervised', 'Learning Paradigms'),
    nest('e2-supervised-unsupervised', 'e2-supervised', 'Supervised Learning'),
    nest('e2-supervised-unsupervised', 'e2-unsupervised', 'Unsupervised Learning'),
    nest('e2-supervised-unsupervised', 'e2-self-semi-supervised', 'Self-Supervised & Semi-Supervised Learning'),
    nest('e2-supervised-unsupervised', 'e2-reinforcement-learning', 'Reinforcement Learning Concepts', 'tier2'),
    nest('e2-supervised-unsupervised', 'e2-regression-classification', 'Regression & Classification'),
    nest('e2-supervised-unsupervised', 'e2-clustering-ranking-recommendation', 'Clustering, Ranking & Recommendation'),
  ]),

  section('E2.3', 'Training, Generalization & Classical Evaluation', 7, [
    item('e2-training-evaluation', 'Training & Evaluation'),
    nest('e2-training-evaluation', 'e2-train-validation-test', 'Train, Validation & Test Splits'),
    nest('e2-training-evaluation', 'e2-loss-functions', 'Loss Functions & Optimization'),
    nest('e2-training-evaluation', 'e2-gradient-descent', 'Gradient Descent & Learning Rate'),
    nest('e2-training-evaluation', 'e2-overfit-underfit', 'Overfitting, Underfitting & Regularization'),
    nest('e2-training-evaluation', 'e2-bias-variance', 'Bias–Variance Trade-off'),
    nest('e2-training-evaluation', 'e2-classification-metrics', 'Accuracy, Precision, Recall, F1 & ROC-AUC'),
  ]),

  section('E2.4', 'Math for Applied AI — Just in Time', 8, [
    item('e2-math-foundations', 'Math for Applied AI', 'tier2'),
    nest('e2-math-foundations', 'e2-linear-algebra', 'Vectors, Matrices, Tensors & Dot Products', 'tier2'),
    nest('e2-math-foundations', 'e2-probability', 'Probability, Bayes, Expectation & Sampling', 'tier2'),
    nest('e2-math-foundations', 'e2-statistics', 'Statistics, Correlation & Confidence', 'tier2'),
    nest('e2-math-foundations', 'e2-calculus-gradients', 'Derivatives, Gradients & Chain Rule', 'tier2'),
    nest('e2-math-foundations', 'e2-optimization', 'SGD, Adam & Learning-Rate Schedules', 'tier2'),
  ]),

  section('E2.5', 'Classical ML with scikit-learn', 9, [
    item('e2-classical-ml', 'Classical ML Practice', 'tier2'),
    nest('e2-classical-ml', 'e2-linear-logistic-regression', 'Linear & Logistic Regression', 'tier2'),
    nest('e2-classical-ml', 'e2-trees-ensembles', 'Decision Trees, Random Forests & Gradient Boosting', 'tier2'),
    nest('e2-classical-ml', 'e2-kmeans-pca', 'K-Means & PCA', 'tier2'),
    nest('e2-classical-ml', 'e2-sklearn-pipelines', 'Preprocessing & scikit-learn Pipelines', 'tier2'),
    nest('e2-classical-ml', 'e2-hyperparameter-tuning', 'Cross-Validation & Hyperparameter Tuning', 'tier2'),
  ]),

  section('E2.6', 'Neural Networks & PyTorch Fundamentals', 10, [
    item('e2-neural-networks', 'Neural-Network Concepts', 'tier2'),
    nest('e2-neural-networks', 'e2-neurons-weights-activations', 'Neurons, Weights, Biases & Activations', 'tier2'),
    nest('e2-neural-networks', 'e2-forward-backprop', 'Forward Propagation & Backpropagation', 'tier2'),
    nest('e2-neural-networks', 'e2-pytorch-tensors-autograd', 'PyTorch Tensors & Autograd', 'tier2'),
    nest('e2-neural-networks', 'e2-pytorch-training-loop', 'nn.Module, DataLoaders & Training Loops', 'tier2'),
    nest('e2-neural-networks', 'e2-cnn-rnn-history', 'CNN, RNN & LSTM Context', 'tier3'),
  ]),

  section('E2.7', 'Transformers & Attention Internals', 11, [
    item('e2-transformers', 'Transformer Architecture'),
    nest('e2-transformers', 'e2-tokenization', 'Tokenization'),
    nest('e2-transformers', 'e2-tokens', 'Tokens, Vocabulary & Special Tokens'),
    nest('e2-transformers', 'e2-embeddings', 'Token Embeddings & Positional Information', 'tier1', {
      related: ['e5-embeddings'],
    }),
    nest('e2-transformers', 'e2-attention', 'Query, Key, Value & Self-Attention'),
    nest('e2-transformers', 'e2-multi-head-causal', 'Multi-Head & Causal Attention'),
    nest('e2-transformers', 'e2-transformer-block', 'Residuals, LayerNorm, MLP & Transformer Blocks'),
    nest('e2-transformers', 'e2-encoder-decoder-families', 'Encoder, Decoder & Encoder–Decoder Families', 'tier2'),
  ]),

  section('E2.8', 'LLM Inference, Training Lifecycle & Limitations', 12, [
    item('e2-llm-fundamentals', 'Large Language Model Fundamentals'),
    nest('e2-llm-fundamentals', 'e2-context-windows', 'Context Windows & Lost-in-the-Middle'),
    nest('e2-llm-fundamentals', 'e2-temperature', 'Logits, Temperature, Top-p & Sampling'),
    nest('e2-llm-fundamentals', 'e2-kv-cache', 'Prefill, Decode & KV Cache'),
    nest('e2-llm-fundamentals', 'e2-pretraining-instruction-alignment', 'Pretraining, Instruction Tuning & Alignment'),
    nest('e2-llm-fundamentals', 'e2-reasoning-models', 'Reasoning Models & Test-Time Compute'),
    nest('e2-llm-fundamentals', 'e2-hallucinations', 'Hallucinations, Bias & Reasoning Failures'),
  ]),

  section('E3.1', 'Provider APIs & Direct SDK Integration', 13, [
    item('e3-chat-apis', 'LLM Provider APIs'),
    nest('e3-chat-apis', 'e3-openai-api', 'OpenAI API Patterns'),
    nest('e3-chat-apis', 'e3-anthropic-api', 'Anthropic API Patterns'),
    nest('e3-chat-apis', 'e3-gemini-api', 'Gemini API Patterns'),
    nest('e3-chat-apis', 'e3-open-model-api', 'Open-Model Inference APIs'),
    nest('e3-chat-apis', 'e3-provider-abstraction', 'Thin Provider Abstraction without Framework Lock-in'),
  ]),

  section('E3.2', 'Messages, Conversations & Streaming', 14, [
    item('e3-messages', 'Messages & Conversations'),
    nest('e3-messages', 'e3-instruction-hierarchy', 'System, Developer, User, Tool & Assistant Roles'),
    nest('e3-messages', 'e3-conversation-state', 'Conversation State & Stateless API Calls'),
    nest('e3-messages', 'e3-streaming', 'Streaming Responses'),
    nest('e3-messages', 'e3-cancellation-disconnect', 'Cancellation, Disconnects & Partial Output'),
    nest('e3-messages', 'e3-token-usage', 'Usage Metadata & Token Accounting'),
  ]),

  section('E3.3', 'Structured Outputs & Typed Extraction', 15, [
    item('e3-structured-outputs', 'Structured Outputs'),
    nest('e3-structured-outputs', 'e3-json-schemas', 'JSON Schema & Typed Responses'),
    nest('e3-structured-outputs', 'e3-extraction-classification', 'Extraction, Classification & Transformation'),
    nest('e3-structured-outputs', 'e3-schema-validation', 'Validation, Parsing & Repair'),
    nest('e3-structured-outputs', 'e3-refusal-partial-output', 'Refusals, Missing Fields & Partial Results'),
    nest('e3-structured-outputs', 'e3-deterministic-postprocessing', 'Deterministic Post-Processing'),
  ]),

  section('E3.4', 'Tool & Function Calling', 16, [
    item('e3-tool-calling', 'Tool & Function Calling', 'tier1', { related: ['e7-tool-calling'] }),
    nest('e3-tool-calling', 'e3-tool-schema-design', 'Tool Names, Descriptions & Argument Schemas'),
    nest('e3-tool-calling', 'e3-tool-execution-loop', 'Model → Tool → Result → Model Loop'),
    nest('e3-tool-calling', 'e3-parallel-sequential-tools', 'Parallel vs Sequential Tool Calls'),
    nest('e3-tool-calling', 'e3-tool-validation-errors', 'Argument Validation & Tool Error Recovery'),
    nest('e3-tool-calling', 'e3-tool-auth-idempotency', 'Authorization, Approval & Idempotency'),
  ]),

  section('E3.5', 'Model Selection, Routing & API Reliability', 17, [
    item('e3-model-selection', 'Model Selection'),
    nest('e3-model-selection', 'e3-cost-latency-quality', 'Quality, Latency & Cost Trade-offs'),
    nest('e3-model-selection', 'e3-capability-modality-context', 'Capability, Modality & Context Fit'),
    nest('e3-model-selection', 'e3-rate-limits', 'Provider Rate Limits', 'tier1', {
      related: ['d10-rate-limiter'],
    }),
    nest('e3-model-selection', 'e3-retries', 'Timeouts, Retries & Backoff', 'tier1', {
      related: ['c12-retries'],
    }),
    nest('e3-model-selection', 'e3-model-routing-fallback', 'Task Routing, Fallbacks & Provider Failover'),
  ]),

  section('E4.1', 'Prompt Fundamentals & Instruction Design', 18, [
    item('e4-system-instructions', 'Prompt & Instruction Fundamentals'),
    nest('e4-system-instructions', 'e4-objective-context-constraints', 'Objective, Context, Constraints & Output Contract'),
    nest('e4-system-instructions', 'e4-zero-shot', 'Zero-Shot Prompting'),
    nest('e4-system-instructions', 'e4-few-shot', 'Few-Shot & Example-Driven Prompting'),
    nest('e4-system-instructions', 'e4-structured-prompting', 'Structured Prompts & Delimiters'),
    nest('e4-system-instructions', 'e4-decomposition', 'Decomposition & Prompt Chaining'),
    nest('e4-system-instructions', 'e4-iterative-refinement', 'Iterative Refinement & Critique'),
  ]),

  section('E4.2', 'Context Engineering', 19, [
    item('e4-context-management', 'Context Engineering'),
    nest('e4-context-management', 'e4-relevant-context', 'Relevant Context at the Moment of Decision'),
    nest('e4-context-management', 'e4-context-ordering', 'Context Selection, Ordering & Salience'),
    nest('e4-context-management', 'e4-context-optimization', 'Compression, Summarization & Token Budgets'),
    nest('e4-context-management', 'e4-dynamic-context', 'Dynamic Context from Retrieval, Tools & State'),
    nest('e4-context-management', 'e4-context-pollution', 'Context Pollution & Lost-in-the-Middle'),
  ]),

  section('E4.3', 'Long Conversations & Memory Boundaries', 20, [
    item('e4-conversation-context', 'Conversation Context'),
    nest('e4-conversation-context', 'e4-sliding-window', 'Sliding-Window History'),
    nest('e4-conversation-context', 'e4-history-summarization', 'Conversation Summarization'),
    nest('e4-conversation-context', 'e4-state-vs-memory', 'Workflow State vs User Memory'),
    nest('e4-conversation-context', 'e4-context-cache', 'Provider Prompt / Prefix Caching'),
    nest('e4-conversation-context', 'e4-forgetting-retention', 'Forgetting, Retention & User Control'),
  ]),

  section('E4.4', 'Prompt Operations & Versioning', 21, [
    item('e4-prompt-versioning', 'Prompt Operations', 'tier2'),
    nest('e4-prompt-versioning', 'e4-prompt-templates', 'Templates, Variables & Reusable Components', 'tier2'),
    nest('e4-prompt-versioning', 'e4-prompt-tests', 'Prompt Unit Tests & Regression Evals', 'tier2'),
    nest('e4-prompt-versioning', 'e4-prompt-environments', 'Environment-Specific Prompts', 'tier2'),
    nest('e4-prompt-versioning', 'e4-prompt-observability', 'Prompt/Model Version Tracing', 'tier2'),
  ]),

  section('E4.5', 'Output Validation & Prompt-Injection Awareness', 22, [
    item('e4-output-validation', 'Output Validation'),
    nest('e4-output-validation', 'e4-prompt-injection', 'Prompt-Injection Awareness', 'tier1', {
      related: ['e11-prompt-injection'],
    }),
    nest('e4-output-validation', 'e4-untrusted-content-boundary', 'Instructions vs Untrusted Content'),
    nest('e4-output-validation', 'e4-typed-boundaries', 'Typed Schemas & Allow-Listed Values'),
    nest('e4-output-validation', 'e4-model-not-authority', 'Model Output Is Data, Not Authorization'),
    nest('e4-output-validation', 'e4-safe-rendering', 'Safe Rendering, Escaping & Downstream Use'),
  ]),

  section('E5.1', 'Embedding Models & Representation Spaces', 23, [
    item('e5-embeddings', 'Embeddings', 'tier1', { related: ['e2-embeddings'] }),
    nest('e5-embeddings', 'e5-text-image-multimodal', 'Text, Image & Multimodal Embeddings'),
    nest('e5-embeddings', 'e5-dimensions-normalization', 'Dimensions, Normalization & Model Compatibility'),
    nest('e5-embeddings', 'e5-domain-language', 'Domain, Language & Task Fit'),
    nest('e5-embeddings', 'e5-embedding-versioning', 'Embedding Versioning & Re-Indexing'),
  ]),

  section('E5.2', 'Similarity & Nearest-Neighbor Search', 24, [
    item('e5-similarity', 'Vector Similarity'),
    nest('e5-similarity', 'e5-cosine', 'Cosine Similarity'),
    nest('e5-similarity', 'e5-dot-euclidean', 'Dot Product vs Euclidean Distance'),
    nest('e5-similarity', 'e5-exact-knn', 'Exact Nearest Neighbors'),
    nest('e5-similarity', 'e5-ann', 'Approximate Nearest Neighbors', 'tier2'),
    nest('e5-similarity', 'e5-recall-latency-memory', 'Recall, Latency & Memory Trade-offs', 'tier2'),
  ]),

  section('E5.3', 'Vector Indexes & Storage', 25, [
    item('e5-vector-indexes', 'Vector Indexes', 'tier2'),
    nest('e5-vector-indexes', 'e5-hnsw', 'HNSW', 'tier2'),
    nest('e5-vector-indexes', 'e5-ivf-pq', 'IVF & Product Quantization Concepts', 'tier3'),
    nest('e5-vector-indexes', 'e5-pgvector', 'PostgreSQL + pgvector', 'tier2', {
      tags: ['postgresql'],
      related: ['c7-indexes'],
    }),
    nest('e5-vector-indexes', 'e5-managed-vector-dbs', 'Pinecone, Qdrant, Weaviate & Chroma', 'tier2'),
    nest('e5-vector-indexes', 'e5-vector-index-operations', 'Index Build, Updates, Deletes & Compaction', 'tier2'),
  ]),

  section('E5.4', 'Semantic, Keyword & Hybrid Search', 26, [
    item('e5-semantic-search', 'Semantic Search'),
    nest('e5-semantic-search', 'e5-keyword-bm25', 'Keyword Search & BM25'),
    nest('e5-semantic-search', 'e5-hybrid-search', 'Dense + Sparse Hybrid Search'),
    nest('e5-semantic-search', 'e5-metadata-filtering', 'Metadata & Access-Control Filtering'),
    nest('e5-semantic-search', 'e5-rerankers', 'Cross-Encoder Reranking'),
    nest('e5-semantic-search', 'e5-search-evaluation', 'Search Relevance Evaluation'),
  ]),

  section('E6.1', 'RAG Architecture & Knowledge Ingestion', 27, [
    item('e6-ingestion', 'RAG Ingestion'),
    nest('e6-ingestion', 'e6-rag-pipeline', 'Ingest → Index → Retrieve → Augment → Generate'),
    nest('e6-ingestion', 'e6-parsing', 'PDF, HTML, DOCX, Spreadsheet & OCR Parsing'),
    nest('e6-ingestion', 'e6-cleaning-normalization', 'Cleaning, Normalization & Boilerplate Removal'),
    nest('e6-ingestion', 'e6-metadata-provenance', 'Metadata, Provenance & Source URLs'),
    nest('e6-ingestion', 'e6-incremental-sync', 'Incremental Sync, Deletes & Reprocessing'),
  ]),

  section('E6.2', 'Chunking & Document Structure', 28, [
    item('e6-chunking', 'Chunking Strategies'),
    nest('e6-chunking', 'e6-fixed-recursive-chunking', 'Fixed, Recursive & Structure-Aware Chunking'),
    nest('e6-chunking', 'e6-semantic-chunking', 'Semantic Chunking', 'tier2'),
    nest('e6-chunking', 'e6-parent-child', 'Parent–Child & Small-to-Big Retrieval'),
    nest('e6-chunking', 'e6-overlap-boundaries', 'Overlap, Boundaries & Context Loss'),
    nest('e6-chunking', 'e6-chunk-evaluation', 'Evaluate Chunk Size by Task'),
  ]),

  section('E6.3', 'Embedding & Indexing Pipelines', 29, [
    item('e6-embedding-models', 'RAG Embedding & Indexing'),
    nest('e6-embedding-models', 'e6-indexing', 'Indexing Pipeline'),
    nest('e6-embedding-models', 'e6-batch-embedding', 'Batching, Rate Limits & Retry'),
    nest('e6-embedding-models', 'e6-index-schema', 'Chunk, Document & ACL Index Schema'),
    nest('e6-embedding-models', 'e6-index-version-migration', 'Versioning & Zero-Downtime Re-Embedding'),
    nest('e6-embedding-models', 'e6-index-freshness', 'Freshness, CDC & Event-Driven Indexing', 'tier2'),
  ]),

  section('E6.4', 'Retrieval & Reranking', 30, [
    item('e6-retrieval', 'RAG Retrieval'),
    nest('e6-retrieval', 'e6-top-k', 'Top-K & Candidate Recall'),
    nest('e6-retrieval', 'e6-metadata-filtering', 'Metadata / Tenant / ACL Filtering'),
    nest('e6-retrieval', 'e6-hybrid-retrieval', 'Dense + Sparse Hybrid Retrieval'),
    nest('e6-retrieval', 'e6-reranking', 'Reranking & Score Fusion'),
    nest('e6-retrieval', 'e6-diversity-dedup', 'Diversity, Deduplication & MMR'),
  ]),

  section('E6.5', 'Query Understanding & Retrieval Planning', 31, [
    item('e6-query-processing', 'RAG Query Processing'),
    nest('e6-query-processing', 'e6-query-rewriting', 'Query Rewriting & Normalization'),
    nest('e6-query-processing', 'e6-multi-query', 'Multi-Query Retrieval'),
    nest('e6-query-processing', 'e6-query-decomposition', 'Query Decomposition'),
    nest('e6-query-processing', 'e6-hyde', 'HyDE Concepts', 'tier2'),
    nest('e6-query-processing', 'e6-retrieval-routing', 'Route by Corpus, Modality & Intent', 'tier2'),
  ]),

  section('E6.6', 'Context Construction, Grounding & Citations', 32, [
    item('e6-context-construction', 'RAG Context Construction'),
    nest('e6-context-construction', 'e6-grounding', 'Grounding & Citations'),
    nest('e6-context-construction', 'e6-context-ranking', 'Context Ranking & Ordering'),
    nest('e6-context-construction', 'e6-context-compression', 'Context Compression & Token Budget'),
    nest('e6-context-construction', 'e6-citation-mapping', 'Claim-to-Source Citation Mapping'),
    nest('e6-context-construction', 'e6-insufficient-evidence', 'Abstain on Insufficient Evidence'),
  ]),

  section('E6.7', 'Advanced, Agentic & Multimodal RAG', 33, [
    item('e6-advanced-rag', 'Advanced RAG', 'tier2'),
    nest('e6-advanced-rag', 'e6-agentic-rag', 'Agentic Retrieval', 'tier2'),
    nest('e6-advanced-rag', 'e6-corrective-adaptive-rag', 'Corrective & Adaptive RAG', 'tier2'),
    nest('e6-advanced-rag', 'e6-graph-rag', 'Graph RAG Concepts', 'tier2'),
    nest('e6-advanced-rag', 'e6-hierarchical-rag', 'Hierarchical Retrieval', 'tier2'),
    nest('e6-advanced-rag', 'e6-multimodal-rag', 'Multimodal RAG', 'tier2'),
  ]),

  section('E6.8', 'RAG Evaluation & Failure Modes', 34, [
    item('e6-evaluation', 'RAG Evaluation', 'tier1', { related: ['e9-retrieval-metrics'] }),
    nest('e6-evaluation', 'e6-failure-modes', 'RAG Failure Modes'),
    nest('e6-evaluation', 'e6-retrieval-precision-recall', 'Retrieval Precision, Recall & NDCG'),
    nest('e6-evaluation', 'e6-context-relevance', 'Context Relevance & Coverage'),
    nest('e6-evaluation', 'e6-faithfulness-answer-relevance', 'Faithfulness & Answer Relevance'),
    nest('e6-evaluation', 'e6-citation-correctness', 'Citation Correctness & Completeness'),
    nest('e6-evaluation', 'e6-rag-security-eval', 'Poisoning & Access-Control Tests'),
  ]),

  section('E7.1', 'Agents vs Deterministic Workflows', 35, [
    item('e7-agent-loops', 'Agent Fundamentals'),
    nest('e7-agent-loops', 'e7-agent-vs-workflow', 'Agent vs Workflow'),
    nest('e7-agent-loops', 'e7-goal-action-observation', 'Goal → Decide → Act → Observe → Complete'),
    nest('e7-agent-loops', 'e7-when-not-agent', 'When Not to Use an Agent'),
    nest('e7-agent-loops', 'e7-autonomy-spectrum', 'Autonomy Spectrum & Risk'),
    nest('e7-agent-loops', 'e7-termination-conditions', 'Termination Conditions & Max Steps'),
  ]),

  section('E7.2', 'Planning, Decomposition & Verification', 36, [
    item('e7-planning', 'Agent Planning'),
    nest('e7-planning', 'e7-task-decomposition', 'Task Decomposition'),
    nest('e7-planning', 'e7-dynamic-replanning', 'Dynamic Planning & Replanning'),
    nest('e7-planning', 'e7-plan-execute-verify', 'Plan–Execute–Verify'),
    nest('e7-planning', 'e7-reflection', 'Reflection & Critique—Use Carefully', 'tier2'),
    nest('e7-planning', 'e7-deterministic-checks', 'Deterministic Verification & Assertions'),
  ]),

  section('E7.3', 'Agent Workflow Patterns', 37, [
    item('e7-workflows', 'Multi-Step Agent Workflows'),
    nest('e7-workflows', 'e7-sequential-workflow', 'Sequential Workflows'),
    nest('e7-workflows', 'e7-parallel-workflow', 'Parallel Fan-out / Fan-in'),
    nest('e7-workflows', 'e7-routing-workflow', 'Classification & Routing'),
    nest('e7-workflows', 'e7-orchestrator-worker', 'Orchestrator–Worker'),
    nest('e7-workflows', 'e7-evaluator-optimizer', 'Evaluator–Optimizer'),
    nest('e7-workflows', 'e7-human-in-loop', 'Human-in-the-Loop'),
  ]),

  section('E7.4', 'Agent State, Memory & Context', 38, [
    item('e7-state', 'Agent State'),
    nest('e7-state', 'e7-memory', 'Working, Semantic & Episodic Memory'),
    nest('e7-state', 'e7-conversation-memory', 'Conversation Windows & Summaries'),
    nest('e7-state', 'e7-checkpoint-state', 'Durable Checkpoints & Resumption'),
    nest('e7-state', 'e7-memory-extraction', 'Memory Extraction, Retrieval & Update'),
    nest('e7-state', 'e7-memory-conflicts', 'Forgetting, Conflicts, Privacy & Retention'),
  ]),

  section('E7.5', 'Agent Tool Use, Permissions & Approvals', 39, [
    item('e7-tool-calling', 'Agent Tool Calling', 'tier1', { related: ['e3-tool-calling'] }),
    nest('e7-tool-calling', 'e7-tool-selection', 'Tool Discovery & Selection'),
    nest('e7-tool-calling', 'e7-tool-permissions', 'Least-Privilege Tool Permissions'),
    nest('e7-tool-calling', 'e7-human-approval', 'Approval Gates for Consequential Actions'),
    nest('e7-tool-calling', 'e7-sandboxing', 'Sandboxing & Isolation'),
    nest('e7-tool-calling', 'e7-idempotent-actions', 'Idempotent Actions & Duplicate Prevention'),
  ]),

  section('E7.6', 'Reliable Long-Running Agents', 40, [
    item('e7-error-recovery', 'Agent Reliability'),
    nest('e7-error-recovery', 'e7-agent-timeouts-retries', 'Timeouts, Retries & Backoff'),
    nest('e7-error-recovery', 'e7-loop-detection', 'Loop Detection & Step Budgets'),
    nest('e7-error-recovery', 'e7-partial-progress', 'Partial Progress & Compensating Actions'),
    nest('e7-error-recovery', 'e7-resume-replay', 'Checkpoint, Resume & Replay'),
    nest('e7-error-recovery', 'e7-agent-escalation', 'Escalation & Honest Failure'),
  ]),

  section('E7.7', 'Multi-Agent Systems', 41, [
    item('e7-multi-agent', 'Multi-Agent Architectures', 'tier2'),
    nest('e7-multi-agent', 'e7-supervisor-specialist', 'Supervisor & Specialist Agents', 'tier2'),
    nest('e7-multi-agent', 'e7-agent-delegation', 'Delegation & Handoffs', 'tier2'),
    nest('e7-multi-agent', 'e7-shared-state', 'Shared State & Communication', 'tier2'),
    nest('e7-multi-agent', 'e7-multi-agent-evals', 'Coordination Evals & Failure Modes', 'tier2'),
    nest('e7-multi-agent', 'e7-single-vs-multi', 'One Capable Agent vs Multi-Agent', 'tier2'),
  ]),

  section('E7.8', 'MCP Architecture & Primitives', 42, [
    item('e7-mcp-fundamentals', 'Model Context Protocol Fundamentals', 'tier2'),
    nest('e7-mcp-fundamentals', 'e7-mcp-host-client-server', 'Host, Client & Server', 'tier2'),
    nest('e7-mcp-fundamentals', 'e7-mcp-tools', 'MCP Tools', 'tier2'),
    nest('e7-mcp-fundamentals', 'e7-mcp-resources', 'MCP Resources', 'tier2'),
    nest('e7-mcp-fundamentals', 'e7-mcp-prompts', 'MCP Prompts', 'tier2'),
    nest('e7-mcp-fundamentals', 'e7-mcp-vs-function', 'MCP vs Direct Function Calling', 'tier2'),
  ]),

  section('E7.9', 'Building MCP Servers & Clients', 43, [
    item('e7-mcp-building', 'Build MCP Integrations', 'tier2'),
    nest('e7-mcp-building', 'e7-mcp-server-implementation', 'Server Implementation & Capability Discovery', 'tier2'),
    nest('e7-mcp-building', 'e7-mcp-client-lifecycle', 'Client Connection & Invocation Lifecycle', 'tier2'),
    nest('e7-mcp-building', 'e7-mcp-errors', 'Errors, Timeouts & Cancellation', 'tier2'),
    nest('e7-mcp-building', 'e7-mcp-auth', 'Authentication & Authorization', 'tier2'),
    nest('e7-mcp-building', 'e7-mcp-remote', 'Remote MCP & Enterprise Integrations', 'tier2'),
  ]),

  section('E7.10', 'Production MCP Security & Operations', 44, [
    item('e7-mcp-production', 'Production MCP', 'tier2'),
    nest('e7-mcp-production', 'e7-mcp-trust-boundaries', 'Trust Boundaries & Consent', 'tier2'),
    nest('e7-mcp-production', 'e7-mcp-tenant-isolation', 'Tenant Isolation & Scoped Credentials', 'tier2'),
    nest('e7-mcp-production', 'e7-mcp-observability', 'Tool Tracing, Audit & Cost', 'tier2'),
    nest('e7-mcp-production', 'e7-mcp-versioning', 'Schema Versioning & Compatibility', 'tier2'),
    nest('e7-mcp-production', 'e7-mcp-threats', 'Prompt Injection through Tools & Resources', 'tier2'),
  ]),

  section('E8.1', 'Agent & RAG Frameworks—After Fundamentals', 45, [
    item('e8-langchain', 'AI Application Frameworks', 'tier2'),
    nest('e8-langchain', 'e8-orchestration', 'Workflow Orchestration Frameworks', 'tier2'),
    nest('e8-langchain', 'e8-langgraph', 'LangGraph State, Nodes, Edges & Persistence', 'tier2'),
    nest('e8-langchain', 'e8-llamaindex', 'LlamaIndex Ingestion & Retrieval', 'tier2'),
    nest('e8-langchain', 'e8-provider-agent-sdks', 'Provider Agent SDKs', 'tier2'),
    nest('e8-langchain', 'e8-framework-abstraction-cost', 'What Frameworks Abstract—and Hide', 'tier2'),
  ]),

  section('E8.2', 'Hugging Face & Open-Weight Ecosystem', 46, [
    item('e8-open-models', 'Open-Weight AI', 'tier2'),
    nest('e8-open-models', 'e8-hugging-face-hub', 'Hugging Face Hub, Models & Datasets', 'tier2'),
    nest('e8-open-models', 'e8-transformers-library', 'Transformers & Tokenizers Libraries', 'tier2'),
    nest('e8-open-models', 'e8-weights-checkpoints', 'Weights, Checkpoints & Safetensors', 'tier2'),
    nest('e8-open-models', 'e8-model-licenses', 'Licenses, Commercial Use & Supply Chain', 'tier2'),
    nest('e8-open-models', 'e8-hosted-vs-open', 'Hosted Frontier vs Open-Weight Decision', 'tier2'),
  ]),

  section('E8.3', 'Local Models, Formats & Quantization', 47, [
    item('e8-local-models', 'Run Models Locally', 'tier2'),
    nest('e8-local-models', 'e8-ollama', 'Ollama', 'tier2'),
    nest('e8-local-models', 'e8-llamacpp', 'llama.cpp', 'tier2'),
    nest('e8-local-models', 'e8-gguf', 'GGUF & Quantized Model Formats', 'tier2'),
    nest('e8-local-models', 'e2-quantization', 'FP16/BF16, INT8 & INT4 Quantization', 'tier2'),
    nest('e8-local-models', 'e8-quantization-tradeoffs', 'Quality, Memory & Throughput Trade-offs', 'tier2'),
  ]),

  section('E8.4', 'Model Serving & Inference Optimization', 48, [
    item('e2-gpu-inference', 'GPU Inference & Model Serving', 'tier2'),
    nest('e2-gpu-inference', 'e8-vllm', 'vLLM & Continuous Batching', 'tier2'),
    nest('e2-gpu-inference', 'e8-prefill-decode', 'Prefill vs Decode', 'tier2'),
    nest('e2-gpu-inference', 'e8-kv-prefix-cache', 'KV Cache & Prefix Caching', 'tier2'),
    nest('e2-gpu-inference', 'e8-speculative-decoding', 'Speculative Decoding', 'tier3'),
    nest('e2-gpu-inference', 'e8-serving-slo', 'Tokens/sec, TTFT, Throughput & Tail Latency', 'tier2'),
  ]),

  section('E8.5', 'Fine-Tuning & Model Customization', 49, [
    item('e2-fine-tuning', 'Fine-Tuning', 'tier2'),
    nest('e2-fine-tuning', 'e8-rag-vs-tools-vs-finetune', 'RAG vs Tools vs Fine-Tuning Decision', 'tier2'),
    nest('e2-fine-tuning', 'e8-sft-datasets', 'SFT & Instruction Dataset Quality', 'tier2'),
    nest('e2-fine-tuning', 'e8-lora-qlora-peft', 'LoRA, QLoRA & PEFT', 'tier2'),
    nest('e2-fine-tuning', 'e8-preference-dpo', 'Preference Data, RLHF & DPO Concepts', 'tier3'),
    nest('e2-fine-tuning', 'e8-distillation-synthetic', 'Distillation & Synthetic Data', 'tier2'),
    nest('e2-fine-tuning', 'e8-finetune-evaluation', 'Evaluate Behavior without Regressing Capability', 'tier2'),
  ]),

  section('E8.6', 'Multimodal Document & Vision AI', 50, [
    item('e8-multimodal', 'Multimodal AI', 'tier2'),
    nest('e8-multimodal', 'e8-vision-language', 'Vision–Language Models', 'tier2'),
    nest('e8-multimodal', 'e8-document-understanding', 'OCR, Layout & Document Understanding', 'tier2'),
    nest('e8-multimodal', 'e8-screenshot-chart', 'Screenshots, Charts & Diagram Reasoning', 'tier2'),
    nest('e8-multimodal', 'e8-image-generation', 'Diffusion, Generation, Editing & Inpainting', 'tier3'),
    nest('e8-multimodal', 'e8-video-understanding', 'Video Understanding & Generation Concepts', 'tier3'),
  ]),

  section('E8.7', 'Speech, Realtime & Voice Agents', 51, [
    item('e8-voice-ai', 'Realtime Voice AI', 'tier2'),
    nest('e8-voice-ai', 'e8-stt-tts', 'Speech-to-Text, Text-to-Speech & Speech-to-Speech', 'tier2'),
    nest('e8-voice-ai', 'e8-vad-turn-taking', 'Voice Activity Detection & Turn Taking', 'tier2'),
    nest('e8-voice-ai', 'e8-interruptions-bargein', 'Interruptions & Barge-In', 'tier2'),
    nest('e8-voice-ai', 'e8-voice-tool-calling', 'Realtime Tool Calling', 'tier2'),
    nest('e8-voice-ai', 'e8-voice-latency', 'End-to-End Latency & Streaming Audio', 'tier2'),
  ]),

  section('E8.8', 'AI Hardware & Distributed Inference', 52, [
    item('e8-ai-infrastructure', 'AI Infrastructure', 'tier3'),
    nest('e8-ai-infrastructure', 'e8-cpu-vs-gpu', 'CPU vs GPU, VRAM & Memory Bandwidth', 'tier3'),
    nest('e8-ai-infrastructure', 'e8-cuda-concepts', 'CUDA Kernels & Parallelism Concepts', 'tier3'),
    nest('e8-ai-infrastructure', 'e8-data-parallel', 'Data Parallelism', 'tier3'),
    nest('e8-ai-infrastructure', 'e8-tensor-parallel', 'Tensor Parallelism', 'tier3'),
    nest('e8-ai-infrastructure', 'e8-pipeline-parallel', 'Pipeline Parallelism', 'tier3'),
    nest('e8-ai-infrastructure', 'e8-distributed-inference', 'Distributed Inference & Model Placement', 'tier3'),
  ]),

  section('E9.1', 'Evaluation Strategy & Golden Datasets', 53, [
    item('e9-golden-datasets', 'AI Evaluation Foundations'),
    nest('e9-golden-datasets', 'e9-probabilistic-testing', 'Why Probabilistic Software Needs Evals'),
    nest('e9-golden-datasets', 'e9-curated-production-synthetic', 'Curated, Production & Synthetic Test Cases'),
    nest('e9-golden-datasets', 'e9-rubrics-slices', 'Rubrics, Failure Taxonomy & Dataset Slices'),
    nest('e9-golden-datasets', 'e9-dataset-versioning', 'Dataset Versioning & Leakage Prevention'),
    nest('e9-golden-datasets', 'e9-eval-before-change', 'Evaluate before Prompt/Model/RAG Changes'),
  ]),

  section('E9.2', 'LLM Output Evaluation', 54, [
    item('e9-offline-evals', 'Offline LLM Evaluations'),
    nest('e9-offline-evals', 'e9-correctness', 'Answer Correctness & Task-Specific Metrics'),
    nest('e9-offline-evals', 'e9-groundedness', 'Groundedness & Hallucination Measurement'),
    nest('e9-offline-evals', 'e9-exact-semantic-match', 'Exact Match vs Semantic Similarity'),
    nest('e9-offline-evals', 'e9-llm-as-judge', 'LLM-as-Judge, Rubrics & Calibration', 'tier2'),
    nest('e9-offline-evals', 'e9-human-eval', 'Human Evaluation & Inter-Rater Agreement'),
  ]),

  section('E9.3', 'Retrieval & RAG Evaluation', 55, [
    item('e9-retrieval-metrics', 'Retrieval Evaluation'),
    nest('e9-retrieval-metrics', 'e9-recall-precision-k', 'Recall@K, Precision@K, MRR & NDCG'),
    nest('e9-retrieval-metrics', 'e9-context-faithfulness', 'Context Relevance & Faithfulness'),
    nest('e9-retrieval-metrics', 'e9-citation-eval', 'Citation Accuracy & Coverage'),
    nest('e9-retrieval-metrics', 'e9-end-to-end-rag', 'Component vs End-to-End RAG Evals'),
    nest('e9-retrieval-metrics', 'e9-rag-ablation', 'Chunking/Retrieval/Reranking Ablations', 'tier2'),
  ]),

  section('E9.4', 'Agent & Tool-Use Evaluation', 56, [
    item('e9-tool-correctness', 'Agent Evaluation'),
    nest('e9-tool-correctness', 'e9-tool-selection-arguments', 'Tool Selection & Argument Correctness'),
    nest('e9-tool-correctness', 'e9-task-success', 'Task Success, Partial Credit & Side Effects'),
    nest('e9-tool-correctness', 'e9-agent-steps-cost', 'Steps, Latency, Tokens & Cost'),
    nest('e9-tool-correctness', 'e9-trajectory-evaluation', 'Trajectory vs Final-Outcome Evaluation'),
    nest('e9-tool-correctness', 'e9-agent-safety-evals', 'Permission, Injection & Destructive-Action Evals'),
  ]),

  section('E9.5', 'Regression, Online Experiments & Feedback', 57, [
    item('e9-regression', 'AI Regression Testing'),
    nest('e9-regression', 'e9-prompt-model-retrieval-regression', 'Prompt, Model, Retrieval & Agent Regression'),
    nest('e9-regression', 'e9-ab-testing', 'A/B Testing & Guardrail Metrics', 'tier2'),
    nest('e9-regression', 'e9-online-feedback', 'Explicit/Implicit User Feedback'),
    nest('e9-regression', 'e9-shadow-canary', 'Shadow, Canary & Progressive Rollout', 'tier2'),
    nest('e9-regression', 'e9-eval-monitoring-loop', 'Production Samples → Evals → Improvement Loop'),
  ]),

  section('E10.1', 'Production AI Reference Architecture', 58, [
    item('e10-production-architecture', 'Production AI Architecture'),
    nest('e10-production-architecture', 'e10-ai-gateway', 'AI Gateway & Orchestrator'),
    nest('e10-production-architecture', 'e10-model-retrieval-tools-memory', 'Models, Retrieval, Tools & Memory Boundaries'),
    nest('e10-production-architecture', 'e10-tenant-identity', 'Authentication, Tenant Context & Entitlements'),
    nest('e10-production-architecture', 'e10-versioned-artifacts', 'Version Prompts, Models, Indexes & Tools'),
    nest('e10-production-architecture', 'e10-ai-system-design-tradeoffs', 'Quality, Latency, Reliability, Security & Cost'),
  ]),

  section('E10.2', 'Streaming, Async Jobs & Backend Infrastructure', 59, [
    item('e10-streaming', 'Streaming AI Responses'),
    nest('e10-streaming', 'e10-async', 'Async Processing'),
    nest('e10-streaming', 'e10-queues', 'Queues & Workers', 'tier1', { related: ['d5-queues'] }),
    nest('e10-streaming', 'e10-sse-websocket', 'SSE vs WebSocket vs Polling'),
    nest('e10-streaming', 'e10-cancellation', 'Cancellation, Backpressure & Disconnects'),
    nest('e10-streaming', 'e10-job-state', 'Long-Running Job State & Resume'),
  ]),

  section('E10.3', 'AI Performance, Caching & Context Efficiency', 60, [
    item('e10-caching', 'AI Performance & Caching', 'tier1', { related: ['c10-cache-aside'] }),
    nest('e10-caching', 'e10-prompt-cache', 'Prompt / Prefix Caching'),
    nest('e10-caching', 'e10-semantic-cache', 'Semantic Caching & Correctness Risk'),
    nest('e10-caching', 'e10-token-budgets', 'Token & Context Budgets'),
    nest('e10-caching', 'e10-parallelization', 'Parallel Retrieval & Tool Calls'),
    nest('e10-caching', 'e10-batching-pooling', 'Batching & Connection Pooling'),
  ]),

  section('E10.4', 'Reliability, Limits & Graceful Degradation', 61, [
    item('e10-reliability', 'Production AI Reliability'),
    nest('e10-reliability', 'e10-timeouts', 'Timeouts & Deadline Budgets'),
    nest('e10-reliability', 'e10-retries', 'Safe Retries & Backoff'),
    nest('e10-reliability', 'e10-rate-limiting', 'Rate Limiting & Admission Control'),
    nest('e10-reliability', 'e10-fallbacks', 'Fallback Models & Deterministic Fallbacks'),
    nest('e10-reliability', 'e10-circuit-breakers', 'Circuit Breakers & Provider Isolation'),
    nest('e10-reliability', 'e10-graceful-degradation', 'Graceful Degradation & Human Escalation'),
  ]),

  section('E10.5', 'Model Routing & Cost Engineering', 62, [
    item('e10-model-routing', 'Model Routing'),
    nest('e10-model-routing', 'e10-cost-tracking', 'Cost per Request, User & Successful Task'),
    nest('e10-model-routing', 'e10-small-vs-frontier', 'Small/Fast vs Frontier/Reasoning Models'),
    nest('e10-model-routing', 'e10-dynamic-routing', 'Rules, Classifiers & Dynamic Routing'),
    nest('e10-model-routing', 'e10-batch-api', 'Batch Processing & Deferred Work'),
    nest('e10-model-routing', 'e10-context-reduction', 'Context Reduction without Quality Loss'),
    nest('e10-model-routing', 'e10-cost-budgets', 'Per-Tenant Cost Budgets & Quotas'),
  ]),

  section('E10.6', 'AI Observability & Quality Monitoring', 63, [
    item('e10-observability', 'AI Observability', 'tier1', { related: ['c16-otel'] }),
    nest('e10-observability', 'e10-trace-model-retrieval-tools', 'Trace Model, Retrieval, Tool & Agent Steps'),
    nest('e10-observability', 'e10-version-tracking', 'Prompt, Model, Index & Tool Version Tracking'),
    nest('e10-observability', 'e10-latency-token-cost', 'Latency, Tokens, Cost & Error Metrics'),
    nest('e10-observability', 'e10-quality-signals', 'Quality, Groundedness & Task-Success Signals'),
    nest('e10-observability', 'e10-user-feedback-monitoring', 'Feedback, Drift & Regression Detection'),
  ]),

  section('E10.7', 'AI Product Engineering & Decision Framework', 64, [
    item('e10-product-engineering', 'AI Product Engineering'),
    nest('e10-product-engineering', 'e10-ai-suitable-problems', 'AI-Suitable vs Deterministic Problems'),
    nest('e10-product-engineering', 'e10-uncertainty-ux', 'UX for Uncertainty, Sources & Editable Outputs'),
    nest('e10-product-engineering', 'e10-approval-escalation-ux', 'Approval, Retry & Human Escalation'),
    nest('e10-product-engineering', 'e10-product-metrics', 'Task Completion, Acceptance, Retention & Cost/Task'),
    nest('e10-product-engineering', 'e10-build-buy', 'Build vs Buy & Provider Lock-In'),
    nest('e10-product-engineering', 'e10-architecture-decision-tree', 'RAG vs Tools vs Agents vs Fine-Tuning vs Open Models'),
  ]),

  section('E11.1', 'Prompt Injection & Untrusted Content', 65, [
    item('e11-prompt-injection', 'Prompt Injection'),
    nest('e11-prompt-injection', 'e11-indirect-injection', 'Indirect Prompt Injection'),
    nest('e11-prompt-injection', 'e11-jailbreaks', 'Jailbreaks & Instruction Conflicts'),
    nest('e11-prompt-injection', 'e11-trusted-untrusted-channels', 'Separate Trusted Instructions from Untrusted Data'),
    nest('e11-prompt-injection', 'e11-malicious-tool-output', 'Malicious Tool Output & Cross-Domain Injection'),
    nest('e11-prompt-injection', 'e11-defense-in-depth', 'Defense in Depth—not Prompt-Only Defenses'),
  ]),

  section('E11.2', 'Agent Security, Agency & Tool Abuse', 66, [
    item('e11-tool-abuse', 'Agent & Tool Security'),
    nest('e11-tool-abuse', 'e11-excessive-agency', 'Excessive Agency'),
    nest('e11-tool-abuse', 'e11-permissions', 'Least-Privilege Permission Boundaries'),
    nest('e11-tool-abuse', 'e11-auth-not-model', 'The Model Is Never the Authorization Layer'),
    nest('e11-tool-abuse', 'e11-approval-gates', 'Human Approval for Consequential Actions'),
    nest('e11-tool-abuse', 'e11-sandbox-audit', 'Sandboxing, Idempotency & Audit Logs'),
  ]),

  section('E11.3', 'Data, Tenant & RAG Security', 67, [
    item('e11-data-leakage', 'AI Data Security'),
    nest('e11-data-leakage', 'e11-sensitive-data', 'Sensitive Data & PII Handling'),
    nest('e11-data-leakage', 'e10-pii', 'Production PII Detection & Redaction'),
    nest('e11-data-leakage', 'e10-secrets', 'Provider and Tool Secrets'),
    nest('e11-data-leakage', 'e10-access-control', 'Application Access Control'),
    nest('e11-data-leakage', 'e11-tenant-isolation', 'Tenant-Isolated Retrieval & Memory'),
    nest('e11-data-leakage', 'e11-poisoned-rag', 'Poisoned Documents & Knowledge Bases'),
    nest('e11-data-leakage', 'e11-access-controlled-retrieval', 'Access-Controlled Retrieval before Generation'),
    nest('e11-data-leakage', 'e11-retention-encryption', 'Retention, Encryption & Provider Data Policies'),
  ]),

  section('E11.4', 'Input/Output Safety & Responsible AI', 68, [
    item('e11-io-validation', 'AI Input & Output Safety'),
    nest('e11-io-validation', 'e11-schema-allowlist', 'Schema Validation, Allowlists & Safe Rendering'),
    nest('e11-io-validation', 'e11-harmful-content', 'Harmful Content & Moderation Boundaries'),
    nest('e11-io-validation', 'e11-bias-fairness', 'Bias, Fairness & Dataset Representation'),
    nest('e11-io-validation', 'e11-transparency', 'Transparency, Sources & User Disclosure'),
    nest('e11-io-validation', 'e11-human-oversight', 'Human Oversight & Contestability'),
  ]),

  section('E11.5', 'Adversarial Testing & AI Threat Modeling', 69, [
    item('e11-adversarial', 'Adversarial AI Testing', 'tier2'),
    nest('e11-adversarial', 'e11-threat-model', 'Assets, Actors, Trust Boundaries & Abuse Cases', 'tier2'),
    nest('e11-adversarial', 'e11-red-team-dataset', 'Injection/Jailbreak Red-Team Dataset', 'tier2'),
    nest('e11-adversarial', 'e11-tool-exfiltration-tests', 'Tool Abuse & Exfiltration Tests', 'tier2'),
    nest('e11-adversarial', 'e11-security-regression', 'Security Regression Evals', 'tier2'),
    nest('e11-adversarial', 'e11-incident-response', 'AI Security Incident Response', 'tier2'),
  ]),

  section('E12.1', 'Project: Intelligent Document Analyzer', 70, [
    item('e12-document-analysis', 'Document-Analysis Platform'),
    nest('e12-document-analysis', 'e12-doc-multiformat', 'PDF, DOCX, Image, OCR & Layout'),
    nest('e12-document-analysis', 'e12-doc-structured-extraction', 'Typed Extraction & Validation'),
    nest('e12-document-analysis', 'e12-doc-citations-actions', 'Questions, Citations & Suggested Actions'),
    nest('e12-document-analysis', 'e12-doc-evals-security', 'Golden Evals, PII & Malicious Documents'),
  ], 'system-design'),

  section('E12.2', 'Project: Production Enterprise RAG', 71, [
    item('e12-enterprise-rag', 'Enterprise RAG & Search System'),
    nest('e12-enterprise-rag', 'e12-rag-500-docs', '500+ Documents & Incremental Ingestion'),
    nest('e12-enterprise-rag', 'e12-rag-hybrid-rerank', 'Hybrid Retrieval, Reranking & Citations'),
    nest('e12-enterprise-rag', 'e12-rag-acl-tenancy', 'ACL-Aware Multi-Tenant Retrieval'),
    nest('e12-enterprise-rag', 'e12-rag-eval-observe', 'RAG Evals, Tracing & Hallucination Handling'),
  ], 'system-design'),

  section('E12.3', 'Project: AI Customer Support System', 72, [
    item('e12-ai-support', 'AI Customer-Support System'),
    nest('e12-ai-support', 'e12-support-intent-route', 'Intent, Routing & Knowledge Retrieval'),
    nest('e12-ai-support', 'e12-support-crm-tools', 'CRM Tools & Ticket Actions'),
    nest('e12-ai-support', 'e12-support-escalation', 'Confidence, Approval & Human Escalation'),
    nest('e12-ai-support', 'e12-support-quality-cost', 'Resolution Quality, Latency & Cost/Case'),
  ], 'system-design'),

  section('E12.4', 'Project: Repository-Aware Coding Assistant', 73, [
    item('e12-coding-assistant', 'Coding Assistant'),
    nest('e12-coding-assistant', 'e12-code-index-context', 'Repository Indexing & Context Selection'),
    nest('e12-coding-assistant', 'e12-code-tools-sandbox', 'Search, Edit, Test & Sandboxed Shell Tools'),
    nest('e12-coding-assistant', 'e12-code-plan-review', 'Planning, Diff Review & Human Approval'),
    nest('e12-coding-assistant', 'e12-code-evals', 'Patch Correctness, Test & Security Evals'),
  ], 'system-design'),

  section('E12.5', 'Project: AI Research Assistant', 74, [
    item('e12-research-assistant', 'AI Research Assistant'),
    nest('e12-research-assistant', 'e12-research-search-fetch', 'Search, Fetch & Source Quality'),
    nest('e12-research-assistant', 'e12-research-synthesis', 'Multi-Source Synthesis & Contradictions'),
    nest('e12-research-assistant', 'e12-research-citations', 'Claim-Level Citations & Verification'),
    nest('e12-research-assistant', 'e12-research-longrunning', 'Long-Running Workflow, Checkpoints & Cost'),
  ], 'system-design'),

  section('E12.6', 'Project: Tool-Using Productivity Agent', 75, [
    item('e12-tool-agent', 'AI Agent with External Tools'),
    nest('e12-tool-agent', 'e12-agent-calendar-email', 'Calendar, Email, Tasks, Web & Weather Tools'),
    nest('e12-tool-agent', 'e12-agent-state-memory', 'State, Memory & Resumable Workflows'),
    nest('e12-tool-agent', 'e12-agent-permissions', 'Scoped Credentials, Approval & Idempotency'),
    nest('e12-tool-agent', 'e12-agent-task-evals', 'Task-Success, Tool & Safety Evals'),
  ], 'system-design'),

  section('E12.7', 'Project: Recommendation & Personalization', 76, [
    item('e12-recommendation', 'Recommendation & Personalization System', 'tier2'),
    nest('e12-recommendation', 'e12-rec-candidate-ranking', 'Candidate Generation & Ranking', 'tier2'),
    nest('e12-recommendation', 'e12-rec-embeddings-feedback', 'Embeddings & Online Feedback', 'tier2'),
    nest('e12-recommendation', 'e12-rec-coldstart-explore', 'Cold Start, Exploration & Diversity', 'tier2'),
    nest('e12-recommendation', 'e12-rec-bias-metrics', 'Bias, Business Metrics & A/B Tests', 'tier2'),
  ], 'system-design'),

  section('E12.8', 'Capstone: Multi-Tenant AI Executive Assistant', 77, [
    item('e12-multi-tenant', 'Multi-Tenant Production AI Platform', 'tier2'),
    nest('e12-multi-tenant', 'e12-capstone-multimodal', 'Web, Mobile, Document & Voice Inputs', 'tier2'),
    nest('e12-multi-tenant', 'e12-capstone-router-rag-agent', 'Model Router + RAG + Agent + MCP', 'tier2'),
    nest('e12-multi-tenant', 'e12-capstone-memory-tools', 'Tenant Memory, Tools & Human Approval', 'tier2'),
    nest('e12-multi-tenant', 'e12-capstone-evals-security', 'Evals, Injection Defense & Access Control', 'tier2'),
    nest('e12-multi-tenant', 'e12-capstone-observe-cost', 'Tracing, Reliability, Caching & Cost Budgets', 'tier2'),
  ], 'system-design'),
]
