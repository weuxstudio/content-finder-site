# Full SEO Audit Report

Scope: full-site audit for the local build at `http://localhost:4321/`, verified against generated `dist` output where possible.

Audit date: 2026-06-23

## A) Audit Summary

Overall rating: Needs Improvement

Estimated SEO health score: 64/100

Score confidence: Medium. The audit has strong local/build evidence for markup, schema, sitemap, robots, metadata, internal links, and content. Core Web Vitals could not be measured because the PageSpeed API was rate-limited, and security headers were checked only against local dev HTTP, not production Cloudflare HTTPS.

Business type detected: SaaS/software product landing page for a WordPress plugin.

Top 3 issues:

1. JSON-LD schema is not rendering as valid JSON in `dist`.
2. Canonical URLs are wrong on non-homepage routes.
3. Sitemap and robots setup is incomplete.

Top 3 opportunities:

1. Add `/llms.txt` for AI search readiness.
2. Remove FAQPage schema and keep visible FAQ only.
3. Shorten social titles and improve production security headers.

## Evidence Collected

- `npm run build`: successful; generated 5 pages.
- `.seo-audit/page-summary.json`: route-level title, meta, canonical, headings, word count, schema snippets.
- `.seo-audit/parse-dist-index.json`: generated homepage parse.
- `.seo-audit/robots.txt`: robots and AI crawler analysis.
- `.seo-audit/llms.txt`: llms.txt check.
- `.seo-audit/social.txt`: Open Graph/Twitter metadata check.
- `.seo-audit/internal-links.txt`: internal link crawl.
- `.seo-audit/broken-links.txt`: broken link check.
- `.seo-audit/readability-home.json`: readability metrics.
- `.seo-audit/verified-findings.json`: verified findings list.

Environment limitations:

- `fetch_page.py` blocked `localhost` because it resolves to a private/internal IP, so local HTML was fetched with `curl`.
- PageSpeed Insights was rate-limited by Google API, so CWV/Lighthouse metrics are not confirmed.
- Security headers were checked against `http://localhost:4321/`; production Cloudflare headers still need deployed verification.

## Category Scores

| Category | Score | Confidence | Rationale |
|---|---:|---|---|
| Technical SEO | 58 | Medium | Build works and routes render, but canonical URLs are wrong, sitemap is incomplete, robots lacks Sitemap directive, and production security headers need verification. |
| Content Quality | 78 | Medium | Homepage has substantial focused copy, clear product positioning, pricing, use cases, trust and FAQ content. Legal/404 pages are intentionally short. |
| On-Page SEO | 72 | High | Titles/meta/H1s exist; social title is long and non-homepage canonicals are wrong. |
| Schema / Structured Data | 20 | High | JSON-LD is emitted as literal `{JSON.stringify(...)}` and FAQPage schema should not be used for a commercial site. |
| Performance / CWV | Insufficient data | Low | Build is static and Matomo is async, but PageSpeed was rate-limited; no confirmed LCP/INP/CLS values. |
| Images | 88 | Medium | Logo images have appropriate alt handling; decorative icon has empty alt. OG image exists. No large image performance audit completed. |
| AI Search Readiness | 62 | High | Robots has explicit AI crawler policy for many crawlers, but `llms.txt` is missing and several AI crawlers inherit default rules. |

## B) Findings Table

| Area | Severity | Confidence | Finding | Evidence | Fix |
|---|---|---|---|---|---|
| Schema | Critical | Confirmed | JSON-LD structured data is emitted as literal template text instead of valid JSON. | `dist/index.html` contains `{JSON.stringify(webSiteSchema)}`, `{JSON.stringify(softwareSchema)}`, and `{JSON.stringify(faqSchema)}` inside `application/ld+json` scripts. | Render JSON-LD with Astro `set:html` or precomputed JSON strings; validate generated `dist/index.html`. |
| Canonical | Critical | Confirmed | Every generated page uses the homepage canonical URL. | `page-summary.json` shows `https://contentfinderwp.com/` for homepage, imprint, privacy-policy, and 404. | Make canonical path-aware in `Layout.astro`; set legal pages to their own canonical URLs; omit canonical or noindex 404. |
| Schema | Warning | Confirmed | FAQPage schema is included on a commercial software site where rich-result eligibility is restricted. | `Layout.astro` defines `faqSchema` globally. Skill rule: FAQPage rich results are restricted to government/health authority sites. | Remove FAQPage JSON-LD; keep visible FAQ section. |
| Sitemap | Warning | Confirmed | Sitemap only lists the homepage and robots.txt has no Sitemap directive. | `dist/sitemap-0.xml` only includes `/`; robots checker reports no Sitemap directive. | Configure sitemap to include intended indexable pages and add `Sitemap: https://contentfinderwp.com/sitemap-index.xml` to `robots.txt`. |
| AI Search Readiness | Warning | Confirmed | No `llms.txt` is available. | `llms_txt_checker.py` reports `/llms.txt` HTTP 404 and no `llms-full.txt`. | Add `/llms.txt` with product summary, key URLs, pricing, trust/safety notes, and concise facts. |
| Robots | Warning | Confirmed | Some AI crawlers are not explicitly managed. | Robots checker reports `ChatGPT-User`, `anthropic-ai`, and `FacebookBot` inherit default rules. | Add explicit directives for these user agents according to the desired AI indexing/training policy. |
| Social Meta | Warning | Confirmed | OG title is longer than recommended social preview length. | `social_meta.py` reports `og:title` is 70 chars; recommended max is 60. | Shorten default OG title, e.g. `WEUX Content Finder | WordPress content search`. |
| Internal Linking | Warning | Confirmed | Internal link graph is thin and legal pages dominate internal anchors. | `internal_links.py`: 3 pages crawled, 8 internal links; top anchors are `Imprint` and `Privacy Policy`. | If separate feature/docs pages are added later, link them from footer/body. For current one-page site, keep key sections reachable and avoid over-weighting legal links. |
| Security Headers | Warning | Likely | Local dev response lacks production security headers. | `security_headers.py` against localhost reports missing HSTS, CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy. | Configure Cloudflare Pages headers via `_headers` or middleware; verify on deployed HTTPS. |
| Performance | Info | Hypothesis | Matomo adds a third-party script that should be monitored. | `Layout.astro` loads `//analyse.marcweidemueller.de/matomo.js` globally; PageSpeed was rate-limited. | Keep Matomo async, verify cookie/privacy setup, and rerun Lighthouse/PageSpeed on production. |

