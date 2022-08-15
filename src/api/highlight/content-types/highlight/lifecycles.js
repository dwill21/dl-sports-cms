const { unfurlEmbeddedMedia } = require("../../../../embedded-media");

module.exports = {
  async beforeCreate(event) {
    const data = event.params.data;
    const media = await unfurlEmbeddedMedia(data.content);
    data.mediaTitles = media.mediaTitles;
    data.mediaDescriptions = media.mediaDescriptions;
  },

  async beforeUpdate(event) {
    const data = event.params.data;
    const media = await unfurlEmbeddedMedia(data.content);
    data.mediaTitles = media.mediaTitles;
    data.mediaDescriptions = media.mediaDescriptions;
  }
};
