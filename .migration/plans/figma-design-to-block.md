# Plan: Migrate the Takara Bio Home Page from Figma

## Goal
Move the whole **Home Page_1** design from Figma into the site. Each section becomes a block or regular page content. The result is a sample home page you can view in the preview.

Figma source: `Takara-Bio-Visual-Design--1-` → node `2-3820`
(https://www.figma.com/design/9g3x8jEfvUMQaVLzfXey6v/Takara-Bio-Visual-Design--1-?node-id=2-3820)

## Current state
- The Figma add-on is on, and I can read the design again.
- The link points to the full home page frame (1440 × 4453 px). You chose to migrate **all sections**. You also picked the hero banner in the one-section question, so I'll build it first.
- The site is edited in **Universal Editor**. Every new block needs editor settings so authors can add it to a page and edit its fields.
- Existing blocks I can reuse as variants: accordion, cards, carousel, columns, embed, footer, form, fragment, header, hero, modal, quote, search, table, tabs, video.
- I'm in planning mode, so nothing has changed yet. I'll start the work once you switch to Execute mode.

## Sections found in the design
| # | Section | Likely approach |
|---|---------|-----------------|
| 1 | Header with mega-menu (Products, Research Areas, Resources & Tools, Services & Partnerships, Support) | Update the site header/navigation |
| 2 | Hero banner, with an image and an overlaid content panel | Variant of the **hero** block, done first |
| 3 | "What's happening at Takara Bio": heading and 3 cards | Variant of the **cards** block |
| 4 | Full-width image banner | Regular page content (image), or a simple variant |
| 5 | Impact counters: intro text, then Products & kits, Peer-reviewed citations, Countries served, Chat with a scientist | **New block** (counters) |
| 6 | Product cards: heading, description, "view all" button, 3 product cards | Variant of the **cards** block (may share with #3) |
| 7 | OEM cards: 2 large side-by-side cards | Variant of the **cards** or **columns** block |
| 8 | BioView story explorer: story list on the left, expanded story on the right | **New block**, or a variant of the **tabs** block |
| 9 | Footer: logo, tagline, social icons, 4 link columns, region, legal, copyright | Update the site footer |

I'll confirm the final block for each section after reading its design in detail. Where an existing block is about 80% or more similar, I'll reuse it.

## Approach
1. **Read the design.** Take a reference screenshot of the page and of each section. Then pull the layout, colors, fonts and spacing one section at a time, to avoid overloading the Figma connection.
2. **Set up site-wide styles.** Shared colors, fonts and spacing from Figma become site-wide design settings, so every block uses the same values.
3. **Build each block.** Per section, I'll write the code and styling to match the design on desktop and mobile. I'll also add its Universal Editor settings so it shows up as an option authors can add to a page.
4. **Header and footer.** I'll migrate the navigation and footer through their own process, since every page uses them.
5. **Build the sample page.** I'll make a local home page that uses all the blocks, with images saved locally and nothing linked to Figma.
6. **Check against the design.** I'll compare the preview with Figma at 1440 px wide and on mobile, section by section, and fix spacing, font and color differences.
7. **Report back.** I'll list every change. Everything stays local unless you ask me to upload or publish.

## Checklist
- [ ] Switch to Execute mode
- [ ] Capture reference screenshots of the full page and each section
- [ ] Extract shared colors, fonts and spacing into site-wide design settings
- [ ] Hero banner: build the hero variant, its editor settings and styling (first)
- [ ] "What's happening" cards: build the cards variant
- [ ] Full-width image banner: page content or a variant
- [ ] Impact counters: build the new counters block
- [ ] Product cards: build a cards variant, shared with "What's happening" if it matches
- [ ] OEM cards: build the cards or columns variant
- [ ] BioView story explorer: build the new block or a tabs variant
- [ ] Header and mega-menu navigation
- [ ] Footer
- [ ] Regenerate the Universal Editor settings so all new blocks can be added to pages
- [ ] Create the local sample home page with images saved locally
- [ ] Compare the preview with Figma on desktop and mobile, and fix differences
- [ ] Summarize changes (local only, not uploaded to Document Authoring or published)

## Open questions (I'll handle these as I go)
- **Header and footer:** these affect every page on the site. I'll check with you before replacing the current ones.
- **Counters:** should the numbers animate (roll up) when they scroll into view, or show as plain numbers? I'll check what the design shows and ask if it's unclear.
- **Story explorer:** should clicking a story on the left swap the expanded story on the right? I'll build it that way unless the design shows otherwise.
- **Page path:** where should the sample page live (for example, the site's home page or a test page)? I'll suggest a test page so the current home page isn't overwritten.
