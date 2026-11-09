# explorer filter panel notes

trying to get Explorer's sidebar to look like CCDB. not extracting anything into DSR yet — everybody keeps copy/pasting this thing and we might share it later, but not this round.

CCDB is public: https://github.com/cfpb/ccdb5-ui
look under `src/components/filters/`

don't grab the redux, the aggregations, or the complaint field names. explorer can keep its own state. just the chrome.

also this is NOT the ds "filterable list control panel" (the one at the top of the page with apply/clear and the 3 columns). that's `o-filterable-list-controls`. different animal. ccdb is the sidebar well with checkboxes and counts.

## files i kept looking at

`filter-panel/filter-panel.js` + scss
- `.filter-panel.o-well`
- "Filter results by..."
- hrs between sections
- close button on small screens
- scss has the well border hacks and the padding against the hrs. worth a look.

`filter-panel/filter-panel-toggle.js`
- "Filter results" / "Close filters" when it's skinny. we probably want something like this if explorer doesn't have it.

`collapsible-filter/collapsible-filter.tsx`
- expandable without the box around it
- starts OPEN
- plus/minus round icons
- aria-label is like "Collapse Product filter"

don't use DSR Expandable for these. it slaps on background + border unless you pass inAccordion, and it calls `CFPB_Expandable.init()` which is a pain with react. ccdb rolled their own on purpose.

`aggregation/aggregation-item/aggregation-item.js`
- leaf row: DSR Checkbox + label + the count on the right
- we just switched this over from a raw input. dsr 2.0.3.

`aggregation/aggregation-branch/aggregation-branch.js`
- parent checkbox + a SEPARATE button for the name/count/caret
- clicking the checkbox should not open the kids
- `isIndeterminate` when only some children are on

`aggregation/aggregation.scss`
- gray lines between rows
- count parked on the right
- nested list is `ul.children` with a bit of indent

`more-or-less/more-or-less.js`
- shows 5 then "+ Show N more". skip if explorer doesn't truncate.

dates / zip / company typeahead = app stuff. only steal the layout if explorer actually has the same control.

## checkboxes

dsr 2.0.3 has `isIndeterminate` on Checkbox now. use that.

how ccdb does parent/child:
- all kids on → parent checked
- some kids on → mixed / indeterminate
- none → off
- check parent → select parent key, drop the child keys
- uncheck → wipe parent and kids

leaf rows: accessible name should be whatever's on screen. we used to aria-label the raw key and it was dumb ("TX" instead of "Texas (TX)").

parents: hide the checkbox label text (`u-visually-hidden`) since the button next to it already says the name. still needs a name for at.

## visually

sidebar is a well. heading. hrs between chunks (margin 0 on the hr, padding lives on the sections). expandables open. plus/minus. counts gray, right aligned. nested ones have the caret. rule lines. maybe show more after 5. mobile toggle.

## before i start ripping explorer apart

- where's their filter sidebar vs the files above
- what's actually different (well? hrs? default open? counts? caret vs checkbox? more/less? mobile?)
- what's just markup vs wired to their api
- anything explorer has that ccdb doesn't (apply button etc) — don't delete that without thinking

no shared FilterPanel component. not yet.
