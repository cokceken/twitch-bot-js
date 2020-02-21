const TwitchBot = require('./tmi_core/twitchBot');
const qm = require('./manager/questionManager');
const trackerManager = require("./manager/trackerManager");
const voteManager = require("./manager/voteManager");
const Configuration = require('./configuration');
const AuthorizationManager = require('./manager/authorizationManager');

const Bot = new TwitchBot({
    username: Configuration.username,
    oauth: Configuration.oauth,
    channels: [Configuration.channel]
});

let QuestionManager;
let TrackerManager = new trackerManager(Bot);
let VoteManager = new voteManager(Bot);

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
    TrackerManager.Message(chatter);
    VoteManager.Message(chatter);
    // if (chatter.message.startsWith('!cahilertem')) {
    //     HandleQuestionMessage(chatter);
    // }
});

Bot.on('whisper', chatter => {
    TrackerManager.Whisper(chatter);
    VoteManager.Whisper(chatter);
    // if (QuestionManager)
    //     QuestionManager.Whisper(chatter);
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