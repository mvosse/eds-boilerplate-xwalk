/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Xcel Energy section breaks and section metadata.
 * Inserts <hr> section dividers and Section Metadata blocks based on
 * template section definitions from page-templates.json.
 * All selectors verified against captured DOM (migration-work/cleaned.html).
 *
 * Template sections (portal-homepage):
 *   1. Hero - selector: c-xeg-hero-v2:first-of-type (no style)
 *   2. Quick Actions - selector: c-xeg-multi-action-banner (no style)
 *   3. Convenient Energy - selector: c-xeg-two-column-v2:first-of-type (no style)
 *   4. Affordable Energy - selector: c-xeg-featured-content-v2:nth-of-type(1) (no style)
 *   5. Personalized Energy - selector: c-xeg-featured-content-v2:nth-of-type(2) (no style)
 *   6. Safer Energy - selector: c-xeg-two-column-v2:nth-of-type(2) (no style)
 *   7. Local Energy - selector: c-dc-video-component-v2 (no style)
 *   8. Cleaner Energy - selector: c-xeg-featured-content-v2:nth-of-type(3) (no style)
 *   9. Sustainable Energy - selector: c-xeg-hero-v2:nth-of-type(2) (no style)
 *  10. Contact CTA - selector: c-xeg-contact-support (style: dark-maroon)
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.after) {
    const { document } = payload;
    const sections = payload.template && payload.template.sections;
    if (!sections || sections.length < 2) return;

    // Helper: resolve a section selector to an element.
    // Template selectors use :nth-of-type which may not work reliably on custom
    // elements in all browsers. Fall back to querySelectorAll-based index matching.
    function resolveSelector(root, selector) {
      // Try the selector directly first
      let el = root.querySelector(selector);
      if (el) return el;

      // Parse selectors like "c-xeg-hero-v2:nth-of-type(2)" or "c-xeg-hero-v2:first-of-type"
      const nthMatch = selector.match(/^([^:]+):nth-of-type\((\d+)\)$/);
      const firstMatch = selector.match(/^([^:]+):first-of-type$/);

      if (nthMatch) {
        const tag = nthMatch[1];
        const index = parseInt(nthMatch[2], 10) - 1; // 0-based
        const all = root.querySelectorAll(tag);
        return all[index] || null;
      }
      if (firstMatch) {
        const tag = firstMatch[1];
        return root.querySelector(tag);
      }
      return null;
    }

    // Process sections in reverse order to avoid offset issues when inserting elements
    const reversedSections = [...sections].reverse();

    for (const section of reversedSections) {
      // Find the first element matching this section's selector
      const sectionEl = resolveSelector(element, section.selector);
      if (!sectionEl) continue;

      // Find the insertion point: the closest .ui-widget ancestor wrapping this block,
      // or walk up to a sibling-level container. The DOM structure is:
      // main > ... > div > div.ui-widget > c-xeg-component > section
      // We want to insert <hr> and Section Metadata at the .ui-widget level or
      // at the component level (direct child of .ui-widget parent).
      let insertionPoint = sectionEl.closest('.ui-widget') || sectionEl;

      // Add Section Metadata block if this section has a style
      if (section.style) {
        const metadataBlock = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        insertionPoint.after(metadataBlock);
      }

      // Add <hr> section break before non-first sections
      if (section !== sections[0]) {
        const hr = document.createElement('hr');
        insertionPoint.before(hr);
      }
    }
  }
}
