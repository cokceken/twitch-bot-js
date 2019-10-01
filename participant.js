module.exports = class Participant {
    constructor(
        username) {
        this.username = username;
        this.answers = [];
        this.totalPoint = 0;
    };

    AddAnswer(answer) {
        this.totalPoint += answer.point;
        this.answers.push(answer);
    }
};