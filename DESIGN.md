# Design system: Overclocked

World: the team's competition binder. Engineering-paper grid, ruled reference sheets, and divider tabs; real results are the evidence.

## Color
- Paper `#F7F8FA` (page), White `#FFFFFF` (sheets), Sky `#EEF3FF` (notes, cover plate)
- Ink `#111827` (text, heavy 1.5px rules), Muted `#5E6675` (secondary text), Rule `#D6DCE8` (1px rules)
- Team blue `#3157D5` (primary actions, emphasis, active tab), Deep blue `#17337C` (support field, icon tile)
- Gold `#D3AE36`: medal marks and list bullets only; never text on light grounds
- On deep blue: text white, secondary `#C9D4F5`

## Type
- Display: Sora (variable, self-hosted), 600–800; large headings tracked -0.03 to -0.05em
- Text: Inter (variable, self-hosted); body 16–18px, line-height 1.6
- Figures: tabular lining numerals for all stats and placements

## Structure
- Container max 1240px; 12-column grid; asymmetric splits (5/7, 6/5)
- Separation by rules, not cards: 1.5px ink rule opens a sheet, 1px rules divide rows
- Corners 6px. One elevated element: the support sheet.
- Grid paper only on the hero and the roster panel

## Motion
- One entrance: wordmark characters rise, phoenix draws upward into its plate (GSAP, expo.out)
- Results rows post in order on first view
- Divider tabs raise the active section; everything off under prefers-reduced-motion
