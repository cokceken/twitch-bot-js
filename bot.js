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

let emoteOnlyTimeoutId;
let QuestionManager;
let TrackerManager = new trackerManager(Bot);
let VoteManager = new voteManager(Bot);

Bot.on('connected', () => {
    Bot.say("bot adam");
    console.log('irc connected');
});

Bot.on('part', channel => {
    console.log("Left channel:" + { channel });
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
    console.log(chatter.custom_reward_id);

    if (chatter.custom_reward_id == "3d1b9f6e-48ac-4517-9d3e-bc36b603a536") {
        Bot.timeout(chatter.message, null, 30, chatter.username + " sadakat puanı kullanarak " + chatter.message + "\'ı susturdu");
    }

    if (chatter.custom_reward_id == "1e5d327e-f45d-480b-a1c2-028a250e1372") {
        let emoteOnlyTimeoutDuration = 10000;
        console.log(emoteOnlyTimeoutId);
        if(emoteOnlyTimeoutId !== undefined){
            clearTimeout(emoteOnlyTimeoutId);
            emoteOnlyTimeoutId = setTimeout(EmoteOnlyOff, emoteOnlyTimeoutDuration);
        }else{
            Bot.emoteOnly(chatter.username);
            emoteOnlyTimeoutId = setTimeout(EmoteOnlyOff, emoteOnlyTimeoutDuration);
        }
    }

    if (chatter.custom_reward_id == "5fd00cd2-d6bd-49d1-b364-4986bf51f497") {
        Bot.giveCurrency(chatter.username);
    }

    TrackerManager.Message(chatter);
    VoteManager.Message(chatter);
    // if (chatter.message.startsWith('!cahilertem')) {
    //     HandleQuestionMessage(chatter);
    // }
});

function EmoteOnlyOff(){
    Bot.emoteOnlyOff();
    emoteOnlyTimeoutId = undefined;
}

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