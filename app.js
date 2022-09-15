const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "moviesData.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

//API 1

app.get("/movies/", async (request, response) => {
  const movieTableQuery = `
    SELECT * FROM  movie;`;
  const listOfMovies = await db.all(movieTableQuery);
  let result = [];
  const getTheData = (eachItem) => {
    return {
      movieName: eachItem.movie_name,
    };
  };

  for (let eachItem of listOfMovies) {
    let item = getTheData(eachItem);
    result.push(item);
  }

  response.send(result);
});

//API 2

app.post("/movies/", (request, response) => {
  const movieDetails = request.body;
  const { directorId, movieName, leadActor } = movieDetails;
  const postMovieQuery = `
INSERT INTO movie (director_id, movie_name, lead_actor)
VALUES (
    ${directorId}, 
    '${movieName}',
    '${leadActor}'
);`;

  const dbResponse = db.run(postMovieQuery);
  movieId = dbResponse.lastID;
  response.send("Movie Successfully Added");
});

// API 3

app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;

  const oneMovieQuery = `
  SELECT * FROM movie
  WHERE movie_id = ${movieId};`;

  const eachMovie = await db.get(oneMovieQuery);

  response.send(eachMovie);
});
