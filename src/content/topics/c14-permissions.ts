import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Linux file permissions (rwx for owner/group/others), ownership (uid/gid), and special bits (setuid, sticky) control who can read, write, or execute files. In Docker, USER directive and COPY --chown align container process with mounted volume ownership.',
  whyExists:
    'Least privilege prevents compromised app from reading secrets or writing system files. Bind mounts inherit host ownership — mismatch causes Permission denied. Production containers must not run as root.',
  mentalModel:
    'Three audiences: owner, group, everyone — each gets read/write/execute switches. Process runs as a user; kernel checks mode bits before allowing open(). chown changes owner; chmod changes bits.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Notation', 'Meaning'],
      rows: [
        ['rwxr-xr--', 'Owner full; group read+execute; others read'],
        ['755', 'Octal: owner 7 (rwx), group 5 (r-x), others 5'],
        ['640', 'Owner rw; group r; others none — typical secret file'],
        ['USER app in Dockerfile', 'Processes run as non-root uid'],
        ['COPY --chown=app:app', 'Set ownership at copy time'],
      ],
    },
    {
      type: 'list',
      items: [
        'Directories need x to enter (cd) and r to list.',
        'Sticky bit on /tmp — only owner deletes own files.',
        'umask subtracts default permissions on new files.',
        'Named volume: create user in Dockerfile with fixed uid matching host dev.',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'bash',
      caption: 'Fix bind mount permission',
      code: `# Container runs as uid 1000 (app user)
ls -la /host/data   # owned root:root — Permission denied
# Fix on host:
sudo chown -R 1000:1000 ./data
# Or in Dockerfile:
RUN adduser --uid 1000 app
USER app`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'ACLs extend beyond owner/group/other for fine control.',
        'Capabilities (CAP_NET_BIND_SERVICE) grant subset of root powers.',
        'Read-only root filesystem in K8s securityContext prevents writes.',
        'SELinux/AppArmor add MAC labels beyond unix permissions.',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Simple universal model', 'Non-root limits blast radius', 'Audit who can read secrets'],
    disadvantages: ['uid mapping complex in Docker/K8s', 'chmod 777 masks real fix', 'Volume uid drift across hosts'],
    alternatives: ['Rootless Docker/Podman', 'FSGroup in K8s for volume ownership'],
    whenToUse: ['Every production Dockerfile USER', 'Secret files 600 root-only'],
    whenNotToUse: ['Never chmod 777 as default fix'],
  },
  failureModes: [
    'App runs root — container escape more dangerous',
    'Secret world-readable',
    'Bind mount uid mismatch',
    'Cannot bind port <1024 without capability or root',
    'World-writable upload dir — arbitrary file upload exploit',
  ],
  production: {
    security: ['Non-root USER', 'Read-only root FS where possible', 'Secrets 600'],
    reliability: ['Document required uid for volume mounts'],
    maintainability: ['Consistent app uid across images', 'FSGroup in K8s StatefulSets'],
  },
  interview: {
    expectations: ['rwx meaning', 'Why non-root container', 'chmod 755 vs 644'],
    commonQuestions: ['Permission denied in Docker volume?', 'Run as root in container?'],
    followUps: ['Capabilities vs root?', 'K8s fsGroup?'],
    misconceptions: ['chmod 777 fixes everything safely', 'Root in container isolated from host always'],
    traps: ['Recommend 777 in production'],
    strongSignals: ['COPY --chown', 'Fixed uid strategy', 'Least privilege'],
  },
  keyTakeaways: [
    'rwx for owner/group/other controls file access.',
    'Run containers as non-root USER.',
    'Bind mounts need matching uid/gid.',
    'Secrets: tight permissions, not in world-readable paths.',
    'COPY --chown sets ownership at image build.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'What does chmod 644 mean?', answerHint: 'Owner rw; group r; others r; no execute.' },
    { level: 'intermediate', question: 'Docker Permission denied on volume?', answerHint: 'Container USER uid lacks write on host-mounted dir; chown or match uid.' },
    { level: 'advanced', question: 'Why not run container as root?', answerHint: 'Escape or misconfig amplifies to host; violates least privilege.' },
  ],
  flashcards: [
    { front: 'chmod 755', back: 'Owner rwx; group/other rx — typical executables' },
    { front: 'COPY --chown', back: 'Set file owner during Docker build COPY' },
    { front: 'umask', back: 'Mask subtracted from default permissions on new files' },
  ],
  quickRevision: [
    'rwx owner/group/other',
    'Non-root USER',
    'Match volume uid',
    'No chmod 777',
    'Secrets 600',
  ],
}
