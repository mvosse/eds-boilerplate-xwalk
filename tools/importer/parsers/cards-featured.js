/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-featured
 * Base block: cards
 * Source: https://co.my.xcelenergy.com/s/
 * Generated: 2026-05-19
 *
 * Parses featured content items from c-xeg-featured-content-v2 with
 * data-item-display-style='standard'. The source uses nested Shadow DOM:
 * - c-xeg-featured-content-v2 -> shadowRoot -> .xeg-columns -> c-xeg-featured-content-item
 * - c-xeg-featured-content-item -> shadowRoot -> img, h3, lightning-formatted-rich-text, c-xeg-button
 * - lightning-formatted-rich-text -> shadowRoot -> span > p
 * - c-xeg-button -> shadowRoot -> a
 *
 * The heading (h2) and intro paragraph are DEFAULT CONTENT handled by the
 * transformer, not this parser. This parser only handles the grid items.
 *
 * UE Model: container block "cards-featured" with child "card" items.
 * Card model fields: image (reference), text (richtext).
 * Each card item = one row with two columns: [image] [text].
 */
export default function parse(element, { document }) {
  // element is c-xeg-featured-content-v2 (custom element with shadow DOM)
  // Navigate into the shadow root to find .xeg-columns with standard display style
  const shadowRoot = element.shadowRoot;
  if (!shadowRoot) return element.replaceWith(document.createDocumentFragment());

  const columns = shadowRoot.querySelector('.xeg-columns[data-item-display-style="standard"]');
  if (!columns) return element.replaceWith(document.createDocumentFragment());

  // Find all card items within the standard columns grid
  const items = columns.querySelectorAll('c-xeg-featured-content-item');
  if (!items.length) return element.replaceWith(document.createDocumentFragment());

  const cells = [];

  items.forEach((item) => {
    const itemShadow = item.shadowRoot;
    if (!itemShadow) return;

    // Extract image from item shadow root
    const img = itemShadow.querySelector('img');

    // Extract heading (h3) from item shadow root
    const heading = itemShadow.querySelector('h3, [class*="xeg-h4"]');

    // Extract description from lightning-formatted-rich-text shadow root
    let descriptionText = '';
    const richTextEl = itemShadow.querySelector('lightning-formatted-rich-text');
    if (richTextEl && richTextEl.shadowRoot) {
      const p = richTextEl.shadowRoot.querySelector('p');
      if (p) descriptionText = p.textContent.trim();
    }

    // Extract CTA link from c-xeg-button shadow root
    let ctaHref = '';
    let ctaText = '';
    let ctaAriaLabel = '';
    const buttonEl = itemShadow.querySelector('c-xeg-button');
    if (buttonEl && buttonEl.shadowRoot) {
      const a = buttonEl.shadowRoot.querySelector('a');
      if (a) {
        ctaHref = a.getAttribute('href') || '';
        ctaText = a.textContent.trim();
        ctaAriaLabel = a.getAttribute('aria-label') || '';
      }
    }

    // Build image cell: field hint comment + image element
    const imageHint = document.createComment(' field:image ');
    const imageElements = [imageHint];
    if (img) {
      const imgEl = document.createElement('img');
      imgEl.src = img.getAttribute('src') || '';
      imgEl.alt = img.getAttribute('alt') || '';
      imageElements.push(imgEl);
    }

    // Build text cell: field hint comment + heading + description + CTA
    const textHint = document.createComment(' field:text ');
    const textElements = [textHint];

    if (heading) {
      const h3 = document.createElement('h3');
      h3.textContent = heading.textContent.trim();
      textElements.push(h3);
    }

    if (descriptionText) {
      const p = document.createElement('p');
      p.textContent = descriptionText;
      textElements.push(p);
    }

    if (ctaHref && ctaText) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = ctaHref;
      a.textContent = ctaText;
      if (ctaAriaLabel) {
        a.title = ctaAriaLabel;
      }
      p.appendChild(a);
      textElements.push(p);
    }

    // Each card = one row with [image, text] columns
    cells.push([imageElements, textElements]);
  });

  if (cells.length === 0) {
    element.replaceWith(document.createDocumentFragment());
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-featured', cells });
  element.replaceWith(block);
}
