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

    CorrectAnswerCount(){
        return this.answers.filter(x => x.correct).length;
    }
};