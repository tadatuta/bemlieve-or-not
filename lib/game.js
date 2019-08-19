const questions = require('./questions');
const rightAnswers = ['Верно!', 'Да.', 'Правильно.', 'Всё так.', 'В точку!', 'Именно!', 'Конечно!'];
const wrongAnswers = ['Неверно!', 'Нет.', 'Неправильно.', 'Ошибка.', 'Упс!', 'Не угадали!', 'Неа.', 'Вот и нет!', 'Мимо!'];


function onStart() {
    return {
        question: getRandom(questions)
    };
}

function onAnswer(isRight) {
    const question = getRandom(questions);

    return {
        question,
        message: [
            getRandom(isRight ? rightAnswers : wrongAnswers),
            prevQuestion.answer,
            question.question
        ].join(' ')
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
