module.exports = class Question {
    constructor(
        question,
        point,
        shareType,
        answers,
        correctAnswer,
        duration,
        waitDuration) {
        this.answerCount = 0;
        this.correctAnswerCount = 0;
        this.question = question;
        this.point = point;
        this.duration = duration;
        this.shareType = shareType;
        this.answers = answers;
        this.correctAnswer = correctAnswer;
        this.waitDuration = waitDuration;
    }

    GetNextPoint(answer) {
        this.answerCount++;
        if (answer.answer !== this.correctAnswer) return 0;
        answer.correct = true;

        let result = this.point;
        switch (this.shareType) {
            case 0:
                if (this.correctAnswerCount !== 0) result = 0;
                break;
            case 1:
                result -= this.correctAnswerCount * 5;
                if (result < 0) result = 5;
                break;
            case 2:
                result -= this.correctAnswerCount * 10;
                if (result < 0) result = 10;
                break;
        }

        this.correctAnswerCount++;
        return result;
    }
};