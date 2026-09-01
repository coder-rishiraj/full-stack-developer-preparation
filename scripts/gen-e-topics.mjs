import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "../src/content/topics");

const topics = {
  "e1-venvs": {
    whatIsIt: "A virtual environment (venv) is an isolated Python runtime directory containing its own interpreter symlink, site-packages, and pip. It lets each project pin dependencies without polluting the global Python install or conflicting with other projects.",
    whyExists: "Python packages install globally by default. Two projects needing different versions of LangChain, PyTorch, or pydantic break each other. venvs give reproducible, per-project dependency graphs — critical before shipping LLM apps where version skew causes silent API incompatibilities.",
    mentalModel: "Each venv is a separate toolbox drawer. You activate one drawer before working; pip installs go only into that drawer. Deleting the drawer removes all project deps without touching system Python.",
    howItWorks: [
      { type: "list", items: [
        "python -m venv .venv creates bin/python, lib/python3.x/site-packages, pyvenv.cfg.",
        "source .venv/bin/activate prepends venv bin to PATH — which python points to venv.",
        "pip install writes wheels only into venv site-packages.",
        "pyvenv.cfg records base Python path; venv is lightweight — no full copy of stdlib.",
        "Deactivate restores system PATH; CI uses venv per job or Docker instead.",
      ]},
      { type: "callout", variant: "tip", title: "Production parity", text: "Lock deps with requirements.txt or pyproject.toml + uv/poetry. Same lockfile in dev venv and Docker build." },
    ],
    example: [
      { type: "code", language: "bash", caption: "Typical AI project setup", code: `python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install openai langchain pydantic
pip freeze > requirements.txt` },
    ],
    tradeoffs: {
      advantages: ["Isolated dependency sets", "Reproducible via lockfiles", "Safe to delete and recreate"],
      disadvantages: ["Per-project disk use", "Easy to forget activate", "Does not isolate system libs (CUDA)"],
      alternatives: ["conda/mamba for CUDA stacks", "Docker for full OS isolation", "uv for faster venv + sync"],
      whenToUse: ["Every Python LLM/RAG project", "Before pip installing anything"],
      whenNotToUse: ["Single global tooling only (rare)", "When Docker is sole runtime"],
    },
    failureModes: [
      "Forgot activate — pip installs globally, import errors in CI",
      "Committed .venv to git — huge repo, platform-specific binaries",
      "requirements.txt without pins — rebuild breaks on new upstream release",
      "Mixed python3.11 venv with python3.12 system — subtle pickle/pydantic issues",
      "CUDA PyTorch in venv but wrong driver on host",
    ],
    production: {
      reliability: ["Pin versions in lockfile; hash-check in CI", "Same Python minor in dev and prod image"],
      maintainability: [".venv in .gitignore; document activate in README", "Use pyproject.toml for single source of truth"],
      cost: ["Smaller images when multi-stage Docker copies only site-packages"],
      security: ["Audit venv deps with pip-audit or dependabot"],
    },
    interview: {
      expectations: ["Explain isolation mechanism", "venv vs conda vs Docker", "Lockfile discipline"],
      commonQuestions: ["Why use a virtual environment?", "What happens if you skip venv?"],
      followUps: ["How do you reproduce prod locally?", "uv vs poetry?"],
      misconceptions: ["venv bundles Python entirely", "global pip is fine for one project"],
      traps: ["No version pinning in requirements.txt"],
      strongSignals: ["activate + lockfile + .gitignore", "CI creates fresh venv each run"],
    },
    keyTakeaways: [
      "One venv per project; never pip install globally for app deps.",
      "Activate before install/run; verify with which python.",
      "Lock dependencies; same Python minor in dev and prod.",
      "venv isolates packages, not OS/CUDA — use conda or Docker when needed.",
      ".venv belongs in .gitignore; commit lockfiles instead.",
    ],
    interviewQuestions: [
      { level: "basic", question: "What is a Python virtual environment?", answerHint: "Isolated site-packages + interpreter shim per project; avoids global dependency conflicts." },
      { level: "intermediate", question: "venv vs Docker for an LLM service?", answerHint: "venv for dev speed; Docker for prod parity, OS libs, reproducible deploy. Often both: venv locally, Docker in CI/prod." },
      { level: "advanced", question: "How ensure reproducible builds across machines?", answerHint: "Lockfile with exact pins/hashes; fixed Python version; CI fresh venv; optional uv/poetry export." },
    ],
    flashcards: [
      { front: "python -m venv .venv", back: "Creates isolated environment in .venv directory" },
      { front: "site-packages", back: "Directory where pip installs packages for active venv" },
      { front: "Why lockfile?", back: "Reproducible installs; prevents upstream drift breaking builds" },
    ],
    quickRevision: ["One venv per project", "Activate before pip", "Lock deps", "Gitignore .venv", "Match Python minor in prod"],
  },

  "e2-ml-vs-dl-vs-genai": {
    whatIsIt: "Machine learning learns patterns from data via algorithms (linear regression, random forests). Deep learning uses multi-layer neural networks for representation learning. Generative AI produces new content (text, images) — modern LLMs are deep generative models trained on massive corpora.",
    whyExists: "Interviewers and architects need a crisp ladder: classical ML for tabular prediction, DL for vision/NLP complexity, GenAI for open-ended generation. Wrong tier wastes cost (LLM for a logistic regression task) or fails quality (rules engine for summarization).",
    mentalModel: "ML = learn a function from labeled examples. DL = same but function is a deep stack of matrices with automatic feature learning. GenAI = DL models whose output space is language/media, not just a class label.",
    howItWorks: [
      { type: "table", headers: ["Layer", "Input", "Output", "Typical use"], rows: [
        ["Classical ML", "Tabular features", "Label/score", "Fraud, churn, ranking features"],
        ["Deep Learning", "Raw/high-dim", "Embedding/class", "Vision, speech, old NLP"],
        ["Generative AI", "Prompt + context", "Tokens/media", "Chat, code, RAG, agents"],
      ]},
      { type: "list", items: [
        "ML: feature engineering + sklearn/XGBoost; needs structured data.",
        "DL: backprop through layers; GPUs; less manual features.",
        "GenAI: transformer LLMs; pretrain + alignment; API or self-host.",
      ]},
    ],
    example: [
      { type: "paragraph", text: "Spam filter: Naive Bayes (ML). Image cat/dog: CNN (DL). Draft support reply from ticket history: GPT-class model (GenAI). Hybrid: ML routes ticket urgency, RAG+LLM drafts answer." },
    ],
    tradeoffs: {
      advantages: ["Right tool per problem — cost and latency match task", "GenAI composes with ML/DL in pipelines"],
      disadvantages: ["GenAI overkill for simple classification", "ML cannot do open-ended generation"],
      alternatives: ["Rules/heuristics for deterministic logic", "Retrieval-only without generation"],
      whenToUse: ["GenAI: language, reasoning, synthesis", "ML: structured prediction at scale", "DL: perception-heavy"],
      whenNotToUse: ["LLM for exact arithmetic or strict policy without guardrails"],
    },
    failureModes: [
      "LLM for binary classifier — 100x cost vs XGBoost",
      "Classical ML on raw PDF text without embeddings",
      "Treating GenAI output as ground truth",
      "Ignoring that LLMs are probabilistic, not rule engines",
    ],
    production: {
      cost: ["Route simple tasks to small models or ML; reserve frontier LLM for hard paths"],
      reliability: ["Hybrid stacks: ML gate + LLM generate + validator"],
      maintainability: ["Document decision boundary per use case in architecture ADR"],
    },
    interview: {
      expectations: ["Three-tier distinction", "When NOT to use LLM", "Hybrid examples"],
      commonQuestions: ["ML vs DL vs GenAI?", "When would you not use an LLM?"],
      followUps: ["Design support bot — what uses what?", "Cost implications?"],
      misconceptions: ["GenAI replaces all ML", "LLMs understand like humans"],
      traps: ["LLM for everything in system design"],
      strongSignals: ["Cost/latency tiering", "ML for routing, LLM for language"],
    },
    keyTakeaways: [
      "ML: structured data, interpretable models, cheap inference.",
      "DL: automatic features, GPU training, perception and sequence.",
      "GenAI: generates novel text/media; LLMs are DL + scale + alignment.",
      "Production systems mix tiers — do not default to largest LLM.",
      "GenAI needs guardrails; ML/DL need labeled data and drift monitoring.",
    ],
    interviewQuestions: [
      { level: "basic", question: "Difference between ML, DL, and GenAI?", answerHint: "ML: algorithms on features; DL: neural nets learn features; GenAI: generates content, LLMs are generative DL." },
      { level: "intermediate", question: "When choose XGBoost over GPT?", answerHint: "Tabular structured prediction, need interpretability, strict latency/cost, sufficient labels." },
      { level: "advanced", question: "Hybrid architecture for fraud + explanation?", answerHint: "ML model scores; LLM explains score using feature attributions; human review on edge cases." },
    ],
    flashcards: [
      { front: "Generative AI", back: "Models that produce new content (text, images), not just classify" },
      { front: "Deep learning", back: "Neural networks with many layers; automatic feature learning" },
      { front: "When not LLM?", back: "Simple classification, exact computation, strict deterministic rules" },
    ],
    quickRevision: ["ML=tabular", "DL=neural nets", "GenAI=generate", "Hybrid prod stacks", "LLM not for all tasks"],
  },

  "e2-training-vs-inference": {
    whatIsIt: "Training updates model weights using loss backpropagation on large datasets — expensive, batch-oriented, weeks on GPU clusters. Inference runs the frozen forward pass on new inputs — latency-sensitive, per-request, what production APIs expose.",
    whyExists: "Confusing the two leads to bad SLOs (expecting train-time batch on live API), cost blowups (fine-tuning when prompting suffices), and security gaps (training data leakage vs inference-only deployment).",
    mentalModel: "Training is baking the cake — mix ingredients, hours in oven, one big batch. Inference is slicing and serving — fast per customer, same recipe every time.",
    howItWorks: [
      { type: "list", items: [
        "Training: forward → loss → backward → optimizer step; needs gradients, huge memory.",
        "Inference: forward only; weights frozen; KV-cache speeds autoregressive decode.",
        "Pretraining: one-time massive corpus; fine-tuning: smaller domain adapter.",
        "Providers expose inference APIs; training/fine-tune is separate product or self-hosted.",
      ]},
      { type: "mermaid", caption: "Train once, infer many", diagram: `flowchart LR
  Data --> Train[Training GPU cluster]
  Train --> Weights[Frozen weights]
  Weights --> Infer[Inference API]
  Users --> Infer` },
    ],
    example: [
      { type: "paragraph", text: "GPT-4 class model: pretrained once by lab. Your app calls chat/completions thousands of times/sec — pure inference. You might fine-tune a small adapter on 10k examples — mini training run — then deploy for inference only." },
    ],
    tradeoffs: {
      advantages: ["Separation keeps prod fast and train flexible", "Most apps only pay inference"],
      disadvantages: ["Fine-tune still costly vs prompting", "Train/infer hardware profiles differ"],
      alternatives: ["Prompting + RAG instead of fine-tune", "Distillation: small model mimics large at infer"],
      whenToUse: ["Train/fine-tune: persistent style/format/domain", "Infer: all user-facing latency paths"],
      whenNotToUse: ["Fine-tune when few-shot + RAG achieves goal"],
    },
    failureModes: [
      "Running backward pass in prod by mistake",
      "Fine-tuning on PII without governance",
      "Undersizing inference GPU memory for context length",
      "Expecting real-time learning from user clicks without pipeline",
    ],
    production: {
      performance: ["Inference: batch size 1, KV-cache, quantization", "Training: gradient accumulation, multi-GPU"],
      cost: ["Inference dominates ongoing spend; right-size model tier"],
      reliability: ["Separate train pipeline from serving; no grad in prod"],
      observability: ["Track infer latency p99 separately from train job metrics"],
    },
    interview: {
      expectations: ["Forward vs forward+backward", "What prod APIs do", "Fine-tune vs prompt"],
      commonQuestions: ["Training vs inference?", "Why is inference cheaper per token after train?"],
      followUps: ["When fine-tune?", "GPU memory train vs infer?"],
      misconceptions: ["API calls train the model", "Same hardware for both"],
      traps: ["Suggest retraining on every user message in prod"],
      strongSignals: ["Frozen weights at serve", "RAG before fine-tune"],
    },
    keyTakeaways: [
      "Training updates weights; inference applies fixed weights.",
      "Production LLM apps are almost entirely inference.",
      "Fine-tuning is targeted training; still not online learning per request.",
      "Inference optimizes latency and cost; training optimizes loss on data.",
      "Prefer prompt+RAG before committing to fine-tune cycle.",
    ],
    interviewQuestions: [
      { level: "basic", question: "Training vs inference?", answerHint: "Train: learn weights via backprop on dataset. Infer: forward pass only on new inputs; what APIs expose." },
      { level: "intermediate", question: "Why not update model on every user feedback in prod?", answerHint: "Cost, stability, safety; need offline pipeline, eval, versioning — not inline backprop." },
      { level: "advanced", question: "Memory difference train vs infer for same model?", answerHint: "Train needs activations + gradients + optimizer states — often 3-4x infer memory." },
    ],
    flashcards: [
      { front: "Inference", back: "Forward pass only; frozen weights; production serving" },
      { front: "Backprop", back: "Training-only; computes gradients to update weights" },
      { front: "Fine-tuning", back: "Additional training on domain data; then deploy for inference" },
    ],
    quickRevision: ["Train=learn weights", "Infer=serve", "Prod=infer", "Fine-tune sparingly", "No grad in prod"],
  },
};

