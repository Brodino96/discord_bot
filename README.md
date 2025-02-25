# discord_bot

To install dependencies:

```bash
bun install
```

To run first time:
```bash
docker compose up --build
```
All other times:
```bash
docker compose up -d
```

The repo uses the .env as a config file  
structure:
```js
DISCORD_TOKEN=paste_your_token_here
GUILD_ID=paste_your_guildId_here
ROLE_ID=paste_your_roleId_here
ROLE_DURATION=time_in_hours
CHECK_INTERVAL=time_in_hours
```