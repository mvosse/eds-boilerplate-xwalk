/* eslint-disable */
/* global WebImporter */

import heroBannerParser from './parsers/hero-banner.js';
import cardsActionParser from './parsers/cards-action.js';
import columnMediaParser from './parsers/columns-media.js';
import cardsFeaturedParser from './parsers/cards-featured.js';
import cardsHorizontalParser from './parsers/cards-horizontal.js';
import columnsVideoParser from './parsers/columns-video.js';
import columnsCtaParser from './parsers/columns-cta.js';

import cleanupTransformer from './transformers/xcelenergy-cleanup.js';
import sectionsTransformer from './transformers/xcelenergy-sections.js';

const parsers = {
  'hero-banner': heroBannerParser,
  'cards-action': cardsActionParser,
  'columns-media': columnMediaParser,
  'cards-featured': cardsFeaturedParser,
  'cards-horizontal': cardsHorizontalParser,
  'columns-video': columnsVideoParser,
  'columns-cta': columnsCtaParser,
};

const transformers = [
  cleanupTransformer,
  sectionsTransformer,
];

const PAGE_TEMPLATE = {
  name: 'portal-homepage',
  description: 'Xcel Energy customer portal homepage with account management and energy services',
  urls: ['https://co.my.xcelenergy.com/s/'],
  blocks: [
    {
      name: 'hero-banner',
      instances: ['c-xeg-hero-v2'],
    },
    {
      name: 'cards-action',
      instances: ['c-xeg-multi-action-banner'],
    },
    {
      name: 'columns-media',
      instances: ['c-xeg-two-column-v2'],
    },
    {
      name: 'cards-featured',
      instances: ['c-xeg-featured-content-v2:nth-of-type(1)', 'c-xeg-featured-content-v2:nth-of-type(3)'],
    },
    {
      name: 'cards-horizontal',
      instances: ['c-xeg-featured-content-v2'],
    },
    {
      name: 'columns-video',
      instances: ['c-dc-video-component-v2'],
    },
    {
      name: 'columns-cta',
      instances: ['c-xeg-contact-support'],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero',
      selector: 'c-xeg-hero-v2:first-of-type',
      style: null,
      blocks: ['hero-banner'],
      defaultContent: [],
    },
    {
      id: 'section-2',
      name: 'Quick Actions',
      selector: 'c-xeg-multi-action-banner',
      style: null,
      blocks: ['cards-action'],
      defaultContent: [],
    },
    {
      id: 'section-3',
      name: 'Convenient Energy',
      selector: 'c-xeg-two-column-v2:first-of-type',
      style: null,
      blocks: ['columns-media'],
      defaultContent: [],
    },
    {
      id: 'section-4',
      name: 'Affordable Energy',
      selector: 'c-xeg-featured-content-v2:nth-of-type(1)',
      style: null,
      blocks: ['cards-featured'],
      defaultContent: ['c-xeg-featured-content-v2:nth-of-type(1) h2', 'c-xeg-featured-content-v2:nth-of-type(1) > section > div > p'],
    },
    {
      id: 'section-5',
      name: 'Personalized Energy',
      selector: 'c-xeg-featured-content-v2:nth-of-type(2)',
      style: null,
      blocks: ['cards-horizontal'],
      defaultContent: ['c-xeg-featured-content-v2:nth-of-type(2) h2', 'c-xeg-featured-content-v2:nth-of-type(2) > section > div > p'],
    },
    {
      id: 'section-6',
      name: 'Safer Energy',
      selector: 'c-xeg-two-column-v2:nth-of-type(2)',
      style: null,
      blocks: ['columns-media'],
      defaultContent: [],
    },
    {
      id: 'section-7',
      name: 'Local Energy',
      selector: 'c-dc-video-component-v2',
      style: null,
      blocks: ['columns-video'],
      defaultContent: [],
    },
    {
      id: 'section-8',
      name: 'Cleaner Energy',
      selector: 'c-xeg-featured-content-v2:nth-of-type(3)',
      style: null,
      blocks: ['cards-featured'],
      defaultContent: ['c-xeg-featured-content-v2:nth-of-type(3) h2', 'c-xeg-featured-content-v2:nth-of-type(3) > section > div > p'],
    },
    {
      id: 'section-9',
      name: 'Sustainable Energy',
      selector: 'c-xeg-hero-v2:nth-of-type(2)',
      style: null,
      blocks: ['hero-banner'],
      defaultContent: [],
    },
    {
      id: 'section-10',
      name: 'Contact CTA',
      selector: 'c-xeg-contact-support',
      style: 'dark-maroon',
      blocks: ['columns-cta'],
      defaultContent: [],
    },
  ],
};

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

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
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;

    const main = document.body;

    executeTransformers('beforeTransform', main, payload);

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

    executeTransformers('afterTransform', main, payload);

    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/s/index',
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