## Technical SEO

Passes:

- Static Astro build completes successfully.
- Main route, legal pages, 404, sitemap files, and robots file are generated.
- Broken link check found 0 broken links; 1 redirected external link.
- Main page has title, meta description, canonical, H1, H2 hierarchy, OG and Twitter tags.

Issues:

- Canonical URLs are not route-specific.
- JSON-LD is invalid in the built output.
- Sitemap does not include legal pages and robots has no Sitemap directive.
- 404 page uses homepage canonical through the shared layout.
- Production headers need verification on deployed HTTPS.

## Content Quality

Passes:

- Homepage word count is ~1,500 words, which is adequate for a competitive software landing page.
- Content covers problem, coverage, builder/ACF support, workflow, Pro features, pricing, trust, FAQ, and use cases.
- Positioning is clear: editor-focused WordPress content search, not a generic database migration tool.
- Readability is suitable for an educated B2B/software audience: Flesch Reading Ease 50.9, grade 9.5.

Issues:

- Readability script reports a paragraph-length warning, likely because minified/generated HTML collapses paragraph detection. Treat as low-confidence; visually the page is sectioned.
- Legal pages are intentionally short; that is acceptable because they are not primary SEO landing pages.

## On-Page SEO

Passes:

- Homepage title: `WEUX Content Finder | Find WordPress content and open the right editor`.
- Homepage meta description: focused and under typical truncation thresholds.
- Each generated page has one H1.
- Main page has meaningful H2 sections and conversion CTAs.

Issues:

- Social title is too long for ideal preview rendering.
- Legal and 404 pages inherit the homepage canonical.
- Open Graph URL is globally the homepage. That is fine for the homepage but wrong for route-specific sharing.

## Schema & Structured Data

Critical issue:

- Current JSON-LD output is invalid because Astro is outputting literal template expressions.

Additional issue:

- FAQPage schema should be removed for this commercial software site. Visible FAQ content is still useful; the structured data is the problem.

Recommended schema after fixing rendering:

- `WebSite` on homepage.
- `SoftwareApplication` on homepage only.
- Optional `Organization` for WEUX Studio/WEUX Content Finder relationship.
- Avoid `FAQPage` for rich result eligibility.

## Sitemap & Robots

Robots positives:

- Default crawler can access the site.
- Several AI crawlers are explicitly allowed or blocked.
- Training-oriented crawlers such as `Applebot-Extended`, `CCBot`, and `Bytespider` are blocked.

Robots gaps:

- Missing `Sitemap:` directive.
- `ChatGPT-User`, `anthropic-ai`, and `FacebookBot` are not explicitly managed.

Sitemap gaps:

- Sitemap currently lists only `https://contentfinderwp.com/`.
- Legal pages are not included. If legal pages should be discoverable from search, include them; if not, leave out intentionally and consider `noindex`.
- 404 should not be included, and currently is not.

## AI Search / GEO Readiness

Passes:

- Product copy is concise and answer-like.
- Pricing, feature distinctions, trust/privacy limitations, and use cases are visible.
- Robots already includes a directional AI crawler policy.

Gaps:

- Missing `/llms.txt`.
- Invalid JSON-LD weakens machine readability.
- No route-specific canonical URLs weakens citation confidence for legal pages.

## D) Unknowns and Follow-ups

- Production Core Web Vitals: rerun PageSpeed/Lighthouse on `https://contentfinderwp.com/` after deploy.
- Production security headers: verify via deployed HTTPS response, not localhost.
- Production Matomo behavior: confirm whether Matomo cookies are disabled or whether privacy copy/cookie posture must be adjusted.
- Search Console status: not checked; verify indexing, submitted sitemap, and canonical selection after deploy.

