# SEO Action Plan

Scope: prioritized improvements for the live production site `https://contentfinderwp.com`.

## Immediate Fixes

1. Add HSTS on production
   - Impact: Medium
   - Effort: Low
   - Recommended header: `Strict-Transport-Security: max-age=31536000; includeSubDomains`
   - Acceptance: `security_headers.py https://contentfinderwp.com` reports HSTS present.

2. Add a tested Content Security Policy
   - Impact: Medium
   - Effort: Medium
   - Constraint: Must not break Astro inline scripts, protected-contact decoding, or Matomo.
   - Suggested starting point: test in `Content-Security-Policy-Report-Only` first, then enforce.
   - Acceptance: CSP present and site interactions still work.

## Quick Wins

3. Rerun Core Web Vitals measurement
   - Impact: Medium
   - Effort: Low
   - Action: rerun PageSpeed or Lighthouse mobile/desktop when API limit clears.
   - Acceptance: documented LCP, INP, CLS, TBT, and Speed Index for homepage.

4. Add optional social profile metadata
   - Impact: Low
   - Effort: Low
   - Add if accounts exist: `og:site_name`, `og:locale`, `twitter:site`, `twitter:creator`.
   - Acceptance: `social_meta.py` optional warnings reduced.

## Strategic Improvements

5. Add `llms-full.txt` only if useful
   - Impact: Low to Medium
   - Effort: Medium
   - Action: create a longer product reference with detailed capabilities, limitations, pricing, and trust notes.
   - Acceptance: `llms_txt_checker.py` reports `llms-full.txt` found.

6. Expand internal linking only when real pages exist
   - Impact: Medium future opportunity
   - Effort: Medium
   - Action: if creating future pages for Elementor search, ACF support, Search and Replace, or WordPress agency workflows, link those from the homepage and footer with descriptive anchors.
   - Acceptance: internal link crawl shows meaningful product anchors beyond legal links.

## Maintenance

7. Verify Search Console after deploy
   - Submit `https://contentfinderwp.com/sitemap-index.xml`.
   - Inspect homepage canonical.
   - Confirm legal pages are excluded due `noindex,follow`.

8. Keep current successful SEO fixes intact
   - Preserve valid `WebSite` and `SoftwareApplication` JSON-LD.
   - Keep `FAQPage` schema removed.
   - Keep `/imprint/` and `/privacy-policy/` as `noindex,follow`.
   - Keep sitemap limited to the homepage unless indexation strategy changes.

