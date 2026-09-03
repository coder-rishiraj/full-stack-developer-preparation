import { MemoryRouter } from 'react-router-dom'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { JAVA_INTERVIEW_SECTIONS } from '@/content/interview/java'
import { getTopicMeta } from '@/content/taxonomy'
import { JavaInterviewPage } from '@/pages/JavaInterviewPage'

describe('Java interview guide', () => {
  it('has unique section and question ids', () => {
    const sectionIds = JAVA_INTERVIEW_SECTIONS.map((s) => s.id)
    expect(new Set(sectionIds).size).toBe(sectionIds.length)

    const itemIds = JAVA_INTERVIEW_SECTIONS.flatMap((s) => s.items.map((i) => i.id))
    expect(new Set(itemIds).size).toBe(itemIds.length)
    expect(itemIds.length).toBeGreaterThan(40)
  })

  it('MCQs have a valid correct option and non-MCQs have an answer', () => {
    for (const section of JAVA_INTERVIEW_SECTIONS) {
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
    for (const section of JAVA_INTERVIEW_SECTIONS) {
      for (const item of section.items) {
        for (const id of item.relatedTopicIds ?? []) {
          expect(getTopicMeta(id), `${item.id} → ${id}`).toBeTruthy()
        }
      }
    }
  })
})

describe('JavaInterviewPage', () => {
  it('lists sections and reveals a fresher answer', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <JavaInterviewPage />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Java Interview Questions' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Freshers' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'MCQ drill' })).toBeInTheDocument()

    const freshers = screen.getByRole('heading', { name: 'Freshers' }).closest('section')
    expect(freshers).toBeTruthy()
    await user.click(within(freshers!).getByText('JDK vs JRE vs JVM?'))
    expect(screen.getByText(/JVM is the runtime that loads bytecode/i)).toBeInTheDocument()
  })
})
