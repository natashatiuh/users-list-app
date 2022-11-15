import * as joi from 'joi'

export const deleteUserSchema = joi.object({
    userId: joi.string().required().min(2)
})