import { usersService } from "./users-service"
import * as express from "express"
import { addUserSchema } from "./schemas/add-user-schema"
import { deleteUserSchema } from "./schemas/delete-user-schema"
import { editUserSchema } from "./schemas/edit-user-schema"
import { reorderUserSchema } from "./schemas/reorder-user-schema"
import { validate } from "../middlewares/validate-middleware"

export const router = express.Router()

router.post('/', validate(addUserSchema), async (req, res) => {
    const { userName } = req.body as any
    await usersService.addUser(userName)
    res.send('User was added!')
})

router.delete('/', validate(deleteUserSchema), async (req, res) => {
    const { userId } = req.body as any
    await usersService.deleteUser(userId)
    res.send(`User was deleted!`)
})

router.patch('/', validate(editUserSchema), async (req, res) => {
    const { userName, userId } = req.body as any
    await usersService.editUser(userName, userId)
    res.send("User's name was changed!")
})

router.get('/', async (req, res) => {
    const users = await usersService.getUsers()
    res.send(users)
})

router.patch('/reorder', validate(reorderUserSchema), async (req, res) => {
    const { userIdToMove, afterUserId } = req.body as any
    await usersService.reorderUsers(userIdToMove, afterUserId)
    res.send('User was reordered!')
})


