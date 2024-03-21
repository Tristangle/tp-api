import Joi from "joi"

export const bookValidation = Joi.object<BookRequest>({
    // Champs nécessaires
    id: Joi.number().optional,

    name: Joi.string().required(),

    tomeNumber: Joi.number().optional(),

    author: Joi.string().optional(),

    price: Joi.number().optional(),

    review: Joi.number().optional()

}).options({abortEarly:false})

export interface BookRequest {
    page: number
    limit: any
    id: number,
    name: string,
    tomeNumber: number,
    author: string,
    price: number,
    review: number
}

export const listBookValidation = Joi.object<ListBookRequest>({
    page: Joi.number().min(1).optional(),
    limit: Joi.number().min(1).optional(),
    priceMin: Joi.number().min(1).optional(),
    tomeNumberMin: Joi.number().min(1).optional(),
    tomeNumberMax: Joi.number().max(1).optional()

})


export interface ListBookRequest {
    page?: number
    limit?: number
    priceMin?: number
    tomeNumberMin?: number
    tomeNumberMax?: number
}
export const updateBookValidation = Joi.object<UpdateBookRequest>({
    id: Joi.number().required(),
    tome: Joi.number().min(1).optional(),
    review: Joi.number().min(1).optional()
})

export interface UpdateBookRequest {
    id: number
    tome?: number
    review?: number
}
export const bookIdValidation = Joi.object<bookIdRequest>({
    id: Joi.number().required(),
})

export interface bookIdRequest {
    id: number
}