import axios from "axios";

const NEWS_API_URL = `https://newsapi.org/v2/everything?domains=techcrunch.com&pageSize=10&apiKey=${process.env.REACT_APP_NEWS_API_KEY}`;

const NewsApiService = {
  getArticles: async (params) => {
    try {
      const response = await axios.get(NEWS_API_URL, { params });
      return response.data.articles;
    } catch (error) {
      console.error("Error fetching articles from The News API:", error);
      throw error; // Handle errors as needed in your application
    }
  },
};

export default NewsApiService;
