import mysql from "mysql2/promise"
import type { DbConfig } from "./types"

const dbConfig: DbConfig = {
    host: "mariadb",
    user: "root",
    password: "root",
    database: "discord",
}

class Database {
    private pool: mysql.Pool

    constructor(config: DbConfig) {
        this.pool = mysql.createPool(config)
        console.log("🟩 Database pool created correctly!")
    }

    public async init(): Promise<void> {
        try {
            const connection = await this.pool.getConnection()
            await connection.query(`
                CREATE TABLE IF NOT EXISTS roles (
                    user_id TEXT,
                    role_assigned_at TEXT
                )
            `)
            connection.release()
            console.log("🟩 Database initialized correctly!")
        } catch (error) {
            console.error("🟥 Failed to initialize database", error)
        }
    }

    public async add(userId: string): Promise<void> {
        try {
            const date = new Date().toISOString()
            const connection = await this.pool.getConnection()
            await connection.execute(`INSERT INTO roles (user_id, role_assigned_at) VALUES (?, ?)`, [ userId, date ])
            connection.release()
            console.log(`🟩 User with id [${userId}] correctly added to database at time [${date}] `)
        } catch (error) {
            console.error("🟥 Error adding user into database:", error)
        }
    }

    public async remove(userId: string): Promise<void> {
        try {
            const connection = await this.pool.getConnection()
            await connection.execute(`DELETE FROM roles WHERE user_id = ?`, [ userId ])
            connection.release()
            console.log(`🟩 User with id [${userId}] correctly removed from database`)
        } catch (error) {
            console.error("🟥 Error removing user from database:", error)
        }
    }

    public async getAll() {
        try {
            const connection = await this.pool.getConnection()
            const rows = await connection.execute(`SELECT user_id, role_assigned_at FROM roles`)
            connection.release()
            console.log(`🟩 Correctly fetched all users from database`)
            return rows
        } catch (error) {
            console.error("🟥 Error fetching all users from database:", error)
        }
    }
}

const db = new Database(dbConfig)

export default db
