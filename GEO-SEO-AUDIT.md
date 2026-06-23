# GEO / AI Search Audit for contentfinderwp.com

Audit date: 2026-06-23  
Target: https://contentfinderwp.com/  
Scope: live production page, robots.txt, sitemap, llms.txt, visible content, JSON-LD, AI crawler access, search-result visibility signals.

## Executive Summary

`contentfinderwp.com` is in good shape for generative search. The page has a clear product entity, strong topical coverage around WordPress editing surfaces, visible pricing, a useful FAQ, `llms.txt`, crawlable HTML, and explicit access for most important AI search bots.

Estimated GEO readiness: **82/100**

The main gaps are not basic SEO problems. They are AI-citation refinements:

1. The current `robots.txt` says `ai-train=no`, but still explicitly allows training-oriented bots such as `GPTBot` and `ClaudeBot`.
2. Claude's newer search/user bots are only allowed through the wildcard rule, not explicitly named.
3. The visible FAQ is strong, but there is no FAQ schema or expanded `llms-full.txt` for easier AI extraction.
4. `SoftwareApplication` schema is present but sparse; it should include URL, description, feature list, download URL, author/publisher, and richer offer metadata.
5. Public search results still show stale "Coming Soon" wording, even though the live page is updated.

## Evidence Collected

Artifacts are stored in `.geo-audit-live/`.

- Live homepage HTML: `.geo-audit-live/home.html`
- Parsed homepage signals: `.geo-audit-live/parsed-home.json`
- AI crawler and llms checks: `.geo-audit-live/geo-signals.json`
- HTTP headers: `.geo-audit-live/headers.txt`
- robots.txt: `.geo-audit-live/robots.txt`
- llms.txt: `.geo-audit-live/llms.txt`
- sitemap index and sitemap: `.geo-audit-live/sitemap-index.xml`, `.geo-audit-live/sitemap-0.xml`

## Current GEO Strengths

### Product Entity Clarity

The page consistently identifies the product as `WEUX Content Finder`, a WordPress plugin for finding content across editing surfaces.

Strong entity mentions in visible content:

- WordPress: 35 mentions
- Elementor: 27 mentions
- ACF: 25 mentions
- Templates: 11 mentions
- Search and Replace: 9 mentions
- Custom post types, template parts, synced patterns, navigation menus, block theme files, and Site Editor are also present.

This is good for AI answer systems because the page repeatedly connects the product to a specific use case instead of using generic SaaS copy.

### Answer-First Content

The page has extractable answers:

- What the plugin does
- What Free includes
- What Pro adds
- Whether search leaves the WordPress site
- Elementor support
- ACF support
- Search and Replace safety
- Pricing
- Limitations around database migration and supported structures

This is strong for ChatGPT, Perplexity, Google AI Overviews, Copilot, and Claude because they can lift short, direct answers from the page.

### llms.txt

`https://contentfinderwp.com/llms.txt` exists and contains:

- Product summary
- Audience
- Core capabilities
- Free vs Pro distinction
- Pricing
- Trust and safety notes
- Important links

This is one of the strongest GEO assets on the site.

### AI Bot Access

Current checks:

| Bot | Current access |
| --- | --- |
| GPTBot | Allowed explicitly |
| OAI-SearchBot | Allowed explicitly |
| ChatGPT-User | Allowed explicitly |
| PerplexityBot | Allowed explicitly |
| ClaudeBot | Allowed explicitly |
| Claude-SearchBot | Allowed via wildcard |
| Claude-User | Allowed via wildcard |
| anthropic-ai | Allowed explicitly |
| Googlebot | Allowed via wildcard |
| Bingbot | Allowed via wildcard |
| msnbot | Allowed via wildcard |
| FacebookBot | Allowed explicitly |
| Applebot-Extended | Blocked explicitly |
| CCBot | Blocked explicitly |
| Bytespider | Blocked explicitly |
| Amazonbot | Blocked explicitly |

The site is broadly accessible to AI search systems.

## Priority Findings

### 1. robots.txt policy is internally inconsistent

Severity: High for policy clarity

The file declares:

`Content-Signal: search=yes,ai-input=yes,ai-train=no`

But it also explicitly allows:

- `GPTBot`
- `ClaudeBot`

Those are commonly treated as training/crawling user agents, while `OAI-SearchBot`, `ChatGPT-User`, `PerplexityBot`, `Claude-SearchBot`, and `Claude-User` are more relevant for AI search/retrieval visibility.

