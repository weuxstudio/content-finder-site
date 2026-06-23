# Full SEO Audit Report

Scope: full-site SEO audit for the live production site `https://contentfinderwp.com`.

Audit date: 2026-06-23

## A) Audit Summary

Overall rating: Good

Estimated SEO health score: 86/100

Score confidence: Medium-high. The audit used live production HTML and scripts for metadata, schema, robots, llms.txt, security headers, redirects, broken links, internal links, readability, sitemap, and 404 behavior. Core Web Vitals could not be measured because Google PageSpeed API was rate-limited.

Business type detected: SaaS/software landing page for a WordPress plugin.

Top 3 issues:

1. Production is missing HSTS and CSP headers.
2. Core Web Vitals could not be confirmed due PageSpeed API rate limiting.
3. Crawlable internal page graph is intentionally minimal; this is acceptable for now but limits future topic expansion.

Top 3 opportunities:

1. Add HSTS in Cloudflare and a measured CSP after testing Matomo and inline scripts.
2. Rerun Lighthouse/PageSpeed later on production to capture mobile CWV.
3. Optionally add richer social metadata and `llms-full.txt`.

## Evidence Collected

- `.seo-audit-live/home.html`: fetched production homepage, HTTP 200.
- `.seo-audit-live/parse-home.json`: parsed production homepage.
- `.seo-audit-live/security.txt`: production security headers.
- `.seo-audit-live/robots.txt`: robots and AI crawler management.
- `.seo-audit-live/llms.txt`: live llms.txt analysis.
- `.seo-audit-live/social.txt`: live Open Graph/Twitter analysis.
- `.seo-audit-live/broken-links.txt`: live broken link check.
- `.seo-audit-live/internal-links.txt`: live internal link crawl.
- `.seo-audit-live/readability-home.json`: homepage readability.
- `.seo-audit-live/notfound-check.json`: actual 404 behavior.
- `.seo-audit-live/verified-findings.json`: verified findings list.

Environment limitations:

- PageSpeed Insights was rate-limited by Google API, so LCP, INP, CLS, TBT, and Speed Index are not confirmed.
- Visual screenshots were not part of this run.

## Category Scores

| Category | Score | Confidence | Rationale |
|---|---:|---|---|
| Technical SEO | 88 | High | HTTPS, canonical, robots, noindex legal pages, sitemap, redirects, 404 behavior, and no broken links are good. Missing HSTS/CSP are the main penalty. |
| Content Quality | 82 | Medium | Homepage has ~1,500 words, clear positioning, pricing, trust, FAQ, use cases, and product detail. Readability is appropriate for B2B/software. |
| On-Page SEO | 90 | High | Title, meta description, H1, H2 structure, canonical, robots, and social title are in good shape. Optional social fields are missing. |
| Schema / Structured Data | 92 | High | Valid `WebSite` and `SoftwareApplication` schema present; no broken literal JSON and no FAQPage schema. |
| Performance / CWV | Insufficient data | Low | PageSpeed API was rate-limited; no confirmed production CWV metrics. |
| Images | 90 | Medium | Logo alt handling is correct, OG image exists, and decorative mark uses empty alt. No image weight audit was completed. |
| AI Search Readiness | 92 | High | `robots.txt` manages major AI crawlers and `llms.txt` exists with 95/100 quality score. |

## B) Findings Table

