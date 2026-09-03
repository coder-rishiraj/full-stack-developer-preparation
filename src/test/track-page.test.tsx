import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { TrackPage } from '@/pages/TrackPage'

function renderTrack(trackId: string) {
  return render(
    <MemoryRouter initialEntries={[`/tracks/${trackId}`]}>
      <Routes>
        <Route path="/tracks/:trackId" element={<TrackPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('TrackPage curriculum accordions', () => {
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
})
