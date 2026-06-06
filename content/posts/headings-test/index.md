---
title: "Headings Test — All Levels"
slug: headings-test
date: 2026-06-06
draft: false
showToc: true
tocMainTitle: "On this page"
tocSubTitle: "In this section"
description: "A test post exercising every heading level to verify left and right TOC rendering, smooth scroll, and heading highlight."
---

## First H2 Section

This section tests the very first H2 in the document, which should appear in the left (main) TOC.

### H3 Under First H2

An H3 should appear in the right (sub) TOC, nested under its parent H2. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

#### H4 Under First H2 → First H3

An H4 should also appear in the right TOC, indented further under its H3 parent. This verifies the multi-level nesting.

#### Another H4 in the same H3

Multiple H4s under the same H3 test right-TOC list continuity.

### Another H3 Under First H2

This H3 verifies that the right TOC correctly shows multiple siblings at the same level.

## Second H2 Section

A different H2 parent to verify that scrolling past it updates both the active state in the left TOC and the right TOC content.

### H3 Under Second H2

When scrolled here, the left TOC should highlight "Second H2 Section" and the right TOC should show this H3 as active.

#### An H4 Under Second H2

This should appear in the right TOC indented under its H3.

## Third H2 Section — With a Loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong Heading

Long headings test wrapping behaviour in the TOC sidebar. The TOC link text should gracefully overflow.

### H3: Steps to reproduce

1. Step one
2. Step two
3. Step three
4. Step four

#### H4: Step details

Each step may have details. This H4 drills into step information for the right TOC.

### H3: 100% CSS coverage

A heading starting with digits to verify `CSS.escape` is not needed in right TOC hrefs or querySelector lookups.

#### H4: 100th percentile

Another digit-starting heading — the right TOC link should scroll correctly and the heading highlight should fire.

#### H4: Looooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong H4 heading

This very long H4 heading should wrap inside the right TOC sub-navigation panel, verifying that `word-break: break-word` works for H4 items too. It should also center and highlight correctly when clicked from the right TOC.


## Fourth H2: Special chars (colons, dots, spaces)

A heading with **id-like** characters: colons `:`, dots `.`, and spaces ` ` — historically problematic when `CSS.escape` was misused in hrefs.

### H3: version 2.0.0 (stable)

This H3 has a dot and parentheses in its text (Hugo-generated ID will be `version-2-0-0-stable`). Clicking its right-TOC link should scroll and highlight.

### H3: feature: dark-mode (2026)

This H3 contains a colon, hyphen, and parentheses. Hugo typically strips colons or converts them. Verifies the right TOC click handler does not break.

## Fifth H2 Section

The last H2 to verify scroll-to-bottom behaviour. When this is near the viewport bottom, the right TOC should keep the active state updated.

### H3 Subsection

A short paragraph providing enough content to make scrolling noticeable.

#### H4 Detail

Deep nesting level.

##### H5 — Should not appear in TOC

H5 and H6 headings are below the configured TOC depth (default 4) and should not appear in either the left or right TOC.

###### H6 — Also hidden from TOC

This should also be invisible in the TOC.

### H3 Final sub

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.


## Sixth H2 Section — Performance Testing

This section tests how the TOC behaves with many closely-spaced headings. The IntersectionObserver should correctly highlight each heading as it scrolls through the viewport.

### H3: Frame timing

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

#### H4: requestAnimationFrame

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

#### H4: Frame budget

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.

### H3: Memory profiling

Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur.

#### H4: Heap snapshots

Adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam.

#### H4: GC pressure

Nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur.

### H3: Bundle size analysis

At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.

#### H4: Tree shaking

Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.

#### H4: Code splitting

Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus.

## Seventh H2 Section — Accessibility

Verifying that the TOC remains accessible with ARIA attributes, keyboard navigation, and screen reader support across all viewport sizes.

### H3: ARIA landmarks

The left TOC uses `aria-label` on the navigation element. The right TOC similarly marks itself as a complementary region. Active links use `aria-current="location"` to indicate the current section.

#### H4: aria-current behavior

When a TOC link becomes active, `aria-current="location"` is set. When it loses activation, the attribute is removed. This is verified by scrolling through each section and checking the TOC state.

### H3: Keyboard navigation

Tab through TOC links should follow logical order. Enter or Space activates a link, triggering the custom smooth scroll and heading highlight.

#### H4: Focus management

After clicking a TOC link, focus remains on the link. The heading highlight provides visual feedback that the target section was reached.

