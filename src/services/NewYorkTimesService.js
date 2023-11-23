import axios from "axios";

const NYT_API_URL = `https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=${process.env.REACT_APP_NEW_YORK_TIMES_API_KEY}`;

const NewYorkTimesService = {
  getArticles: async (params) => {
    try {
      const response = await axios.get(NYT_API_URL, { params });

      return response.data.response.docs;
    } catch (error) {
      console.error("Error fetching articles from New York Times:", error);
      throw error; // Handle errors as needed in your application
    }
  },
};

export default NewYorkTimesService;
