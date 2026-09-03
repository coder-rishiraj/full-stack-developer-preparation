import type { Priority } from '@/domain/types'
import type { SectionSeed, TopicSeed } from './build'

const CSS = ['css'] as const
const M23 = [2, 3]
const M34 = [3, 4]
const M56 = [5, 6]

function item(
  id: string,
  title: string,
  priority: Priority = 'tier1',
  extra: Partial<TopicSeed> = {},
): TopicSeed {
  const { tags, executionPriority, ...rest } = extra
  const months = priority === 'tier1' ? M23 : M56
  return {
    id,
    title,
    priority,
    months: extra.months ?? months,
    tags: [...CSS, ...(tags ?? [])],
    executionPriority:
      executionPriority ?? (priority === 'tier1' ? 'p0' : priority === 'tier2' ? 'p1' : 'later'),
    ...rest,
  }
}

function nest(
  parent: string,
  id: string,
  title: string,
  priority: Priority = 'tier1',
  extra: Partial<TopicSeed> = {},
): TopicSeed {
  return item(id, title, priority, {
    ...extra,
    curriculumLevel: 'nested-concept',
    parentTopicId: parent,
  })
}

function section(id: string, title: string, order: number, topics: TopicSeed[]): SectionSeed {
  return {
    id,
    track: 'B',
    title,
    order,
    defaultKind: 'theory',
    defaultDepth: 'medium',
    topics,
  }
}