| Area | Severity | Confidence | Finding | Evidence | Fix |
|---|---|---|---|---|---|
| Security Headers | Warning | Confirmed | HSTS and CSP headers are missing on production. | `security_headers.py`: HTTPS yes, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` present; `Strict-Transport-Security` and `Content-Security-Policy` missing; score 65/100. | Add HSTS via Cloudflare and add a measured CSP that permits self-hosted assets, required inline scripts, and Matomo. |
| Performance | Info | Hypothesis | Core Web Vitals could not be measured in this audit due PageSpeed API rate limiting. | `pagespeed.py` returned `Rate limited by Google API`. | Rerun PageSpeed/Lighthouse later or with an API key; capture mobile LCP, INP, CLS, TBT, and Speed Index. |
| Internal Linking | Info | Confirmed | The crawlable internal page graph is intentionally small and dominated by legal links. | `internal_links.py`: 3 pages crawled, 8 internal links; top anchors are `Imprint` and `Privacy Policy`. | No urgent fix for a one-page landing page; if feature/docs pages are added, link them with descriptive anchors. |
| Social Meta | Info | Confirmed | Optional Open Graph and Twitter profile tags are missing. | `social_meta.py`: `og:site_name`, `og:locale`, `twitter:site`, and `twitter:creator` missing as optional fields. | Optionally add those fields if brand social accounts exist. |
| AI Search Readiness | Info | Confirmed | `llms.txt` is present and high quality; `llms-full.txt` is not present. | `llms_txt_checker.py`: found, 7 sections, 6 links, quality score 95/100; `llms-full.txt` not found. | Optional: add `llms-full.txt` if a longer machine-readable product brief is useful. |
| 404 | Info | Confirmed | Actual unknown URLs return HTTP 404 and noindex; standalone `/404` resolves as a 200 page. | Unknown URL returns 404 with `noindex,follow`; `/404` and `/404.html` return 200 with noindex. | No urgent fix; optional canonical cleanup for `/404` route if desired. |

## Technical SEO

Passes:

- Homepage returns HTTP 200 over HTTPS.
- No redirect chain on the canonical homepage.
- Unknown URLs return HTTP 404 and include noindex.
- Homepage canonical is `https://contentfinderwp.com/`.
- Legal pages have route-specific canonicals and `noindex,follow`.
- Sitemap index is present and references `sitemap-0.xml`.
- Sitemap contains only the homepage, matching the intended indexation policy.
- Broken link check found 0 broken links.
- `robots.txt` includes Sitemap directive and explicit AI crawler rules.

Remaining issue:

- Add HSTS and CSP on production.

## Content Quality

Passes:

- Homepage has 1,527 parsed words.
- Product positioning is clear: WordPress content search and editor links, with Pro preview-first replacement workflow.
- Page covers problem, coverage, builder/ACF support, workflow, Pro, pricing, use cases, trust, FAQ, and CTA.
- Readability is suitable for an educated B2B/software audience: Flesch Reading Ease 50.9, Flesch-Kincaid grade 9.5.

Notes:

- The readability script flags paragraph length because generated HTML collapses text extraction; visually the page is sectioned and scannable.

## On-Page SEO

Passes:

- SEO title: `WEUX Content Finder | Find WordPress content and open the right editor`.
- Social title: `WEUX Content Finder | WordPress content search`.
- Meta description is focused and concise.
- One H1 is present.
- H2 sections map to product intent and feature coverage.
- Open Graph and Twitter Card basics are present.

Optional improvement:

- Add `og:site_name`, `og:locale`, `twitter:site`, and `twitter:creator` if desired.

## Schema & Structured Data

Passes:

- Valid `WebSite` schema is present.
- Valid `SoftwareApplication` schema is present.
- Offers are included for Free, Single Site, 5 Sites, and Unlimited.
- No broken literal `{JSON.stringify(...)}` output.
- No `FAQPage` schema on the commercial site.

## Sitemap & Robots

Passes:

- `robots.txt` returns HTTP 200.
- Sitemap directive points to `https://contentfinderwp.com/sitemap-index.xml`.
- Major AI crawler rules are explicit.
- Training-only crawlers such as `Applebot-Extended`, `CCBot`, `Bytespider`, and `Amazonbot` are blocked.
- GPTBot, ChatGPT-User, ClaudeBot, PerplexityBot, Google-Extended, anthropic-ai, and FacebookBot are explicitly allowed.

## AI Search / GEO Readiness

Passes:

- `llms.txt` returns HTTP 200.
- Quality score: 95/100.
- Product facts, pricing, trust/safety, and important links are included.
- Homepage copy is structured around answerable product facts.

Optional improvement:

- Add `llms-full.txt` if a longer, more detailed machine-readable reference is useful.

## D) Unknowns and Follow-ups

- Core Web Vitals: rerun PageSpeed/Lighthouse once the API rate limit clears.
- Production CSP: should be tested carefully with Matomo and inline scripts before enforcing.
- Search Console: not checked; verify submitted sitemap and Google-selected canonical after deployment settles.

