/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-action
 * Base block: cards
 * Source: https://co.my.xcelenergy.com/s/
 * Generated: 2026-05-19
 *
 * Extracts multi-action banner with heading and action buttons from a Salesforce LWC component.
 * The c-xeg-multi-action-banner component renders content in its shadow DOM.
 *
 * Source structure: c-xeg-multi-action-banner (shadow) > section.xeg-multi-action
 *   > div.xeg-content-container > h2 + ul > li > c-xeg-multi-action-button (shadow) > a.xeg-button
 *
 * Target: Container block, each card row = [image, text]. No images in source, text = action link.
 *
 * UE Model fields per card item:
 *   - image (reference) - empty (no source images)
 *   - text (richtext) - action button link
 */
export default function parse(element, { document }) {
  /**
   * Get the queryable root - handles shadow DOM on the element itself
   */
  function getRoot(el) {
    if (el.shadowRoot) return el.shadowRoot;
    return el;
  }

  /**
   * Deep query that traverses all shadow boundaries
   */
  function deepQueryAll(root, selector) {
    const results = [];

    try {
      const found = root.querySelectorAll(selector);
      results.push(...Array.from(found));
    } catch (e) { /* ignore */ }

    let allEls;
    try {
      allEls = root.querySelectorAll('*');
    } catch (e) {
      return results;
    }

    for (const el of Array.from(allEls)) {
      if (el.shadowRoot) {
        const subResults = deepQueryAll(el.shadowRoot, selector);
        results.push(...subResults);
      }
    }

    return results;
  }

  // Get the root - check if element has shadow DOM
  const root = getRoot(element);

  // Find action links using deep traversal across all shadow boundaries
  let actionLinks = deepQueryAll(root, 'a.xeg-button');

  if (!actionLinks.length) {
    actionLinks = deepQueryAll(root, 'a[href]');
  }

  // Build cells - each action becomes a card row with [image, text]
  const cells = [];

  if (actionLinks.length > 0) {
    actionLinks.forEach((link) => {
      // Column 1: image (empty for this block - no source images)
      // Per hinting rules: empty cells do NOT require HTML comments

      // Column 2: text with field hint
      const textWrapper = document.createElement('div');
      textWrapper.appendChild(document.createComment(' field:text '));
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = link.getAttribute('href') || link.href || '#';
      a.textContent = (link.textContent || link.innerText || '').trim();
      p.appendChild(a);
      textWrapper.appendChild(p);

      cells.push(['', textWrapper]);
    });
  } else {
    // Fallback: use innerText which may aggregate shadow DOM text content
    const fullText = (element.innerText || element.textContent || '').trim();
    const heading = element.querySelector('h2, h1, h3');
    const headingText = heading ? (heading.textContent || '').trim() : '';

    if (fullText && fullText !== headingText) {
      const lines = fullText.split('\n')
        .map(l => l.trim())
        .filter(l => l.length > 0 && l !== headingText);

      lines.forEach((line) => {
        const textWrapper = document.createElement('div');
        textWrapper.appendChild(document.createComment(' field:text '));
        const p = document.createElement('p');
        p.textContent = line;
        textWrapper.appendChild(p);
        cells.push(['', textWrapper]);
      });
    }

    // Final safety
    if (cells.length === 0) {
      const textWrapper = document.createElement('div');
      textWrapper.appendChild(document.createComment(' field:text '));
      const p = document.createElement('p');
      p.textContent = headingText || 'Action';
      textWrapper.appendChild(p);
      cells.push(['', textWrapper]);
    }
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-action', cells });
  element.replaceWith(block);
}
