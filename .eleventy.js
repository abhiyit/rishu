module.exports = function (eleventyConfig) {

  eleventyConfig.addPassthroughCopy("./src/style");

    return {
      dir: {
        input: './src',
        output: './build'
      }
    }
  }

  