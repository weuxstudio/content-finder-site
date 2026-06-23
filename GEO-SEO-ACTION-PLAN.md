# GEO / SEO Improvement Plan

Source audit: `GEO-SEO-AUDIT.md`  
Target: `https://contentfinderwp.com/`  
Goal: improve AI search citation readiness while preserving standard SEO quality and the current one-page marketing strategy.

## Summary

The site is already technically healthy for SEO/GEO. The highest-value improvements are policy clarity for AI crawlers, richer structured data, a fuller AI-readable content source, and re-indexing stale public search results that still show old "Coming Soon" wording.

Recommended target state:

- AI search and retrieval bots can crawl the site.
- Training-only bots are blocked if the policy remains `ai-train=no`.
- Homepage schema gives search and AI systems enough product facts to extract accurate answers.
- `llms.txt` points to a fuller `llms-full.txt`.
- Search engines are prompted to refresh stale snippets.
- FAQ and pricing remain visible, factual, and easy to cite.

## Phase 1: Fix AI Crawler Policy Clarity

Priority: P0  
Type: repo change  
Files: `public/robots.txt`

### Problem

`robots.txt` currently declares:

```txt
Content-Signal: search=yes,ai-input=yes,ai-train=no
```

But it also explicitly allows likely training-oriented bots such as `GPTBot` and `ClaudeBot`.

### Implementation

If the intended policy is **AI search yes, AI training no**, update `robots.txt` to explicitly separate search/retrieval bots from training bots.

Allow:

- `OAI-SearchBot`
- `ChatGPT-User`
- `PerplexityBot`
- `Perplexity-User`
- `Claude-SearchBot`
- `Claude-User`
- `Googlebot`
- `Bingbot`
- `msnbot`
- normal `User-agent: *`

Block:

- `GPTBot`
- `ClaudeBot`
- `Applebot-Extended`
- `CCBot`
- `Bytespider`
- `Amazonbot`
- `meta-externalagent`
- `CloudflareBrowserRenderingCrawler` if still unwanted

Keep:

```txt
Sitemap: https://contentfinderwp.com/sitemap-index.xml
```

### Acceptance Criteria

- `robots.txt` no longer contradicts `ai-train=no`.
- Search/user AI bots are explicitly allowed.
- Training-oriented bots are explicitly blocked.
- Googlebot and Bingbot remain crawlable.

## Phase 2: Enrich Homepage Structured Data

Priority: P1  
Type: repo change  
Files: `src/layouts/Layout.astro`, possibly `src/pages/index.astro`

### Problem

Current JSON-LD has valid `WebSite` and `SoftwareApplication` schema, but the `SoftwareApplication` entity is sparse.

### Implementation

Extend the homepage schema with factual, visible product data.

Add to `SoftwareApplication`:

- `url: "https://contentfinderwp.com/"`
- `description`
- `downloadUrl: "https://wordpress.org/plugins/weux-content-finder/"`
- `applicationCategory: "WordPress Plugin"`
- `applicationSubCategory: "Content search and replacement"`
- `operatingSystem: "WordPress 6.0+"`
- `featureList`
- `author` / `publisher` as `Organization`
- `sameAs` links, at minimum WordPress.org and weux.studio
- `dateModified`, using the current release/update date
- `offers[].url` for Free and Pro routes

Recommended `featureList`:

- Search posts, pages, and custom post types.
- Search block templates, template parts, synced patterns, navigation menus, and block theme files.
- Search Elementor page data and open Elementor edit links where available.
- Show ACF match counts in Free.
- Add preview-first Search and Replace in Pro.
- Review before/after snippets before changing content.
- Selectively replace confirmed matches.
- Undo completed replacement batches.
- Search and replace supported text-like ACF fields in Pro.

### Constraints

- Do not add schema facts that are not visible on the page or in `llms.txt`.
- Keep legal and 404 pages schema-free.
- Keep `/imprint/` and `/privacy-policy/` as `noindex,follow`.

### Acceptance Criteria

- JSON-LD validates.
- No `FAQPage` schema is added in this phase.
- `SoftwareApplication` includes richer extractable product facts.
- `npm run build` passes.

## Phase 3: Add `llms-full.txt`

Priority: P1  
Type: repo change  
Files: `public/llms.txt`, `public/llms-full.txt`

### Problem

`llms.txt` is good but compact. A fuller AI-readable source can improve answer extraction without cluttering the landing page.

### Implementation

Create `public/llms-full.txt` with:

- Product definition
- Target audience
- Supported content layers
- Free feature list
- Pro feature list
- Pricing table
- FAQ answers
- Trust and safety notes
- Known limitations
- Important links

Update `public/llms.txt` to link to:

```md
Full product context: [llms-full.txt](https://contentfinderwp.com/llms-full.txt)
```

### Copy Principles

- Factual, not sales-heavy.
- Answer-first.
- Short paragraphs.
- Include exact plan names and prices:
  - Free: €0
  - Single Site: €39/year
  - 5 Sites: €79/year
  - Unlimited: €149/year

