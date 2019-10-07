const TwitchBot = require('./tmi_core/twitchBot');
const qm = require('./questionManager.js');
const Configuration = require('./configuration');
const AuthorizationManager = require('./authorizationManager');
let QuestionManager;

const Bot = new TwitchBot({
    username: Configuration.username,
    oauth: Configuration.oauth,
    channels: [Configuration.channel]
});

Bot.on('connected', () => {
    Bot.say("bot adam");
    console.log('irc connected');
});

Bot.on('part', channel => {
    console.log("Left channel:" + {channel});
});

Bot.on('join', channel => {
    console.log(`Joined channel: ${channel}`);
});

Bot.on('subscription', event => {
    console.log(event);
});

Bot.on('error', err => {
    console.log(err)
});

Bot.on('close', () => {
    console.log('closed bot irc connection')
});

Bot.on('message', chatter => {
    if (chatter.message.startsWith('!cahilertem')) {
        HandleQuestionMessage(chatter);
    }
});

Bot.on('whisper', chatter => {
    console.log(chatter);
    HandleWhisper(chatter);
});

function HandleQuestionMessage(chatter) {
    if (!AuthorizationManager.CheckPermission("cahilertem", "", chatter.username, chatter.channel))
        return;

    if (!QuestionManager || QuestionManager.ended) {
        QuestionManager = new qm(Bot, chatter.username);
        return;
    }

    let command = chatter.message.split(" ")[1];
    switch (command) {
        case "sıradaki":
            QuestionManager.Next();
            break;
        case "sonuçlar":
            QuestionManager.BroadcastResults();
            break;
        case "bitir":
            QuestionManager.End();
            break;
        case "top5":
            QuestionManager.BroadcastResults(5);
            break;
        case "soru":
            QuestionManager.BroadcastQuestion();
            break;
    }
}

function HandleWhisper(chatter){
    if (QuestionManager)
        QuestionManager.Whisper(chatter);
}