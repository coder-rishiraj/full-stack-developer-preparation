import { groupSectionsForDisplay } from '@/content/section-display'
import { SECTIONS, TOPICS, TRACKS } from '@/content/taxonomy'

export function PrintCurriculumOutlinePage() {
  const generatedOn = new Intl.DateTimeFormat('en', {
    dateStyle: 'long',
  }).format(new Date())

  return (
    <main className="curriculum-outline print-surface">
      <style>{`
        .curriculum-outline {
          --ink: #172033;
          --muted: #5c667a;
          --line: #d7dce5;
          --soft: #f3f5f8;
          max-width: 920px;
          margin: 0 auto;
          padding: 38px 46px 64px;
          color: var(--ink);
          background: white;
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }
        .outline-cover {
          min-height: 75vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          border-top: 8px solid var(--ink);
          border-bottom: 1px solid var(--line);
        }
        .outline-kicker {
          margin: 0 0 16px;
          color: var(--muted);
          font-size: 11px;
          font-weight: 750;
          letter-spacing: .16em;
          text-transform: uppercase;
        }
        .outline-cover h1 {
          max-width: 720px;
          margin: 0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 45px;
          line-height: 1.03;
          letter-spacing: -.02em;
        }
        .outline-cover > p:not(.outline-kicker):not(.outline-footnote) {
          max-width: 680px;
          margin: 22px 0 0;
          color: var(--muted);
          font-size: 17px;
          line-height: 1.55;
        }
        .outline-counts {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 22px;
          margin-top: 46px;
        }
        .outline-counts strong {
          display: block;
          font-size: 25px;
        }
        .outline-counts span {
          color: var(--muted);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: .08em;
          text-transform: uppercase;
        }
        .outline-footnote {
          margin-top: 34px;
          color: var(--muted);
          font-size: 10px;
        }
        .outline-track {
          padding-top: 8px;
        }
        .outline-track-header {
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 2px solid var(--ink);
        }
        .outline-part {
          margin-bottom: 6px;
          color: var(--muted);
          font-size: 10px;
          font-weight: 750;
          letter-spacing: .14em;
          text-transform: uppercase;
        }
        .outline-track-header h2 {
          margin: 0;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 29px;
        }
        .outline-track-header p {
          margin: 8px 0 0;
          color: var(--muted);
          font-size: 12px;
        }
        .outline-groups {
          columns: 2;
          column-gap: 32px;
        }
        .outline-group {
          display: inline-block;
          width: 100%;
          margin: 0 0 19px;
          break-inside: avoid;
        }
        .outline-group h3 {
          margin: 0;
          padding: 7px 9px;
          background: var(--soft);
          font-size: 13px;
          line-height: 1.35;
        }
        .outline-group h3 span {
          display: block;
          margin-top: 2px;
          color: var(--muted);
          font-size: 8px;
          font-weight: 600;
          letter-spacing: .04em;
          text-transform: uppercase;
        }
        .outline-group ol {
          margin: 7px 0 0;
          padding: 0 0 0 9px;
          list-style: none;
          border-left: 1px solid var(--line);
        }
        .outline-group li {
          display: grid;
          grid-template-columns: max-content 1fr;
          gap: 7px;
          margin: 0;
          padding: 2px 0 2px 8px;
          font-size: 9.5px;
          line-height: 1.35;
        }
        .outline-group li b {
          font-variant-numeric: tabular-nums;
          font-weight: 700;
        }
        .outline-group li span {
          color: #3e485a;
        }
        .outline-standalone {
          margin: 0;
          padding: 8px 9px !important;
          border-left: 3px solid var(--ink);
          background: var(--soft);
          font-size: 11px !important;
        }
        @media print {
          @page {
            size: A4;
            margin: 14mm 14mm 16mm;
          }
          .curriculum-outline {
            max-width: none;
            padding: 0;
            color: #111;
          }
          .outline-cover {
            min-height: 248mm;
            break-after: page;
          }
          .outline-track {
            break-before: page;
          }
          .outline-track-header,
          .outline-group,
          .outline-group h3 {
            break-inside: avoid;
          }
          .outline-group li span {
            color: #222 !important;
          }
        }
      `}</style>

      <section className="outline-cover">
        <p className="outline-kicker">Topics and subtopics · Tracks A–E</p>
        <h1>Software Engineering Curriculum Outline</h1>
        <p>
          A compact map of the complete learning hierarchy: each track, major curriculum group,
          and numbered syllabus section—without individual leaf-level study concepts.
        </p>
        <div className="outline-counts">
          <div><strong>{TRACKS.length}</strong><span>Tracks</span></div>
          <div><strong>{groupSectionsForDisplay(SECTIONS).length}</strong><span>Major groups</span></div>
          <div><strong>{SECTIONS.length}</strong><span>Numbered sections</span></div>
        </div>
        <p className="outline-footnote">
          Generated {generatedOn} from the live website taxonomy. The complete curriculum currently
          contains {TOPICS.length} study nodes; those leaf topics are intentionally omitted here.
        </p>
      </section>

      {TRACKS.map((track, trackIndex) => {
        const sections = SECTIONS.filter((section) => section.track === track.id)
        const groups = groupSectionsForDisplay(sections)
        return (
          <article className="outline-track" key={track.id}>
            <header className="outline-track-header">
              <div className="outline-part">Part {trackIndex + 1} · Track {track.id}</div>
              <h2>{track.name}</h2>
              <p>{track.description} {groups.length} major groups · {sections.length} sections.</p>
            </header>

            <div className="outline-groups">
              {groups.map((group) => {
                const standalone =
                  group.sections.length === 1 && group.sections[0].id === group.id
                return (
                  <section className="outline-group" key={group.id}>
                    {standalone ? (
                      <h3 className="outline-standalone">
                        {group.id} — {group.title}
                      </h3>
                    ) : (
                      <>
                        <h3>
                          {group.id} — {group.title}
                          <span>{group.sections.length} numbered subtopics</span>
                        </h3>
                        <ol>
                          {group.sections.map((section) => (
                            <li key={section.id}>
                              <b>{section.id}</b>
                              <span>{section.title}</span>
                            </li>
                          ))}
                        </ol>
                      </>
                    )}
                  </section>
                )
              })}
            </div>
          </article>
        )
      })}
    </main>
  )
}
