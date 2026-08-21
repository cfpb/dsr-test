# Explorer / CCDB filter panel follow-up

I looked through Explorer's current filter sidebar and compared it with the CCDB notes. Explorer already has most of the behavior we need, so I don't think this needs to turn into a shared component yet. This pass can stay focused on making Explorer's panel look and behave more like CCDB while leaving Explorer's state and API wiring alone.

## What Explorer already has

- a sidebar well and responsive show/hide control
- collapsible filter sections
- checkbox rows with counts on the right
- parent/child filters
- an indeterminate state when some children are selected
- nested indentation and separators between rows
- show more/show less behavior

## What I think should change

- Update the outer `RefinePanel` styling to match CCDB's well, heading, spacing, and section separators.
- Change the boxed blue "Show/Hide" expandable headers to the simpler CCDB-style headers with round plus/minus icons.
- Start the filter sections open, like CCDB. Explorer currently only starts `dateRange` open.
- Update `@cfpb/design-system-react` from `2.0.2` to at least `2.0.3` so we can use the current `Checkbox` support for `isIndeterminate`.
- Replace Explorer's raw checkbox wrapper in `filter-switch.js` with the DSR `Checkbox`.
- For parent rows, keep the checkbox separate from the button that opens the children. The button should contain the visible name, count, and caret so clicking the checkbox does not expand the branch.
- Use the visible label as the checkbox's accessible name. For parent rows, the checkbox label can be visually hidden because the adjacent button already displays the name.
- Decide whether exact CCDB parity means changing Explorer's initial visible limit from 8 items to 5.
- Update the small-screen control to say "Filter results" and "Close filters" instead of relying on the icon-only control.

## What should stay in Explorer

I would leave the following pieces alone:

- Redux state and filter actions
- aggregation fetching and response handling
- Explorer's complaint field names
- date, age, company, and typeahead behavior
- parent/child selection rules
- selected-filter ordering
- Explorer-specific apply/query behavior

The useful implementation boundary looks like this:

`RefinePanel -> CollapsibleFilter -> FilterSwitch / AggregationItem / AggregationBranch -> MoreOrLess`

That keeps this mostly in the presentation layer. I don't see a reason to change `filters-slice`, the query reducers, the aggregation hooks, or anything in `trends-slice` for this work. 

My recommendation is to make Explorer converge on CCDB's markup and styling first, see how much code is actually identical afterward, and revisit a shared DSR component in a separate round.
