# Explorer / CCDB filter panel alignment and DSR extraction notes

## Current alignment

Explorer and CCDB are now strongly aligned at the reusable presentation layer.

- Both panel surfaces use the CFPB Design System `o-well` class for box sizing,
  responsive padding, the gray background, and border.
- Collapsible filters share the same basic DOM and Design System classes:
  `o-expandable`, a button header, `Heading` label, round plus/minus cues, and
  expandable content with a divider.
- Aggregation leaf rows use the same structure: a DSR `Checkbox`, visible label,
  and a gray right-aligned count.
- Aggregation parent rows use a separate checkbox and toggle button. The toggle
  contains the visible label, count, and up/down caret, so checking a parent does
  not also expand it.
- Both implementations support an indeterminate parent checkbox when only child
  values are selected.
- Nested lists use `ul.children`, matching indentation and row dividers.
- Both implementations initially show five aggregation options before offering
  Show more / Show less.

The expandable, aggregation-item, and aggregation-branch presentation is roughly
90% aligned and is ready to inform DSR extraction.

## Recommended DSR extraction boundary

Start with small controlled presentation components rather than extracting the
entire filter panel:

1. `FilterExpandable`
2. `AggregationOption`
3. `AggregationBranch`
4. Optionally, a small `FilterList` styling wrapper

The expandable should support both controlled and uncontrolled state. Explorer
stores expanded filters in Redux, while CCDB currently uses local React state.

Useful configurable inputs include:

- caller-provided IDs
- label and description
- expanded state and expansion callback
- checked and indeterminate state
- disabled state
- count or caller-rendered count content
- parent selection callback
- branch expansion callback
- nested children

## Keep application-owned

Do not move these concerns into DSR:

- Redux state or actions
- aggregation fetching and response normalization
- complaint field names
- selected-filter sorting and parent/child replacement algorithms
- Explorer's Select all behavior
- loading and empty-data behavior
- date, age, company, ZIP, and typeahead controls
- application-specific panel open/close behavior
- show-more limits as filtering policy, even though both currently use five

## Remaining intentional differences

- Explorer has Select all; CCDB does not.
- Explorer manages filter expansion through Redux; CCDB uses local state.
- Explorer has a fixed-width desktop sidebar and its own desktop/mobile panel
  toggle, loading overlay, age filter, and date layouts.
- CCDB uses explicit `hr` elements between top-level sections and removes the
  well's top border because its filter well touches the search well above it.
- The applications use different filtering and parent/child selection logic,
  despite rendering nearly identical rows.
- CCDB supports disabled aggregation options. Explorer does not currently expose
  that option in its aggregation component interfaces.

## Panel-shell recommendation

The entire panel should not be the first shared component. `o-well` now provides
the common surface, but width, neighboring borders, mobile controls, loading,
and state remain application-specific. Extract the expandable and aggregation
rows first; revisit a configurable panel shell only after both applications use
the shared primitives.

