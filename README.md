# MunchCord Bot

MunchCord Bot is a versatile Discord bot designed to add Bellinal functionality to any Discord server. Developed by the [Block Munchers](https://blockmunchers.com/links) team, it was initially intended for their [community Discord server](https://discord.gg/munchers). However, it's built with inclusivity in mind, welcoming the broader community. After all, we're all in this together! ✌️

The primary objective is to streamline automated Role assignment based on proof of bellinal ownership. Server administrators can allocate specific roles for combinations of bellinal IDs. Typically, entire collections are associated with a single role. Users can verify their ownership through BIP-322 signatures.

## Adding the Bot

Adding MunchCord Bot to your server is hassle-free! The Block Munchers team already hosts the bot. Simply click the following link to add it to your server:

👉 [Invite Link](https://munchbot.blockmunchers.com) 👈

That's it! You're all set to go!

We've made sure to minimize permissions usage. With this bot, you won't find any Admin access requirements. It only requires the following permissions:

- Manage Role
- Send Messages
- Use Application Commands

## Important Notes

If you encounter this:

![image](https://user-images.githubusercontent.com/127023971/228488566-f8f0c53f-67a9-4934-bf82-c1842921ddcd.png)

Ensure that `RoleBot` is higher in the priority list than the roles it assigns. Simply drag it up the roles list.

This issue may also happen when you attempt to assign a role that's owned by another integration, such as server boost.

## BIP-322 Verification Notes

The general premise from the server admin side is to designate a specific Verify channel and activate the bot with `/channel-add`.

This will show a persistent `Verify` message in the channel. New users simply click the button and begin the verification process.

You can add as many collections as you want. Just call `/collection-add` to set up manual groups of bellinals or use `/collection-marketplace` to automatically grab the data from venues like Magic Eden.

> **Note**
> Collections are _channel-specific_: this allows you to have different setups for different groups of users.

## Using a Private Channel

If you want to use the bot in a private channel, you must specifically add the `MunchBot` role to the private channel so that the bot can send messages. If not, you will see this message:

![image](https://user-images.githubusercontent.com/127023971/234398040-32d1d42e-9cb1-4f27-a21e-61fddfb23571.png)

## Adding Features

We'd really welcome new features being added to the bot. Just submit a PR, make sure you've applied the project lint/prettier settings with:

npm run lint
npm run prettier

csharp
Copy code

Special bonus prizes for those who add tests. You can run them with:

npm test

markdown
Copy code

## Self Hosting

1. [Setting up a bot application](https://discordjs.guide/preparations/setting-up-a-bot-application.html)
2. [Adding your bot to servers](https://discordjs.guide/preparations/adding-your-bot-to-servers.html)
3. Copy `.env.example` to `.env.local` and update the values:

- `TOKEN`: The token from the discord bot dash
- `APPLICATION_ID`: The application id from the discord application page
- `RPC_HOST`: Hostname/IP for a BIP-322 enabled bitcoin node
- `RPC_PORT`: Port for the RPC
- `RPC_USERNAME`: Username for auth
- `RPC_PASSWORD`: Password for auth
- `DB_URL`: Fully qualified URL for DB connection
- `INSCRIPTION_API`: The inscription API to use, expects URI filter for the inscription id lookup
- `ADDRESS_API`: An API that can be used to list all the inscriptions within an address
- `BIP_MESSAGE`: Set to a string if you want a static BIP-322 message challenge

4. Install dependencies with `npm i`
5. Deploy commands with `npm run deploy`
6. Run bot with `npm start`
7. Invite bot to your server ensuring you have the relevant permissions in the URL: `&permissions=2415921152&scope=bot`

Set `NODE_ENV` to `production` if you don't want verbose logging.

## Docker

A new package is created on every merge to `main`.

docker build .
docker run -it -v "$PWD/storage:/home/node/app/data" <image> /bin/bash
