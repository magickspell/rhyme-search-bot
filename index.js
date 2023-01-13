import TelegramApi from 'node-telegram-bot-api';
import {sequelize} from './db/db.js';
import {config} from 'dotenv';
import {migrate} from './db/migrate.js';
import {findMusic} from './services/music.service.js';

config()

const bot = new TelegramApi(process.env.BOT_TOKEN, {polling: true})

bot.setMyCommands([
  {
    command: '/start',
    description: 'приветствие'
  },
  {
    command: '/info',
    description: 'информация'
  },
  {
    command: '/example',
    description: 'пример'
  },
])

bot.on('message', async msg => {
  try {
    const text = msg.text
    const chatId = msg.chat.id
    if (text === '/start') {
      await bot.sendMessage(chatId, 'Привет, я могу подобрать похожую аранжировку для вашей песни по припеву, просто напиши мне текст.')
      await bot.sendAnimation(chatId, 'https://cdn.tlgrm.app/stickers/34e/da8/34eda890-7edf-4492-93ff-f8a20619b292/96/2.webp')
      return
    }
    if (text === '/info') {
      await bot.sendMessage(chatId, 'Я ищю похожую рифму в своей базе треков и выдаю наиболее подходящий результат.')
      /*await bot.sendMessage(chatId, 'База данных бота заполнена некоторыми треками, взятыми с сайта genius.com')*/
      return
    }
    if (text === '/example') {
      await bot.sendMessage(chatId, 'Попробуйте отправить мне текст из сообщения ниже:')
      await bot.sendMessage(chatId, 'Хочешь ли ты мне что-то сказать?')
      await bot.sendMessage(chatId, '... я должен ответить вот так: "ваше произведение похоже на: МакSим - Знаешь ли ты"')
      return
    }
    await bot.sendMessage(chatId, 'Принято, начинаю поиск...')
    const data = await findMusic(text)
    await bot.sendMessage(chatId, data.message)
  } catch (e) {
    console.log(`[err] something crashed:\n ${e}`)
  }
})

const start = async () => {
  try {
    await sequelize.authenticate() // connect to database
    await sequelize.sync() // synchronize schema vs database
    await migrate()
    console.log('[ok] db connected, app listening bot')
  } catch (e) {
    console.log(`[err] something crashed:\n ${e}`)
  }
}
start()