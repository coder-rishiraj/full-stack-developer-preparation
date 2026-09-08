import { create } from 'zustand'
import { clearUserState, loadUserState, saveUserState } from '@/lib/idb'
import { EMPTY_USER_STATE, exportUserState, importUserState } from '@/lib/import-export'
import { computeNextRevision, defaultTopicProgress } from '@/domain/revision'
import {
  applyStudyRevisionSchedule,
  buildRevisionSchedule,
  completeNextRevisionSlot,
  isStudiedStatus,
  mergeSchedulePreservingCompletion,
  nextRevisionFromSchedule,
} from '@/domain/revision-schedule'
import { buildCustomTopicInput } from '@/domain/user-content'
import type {
  Confidence,
  CustomTopic,
  DsaStatus,
  OverlayListField,
  StudyStatus,
  TopicOverlay,
  UserState,
} from '@/domain/types'

type UserStore = UserState & {
  hydrated: boolean
  hydrate: () => Promise<void>
  setTheme: (theme: UserState['theme']) => void
  setInterviewDate: (interviewDate: string | undefined) => void
  setTopicStatus: (topicId: string, status: StudyStatus) => void
  setTopicConfidence: (topicId: string, confidence: Confidence) => void
  markTopicRevised: (topicId: string) => void
  rescheduleTopic: (topicId: string) => void
  setProblemStatus: (problemId: string, status: DsaStatus) => void
  setNote: (entityId: string, note: string) => void
  toggleBookmark: (entityId: string) => void
  setFocus: (focus: UserState['currentFocus']) => void
  addOverlayPoint: (topicId: string, field: OverlayListField, text: string) => void
  updateOverlayPoint: (
    topicId: string,
    field: OverlayListField,
    index: number,
    text: string,
  ) => void
  removeOverlayPoint: (topicId: string, field: OverlayListField, index: number) => void
  addCustomTopic: (
    input: Parameters<typeof buildCustomTopicInput>[0],
  ) => CustomTopic
  updateCustomTopic: (id: string, patch: Partial<CustomTopic>) => void
  deleteCustomTopic: (id: string) => void
  exportJson: () => string
  importJson: (json: string) => void
  resetAll: () => Promise<void>
}

const ACTION_KEYS = new Set([
  'hydrated',
  'hydrate',
  'setTheme',
  'setInterviewDate',
  'setTopicStatus',
  'setTopicConfidence',
  'markTopicRevised',
  'rescheduleTopic',
  'setProblemStatus',
  'setNote',
  'toggleBookmark',
  'setFocus',
  'addOverlayPoint',
  'updateOverlayPoint',
  'removeOverlayPoint',
  'addCustomTopic',
  'updateCustomTopic',
  'deleteCustomTopic',
  'exportJson',
  'importJson',
  'resetAll',
])

let persistTimer: ReturnType<typeof setTimeout> | null = null

function schedulePersist(getState: () => UserStore) {
  if (persistTimer) clearTimeout(persistTimer)
  persistTimer = setTimeout(() => {
    const full = getState()
    const state = Object.fromEntries(
      Object.entries(full).filter(([k]) => !ACTION_KEYS.has(k)),
    ) as UserState
    void saveUserState(state)
  }, 200)
}

function normalizeOverlay(overlay: TopicOverlay): TopicOverlay | undefined {
  const next: TopicOverlay = {}
  let has = false
  for (const key of Object.keys(overlay) as OverlayListField[]) {
    const list = (overlay[key] ?? []).map((s) => s.trim()).filter(Boolean)
    if (list.length) {
      next[key] = list
      has = true
    }
  }
  return has ? next : undefined
}

