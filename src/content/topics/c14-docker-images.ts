import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'A Docker image is an immutable, layered artifact containing application code, runtime (JRE), libraries, and config defaults. Built from a Dockerfile or buildpack; identified by digest; stored in a registry; pulled to run as containers.',
  whyExists:
    'Ship one binary artifact that runs identically everywhere. Layers cache rebuilds — only changed layers upload. Tags (myapp:1.2.3) point to digests for reproducible deploys and rollbacks.',
  mentalModel:
    'Stack of transparent sheets — each Dockerfile instruction adds a sheet. Many images share bottom sheets (base OS, JRE). Top sheet is your JAR. Changing one sheet only rebuilds from that point.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Concept', 'Detail'],
      rows: [
        ['Layer', 'Result of RUN, COPY, ADD — cached by instruction hash'],
        ['Tag', 'Mutable label like :latest or :v1.2 — prefer immutable digests in prod'],
        ['Digest', 'sha256:... content hash — true identity'],
        ['Manifest', 'Lists layers + config JSON (Cmd, Env, ExposedPorts)'],
        ['Multi-arch', 'Manifest list for amd64 and arm64'],
      ],
    },
    {
      type: 'list',
      items: [
        'docker build -t name:tag . sends context; daemon runs Dockerfile steps.',
        'docker push uploads missing layers to registry (ECR, GCR, Docker Hub).',
        'Pin base image by digest in prod Dockerfiles for supply chain stability.',
        'SBOM and image scanning (Trivy, ECR scan) on push in CI.',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'bash',
      caption: 'Build, tag, inspect, push',
      code: `docker build -t myorg/checkout-api:2.1.0 .
docker image inspect myorg/checkout-api:2.1.0 --format '{{.Id}}'
docker tag myorg/checkout-api:2.1.0 123456789.dkr.ecr.us-east-1.amazonaws.com/checkout-api:2.1.0
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/checkout-api:2.1.0`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Config JSON (not a layer) holds Entrypoint, Cmd, Env, WorkingDir, User.',
        'Whiteout files in layer mark deletions from previous layer.',
        'BuildKit improves cache and parallel stage builds.',
        'Image size = sum of unique layers; dedupe across images on same node.',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Reproducible deploy artifact', 'Layer cache speeds CI', 'Easy rollback to previous tag/digest'],
    disadvantages: [':latest drift between environments', 'Large images slow deploy', 'Tag mutability security risk'],
    alternatives: ['Jib builds image without Dockerfile', 'Cloud Native Buildpacks', 'Bazel oci_image'],
    whenToUse: ['Every containerized service deploy', 'CI artifact promotion dev → staging → prod'],
    whenNotToUse: ['Config-only change — use env/volume not rebuild if possible'],
  },
  failureModes: [
    ':latest in prod pulls unexpected version',
    'Rebuild without cache bust — stale layer with old deps',
    'Secrets baked into image layers — forever in history',
    'Wrong platform manifest — exec format error on ARM Mac CI vs amd64 prod',
    'Huge context sent to daemon — .dockerignore missing',
  ],
  production: {
    security: ['Scan on push', 'Sign images (cosign)', 'No secrets in layers'],
    reliability: ['Deploy by digest not floating tag', 'Keep N previous images for rollback'],
    maintainability: ['Semver tags + git SHA tags', 'SBOM attached to release'],
    cost: ['Smaller images = faster pull = less registry egress'],
  },
  interview: {
    expectations: ['Layers and cache', 'Tag vs digest', 'Image vs container'],
    commonQuestions: ['How Docker image layers work?', 'Why not use :latest in prod?'],
    followUps: ['Reduce image size?', 'Multi-arch images?'],
    misconceptions: ['Image contains running process', 'docker commit for prod workflows'],
    traps: ['COPY . . before dependency install — cache bust every code change'],
    strongSignals: ['Digest-pinned deploy', 'Layer ordering for cache', 'Scanning in CI'],
  },
  keyTakeaways: [
    'Image = layered immutable filesystem + config metadata.',
    'Layers cache — order Dockerfile from least to most changing.',
    'Tag is label; digest is true identity for prod.',
    'Push/pull via registry; scan and sign in CI.',
    '.dockerignore keeps build context small.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'What is a Docker image layer?', answerHint: 'Filesystem diff from each Dockerfile instruction; shared and cached.' },
    { level: 'intermediate', question: 'Tag vs digest?', answerHint: 'Tag mutable pointer; digest sha256 immutable content address.' },
    { level: 'advanced', question: 'Secret accidentally COPY into image — fix?', answerHint: 'Rotate secret; rebuild without it; layers still in history — use build secrets mount.' },
  ],
  flashcards: [
    { front: 'Image digest', back: 'sha256 hash identifying exact image content' },
    { front: 'Layer cache', back: 'Docker reuses layer if instruction and inputs unchanged' },
    { front: '.dockerignore', back: 'Exclude files from build context sent to daemon' },
  ],
  quickRevision: [
    'Immutable layers',
    'Cache order',
    'Digest not :latest',
    'Scan on push',
    'No secrets in image',
  ],
}
