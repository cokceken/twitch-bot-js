const Participant = require('./entity/participant');
const FileManager = require('./fileManager');
const Bot = require('./bot');
const Answer = require('./entity/answer');
const AnswerManager = require('./answerManager');
const TimeOutManager = require('./timeoutManager');

module.exports = class QuestionManager {
    constructor(bot, username) {
        this.bot = bot;
        this.questions = FileManager.ReadQuestions();
        this.currentQuestion = -1;
        this.participants = [];
        this.createdBy = username;
        this.currentAnswers = [];
        this.ended = false;
        this.currentQuestionActive = false;

        this.bot.say("Soru akışı yaratıldı @" + username);
    };

    CurrentQuestionActive() {
        return this.currentQuestionActive;
    }

    SetCurrentQuestionActive(val) {
        this.currentQuestionActive = val;
    }

    Ended() {
        return this.ended;
    }

    SetEnded(val) {
        this.ended = val;
    }

    Next() {
        if (this.CurrentQuestionActive()) {
            this.BroadcastQuestionAnswer();
            TimeOutManager.Clear(TimeOutManager.keys.questionEnd);
        }

        this.currentQuestion++;
        if (this.currentQuestion === this.questions.length) {
            this.End();
            return;
        }

        this.SetCurrentQuestionActive(true);
        this.currentAnswers = [];

        let currentQuestion = this.CurrentQuestion();
        this.BroadcastQuestion();

        TimeOutManager.keys.questionEnd = TimeOutManager.Set(() => {
            if (this.Ended()) return;

            if (this.CurrentQuestionActive()) {
                this.BroadcastQuestionAnswer();
                this.SetCurrentQuestionActive(false);
            }

            if (this.currentQuestion + 1 === this.questions.length) {
                this.End();
            }
        }, currentQuestion.duration);
    }

    Whisper(chatter) {
        this.ManageAnswer(chatter);
    }

    End() {
        this.BroadcastQuestionAnswer();
        this.SetEnded(true);
        this.SetCurrentQuestionActive(false);
        this.BroadcastResults();
        FileManager.WriteResults(this);
    }

    SortParticipants() {
        this.participants.sort((a, b) => b.totalPoint - a.totalPoint);
    }

    CurrentQuestion() {
        return this.questions[this.currentQuestion];
    }

    ManageParticipant(answer) {
        if (!this.participants.some(a => a.username === answer.username))
            this.participants.push(new Participant(answer.username));

        let participant = this.participants.filter(a => a.username === answer.username)[0];
        participant.AddAnswer(answer);
    }

    DoesAcceptAnswer() {
        return !this.Ended() && this.CurrentQuestionActive();
    }

    CheckDuplicateAnswer(answer) {
        return this.currentAnswers.some(a => a.username === answer.username);
    }

    ManageAnswer(chatter) {
        if (!this.DoesAcceptAnswer()) return;
        let answerInt = AnswerManager.QuestionAnswer(chatter.message);
        if (answerInt < 0 || answerInt > this.CurrentQuestion().answers.length) {
            this.bot.say('Geçersiz cevap @' + chatter.username, null, null, false);
            return;
        }

        let answer = new Answer(chatter.username, answerInt);
        if (this.CheckDuplicateAnswer(answer)) {
            this.bot.say("Cevabı değiştiremezsiniz @" + chatter.username, null, null, false);
            return;
        }

        answer.SetPoint(this.CurrentQuestion().GetNextPoint(answer));
        this.ManageParticipant(answer);
        this.currentAnswers.push(answer);
        this.bot.say("Cevabınız alındı @" + chatter.username, null, null, false);
    }

    BroadcastQuestion() {
        let question = this.CurrentQuestion();
        let message = question.question;
        let possibleAnswers = AnswerManager.QuestionPossibleAnswers(question.answers.length);
        question.answers.forEach((x, i) => message += " " + possibleAnswers[i] + " ) " + x);
        this.bot.say(message);
    }

    BroadcastQuestionAnswer() {
        if (!this.CurrentQuestionActive()) return;
        let question = this.CurrentQuestion();

        let answersLength = question.answers.length;
        let possibleAnswers = AnswerManager.QuestionPossibleAnswers(answersLength);

        let answerDistribution = new Array(answersLength).fill(0);
        this.currentAnswers.forEach(x => answerDistribution[x.answer] += 1);
        // question.answers.forEach((x,i) => answerDistribution[i] = this.currentAnswers.filter(x => x.answer === i).length);

        let message = "Cevap alımı durdu, doğru cevap: "
            + possibleAnswers[question.correctAnswer] + ' ) ' + question.answers[question.correctAnswer] + " |";
        answerDistribution.forEach((x, i) => message += " " + possibleAnswers[i] + " ) (" + x + ")");
        this.bot.say(message);
    }

    BroadcastResults(count = 0) {
        this.SortParticipants();
        let results = this.participants;
        if (count !== 0)
            results = results.slice(0, count + 1);
        this.bot.say("--------Sonuçlar--------");
        results.forEach((x, i) => this.bot.say((i + 1) + ' - ' + x.username + " " + x.totalPoint));
        this.bot.say("------------------------");
    }
};