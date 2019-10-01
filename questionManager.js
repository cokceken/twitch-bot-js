const Participant = require('./participant');
const Questions = require('./questions');
const Question = require('./question');

module.exports = class QuestionManager {
    constructor() {
        this.questions = [];
        Questions.forEach(x =>
            this.questions.push(
                new Question(x.question, x.point,
                    x.shareType, x.answers,
                    x.correctAnswer, x.duration, x.waitDuration)));
        this.currentQuestion = 0;
        this.participants = [];
        this.currentAnswers = [];
        this.ended = false;
    };

    CurrentQuestion() {
        return this.questions[this.currentQuestion];
    }

    ManageParticipant(answer) {
        if (!this.participants.some(a => a.username === answer.username))
            this.participants.push(new Participant(answer.username));

        let participant = this.participants.filter(a => a.username === answer.username)[0];
        participant.AddAnswer(answer);
    }

    NewAnswer(answer) {
        if (this.CheckDuplicateAnswer(answer)) return false;
        answer.SetPoint(this.CurrentQuestion().GetNextPoint(answer));
        this.ManageParticipant(answer);
        this.currentAnswers.push(answer);
        return true;
    }

    NextQuestion() {
        this.currentQuestion++;
        this.currentAnswers = [];
        if (this.questions.length === this.currentQuestion) this.ended = true;
    }

    CheckDuplicateAnswer(answer) {
        return this.currentAnswers.some(a => a.username === answer.username);
    }
};