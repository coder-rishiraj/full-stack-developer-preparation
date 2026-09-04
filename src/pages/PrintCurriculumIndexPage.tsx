import { groupSectionsForDisplay } from '@/content/section-display'
import { curriculumStats, SECTIONS, TOPICS, TRACKS } from '@/content/taxonomy'
import type { TopicMeta } from '@/domain/types'

function topicTree(sectionId: string) {
  const sectionTopics = TOPICS.filter((topic) => topic.sectionId === sectionId)
  const children = new Map<string, TopicMeta[]>()

  for (const topic of sectionTopics) {
    if (!topic.parentTopicId) continue
    const current = children.get(topic.parentTopicId) ?? []
    current.push(topic)
    children.set(topic.parentTopicId, current)
  }

  return sectionTopics
    .filter((topic) => topic.curriculumLevel === 'classified-item')
    .map((topic) => ({ topic, children: children.get(topic.id) ?? [] }))
}

function CurriculumSection({
  id,
  title,
  showHeading = true,
}: {
  id: string
  title: string
  showHeading?: boolean
}) {
  const tree = topicTree(id)

  return (
    <section className={`syllabus-section${showHeading ? '' : ' syllabus-section-flat'}`}>
      {showHeading && (
        <h3>
          <span>{id}</span> — {title}
          <small>{tree.reduce((count, node) => count + 1 + node.children.length, 0)} nodes</small>
        </h3>
      )}
      <ol className="syllabus-topics">
        {tree.map(({ topic, children }) => (
          <li key={topic.id}>
            <div className="syllabus-topic-line">
              <span>{topic.title}</span>
              <i>{topic.priority.replace('tier', 'Tier ')}</i>
            </div>
            {children.length > 0 && (
              <ul>
                {children.map((child) => (
                  <li key={child.id}>{child.title}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ol>
    </section>
  )
}

export function PrintCurriculumIndexPage() {
  const stats = curriculumStats()
  const generatedOn = new Intl.DateTimeFormat('en', {
    dateStyle: 'long',
  }).format(new Date())

  return (
    <main className="curriculum-index print-surface">
      <style>{`
        .curriculum-index {
          --ink: #172033;
          --muted: #5c667a;
          --line: #d7dce5;
          --soft: #f3f5f8;
          max-width: 980px;
          margin: 0 auto;
          padding: 36px 44px 64px;
          color: var(--ink);
          background: white;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }
        .curriculum-cover {
          min-height: 78vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          border-top: 8px solid var(--ink);
          border-bottom: 1px solid var(--line);
        }
        .curriculum-kicker {
          margin: 0 0 18px;
          color: var(--muted);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: .16em;
          text-transform: uppercase;
        }
        .curriculum-cover h1 {
          max-width: 760px;
          margin: 0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 48px;
          line-height: 1.02;
          letter-spacing: -.025em;
        }
        .curriculum-subtitle {
          max-width: 700px;
          margin: 24px 0 0;
          color: var(--muted);
          font-size: 18px;
          line-height: 1.55;
        }
        .curriculum-cover-meta {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-top: 52px;
        }
        .curriculum-cover-meta strong {
          display: block;
          font-size: 24px;
        }
        .curriculum-cover-meta span {
          color: var(--muted);
          font-size: 11px;
          font-weight: 650;
          letter-spacing: .07em;
          text-transform: uppercase;
        }
        .curriculum-note {
          margin-top: 38px;
          color: var(--muted);
          font-size: 11px;
          line-height: 1.55;
        }
        .curriculum-summary {
          padding-top: 10px;
        }
        .curriculum-summary h2,
        .curriculum-track-header h2 {
          margin: 0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 30px;
        }
        .curriculum-summary > p {
          color: var(--muted);
          font-size: 13px;
        }
        .curriculum-summary-list {
          margin: 30px 0 0;
          padding: 0;
          list-style: none;
          border-top: 1px solid var(--ink);
        }
        .curriculum-summary-list li {
          display: grid;
          grid-template-columns: 36px 1fr auto;
          gap: 12px;
          align-items: baseline;
          padding: 14px 0;
          border-bottom: 1px solid var(--line);
        }
        .curriculum-summary-list b {
          font-family: Georgia, "Times New Roman", serif;
          font-size: 21px;
        }
        .curriculum-summary-list strong {
          font-size: 14px;
        }
        .curriculum-summary-list span {
          color: var(--muted);
          font-size: 11px;
        }
        .curriculum-track {
          padding-top: 6px;
        }
        .curriculum-track-header {
          margin-bottom: 26px;
          padding-bottom: 18px;
          border-bottom: 2px solid var(--ink);
        }
        .curriculum-track-header .part {
          margin-bottom: 7px;
          color: var(--muted);
          font-size: 11px;
          font-weight: 750;
          letter-spacing: .14em;
          text-transform: uppercase;
        }
        .curriculum-track-header p {
          margin: 9px 0 0;
          color: var(--muted);
          font-size: 13px;
        }
        .syllabus-group {
          margin: 24px 0 30px;
        }
        .syllabus-group > h2 {
          margin: 0 0 12px;
          padding: 8px 10px;
          background: var(--soft);
          font-size: 17px;
          line-height: 1.3;
        }
        .syllabus-group > h2 small {
          float: right;
          color: var(--muted);
          font-size: 10px;
          font-weight: 600;
          line-height: 22px;
        }
        .syllabus-section {
          margin: 14px 0 20px;
        }
        .syllabus-section-flat {
          margin-top: 8px;
        }
        .syllabus-section h3 {
          margin: 0 0 8px;
          padding-bottom: 5px;
          border-bottom: 1px solid var(--line);
          font-size: 13px;
          line-height: 1.35;
        }
        .syllabus-section h3 > span {
          font-variant-numeric: tabular-nums;
        }
        .syllabus-section h3 small {
          float: right;
          color: var(--muted);
          font-size: 9px;
          font-weight: 500;
        }
        .syllabus-topics {
          margin: 0;
          padding-left: 24px;
          font-size: 10.25px;
          line-height: 1.42;
        }
        .syllabus-topics > li {
          margin: 3px 0 5px;
          padding-left: 2px;
        }
        .syllabus-topic-line {
          display: flex;
          justify-content: space-between;
          gap: 10px;
        }
        .syllabus-topic-line i {
          flex: 0 0 auto;
          color: var(--muted);
          font-size: 8px;
          font-style: normal;
          letter-spacing: .04em;
          text-transform: uppercase;
        }
        .syllabus-topics ul {
          margin: 2px 0 0;
          padding-left: 18px;
          color: #3f495c;
          list-style-type: "—  ";
        }
        .syllabus-topics ul li {
          margin: 1px 0;
          padding-left: 1px;
        }
        @media print {
          @page {
            size: A4;
            margin: 13mm 14mm 15mm;
          }
          .curriculum-index {
            max-width: none;
            padding: 0;
            color: #111;
          }
          .curriculum-cover {
            min-height: 250mm;
            break-after: page;
          }
          .curriculum-summary {
            break-after: page;
          }
          .curriculum-track {
            break-before: page;
          }
          .curriculum-track-header,
          .syllabus-group > h2,
          .syllabus-section h3,
          .syllabus-topics > li {
            break-after: avoid;
          }
          .syllabus-topic-line i {
            color: #555 !important;
          }
          .syllabus-topics ul {
            color: #222 !important;
          }
        }
      `}</style>

      <section className="curriculum-cover">
        <p className="curriculum-kicker">Complete study hierarchy · Tracks A–E</p>
        <h1>Master Software Engineering Curriculum</h1>
        <p className="curriculum-subtitle">
          A book-style syllabus for DSA, frontend engineering, Java and backend engineering,
          low-level and system design, distributed systems, and applied AI engineering.
        </p>
        <div className="curriculum-cover-meta">
          <div><strong>{TRACKS.length}</strong><span>Tracks</span></div>
          <div><strong>{SECTIONS.length}</strong><span>Sections</span></div>
          <div><strong>{stats.total}</strong><span>Core topics</span></div>
          <div><strong>{stats.concepts}</strong><span>Total study nodes</span></div>
        </div>
        <p className="curriculum-note">
          Generated {generatedOn} from the live website taxonomy. Core topics are classified
          curriculum items; total study nodes additionally include nested concepts. NeetCode and
          CSES problem banks are represented by their curriculum categories rather than reproducing
          every individual problem.
        </p>
      </section>

      <section className="curriculum-summary">
        <p className="curriculum-kicker">Contents at a glance</p>
        <h2>Curriculum Summary</h2>
        <p>
          Read each track as a part, each named group as a chapter, each numbered section as a
          syllabus unit, and the indented entries as subtopics.
        </p>
        <ol className="curriculum-summary-list">
          {TRACKS.map((track) => {
            const sections = SECTIONS.filter((section) => section.track === track.id)
            const topics = TOPICS.filter((topic) => topic.track === track.id)
            const classified = topics.filter(
              (topic) => topic.curriculumLevel === 'classified-item',
            ).length
            return (
              <li key={track.id}>
                <b>{track.id}</b>
                <strong>{track.name}</strong>
                <span>{sections.length} sections · {classified} core · {topics.length} nodes</span>
              </li>
            )
          })}
        </ol>
      </section>

      {TRACKS.map((track, trackIndex) => {
        const sections = SECTIONS.filter((section) => section.track === track.id)
        const groups = groupSectionsForDisplay(sections)
        const trackTopics = TOPICS.filter((topic) => topic.track === track.id)
        return (
          <article className="curriculum-track" key={track.id}>
            <header className="curriculum-track-header">
              <div className="part">Part {trackIndex + 1} · Track {track.id}</div>
              <h2>{track.name}</h2>
              <p>
                {track.description} {sections.length} sections · {trackTopics.length} study nodes.
              </p>
            </header>

            {groups.map((group) => (
              (() => {
                const standalone =
                  group.sections.length === 1 && group.sections[0].id === group.id
                const nodeCount = standalone
                  ? TOPICS.filter((topic) => topic.sectionId === group.id).length
                  : undefined
                return (
                  <section className="syllabus-group" key={group.id}>
                    <h2>
                      {group.id} — {group.title}
                      <small>
                        {standalone
                          ? `${nodeCount} nodes`
                          : `${group.sections.length} sections`}
                      </small>
                    </h2>
                    {group.sections.map((section) => (
                      <CurriculumSection
                        id={section.id}
                        key={section.id}
                        title={section.title}
                        showHeading={!standalone}
                      />
                    ))}
                  </section>
                )
              })()
            ))}
          </article>
        )
      })}
    </main>
  )
}
