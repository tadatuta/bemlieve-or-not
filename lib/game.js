const questions = require('./questions');
const rightAnswers = ['Верно!', 'Правильно.', 'Всё так.', 'В точку!', 'Именно!', 'Конечно!'];
const wrongAnswers = ['Неверно!', 'Неправильно.', 'Ошибка.', 'Упс!', 'Не угадали!', 'Неа.', 'Вот и нет!', 'Мимо!'];
const introductoryPhrases = ['Потому что', 'Так как', 'Ведь'];
const newQuestionPhrases = ['Вот вам очередной вопрос:', 'Вот и новая задачка:', 'Как думаете, а такое утверждение верно?', 'Скажите, а вот такое утверждение — правда?', 'Угадайте, правда или ложь?', 'А что думаете об этом утверждении?', 'А как вам такое утверждение?'];

function onAnswer(isRight, prevQuestion) {
    const isNewSession = !arguments.length;
    const question = getRandom(questions);

    return {
        question,
        message: isNewSession ? question.question : [
            getRandom(isRight ? rightAnswers : wrongAnswers),
            getRandom(introductoryPhrases) + ' ' + toLowerCase(prevQuestion.answer),
            joinPhrases(getRandom(newQuestionPhrases), question.question)
        ].join('\n\n')
    };
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function getRandom(collection) {
    return collection[getRandomInt(0, collection.length)];
}

function startsWithAbbr(text) {
    return text[1].toUpperCase() === text[1];
}

function toLowerCase(text) {
    return (startsWithAbbr(text) || text.startsWith('Гугл')) ?
        text :
        text[0].toLowerCase() + text.substr(1);
}

function joinPhrases(...phrases) {
    const [firstPhrase, secondPhrase] = phrases;

    return firstPhrase + ' ' + (
        firstPhrase.endsWith(':') ?
            toLowerCase(secondPhrase) :
            secondPhrase
        );
}

module.exports = { onAnswer };
