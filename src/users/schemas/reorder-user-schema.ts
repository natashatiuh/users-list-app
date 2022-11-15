import * as joi from "joi"

export const reorderUserSchema = joi.object({
    userIdToMove: joi.string().required(),
    afterUserId: joi.string().required()
})