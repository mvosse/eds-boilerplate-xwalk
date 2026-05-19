/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-banner
 * Base block: hero
 * Source: https://co.my.xcelenergy.com/s/
 * Generated: 2026-05-19
 *
 * UE Model fields:
 *   - image (reference): Background image
 *   - imageAlt (text): Collapsed into image alt attribute
 *   - text (richtext): Heading + paragraph + optional CTA
 *
 * Source structure:
 *   c-xeg-hero-v2 > section.xegc-hero[style=background-image] > .xeg-content-container > h1, p, [c-xeg-button a]
 *
 * Note: Salesforce LWC components may use Shadow DOM. This parser handles both
 * light DOM and shadow DOM access patterns.
 */
export default function parse(element, { document }) {
  // Helper: query inside the element, trying shadowRoot first if available
  function query(selector) {
    let result = element.querySelector(selector);
    if (!result && element.shadowRoot) {
      result = element.shadowRoot.querySelector(selector);
    }
    // Also try nested shadow roots (e.g., section inside shadow)
    if (!result) {
      const allChildren = element.shadowRoot
        ? element.shadowRoot.querySelectorAll('*')
        : element.querySelectorAll('*');
      for (let i = 0; i < allChildren.length; i++) {
        if (allChildren[i].shadowRoot) {
          result = allChildren[i].shadowRoot.querySelector(selector);
          if (result) break;
        }
      }
    }
    return result;
  }

  function queryAll(selector) {
    let results = Array.from(element.querySelectorAll(selector));
    if (results.length === 0 && element.shadowRoot) {
      results = Array.from(element.shadowRoot.querySelectorAll(selector));
    }
    return results;
  }

  // Get the root to search within (shadowRoot or element itself)
  const root = element.shadowRoot || element;

  // === Row 1: Image (from background-image style) ===
  let imageUrl = '';

  // Check element itself for background-image
  const elStyle = element.getAttribute('style') || '';
  const elMatch = elStyle.match(/background-image:\s*url\(["']?([^"')]+)["']?\)/);
  if (elMatch) {
    imageUrl = elMatch[1];
  }

  // Check all elements with style attribute containing "background"
  if (!imageUrl) {
    const styledEls = root.querySelectorAll('[style*="background"]');
    for (let i = 0; i < styledEls.length; i++) {
      const s = styledEls[i].getAttribute('style') || '';
      const m = s.match(/background-image:\s*url\(["']?([^"')]+)["']?\)/);
      if (m) {
        imageUrl = m[1];
        break;
      }
    }
  }

  // Try computed styles on root and immediate children
  if (!imageUrl) {
    const targets = [element, ...Array.from(root.children || [])];
    for (const target of targets) {
      try {
        const computed = window.getComputedStyle(target);
        const bgImg = computed.backgroundImage;
        if (bgImg && bgImg !== 'none') {
          const m = bgImg.match(/url\(["']?([^"')]+)["']?\)/);
          if (m) {
            imageUrl = m[1];
            break;
          }
        }
      } catch (e) {
        // skip if getComputedStyle fails
      }
    }
  }

  // Try all descendant elements' computed styles
  if (!imageUrl) {
    const allEls = root.querySelectorAll('*');
    for (let i = 0; i < allEls.length; i++) {
      try {
        const computed = window.getComputedStyle(allEls[i]);
        const bgImg = computed.backgroundImage;
        if (bgImg && bgImg !== 'none') {
          const m = bgImg.match(/url\(["']?([^"')]+)["']?\)/);
          if (m) {
            imageUrl = m[1];
            break;
          }
        }
      } catch (e) {
        // skip
      }
    }
  }

  // Fallback: img element
  if (!imageUrl) {
    const img = root.querySelector('img');
    if (img) {
      imageUrl = img.src || img.getAttribute('src') || '';
    }
  }

  // Build image cell with field hint
  const imageFragment = document.createDocumentFragment();
  imageFragment.appendChild(document.createComment(' field:image '));
  if (imageUrl) {
    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = '';
    const picture = document.createElement('picture');
    picture.appendChild(img);
    imageFragment.appendChild(picture);
  }

  // === Row 2: Text (heading + paragraph + optional CTA) ===
  const heading = root.querySelector('h1, h2, h3');
  const paragraph = root.querySelector('p');
  const ctaLinks = Array.from(
    root.querySelectorAll('c-xeg-button a, a.xeg-button, a.button, a[class*="cta"], a[class*="btn"]')
  );

  const textFragment = document.createDocumentFragment();
  textFragment.appendChild(document.createComment(' field:text '));

  if (heading) {
    const h = document.createElement(heading.tagName.toLowerCase());
    h.innerHTML = heading.innerHTML;
    textFragment.appendChild(h);
  }

  if (paragraph) {
    const p = document.createElement('p');
    p.innerHTML = paragraph.innerHTML;
    textFragment.appendChild(p);
  }

  ctaLinks.forEach((link) => {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.href = link.href || link.getAttribute('href') || '';
    a.textContent = link.textContent.trim();
    p.appendChild(a);
    textFragment.appendChild(p);
  });

  // If no structured content found, try extracting any text content
  if (!heading && !paragraph && ctaLinks.length === 0) {
    const textContent = (element.textContent || '').trim();
    if (textContent) {
      const p = document.createElement('p');
      p.textContent = textContent;
      textFragment.appendChild(p);
    }
  }

  // === Build cells array matching block library structure ===
  // Simple block: each model field = one row (excluding collapsed fields)
  // Row 1: image (with collapsed imageAlt in alt attribute)
  // Row 2: text (richtext with heading, paragraph, optional CTA)
  const cells = [
    [imageFragment],
    [textFragment],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-banner', cells });
  element.replaceWith(block);
}
