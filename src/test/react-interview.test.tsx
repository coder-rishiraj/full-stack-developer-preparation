import { describe, expect, it } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { REACT_INTERVIEW_SECTIONS } from '@/content/interview/react'
import { getTopicMeta } from '@/content/taxonomy'
import { ReactInterviewPage } from '@/pages/ReactInterviewPage'

describe('React interview guide', () => {
  it('has unique section and question ids', () => {
    const sectionIds = REACT_INTERVIEW_SECTIONS.map((s) => s.id)
    expect(new Set(sectionIds).size).toBe(sectionIds.length)

    const itemIds = REACT_INTERVIEW_SECTIONS.flatMap((s) => s.items.map((i) => i.id))
    expect(new Set(itemIds).size).toBe(itemIds.length)
    expect(itemIds.length).toBeGreaterThan(50)
  })

  it('MCQs have a valid correct option and non-MCQs have an answer', () => {
    for (const section of REACT_INTERVIEW_SECTIONS) {
      for (const item of section.items) {
        if (item.mcq) {
          expect(item.mcq.options.length).toBeGreaterThanOrEqual(2)
          expect(item.mcq.correctIndex).toBeGreaterThanOrEqual(0)
          expect(item.mcq.correctIndex).toBeLessThan(item.mcq.options.length)
          expect(item.mcq.explanation.length).toBeGreaterThan(10)
        } else {
          expect(item.answer.length).toBeGreaterThan(0)
        }
      }
    }
  })

  it('relatedTopicIds point at real curriculum topics', () => {
    for (const section of REACT_INTERVIEW_SECTIONS) {
      for (const item of section.items) {
        for (const id of item.relatedTopicIds ?? []) {
          expect(getTopicMeta(id), `${item.id} → ${id}`).toBeTruthy()
        }
      }
    }
  })
})

describe('ReactInterviewPage', () => {
  it('lists sections and reveals a fresher answer', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <ReactInterviewPage />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'React Interview Questions' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Freshers' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'MCQ drill' })).toBeInTheDocument()

    const freshers = screen.getByRole('heading', { name: 'Freshers' }).closest('section')
    expect(freshers).toBeTruthy()
    await user.click(within(freshers!).getByText('What is React?'))
    expect(
      screen.getByText(/open-source JavaScript library for building user interfaces/i),
    ).toBeInTheDocument()
  })

  it('checks an MCQ choice', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <ReactInterviewPage />
      </MemoryRouter>,
    )

    const mcq = screen.getByRole('heading', { name: 'MCQ drill' }).closest('section')
    expect(mcq).toBeTruthy()
    const prompt = within(mcq!).getByText(
      '______ is a necessary API for every React class component.',
    )
    const card = prompt.closest('details')
    expect(card).toBeTruthy()
    await user.click(prompt)
    await user.click(within(card!).getByRole('radio', { name: 'render' }))
    await user.click(within(card!).getByRole('button', { name: 'Check answer' }))
    expect(screen.getByText('Correct')).toBeInTheDocument()
  })
})
