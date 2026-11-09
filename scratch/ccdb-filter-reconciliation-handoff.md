# CCDB filter reconciliation handoff

## Goal

Port Explorer/CE's completed parent/child filter reconciliation behavior to
`/Users/dinhr/projects/ccdb5-ui`. Keep the behavior application-owned and out
of DSR. Avoid unrelated presentation changes.

Read the original alignment brief first:

`/Users/dinhr/projects/dsr-test/prompts/explorer-ccdb-filter-panel-alignment.md`

## Explorer reference implementation

The completed CE work is on branch `rad-ccdb-filter-reconciliation`:

- `454ab6a8b` — centralized missing-filter restoration and selection logic
- `48baab103` — legacy all-children edge-case correction

The branch was validated with 53 focused tests, ESLint, and `git diff --check`.

Relevant CE files:

- `frontend-react/src/components/filters/utils.js`
- `frontend-react/src/components/filters/base-filter/base-filter.js`
- `frontend-react/src/components/filters/aggregation-branch/aggregation-branch.js`
- `frontend-react/src/components/filters/aggregation-item/aggregation-item.js`
- `frontend-react/src/reducers/filters/filters-slice.js`
- Corresponding `*.spec.js` files

Use `git show rad-ccdb-filter-reconciliation:<path>` or compare the two commits
above. Do not assume the currently checked-out Explorer branch contains this
implementation; at handoff time Explorer was on `rad-hot-buttons`.

## Required normalization contract

- Store either a parent key or a proper subset of child keys, never both.
- Selecting the final unchecked child replaces all children with the parent.
- Only perform that collapse when the clicked child is currently unchecked.
  This preserves correct behavior for legacy state containing every child.
- Unchecking one child from a selected parent replaces the parent with every
  known sibling except the unchecked child.
- Clicking an indeterminate parent replaces its children with the parent.
- Match a branch exactly: `candidate === parent` or
  `candidate.startsWith(parent + SLUG_SEPARATOR)`.
- Never use a bare prefix or broad substring match for branch removal.
- Deduplicate multi-add and replacement results.
- Normalize against API options plus reconstructed selected options so
  selections omitted from aggregation responses remain available.
- Keep Redux/query/reconstruction/normalization logic outside DSR.

## CCDB files to inspect

- `src/components/filters/aggregation/aggregation-branch/aggregation-branch.js`
- `src/components/filters/aggregation/aggregation-item/aggregation-item.js`
- `src/components/filters/nested-filter/nested-filter.js`
- `src/utils/index.js`
- `src/utils/filters.ts`
- `src/reducers/filters/filters-slice.ts`
- Corresponding specs

## Known CCDB holes from code inspection

1. `AggregationBranch` computes active branch state with broad prefix matching:
   `aFilter.indexOf(item.key) === 0`. This can confuse `Foo` with `Foobar`.
2. Parent selection removes children with broad substring matching:
   `filter.includes(item.key + SLUG_SEPARATOR)`.
3. `AggregationItem.appliedFilters()` reads siblings directly from raw
   aggregation data and assumes `aggs.find(...)` succeeds. A reconstructed
   selected parent/child missing from the API response can therefore be omitted
   from normalization or cause an undefined-parent failure.
4. `appliedFilters()` also uses broad `includes(parent + separator)` matching.
5. `getUpdatedFilters()` expands a selected parent using raw aggregation
   siblings rather than the already reconstructed/rendered option set.
6. Existing CCDB tests cover ordinary collapse/expansion but do not adequately
   cover prefix collisions or interaction with reconstructed missing children.

CCDB already deduplicates `filtersReplaced` with `new Set`, and its
`multipleFiltersAdded` avoids adding existing values. Preserve those behaviors.

## Implementation direction

Prefer passing the normalized/rendered sibling list from `AggregationBranch`
to child items, similar to CE, rather than making each child fetch and interpret
raw aggregations independently. This gives selection handlers the combination
of API buckets and reconstructed missing selections. Keep the change narrow;
do not extract these algorithms into Design System components.

## Regression cases

Add automated coverage for:

1. One/some selected children produce an indeterminate parent.
2. Selecting the final unchecked child stores only the parent.
3. Clicking a selected child in legacy all-children state deselects it rather
   than collapsing to the parent.
4. Unchecking a child from a selected parent stores all remaining siblings.
5. Clicking an indeterminate parent stores only the parent.
6. `Foo` operations do not affect `Foobar` or `Foobar•Child`.
7. Multi-add/replacement results contain no duplicates.
8. A selected child missing from the API aggregation remains rendered and is
   preserved through subsequent parent/child interactions.
9. A completely missing selected parent/branch does not throw.

Run focused component, utility, and reducer tests plus lint/type checking for
all touched CCDB files.
