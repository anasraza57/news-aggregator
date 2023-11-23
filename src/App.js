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
  Button,
} from "@mui/material";

const App = () => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSources, setSelectedSources] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [autherOptions, setAutherOptions] = useState([]);
  const [selectedAuthors, setSelectedAuthors] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const params = {};

        if (searchTerm) {
          params.q = searchTerm;
        }
        const newsApiResults = await NewsApiService.getArticles(params);
        const guardianResults = await TheGuardianService.getArticles(params);
        // const newYorkTimesResults = await NewYorkTimesService.getArticles({
        //   q: searchTerm,
        // });

        const mergedResults = [
          ...newsApiResults.map((article) => ({
            title: article.title,
            content: article.description,
            url: article.url,
            contentBy: article.author,
            source: "News API",
          })),
          ...guardianResults.map((article) => ({
            title: article.webTitle,
            content: article.webUrl,
            url: article.webUrl,
            contentBy: article.sectionName,
            source: "The Guardian",
          })),
          // ...newYorkTimesResults.map((article) => ({
          //   title: article.headline.main,
          //   content: article.abstract,
          //   url: article.web_url,
          // })),
        ];
        setArticles(mergedResults);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };
    fetchArticles();
  }, [searchTerm]);

  useEffect(() => {
    const updatedFilteredArticles = articles.filter((article) => {
      const matchesSource =
        selectedSources.length === 0 ||
        selectedSources.includes(article.source);
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(article.contentBy);
      const matchesAuthor =
        selectedAuthors.length === 0 ||
        selectedAuthors.includes(article.contentBy);

      return matchesSource && matchesCategory && matchesAuthor;
    });

    setFilteredArticles(updatedFilteredArticles);

    const authOptions = [];
    const catOptions = [];

    updatedFilteredArticles.forEach((article) => {
      if (article.source === "News API") {
        if (
          !authOptions.some((option) => option.contentBy === article.contentBy)
        ) {
          authOptions.push(article);
        }
      } else if (article.source === "The Guardian") {
        if (
          !catOptions.some((option) => option.contentBy === article.contentBy)
        ) {
          catOptions.push(article);
        }
      }
    });

    setAutherOptions(authOptions);
    setCategoryOptions(catOptions);
  }, [articles, selectedSources, selectedCategories, selectedAuthors]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSourceChange = (e) => {
    const source = e.target.value;
    setSelectedSources(source);
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategories(category);
  };

  const handleAuthorChange = (e) => {
    const author = e.target.value;
    setSelectedAuthors(author);
  };

  const clearFiltersHandler = () => {
    setSearchTerm("");
    setSelectedSources([]);
    setSelectedCategories([]);
    setSelectedAuthors([]);
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
            >
              <MenuItem value="News API">News API</MenuItem>
              <MenuItem value="New York Times">New York Times</MenuItem>
              <MenuItem value="The Guardian">The Guardian</MenuItem>
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
            >
              {categoryOptions && categoryOptions.length > 0 ? (
                categoryOptions
                  .sort((a, b) => a.contentBy.localeCompare(b.contentBy))
                  .map((cat, index) => (
                    <MenuItem key={index} value={cat.contentBy}>
                      {cat.contentBy}
                    </MenuItem>
                  ))
              ) : (
                <MenuItem value="none">No Option</MenuItem>
              )}
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
            >
              {autherOptions && autherOptions.length > 0 ? (
                autherOptions
                  .sort((a, b) => a.contentBy.localeCompare(b.contentBy))
                  .map((auther, index) => (
                    <MenuItem key={index} value={auther.contentBy}>
                      {auther.contentBy}
                    </MenuItem>
                  ))
              ) : (
                <MenuItem value="none">No Option</MenuItem>
              )}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sx={{ display: "flex", justifyContent: "end" }}>
          <Button onClick={clearFiltersHandler} variant="contained">
            Clear Filters
          </Button>
        </Grid>
      </Grid>
      <ArticleList articles={filteredArticles} />
    </Container>
  );
};

export default App;
