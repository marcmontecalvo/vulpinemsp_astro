const { DateTime } = require("luxon");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");

module.exports = function (eleventyConfig) {
  // Passthroughs (keep your current behavior)
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy({ "src/public": "." });

  // Markdown (Base Blog style)
  const mdLib = markdownIt({ html: true, linkify: true })
    .use(markdownItAnchor, {
      permalink: markdownItAnchor.permalink.ariaHidden({ placement: "after" }),
      level: [1, 2, 3, 4],
      slugify: s => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
    });
  eleventyConfig.setLibrary("md", mdLib);

  // Dates (Base Blog)
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    const dt = dateObj instanceof Date
      ? DateTime.fromJSDate(dateObj, { zone: "utc" })
      : DateTime.fromISO(String(dateObj), { zone: "utc" });
    return dt.toFormat("LLL dd, yyyy");
  });
  eleventyConfig.addFilter("htmlDateString", (dateObj) => {
    const dt = dateObj instanceof Date
      ? DateTime.fromJSDate(dateObj, { zone: "utc" })
      : DateTime.fromISO(String(dateObj), { zone: "utc" });
    return dt.toFormat("yyyy-LL-dd");
  });

  // Tag helpers
  eleventyConfig.addFilter("removeSysTags", (tags = []) => {
    const sys = new Set(["post", "internal"]);
    return (tags || []).filter((t) => !sys.has(t));
  });

  // Collections
  eleventyConfig.addCollection("posts", (collectionApi) => {
    // All markdown files in src/posts/** become blog posts
    return collectionApi.getFilteredByGlob("src/posts/**/*.md").sort((a, b) => b.date - a.date);
  });

  // Related posts (simple tag overlap)
  eleventyConfig.addFilter("relatedPosts", (allPosts = [], currentPage) => {
    if (!currentPage) return [];
    const sys = new Set(["post", "internal"]);
    const my = new Set((currentPage.data?.tags || []).filter((t) => !sys.has(t)));
    if (!my.size) return [];
    const scored = [];
    for (const p of allPosts) {
      if (!p || p.url === currentPage.url) continue;
      const pTags = (p.data?.tags || []).filter((t) => !sys.has(t));
      let overlap = 0; for (const t of pTags) if (my.has(t)) overlap++;
      if (overlap > 0) scored.push({ post: p, overlap });
    }
    scored.sort((a, b) => b.overlap - a.overlap);
    return scored.slice(0, 3).map(x => x.post);
  });

  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "dist" },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    templateFormats: ["njk", "md", "html"],
  };
};