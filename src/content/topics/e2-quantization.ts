import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Quantization reduces weight/activation precision (FP16→INT8/INT4) lowering memory and bandwidth with minimal accuracy loss — PTQ post-training or QAT aware training.',
  whyExists: 'Full FP16 models exceed GPU RAM and bandwidth. Quantization enables larger models, faster inference, and edge deployment.',
  mentalModel: 'Compress photo quality: fewer bits per number; calibrate scale/zero-point so INT8 approximates FP32 range.',
  howItWorks: [
    { type: 'list', items: [
      'Post-training quant: calibrate on sample data for scales',
      'INT8/INT4 weights; sometimes activations quantized',
      'GPTQ/AWQ methods for LLM weight-only quant',
      'QAT trains with fake quant nodes',
      'Dequant in matmul: int * scale → fp accumulate',
    ] },
  ],
  example: [
    { type: 'code', language: 'python', code: '# Concept: weight_int8 = round(weight_fp32 / scale)\n# matmul uses int8 with output rescale', caption: 'Scale quantize' },
  ],
  tradeoffs: {
    advantages: [
      '2-4x memory savings',
      'Faster inference',
    ],
    disadvantages: [
      'Accuracy drop on hard tasks',
      'Hardware/kernel support needed',
    ],
    alternatives: [
      'Smaller model distillation',
      'FP16 only',
    ],
    whenToUse: [
      'Cost-sensitive serving',
      'Edge devices',
    ],
    whenNotToUse: [
      'Max accuracy research baseline',
    ],
  },
  failureModes: [
    'Bad calibration set → high perplexity',
    'Outlier channels break INT8',
    'Mixed precision bugs in custom ops',
  ],
  production: {
    performance: [
      'Benchmark perplexity + task eval after quant',
    ],
    cost: [
      'INT4 fits model on single GPU',
    ],
    reliability: [
      'A/B quant vs FP16 in shadow',
    ],
  },
  interview: {
    expectations: [
      'Why quantize',
      'PTQ vs QAT',
    ],
    commonQuestions: [
      'Quantization tradeoffs?',
    ],
    followUps: [
      'GPTQ/AWQ for LLMs?',
    ],
    misconceptions: [
      'Always free speedup on CPU',
    ],
    traps: [
      'No eval after quant',
    ],
    strongSignals: [
      'Calibration, scale/zero-point, weight-only',
    ],
  },
  keyTakeaways: [
    'Lower bit width saves RAM/bandwidth',
    'Calibrate scales on sample data',
    'LLM weight-only GPTQ/AWQ common',
    'Always eval after quant',
    'QAT when PTQ insufficient',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Why quantize?', answerHint: 'Smaller faster models; fit in VRAM.' },
    { level: 'intermediate', question: 'PTQ vs QAT?', answerHint: 'PTQ after train; QAT simulates quant during train.' },
    { level: 'advanced', question: 'Weight-only quant?', answerHint: 'Keep activations FP16; compress weights INT4.' },
  ],
  flashcards: [
    { front: 'PTQ', back: 'Post-training quantization via calibration' },
    { front: 'Scale factor', back: 'Maps float range to int representation' },
  ],
  quickRevision: [
    'INT8/INT4 weights',
    'Calibrate scales',
    'GPTQ/AWQ LLM',
    'Eval after quant',
    'QAT if PTQ fails',
    'Bandwidth savings',
  ],
}
