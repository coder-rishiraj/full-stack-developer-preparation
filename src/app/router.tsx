import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { DashboardPage } from '@/pages/DashboardPage'
import { RoadmapPage } from '@/pages/RoadmapPage'
import { TrackPage } from '@/pages/TrackPage'
import { TopicPage } from '@/pages/TopicPage'
import { DsaExplorerPage } from '@/pages/DsaExplorerPage'
import { DsaProblemPage } from '@/pages/DsaProblemPage'
import { RevisionPage } from '@/pages/RevisionPage'
import { InterviewPage } from '@/pages/InterviewPage'
import { CapstonePage } from '@/pages/CapstonePage'
import { PrintCenterPage } from '@/pages/PrintCenterPage'
import { PrintPreviewPage } from '@/pages/PrintTopicPage'
import { PrintTopicRoutePage } from '@/pages/PrintTopicRoutePage'
import { PrintDsaSheetPage } from '@/pages/PrintDsaSheetPage'
import { PrintRevisionSheetPage } from '@/pages/PrintRevisionSheetPage'
import { SearchPage } from '@/pages/SearchPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { FavoritesPage } from '@/pages/FavoritesPage'
import { MyTopicsPage } from '@/pages/MyTopicsPage'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<DashboardPage />} />
          <Route path="roadmap" element={<RoadmapPage />} />
          <Route path="my-topics" element={<MyTopicsPage />} />
          <Route path="tracks/:trackId" element={<TrackPage />} />
          <Route path="topics/:topicId" element={<TopicPage mode="full" />} />
          <Route path="topics/:topicId/study" element={<TopicPage mode="study" />} />
          <Route path="topics/:topicId/revision" element={<TopicPage mode="revision" />} />
          <Route path="dsa" element={<DsaExplorerPage />} />
          <Route path="dsa/:problemId" element={<DsaProblemPage />} />
          <Route path="revision" element={<RevisionPage />} />
          <Route path="interview" element={<InterviewPage />} />
          <Route path="capstone" element={<CapstonePage />} />
          <Route path="print" element={<PrintCenterPage />} />
          <Route path="print/preview" element={<PrintPreviewPage />} />
          <Route path="print/topic/:topicId" element={<PrintTopicRoutePage />} />
          <Route path="print/dsa-sheet" element={<PrintDsaSheetPage />} />
          <Route path="print/revision" element={<PrintRevisionSheetPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="favorites" element={<FavoritesPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
