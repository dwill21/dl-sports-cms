'use strict';

const articleUid = 'api::article.article';

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }) {
    const { toEntityResponse } = strapi.plugin('graphql').service('format').returnTypes;
    const extensionService = strapi.plugin('graphql').service('extension');
    extensionService.shadowCRUD(articleUid).disableAction('findOne');

    extensionService.use({
      typeDefs: `
        type Query {
          article(slug: String!): ArticleEntityResponse
        }
      `,
      resolvers: {
        Query: {
          article: {
            async resolve(parent, args, context) {
              const { slug } = args;
              const article = await strapi.service(articleUid).findOne(slug);
              return toEntityResponse(article, { args: {}, resourceUID: articleUid });
            },
          },
        },
      },
      resolversConfig: {
        'Query.article': {
          auth: {
            scope: [articleUid + '.findOne']
          }
        },
      }
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
