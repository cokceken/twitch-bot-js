let Question = require('./question');
const fs = require('fs');

const FileManager = new class FileManager {
    ReadQuestions() {
        let questions = [];
        let data = fs.readFileSync('./questions.json');

        let questionObjectArray = JSON.parse(data.toString());
        questionObjectArray.forEach(
            x => questions.push(
                new Question(x.question, x.point,
                    x.shareType, x.answers,
                    x.correctAnswer, x.duration, x.waitDuration)));

        return questions;
    }

    WriteResults(questionManager) {
        let timeStamp = new Date();
        let result = "Sonuçlar\n";
        result += "Tarih: " + timeStamp + "\n";
        result += "Başlatan Kullanıcı: " + questionManager.createdBy + "\n";
        result += "Sorular:\n";
        questionManager.questions.forEach((x, i) => result += "\t" + i + " - " + x.question
            + "\n\t\tPuan: " + x.point
            + "\n\t\tSüre: " + x.duration + "ms"
            + "\n\t\tPaylaşım türü: " + (x.shareType === 1 ? "ilk bilen hepsini alır" : "puan azalarak dağıtılır")
            + "\n\t\tCevap sayısı: " + x.answerCount
            + "\n\t\tDoğru cevap sayısı: " + x.correctAnswerCount + "\n"
        );
        result += "Sonuçlar:";
        questionManager.participants.sort((a, b) => a.totalPoint - b.totalPoint).forEach((x, i) => {
            result += "\t" + i + " - " + x.username
                + "\n\t\tPuan: " + x.totalPoint
                + "\n\t\tCevap sayısı: " + x.answers.length
                + "\n\t\tDoğru cevap sayısı: " + x.CorrectAnswerCount() + "\n";
        });

        let path = __dirname + '/Results/Result-' + this.GetFormattedTime(timeStamp) + '.txt';

        fs.writeFile(path, result, (err) => {
            if (err) {
                throw err;
            }
        })
    }

    GetFormattedTime(date) {
        var y = date.getFullYear();
        // JavaScript months are 0-based.
        var m = date.getMonth() + 1;
        var d = date.getDate();
        var h = date.getHours();
        var mi = date.getMinutes();
        var s = date.getSeconds();
        return y + "-" + m + "-" + d + "-" + h + "-" + mi + "-" + s;
    }
};

module.exports = FileManager;