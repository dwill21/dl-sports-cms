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
  async find(sportId) {
    const dt = new Date();
    dt.setDate(dt.getDate() - 7);

    const pastSevenDays = {
      createdAt: {
        $gt: dt.toISOString()
      }
    };

    const filters = sportId ? {
      $and: [
        pastSevenDays,
        {
          sport: {
            id: {
              $eq: sportId
            }
          }
        }
      ]
    } : pastSevenDays;

    const { results } = await super.find({ filters, sort: { createdAt: 'desc' } });
    return await Promise.all(results.map(unfurlEmbeddedMedia));
  }
}));
