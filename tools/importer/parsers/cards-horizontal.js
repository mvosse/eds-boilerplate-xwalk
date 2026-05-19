/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-horizontal
 * Base block: cards
 * Source: https://co.my.xcelenergy.com/s/
 * Generated: 2026-05-19
 *
 * Parses horizontal featured content items from c-xeg-featured-content-v2.
 * Content is behind Shadow DOM (Lightning Web Components):
 *   c-xeg-featured-content-v2 (shadow) -> .xeg-columns[data-item-display-style='horizontal']
 *     -> c-xeg-featured-content-item (shadow) -> img, h3, lightning-formatted-rich-text (shadow -> p),
 *        c-xeg-button (shadow -> a)
 *
 * Self-filters: only processes elements whose shadow root contains
 * .xeg-columns[data-item-display-style="horizontal"]. Skips standard/other display styles.
 *
 * UE Model (cards-horizontal): container block with child "card" items
 *   - image (reference): card icon/image
 *   - text (richtext): heading + description + CTA link
 *
 * NOTE: Section heading (h2) and intro paragraph are default content
 * handled by the transformer, not this parser.
 */
export default function parse(element, { document }) {
  // Helper to get shadow root or fall back to element itself
  function getShadowOrSelf(el) {
    return (el && el.shadowRoot) ? el.shadowRoot : el;
  }

  // Pierce into c-xeg-featured-content-v2 shadow root
  const root = getShadowOrSelf(element);
  if (!root) return;

  // Self-filter: only process elements with horizontal display style
  const columnsContainer = root.querySelector('.xeg-columns[data-item-display-style="horizontal"]');
  if (!columnsContainer) return;

  // Find featured content items within the horizontal columns
  let items = Array.from(columnsContainer.querySelectorAll('c-xeg-featured-content-item'));
  if (items.length === 0) {
    // Fallback: try data-column attribute or direct children
    items = Array.from(columnsContainer.querySelectorAll('[data-column]'));
  }
  if (items.length === 0) {
    items = Array.from(columnsContainer.children);
  }
  if (items.length === 0) return;

  const cells = [];

  items.forEach((item) => {
    // Pierce item shadow root
    const itemRoot = getShadowOrSelf(item);

    // Extract image (icon)
    const img = itemRoot.querySelector('img');

    // Extract heading (h3)
    const heading = itemRoot.querySelector('h3, h4, [class*="xeg-h4"]');

    // Extract description paragraph - inside lightning-formatted-rich-text shadow root
    let descriptionText = '';
    const richTextEl = itemRoot.querySelector('lightning-formatted-rich-text');
    if (richTextEl) {
      const richTextRoot = getShadowOrSelf(richTextEl);
      const pEl = richTextRoot.querySelector('p');
      if (pEl) {
        descriptionText = pEl.textContent.trim();
      }
    }
    // Fallback: try direct p in item root
    if (!descriptionText) {
      const directP = itemRoot.querySelector('p');
      if (directP) descriptionText = directP.textContent.trim();
    }

    // Extract CTA link - inside c-xeg-button shadow root
    let ctaHref = '';
    let ctaText = '';
    const buttonEl = itemRoot.querySelector('c-xeg-button');
    if (buttonEl) {
      const buttonRoot = getShadowOrSelf(buttonEl);
      const anchor = buttonRoot.querySelector('a');
      if (anchor) {
        ctaHref = anchor.getAttribute('href') || '';
        ctaText = anchor.textContent.trim();
      }
    }
    // Fallback: try direct anchor in item root
    if (!ctaHref) {
      const directA = itemRoot.querySelector('a');
      if (directA) {
        ctaHref = directA.getAttribute('href') || '';
        ctaText = directA.textContent.trim();
      }
    }

    // Build image cell with field hint
    const imageCell = document.createDocumentFragment();
    imageCell.appendChild(document.createComment(' field:image '));
    if (img) {
      const newImg = document.createElement('img');
      newImg.src = img.getAttribute('src') || img.src;
      newImg.alt = img.getAttribute('alt') || '';
      imageCell.appendChild(newImg);
    }

    // Build text cell with field hint (richtext: heading + description + CTA)
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(' field:text '));
    if (heading) {
      const h3 = document.createElement('h3');
      h3.textContent = heading.textContent.trim();
      textCell.appendChild(h3);
    }
    if (descriptionText) {
      const p = document.createElement('p');
      p.textContent = descriptionText;
      textCell.appendChild(p);
    }
    if (ctaHref && ctaText) {
      const ctaParagraph = document.createElement('p');
      const a = document.createElement('a');
      a.href = ctaHref;
      a.textContent = ctaText;
      ctaParagraph.appendChild(a);
      textCell.appendChild(ctaParagraph);
    }

    // Each card item = one row with two columns [image, text]
    cells.push([imageCell, textCell]);
  });

  if (cells.length === 0) return;

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-horizontal', cells });
  element.replaceWith(block);
}
