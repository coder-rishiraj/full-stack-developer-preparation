import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'GPU inference runs model forward passes on accelerators — batching, KV-cache for autoregressive decode, tensor parallelism, and memory bandwidth dominate latency/throughput.',
  whyExists: 'LLM matrix ops parallelize on GPU; CPU too slow at scale. Production serving needs GPU scheduling, batching, and memory management.',
  mentalModel: 'Factory assembly line: prefill processes prompt in parallel; decode generates tokens sequentially reusing KV-cache; batch fills GPU lanes.',
  howItWorks: [
    { type: 'list', items: [
      'Prefill: parallel attention over prompt tokens',
      'Decode: autoregressive one token at a time; KV-cache avoids recomputing past',
      'Continuous batching merges requests dynamically',
      'Tensor parallelism splits layers across GPUs',
      'Quantization (INT8/FP8) reduces memory bandwidth need',
    ] },
  ],
  example: [
    { type: 'code', language: 'text', code: 'TTFT = time to first token (prefill bound)\nTPOT = time per output token (decode bound)\nBatching improves GPU utilization vs batch=1', caption: 'Latency metrics' },
  ],
  tradeoffs: {
    advantages: [
      'High throughput matmul',
      'Batch amortizes cost',
    ],
    disadvantages: [
      'VRAM limits model size',
      'Batching adds queue latency',
    ],
    alternatives: [
      'CPU inference small models',
      'Specialized ASIC',
    ],
    whenToUse: [
      'Production LLM serving',
    ],
    whenNotToUse: [
      'Tiny models on edge CPU OK',
    ],
  },
  failureModes: [
    'OOM from long context KV-cache',
    'Head-of-line blocking in static batch',
    'Cold GPU underutilization batch=1',
  ],
  production: {
    performance: [
      'Continuous batching; paged KV-cache',
      'Right-size GPU for model+context',
    ],
    cost: [
      'Spot instances; scale to zero off-peak',
    ],
    observability: [
      'TTFT, TPOT, GPU util metrics',
    ],
  },
  interview: {
    expectations: [
      'Prefill vs decode',
      'KV-cache purpose',
    ],
    commonQuestions: [
      'Why GPU for LLM?',
    ],
    followUps: [
      'Continuous batching?',
    ],
    misconceptions: [
      'All tokens equally parallel in decode',
    ],
    traps: [
      'Ignore KV-cache memory growth',
    ],
    strongSignals: [
      'TTFT/TPOT, batching, tensor parallel',
    ],
  },
  keyTakeaways: [
    'Prefill parallel; decode sequential',
    'KV-cache saves recompute',
    'Batching boosts throughput',
    'VRAM limits context batch',
    'Quantization helps bandwidth',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Why GPU for inference?', answerHint: 'Parallel matrix ops; high memory bandwidth.' },
    { level: 'intermediate', question: 'KV-cache?', answerHint: 'Stores past K/V tensors; avoid re-attending prior tokens.' },
    { level: 'advanced', question: 'Continuous batching?', answerHint: 'Add/remove requests mid-flight in decode loop.' },
  ],
  flashcards: [
    { front: 'TTFT', back: 'Time to first token — prefill latency' },
    { front: 'KV-cache', back: 'Cached keys/values for prior tokens in decode' },
  ],
  quickRevision: [
    'Prefill vs decode',
    'KV-cache memory',
    'Batch for util',
    'Tensor parallel big models',
    'Quantize bandwidth',
    'TTFT/TPOT metrics',
  ],
}
