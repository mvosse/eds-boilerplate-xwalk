/* eslint-disable */
/* global WebImporter */

/**
 * Parser: columns-video
 * Base block: columns
 * Source: https://co.my.xcelenergy.com/s/
 * Generated: 2026-05-19
 *
 * Two-column layout with text content (h2 heading, paragraph, CTA button) on the left
 * and an embedded YouTube video iframe on the right.
 * Source DOM: c-dc-video-component-v2 > section.xeg-two-column > .xeg-columns container
 *   - .content div (data-column-reorder="first"): h2 + p + c-xeg-button > a
 *   - .video-wrapper div (data-column-reorder="last"): iframe (YouTube embed)
 *
 * Output: 1 row, 2 columns: [heading, paragraph, CTA link] | [video URL as link]
 * Columns blocks do NOT require field hint comments per xwalk hinting rules.
 */
export default function parse(element, { document }) {
  // The element is the c-dc-video-component-v2 custom element.
  const root = element.shadowRoot || element;

  // Extract heading (h2 primary, fallback to h1, h3)
  const heading = root.querySelector('h2, h1, h3');

  // Extract paragraph description
  const description = root.querySelector('.content p, p[data-html="paragraphText"], p');

  // Extract CTA button/link from c-xeg-button or direct anchor
  let ctaLink = root.querySelector('a.xeg-button, a[data-button-variant], c-xeg-button a[href]');
  if (!ctaLink) {
    // Try inside c-xeg-button shadow root
    const buttonHost = root.querySelector('c-xeg-button');
    if (buttonHost) {
      const buttonRoot = buttonHost.shadowRoot || buttonHost;
      ctaLink = buttonRoot.querySelector('a[href]');
    }
  }

  // Create a clean CTA anchor element for output
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

  // Extract video URL from iframe src attribute
  const iframe = root.querySelector('iframe[src], .video-wrapper iframe, .aspect-ratio iframe');
  let videoElement = null;
  if (iframe) {
    let videoSrc = iframe.getAttribute('src') || '';
    // Convert embed URL to standard YouTube watch URL for cleaner output
    const embedMatch = videoSrc.match(/youtube\.com\/embed\/([^?&#]+)/);
    if (embedMatch) {
      videoSrc = `https://www.youtube.com/watch?v=${embedMatch[1]}`;
    }
    if (videoSrc) {
      videoElement = document.createElement('a');
      videoElement.setAttribute('href', videoSrc);
      videoElement.textContent = videoSrc;
    }
  }

  // Build content cell (left column): heading + description + CTA
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (description) contentCell.push(description);
  if (ctaElement) contentCell.push(ctaElement);

  // Build video cell (right column): video link
  const videoCell = [];
  if (videoElement) videoCell.push(videoElement);

  // Build cells array: single row with two columns [text | video]
  const cells = [];
  cells.push([contentCell, videoCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-video', cells });
  element.replaceWith(block);
}
