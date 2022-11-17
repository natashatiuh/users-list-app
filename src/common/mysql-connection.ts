import * as mysql from 'mysql2/promise'

export const connect = mysql.createConnection({
    host: "db4free.net",
    user: "natasha",
    database: "application",
    password: 'vjiQm24RqoTgvi7ZoYuq',
    connectTimeout: 1000 * 60 * 5
})