export const useUserStore = create<UserStore>((set, get) => ({
  ...EMPTY_USER_STATE,
  hydrated: false,

  hydrate: async () => {
    const loaded = await loadUserState()
    if (loaded) {
      const customTopics = Object.fromEntries(
        Object.entries(loaded.customTopics ?? {}).map(([id, topic]) => [
          id,
          {
            ...topic,
            sectionId:
              topic.sectionId?.trim() ||
              `CUSTOM-${topic.track}`,
          },
        ]),
      )
      set({
        ...EMPTY_USER_STATE,
        ...loaded,
        topicOverlays: loaded.topicOverlays ?? {},
        customTopics,
        hydrated: true,
      })
    } else {
      set({ hydrated: true })
    }
  },

  setTheme: (theme) => {
    set({ theme })
    schedulePersist(get)
  },

  setInterviewDate: (interviewDate) => {
    const normalized =
      interviewDate && /^\d{4}-\d{2}-\d{2}$/.test(interviewDate)
        ? interviewDate
        : undefined
    const topics = { ...get().topics }
    for (const [id, progress] of Object.entries(topics)) {
      if (
        !isStudiedStatus(progress.status) &&
        progress.status !== 'needs_revision'
      ) {
        continue
      }
      if (!progress.revisionSchedule?.length && progress.status === 'not_started') {
        continue
      }
      const studiedAt = progress.firstStudied
        ? new Date(progress.firstStudied)
        : progress.lastStudied
          ? new Date(progress.lastStudied)
          : new Date()
      const fresh = buildRevisionSchedule(studiedAt, undefined, {
        interviewDate: normalized,
      })
      const revisionSchedule = mergeSchedulePreservingCompletion(
        progress.revisionSchedule,
        fresh,
      )
      topics[id] = {
        ...progress,
        revisionSchedule,
        nextRevision: nextRevisionFromSchedule(revisionSchedule),
      }
    }
    set({ interviewDate: normalized, topics })
    schedulePersist(get)
  },

  setTopicStatus: (topicId, status) => {
    const now = new Date()
    const existing = get().topics[topicId] ?? defaultTopicProgress()
    const scheduled = applyStudyRevisionSchedule(existing, status, now, {
      interviewDate: get().interviewDate,
    })
    const topics = {
      ...get().topics,
      [topicId]: {
        ...existing,
        status,
        lastStudied: now.toISOString(),
        firstStudied: existing.firstStudied ?? now.toISOString(),
        ...scheduled,
        ...(status === 'needs_revision'
          ? {
              lastRevised: now.toISOString(),
              revisionCount: existing.revisionCount + 1,
            }
          : {}),
      },
    }
    const currentFocus = { ...get().currentFocus }
    if (status === 'learning') currentFocus.learning = topicId
    set({ topics, currentFocus })
    schedulePersist(get)
  },

  setTopicConfidence: (topicId, confidence) => {
    const existing = get().topics[topicId] ?? defaultTopicProgress()
    const nextRevision =
      nextRevisionFromSchedule(existing.revisionSchedule) ??
      computeNextRevision(existing.status, confidence)
    set({
      topics: {
        ...get().topics,
        [topicId]: { ...existing, confidence, nextRevision },
      },
    })
    schedulePersist(get)
  },

  markTopicRevised: (topicId) => {
    const now = new Date()
    const existing = get().topics[topicId] ?? defaultTopicProgress()
    const status: StudyStatus =
      existing.status === 'needs_revision' ? 'first_pass' : existing.status
    const revisionSchedule = existing.revisionSchedule?.length
      ? completeNextRevisionSlot(existing.revisionSchedule, now)
      : existing.revisionSchedule
    const nextRevision =
      nextRevisionFromSchedule(revisionSchedule) ??
      computeNextRevision(status, existing.confidence, now)
    set({
      topics: {
        ...get().topics,
        [topicId]: {
          ...existing,
          status,
          lastRevised: now.toISOString(),
          revisionCount: existing.revisionCount + 1,
          revisionSchedule,
          nextRevision,
        },
      },
    })
    schedulePersist(get)
  },

  rescheduleTopic: (topicId) => {
    const now = new Date()
    const existing = get().topics[topicId] ?? defaultTopicProgress()
    if (existing.status === 'not_started') return
    const revisionSchedule = buildRevisionSchedule(now, undefined, {
      interviewDate: get().interviewDate,
    })
    set({
      topics: {
        ...get().topics,
        [topicId]: {
          ...existing,
          lastStudied: now.toISOString(),
          firstStudied: existing.firstStudied ?? now.toISOString(),
          revisionSchedule,
          nextRevision: nextRevisionFromSchedule(revisionSchedule),
        },
      },
    })
    schedulePersist(get)
  },

  setProblemStatus: (problemId, status) => {
    const now = new Date().toISOString()
    const existing = get().problems[problemId] ?? {
      status: 'not_attempted' as DsaStatus,
      attempts: 0,
      solvedIndependently: false,
      solvedWithHints: false,
      solutionViewed: false,
      revisionCount: 0,
      confidence: 1 as Confidence,
      attemptHistory: [],
    }
    const solvedIndependently =
      status === 'solved_independently' || status === 'mastered'
        ? true
        : existing.solvedIndependently
    const solvedWithHints =
      status === 'solved_with_hint' ? true : existing.solvedWithHints
    set({
      problems: {
        ...get().problems,
        [problemId]: {
          ...existing,
          status,
          attempts: existing.attempts + (status === 'not_attempted' ? 0 : 1),
          solvedIndependently,
          solvedWithHints,
          lastAttempted: now,
          lastSolved:
            solvedIndependently || solvedWithHints ? now : existing.lastSolved,
          attemptHistory: [
            ...existing.attemptHistory,
            { at: now, outcome: status },
          ],
        },
      },
    })
    schedulePersist(get)
  },

  setNote: (entityId, note) => {
    set({ notes: { ...get().notes, [entityId]: note } })
    schedulePersist(get)
  },

  toggleBookmark: (entityId) => {
    const bookmarks = get().bookmarks.includes(entityId)
      ? get().bookmarks.filter((id) => id !== entityId)
      : [...get().bookmarks, entityId]
    set({ bookmarks })
    schedulePersist(get)
  },

  setFocus: (focus) => {
    set({ currentFocus: focus })
    schedulePersist(get)
  },

  addOverlayPoint: (topicId, field, text) => {
    const trimmed = text.trim()
    if (!trimmed) return
    const current = get().topicOverlays[topicId] ?? {}
    const list = [...(current[field] ?? []), trimmed]
    const normalized = normalizeOverlay({ ...current, [field]: list })
    const topicOverlays = { ...get().topicOverlays }
    if (normalized) topicOverlays[topicId] = normalized
    else delete topicOverlays[topicId]
    set({ topicOverlays })
    schedulePersist(get)
  },

  updateOverlayPoint: (topicId, field, index, text) => {
    const trimmed = text.trim()
    const current = get().topicOverlays[topicId] ?? {}
    const list = [...(current[field] ?? [])]
    if (index < 0 || index >= list.length) return
    if (!trimmed) {
      list.splice(index, 1)
    } else {
      list[index] = trimmed
    }
    const normalized = normalizeOverlay({ ...current, [field]: list })
    const topicOverlays = { ...get().topicOverlays }
    if (normalized) topicOverlays[topicId] = normalized
    else delete topicOverlays[topicId]
    set({ topicOverlays })
    schedulePersist(get)
  },

  removeOverlayPoint: (topicId, field, index) => {
    const current = get().topicOverlays[topicId] ?? {}
    const list = [...(current[field] ?? [])]
    if (index < 0 || index >= list.length) return
    list.splice(index, 1)
    const normalized = normalizeOverlay({ ...current, [field]: list })
    const topicOverlays = { ...get().topicOverlays }
    if (normalized) topicOverlays[topicId] = normalized
    else delete topicOverlays[topicId]
    set({ topicOverlays })
    schedulePersist(get)
  },

  addCustomTopic: (input) => {
    const topic = buildCustomTopicInput(input)
    set({
      customTopics: { ...get().customTopics, [topic.id]: topic },
    })
    schedulePersist(get)
    return topic
  },

  updateCustomTopic: (id, patch) => {
    const existing = get().customTopics[id]
    if (!existing) return
    const updated: CustomTopic = {
      ...existing,
      ...patch,
      id: existing.id,
      updatedAt: new Date().toISOString(),
    }
    set({
      customTopics: { ...get().customTopics, [id]: updated },
    })
    schedulePersist(get)
  },

  deleteCustomTopic: (id) => {
    const customTopics = { ...get().customTopics }
    delete customTopics[id]
    const topicOverlays = { ...get().topicOverlays }
    delete topicOverlays[id]
    const notes = { ...get().notes }
    delete notes[id]
    const topics = { ...get().topics }
    delete topics[id]
    const bookmarks = get().bookmarks.filter((b) => b !== id)
    set({ customTopics, topicOverlays, notes, topics, bookmarks })
    schedulePersist(get)
  },

  exportJson: () => {
    const full = get()
    const state = Object.fromEntries(
      Object.entries(full).filter(([k]) => !ACTION_KEYS.has(k)),
    ) as UserState
    return exportUserState(state)
  },

  importJson: (json) => {
    const state = importUserState(json)
    set({ ...state })
    schedulePersist(get)
  },

  resetAll: async () => {
    await clearUserState()
    set({ ...EMPTY_USER_STATE, hydrated: true })
  },
}))
