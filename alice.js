const { json } = require('micro');
const game = require('./lib/game');

const helloText = 'Проверьте свои знания про БЭМ! Я буду делать разные утверждения, а вы должны ответить, верите вы им или нет.';
const invalidText = 'Выражайтесь, пожалуйста, понятнее!';

const trueTriggers = ['верю', 'верно', 'правда', 'да', 'согласен', 'бэм', 'так и есть', 'конечно'];
const falseTriggers = ['не верю', 'неправда', 'неверно', 'нет', 'не согласен', 'не бэм'];
const validTriggers = trueTriggers.concat(falseTriggers);

const db = {};

function prepareTTS(text) {
    return text
        .replace(/CSS/g, 'си эс эс')
        .replace(/JS/g, 'джэй эс');
}

module.exports = async req => {
    const { request, session, version } = await json(req);
    const replay = {
        version,
        session,
        response: { end_session: false }
    };

    const command = request.command.toLowerCase();
    console.log(`command`, command);

    const chat = db[session.session_id] || (db[session.session_id] = {});
    const isNewSession = session.new || command === 'помощь' || command.includes('что ты умеешь');

    let gameState;
    let responsePrefix = '';

    function getReplay() {
        chat.question = gameState.question;
        replay.response.text = responsePrefix + gameState.message;

        if (gameState.question.tts) {
            replay.response.tts = gameState.question.tts;
        } else {
            const tts = prepareTTS(gameState.message);
            if (tts !== gameState.message) {
                replay.response.tts = responsePrefix + tts;
            }
        }

        return replay;
    }

    if (isNewSession) {
        gameState = game.onAnswer();
        responsePrefix = helloText + '\n';

        return getReplay();
    };

    if (!validTriggers.includes(command)) {
        replay.response.text = invalidText;

        return replay;
    }

    const isCorrect = chat.question.isTrue ?
        trueTriggers.includes(command) : falseTriggers.includes(command);

    gameState = game.onAnswer(isCorrect, chat.question);

    return getReplay();
};
