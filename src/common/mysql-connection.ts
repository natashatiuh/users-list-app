import * as mysql from 'mysql2/promise'

export const connect = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "users_list",
    password: 'root'
})
