import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'LangChain is a Python/JS framework composing LLM apps — chains, retrievers, tools, memory, and LangGraph for stateful agent workflows with provider adapters.',
  whyExists: 'Raw API calls sprawl. LangChain standardizes RAG/agent patterns with pluggable components — speed prototyping; understand before prod hardening.',
  mentalModel: 'Lego kit for LLM pipelines — retriever block + prompt template + model + output parser snap together; LangGraph adds cyclic agent graphs.',
  howItWorks: [
    { type: 'list', items: [
      'LCEL: pipe Runnable components.',
      'VectorStore retriever interface.',
      'Tool binding and AgentExecutor loops.',
      'LangGraph: nodes, edges, checkpoint state.',
      'Callbacks for tracing LangSmith.',
    ] },
  ],
  example: [
    { type: 'code', language: 'python', code: 'chain = (\n  {"context": retriever, "question": RunnablePassthrough()}\n  | prompt\n  | llm\n  | StrOutputParser()\n)\nchain.invoke("Refund policy?")', caption: 'Minimal RAG chain' },
  ],
  tradeoffs: {
    advantages: [
      'Fast prototype',
      'Large ecosystem',
    ],
    disadvantages: [
      'Abstraction leak',
      'Version churn',
    ],
    alternatives: [
      'Direct SDK',
      'LlamaIndex',
      'Custom gateway',
    ],
    whenToUse: [
      'Prototypes and standard RAG',
    ],
    whenNotToUse: [
      'Ultra-tuned prod without abstraction control',
    ],
  },
  failureModes: [
    'Hidden retries and token blowup',
    'Outdated tutorial APIs',
    'Debug difficulty in deep chains',
  ],
  production: {
    maintainability: [
      'Pin versions; wrap not embed deeply',
    ],
    observability: [
      'LangSmith or OTel callbacks',
    ],
    cost: [
      'Explicit max_iterations on agents',
    ],
  },
  interview: {
    expectations: [
      'Chains vs agents',
      'LangGraph state',
    ],
    commonQuestions: [
      'LangChain use when?',
    ],
    followUps: [
      'Prod concerns?',
    ],
    misconceptions: [
      'Required for all LLM apps',
    ],
    traps: [
      'Copy tutorial AgentExecutor defaults',
    ],
    strongSignals: [
      'Know when to drop to SDK',
      'LangGraph for cyclic flows',
    ],
  },
  keyTakeaways: [
    'Composable LLM pipelines',
    'LangGraph for agents',
    'Good for prototypes',
    'Pin versions in prod',
    'Wrap; observe token loops',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'LangChain purpose?', answerHint: 'Framework composing retrievers, prompts, models, tools, agents.' },
    { level: 'intermediate', question: 'LangGraph vs Chain?', answerHint: 'Graph supports cycles, branching, checkpointed agent state.' },
    { level: 'advanced', question: 'Prod migration from LangChain?', answerHint: 'Extract core logic; custom gateway for auth, cost, observability.' },
  ],
  flashcards: [
    { front: 'LCEL', back: 'LangChain Expression Language — pipe Runnables' },
    { front: 'LangGraph', back: 'Stateful graph orchestration for agents' },
    { front: 'Retriever', back: 'Interface returning docs for question' },
  ],
  quickRevision: [
    'LCEL pipes',
    'LangGraph agents',
    'Prototype speed',
    'Pin versions',
    'Custom gateway prod',
  ],
}
