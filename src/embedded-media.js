const axios = require("axios");

const oembedRegex = /\<oembed url\=\"(.*)\"\>\<\/oembed\>/;

const getEmbeddedMedia = async (url) => {
  try {
    const response = await axios.get(`${process.env.IFRAMELY_URL}/oembed?url=${url}`);
    return response.data;
  } catch (err) {
    return null;
  }
}

const unfurlEmbeddedMedia = async (html) => {
  if (html && oembedRegex.test(html)) {
    const [ oembedNode, oembedUrl ] = html.match(oembedRegex);
    const oembedData = await getEmbeddedMedia(oembedUrl);

    if (oembedData) {
      html = html.replace(oembedNode, oembedData.html);
    }
  }

  return html;
}

module.exports = {
  unfurlEmbeddedMedia
}