Recommendation:

- If the intent is **AI search yes, AI training no**, change robots to explicitly allow search/user retrieval bots and block training-oriented bots.
- Add explicit rules for `Claude-SearchBot`, `Claude-User`, and `Perplexity-User`.

Suggested direction:

```txt
User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Perplexity-User
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: Claude-User
Allow: /

User-agent: GPTBot
Disallow: /

User-agent: ClaudeBot
Disallow: /
```

Keep `Googlebot`, `Bingbot`, and normal crawlers allowed.

### 2. Stale public search result still says "Coming Soon"

Severity: High for first impression

The live page has the correct title:

`WEUX Content Finder | Find WordPress content and open the right editor`

But public search result evidence still surfaced stale "Content Finder - Coming Soon" wording. That means Google/Bing/AI systems may still have old snippets in their index.

Recommendation:

- Submit the homepage in Google Search Console URL Inspection.
- Submit to Bing Webmaster Tools.
- Request re-indexing.
- Make sure Cloudflare cache has no old HTML.
- Keep the homepage sitemap-only strategy, but resubmit `https://contentfinderwp.com/sitemap-index.xml`.

### 3. Schema is valid but too sparse for AI extraction

Severity: Medium

Current schema types:

- `WebSite`
- `SoftwareApplication`

The `SoftwareApplication` schema includes offers, but misses important extractable fields:

- `url`
- `description`
- `downloadUrl`
- `softwareVersion` if stable
- `featureList`
- `applicationSubCategory`
- `author` / `publisher`
- `sameAs`
- richer `offers.url`

Recommendation:

Enrich `SoftwareApplication` while keeping it aligned with visible content. Google states structured data helps it understand page content and recommends JSON-LD when possible. The current setup uses JSON-LD correctly; it just needs richer product facts.

### 4. FAQ is visible but not explicitly machine-labeled

Severity: Medium

The visible FAQ is one of the best GEO blocks on the page. It answers concrete AI-query patterns:

- "Does it work with Elementor?"
- "How does ACF support work?"
- "Is Search and Replace safe?"
- "Is this a database migration tool?"
- "How much does Pro cost?"

There is no `FAQPage` JSON-LD. That was intentional from the earlier SEO plan, but from a pure GEO standpoint it reduces machine readability.

Recommendation:

Pick one of two approaches:

- Conservative SEO approach: keep no FAQ schema, but add a fuller `llms-full.txt` with all FAQ answers.
- GEO-forward approach: add `FAQPage` JSON-LD only if every answer exactly matches visible FAQ copy and you are comfortable reintroducing FAQ schema.

### 5. Missing `llms-full.txt`

Severity: Medium

`llms.txt` is strong, but short. For AI answer engines, a public `llms-full.txt` can act as a clean citation-ready source.

Recommendation:

Add `public/llms-full.txt` with:

- Short product definition
- "Best for" audience
- Feature table
- Pricing table
- FAQ answers
- Security/trust limitations
- Download and licensing links

Keep it factual and non-marketing-heavy.

### 6. Weak external authority/citation layer

Severity: Medium

The page explains WordPress concepts but does not cite authoritative references for core concepts like block templates, patterns, Elementor, or ACF. GEO research patterns favor well-sourced, factual content, especially for AI citations.

Recommendation:

Add a subtle "Built for modern WordPress editing surfaces" or "Compatibility notes" block with links to authoritative docs:

- WordPress block editor / site editor docs
- WordPress templates and patterns docs
- Elementor documentation for dynamic/ACF data
- ACF documentation for field types

Do this quietly; do not turn the landing page into a documentation page.

### 7. Freshness signal is not explicit

Severity: Low to Medium

AI answer systems often favor current, maintained pages. The page has current content but no visible "last updated" or schema-level `dateModified`.

Recommendation:

- Add `dateModified` in `WebPage` or `SoftwareApplication` schema.
- Optionally add a subtle "Updated June 2026" note in footer or `llms.txt`.

## Platform-Specific Assessment

### ChatGPT

Status: Good

Strengths:

- `OAI-SearchBot` allowed.
- `ChatGPT-User` allowed.
- Strong answer-first FAQ.
- Product entity is clear.

Risks:

- `GPTBot` is allowed despite `ai-train=no`.
- No `llms-full.txt`.
- Stale indexed "Coming Soon" result can hurt citation freshness.

