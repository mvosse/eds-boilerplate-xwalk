/* eslint-disable */
/* global WebImporter */

/**
 * Parser: columns-cta
 * Base block: columns
 * Source: https://co.my.xcelenergy.com/s/
 * Generated: 2026-05-19
 *
 * Compact CTA banner with two columns: left has heading (h2) and subheading paragraph,
 * right has a CTA button link. Used for contact/support call-to-action sections.
 * Columns blocks do NOT require field hint comments per xwalk hinting rules.
 */
export default function parse(element, { document }) {
  // The element is the c-xeg-contact-support custom element.
  const root = element.shadowRoot || element;

  // Extract heading from data-column="1" (h2 with class headline-h-3)
  const heading = root.querySelector('[data-column="1"] h2, [data-column="1"] h1, [data-column="1"] h3, h2, h1, h3');

  // Extract paragraph/subheading from data-column="1"
  const paragraph = root.querySelector('[data-column="1"] p, p.subheading-aa-07, p');

  // Extract CTA link from data-column="2" - inside c-xeg-button custom element
  let ctaLink = root.querySelector('[data-column="2"] a.xeg-button, [data-column="2"] a[data-button-variant], [data-column="2"] a[href]');
  if (!ctaLink) {
    // Fallback: try inside c-xeg-button shadow root or light DOM
    const buttonHost = root.querySelector('[data-column="2"] c-xeg-button, c-xeg-button');
    if (buttonHost) {
      const buttonRoot = buttonHost.shadowRoot || buttonHost;
      ctaLink = buttonRoot.querySelector('a[href]');
    }
  }
  if (!ctaLink) {
    // Final fallback: any anchor in the element
    ctaLink = root.querySelector('a[href]');
  }

  // Create a clean anchor element to ensure proper rendering
  let ctaElement = null;
  if (ctaLink) {
    const href = ctaLink.getAttribute('href');
    const text = ctaLink.textContent.trim();
    if (href && text) {
      ctaElement = document.createElement('a');
      ctaElement.setAttribute('href', href);
      ctaElement.textContent = text;
    }
  }

  // Build left column cell: heading + paragraph
  const leftCell = [];
  if (heading) leftCell.push(heading);
  if (paragraph) leftCell.push(paragraph);

  // Build right column cell: CTA button
  const rightCell = [];
  if (ctaElement) rightCell.push(ctaElement);

  // Build cells array: single row with two columns
  const cells = [
    [leftCell, rightCell],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-cta', cells });
  element.replaceWith(block);
}
