import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { TrackPage } from '@/pages/TrackPage'

function renderTrack(trackId: string, search = '') {
  return render(
    <MemoryRouter initialEntries={[`/tracks/${trackId}${search}`]}>
      <Routes>
        <Route path="/tracks/:trackId" element={<TrackPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('TrackPage curriculum accordions', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  afterEach(() => {
    sessionStorage.clear()
  })
  it('expands nested frontend curriculum levels independently', async () => {
    const user = userEvent.setup()
    renderTrack('B')

    const reactGroupTitle = screen.getByRole('heading', {
      name: 'B4 — React',
    })
    const reactGroup = reactGroupTitle.closest('details')
    const reactSummary = reactGroupTitle.closest('summary')
    expect(reactGroup).toBeTruthy()
    expect(reactGroup).not.toHaveAttribute('open')
    expect(reactSummary).toBeTruthy()

    await user.click(reactSummary!)
    await waitFor(() => expect(reactGroup).toHaveAttribute('open'))
    const foundationTitle = screen.getByRole('heading', {
      name: 'B4.1 — React Foundations',
    })
    const foundation = foundationTitle.closest('details')
    const foundationSummary = foundationTitle.closest('summary')
    expect(foundation).toBeTruthy()
    expect(foundation).not.toHaveAttribute('open')
    expect(foundationSummary).toBeTruthy()

    await user.click(foundationSummary!)
    await waitFor(() => expect(foundation).toHaveAttribute('open'))
    expect(screen.getByText('What React Is & Problems It Solves')).toBeInTheDocument()
  })

  it('groups frontend system design as B6 subsections', async () => {
    const user = userEvent.setup()
    renderTrack('B')

    const fsdTitle = screen.getByRole('heading', {
      name: 'B6 — Frontend System Design',
    })
    const fsdGroup = fsdTitle.closest('details')
    const fsdSummary = fsdTitle.closest('summary')
    expect(fsdGroup).not.toHaveAttribute('open')

    await user.click(fsdSummary!)
    await waitFor(() => expect(fsdGroup).toHaveAttribute('open'))
    expect(
      screen.getByRole('heading', { name: 'B6.1 — Interview Method' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'B6.14 — HLD Case Studies & Microfrontends' }),
    ).toBeInTheDocument()
  })

  it('groups Java concurrency as C3 numbered subsections', async () => {
    const user = userEvent.setup()
    renderTrack('C')

    const concurrencyTitle = screen.getByRole('heading', {
      name: 'C3 — Java Concurrency',
    })
    const concurrencyGroup = concurrencyTitle.closest('details')
    const concurrencySummary = concurrencyTitle.closest('summary')
    expect(concurrencyGroup).not.toHaveAttribute('open')

    await user.click(concurrencySummary!)
    await waitFor(() => expect(concurrencyGroup).toHaveAttribute('open'))
    expect(
      screen.getByRole('heading', { name: 'C3.1 — Concurrency Foundations' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', {
        name: 'C3.16 — Structured Concurrency & Scoped Values',
      }),
    ).toBeInTheDocument()
  })

  it('groups Networking & Web as C4 numbered subsections', async () => {
    const user = userEvent.setup()
    renderTrack('C')

    const networkingTitle = screen.getByRole('heading', {
      name: 'C4 — Networking & Web',
    })
    const networkingGroup = networkingTitle.closest('details')
    const networkingSummary = networkingTitle.closest('summary')
    expect(networkingGroup).not.toHaveAttribute('open')

    await user.click(networkingSummary!)
    await waitFor(() => expect(networkingGroup).toHaveAttribute('open'))
    expect(
      screen.getByRole('heading', { name: 'C4.1 — Network Foundations & Models' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'C4.19 — Java Networking APIs' }),
    ).toBeInTheDocument()
  })

  it('groups Spring Core as C5 numbered subsections', async () => {
    const user = userEvent.setup()
    renderTrack('C')

    const springTitle = screen.getByRole('heading', {
      name: 'C5 — Spring Core',
    })
    const springGroup = springTitle.closest('details')
    const springSummary = springTitle.closest('summary')
    expect(springGroup).not.toHaveAttribute('open')

    await user.click(springSummary!)
    await waitFor(() => expect(springGroup).toHaveAttribute('open'))
    expect(
      screen.getByRole('heading', { name: 'C5.1 — IoC & the Container' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'C5.14 — Testing Spring Core' }),
    ).toBeInTheDocument()
  })

  it('groups Spring Boot as C6 numbered subsections', async () => {
    const user = userEvent.setup()
    renderTrack('C')

    const bootTitle = screen.getByRole('heading', {
      name: 'C6 — Spring Boot',
    })
    const bootGroup = bootTitle.closest('details')
    const bootSummary = bootTitle.closest('summary')
    expect(bootGroup).not.toHaveAttribute('open')

    await user.click(bootSummary!)
    await waitFor(() => expect(bootGroup).toHaveAttribute('open'))
    expect(
      screen.getByRole('heading', {
        name: 'C6.1 — Boot Foundations & Project Structure',
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', {
        name: 'C6.20 — Production Lifecycle & Packaging',
      }),
    ).toBeInTheDocument()
  })

  it('groups SQL and PostgreSQL as C7 numbered subsections', async () => {
    const user = userEvent.setup()
    renderTrack('C')

    const sqlTitle = screen.getByRole('heading', {
      name: 'C7 — SQL & PostgreSQL',
    })
    const sqlGroup = sqlTitle.closest('details')
    const sqlSummary = sqlTitle.closest('summary')
    expect(sqlGroup).not.toHaveAttribute('open')

    await user.click(sqlSummary!)
    await waitFor(() => expect(sqlGroup).toHaveAttribute('open'))
    expect(
      screen.getByRole('heading', {
        name: 'C7.1 — Relational & PostgreSQL Foundations',
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', {
        name: 'C7.20 — Replication, Vacuum & Operations',
      }),
    ).toBeInTheDocument()
  })

  it('groups Security as C9 numbered subsections', async () => {
    const user = userEvent.setup()
    renderTrack('C')

    const securityTitle = screen.getByRole('heading', {
      name: 'C9 — Security',
    })
    const securityGroup = securityTitle.closest('details')
    const securitySummary = securityTitle.closest('summary')
    expect(securityGroup).not.toHaveAttribute('open')

    await user.click(securitySummary!)
    await waitFor(() => expect(securityGroup).toHaveAttribute('open'))
    expect(
      screen.getByRole('heading', {
        name: 'C9.1 — Authentication vs Authorization',
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', {
        name: 'C9.15 — OWASP Architecture & Cryptographic Failures',
      }),
    ).toBeInTheDocument()
  })

  it('groups Redis as C10 numbered subsections', async () => {
    const user = userEvent.setup()
    renderTrack('C')

    const redisTitle = screen.getByRole('heading', {
      name: 'C10 — Redis',
    })
    const redisGroup = redisTitle.closest('details')
    const redisSummary = redisTitle.closest('summary')
    expect(redisGroup).not.toHaveAttribute('open')

    await user.click(redisSummary!)
    await waitFor(() => expect(redisGroup).toHaveAttribute('open'))
    expect(
      screen.getByRole('heading', {
        name: 'C10.1 — Redis Foundations & Why It Is Fast',
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', {
        name: 'C10.16 — Security, Memory & Operations',
      }),
    ).toBeInTheDocument()
  })

  it('groups Kafka as C11 numbered subsections', async () => {
    const user = userEvent.setup()
    renderTrack('C')

    const kafkaTitle = screen.getByRole('heading', {
      name: 'C11 — Kafka & Event-Driven Systems',
    })
    const kafkaGroup = kafkaTitle.closest('details')
    const kafkaSummary = kafkaTitle.closest('summary')
    expect(kafkaGroup).not.toHaveAttribute('open')

    await user.click(kafkaSummary!)
    await waitFor(() => expect(kafkaGroup).toHaveAttribute('open'))
    expect(
      screen.getByRole('heading', {
        name: 'C11.1 — Kafka Foundations & Messaging Models',
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', {
        name: 'C11.16 — Outbox, Saga & Production Operations',
      }),
    ).toBeInTheDocument()
  })

  it('groups Backend Reliability as C12 numbered subsections', async () => {
    const user = userEvent.setup()
    renderTrack('C')

    const reliabilityTitle = screen.getByRole('heading', {
      name: 'C12 — Backend Reliability',
    })
    const reliabilityGroup = reliabilityTitle.closest('details')
    const reliabilitySummary = reliabilityTitle.closest('summary')
    expect(reliabilityGroup).not.toHaveAttribute('open')

    await user.click(reliabilitySummary!)
    await waitFor(() => expect(reliabilityGroup).toHaveAttribute('open'))
    expect(
      screen.getByRole('heading', {
        name: 'C12.1 — Reliability Foundations & Failure Modes',
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', {
        name: 'C12.14 — Chaos, Overload & Production Playbooks',
      }),
    ).toBeInTheDocument()
  })

  it('groups Testing as C13 numbered subsections', async () => {
    const user = userEvent.setup()
    renderTrack('C')

    const testingTitle = screen.getByRole('heading', {
      name: 'C13 — Testing',
    })
    const testingGroup = testingTitle.closest('details')
    const testingSummary = testingTitle.closest('summary')
    expect(testingGroup).not.toHaveAttribute('open')

    await user.click(testingSummary!)
    await waitFor(() => expect(testingGroup).toHaveAttribute('open'))
    expect(
      screen.getByRole('heading', {
        name: 'C13.1 — Testing Strategy & the Pyramid',
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', {
        name: 'C13.14 — CI Strategy & Production Confidence',
      }),
    ).toBeInTheDocument()
  })

  it('groups Docker / DevOps as C14 numbered subsections', async () => {
    const user = userEvent.setup()
    renderTrack('C')

    const dockerTitle = screen.getByRole('heading', {
      name: 'C14 — Docker / DevOps',
    })
    const dockerGroup = dockerTitle.closest('details')
    const dockerSummary = dockerTitle.closest('summary')
    expect(dockerGroup).not.toHaveAttribute('open')

    await user.click(dockerSummary!)
    await waitFor(() => expect(dockerGroup).toHaveAttribute('open'))
    expect(
      screen.getByRole('heading', {
        name: 'C14.1 — DevOps Foundations & Lifecycle',
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', {
        name: 'C14.16 — DevSecOps & Container Security',
      }),
    ).toBeInTheDocument()
  })

  it('groups AWS / Cloud as C15 numbered subsections', async () => {
    const user = userEvent.setup()
    renderTrack('C')

    const awsTitle = screen.getByRole('heading', {
      name: 'C15 — AWS / Cloud',
    })
    const awsGroup = awsTitle.closest('details')
    const awsSummary = awsTitle.closest('summary')
    expect(awsGroup).not.toHaveAttribute('open')

    await user.click(awsSummary!)
    await waitFor(() => expect(awsGroup).toHaveAttribute('open'))
    expect(
      screen.getByRole('heading', {
        name: 'C15.1 — Cloud Foundations & Global Infrastructure',
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', {
        name: 'C15.16 — Cost, IaC & Well-Architected',
      }),
    ).toBeInTheDocument()
  })

  it('groups Observability as C16 numbered subsections', async () => {
    const user = userEvent.setup()
    renderTrack('C')

    const obsTitle = screen.getByRole('heading', {
      name: 'C16 — Observability',
    })
    const obsGroup = obsTitle.closest('details')
    const obsSummary = obsTitle.closest('summary')
    expect(obsGroup).not.toHaveAttribute('open')

    await user.click(obsSummary!)
    await waitFor(() => expect(obsGroup).toHaveAttribute('open'))
    expect(
      screen.getByRole('heading', {
        name: 'C16.1 — Observability Foundations',
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', {
        name: 'C16.14 — Incident Debugging Playbooks',
      }),
    ).toBeInTheDocument()
  })

  it('groups distributed fundamentals and 30 practice designs on Track D', async () => {
    const user = userEvent.setup()
    renderTrack('D')

    const fundamentalsTitle = screen.getByRole('heading', {
      name: 'D4 — Distributed Systems Foundations',
    })
    const fundamentalsGroup = fundamentalsTitle.closest('details')
    await user.click(fundamentalsTitle.closest('summary')!)
    await waitFor(() => expect(fundamentalsGroup).toHaveAttribute('open'))
    expect(
      screen.getByRole('heading', {
        name: 'D4.1 — System Design Foundations, HLD & LLD Boundaries',
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', {
        name: 'D4.12 — Distributed Transactions & Workflows',
      }),
    ).toBeInTheDocument()

    const practiceTitle = screen.getByRole('heading', {
      name: 'D10 — System Design Practice',
    })
    const practiceGroup = practiceTitle.closest('details')
    await user.click(practiceTitle.closest('summary')!)
    await waitFor(() => expect(practiceGroup).toHaveAttribute('open'))
    expect(
      screen.getByRole('heading', {
        name: 'D10.1 — Design a URL Shortener',
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', {
        name: 'D10.30 — Design an E-Commerce / Food Delivery Platform',
      }),
    ).toBeInTheDocument()
  })

  it('groups Applied AI foundations, agents, and projects as numbered subsections', async () => {
    const user = userEvent.setup()
    renderTrack('E')

    const foundationsTitle = screen.getByRole('heading', {
      name: 'E1 — Foundations & AI Tool Mastery',
    })
    const foundationsGroup = foundationsTitle.closest('details')
    await user.click(foundationsTitle.closest('summary')!)
    await waitFor(() => expect(foundationsGroup).toHaveAttribute('open'))
    expect(
      screen.getByRole('heading', {
        name: 'E1.1 — Applied AI Landscape & Engineering Roles',
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', {
        name: 'E1.4 — Python AI Backend & Data Stack',
      }),
    ).toBeInTheDocument()

    const agentsTitle = screen.getByRole('heading', {
      name: 'E7 — Agents, Workflows & MCP',
    })
    const agentsGroup = agentsTitle.closest('details')
    await user.click(agentsTitle.closest('summary')!)
    await waitFor(() => expect(agentsGroup).toHaveAttribute('open'))
    expect(
      screen.getByRole('heading', {
        name: 'E7.8 — MCP Architecture & Primitives',
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', {
        name: 'E7.10 — Production MCP Security & Operations',
      }),
    ).toBeInTheDocument()

    const projectsTitle = screen.getByRole('heading', {
      name: 'E12 — Applied AI Project Ladder',
    })
    const projectsGroup = projectsTitle.closest('details')
    await user.click(projectsTitle.closest('summary')!)
    await waitFor(() => expect(projectsGroup).toHaveAttribute('open'))
    expect(
      screen.getByRole('heading', {
        name: 'E12.1 — Project: Intelligent Document Analyzer',
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', {
        name: 'E12.8 — Capstone: Multi-Tenant AI Executive Assistant',
      }),
    ).toBeInTheDocument()
  })

  it('supports individual and global controls on every track', async () => {
    const user = userEvent.setup()
    renderTrack('A')

    const sectionTitle = screen.getByRole('heading', {
      name: 'A1 — Programming for Interviews',
    })
    const details = sectionTitle.closest('details')
    const summary = sectionTitle.closest('summary')
    expect(details).not.toHaveAttribute('open')
    expect(summary).toBeTruthy()

    await user.click(summary!)
    await waitFor(() => expect(details).toHaveAttribute('open'))
    await user.click(summary!)
    await waitFor(() => expect(details).not.toHaveAttribute('open'))

    await user.click(screen.getByRole('button', { name: 'Expand all' }))
    await waitFor(() => expect(details).toHaveAttribute('open'))
    await user.click(screen.getByRole('button', { name: 'Collapse all' }))
    await waitFor(() => expect(details).not.toHaveAttribute('open'))
  })

  it('offers inline add controls on the track page', () => {
    renderTrack('B')
    expect(screen.getByRole('button', { name: '+ Add section' })).toBeInTheDocument()
  })

  it('opens the requested section from the query string', async () => {
    renderTrack('B', '?section=B1.1')

    const group = screen
      .getByRole('heading', { name: 'B1 — JavaScript' })
      .closest('details')
    const subsection = screen
      .getByRole('heading', { name: 'B1.1 — JavaScript Foundations' })
      .closest('details')

    await waitFor(() => expect(group).toHaveAttribute('open'))
    await waitFor(() => expect(subsection).toHaveAttribute('open'))
    expect(screen.getByText('What JavaScript Is')).toBeInTheDocument()
  })

  it('restores previously expanded sections when returning to the track', async () => {
    const user = userEvent.setup()
    const first = renderTrack('B')

    await user.click(
      screen.getByRole('heading', { name: 'B1 — JavaScript' }).closest('summary')!,
    )
    await waitFor(() =>
      expect(
        screen.getByRole('heading', { name: 'B1 — JavaScript' }).closest('details'),
      ).toHaveAttribute('open'),
    )
    await user.click(
      screen
        .getByRole('heading', { name: 'B1.1 — JavaScript Foundations' })
        .closest('summary')!,
    )
    await waitFor(() =>
      expect(
        screen
          .getByRole('heading', { name: 'B1.1 — JavaScript Foundations' })
          .closest('details'),
      ).toHaveAttribute('open'),
    )

    first.unmount()
    renderTrack('B')

    await waitFor(() =>
      expect(
        screen.getByRole('heading', { name: 'B1 — JavaScript' }).closest('details'),
      ).toHaveAttribute('open'),
    )
    await waitFor(() =>
      expect(
        screen
          .getByRole('heading', { name: 'B1.1 — JavaScript Foundations' })
          .closest('details'),
      ).toHaveAttribute('open'),
    )
    expect(screen.getByText('What JavaScript Is')).toBeInTheDocument()
  })
})
