'use strict';

/**
 * article service.
 */

const { createCoreService } = require('@strapi/strapi').factories;
const { extract } = require("oembed-parser");

const oembedRegex = /\<oembed url\=\"(.*)\"\>\<\/oembed\>/;

const getOembed = async (url) => {
  try {
    return await extract(url);
  } catch (err) {
    return null;
  }
}

module.exports = createCoreService('api::article.article', ({ strapi }) => ({
  async findOne(...args) {
    const article = await super.findOne(args);

    if (oembedRegex.test(article.body)) {
      const [ oembedNode, oembedUrl ] = article.body.match(oembedRegex);
      const oembedData = await getOembed(oembedUrl);

      if (oembedData) {
        article.body = article.body.replace(oembedNode, oembedData.html);
      }
    }

    return article;
  }
}));