/** B5.1–B5.12 — CSS / UI engineering, beginner → interview depth. */
export const TRACK_B_CSS_SECTIONS: SectionSeed[] = [
  section('B5.1', 'Cascade & Selectors', 140, [
    item('b5-cascade', 'The Cascade'),
    nest('b5-cascade', 'b5-cascade-origin-order', 'Origin, Importance & Source Order'),
    nest('b5-cascade', 'b5-inheritance', 'Inheritance'),
    nest('b5-cascade', 'b5-important', '!important'),
    item('b5-specificity', 'Specificity'),
    nest('b5-specificity', 'b5-specificity-math', 'Specificity Calculation'),
    nest('b5-specificity', 'b5-is-where', ':is() & :where()'),
    nest('b5-specificity', 'b5-has-selector', ':has()'),
    item('b5-cascade-layers', '@layer Cascade Layers', 'tier2'),
  ]),

  section('B5.2', 'Box Model & Flow', 141, [
    item('b5-box-model', 'Box Model'),
    nest('b5-box-model', 'b5-box-sizing', 'box-sizing'),
    nest('b5-box-model', 'b5-margin-collapse', 'Margin Collapse'),
    nest('b5-box-model', 'b5-overflow', 'Overflow'),
    nest('b5-box-model', 'b5-min-width-zero', 'min-width: 0 & Flex/Grid Shrink Bugs'),
    item('b5-bfc', 'Block Formatting Context'),
    nest('b5-bfc', 'b5-containing-floats', 'Containing Floats', 'tier2'),
  ]),

  section('B5.3', 'Display & Visibility', 142, [
    item('b5-display', 'The display Property'),
    nest('b5-display', 'b5-block-inline', 'block vs inline'),
    nest('b5-display', 'b5-inline-block', 'inline-block'),
    nest('b5-display', 'b5-none-hidden-opacity', 'none vs visibility vs opacity'),
  ]),

  section('B5.4', 'Flexbox', 143, [
    item('b5-flexbox', 'Flexbox'),
    nest('b5-flexbox', 'b5-flex-axis', 'Main Axis vs Cross Axis'),
    nest('b5-flexbox', 'b5-flex-wrap', 'Wrapping'),
    nest('b5-flexbox', 'b5-flex-grow-shrink', 'flex-grow, flex-shrink & flex-basis'),
    nest('b5-flexbox', 'b5-flex-alignment', 'Alignment & Centering'),
    nest('b5-flexbox', 'b5-flex-vs-grid', 'When Flexbox vs Grid'),
  ]),

  section('B5.5', 'Grid', 144, [
    item('b5-grid', 'Grid'),
    nest('b5-grid', 'b5-grid-tracks', 'Tracks, fr & gap'),
    nest('b5-grid', 'b5-minmax', 'minmax()'),
    nest('b5-grid', 'b5-template-areas', 'Grid Template Areas'),
    nest('b5-grid', 'b5-auto-fit-fill', 'auto-fit vs auto-fill'),
    nest('b5-grid', 'b5-subgrid', 'Subgrid', 'tier2'),
  ]),

  section('B5.6', 'Positioning & Stacking', 145, [
    item('b5-positioning', 'Positioning'),
    nest('b5-positioning', 'b5-containing-block', 'Containing Block'),
    nest('b5-positioning', 'b5-relative-absolute', 'relative & absolute'),
    nest('b5-positioning', 'b5-fixed', 'position: fixed'),
    nest('b5-positioning', 'b5-sticky', 'position: sticky'),
    item('b5-stacking-context', 'Stacking Context'),
    nest('b5-stacking-context', 'b5-z-index', 'z-index'),
    nest('b5-stacking-context', 'b5-stacking-triggers', 'What Creates a Stacking Context'),
  ]),

  section('B5.7', 'Units, Color & Typography', 146, [
    item('b5-units', 'CSS Units'),
    nest('b5-units', 'b5-px-rem-em', 'px vs rem vs em'),
    nest('b5-units', 'b5-viewport-units', 'Viewport Units (vw, svh)'),
    nest('b5-units', 'b5-clamp', 'clamp() & Fluid Values'),
    item('b5-typography', 'Typography'),
    nest('b5-typography', 'b5-line-height', 'Line Height & Measure'),
    nest('b5-typography', 'b5-web-fonts', 'Web Fonts'),
    item('b5-color', 'Color'),
    nest('b5-color', 'b5-color-scheme', 'color-scheme & light-dark()', 'tier2'),
  ]),

  section('B5.8', 'Responsive Design', 147, [
    item('b5-responsive', 'Responsive Design'),
    nest('b5-responsive', 'b5-mobile-first', 'Mobile-First'),
    nest('b5-responsive', 'b5-media-queries', 'Media Queries'),
    nest('b5-responsive', 'b5-fluid-type', 'Fluid Type & Spacing'),
    item('b5-container-queries', 'Container Queries'),
    item('b5-logical-properties', 'Logical Properties'),
  ]),

  section('B5.9', 'Theming & Custom Properties', 148, [
    item('b5-custom-properties', 'Custom Properties'),
    nest('b5-custom-properties', 'b5-theming', 'Theming with CSS Variables'),
    nest('b5-custom-properties', 'b5-tokens-vs-sass', 'Tokens vs Preprocessor Variables'),
  ]),

  section('B5.10', 'Motion', 149, [
    item('b5-transitions', 'Transitions'),
    nest('b5-transitions', 'b5-compositor-safe-motion', 'Compositor-Safe Animation'),
    item('b5-animations', 'Animations'),
    nest('b5-animations', 'b5-keyframes', '@keyframes'),
    nest('b5-animations', 'b5-prefers-reduced-motion', 'prefers-reduced-motion'),
  ]),

  section('B5.11', 'CSS Architecture', 150, [
    item('b5-css-architecture', 'CSS Architecture', 'tier1', { months: M56 }),
    nest('b5-css-architecture', 'b5-bem', 'BEM', 'tier1', { months: M56 }),
    nest('b5-css-architecture', 'b5-css-modules', 'CSS Modules', 'tier1', { months: M56 }),
    nest('b5-css-architecture', 'b5-tailwind', 'Utility-First / Tailwind', 'tier1', { months: M56 }),
    nest('b5-css-architecture', 'b5-css-in-js', 'CSS-in-JS Trade-offs', 'tier2', { months: M56 }),
    item('b5-design-systems', 'Design Systems', 'tier2', { months: M56, tags: ['design'] }),
    nest('b5-design-systems', 'b5-design-tokens', 'Design Tokens', 'tier2', { months: M56, tags: ['design'] }),
  ]),

  section('B5.12', 'HTML & CSS Accessibility', 151, [
    item('b5-semantic-html', 'Semantic HTML', 'tier1', { months: M23, tags: ['html', 'a11y'] }),
    nest('b5-semantic-html', 'b5-landmarks', 'Landmarks & Document Outline', 'tier1', {
      months: M23,
      tags: ['html', 'a11y'],
    }),
    nest('b5-semantic-html', 'b5-accessible-html-forms', 'Accessible HTML Forms', 'tier1', {
      months: M34,
      tags: ['html', 'a11y'],
    }),
    item('b5-accessibility', 'Accessibility', 'tier1', { months: M34, tags: ['a11y'] }),
    nest('b5-accessibility', 'b5-focus-styles', 'Focus Styles', 'tier1', { months: M34, tags: ['a11y'] }),
    nest('b5-accessibility', 'b5-forced-colors', 'forced-colors', 'tier2', { months: M56, tags: ['a11y'] }),
    item('b5-aria', 'ARIA Basics', 'tier1', { months: M34, tags: ['a11y'] }),
    nest('b5-aria', 'b5-aria-when-not', 'When Not to Use ARIA', 'tier1', { months: M34, tags: ['a11y'] }),
  ]),
]