// Continue with remaining topics in generator - I'll append programmatically
const MORE = {
  "e2-supervised-unsupervised": {
    whatIsIt: "Supervised learning uses labeled input-output pairs (email → spam/not). Unsupervised finds structure without labels (clustering, dimensionality reduction). Semi-supervised and self-supervised blur the line — LLM pretraining is largely self-supervised on next-token prediction.",
    whyExists: "Label cost dominates many AI projects. Knowing the paradigm sets data pipeline, eval metrics, and whether LLM zero-shot can substitute for labels.",
    mentalModel: "Supervised = teacher with answer key. Unsupervised = explorer grouping similar things. LLM pretrain = predict next word — no human labels per sentence.",
    howItWorks: [
      { type: "list", items: [
        "Supervised: classification, regression; metrics accuracy/F1/RMSE.",
        "Unsupervised: k-means, PCA, anomaly detection.",
        "Self-supervised (LLMs): mask/next-token labels from text itself.",
        "RLHF: human preferences as reward — alignment layer after pretrain.",
      ]},
    ],
    example: [
      { type: "paragraph", text: "Supervised: fine-tune classifier on labeled support tickets. Unsupervised: cluster tickets to discover new issue themes. LLM: pretrained self-supervised; your prompt provides task label at inference." },
    ],
    tradeoffs: {
      advantages: ["Supervised: clear metrics when labels good", "Unsupervised: discovers unknown patterns"],
      disadvantages: ["Labels expensive/wrong", "Unsupervised clusters may not align to business labels"],
      alternatives: ["Few-shot LLM instead of supervised train", "Weak supervision / heuristics for labels"],
      whenToUse: ["Supervised: stable labels, high stakes", "Unsupervised: exploration, feature learning"],
      whenNotToUse: ["Supervised with 50 noisy labels — use LLM or active learning"],
    },
    failureModes: ["Label leakage", "Cluster interpretation without validation", "Assuming LLM finetune needs huge labels when few-shot works"],
    production: { reliability: ["Track label quality and drift", "Human review for unsupervised cluster deploy"], cost: ["Active learning to minimize labeling spend"] },
    interview: {
      expectations: ["Define both", "Self-supervised link to LLMs", "Label economics"],
      commonQuestions: ["Supervised vs unsupervised?", "How do LLMs train without labels?"],
      followUps: ["Semi-supervised?", "Eval without labels?"],
      misconceptions: ["LLMs are supervised on every token by humans"],
      traps: ["Propose collecting 1M labels before trying prompting"],
      strongSignals: ["Self-supervised pretrain + prompt/few-shot/fine-tune ladder"],
    },
    keyTakeaways: ["Supervised needs labels; unsupervised finds structure.", "LLM pretraining is self-supervised.", "Choose paradigm based on label availability and task.", "RLHF adds human preference signal post-pretrain.", "Many prod paths: prompt first, label later for fine-tune."],
    interviewQuestions: [
      { level: "basic", question: "Supervised vs unsupervised?", answerHint: "Supervised: labeled pairs; unsupervised: no labels, find patterns." },
      { level: "intermediate", question: "How GPT pretraining relates?", answerHint: "Self-supervised next-token prediction on corpus — labels from text itself." },
      { level: "advanced", question: "When unsupervised before supervised?", answerHint: "Cluster/embed for discovery; label representative samples; then supervised on expanded set." },
    ],
    flashcards: [
      { front: "Supervised learning", back: "Labeled input-output pairs; learns mapping" },
      { front: "Self-supervised", back: "Labels derived from data (next token); powers LLM pretrain" },
      { front: "Unsupervised", back: "No labels; clustering, PCA, anomaly detection" },
    ],
    quickRevision: ["Supervised=labels", "Unsupervised=structure", "LLM=self-supervised", "RLHF=preferences", "Prompt before mass label"],
  },
};

Object.assign(topics, MORE);

console.log("Partial script - will extend");
