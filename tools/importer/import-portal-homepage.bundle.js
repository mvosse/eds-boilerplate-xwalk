/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-portal-homepage.js
  var import_portal_homepage_exports = {};
  __export(import_portal_homepage_exports, {
    default: () => import_portal_homepage_default
  });

  // tools/importer/parsers/hero-banner.js
  function parse(element, { document }) {
    function query(selector) {
      let result = element.querySelector(selector);
      if (!result && element.shadowRoot) {
        result = element.shadowRoot.querySelector(selector);
      }
      if (!result) {
        const allChildren = element.shadowRoot ? element.shadowRoot.querySelectorAll("*") : element.querySelectorAll("*");
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
    const root = element.shadowRoot || element;
    let imageUrl = "";
    const elStyle = element.getAttribute("style") || "";
    const elMatch = elStyle.match(/background-image:\s*url\(["']?([^"')]+)["']?\)/);
    if (elMatch) {
      imageUrl = elMatch[1];
    }
    if (!imageUrl) {
      const styledEls = root.querySelectorAll('[style*="background"]');
      for (let i = 0; i < styledEls.length; i++) {
        const s = styledEls[i].getAttribute("style") || "";
        const m = s.match(/background-image:\s*url\(["']?([^"')]+)["']?\)/);
        if (m) {
          imageUrl = m[1];
          break;
        }
      }
    }
    if (!imageUrl) {
      const targets = [element, ...Array.from(root.children || [])];
      for (const target of targets) {
        try {
          const computed = window.getComputedStyle(target);
          const bgImg = computed.backgroundImage;
          if (bgImg && bgImg !== "none") {
            const m = bgImg.match(/url\(["']?([^"')]+)["']?\)/);
            if (m) {
              imageUrl = m[1];
              break;
            }
          }
        } catch (e) {
        }
      }
    }
    if (!imageUrl) {
      const allEls = root.querySelectorAll("*");
      for (let i = 0; i < allEls.length; i++) {
        try {
          const computed = window.getComputedStyle(allEls[i]);
          const bgImg = computed.backgroundImage;
          if (bgImg && bgImg !== "none") {
            const m = bgImg.match(/url\(["']?([^"')]+)["']?\)/);
            if (m) {
              imageUrl = m[1];
              break;
            }
          }
        } catch (e) {
        }
      }
    }
    if (!imageUrl) {
      const img = root.querySelector("img");
      if (img) {
        imageUrl = img.src || img.getAttribute("src") || "";
      }
    }
    const imageFragment = document.createDocumentFragment();
    imageFragment.appendChild(document.createComment(" field:image "));
    if (imageUrl) {
      const img = document.createElement("img");
      img.src = imageUrl;
      img.alt = "";
      const picture = document.createElement("picture");
      picture.appendChild(img);
      imageFragment.appendChild(picture);
    }
    const heading = root.querySelector("h1, h2, h3");
    const paragraph = root.querySelector("p");
    const ctaLinks = Array.from(
      root.querySelectorAll('c-xeg-button a, a.xeg-button, a.button, a[class*="cta"], a[class*="btn"]')
    );
    const textFragment = document.createDocumentFragment();
    textFragment.appendChild(document.createComment(" field:text "));
    if (heading) {
      const h = document.createElement(heading.tagName.toLowerCase());
      h.innerHTML = heading.innerHTML;
      textFragment.appendChild(h);
    }
    if (paragraph) {
      const p = document.createElement("p");
      p.innerHTML = paragraph.innerHTML;
      textFragment.appendChild(p);
    }
    ctaLinks.forEach((link) => {
      const p = document.createElement("p");
      const a = document.createElement("a");
      a.href = link.href || link.getAttribute("href") || "";
      a.textContent = link.textContent.trim();
      p.appendChild(a);
      textFragment.appendChild(p);
    });
    if (!heading && !paragraph && ctaLinks.length === 0) {
      const textContent = (element.textContent || "").trim();
      if (textContent) {
        const p = document.createElement("p");
        p.textContent = textContent;
        textFragment.appendChild(p);
      }
    }
    const cells = [
      [imageFragment],
      [textFragment]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-action.js
  function parse2(element, { document }) {
    function getRoot(el) {
      if (el.shadowRoot) return el.shadowRoot;
      return el;
    }
    function deepQueryAll(root2, selector) {
      const results = [];
      try {
        const found = root2.querySelectorAll(selector);
        results.push(...Array.from(found));
      } catch (e) {
      }
      let allEls;
      try {
        allEls = root2.querySelectorAll("*");
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
    const root = getRoot(element);
    let actionLinks = deepQueryAll(root, "a.xeg-button");
    if (!actionLinks.length) {
      actionLinks = deepQueryAll(root, "a[href]");
    }
    const cells = [];
    if (actionLinks.length > 0) {
      actionLinks.forEach((link) => {
        const textWrapper = document.createElement("div");
        textWrapper.appendChild(document.createComment(" field:text "));
        const p = document.createElement("p");
        const a = document.createElement("a");
        a.href = link.getAttribute("href") || link.href || "#";
        a.textContent = (link.textContent || link.innerText || "").trim();
        p.appendChild(a);
        textWrapper.appendChild(p);
        cells.push(["", textWrapper]);
      });
    } else {
      const fullText = (element.innerText || element.textContent || "").trim();
      const heading = element.querySelector("h2, h1, h3");
      const headingText = heading ? (heading.textContent || "").trim() : "";
      if (fullText && fullText !== headingText) {
        const lines = fullText.split("\n").map((l) => l.trim()).filter((l) => l.length > 0 && l !== headingText);
        lines.forEach((line) => {
          const textWrapper = document.createElement("div");
          textWrapper.appendChild(document.createComment(" field:text "));
          const p = document.createElement("p");
          p.textContent = line;
          textWrapper.appendChild(p);
          cells.push(["", textWrapper]);
        });
      }
      if (cells.length === 0) {
        const textWrapper = document.createElement("div");
        textWrapper.appendChild(document.createComment(" field:text "));
        const p = document.createElement("p");
        p.textContent = headingText || "Action";
        textWrapper.appendChild(p);
        cells.push(["", textWrapper]);
      }
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-action", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-media.js
  function parse3(element, { document }) {
    const root = element.shadowRoot || element;
    const heading = root.querySelector("h2, h1, h3");
    const description = root.querySelector("p");
    let ctaLink = root.querySelector("a.xeg-button, a[data-button-variant], a[href]");
    if (!ctaLink) {
      const buttonHost = root.querySelector("c-xeg-button");
      if (buttonHost) {
        const buttonRoot = buttonHost.shadowRoot || buttonHost;
        ctaLink = buttonRoot.querySelector("a[href]");
      }
    }
    let ctaElement = null;
    if (ctaLink) {
      const href = ctaLink.getAttribute("href");
      const text = ctaLink.textContent.trim();
      if (href && text) {
        ctaElement = document.createElement("a");
        ctaElement.setAttribute("href", href);
        ctaElement.textContent = text;
      }
    }
    const image = root.querySelector("img");
    const columnsContainer = root.querySelector("[data-content-align], .xeg-columns");
    const contentAlign = columnsContainer ? columnsContainer.getAttribute("data-content-align") : null;
    const imageFirst = contentAlign === "right";
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (description) contentCell.push(description);
    if (ctaElement) contentCell.push(ctaElement);
    const imageCell = [];
    if (image) imageCell.push(image);
    const cells = [];
    if (imageFirst) {
      cells.push([imageCell, contentCell]);
    } else {
      cells.push([contentCell, imageCell]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-media", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-featured.js
  function parse4(element, { document }) {
    const shadowRoot = element.shadowRoot;
    if (!shadowRoot) return element.replaceWith(document.createDocumentFragment());
    const columns = shadowRoot.querySelector('.xeg-columns[data-item-display-style="standard"]');
    if (!columns) return element.replaceWith(document.createDocumentFragment());
    const items = columns.querySelectorAll("c-xeg-featured-content-item");
    if (!items.length) return element.replaceWith(document.createDocumentFragment());
    const cells = [];
    items.forEach((item) => {
      const itemShadow = item.shadowRoot;
      if (!itemShadow) return;
      const img = itemShadow.querySelector("img");
      const heading = itemShadow.querySelector('h3, [class*="xeg-h4"]');
      let descriptionText = "";
      const richTextEl = itemShadow.querySelector("lightning-formatted-rich-text");
      if (richTextEl && richTextEl.shadowRoot) {
        const p = richTextEl.shadowRoot.querySelector("p");
        if (p) descriptionText = p.textContent.trim();
      }
      let ctaHref = "";
      let ctaText = "";
      let ctaAriaLabel = "";
      const buttonEl = itemShadow.querySelector("c-xeg-button");
      if (buttonEl && buttonEl.shadowRoot) {
        const a = buttonEl.shadowRoot.querySelector("a");
        if (a) {
          ctaHref = a.getAttribute("href") || "";
          ctaText = a.textContent.trim();
          ctaAriaLabel = a.getAttribute("aria-label") || "";
        }
      }
      const imageHint = document.createComment(" field:image ");
      const imageElements = [imageHint];
      if (img) {
        const imgEl = document.createElement("img");
        imgEl.src = img.getAttribute("src") || "";
        imgEl.alt = img.getAttribute("alt") || "";
        imageElements.push(imgEl);
      }
      const textHint = document.createComment(" field:text ");
      const textElements = [textHint];
      if (heading) {
        const h3 = document.createElement("h3");
        h3.textContent = heading.textContent.trim();
        textElements.push(h3);
      }
      if (descriptionText) {
        const p = document.createElement("p");
        p.textContent = descriptionText;
        textElements.push(p);
      }
      if (ctaHref && ctaText) {
        const p = document.createElement("p");
        const a = document.createElement("a");
        a.href = ctaHref;
        a.textContent = ctaText;
        if (ctaAriaLabel) {
          a.title = ctaAriaLabel;
        }
        p.appendChild(a);
        textElements.push(p);
      }
      cells.push([imageElements, textElements]);
    });
    if (cells.length === 0) {
      element.replaceWith(document.createDocumentFragment());
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-featured", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-horizontal.js
  function parse5(element, { document }) {
    function getShadowOrSelf(el) {
      return el && el.shadowRoot ? el.shadowRoot : el;
    }
    const root = getShadowOrSelf(element);
    if (!root) return;
    const columnsContainer = root.querySelector('.xeg-columns[data-item-display-style="horizontal"]');
    if (!columnsContainer) return;
    let items = Array.from(columnsContainer.querySelectorAll("c-xeg-featured-content-item"));
    if (items.length === 0) {
      items = Array.from(columnsContainer.querySelectorAll("[data-column]"));
    }
    if (items.length === 0) {
      items = Array.from(columnsContainer.children);
    }
    if (items.length === 0) return;
    const cells = [];
    items.forEach((item) => {
      const itemRoot = getShadowOrSelf(item);
      const img = itemRoot.querySelector("img");
      const heading = itemRoot.querySelector('h3, h4, [class*="xeg-h4"]');
      let descriptionText = "";
      const richTextEl = itemRoot.querySelector("lightning-formatted-rich-text");
      if (richTextEl) {
        const richTextRoot = getShadowOrSelf(richTextEl);
        const pEl = richTextRoot.querySelector("p");
        if (pEl) {
          descriptionText = pEl.textContent.trim();
        }
      }
      if (!descriptionText) {
        const directP = itemRoot.querySelector("p");
        if (directP) descriptionText = directP.textContent.trim();
      }
      let ctaHref = "";
      let ctaText = "";
      const buttonEl = itemRoot.querySelector("c-xeg-button");
      if (buttonEl) {
        const buttonRoot = getShadowOrSelf(buttonEl);
        const anchor = buttonRoot.querySelector("a");
        if (anchor) {
          ctaHref = anchor.getAttribute("href") || "";
          ctaText = anchor.textContent.trim();
        }
      }
      if (!ctaHref) {
        const directA = itemRoot.querySelector("a");
        if (directA) {
          ctaHref = directA.getAttribute("href") || "";
          ctaText = directA.textContent.trim();
        }
      }
      const imageCell = document.createDocumentFragment();
      imageCell.appendChild(document.createComment(" field:image "));
      if (img) {
        const newImg = document.createElement("img");
        newImg.src = img.getAttribute("src") || img.src;
        newImg.alt = img.getAttribute("alt") || "";
        imageCell.appendChild(newImg);
      }
      const textCell = document.createDocumentFragment();
      textCell.appendChild(document.createComment(" field:text "));
      if (heading) {
        const h3 = document.createElement("h3");
        h3.textContent = heading.textContent.trim();
        textCell.appendChild(h3);
      }
      if (descriptionText) {
        const p = document.createElement("p");
        p.textContent = descriptionText;
        textCell.appendChild(p);
      }
      if (ctaHref && ctaText) {
        const ctaParagraph = document.createElement("p");
        const a = document.createElement("a");
        a.href = ctaHref;
        a.textContent = ctaText;
        ctaParagraph.appendChild(a);
        textCell.appendChild(ctaParagraph);
      }
      cells.push([imageCell, textCell]);
    });
    if (cells.length === 0) return;
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-horizontal", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-video.js
  function parse6(element, { document }) {
    const root = element.shadowRoot || element;
    const heading = root.querySelector("h2, h1, h3");
    const description = root.querySelector('.content p, p[data-html="paragraphText"], p');
    let ctaLink = root.querySelector("a.xeg-button, a[data-button-variant], c-xeg-button a[href]");
    if (!ctaLink) {
      const buttonHost = root.querySelector("c-xeg-button");
      if (buttonHost) {
        const buttonRoot = buttonHost.shadowRoot || buttonHost;
        ctaLink = buttonRoot.querySelector("a[href]");
      }
    }
    let ctaElement = null;
    if (ctaLink) {
      const href = ctaLink.getAttribute("href");
      const text = ctaLink.textContent.trim();
      if (href && text) {
        ctaElement = document.createElement("a");
        ctaElement.setAttribute("href", href);
        ctaElement.textContent = text;
      }
    }
    const iframe = root.querySelector("iframe[src], .video-wrapper iframe, .aspect-ratio iframe");
    let videoElement = null;
    if (iframe) {
      let videoSrc = iframe.getAttribute("src") || "";
      const embedMatch = videoSrc.match(/youtube\.com\/embed\/([^?&#]+)/);
      if (embedMatch) {
        videoSrc = `https://www.youtube.com/watch?v=${embedMatch[1]}`;
      }
      if (videoSrc) {
        videoElement = document.createElement("a");
        videoElement.setAttribute("href", videoSrc);
        videoElement.textContent = videoSrc;
      }
    }
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (description) contentCell.push(description);
    if (ctaElement) contentCell.push(ctaElement);
    const videoCell = [];
    if (videoElement) videoCell.push(videoElement);
    const cells = [];
    cells.push([contentCell, videoCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-video", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-cta.js
  function parse7(element, { document }) {
    const root = element.shadowRoot || element;
    const heading = root.querySelector('[data-column="1"] h2, [data-column="1"] h1, [data-column="1"] h3, h2, h1, h3');
    const paragraph = root.querySelector('[data-column="1"] p, p.subheading-aa-07, p');
    let ctaLink = root.querySelector('[data-column="2"] a.xeg-button, [data-column="2"] a[data-button-variant], [data-column="2"] a[href]');
    if (!ctaLink) {
      const buttonHost = root.querySelector('[data-column="2"] c-xeg-button, c-xeg-button');
      if (buttonHost) {
        const buttonRoot = buttonHost.shadowRoot || buttonHost;
        ctaLink = buttonRoot.querySelector("a[href]");
      }
    }
    if (!ctaLink) {
      ctaLink = root.querySelector("a[href]");
    }
    let ctaElement = null;
    if (ctaLink) {
      const href = ctaLink.getAttribute("href");
      const text = ctaLink.textContent.trim();
      if (href && text) {
        ctaElement = document.createElement("a");
        ctaElement.setAttribute("href", href);
        ctaElement.textContent = text;
      }
    }
    const leftCell = [];
    if (heading) leftCell.push(heading);
    if (paragraph) leftCell.push(paragraph);
    const rightCell = [];
    if (ctaElement) rightCell.push(ctaElement);
    const cells = [
      [leftCell, rightCell]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-cta", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/xcelenergy-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === H.before) {
      WebImporter.DOMUtils.remove(element, [
        "#auraLoadingBox",
        "#auraErrorMask",
        'link[href*="decibelinsight"]'
      ]);
    }
    if (hookName === H.after) {
      WebImporter.DOMUtils.remove(element, [
        "c-xeg-site-header-desktop",
        "c-xeg-site-footer",
        "c-ma-billing-reroute",
        "c-xe-maintenance-redirect",
        "c-xeg-site-header-alert",
        "a#xegs2c",
        "c-xeg-mobile-task",
        "siteforce-record-api-refresh-handler",
        ".xeg-footer",
        ".forceCommunityToastManager",
        ".forceHoverPrototype",
        ".siteforceSpinnerManager",
        ".siteforcePanelsContainer",
        "#sf-aria-live",
        ".grecaptcha-badge",
        "#kampyleButtonContainer",
        "#embedded-messaging",
        "experience_messaging-embedded-messaging",
        "iframe",
        "link",
        "noscript"
      ]);
      const svgCacheDivs = element.querySelectorAll('div[id^="httpscomyxcelenergy"]');
      svgCacheDivs.forEach((el) => el.remove());
      element.querySelectorAll("[data-di-id]").forEach((el) => el.removeAttribute("data-di-id"));
      element.querySelectorAll("[data-di-res-id]").forEach((el) => el.removeAttribute("data-di-res-id"));
      element.querySelectorAll("[data-di-rand]").forEach((el) => el.removeAttribute("data-di-rand"));
    }
  }

  // tools/importer/transformers/xcelenergy-sections.js
  var H2 = { before: "beforeTransform", after: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === H2.after) {
      let resolveSelector = function(root, selector) {
        let el = root.querySelector(selector);
        if (el) return el;
        const nthMatch = selector.match(/^([^:]+):nth-of-type\((\d+)\)$/);
        const firstMatch = selector.match(/^([^:]+):first-of-type$/);
        if (nthMatch) {
          const tag = nthMatch[1];
          const index = parseInt(nthMatch[2], 10) - 1;
          const all = root.querySelectorAll(tag);
          return all[index] || null;
        }
        if (firstMatch) {
          const tag = firstMatch[1];
          return root.querySelector(tag);
        }
        return null;
      };
      const { document } = payload;
      const sections = payload.template && payload.template.sections;
      if (!sections || sections.length < 2) return;
      const reversedSections = [...sections].reverse();
      for (const section of reversedSections) {
        const sectionEl = resolveSelector(element, section.selector);
        if (!sectionEl) continue;
        let insertionPoint = sectionEl.closest(".ui-widget") || sectionEl;
        if (section.style) {
          const metadataBlock = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          insertionPoint.after(metadataBlock);
        }
        if (section !== sections[0]) {
          const hr = document.createElement("hr");
          insertionPoint.before(hr);
        }
      }
    }
  }

  // tools/importer/import-portal-homepage.js
  var parsers = {
    "hero-banner": parse,
    "cards-action": parse2,
    "columns-media": parse3,
    "cards-featured": parse4,
    "cards-horizontal": parse5,
    "columns-video": parse6,
    "columns-cta": parse7
  };
  var transformers = [
    transform,
    transform2
  ];
  var PAGE_TEMPLATE = {
    name: "portal-homepage",
    description: "Xcel Energy customer portal homepage with account management and energy services",
    urls: ["https://co.my.xcelenergy.com/s/"],
    blocks: [
      {
        name: "hero-banner",
        instances: ["c-xeg-hero-v2"]
      },
      {
        name: "cards-action",
        instances: ["c-xeg-multi-action-banner"]
      },
      {
        name: "columns-media",
        instances: ["c-xeg-two-column-v2"]
      },
      {
        name: "cards-featured",
        instances: ["c-xeg-featured-content-v2:nth-of-type(1)", "c-xeg-featured-content-v2:nth-of-type(3)"]
      },
      {
        name: "cards-horizontal",
        instances: ["c-xeg-featured-content-v2"]
      },
      {
        name: "columns-video",
        instances: ["c-dc-video-component-v2"]
      },
      {
        name: "columns-cta",
        instances: ["c-xeg-contact-support"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero",
        selector: "c-xeg-hero-v2:first-of-type",
        style: null,
        blocks: ["hero-banner"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Quick Actions",
        selector: "c-xeg-multi-action-banner",
        style: null,
        blocks: ["cards-action"],
        defaultContent: []
      },
      {
        id: "section-3",
        name: "Convenient Energy",
        selector: "c-xeg-two-column-v2:first-of-type",
        style: null,
        blocks: ["columns-media"],
        defaultContent: []
      },
      {
        id: "section-4",
        name: "Affordable Energy",
        selector: "c-xeg-featured-content-v2:nth-of-type(1)",
        style: null,
        blocks: ["cards-featured"],
        defaultContent: ["c-xeg-featured-content-v2:nth-of-type(1) h2", "c-xeg-featured-content-v2:nth-of-type(1) > section > div > p"]
      },
      {
        id: "section-5",
        name: "Personalized Energy",
        selector: "c-xeg-featured-content-v2:nth-of-type(2)",
        style: null,
        blocks: ["cards-horizontal"],
        defaultContent: ["c-xeg-featured-content-v2:nth-of-type(2) h2", "c-xeg-featured-content-v2:nth-of-type(2) > section > div > p"]
      },
      {
        id: "section-6",
        name: "Safer Energy",
        selector: "c-xeg-two-column-v2:nth-of-type(2)",
        style: null,
        blocks: ["columns-media"],
        defaultContent: []
      },
      {
        id: "section-7",
        name: "Local Energy",
        selector: "c-dc-video-component-v2",
        style: null,
        blocks: ["columns-video"],
        defaultContent: []
      },
      {
        id: "section-8",
        name: "Cleaner Energy",
        selector: "c-xeg-featured-content-v2:nth-of-type(3)",
        style: null,
        blocks: ["cards-featured"],
        defaultContent: ["c-xeg-featured-content-v2:nth-of-type(3) h2", "c-xeg-featured-content-v2:nth-of-type(3) > section > div > p"]
      },
      {
        id: "section-9",
        name: "Sustainable Energy",
        selector: "c-xeg-hero-v2:nth-of-type(2)",
        style: null,
        blocks: ["hero-banner"],
        defaultContent: []
      },
      {
        id: "section-10",
        name: "Contact CTA",
        selector: "c-xeg-contact-support",
        style: "dark-maroon",
        blocks: ["columns-cta"],
        defaultContent: []
      }
    ]
  };
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_portal_homepage_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/s/index"
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_portal_homepage_exports);
})();
