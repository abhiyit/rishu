const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");

const markdownItConfig = {
  html: true,
  breaks: true,
  linkify: true
};
const markdownItAnchorConfig = {
  permalink: true,
  permalinkClass: "bookmark",
  permalinkSymbol: "#"
};

const markdownLib = markdownIt(markdownItConfig).use(
  markdownItAnchor,
  markdownItAnchorConfig
);

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.setLibrary("md", markdownLib);

  eleventyConfig.addLayoutAlias("default", "layouts/default.html");
  eleventyConfig.addLayoutAlias("blog", "layouts/blog.html");
  eleventyConfig.addLayoutAlias("project", "layouts/project.html");

  // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
  eleventyConfig.addFilter("readableDate", dateObj => {
    const d = new Date(dateObj);
    return d.toDateString().substr(4);
  });

  // only content in the `posts/` directory
  eleventyConfig.addCollection("projects", function (collection) {
    return collection
      .getFilteredByGlob("./projects/*")
      .sort(function (a, b) {
        return a.date - b.date;
      })
      .reverse();
  });

 
  eleventyConfig.addPassthroughCopy('./src/style/');
  eleventyConfig.addPassthroughCopy('./src/js/');
  eleventyConfig.addPassthroughCopy('./src/img/');
  eleventyConfig.addPassthroughCopy("favicon.ico");
  return {
    dir: {
      input: './src',
      output: './build'
    }
  };
};