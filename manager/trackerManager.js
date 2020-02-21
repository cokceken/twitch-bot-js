const AuthorizationManager = require('./authorizationManager');

module.exports = class TrackerManager {
    constructor(bot) {
        this.bot = bot;
        this.trackings = {};
    };

    Message(chatter) {
        if (chatter.message.startsWith('!çettekızvarmı')) 
            this.bot.say("Aksi ispatlanana dek internetteki herkes erkektir :(", null, null, true);
        let tracking = this.trackings[chatter.username];
        if (tracking)
            this.trackings[chatter.username].isActive = true;
    }

    Whisper(chatter) {
        if (!chatter.message.startsWith('!hipnoz')) return;
        if (!AuthorizationManager.CheckPermission("hipnoz", "", chatter.username, chatter.channel)) return;

        let split = chatter.message.split(" ");
        if (split.length < 3) {
            this.bot.whisper("Parametre hatalı -!hipnoz takip @username- olmalı", chatter.username);
            return;
        }

        let command = split[1];
        let username = split[2];
        switch (command) {
            case "takip":
                if(username.startsWith("@")) username = username.slice(1);
                this.StartTracking(chatter.username, username);
                break;
            default:
                this.bot.whisper("Bilinmeyen komut", chatter.username);
        }
    }

    StartTracking(callerUser, trackingUser) {
        if(this.trackings[trackingUser]) return;
        this.trackings[trackingUser] = {
            "callerUser": callerUser,
            "isActive": false
        };

        setTimeout(() => {
            let tracking = this.trackings[trackingUser];
            if (tracking
                && tracking.isActive === false)
                this.bot.whisper(trackingUser + " aktif değil!", tracking.callerUser);
            else
                this.bot.whisper(trackingUser + " aktif!", tracking.callerUser);

            this.trackings[trackingUser] = undefined;
        }, 60000);
    }
}