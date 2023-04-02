//https://api.vk.com/method/vkstore.getBalanceMovements
//парсинг баллов за все время, токен тащить из аппа https://m.vk.com/app7300833#group_id=134304772 по методу выше

import fetch from 'node-fetch';

const token = "token"
const v = "5.120"

const points = [];

getPoints()

async function fetch2(last_id) {
  let response = await fetch(`https://api.vk.com/method/vkstore.getBalanceMovements?access_token=${token}&v=${v}&owner_id=-134304772&count=100${last_id ? `&last_id=${last_id}` : ""}`, { method: "POST" })
  return await response.json()
}
async function getPoints(last_id) {
  const data = await fetch2(last_id)

  try {
    let items = data.response.items
    if (items.length > 0) {
      items.map((el) => {
        if (el.delta > 0 && el.note.split("Отмена заказа").length === 1) points.push(el.delta)
      })

      return setTimeout(() => {
        getPoints(items[items.length - 1].transaction_id)
      }, getRandomInt(1400, 2100))
    }

    console.log(`Всего было заработано ${points.reduce((a, b) => a + b, 0).toLocaleString("ru-RU")} баллов`)
  } catch (e) {
    console.log(data)
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
}