### H3: Reduced motion

When `prefers-reduced-motion: reduce` is set, the smooth scroll animation is skipped and the view jumps instantly to the heading. The heading highlight still fires.

#### H4: prefers-reduced-motion check

The `window.matchMedia('(prefers-reduced-motion: reduce)')` check falls back to `scrollIntoView({ behavior: 'instant' })` when motion reduction is preferred.

## Eighth H2 Section — Edge Cases

Testing unusual heading scenarios that might break the TOC logic or cause visual glitches.

### H3: Empty headings

#### H4:

An H4 with no heading text (empty content) should be skipped or handled gracefully by the TOC. It should not produce a broken TOC link.

### H3: Heading with only special characters

#### H4: !@#$%^&*()_+

A heading whose ID is generated from special characters needs proper escaping. Hugo should strip or encode these characters in the ID.

### H3: Consecutive headings without body text

#### H4: First consecutive H4

#### H4: Second consecutive H4

#### H4: Third consecutive H4

Multiple headings in a row with no body text between them test the TOC's ability to render dense heading lists without layout breaks.

### H3: Very deep nesting

This H3 is followed by an H4, which is followed by content, then back to H3 for the next section.

#### H4: Deep level under H3

Content at H4 level under the previous H3.

### H3: Heading with inline code

#### H4: The `fetch()` API

Headings containing inline code should display correctly in both TOC sidebars. The code formatting should be preserved or simplified.

#### H4: `Array.prototype.map()`

Another heading with inline code — the backticks should be stripped from the text extracted by the TOC.

## Ninth H2 Section — Scroll Restoration

Testing that the browser's scroll restoration on back/forward navigation works correctly with the custom smooth scroll implementation.

### H3: History.pushState

Each TOC click calls `history.pushState(null, '', '#' + rawId)` so the URL fragment reflects the current heading. This enables proper back/forward navigation.

#### H4: URL fragment on click

After clicking a TOC link, the URL should update to `#heading-id`. Refreshing the page should restore the scroll position to that heading.

### H3: Browser back button

Navigating back via the browser's back button should restore the previous scroll position and update the TOC active states.

#### H4: hashchange event

The page should handle `hashchange` events to keep the TOC in sync when navigating through history.

## Tenth H2 Section — Final Section

The last section to ensure the scroll-to-bottom behavior works correctly. The IntersectionObserver should detect the bottom of the page appropriately.

### H3: Last subsection

When this section is at the bottom of the viewport, the right TOC should show this H3 as active and the left TOC should highlight "Tenth H2 Section".

#### H4: Bottom boundary

The IntersectionObserver's rootMargin of `-75%` means the heading becomes active when it's in the top 25% of the viewport. At page bottom, the last heading should remain active until the page end.

### H3: End of document

There is no more content below this point. The TOC should keep the last visible heading highlighted.

Curabitur sodales ligula in libero. Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor. Maecenas mattis. Sed convallis tristique sem. Proin ut ligula vel nunc egestas porttitor. Morbi lectus risus, iaculis vel, suscipit quis, luctus non, massa. Fusce ac turpis quis ligula lacinia aliquet. Mauris ipsum. Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh. Quisque volutpat condimentum velit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.

## Batch A — Section 1: Bulk heading test 1

This is batch A section 1. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

### Batch A — Subsection 1.1

Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

### Batch A — Subsection 1.2

Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.


## Batch A — Section 2: Bulk heading test 2

This is batch A section 2. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

### Batch A — Subsection 2.1

Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

### Batch A — Subsection 2.2

Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.


## Batch A — Section 3: Bulk heading test 3

This is batch A section 3. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

### Batch A — Subsection 3.1

Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

### Batch A — Subsection 3.2

Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.


## Batch A — Section 4: Bulk heading test 4

This is batch A section 4. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

### Batch A — Subsection 4.1

Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

### Batch A — Subsection 4.2

Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.


## Batch A — Section 5: Bulk heading test 5

This is batch A section 5. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

### Batch A — Subsection 5.1

Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

### Batch A — Subsection 5.2

Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.


## Batch A — Section 6: Bulk heading test 6

This is batch A section 6. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

### Batch A — Subsection 6.1

Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

### Batch A — Subsection 6.2

Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.


## Batch A — Section 7: Bulk heading test 7

This is batch A section 7. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

### Batch A — Subsection 7.1

Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

### Batch A — Subsection 7.2

Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.


## Batch A — Section 8: Bulk heading test 8

