// netlify/functions/telegram-notify.js
exports.handler = async (event, context) => {
  // Только POST запросы
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // Парсим данные из формы
    const formData = JSON.parse(event.body);
    const { name, contact, question } = formData;

    // Твой токен бота и chat_id (добавь свои!)
    const BOT_TOKEN = '8694471922:AAFVSE_bzfR8yNideAFpw_e84sPv5Pzjgyc'; // Замени на свой
    const CHAT_ID = '1118454074'; // Замени на свой

    // Форматируем сообщение
    const message = `🎓 **Новая заявка на курс!**\n\n` +
      `👤 **Имя:** ${name}\n` +
      `📱 **Контакты:** ${contact}\n` +
      `💬 **Вопрос:** ${question || 'Не указан'}\n\n` +
      `🕐 ${new Date().toLocaleString('ru-RU')}`;

    // Отправляем в Telegram
    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message,
          parse_mode: 'Markdown',
        }),
      }
    );

    if (!telegramResponse.ok) {
      throw new Error('Telegram API error');
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};