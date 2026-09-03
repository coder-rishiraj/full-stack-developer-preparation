import type { SectionSeed } from './build'
import { TRACK_B_JAVASCRIPT_SECTIONS } from './track-b-javascript'
import { TRACK_B_TYPESCRIPT_SECTIONS } from './track-b-typescript'
import { TRACK_B_BROWSER_SECTIONS } from './track-b-browser'
import { TRACK_B_REACT_SECTIONS } from './track-b-react'
import { TRACK_B_CSS_SECTIONS } from './track-b-css'
import { TRACK_B_FSD_SECTIONS } from './track-b-fsd'

/** Track B — Frontend Engineering. B1 JS, B2 TypeScript, B3 Browser, B4 React, B5 CSS, B6 FSD. */
export const TRACK_B_SECTIONS: SectionSeed[] = [
  ...TRACK_B_JAVASCRIPT_SECTIONS,
  ...TRACK_B_TYPESCRIPT_SECTIONS,
  ...TRACK_B_BROWSER_SECTIONS,
  ...TRACK_B_REACT_SECTIONS,
  ...TRACK_B_CSS_SECTIONS,
  ...TRACK_B_FSD_SECTIONS,
]
