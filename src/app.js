import express, { json } from "express";
import { moviesRouter } from "../routes/movies.js";
import { corsMiddleware } from "../middlewares/cors.js";
//LA VERSION DE IMPORT DE JSON LLEGOOOOOOOO
// import movies from './movies.json' with {type: 'json'}; 

// como leer un json en ESModules
// import fs from 'node:fs'
// const movies = JSON.parse(fs.readFileSync('./movies.json', 'utf-8'))

// Como leer un ESModules recomendado por ahora

const app = express();
app.use(json());
app.use(corsMiddleware());
app.disable("x-powered-by");

//Metodos normales: GET/HEAD/POST
//Metodos complejos: PUT/PATCH/DELETE

//Todos los recursos que sean MOVIES se identifican con /movies
app.use('/movies', moviesRouter)


const PORT = process.env.PORT ?? 1234;

app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`);
});
