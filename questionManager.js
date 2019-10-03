const Participant = require('./entity/participant');
const FileManager = require('./fileManager');

module.exports = class QuestionManager {
    constructor(username) {
        this.questions = FileManager.ReadQuestions();
        this.currentQuestion = 0;
        this.participants = [];
        this.createdBy = username;
        this.currentAnswers = [];
        this.ended = false;
        this.currentQuestionActive = false;
        FileManager.WriteResults(this);
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

    SetActive() {
        this.currentQuestionActive = true;
    }

    SetPassive() {
        this.currentQuestionActive = false;
    }

    End() {
        this.ended = true;
        FileManager.WriteResults(this);
    }

    DoesAcceptAnswer(){
        return !this.ended && this.currentQuestionActive;
    }

    NextQuestion() {
        this.currentQuestion++;
        this.currentAnswers = [];
        if (this.questions.length === this.currentQuestion) this.End();
    }

    CheckDuplicateAnswer(answer) {
        return this.currentAnswers.some(a => a.username === answer.username);
    }
};