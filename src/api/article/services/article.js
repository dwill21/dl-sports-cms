'use strict';

/**
 * article service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::article.article', ({ strapi }) => ({
  async findOne(...args) {
    const article = await super.findOne(args);
    console.log(article);
    return article;
  }
}));
