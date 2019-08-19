const questions = require('./questions');
const rightAnswers = ['Верно!', 'Правильно.', 'Всё так.', 'В точку!', 'Именно!', 'Конечно!'];
const wrongAnswers = ['Неверно!', 'Неправильно.', 'Ошибка.', 'Упс!', 'Не угадали!', 'Неа.', 'Вот и нет!', 'Мимо!'];


function onStart() {
    return getRandom(questions);
}

function onAnswer(isRight, prevQuestion) {
    const question = getRandom(questions);

    return {
        question,
        message: [
            getRandom(isRight ? rightAnswers : wrongAnswers),
            prevQuestion.answer,
            question.question
        ].join('\n')
    };
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function getRandom(collection) {
    return collection[getRandomInt(0, collection.length)];
}

module.exports = {
    onStart,
    onAnswer
};
