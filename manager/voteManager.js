const AuthorizationManager = require('./authorizationManager');

module.exports = class VoteManager {
    constructor(bot) {
        this.bot = bot;
        this.votes = {};
        this.active = false;
    };

    Message(chatter) {
        this.CheckMessageCommand(chatter);
        if (!this.active) {
            return;
        }

        let vote = Number(chatter.message.slice(0, 2));
        console.log("New vote ", chatter.message, vote);
        if (isNaN(vote) || vote < 0 || vote > 10) return;
        console.log("New valid vote ", vote);
        this.votes[chatter.username] = vote;
    }

    Whisper(chatter) {
        return;
    }

    Start() {
        this.votes = {};
        this.active = true;
        this.bot.say("Hadi oradan!", null, null, true);
    }

    Stop() {
        let result = 0.0;
        let count = 0;
        console.log(this.votes);
        for(var key in this.votes){
            console.log(this.votes[key]);
            result += this.votes[key];
            count++;
        }

        result /= count;

        this.votes = {};
        this.active = false;
        this.bot.say("Hadi oradan! - "  + count + " oy verildi. Sonuç: " + result);
    }

    CheckMessageCommand(chatter) {
        if (chatter.message.startsWith("!hadioradan")
            && AuthorizationManager.CheckPermission("hadioradan", ""
                , chatter.username, chatter.channel)) {
            let split = chatter.message.split(" ");
            let command = split[1];
            switch (command) {
                case "baslat":
                    this.Start();
                    break;
                case "bitir":
                    this.Stop();
                    break;
                default:
                    this.bot.say("Bilinmeyen komut:(", null, null, true);
                    break;
            }
        }
    }
}