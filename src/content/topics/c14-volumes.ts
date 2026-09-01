import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Docker volumes persist data outside container lifecycle. Bind mounts map host paths; named volumes managed by Docker; tmpfs in memory. Containers are ephemeral — databases and uploads need volumes or external storage.',
  whyExists:
    'Container writable layer disappears on rm. Without volumes, Postgres data vanishes on restart. Volumes also share data between containers and decouple storage location from container filesystem.',
  mentalModel:
    'USB drive plugged into container. Container can be replaced; drive stays. Named volume = Docker holds the drive; bind mount = you point to a folder on laptop.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Type', 'Use', 'Note'],
      rows: [
        ['Named volume', 'Prod-like local DB data', 'docker volume ls, portable across containers'],
        ['Bind mount', 'Live code reload in dev', 'Host path : container path — OS-specific perf'],
        ['tmpfs', 'Secrets in RAM', 'Gone on stop — no disk persist'],
        ['Volume driver', 'NFS, cloud EBS via plugin', 'Multi-host in Swarm/K8s uses PV instead'],
      ],
    },
    {
      type: 'list',
      items: [
        'docker run -v pgdata:/var/lib/postgresql/data mounts named volume.',
        'Bind: -v $(pwd)/src:/app/src for hot reload.',
        'Permissions: COPY --chown or run container USER matching mount uid.',
        'K8s PersistentVolumeClaim is orchestrator equivalent — not Docker volume on node.',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'bash',
      caption: 'Named volume for Postgres',
      code: `docker volume create pgdata
docker run -d --name db \\
  -v pgdata:/var/lib/postgresql/data \\
  -e POSTGRES_PASSWORD=secret \\
  postgres:16-alpine
docker rm -f db   # data survives in pgdata volume
docker run -d --name db2 -v pgdata:/var/lib/postgresql/data ...`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Volume stored under /var/lib/docker/volumes/ on Linux host.',
        'Copy-on-write: first write to mounted path may copy file from image layer.',
        'Read-only mount :ro prevents container modifying host files.',
        'Anonymous volumes removed with container unless --volumes-not removed on rm.',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Data survives container restart', 'Share data between containers', 'Named volumes easy backup'],
    disadvantages: ['Bind mount perf on Mac/Windows', 'Orphan volumes consume disk', 'Backup/restore not automatic'],
    alternatives: ['External managed DB — no local volume', 'S3 for object files'],
    whenToUse: ['Local Postgres/Redis persistence', 'Shared upload dir between app and worker'],
    whenNotToUse: ['Stateless app logs — use stdout + log aggregator', 'Secrets — use secrets manager not volume file in git'],
  },
  failureModes: [
    'docker rm -v deletes named volumes accidentally',
    'Permission denied — host uid != container USER',
    'Stale volume schema after migration — manual drop needed',
    'Disk full on Docker volume partition',
    'Bind mount overwrites container app dir with empty host dir',
  ],
  production: {
    reliability: ['Managed RDS/S3 instead of container volumes in prod', 'Backup snapshots for stateful sets'],
    maintainability: ['Document volume prune policy', 'Named volumes in compose for dev parity'],
    cost: ['Monitor docker system df — prune unused volumes in CI'],
  },
  interview: {
    expectations: ['Why volumes', 'Named vs bind', 'Data loss on container delete'],
    commonQuestions: ['Persist Postgres in Docker?', 'Bind mount vs volume?'],
    followUps: ['K8s equivalent?', 'Volume permissions issue?'],
    misconceptions: ['Data in container layer persists', 'Volumes work across Docker hosts without shared storage'],
    traps: ['No volume — DB empty every restart'],
    strongSignals: ['Named volume for DB', 'External managed DB in prod', 'Read-only bind for config'],
  },
  keyTakeaways: [
    'Containers ephemeral — volumes persist data.',
    'Named volume: Docker-managed; bind mount: host path.',
    'Use volumes for DB data locally; managed services in prod.',
    'Watch uid/gid permissions on bind mounts.',
    'docker volume prune cleans orphans — backup first.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Why Docker volumes?', answerHint: 'Persist data beyond container lifecycle.' },
    { level: 'intermediate', question: 'Named volume vs bind mount?', answerHint: 'Named: Docker managed; bind: specific host directory, good for dev reload.' },
    { level: 'advanced', question: 'Prod database in Docker volume OK?', answerHint: 'Usually no — use managed RDS; volumes lack HA backup ops of managed DB.' },
  ],
  flashcards: [
    { front: 'Named volume', back: 'Docker-managed storage referenced by name' },
    { front: 'Bind mount', back: 'Maps host directory into container path' },
    { front: 'Ephemeral container layer', back: 'Writable layer deleted when container removed' },
  ],
  quickRevision: [
    'Persist outside container',
    'Named vs bind',
    'Managed DB in prod',
    'Permission uid match',
    'Prune orphans carefully',
  ],
}
