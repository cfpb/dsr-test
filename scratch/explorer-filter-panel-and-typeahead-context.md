# Explorer Filter Panel & Typeahead Context

This document captures recent context, investigations, decisions, and UI adjustments made to the Complaint Explorer filter panel and input components.

---

## 1. Filter Panel Adjustments

### Date Filters Spacing
- **Requirement**: Standardize the vertical spacing between the "From" and "To" labels and their respective date input fields to 10px.
- **Implementation**:
  - Updated `.date-input-label` in `src/components/filters/collapsible-filter/collapsible-filters.scss`:
    ```scss
    .date-input-label {
      display: block;
      margin: 0 0 10px;
      font-size: math.div(18px, $base-font-size-px) + em;
      font-weight: 500;
      letter-spacing: inherit;
    }
    ```
  - Ensures consistent 10px spacing across all date filter inputs (e.g., "Date received", "Date referred").

### "Select all" Checkbox Styling
- **Requirement**: Ensure the "Select all" checkbox input label in filters uses font weight 500.
- **Implementation**:
  - Updated `src/components/filters/aggregation/aggregation.scss`:
    ```scss
    .aggregation-select-all__checkbox {
      margin-bottom: 0;

      .a-label {
        font-weight: 500;
      }
    }
    ```

---

## 2. Typeahead & Search Input Placeholder Investigation

### Problem Description
- In typeahead search fields (e.g., "Enter company name"), placeholder text appears slightly cut off at the bottom on letter descenders (`g`, `y`, `p`, `q`).

### Prior Work in `ccdb5-ui` (Commit `83e69533256375354c73c696a46a0675bfdb0845`)
- In `ccdb5-ui`, previous attempts to fix input styling involved:
  1. Removing custom padding overrides in `src/components/typeahead/typeahead.scss`.
  2. Setting `type: 'search'` in typeahead input props (`src/components/typeahead/typeahead/typeahead.js` and `async-typeahead.js`).
  3. Aligning control containers in `src/components/search/search-bar.scss` (`align-items: center`).
- However, descender clipping in placeholder text remained present.

### Root Cause Analysis
- **Native Placeholder Box vs. Font Metrics**: Chrome renders native `::placeholder` text within a tighter internal bounding box than actual typed text. The descenders of the `Source Sans 3` font extend slightly below this box.
- **Typed Text vs. Placeholder**: When typing actual characters into the field, text renders completely without clipping. Native date inputs are also unaffected.
- **Design System Search Height**: The CFPB Design System (`@cfpb/cfpb-design-system/src/components/cfpb-forms/search-input.scss`) sets a fixed `height: rem-from-px(19.2)` (`1.2rem`) on `input[type='search']`, which constrains search inputs unless overridden.

### Solutions Attempted & Results
1. **CSS Adjustments**:
   - Tested extra bottom/top padding, switching between `type="search"` and `type="text"`, overriding `height`, `min-height: 2.5rem`, `line-height` (`1.25` vs `normal`), `overflow: visible`, and directly styling `::placeholder`.
   - **Result**: Typed text and input sizing improved, but the browser-rendered native placeholder remained clipped within Chrome's internal placeholder box regardless of container height.
2. **DOM Overlay Span Placeholder**:
   - Tested replacing the native placeholder with an absolutely positioned `<span>` overlay containing the same copy.
   - **Result**: Completely eliminates the visual clipping because it is real DOM text rather than native `::placeholder`. However, it requires adding extra markup to every typeahead, state logic to show/hide on input changes/focus, and custom CSS to keep it aligned with search icons and clear buttons across viewports.

### Decision
- **Reject the Overlay Approach**: The DOM overlay introduces disproportionate complexity, potential state synchronization bugs, and maintenance overhead for a minor visual nuance on transient helper text.
- **Retain Clean Native Behavior**: Stash/revert brittle visual hacks and leave the minor native placeholder clipping in Chrome rather than introducing and maintaining a second placeholder system.

---

## 3. Filter Panel Status & Alignment Summary

- **Filter Selection & Reconciliation Logic**: Merged via `dfbe16e82` (`DATAP-2062`), reconciling parent/child selection rules, final-child collapse, parent-to-siblings expansion, and zero-count aggregation reconstruction.
- **Component Architecture**:
  - `CollapsibleFilter`: Uses round plus/minus icons (`o-expandable__cue-open` / `o-expandable__cue-close`) aligned with CFPB Design System conventions.
  - `AggregationBranch`: Uses `@cfpb/design-system-react` `Checkbox` with `isIndeterminate`, keeping branch toggling separate from checkbox selection.
  - `MoreOrLess`: Standardized with `DEFAULT_LIMIT = 5`.
  - `RefinePanel`: Uses `o-well` container, responsive toggle controls ("Filter results" / "Close filters"), and filter loading overlay management.
