import express, { Request, Response } from "express";
import { AppDataSource } from "../database/database";
import { bookIdValidation, bookValidation, updateBookValidation } from "./validators/book-validator";
import { generateValidationErrorMessage } from "./validators/generate-validation-message";
import { BookUsecase } from "../domain/book-usecase";
import { Collection } from "../database/entities/collection";

export const initRoutes = (app:express.Express) => {

    // Lecture de la base -> app.get
    app.get("/livres", async (req: Request, res: Response) => {
    
    // Validation
    const validation = bookValidation.validate(req.query);

    if(validation.error){
        res.status(400).send(generateValidationErrorMessage(validation.error.details))
        return
    }
    const bookRequest = validation.value;
    let limit = 20
    if (bookRequest.limit) {
        limit = bookRequest.limit
    }
    const page = bookRequest.page ?? 1

    try {
        const bookUsecase = new BookUsecase(AppDataSource);
        const listOfBooks = await bookUsecase.listeBooks({ ...bookRequest, page, limit })
        res.status(200).send(listOfBooks)
    } catch (error) {
        console.log(error)
        res.status(500).send({ error: "Internal error" })
    }

    // En cas de problème dans la validation

    // Création userCase

    // Retour usercase

    // Renvoie de la réponse
    
    })
    // Ajout de livre -> app.post

    app.post("/livres", async (req: Request, res: Response) => {
        const validation = bookValidation.validate(req.body)

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const bookRequest = validation.value
        const bookRepo = AppDataSource.getRepository(Collection)
        try {

            const bookCreated = await bookRepo.save(
                bookRequest
            )
            res.status(201).send(bookCreated)
        } catch (error) {
            res.status(500).send({ error: "Internal error" })
        }
    })
    // Mise à jour de livre -> app.patch

    app.patch("/livres/:id", async (req: Request, res: Response) => {

        const validation = updateBookValidation.validate({ ...req.params, ...req.body })

        if (validation.error) {
            res.status(400).send(generateValidationErrorMessage(validation.error.details))
            return
        }

        const updateBookRequest = validation.value

        try {
            const bookUsecase = new BookUsecase(AppDataSource);
            const updatedBook = await bookUsecase.updateBooks(updateBookRequest.id, { ...updateBookRequest })
            if (updatedBook === null) {
                res.status(404).send({ "error": `product ${updateBookRequest.id} not found` })
                return
            }
            res.status(200).send(updatedBook)
        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })

    // Suppression de livre -> app.delete
    app.delete("/livres/:id", async (req: Request, res: Response) => {
        try {
            const validationResult = bookIdValidation.validate(req.params)

            if (validationResult.error) {
                res.status(400).send(generateValidationErrorMessage(validationResult.error.details))
                return
            }
            const bookId = validationResult.value

            const productRepository = AppDataSource.getRepository(Collection)
            const product = await productRepository.findOneBy({ id: bookId.id })
            if (product === null) {
                res.status(404).send({ "error": `product ${bookId.id} not found` })
                return
            }

            const productDeleted = await productRepository.remove(product)
            res.status(200).send(productDeleted)
        } catch (error) {
            console.log(error)
            res.status(500).send({ error: "Internal error" })
        }
    })


}