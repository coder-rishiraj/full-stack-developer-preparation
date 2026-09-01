import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Linux fundamentals for backend and DevOps: processes, users/groups, file permissions, signals, systemd, basic shell, package managers, and filesystem layout (/etc, /var, /tmp). Containers and EC2 instances run Linux — you debug production on Linux.',
  whyExists:
    'Java apps deploy on Linux servers. Docker containers are Linux namespaces. Permission denied, OOM kills, zombie processes, and disk full errors happen on Linux. Without basics you cannot SSH debug, read logs, or fix Dockerfile USER issues.',
  mentalModel:
    'Everything is a file or process. Kernel schedules processes; users and rwx permissions gate access; signals (SIGTERM, SIGKILL) control lifecycle. systemd is PID 1 on most servers managing services.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Topic', 'Key commands/concepts'],
      rows: [
        ['Processes', 'ps, top, kill -15 PID, nice, ulimit'],
        ['Files', 'ls -la, chmod, chown, find, df -h, du'],
        ['Users', 'useradd, groups, sudo, /etc/passwd'],
        ['Logs', 'journalctl -u service, /var/log, dmesg'],
        ['Network', 'ss -tlnp, curl, nslookup, iptables basics'],
        ['Signals', 'SIGTERM graceful, SIGKILL force, SIGHUP reload'],
      ],
    },
    {
      type: 'list',
      items: [
        'Exit code 0 success; non-zero failure — check in scripts and CI.',
        'Foreground vs background: & and nohup.',
        'Pipe | and redirect > >> 2>&1 for log capture.',
        'Package managers: apt (Debian/Ubuntu), apk (Alpine), yum/dnf (RHEL).',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'bash',
      caption: 'Debug production JVM on Linux',
      code: `# Find Java process
ps aux | grep java
# Check open files / connections
ss -tlnp | grep 8080
# Disk space
df -h /var
# Tail app log
journalctl -u myapp -f
# Graceful stop (matches Docker SIGTERM)
kill -15 $(pgrep -f 'app.jar')`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Inode stores metadata; filename is directory entry pointing to inode.',
        'Process table: PID, PPID, UID, state (R/S/D/Z).',
        'OOM killer selects process when memory exhausted — often largest RSS.',
        'cgroups limit container resources; namespaces isolate view.',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Universal server OS', 'Rich tooling', 'Container native'],
    disadvantages: ['Steep for Windows-only devs', 'Distro differences (apt vs apk)'],
    alternatives: ['Windows Server for .NET-heavy shops', 'BSD uncommon in cloud'],
    whenToUse: ['Every backend deploy target', 'Docker debugging', 'EC2 SSH sessions'],
    whenNotToUse: ['N/A for this curriculum track'],
  },
  failureModes: [
    'Disk full on /var/log — app cannot write',
    'Permission denied on bind mount uid mismatch',
    'SIGKILL leaves DB connection orphan',
    'Zombie processes if parent does not wait',
    'ulimit open files too low under load',
  ],
  production: {
    reliability: ['Log rotation logrotate', 'Monitor disk and inode usage'],
    security: ['Least privilege user', 'sudo audit', 'Keep packages patched'],
    observability: ['journald centralized shipping', 'dmesg for kernel OOM events'],
    maintainability: ['Infrastructure as code for server config', 'Runbooks with exact commands'],
  },
  interview: {
    expectations: ['SIGTERM vs SIGKILL', 'chmod meaning', 'Check port/process'],
    commonQuestions: ['Debug port in use?', 'Permission denied fix?'],
    followUps: ['What is inode?', 'OOM killer behavior?'],
    misconceptions: ['kill -9 first choice', 'Root inside container safe'],
    traps: ['Cannot explain why chmod 777 is bad'],
    strongSignals: ['SIGTERM graceful shutdown', 'df/du disk triage', 'non-root service user'],
  },
  keyTakeaways: [
    'Processes, files, users, signals — core Linux model.',
    'SIGTERM before SIGKILL for graceful shutdown.',
    'chmod/chown fix permission issues in containers.',
    'ps/ss/df/journalctl — first debug toolkit.',
    'Containers share Linux kernel — same concepts apply.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'SIGTERM vs SIGKILL?', answerHint: 'TERM: graceful shutdown handler; KILL: immediate, cannot catch.' },
    { level: 'intermediate', question: 'Port 8080 already in use — debug?', answerHint: 'ss -tlnp or lsof -i :8080 to find PID; stop process or change port.' },
    { level: 'advanced', question: 'Container OOM killed — investigate?', answerHint: 'dmesg, docker inspect OOMKilled, check memory limits vs JVM heap.' },
  ],
  flashcards: [
    { front: 'SIGTERM', back: 'Signal 15 — request graceful process termination' },
    { front: 'chmod 755', back: 'Owner rwx; group/other rx' },
    { front: 'df -h', back: 'Disk space usage by filesystem' },
  ],
  quickRevision: [
    'Process + signals',
    'Permissions rwx',
    'ps ss df',
    'journalctl logs',
    'SIGTERM graceful',
  ],
}
