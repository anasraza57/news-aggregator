# News Aggregator React App - Docker Setup

Welcome to the News Aggregator React app! This project is a dynamic and customizable news aggregator that pulls articles from various reliable sources, offering users a comprehensive and personalized news-viewing experience.

## Overview

The News Aggregator React app leverages React.js to create a user-friendly interface for browsing articles. Users can easily search for news by keyword, filter results by date, category, and source, and personalize their news feed by selecting preferred sources, categories, and authors.

## Features

- **Article Search and Filtering:** Effortlessly search for articles by keyword and apply filters based on date, category, and source.
- **Personalized News Feed:** Tailor your news feed by choosing preferred sources, categories, and authors.
- **Mobile-Responsive Design:** Enjoy a seamless news-reading experience on both desktop and mobile devices.

## Prerequisites

[Docker](https://www.docker.com/get-started/) installed on your machine.

## Build Docker Image

1. Open a terminal and navigate to the root directory of the News Aggregator React app.

   ```bash
   cd path/to/news-aggregator
   ```

   This command creates a Docker image named `news-aggregator` based on the configuration specified in the Dockerfile.

2. Build the Docker image using the provided Dockerfile.

   ```bash
   docker build -t news-aggregator .
   ```

   This command creates a Docker image named news-aggregator based on the configuration specified in the Dockerfile.

## Run Docker Container

1. Once the build is complete, you can run the Docker container.

   ```bash
   docker run -p 3000:3000 news-aggregator
   ```

   - The `-p` flag maps port 3000 on your host machine to port 3000 in the Docker container.

2. Open your web browser and navigate to http://localhost:3000 to access the News Aggregator React app.

## Stopping the Docker Container

1. To stop the Docker container, open a new terminal window and list the running containers.

   ```bash
   docker ps
   ```

2. Identify the Container ID or Name associated with the news-aggregator image.
3. Stop the container using the following command (replace `<container_id_or_name>` with the actual ID or Name).

   ```
   docker stop <container_id_or_name>
   ```

   The News Aggregator React app is now stopped, and you can close the terminal.

## Additional Notes

- If you encounter any issues or want to explore advanced Docker options, refer to the [Docker documentation](https://docs.docker.com/).

- Make sure to replace placeholder values such as `path/to/news-aggregator` with the actual path to your News Aggregator React app.
