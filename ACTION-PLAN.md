# SEO Action Plan

Scope: prioritized fixes for the WEUX Content Finder site based on the full SEO audit.

## Immediate Fixes

1. Fix JSON-LD rendering
   - Impact: Critical
   - Effort: Low
   - Files: `src/layouts/Layout.astro`
   - Action: Replace literal `{JSON.stringify(...)}` script bodies with Astro-safe JSON injection, such as `<script type="application/ld+json" set:html={JSON.stringify(schema)} />`.
   - Acceptance: `dist/index.html` contains valid JSON-LD and `validate_schema.py dist/index.html` passes.

2. Remove FAQPage schema
   - Impact: High
   - Effort: Low
   - Files: `src/layouts/Layout.astro`
   - Action: Delete global `faqSchema` JSON-LD output. Keep the visible FAQ section on the page.
   - Acceptance: No `FAQPage` JSON-LD in generated HTML.

3. Make canonical URLs route-specific
   - Impact: Critical
   - Effort: Medium
   - Files: `src/layouts/Layout.astro`, page frontmatter
   - Action: Add a `canonicalPath` or full `canonicalUrl` prop. Use `/` for homepage, `/imprint/` for imprint, `/privacy-policy/` for privacy policy. For 404, either omit canonical or add `noindex`.
   - Acceptance: `dist/imprint/index.html` canonical is `https://contentfinderwp.com/imprint/`; privacy policy uses `/privacy-policy/`; 404 is not canonicalized to homepage.

## Quick Wins

4. Add Sitemap directive to robots.txt
   - Impact: Medium
   - Effort: Low
   - File: `public/robots.txt`
   - Action: Add `Sitemap: https://contentfinderwp.com/sitemap-index.xml`.
   - Acceptance: robots checker no longer reports missing Sitemap directive.

5. Decide sitemap inclusion for legal pages
   - Impact: Medium
   - Effort: Low
   - Files: Astro sitemap config / route config
   - Action: Include `/imprint/` and `/privacy-policy/` if they should be indexed; otherwise add `noindex` and keep them out of sitemap.
   - Acceptance: Sitemap matches indexation policy.

6. Add `/llms.txt`
   - Impact: Medium
   - Effort: Low
   - File: `public/llms.txt`
   - Action: Add product name, concise description, target users, key capabilities, pricing, trust/safety notes, and important links.
   - Acceptance: `llms_txt_checker.py` returns found/valid.

7. Complete AI crawler directives
   - Impact: Medium
   - Effort: Low
   - File: `public/robots.txt`
   - Action: Add explicit policy for `ChatGPT-User`, `anthropic-ai`, and `FacebookBot`.
   - Acceptance: robots checker reports no unmanaged AI crawlers.

8. Shorten social title
   - Impact: Medium
   - Effort: Low
   - File: `src/layouts/Layout.astro` or page props
   - Action: Use a shorter OG/Twitter title than the SEO title.
   - Suggested: `WEUX Content Finder | WordPress content search`
   - Acceptance: social meta checker no longer warns about long OG title.

## Strategic Improvements

9. Configure production security headers
   - Impact: Medium
   - Effort: Medium
   - Files: Cloudflare Pages `_headers` or middleware
   - Action: Add `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options` or CSP frame rules, and a measured CSP that allows self-hosted assets plus Matomo.
   - Acceptance: production security header scan passes core checks.

10. Run production PageSpeed after deploy
    - Impact: Medium
    - Effort: Low
    - Action: Run mobile and desktop Lighthouse/PageSpeed on `https://contentfinderwp.com/`.
    - Acceptance: confirmed LCP, INP, CLS, TBT, Speed Index values captured in a follow-up audit.

11. Review Matomo privacy/performance setup
    - Impact: Medium
    - Effort: Low
    - Files: `src/layouts/Layout.astro`, privacy policy if needed
    - Action: Confirm whether Matomo is cookieless/anonymized. If cookies or personal data are processed, update privacy policy and consent posture.
    - Acceptance: privacy copy and Matomo configuration match.

## Maintenance

12. Keep one-page IA unless more search landing pages are intentionally added
    - Impact: Low
    - Effort: Medium
    - Action: Current content is strong as a product landing page. Only add separate pages if there is a clear keyword/intent target, such as `Elementor content search`, `ACF search and replace`, or `WordPress search and replace plugin`.

13. Add Search Console verification after deploy
    - Impact: Medium
    - Effort: Low
    - Action: Submit sitemap, inspect homepage, and confirm Google-selected canonical.

