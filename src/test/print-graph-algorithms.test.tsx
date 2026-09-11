import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PrintGraphAlgorithmsPage } from '@/pages/PrintGraphAlgorithmsPage'
import { GRAPH_ALGORITHMS } from '@/content/topics/_graph-core-algorithms'
import { getGraphCppSolution } from '@/content/topics/_graph-cpp'

describe('PrintGraphAlgorithmsPage', () => {
  it('renders all topics with real notes, styling, and Java/C++ solutions', async () => {
    expect(GRAPH_ALGORITHMS.length).toBeGreaterThan(100)
    for (const a of GRAPH_ALGORITHMS) {
      expect(getGraphCppSolution(a.topicId), `cpp missing: ${a.topicId}`).toBeDefined()
    }

    render(
      <MemoryRouter initialEntries={['/print/graph-algorithms']}>
        <Routes>
          <Route path="/print/graph-algorithms" element={<PrintGraphAlgorithmsPage />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('heading', { name: 'Graph Algorithms — Full Topic Reference' }),
    ).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'BFS (Breadth-First Search)' })).toBeInTheDocument()
    })

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: "Dinic's Algorithm" })).toBeInTheDocument()
    })

    expect(screen.queryByText(/graph algorithm\/technique in/i)).not.toBeInTheDocument()
    expect(
      screen.queryByText(/Study it with the same structure as the printable reference/i),
    ).not.toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getAllByText('Solution (Java)').length).toBeGreaterThanOrEqual(50)
    })

    fireEvent.click(screen.getByLabelText('Show solutions (C++)'))
    await waitFor(() => {
      expect(screen.getAllByText('Solution (C++)').length).toBeGreaterThanOrEqual(50)
    })

    expect(screen.getByRole('heading', { name: /All \d+ topics/i })).toBeInTheDocument()
  })
})
