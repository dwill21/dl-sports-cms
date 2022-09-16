const axios = require("axios");
const matchAll = require('string.prototype.matchall');

const oembedRegex = /\<oembed url\=\"(\S+)\"\>\<\/oembed\>/g;

const getEmbeddedMedia = async (url) => {
  try {
    strapi.log.info("Calling Iframely for URL: %s", url);
    const response = await axios.get(`${process.env.IFRAMELY_URL}/oembed?url=${url}`);
    strapi.log.info("Iframely response: %s", response);
    return response.data;
  } catch (err) {
    strapi.log.error("Error during Iframely call: %s", err);
    return null;
  }
}

const unfurlEmbeddedMedia = async (html) => {
  const titles = [];
  const descriptions = [];

  if (html) {
    const matches = matchAll(html, oembedRegex);

    for (const [oembedNode, oembedUrl] of matches) {
      const oembedData = await getEmbeddedMedia(oembedUrl);

      if (oembedData) {
        html = html.replace(oembedNode, oembedData.html);
        titles.push(oembedData.title);
        descriptions.push(oembedData.description);
      }
    }
  }

  return {
    text: html,
    mediaTitles: titles.join("\n"),
    mediaDescriptions: descriptions.join("\n")
  };
}

module.exports = {
  unfurlEmbeddedMedia
}
