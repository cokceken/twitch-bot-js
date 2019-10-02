module.exports = class Answer {
    constructor(username, answer) {
        this.username = username;
        this.answer = answer;
        this.point = 0;
        this.correct = false;
    };

    SetPoint(point) {
        this.point = point;
    }
};