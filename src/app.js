const express = require("express");
const crypto = require("node:crypto");
const movies = require("./movies.json");
const cors = require("cors");

const { validateMovie, validatePartialMovie } = require("../schemas/movies");

const app = express();
app.use(express.json());
app.use(cors({
  origin: (origin, callback) => {
    const ACCEPTED_ORIGINS = [
      "http://localhost:8080",
      "http://localhost:1234",
      "https://movies.com",
      "https://midu.dev",
    ];

    if (ACCEPTED_ORIGINS.includes(origin)) {
      return callback(null, true)
    }

    if (!origin) {
      return callback(null, true)
    }

    return callback(new Error('Not Allowed by CORS'))
  }
}))
app.disable("x-powered-by");

//Metodos normales: GET/HEAD/POST
//Metodos complejos: PUT/PATCH/DELETE



//Todos los recursos que sean MOVIES se identifican con /movies
//GET
app.get("/movies", (req, res) => {
  const { genre } = req.query;
  if (genre) {
    const filteredMovies = movies.filter((movie) =>
      movie.genre.some((g) => g.toLowerCase() === genre.toLowerCase())
    );
    return res.json(filteredMovies);
  }
  res.json(movies);
});

//GET ID
app.get("/movies/:id", (req, res) => {
  const { id } = req.params;
  const movie = movies.find((movie) => movie.id === id);
  if (movie) return res.json(movie);
  res.status(404).json({ message: "Movie not found" });
});

//POST
app.post("/movies", (req, res) => {
  const result = validateMovie(req.body);

  if (result.error) {
    return res.status(400).json({ error: JSON.parse(result.error.message) });
  }

  const newMovie = {
    id: crypto.randomUUID(), //uuid v4
    ...result.data,
  };
  //Esto no seria REST, porque estamos guardando
  //el estado de la aplicacion en memoria
  movies.push(newMovie);

  res.status(201).json(newMovie);
});

//DELETE
app.delete("/movies/:id", (req, res) => {
  const { id } = req.params;
  const movieIndex = movies.findIndex((movie) => movie.id === id);

  if (movieIndex === -1) {
    return res.status(404).json({ message: "Movie not found" });
  }

  movies.splice(movieIndex, 1)
  
  return res.json({message: 'Movie deleted'})
});

//PATCH
app.patch("/movies/:id", (req, res) => {
  const result = validatePartialMovie(req.body);

  if (!result.success) {
    return res.status(400).json({ error: JSON.parse(result.error.message) });
  }

  const { id } = req.params;
  const movieIndex = movies.findIndex((movie) => movie.id === id);

  if (movieIndex === -1) {
    return res.status(404).json({ message: "Movie not found" });
  }

  const updateMovie = {
    ...movies[movieIndex],
    ...result.data,
  };

  return res.json(updateMovie);
});

const PORT = process.env.PORT ?? 1234;

app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`);
});
