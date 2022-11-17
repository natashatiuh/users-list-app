import * as express from 'express'
import { router as usersRouter } from "./users/users-controller"
import * as cors from 'cors'

const app = express()
const port = process.env.PORT

app.use(cors())
app.use(express.json())
app.use('/client', express.static('client'))

app.use('/users', usersRouter)

app.listen(port, () => {
    console.log('Started')
})
