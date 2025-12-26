import { Router } from "express";
import { MovieController } from "../controllers/movies.js";

export const moviesRouter = Router();

//GET: obtener todos los movies
moviesRouter.get("/", MovieController.getAll);

//GET: obtener un movie por ID
moviesRouter.get("/:id", MovieController.getById);

//POST: crear un objeto
moviesRouter.post("/", MovieController.create);

//DELETE: eliminar o borrar una movie
moviesRouter.delete("/:id", MovieController.delete);

//PATCH: Actualizar solo una parte de una movie
moviesRouter.patch("/:id", MovieController.update);