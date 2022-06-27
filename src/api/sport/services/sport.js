'use strict';

/**
 * sport service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::sport.sport', ({ strapi }) => ({
  async findOne(slug) {
    const { results } = await super.find({
      filters: { slug }
    });
    return results?.[0];
  }
}));
