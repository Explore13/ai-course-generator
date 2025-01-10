const axios = require("axios");

const YOUTUBE_BASE_URL = "https://www.googleapis.com/youtube/v3";

const getVideos = async (query) => {
  const params = {
    part: "snippet",
    maxResults: 3,
    key: process.env.NEXT_PUBLIC_YOUTUBE_API_KEY,
    q: query,
    type: "video",
    videoEmbeddable: true,
    relevanceLanguage: "en",
  };

  const result = await axios.get(YOUTUBE_BASE_URL + "/search", { params });

  return result.data.items;
};

export default getVideos;