This is batch A section 8. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

### Batch A — Subsection 8.1

Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

### Batch A — Subsection 8.2

Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.


## Batch A — Section 9: Bulk heading test 9

This is batch A section 9. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

### Batch A — Subsection 9.1

Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

### Batch A — Subsection 9.2

Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.


## Batch A — Section 10: Bulk heading test 10

This is batch A section 10. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

### Batch A — Subsection 10.1

Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

### Batch A — Subsection 10.2

Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.


## Batch A — Section 11: Bulk heading test 11

This is batch A section 11. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

### Batch A — Subsection 11.1

Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

### Batch A — Subsection 11.2

Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.


## Batch A — Section 12: Bulk heading test 12

This is batch A section 12. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

### Batch A — Subsection 12.1

Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

### Batch A — Subsection 12.2

Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.


## Batch A — Section 13: Bulk heading test 13

This is batch A section 13. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

### Batch A — Subsection 13.1

Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

### Batch A — Subsection 13.2

Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.


## Batch A — Section 14: Bulk heading test 14

This is batch A section 14. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

### Batch A — Subsection 14.1

Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

### Batch A — Subsection 14.2

Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.


## Batch A — Section 15: Bulk heading test 15

This is batch A section 15. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

### Batch A — Subsection 15.1

Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

### Batch A — Subsection 15.2

Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.


## Batch A — Section 16: Bulk heading test 16

This is batch A section 16. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

### Batch A — Subsection 16.1

Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

### Batch A — Subsection 16.2

Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.


## Batch A — Section 17: Bulk heading test 17

This is batch A section 17. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

### Batch A — Subsection 17.1

Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

### Batch A — Subsection 17.2

Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.


## Batch A — Section 18: Bulk heading test 18

This is batch A section 18. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

### Batch A — Subsection 18.1

Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

### Batch A — Subsection 18.2

Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.


## Batch A — Section 19: Bulk heading test 19

This is batch A section 19. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

### Batch A — Subsection 19.1

Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

### Batch A — Subsection 19.2

Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.


## Batch A — Section 20: Bulk heading test 20

This is batch A section 20. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

### Batch A — Subsection 20.1

Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

### Batch A — Subsection 20.2

Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.


## Batch B: Dense H3/H4 cluster

A single H2 containing 20 H3 sections, each with an H4 subsection, to stress-test the right TOC rendering and scrolling performance.

### Batch B — H3 #1: Sub-cluster 1

Content for batch B H3 #1. Lorem ipsum dolor sit amet, consectetur adipiscing elit.

#### Batch B — H4 #1: Detail for sub-cluster 1

Additional detail at H4 level under H3 #1. Duis aute irure dolor in reprehenderit in voluptate.

### Batch B — H3 #2: Sub-cluster 2

Content for batch B H3 #2. Lorem ipsum dolor sit amet, consectetur adipiscing elit.

#### Batch B — H4 #2: Detail for sub-cluster 2

Additional detail at H4 level under H3 #2. Duis aute irure dolor in reprehenderit in voluptate.

### Batch B — H3 #3: Sub-cluster 3

Content for batch B H3 #3. Lorem ipsum dolor sit amet, consectetur adipiscing elit.

#### Batch B — H4 #3: Detail for sub-cluster 3

Additional detail at H4 level under H3 #3. Duis aute irure dolor in reprehenderit in voluptate.

### Batch B — H3 #4: Sub-cluster 4

Content for batch B H3 #4. Lorem ipsum dolor sit amet, consectetur adipiscing elit.

#### Batch B — H4 #4: Detail for sub-cluster 4

Additional detail at H4 level under H3 #4. Duis aute irure dolor in reprehenderit in voluptate.

### Batch B — H3 #5: Sub-cluster 5

Content for batch B H3 #5. Lorem ipsum dolor sit amet, consectetur adipiscing elit.

#### Batch B — H4 #5: Detail for sub-cluster 5

Additional detail at H4 level under H3 #5. Duis aute irure dolor in reprehenderit in voluptate.

### Batch B — H3 #6: Sub-cluster 6

Content for batch B H3 #6. Lorem ipsum dolor sit amet, consectetur adipiscing elit.

#### Batch B — H4 #6: Detail for sub-cluster 6

Additional detail at H4 level under H3 #6. Duis aute irure dolor in reprehenderit in voluptate.

### Batch B — H3 #7: Sub-cluster 7

Content for batch B H3 #7. Lorem ipsum dolor sit amet, consectetur adipiscing elit.

