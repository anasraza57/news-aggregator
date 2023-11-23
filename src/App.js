import React, { useState, useEffect } from "react";
import ArticleList from "./components/ArticleList";
import NewsApiService from "./services/NewsApiService";
import TheGuardianService from "./services/TheGuardianService";
import NewYorkTimesService from "./services/NewYorkTimesService";
import {
  Container,
  Typography,
  TextField,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

const App = () => {
  const [articles, setArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSources, setSelectedSources] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedAuthors, setSelectedAuthors] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const newsApiResults = await NewsApiService.getArticles({
          q: searchTerm,
          categories: selectedCategories.join(","),
          authors: selectedAuthors.join(","),
        });
        const guardianResults = await TheGuardianService.getArticles({
          q: searchTerm,
        });
        // const newYorkTimesResults = await NewYorkTimesService.getArticles({
        //   q: searchTerm,
        // });

        const mergedArticles = [];

        newsApiResults.forEach((article) => {
          mergedArticles.push({
            title: article.title,
            content: article.description,
            url: article.url,
            contentBy: article.author,
          });
        });

        guardianResults.forEach((article) => {
          mergedArticles.push({
            title: article.webTitle,
            content: article.webUrl,
            url: article.webUrl,
            contentBy: article.sectionName,
          });
        });

        // const mergedResults = [
        //   ...newsApiResults.map((article) => ({
        //     title: article.title,
        //     content: article.description,
        //     url: article.url,
        //   })),
        //   ...guardianResults.map((article) => ({
        //     title: article.webTitle,
        //     content: article.webUrl,
        //     url: article.webUrl,
        //   })),
        // ...newYorkTimesResults.map((article) => ({
        //   title: article.headline.main,
        //   content: article.abstract,
        //   url: article.web_url,
        // })),
        // ];

        setArticles(mergedArticles);
        setArticles(mergedArticles);
      } catch (error) {
        console.error("Error fetching articles:", error);
        // Handle errors as needed in your application
      }
    };

    fetchArticles();
  }, [searchTerm, selectedSources, selectedCategories, selectedAuthors]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSourceChange = (e) => {
    const source = e.target.value;
    setSelectedSources((prevSelected) =>
      prevSelected.includes(source)
        ? prevSelected.filter((s) => s !== source)
        : [...prevSelected, source]
    );
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(category)
        ? prevSelected.filter((c) => c !== category)
        : [...prevSelected, category]
    );
  };

  const handleAuthorChange = (e) => {
    const author = e.target.value;
    setSelectedAuthors((prevSelected) =>
      prevSelected.includes(author)
        ? prevSelected.filter((a) => a !== author)
        : [...prevSelected, author]
    );
  };

  return (
    <Container maxWidth="md" style={{ marginTop: "20px" }}>
      <Typography
        style={{ color: "#3c4142", fontWeight: "bold" }}
        variant="h4"
        align="center"
        gutterBottom
      >
        News Aggregator
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12}>
          <TextField
            label="Search"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={handleSearch}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel id="sources-label">Sources</InputLabel>
            <Select
              label="Sources"
              labelId="sources-label"
              multiple
              value={selectedSources}
              onChange={handleSourceChange}
              variant="outlined"
              renderValue={(selected) => selected.join(", ")}
            >
              <MenuItem value="source1">Source 1</MenuItem>
              <MenuItem value="source2">Source 2</MenuItem>
              {/* Add more source options based on your available sources */}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel id="categories-label">Categories</InputLabel>
            <Select
              label="Categories"
              labelId="categories-label"
              multiple
              value={selectedCategories}
              onChange={handleCategoryChange}
              variant="outlined"
              renderValue={(selected) => selected.join(", ")}
            >
              <MenuItem value="category1">Category 1</MenuItem>
              <MenuItem value="category2">Category 2</MenuItem>
              {/* Add more category options based on your available categories */}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel id="authors-label">Authors</InputLabel>
            <Select
              label="Authors"
              labelId="authors-label"
              multiple
              value={selectedAuthors}
              onChange={handleAuthorChange}
              variant="outlined"
              renderValue={(selected) => selected.join(", ")}
            >
              <MenuItem value="author1">Author 1</MenuItem>
              <MenuItem value="author2">Author 2</MenuItem>
              {/* Add more author options based on your available authors */}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <ArticleList articles={articles} />
    </Container>
  );
};

export default App;
