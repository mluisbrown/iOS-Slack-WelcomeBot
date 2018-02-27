var SlackBot = require('slackbots')
var argv = require('yargs')
    .usage('Usage: $0 --token [token] --bot-id [botId]')
    .demandOption(['token','bot-id'])
    .argv

// create a bot
var bot = new SlackBot({
    token: argv.token,
    name: 'Welcome Robot',
    icon_emoji: ':robot_face:'
})

const botUserId = '<' + argv.botId + '>'

bot.on('start', () => {
    // more information about additional params https://api.slack.com/methods/chat.postMessage
    var params = {
        icon_emoji: ':robot_face:'
    }
    bot.postMessageToUser('michael', 'Olá, é só para avisar que estou online. :tada: :heart:', params);
})

bot.on('message', (message) => {

    // all incoming events https://api.slack.com/rtm
    const params = {
        icon_emoji: ':robot_face:'
    }

    const greetings = ['Olá', 'Viva', 'Bons dias', 'Bom dia', 'Boas']
    if (message.type == 'team_join') {
        bot.postMessageToChannel('general', 'Olá <@' + message.user.id + '> :tada:! \nPodes fazer uma pequena apresentação para o resto do pessoal?\n  *•* Foto + Nome é obrigatório. \n  *•* Adiciona-te aqui para partilharmos onde trabalhamos: https://goo.gl/Rozs81. \n  *•* Podes consultar o Code of Conduct do grupo aqui:https://github.com/RuiAAPeres/Code-Of-Conduct', params)
    }
    else if (message.type == 'message') {
        if (message.subtype == 'bot_message' ||
            message.subtype == 'message_deleted') {
            return
        }

        if (message.text != undefined && message.text.includes(botUserId)) {
            let lowerCaseMsgText = message.text.toLowerCase()
            if (greetings.map(greeting => greeting.toLowerCase())
                    .filter(greeting => lowerCaseMsgText.includes(greeting))
                    .length > 0) {
                let randomItem = greetings[Math.floor(Math.random() * greetings.length)]
                bot.postMessageToChannel('general', randomItem + "! <@" + message.user + ">", params)
            }
        }
    }
})

bot.on('close', () => console.log('Disconnected'))

bot.on('error', e => console.error(e))

console.log('Listening')
