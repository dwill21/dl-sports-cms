'use strict';

/**
 * article service.
 */

const { createCoreService } = require('@strapi/strapi').factories;
const { unfurlEmbeddedMedia } = require('../../../embedded-media');

module.exports = createCoreService('api::article.article', ({ strapi }) => ({
  async findOne(slug) {
    const { results } = await super.find({
      filters: { slug }
    });

    const article = results?.[0];
    if (article) {
      article.body = await unfurlEmbeddedMedia(article.body);
    }
    return unfurlEmbeddedMedia(article);
  }
}));
