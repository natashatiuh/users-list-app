import * as joi from "joi"

export const editUserSchema = joi.object({
    userName: joi.string().required().min(2),
    userId: joi.string().required()
})

