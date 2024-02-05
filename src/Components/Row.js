import React, { useState, useEffect } from "react";
import axios from "../key/Axios"; // Import axios instance for API requests
import "../CSS/row.css"; // Importing CSS for styling
import movieTrailer from "movie-trailer"; // Import movie-trailer library to find YouTube trailer links
import YouTube from "react-youtube"; // Import YouTube component to display trailers

function Row({ title, fetchUrl, isLargeRow = false }) {
  // State to store the list of movies
  const [movies, setMovies] = useState([]);
  // Base URL for image path
  const base_url = "https://image.tmdb.org/t/p/original/";
  // State to store the YouTube trailer URL
  const [trailerUrl, setTrailerUrl] = useState("");

  // useEffect hook to fetch data when the component mounts or fetchUrl changes
  useEffect(() => {
    async function fetchData() {
      try {
        // Make an API request using axios
        const request = await axios.get(fetchUrl);
        // Check if the response data is an array and update state
        if (Array.isArray(request.data.results)) {
          setMovies(request.data.results);
        } else {
          console.error("Data received is not an array:", request.data.results);
          setMovies([]); // Resetting movies to an empty array
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setMovies([]); // Resetting movies to an empty array in case of an error
      }
    }

    fetchData();
  }, [fetchUrl]);

  // Function to handle movie clicks
  const handleClick = (movie) => {
    if (trailerUrl) {
      // If a trailer is already playing, close it
      setTrailerUrl("");
    } else {
      // Otherwise, try to find the movie trailer
      movieTrailer(movie?.title || movie?.name || movie?.original_name)
        .then((url) => {
          // Extract the video ID from the URL and set it
          const urlParams = new URLSearchParams(new URL(url).search);
          setTrailerUrl(urlParams.get("v"));
        })
        .catch((error) => console.log(error));
    }
  };

  // YouTube player options
  const opts = {
    height: "390",
    width: "100%",
    playerVars: {
      autoplay: 1, // Autoplay the video when it loads
    },
  };

  console.log(movies); // Debugging: log the movies state

  return (
    <div className="row">
      <h2>{title}</h2> {/* Display the title of the row */}
      <div className="row_posters">
        {/* Map through movies and render each movie poster */}
        {movies.map((movie) => (
          <img
            onClick={() => handleClick(movie)} // Set up click handler for each poster
            key={movie.id}
            className={`row_poster ${isLargeRow && "row_posterLarge"}`}
            src={`${base_url}${
              isLargeRow ? movie.poster_path : movie.backdrop_path
            }`}
            alt={movie.name}
          />
        ))}
      </div>
      {/* Render YouTube component if trailer URL is available */}
      {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
    </div>
  );
}

export default Row;
