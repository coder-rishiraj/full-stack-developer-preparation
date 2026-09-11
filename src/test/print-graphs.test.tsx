import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PrintGraphsHandbookPage } from '@/pages/PrintGraphsHandbookPage'

describe('PrintGraphsHandbookPage', () => {
  it('renders reference cover, TOC, article labels, and summary', async () => {
    render(
      <MemoryRouter initialEntries={['/print/graphs']}>
        <Routes>
          <Route path="/print/graphs" element={<PrintGraphsHandbookPage />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('heading', { name: 'Graphs Handbook (A8)' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Graph Algorithms Handbook' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Table of contents' })).toBeInTheDocument()
    expect(
      screen.getByRole('heading', {
        name: 'A8.1 — Graph Foundations & Representations',
      }),
    ).toBeInTheDocument()

    await waitFor(
      () => {
        expect(screen.getByRole('heading', { name: 'Graph Representation' })).toBeInTheDocument()
        expect(screen.getAllByText('Problem').length).toBeGreaterThan(0)
        expect(screen.getAllByText('Intuition').length).toBeGreaterThan(0)
        expect(screen.getAllByText('Steps').length).toBeGreaterThan(0)
      },
      { timeout: 15_000 },
    )

    expect(
      screen.getByRole('heading', { name: 'Summary of All Core Graph Algorithms' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Algorithm cheat sheet')).toBeInTheDocument()
    expect(screen.getByText('Decision rules')).toBeInTheDocument()
  }, 20_000)
})
