const Answer = require('./answer');
const TwitchBot = require('twitch-bot');
const qm = require('./questionManager.js');
let QuestionManager;

const Bot = new TwitchBot({
    username: 'cokceken_bot',
    oauth: 'oauth:l04h1slhg33c5i0ozy2xd4jbo1zlis',
    channels: ['piadam']
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
    console.log(chatter);
    HandleMessage(chatter);
});

Bot.on('whisper', chatter => {
    console.log(chatter);
    HandleWhisper(chatter);
});

function BroadcastQuestionResult() {
    Bot.say("--------Sonuçlar--------");
    QuestionManager.participants.sort((a, b) => a.totalPoint - b.totalPoint)
        .forEach(x => Bot.say(x.username + "-" + x.totalPoint));
    Bot.say("------------------------");
}

function BroadcastQuestion(question) {
    Bot.say("--------Yeni soru-------");
    Bot.say("Puan: " + question.point);
    Bot.say("Puan dağıtımı: " + (question.shareType === 1 ? "ilk bilen hepsini alır" : "puan azalarak dağıtılır"));
    Bot.say("Süre: " + question.duration / 1000 + " saniye");
    Bot.say("Soru: " + question.question);
    question.answers.forEach((x, i) => Bot.say(i + "- " + x));
    Bot.say("------------------------");
}

function BroadcastQuestionAnswer(question) {
    Bot.say("Cevap: " + question.answers[question.correctAnswer]);
}

function ActQuestion() {
    if (QuestionManager.ended) {
        Bot.say("Bitti!");
        BroadcastQuestionResult();
        return;
    }

    let question = QuestionManager.CurrentQuestion();
    BroadcastQuestion(question);

    setTimeout(() => {
        BroadcastQuestionAnswer(question);
        QuestionManager.NextQuestion();
        setTimeout(ActQuestion, question.waitDuration)
    }, question.duration);
}

function HandleModMessage(chatter) {
    if (chatter.message === '!question') {
        if (!QuestionManager || QuestionManager.ended) {
            QuestionManager = new qm(chatter.username);
            Bot.say("Soru akışı başlıyor @" + chatter.username);
            ActQuestion();
        } else {
            Bot.say("Aktif soru akışı var @" + chatter.username);
        }
    } else if (chatter.message.startsWith('!results')) {
        if (!QuestionManager) {
            Bot.say("Önce soru akışı başlatmalısınız @" + chatter.username);
            return;
        }

        BroadcastQuestionResult();
    }
}

async function HandleMessage(chatter) {
    if (chatter.message.startsWith('!answer')) {
        Bot.say("Cevaplar özelden :) /w @cokceken_bot !answer {Cevap} @" + chatter.username);
    }

    if (chatter.mod)
        await HandleModMessage(chatter);
}

function HandleWhisper(chatter) {
    if (chatter.message.startsWith('!answer')) {
        if (!QuestionManager) return;
        let answer = chatter.message.split(" ")[1];
        if (answer) {
            let intAnswer = parseInt(answer);
            if (Number.isNaN(intAnswer)) {
                Bot.say('Cevap bir sayı olmalı @' + chatter.username);
                return;
            }

            let answerPeriod = QuestionManager.CurrentQuestion().answers.length;
            if (intAnswer < 1 || intAnswer > answerPeriod) {
                Bot.say('Cevap 1-' + answerPeriod + ' arasında olabilir @' + chatter.username);
                return;
            }
            if (QuestionManager.NewAnswer(new Answer(chatter.username, intAnswer - 1))) {
                Bot.say("Cevabınız alındı @" + chatter.username);
            } else {
                Bot.say("Cevabı değiştiremezsiniz @" + chatter.username);
            }
        } else {
            Bot.say("Cevap formatı: !answer {Cevap} olmalıdır @" + chatter.username);
        }
    }
}

