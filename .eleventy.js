const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const CleanCSS = require("clean-css");

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

  eleventyConfig.addFilter("cssmin", function(code) {
    return new CleanCSS({}).minify(code).styles;
  });

  eleventyConfig.setLibrary("md", markdownLib);

  eleventyConfig.addLayoutAlias("default", "layouts/default.html");
  eleventyConfig.addLayoutAlias("blog", "layouts/blog.html");
  eleventyConfig.addLayoutAlias("project", "layouts/project.html");

  // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
  eleventyConfig.addFilter("readableDate", dateObj => {
    const d = new Date(dateObj);
    return d.toDateString().substr(4);
  });


  // Content in projects which are featured
  eleventyConfig.addCollection('featuredProjects', collection => {
    return collection.getFilteredByGlob('./src/projects/*.md')
      .filter( featuredProject => featuredProject.data.featured_project && featuredProject.data.published)
      .sort((a,b) => {
        return a.data.post_weight - b.data.post_weight;
      });
   });

   // All projects
  eleventyConfig.addCollection('allProjects', collection => {
    return collection.getFilteredByGlob('./src/projects/*.md')
      .filter( project => project.data.published ? true : false)
      .sort((a,b) => {
        return a.date - b.date;
      })
      .reverse();
   });

   // Content in blog which are featured
   eleventyConfig.addCollection('featuredPosts', collection => {
    return collection.getFilteredByGlob('./src/posts/*.md')
      .filter( featuredPost => featuredPost.data.featured_project && featuredPost.data.published)
      .sort((a,b) => {
        return a.date - b.date;
      })
      .reverse();
   });

   // All Blog
   eleventyConfig.addCollection('allPosts', collection => {
    return collection.getFilteredByGlob('./src/posts/*.md')
      .filter( post =>  post.data.published ? true : false)
      .sort((a,b) => {
        return a.date - b.date;
      })
      .reverse();
   });

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