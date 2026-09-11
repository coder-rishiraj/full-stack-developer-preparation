import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PrintGraphCorePage } from '@/pages/PrintGraphCorePage'
import { CORE_GRAPH_ALGO_DEFS, CORE_GRAPH_CHEAT_SHEET, GRAPH_CORE_PACK } from '@/content/topics/_graph-core-pack'
import { GRAPH_CORE_CPP } from '@/content/topics/_graph-core-cpp'

describe('PrintGraphCorePage', () => {
  it('renders 25 core algos with Java + optional C++ solutions', () => {
    expect(CORE_GRAPH_ALGO_DEFS).toHaveLength(25)
    for (const def of CORE_GRAPH_ALGO_DEFS) {
      expect(GRAPH_CORE_PACK[def.topicId], def.topicId).toBeDefined()
      expect(GRAPH_CORE_CPP[def.topicId], `cpp:${def.topicId}`).toBeDefined()
      const cpp = GRAPH_CORE_CPP[def.topicId].code
      expect(cpp.length, def.topicId).toBeGreaterThan(80)
      expect(cpp.includes('//') || cpp.includes('/*'), def.topicId).toBe(true)
    }

    render(
      <MemoryRouter initialEntries={['/print/graph-core']}>
        <Routes>
          <Route path="/print/graph-core" element={<PrintGraphCorePage />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getAllByRole('heading', { name: 'Core Graph Algorithms' }).length).toBeGreaterThanOrEqual(1)
    expect(screen.getByRole('heading', { name: 'BFS (Breadth-First Search)' })).toBeInTheDocument()
    expect(screen.getAllByText('Solution (Java)').length).toBe(25)
    expect(screen.queryByText('Solution (C++)')).not.toBeInTheDocument()

    fireEvent.click(screen.getByLabelText('Show solutions (C++)'))
    expect(screen.getAllByText('Solution (C++)').length).toBe(25)
    expect(screen.getByText(/BFS traversal \(all components\) — C\+\+/i)).toBeInTheDocument()

    expect(CORE_GRAPH_CHEAT_SHEET).toHaveLength(25)
    expect(screen.getByRole('heading', { name: /All 25 algorithms/i })).toBeInTheDocument()
    expect(screen.getAllByText('Hierholzer (Euler Path/Circuit)').length).toBeGreaterThanOrEqual(2)
    expect(screen.getByText(/Consume unused edges; reverse post-walk/i)).toBeInTheDocument()
    expect(screen.getByText(/Max s–t flow/i)).toBeInTheDocument()
  })
})
