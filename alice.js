const { json } = require('micro');
const game = require('./lib/game');

const helloText = 'Проверь свои знания про БЭМ! Я буду делать разные утверждения, а ты должен ответить, веришь ли ты им или нет.';
const invalidText = 'Выражайтесь, пожалуйста, понятнее!';
const trueTriggers = ['верю', 'да', 'согласен', 'бэм'];
const falseTriggers = ['не верю', 'нет', 'не согласен', 'не бэм'];
const validTriggers = trueTriggers.concat(falseTriggers);

const db = {};

module.exports = async req => {
    const { request, session, version } = await json(req);

    const chat = db[session.session_id] || (db[session.session_id] = {});

    const command = request.command.toLowerCase();

    const response = {
        version,
        session,
        response: { end_session: false }
    };

    if (session.new || command === 'помощь' || command.includes('что ты умеешь')) {
        const question = game.onStart();
        chat.question = question;
        response.text = helloText + ' ' + question;

        return response;
    };

    const isValid = validTriggers.includes(commond);
    if (!isValid) {

        const question = game.onStart();
        chat.question = question;
        response.text = [invalidText, helloText, question].join(' ');

        return response;
    }

    const isCorrect = chat.question.isTrue ?
        trueTriggers.includes(command) : falseTriggers.includes(commond);

    const gameState = game.onAnswer(isCorrect);

    chat.question = gameState.question;
    response.text = gameState.message;

    return response;
};