#### Batch B — H4 #7: Detail for sub-cluster 7

Additional detail at H4 level under H3 #7. Duis aute irure dolor in reprehenderit in voluptate.

### Batch B — H3 #8: Sub-cluster 8

Content for batch B H3 #8. Lorem ipsum dolor sit amet, consectetur adipiscing elit.

#### Batch B — H4 #8: Detail for sub-cluster 8

Additional detail at H4 level under H3 #8. Duis aute irure dolor in reprehenderit in voluptate.

### Batch B — H3 #9: Sub-cluster 9

Content for batch B H3 #9. Lorem ipsum dolor sit amet, consectetur adipiscing elit.

#### Batch B — H4 #9: Detail for sub-cluster 9

Additional detail at H4 level under H3 #9. Duis aute irure dolor in reprehenderit in voluptate.

### Batch B — H3 #10: Sub-cluster 10

Content for batch B H3 #10. Lorem ipsum dolor sit amet, consectetur adipiscing elit.

#### Batch B — H4 #10: Detail for sub-cluster 10

Additional detail at H4 level under H3 #10. Duis aute irure dolor in reprehenderit in voluptate.

### Batch B — H3 #11: Sub-cluster 11

Content for batch B H3 #11. Lorem ipsum dolor sit amet, consectetur adipiscing elit.

#### Batch B — H4 #11: Detail for sub-cluster 11

Additional detail at H4 level under H3 #11. Duis aute irure dolor in reprehenderit in voluptate.

### Batch B — H3 #12: Sub-cluster 12

Content for batch B H3 #12. Lorem ipsum dolor sit amet, consectetur adipiscing elit.

#### Batch B — H4 #12: Detail for sub-cluster 12

Additional detail at H4 level under H3 #12. Duis aute irure dolor in reprehenderit in voluptate.

### Batch B — H3 #13: Sub-cluster 13

Content for batch B H3 #13. Lorem ipsum dolor sit amet, consectetur adipiscing elit.

#### Batch B — H4 #13: Detail for sub-cluster 13

Additional detail at H4 level under H3 #13. Duis aute irure dolor in reprehenderit in voluptate.

### Batch B — H3 #14: Sub-cluster 14

Content for batch B H3 #14. Lorem ipsum dolor sit amet, consectetur adipiscing elit.

#### Batch B — H4 #14: Detail for sub-cluster 14

Additional detail at H4 level under H3 #14. Duis aute irure dolor in reprehenderit in voluptate.

### Batch B — H3 #15: Sub-cluster 15

Content for batch B H3 #15. Lorem ipsum dolor sit amet, consectetur adipiscing elit.

#### Batch B — H4 #15: Detail for sub-cluster 15

Additional detail at H4 level under H3 #15. Duis aute irure dolor in reprehenderit in voluptate.

### Batch B — H3 #16: Sub-cluster 16

Content for batch B H3 #16. Lorem ipsum dolor sit amet, consectetur adipiscing elit.

#### Batch B — H4 #16: Detail for sub-cluster 16

Additional detail at H4 level under H3 #16. Duis aute irure dolor in reprehenderit in voluptate.

### Batch B — H3 #17: Sub-cluster 17

Content for batch B H3 #17. Lorem ipsum dolor sit amet, consectetur adipiscing elit.

#### Batch B — H4 #17: Detail for sub-cluster 17

Additional detail at H4 level under H3 #17. Duis aute irure dolor in reprehenderit in voluptate.

### Batch B — H3 #18: Sub-cluster 18

Content for batch B H3 #18. Lorem ipsum dolor sit amet, consectetur adipiscing elit.

#### Batch B — H4 #18: Detail for sub-cluster 18

Additional detail at H4 level under H3 #18. Duis aute irure dolor in reprehenderit in voluptate.

### Batch B — H3 #19: Sub-cluster 19

Content for batch B H3 #19. Lorem ipsum dolor sit amet, consectetur adipiscing elit.

#### Batch B — H4 #19: Detail for sub-cluster 19

Additional detail at H4 level under H3 #19. Duis aute irure dolor in reprehenderit in voluptate.

### Batch B — H3 #20: Sub-cluster 20

Content for batch B H3 #20. Lorem ipsum dolor sit amet, consectetur adipiscing elit.

#### Batch B — H4 #20: Detail for sub-cluster 20

Additional detail at H4 level under H3 #20. Duis aute irure dolor in reprehenderit in voluptate.

