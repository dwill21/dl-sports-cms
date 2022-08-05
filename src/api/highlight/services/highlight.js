'use strict';

/**
 * highlight service.
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

const unfurlEmbeddedMedia = async (highlight) => {
  if (highlight && oembedRegex.test(highlight.content)) {
    const [ oembedNode, oembedUrl ] = highlight.content.match(oembedRegex);
    const oembedData = await getOembed(oembedUrl);

    if (oembedData) {
      highlight.content = highlight.content.replace(oembedNode, oembedData.html);
    }
  }

  return highlight;
}

module.exports = createCoreService('api::highlight.highlight', ({ strapi }) => ({
  unfurlEmbeddedMedia,
  async find(args) {
    const { results } = await super.find(args);
    return await Promise.all(results.map(unfurlEmbeddedMedia));
  }
}));
