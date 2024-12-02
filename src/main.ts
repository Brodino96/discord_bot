import { Client, GatewayIntentBits } from "discord.js"

class DiscordBot {
    private token = process.env.DISCORD_BOT_TOKEN;
    private client: Client;

    constructor() {
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent
            ],
            shards: "auto",
            failIfNotExists: false,
        });
    };

    startBot() {
        this.client
        .login(this.token)
        .then(function() {
            console.log("bot on")
        })
        .catch(function(error) {
            console.log("Error: ", error)
        })
    };
}

const app = new DiscordBot();
app.startBot();