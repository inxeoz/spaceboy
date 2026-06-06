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

Curabitur sodales ligula in libero. Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor. Maecenas mattis. Sed convallis tristique sem. Proin ut ligula vel nunc egestas porttitor. Morbi lectus risus, iaculis vel, suscipit quis, luctus non, massa. Fusce ac turpis quis ligula lacinia aliquet. Mauris ipsum. Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh. Quisque volutpat condimentum velit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.
