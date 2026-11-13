import { useEffect, useState } from 'react'
import { hasProblemPage, loadProblemPage, type ProblemPage } from '@/content/problem-pages'

/** Loads the interview walkthrough for a problem, if one has been written. */
export function useProblemPage(problemId: string | undefined): {
  page: ProblemPage | undefined
  loading: boolean
} {
  const exists = Boolean(problemId && hasProblemPage(problemId))
  const [state, setState] = useState<{ id?: string; page?: ProblemPage; loading: boolean }>({ loading: exists })

  useEffect(() => {
    let cancelled = false
    if (!problemId || !exists) {
      setState({ id: problemId, loading: false })
      return
    }
    setState({ id: problemId, loading: true })
    loadProblemPage(problemId)
      .then((page) => {
        if (!cancelled) setState({ id: problemId, page, loading: false })
      })
      .catch(() => {
        if (!cancelled) setState({ id: problemId, loading: false })
      })
    return () => {
      cancelled = true
    }
  }, [problemId, exists])

  // Never show the previous problem's walkthrough while the next one loads.
  if (state.id !== problemId) return { page: undefined, loading: exists }
  return { page: state.page, loading: state.loading }
}
