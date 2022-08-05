'use strict';

const articleUid = 'api::article.article';
const sportUid = 'api::sport.sport';
const highlightUid = 'api::highlight.highlight';

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }) {
    const { toEntityResponse, toEntityResponseCollection } = strapi.plugin('graphql').service('format').returnTypes;
    const extensionService = strapi.plugin('graphql').service('extension');
    extensionService.shadowCRUD(articleUid).disableAction('findOne');

    extensionService.use({
      typeDefs: `
        type Query {
          article(slug: String!): ArticleEntityResponse
          sport(slug: String!): SportEntityResponse
        }
      `,
      resolvers: {
        Query: {
          article: {
            async resolve(parent, args, context) {
              const { slug } = args;
              const article = await strapi.service(articleUid).findOne(slug);
              return toEntityResponse(article, { args, resourceUID: articleUid });
            },
          },
          sport: {
            async resolve(parent, args, context) {
              const { slug } = args;
              const sport = await strapi.service(sportUid).findOne(slug);
              return toEntityResponse(sport, { args, resourceUID: sportUid });
            }
          },
          highlights: {
            async resolve(parents, args, context) {
              const results = await strapi.service(highlightUid).find(args);
              return toEntityResponseCollection(results, { args, resourceUID: highlightUid })
            }
          }
        },
        HighlightRelationResponseCollection: {
          data: {
            async resolve(parent, args, context) {
              return await Promise.all(parent.nodes.map(strapi.service(highlightUid).unfurlEmbeddedMedia));
            }
          }
        }
      },
      resolversConfig: {
        'Query.article': {
          auth: {
            scope: [articleUid + '.findOne']
          }
        },
        'Query.sport': {
          auth: {
            scope: [sportUid + '.findOne']
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
