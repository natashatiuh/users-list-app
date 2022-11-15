import { FieldPacket, RowDataPacket } from "mysql2"
import { v4 } from "uuid"
import { connect } from "../common/mysql-connection"
import { User } from "./user-object"

class UsersService {
    async addUser(userName: string): Promise<void> {
        const connection = await connect

        const update = `UPDATE users SET sortrank = sortrank + 1`
        await connection.execute(update)

        const query = 'INSERT INTO users (id, name, sortrank) VALUES (?, ?, ?)'
        await connection.execute(query, [v4(), userName, 1])
    }

    async deleteUser(userId: string): Promise<void> {
        const connection = await connect

        const select = `SELECT * FROM users WHERE id = ?`
        const result = await connection.execute(select, [userId])
        const sortrank = result[0][0].sortrank

        const query = `DELETE FROM users WHERE id = ?`
        await connection.execute(query, [userId])

        const update = `UPDATE users SET sortrank = sortrank - 1 WHERE sortrank > ?`
        await connection.execute(update, [sortrank])
    }

    async editUser(userName: string, userId: string): Promise<void> {
        const connection = await connect

        const query = `UPDATE users SET name = ? WHERE id = ?`
        await connection.execute(query, [userName, userId])

    }

    async getUsers(): Promise<User[]> {
        const connection = await connect

        const query = `SELECT * FROM users ORDER BY sortrank ASC`
        const [rows]: [RowDataPacket[], FieldPacket[]] = await connection.execute(query)
        return rows.map(row => new User(row.id, row.name))
    }

    async reorderUsers(userIdToMove: string, afterUserId: string) : Promise<void> {
        const connection = await connect

        const moveEverybodyQuery = `UPDATE users
         SET sortrank = sortrank + 1 
         WHERE sortrank > (SELECT k.sortrank FROM (SELECT sortrank FROM users WHERE id = ?) k)`
         await connection.execute(moveEverybodyQuery, [afterUserId])
         
        const moveUserQuery = `UPDATE users
        SET sortrank = 1 + (SELECT h.sortrank FROM (SELECT sortrank FROM users WHERE id = ?) h)
        WHERE id = ?`
        await connection.execute(moveUserQuery, [afterUserId, userIdToMove])
    }
}


export const usersService = new UsersService();