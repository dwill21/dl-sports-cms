'use strict';

/**
 * highlight service.
 */

const { createCoreService } = require('@strapi/strapi').factories;
const { unfurlEmbeddedMedia } = require('../../../embedded-media');

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
    for (const highlight of results) {
      highlight.content = await unfurlEmbeddedMedia(highlight.content);
    }
    return results;
  }
}));
