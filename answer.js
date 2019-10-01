module.exports = class Answer {
    constructor(username, answer) {
        this.username = username;
        this.answer = answer;
        this.point = 0;
    };

    SetPoint(point) {
        this.point = point;
    }
};