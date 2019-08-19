const { json } = require('micro');
const game = require('./lib/game');

const helloText = 'Проверьте свои знания про БЭМ! Я буду делать разные утверждения, а вы должны ответить, верите вы им или нет.';
const invalidText = 'Выражайтесь, пожалуйста, понятнее!';
const trueTriggers = ['верю', 'верно', 'да', 'согласен', 'бэм'];
const falseTriggers = ['не верю', 'неверно', 'нет', 'не согласен', 'не бэм'];
const validTriggers = trueTriggers.concat(falseTriggers);

const db = {};

module.exports = async req => {
    const { request, session, version } = await json(req);

    const chat = db[session.session_id] || (db[session.session_id] = {});

    const command = request.command.toLowerCase();
    console.log(`command`, command);

    const replay = {
        version,
        session,
        response: { end_session: false }
    };

    if (session.new || command === 'помощь' || command.includes('что ты умеешь')) {
        const gameState = game.onStart();
        chat.question = gameState;
        replay.response.text = helloText + '\n' + gameState.question;

        return replay;
    };

    const isValid = validTriggers.includes(command);
    if (!isValid) {

        const gameState = game.onStart();
        chat.question = gameState;
        replay.response.text = [invalidText, helloText, gameState.question].join('\n');

        return replay;
    }

    const isCorrect = chat.question.isTrue ?
        trueTriggers.includes(command) : falseTriggers.includes(command);

    const gameState = game.onAnswer(isCorrect, chat.question);

    chat.question = gameState.question;
    replay.response.text = gameState.message;

    return replay;
};
