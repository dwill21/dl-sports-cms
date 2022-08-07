const axios = require("axios");
const matchAll = require('string.prototype.matchall');

const oembedRegex = /\<oembed url\=\"(\S+)\"\>\<\/oembed\>/g;

const getEmbeddedMedia = async (url) => {
  try {
    const response = await axios.get(`${process.env.IFRAMELY_URL}/oembed?url=${url}`);
    return response.data;
  } catch (err) {
    return null;
  }
}

const unfurlEmbeddedMedia = async (html) => {
  if (html) {
    const matches = matchAll(html, oembedRegex);
    for (const [oembedNode, oembedUrl] of matches) {
      const oembedData = await getEmbeddedMedia(oembedUrl);
      if (oembedData) {
        html = html.replace(oembedNode, oembedData.html);
      }
    }
  }

  return html;
}

module.exports = {
  unfurlEmbeddedMedia
}
