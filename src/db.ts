import { sql } from "bun"
import type { dbUser } from "./types"

class Database {

    public async init(): Promise<void> {
        try {
            await sql`
                CREATE TABLE IF NOT EXISTS roles (
                    user_id TEXT,
                    role_assigned_at TEXT
                )
            `
            console.log("🟩 Database initialized correctly!")
        } catch (error) {
            console.error("🟥 Failed to initialize database", error)
        }
    }

    public async add(userId: string): Promise<void> {
        try {
            const date = new Date().toISOString()
            await sql`INSERT INTO roles (user_id, role_assigned_at) VALUES (${userId}, ${date})`
            console.log(`🟩 User with id [${userId}] correctly added to database at time [${date}] `)
        } catch (error) {
            console.error("🟥 Error adding user into database:", error)
        }
    }

    public async remove(userId: string): Promise<void> {
        try {
            await sql`DELETE FROM roles WHERE user_id = ${userId}`
            console.log(`🟩 User with id [${userId}] correctly removed from database`)
        } catch (error) {
            console.error("🟥 Error removing user from database:", error)
        }
    }

    public async getAll(): Promise<Array<dbUser>> {
        try {
            const rows = await sql`SELECT user_id, role_assigned_at FROM roles`
            console.log(`🟩 Correctly fetched all users from database`)
            return rows
        } catch (error) {
            console.error("🟥 Error fetching all users from database:", error)
            return []
        }
    }
}

const db = new Database()
export default db