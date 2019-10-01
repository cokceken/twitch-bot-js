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
        this.question = question;
        this.point = point;
        this.duration = duration;
        this.shareType = shareType;
        this.answers = answers;
        this.correctAnswer = correctAnswer;
        this.waitDuration = waitDuration;
    }

    GetNextPoint(answer) {
        if (answer.answer !== this.correctAnswer) return 0;

        let result = this.point;
        switch (this.shareType) {
            case 0:
                result -= this.answerCount;
                if (result < 0) result = 1;
                break;
            case 1:
                if (this.answerCount !== 0) result = 0;
        }

        this.answerCount++;
        return result;
    }
};