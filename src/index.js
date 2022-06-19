'use strict';

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }) {
    const extensionService = strapi.plugin('graphql').service('extension');
    const { toEntityResponse } = strapi.plugin('graphql').service('format').returnTypes;

    extensionService.use({
      resolvers: {
        Query: {
          article: {
            async resolve(parent, args, context) {
              const { id } = args;
              const result = await strapi.service('api::article.article').findOne(id);
              return toEntityResponse(result, { args: {}, resourceUID: 'api::article.article' });
            },
          },
        },
      },
    });
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap(/*{ strapi }*/) {},
};
