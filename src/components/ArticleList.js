import React from "react";
import {
  Card,
  Box,
  Typography,
  CardContent,
  CardActions,
  Button,
  Grid,
  Skeleton,
} from "@mui/material";

const ArticleList = ({ articles, isFetchingArticles }) => {
  return (
    <Grid container spacing={2} py={2}>
      {!isFetchingArticles ? (
        articles && articles.length > 0 ? (
          articles.map((article) => (
            <Grid item xs={12} key={article.title}>
              <Box>
                <Card variant="outlined" style={{ height: "100%" }}>
                  <CardContent>
                    <Typography
                      className="art-heading"
                      variant="h5"
                      component="a"
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {article.title}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                      {article.contentBy}
                    </Typography>
                    <Typography variant="body2">{article.content}</Typography>
                  </CardContent>
                  <CardActions>
                    <Button href={article.url} target="_blank" size="small">
                      Read More
                    </Button>
                  </CardActions>
                </Card>
              </Box>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Box>
              <Card
                variant="outlined"
                style={{ height: "100%", textAlign: "center" }}
              >
                <CardContent>
                  <Typography color="text.secondary">No Data</Typography>
                </CardContent>
              </Card>
            </Box>
          </Grid>
        )
      ) : (
        <>
          <Grid item xs={12}>
            <Skeleton variant="rectangular" height={118} />
          </Grid>
          <Grid item xs={12}>
            <Skeleton variant="rectangular" height={118} />
          </Grid>
          <Grid item xs={12}>
            <Skeleton variant="rectangular" height={118} />
          </Grid>
          <Grid item xs={12}>
            <Skeleton variant="rectangular" height={118} />
          </Grid>
          <Grid item xs={12}>
            <Skeleton variant="rectangular" height={118} />
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default ArticleList;
