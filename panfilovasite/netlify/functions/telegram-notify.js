// netlify/functions/telegram-notify.js
exports.handler = async (event, context) => {
  // Добавляем CORS headers для корректной работы
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
  
  // Обрабатываем preflight запросы
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers };
  }
  
  // Только POST запросы
  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' }) 
    };
  }

  try {
    // Парсим данные из формы
    const formData = JSON.parse(event.body);
    const { name, contact, question } = formData;
    
    console.log('Получены данные:', { name, contact, question }); // Для отладки

    
    const BOT_TOKEN = '8694471922:AAFVSE_bzfR8yNideAFpw_e84sPv5Pzjgyc'; 
    const CHAT_ID = '1118454074'; 

    // Проверяем, что данные заполнены
    if (!BOT_TOKEN || BOT_TOKEN === '8694471922:AAFVSE_bzfR8yNideAFpw_e84sPv5Pzjgyc' && !BOT_TOKEN.includes(':')) {
      throw new Error('BOT_TOKEN не настроен корректно');
    }
    
    if (!CHAT_ID || CHAT_ID === '1118454074') {
      throw new Error('CHAT_ID не настроен корректно');
    }

    // Форматируем сообщение
    const message = `🎓 **Новая заявка на курс!**\n\n` +
      `👤 **Имя:** ${name}\n` +
      `📱 **Контакты:** ${contact}\n` +
      `💬 **Вопрос:** ${question || 'Не указан'}\n\n` +
      `🕐 ${new Date().toLocaleString('ru-RU')}`;

    console.log('Отправляем сообщение в Telegram...'); // Для отладки

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

    const responseData = await telegramResponse.json();
    console.log('Ответ Telegram:', responseData); // Для отладки

    if (!telegramResponse.ok) {
      throw new Error(`Telegram API error: ${responseData.description || 'Unknown error'}`);
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, data: responseData }),
    };
  } catch (error) {
    console.error('Error in function:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        success: false, 
        error: error.message,
        details: error.toString()
      }),
    };
  }
};