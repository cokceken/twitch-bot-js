module.exports = new class AnswerManager {
    constructor() {
        this.answerLetters =
            ["A", "B", "C", "D", "E", "F", "G",
                "H", "I", "J", "K", "L", "M",
                "N", "O", "P", "Q", "R", "S",
                "T", "U", "V", "W", "X", "Y", "Z"];
    }

    QuestionAnswer(message) {
        let answer = message[0].toUpperCase();
        return this.answerLetters.indexOf(answer);
    }

    QuestionPossibleAnswers(count) {
        return this.answerLetters.slice(0, count);
    }
};