Recommended priority:

Explicitly separate OpenAI search/user bots from GPTBot training policy.

### Perplexity

Status: Good

Strengths:

- `PerplexityBot` allowed.
- Content is highly extractable.
- FAQ and pricing are visible.

Risks:

- `Perplexity-User` is not explicitly allowed.
- FAQ schema is absent.
- No public PDF or deep citation asset.

Recommended priority:

Add `Perplexity-User` allow rule and `llms-full.txt`.

### Google AI Overviews / AI Mode

Status: Good

Strengths:

- Googlebot allowed through wildcard.
- Crawlable HTML.
- Structured data exists.
- Important content is textual.
- Sitemap includes the homepage only, which matches the index strategy.

Risks:

- Structured data is sparse.
- Stale SERP title/snippet.
- Internal linking graph is intentionally small.

Recommended priority:

Request re-indexing and enrich JSON-LD.

### Microsoft Copilot / Bing

Status: Mostly good

Strengths:

- Bingbot/msnbot allowed via wildcard.
- Static, fast page.
- Clear entity definitions.

Risks:

- No evidence of Bing Webmaster Tools submission.
- No IndexNow mention.
- No LinkedIn/GitHub/company entity references in schema.

Recommended priority:

Submit sitemap to Bing Webmaster Tools and consider IndexNow if publishing more pages later.

### Claude

Status: Good but should be more explicit

Strengths:

- `anthropic-ai` and `ClaudeBot` explicitly allowed.
- `Claude-SearchBot` and `Claude-User` allowed via wildcard.
- Text is structurally clear.

Risks:

- Search/user bots are not explicitly named.
- Training vs search policy is unclear because `ClaudeBot` is allowed while `ai-train=no` is declared.

Recommended priority:

Add explicit `Claude-SearchBot` and `Claude-User` rules. Decide whether `ClaudeBot` should be blocked for training policy consistency.

## Recommended GEO Action Plan

### P0: Fix AI crawler policy clarity

Decide whether the actual policy is:

- **Search and retrieval allowed, model training blocked**

If yes, update `robots.txt` to:

- Allow `OAI-SearchBot`, `ChatGPT-User`
- Allow `PerplexityBot`, `Perplexity-User`
- Allow `Claude-SearchBot`, `Claude-User`
- Allow Googlebot, Bingbot, msnbot
- Block `GPTBot`, `ClaudeBot`, `Applebot-Extended`, `CCBot`, `Bytespider`, `Amazonbot`, `meta-externalagent`

### P1: Re-index stale search result

- Google Search Console: inspect `https://contentfinderwp.com/`, request indexing.
- Bing Webmaster Tools: submit homepage and sitemap.
- Resubmit `https://contentfinderwp.com/sitemap-index.xml`.

### P1: Enrich SoftwareApplication schema

Add:

- `url`
- `description`
- `downloadUrl`
- `featureList`
- `author` / `publisher`
- `sameAs`
- `offers.url`
- `dateModified`

Keep all schema facts visible on the page.

### P2: Add `llms-full.txt`

Create a fuller AI-readable product source with pricing, features, FAQ, and trust/safety. Link it from `llms.txt`.

### P2: Add quiet authoritative references

Add a small compatibility/reference area or FAQ answer links for WordPress, Elementor, and ACF docs. Keep it subtle and factual.

### P3: Consider FAQPage schema

Only reintroduce FAQ schema if you want a GEO-forward stance and the JSON-LD exactly mirrors visible FAQ content.

## Current Overall Rating

| Area | Score |
| --- | ---: |
| AI crawl access | 86 |
| Robots policy clarity | 68 |
| Entity clarity | 92 |
| Answer-first content | 88 |
| Schema for AI extraction | 74 |
| llms readiness | 88 |
| Index freshness | 65 |
| Trust / safety clarity | 90 |

Overall: **82/100**

## Sources Consulted

- OpenAI crawler documentation: https://developers.openai.com/api/docs/bots
- Perplexity crawler documentation: https://docs.perplexity.ai/docs/resources/perplexity-crawlers
- Google AI features guidance: https://developers.google.com/search/docs/appearance/ai-features
- Google structured data guidance: https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data
- Live page: https://contentfinderwp.com/
- Live robots.txt: https://contentfinderwp.com/robots.txt
- Live llms.txt: https://contentfinderwp.com/llms.txt
