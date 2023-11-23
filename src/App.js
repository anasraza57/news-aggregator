import React, { useState, useEffect } from "react";
import ArticleList from "./components/ArticleList";
import NewsApiService from "./services/NewsApiService";
import TheGuardianService from "./services/TheGuardianService";
import NewYorkTimesService from "./services/NewYorkTimesService";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
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
import format from "date-fns/format";

const App = () => {
  const [isFetchingArticles, setIsFetchingArticles] = useState(false);
  const [applyFilters, setApplyFilters] = useState(false);
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSources, setSelectedSources] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [autherOptions, setAutherOptions] = useState([]);
  const [selectedAuthors, setSelectedAuthors] = useState([]);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [showToError, setShowToError] = useState(false);

  useEffect(() => {
    fetchArticles();
  }, []);

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
      if (article.source === "News API" || article.source === "nyt") {
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

  useEffect(() => {
    if (!fromDate || !toDate) {
      return;
    }
    if (toDate < fromDate) {
      setShowToError(true);
    } else {
      setShowToError(false);
      fetchArticles("", fromDate, toDate);
    }
  }, [fromDate, toDate]);

  const fetchArticles = async (searchText, fromDate, toDate) => {
    try {
      setIsFetchingArticles(true);
      const params = {};

      if (searchText) {
        params.q = searchText;
      }

      if (fromDate && toDate) {
        // For NewsApiService, add from and to parameters
        params.from = format(new Date(fromDate), "yyyy-MM-dd");
        params.to = format(new Date(toDate), "yyyy-MM-dd");

        // For TheGuardianService, add from-date and to-date parameters
        params["from-date"] = format(new Date(fromDate), "yyyy-MM-dd");
        params["to-date"] = format(new Date(toDate), "yyyy-MM-dd");

        // For NewYorkTimesService, add pub_date parameter
        params.pub_date = format(new Date(fromDate), "yyyy-MM-dd");
      }

      const newsApiResults = await NewsApiService.getArticles(params);
      const guardianResults = await TheGuardianService.getArticles(params);
      const newYorkTimesResults = await NewYorkTimesService.getArticles(params);

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
        ...newYorkTimesResults.map((article) => ({
          title: article.headline.main,
          content: article.abstract,
          url: article.web_url,
          contentBy: article.byline?.person[0]?.firstname
            ? `${article.byline.person[0].firstname} ${article.byline.person[0].lastname}`
            : "",
          source: "nyt",
        })),
      ];
      setArticles(mergedResults);
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setIsFetchingArticles(false);
    }
  };

  const handleSearchBtn = () => {
    fetchArticles(searchTerm);
  };

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
    setApplyFilters(false);
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
        <Grid item xs={12} sm={10}>
          <TextField
            label="Search"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={handleSearch}
          />
        </Grid>
        <Grid
          item
          xs={12}
          sm={2}
          sx={{ display: "flex", justifyContent: "end" }}
        >
          <Button onClick={handleSearchBtn} variant="contained">
            Search
          </Button>
        </Grid>
        {applyFilters ? (
          <>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  sx={{ width: "100%" }}
                  label="From"
                  value={fromDate}
                  onChange={(newValue) => setFromDate(newValue)}
                  format="YYYY/MM/DD"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  sx={{ width: "100%" }}
                  label="To"
                  value={toDate}
                  onChange={(newValue) => setToDate(newValue)}
                  format="YYYY/MM/DD"
                />
                {showToError && (
                  <Typography color={"red"} variant="subtitle2">
                    *The To value cannot precede the From value.
                  </Typography>
                )}
              </Grid>
            </LocalizationProvider>
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
                      .sort((a, b) => a.contentBy?.localeCompare(b.contentBy))
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
                      .sort((a, b) => a.contentBy?.localeCompare(b.contentBy))
                      .map(
                        (auther, index) =>
                          auther.contentBy && (
                            <MenuItem key={index} value={auther.contentBy}>
                              {auther.contentBy}
                            </MenuItem>
                          )
                      )
                  ) : (
                    <MenuItem value="none">No Option</MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button onClick={clearFiltersHandler} variant="contained">
                Clear Filters
              </Button>
            </Grid>
          </>
        ) : (
          <Grid item xs={12}>
            <Button onClick={() => setApplyFilters(true)} variant="contained">
              Show Filters
            </Button>
          </Grid>
        )}
      </Grid>
      <ArticleList
        articles={filteredArticles}
        isFetchingArticles={isFetchingArticles}
      />
    </Container>
  );
};

export default App;
