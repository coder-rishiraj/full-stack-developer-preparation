import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { AppShell } from '@/components/layout/AppShell'
import { useUserStore } from '@/stores/user-store'

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="revision" element={<div>Revision queue</div>} />
          <Route path="topics/:topicId/study" element={<div>Study view</div>} />
          <Route
            path="topics/:topicId/revision"
            element={<div>Topic revision view</div>}
          />
          <Route path="/" element={<div>Dashboard</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

describe('AppShell focused mode', () => {
  beforeEach(() => {
    useUserStore.setState({ hydrated: true, theme: 'light' })
  })

  it('keeps the normal shell on the /revision queue page', () => {
    renderAt('/revision')

    expect(screen.getByText('Revision queue')).toBeInTheDocument()
    expect(screen.queryByText('← Exit focused mode')).not.toBeInTheDocument()
    expect(screen.getByRole('navigation')).toBeInTheDocument()
    expect(
      screen.getByRole('searchbox', {
        name: 'Search curriculum and DSA problems',
      }),
    ).toBeInTheDocument()
  })

  it('does not list Search or Roadmap as sidebar destinations', () => {
    renderAt('/')
    expect(
      screen.queryByRole('link', { name: 'Search' }),
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole('link', { name: 'Roadmap' }),
    ).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument()
  })

  it('does not list My Topics as a sidebar destination', () => {
    renderAt('/')
    expect(
      screen.queryByRole('link', { name: 'My Topics' }),
    ).not.toBeInTheDocument()
  })

  it('enters focused mode only for topic study and topic revision routes', () => {
    const { unmount } = renderAt('/topics/a2-sliding-window/study')
    expect(screen.getByText('← Exit focused mode')).toBeInTheDocument()
    unmount()

    renderAt('/topics/a2-sliding-window/revision')
    expect(screen.getByText('← Exit focused mode')).toBeInTheDocument()
  })
})
