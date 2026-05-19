/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Xcel Energy site-wide cleanup.
 * Removes non-authorable content from the Salesforce Lightning Community portal.
 * All selectors verified against captured DOM (migration-work/cleaned.html).
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // Salesforce loading box with spinner (line 2: <div class="auraMsgBox auraLoadingBox" id="auraLoadingBox">)
    // Salesforce error mask overlay (line 10: <div class="auraForcedErrorBox" id="auraErrorMask">)
    // Decibel Insight analytics links (line 32-33: <link href="//cdn.decibelinsight.net">)
    WebImporter.DOMUtils.remove(element, [
      '#auraLoadingBox',
      '#auraErrorMask',
      'link[href*="decibelinsight"]',
    ]);
  }

  if (hookName === H.after) {
    // Site header desktop with full navigation (line 59: <c-xeg-site-header-desktop>)
    // Site footer with links and legal (line 849: <c-xeg-site-footer>)
    // Billing reroute component (line 49: <c-ma-billing-reroute>)
    // Maintenance redirect component (line 52: <c-xe-maintenance-redirect>)
    // Site header alert banner (line 56: <c-xeg-site-header-alert>)
    // Skip to main content link (line 58: <a id="xegs2c">)
    // Mobile task component (line 544: <c-xeg-mobile-task>)
    // Salesforce record API handler (line 40: <siteforce-record-api-refresh-handler>)
    // Embedded messaging footer wrapper (line 1092: <div class="xeg-footer">)
    // Toast notification manager (line 1110: <div class="forceCommunityToastManager">)
    // Hover prototype tooltip (line 1119: <div class="forceHoverPrototype">)
    // Salesforce spinner/panels (line 1126: <div class="hideEl siteforceSpinnerManager siteforcePanelsContainer">)
    // Desktop panels container (line 1140: <div class="DESKTOP comm-panels-container...siteforcePanelsContainer">)
    // Screen reader live region (line 1147: <span id="sf-aria-live">)
    // Google reCAPTCHA badge (line 1150: <div class="grecaptcha-badge">)
    // Kampyle feedback button (line 1171: <span id="kampyleButtonContainer">)
    // Embedded messaging chat widget (line 1178: <div id="embedded-messaging">)
    // Experience messaging component (line 1095: <experience_messaging-embedded-messaging>)
    // Iframes (reCAPTCHA, messaging) (lines 1152, 1160, 1169)
    // Link elements (non-content)
    WebImporter.DOMUtils.remove(element, [
      'c-xeg-site-header-desktop',
      'c-xeg-site-footer',
      'c-ma-billing-reroute',
      'c-xe-maintenance-redirect',
      'c-xeg-site-header-alert',
      'a#xegs2c',
      'c-xeg-mobile-task',
      'siteforce-record-api-refresh-handler',
      '.xeg-footer',
      '.forceCommunityToastManager',
      '.forceHoverPrototype',
      '.siteforceSpinnerManager',
      '.siteforcePanelsContainer',
      '#sf-aria-live',
      '.grecaptcha-badge',
      '#kampyleButtonContainer',
      '#embedded-messaging',
      'experience_messaging-embedded-messaging',
      'iframe',
      'link',
      'noscript',
    ]);

    // Remove SVG icon cache divs that are non-content (line 1163)
    const svgCacheDivs = element.querySelectorAll('div[id^="httpscomyxcelenergy"]');
    svgCacheDivs.forEach((el) => el.remove());

    // Remove data-di tracking attributes from all elements
    element.querySelectorAll('[data-di-id]').forEach((el) => el.removeAttribute('data-di-id'));
    element.querySelectorAll('[data-di-res-id]').forEach((el) => el.removeAttribute('data-di-res-id'));
    element.querySelectorAll('[data-di-rand]').forEach((el) => el.removeAttribute('data-di-rand'));
  }
}
