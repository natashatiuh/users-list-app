import * as joi from 'joi'

export const addUserSchema = joi.object({
    userName: joi.string().required().min(2)
})