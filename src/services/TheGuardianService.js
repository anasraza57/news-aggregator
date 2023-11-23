import axios from "axios";

const THE_GUARDIAN_API_URL = `https://content.guardianapis.com/search?api-key=${process.env.REACT_APP_THE_GUARDIAN_API_KEY}`;

const TheGuardianService = {
  getArticles: async (params) => {
    try {
      const response = await axios.get(THE_GUARDIAN_API_URL, { params });

      return response.data.response.results;
    } catch (error) {
      console.error("Error fetching articles from The Guardian:", error);
      throw error; // Handle errors as needed in your application
    }
  },
};

export default TheGuardianService;
