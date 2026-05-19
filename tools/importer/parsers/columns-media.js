/* eslint-disable */
/* global WebImporter */

/**
 * Parser: columns-media
 * Base block: columns
 * Source: https://co.my.xcelenergy.com/s/
 * Generated: 2026-05-19
 *
 * Two-column layout with image on one side and text content (heading, paragraph, CTA) on the other.
 * The data-column-reorder attribute determines visual order of columns.
 * Columns blocks do NOT require field hint comments per xwalk hinting rules.
 */
export default function parse(element, { document }) {
  // The element is the c-xeg-two-column-v2 custom element.
  // Content may be in shadow DOM - try to access via shadowRoot first, fall back to light DOM.
  const root = element.shadowRoot || element;

  // Extract heading (h2 primary, fallback to h1, h3)
  const heading = root.querySelector('h2, h1, h3');

  // Extract paragraph text
  const description = root.querySelector('p');

  // Extract CTA button/link - may be inside c-xeg-button custom element or its shadow root
  let ctaLink = root.querySelector('a.xeg-button, a[data-button-variant], a[href]');
  if (!ctaLink) {
    // Try inside c-xeg-button shadow root
    const buttonHost = root.querySelector('c-xeg-button');
    if (buttonHost) {
      const buttonRoot = buttonHost.shadowRoot || buttonHost;
      ctaLink = buttonRoot.querySelector('a[href]');
    }
  }

  // If we found a CTA link, create a clean anchor to ensure it renders in output
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

  // Extract image
  const image = root.querySelector('img');

  // Determine column order based on data-content-align attribute
  // If content-align is "right", image is on the left (first column)
  const columnsContainer = root.querySelector('[data-content-align], .xeg-columns');
  const contentAlign = columnsContainer
    ? columnsContainer.getAttribute('data-content-align')
    : null;
  const imageFirst = contentAlign === 'right';

  // Build content cell: heading + description + CTA
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (description) contentCell.push(description);
  if (ctaElement) contentCell.push(ctaElement);

  // Build image cell
  const imageCell = [];
  if (image) imageCell.push(image);

  // Build cells array: single row with two columns
  // Column order follows visual layout (image first when content-align is "right")
  const cells = [];
  if (imageFirst) {
    cells.push([imageCell, contentCell]);
  } else {
    cells.push([contentCell, imageCell]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-media', cells });
  element.replaceWith(block);
}