### Acceptance Criteria

- `https://contentfinderwp.com/llms-full.txt` exists after deploy.
- `llms.txt` links to it.
- It contains no private/legal contact data.
- It does not contradict the landing page.

## Phase 4: Refresh Indexing and Stale Search Snippets

Priority: P1  
Type: external/manual  
Tools: Google Search Console, Bing Webmaster Tools, Cloudflare

### Problem

Public search evidence still showed old "Coming Soon" wording even though the live homepage is updated.

### Actions

1. In Google Search Console:
   - Inspect `https://contentfinderwp.com/`
   - Request indexing.
   - Submit `https://contentfinderwp.com/sitemap-index.xml`

2. In Bing Webmaster Tools:
   - Submit `https://contentfinderwp.com/`
   - Submit `https://contentfinderwp.com/sitemap-index.xml`

3. In Cloudflare:
   - Purge cache for `https://contentfinderwp.com/`
   - Purge cache for `/robots.txt`, `/llms.txt`, `/llms-full.txt`, `/sitemap-index.xml`

### Acceptance Criteria

- `site:contentfinderwp.com` eventually shows the updated title/snippet.
- Search result no longer uses "Coming Soon" as the primary title.
- Bing knows the homepage and sitemap.

## Phase 5: Add Subtle Authoritative References

Priority: P2  
Type: content/repo change  
Files: likely `src/pages/index.astro`

### Problem

The page explains WordPress editing surfaces but does not cite authoritative sources. GEO systems often prefer well-sourced, factual content.

### Implementation Options

Add a compact "Compatibility notes" or "Built for WordPress editing surfaces" block near Trust & Safety or FAQ.

Reference links can include:

- WordPress.org plugin page
- WordPress Site Editor / block theme documentation
- WordPress templates, template parts, and patterns documentation
- Elementor documentation relevant to dynamic content/edit links
- ACF documentation for field types

### Design Constraint

Keep it visually quiet. This should not become a heavy documentation section.

### Acceptance Criteria

- References are visible and useful.
- External links use `target="_blank"` and `rel="noopener noreferrer"`.
- The landing page still feels clean.

## Phase 6: Decide on FAQ Schema

Priority: P2/P3  
Type: product/SEO decision, then repo change if approved

### Context

The previous SEO plan intentionally removed `FAQPage` schema. From a pure GEO perspective, FAQ schema can help extraction, but it should only be used if the structured data exactly matches visible FAQ content.

### Recommendation

Default conservative path:

- Do not add `FAQPage` schema yet.
- Put the full FAQ into `llms-full.txt`.
- Reassess after Search Console has stable indexed snippets.

GEO-forward path:

- Add `FAQPage` schema only on the homepage.
- Ensure every answer exactly matches visible FAQ copy.
- Validate in Rich Results Test and Schema.org Validator.

### Acceptance Criteria

- A clear decision is documented.
- If FAQ schema is added, it validates and mirrors visible content.

## Phase 7: Add Freshness Signals

Priority: P2  
Type: repo change  
Files: `src/layouts/Layout.astro`, `public/llms.txt`, `public/llms-full.txt`

### Implementation

- Add `dateModified` to homepage schema.
- Add "Last updated: June 2026" to `llms.txt` and `llms-full.txt`.
- Optionally add a subtle footer or trust-note freshness line if it fits the design.

### Acceptance Criteria

- AI-readable freshness exists.
- No distracting visual noise on the landing page.

## Phase 8: Validation Checklist

Run after implementation:

```bash
npm run build
```

Check generated output:

```bash
grep -R "llms-full" dist/llms.txt
grep -R "SoftwareApplication" dist/index.html
grep -R "FAQPage" dist/index.html || true
grep -R "noindex,follow" dist/imprint/index.html dist/privacy-policy/index.html dist/404.html
```

Live checks after deploy:

```bash
curl -s https://contentfinderwp.com/robots.txt
curl -s https://contentfinderwp.com/llms.txt
curl -s https://contentfinderwp.com/llms-full.txt
curl -s https://contentfinderwp.com/sitemap-index.xml
```

Browser/search checks:

- Google Rich Results Test for `https://contentfinderwp.com/`
- Schema.org validator for `https://contentfinderwp.com/`
- Google Search Console URL Inspection
- Bing Webmaster Tools URL Inspection
- Search query: `site:contentfinderwp.com`

## Suggested Implementation Order

1. Update `robots.txt` policy.
2. Add `llms-full.txt` and link it from `llms.txt`.
3. Enrich `SoftwareApplication` schema.
4. Build and validate generated output.
5. Deploy.
6. Purge Cloudflare cache.
7. Request Google/Bing re-indexing.
8. Re-run GEO audit after indexing updates.

## Out of Scope for This Plan

- Blog/content cluster strategy.
- Backlink campaign.
- Paid search or social distribution.
- Public PDF/whitepaper asset.
- FAQ schema unless explicitly approved.
- Legal text changes.

