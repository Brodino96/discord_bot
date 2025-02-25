import { Client, Guild, Role, GatewayIntentBits, GuildMember, User, type PartialGuildMember } from "discord.js"
import db from "./db"
import type { DbUsers } from "./types"

class Main {

    private client: Client
    private guild: Guild | null = null
    private role: Role | null = null
    private db = db
    // 1000 * 60 * 100 means hours in milliseconds
    private readonly timeToRemove: number = Math.floor(parseFloat(process.env.ROLE_DURATION!) * 1000 * 60 * 100)
    private readonly checkInterval: number = Math.floor(parseFloat(process.env.CHECK_INTERVAL!) * 1000 * 60 * 100)

    constructor() {
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
            ]
        })

        this.init()
    }

    private async init() {
        this.client.once("ready", async () => {
            console.log(`🟩 Bot ready! Logged as [${this.client.user?.tag}]`)

            this.guild = this.client.guilds.cache.get(process.env.GUILD_ID!) || null
            this.role = this.guild?.roles.cache.get(process.env.ROLE_ID!) || null

            if (this.guild && this.role) {
                console.log(`Guild found: ${this.guild.name}`)
                console.log(`Role found: ${this.role.name}`)
            } else {
                console.error("Guild or role not found!")
            }

            await this.db.init()
            this.checkRoles()
        })

        this.client.on("guildMemberAdd", (member: GuildMember) => {
            this.newMember(member)
        })

        this.client.on("guildMemberRemove", (member: GuildMember | PartialGuildMember) => {
            this.oldMember(member.id)
        })

        this.client.login(process.env.DISCORD_TOKEN).catch(error => {
            console.log("🟥 Failed initialized discord bot: ", error)
        })
    }

    private async newMember(member: GuildMember) {
        await member.roles.add(this.role!)
        this.db.add(member.id)
    }

    private async oldMember(id: string) {
        const member = await this.guild!.members.fetch(id)!
        member.roles.remove(this.role!)
        this.db.remove(id)
    }

    private async checkRoles() {
        const rows = await this.db.getAll()
        if (!rows) {
            return
        }

        // @ts-ignore
        for (const user of rows[0]) {
            const { user_id, role_assigned_at } = user
            const assignedTime = new Date(role_assigned_at).getTime()
            const currentTime = Date.now()

            if (currentTime - assignedTime > this.timeToRemove) {
                this.oldMember(user_id)
            }
        }

        setTimeout(() => {
            this.checkRoles()
        }, this.checkInterval)
    }
}

new Main()