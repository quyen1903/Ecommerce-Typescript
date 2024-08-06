require('dotenv').config(); 
import { Client, GatewayIntentBits, TextChannel } from "discord.js";
import { parseInt } from "lodash"

class LoggerService{
    client;
    chanelId;
    constructor(){
        this.client = new Client({
            intents:[
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent
            ]
        })
        this.chanelId=process.env.CHANNELID_DISCORD

        //Non-null Assertion Operator
        this.client.on('ready',()=>{
            console.log(`logged is as ${this.client.user!.tag}`)
        })

        this.client.login(process.env.TOKEN_DISCORD)
    }

    sendToFormatCode(logData: {
        code : string,
        message: string,
        title: string
    }){
        const { code, message = 'This is some additional information about the code.', title = 'Code Example'} = logData
        if( 1 === 1) {
            //product and dev
        }
        const codeMessage = {
            content:message,
            embeds:[
                {
                    color:parseInt('00ff00',16),
                    title,
                    description:'```json\n' + JSON.stringify(code, null, 2) + '\n```',
                },
            ],
        }
        this.sendToMessage( codeMessage )
    }

    sendToMessage(message: { 
        content: string,
        embeds: Array<object>
    }){//type casting
        const channel  = this.client.channels.cache.get(this.chanelId as string) as TextChannel
        if(!channel){
            console.error(`Couldn't find the channel ...`,this.chanelId)
            return
        }
        //message use chat gpt api call to level up
        
        channel.send(message).catch(e => console.error(e))
    }
}

export default new LoggerService();