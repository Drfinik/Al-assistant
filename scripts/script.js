const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// Категории фраз для AI-ассистента
const aiResponses = {
  greeting: "Здравствуйте! Чем я могу вам помочь?",
  questions: [
    "Расскажите подробнее, что вас беспокоит?",
    "Как давно вы испытываете это состояние?",
    "Что обычно помогает вам успокоиться?",
    "Как вы справлялись с подобными ситуациями раньше?",
    "Как вы относитесь к тому, что происходит?",
    "Что, по вашему мнению, могло бы улучшить ваше состояние?",
    "Как вы обычно справляетесь со стрессом?",
  ],
  support: [
    "Ваши чувства важны. Давайте обсудим это.",
    "Иногда полезно поговорить с близкими. Вы пробовали?",
    "Попробуйте записать свои мысли. Это может помочь.",
    "Вы можете попробовать технику прогрессивной мышечной релаксации.",
    "Попробуйте представить себя в спокойном и безопасном месте.",
    "Вы можете попробовать медитацию для снятия стресса.",
    "Попробуйте разделить проблему на несколько маленьких шагов.",
    "Вы можете попробовать вести дневник для отслеживания своих эмоций.",
    "Попробуйте поговорить с кем-то, кому вы доверяете.",
    "Вы можете попробовать технику «5-4-3-2-1» для снятия тревоги.",
  ],
  farewell: "Рад был вам помочь! Перевожу на специалиста.",
};

// Текущий контекст диалога
let currentContext = "greeting"; // Начинаем с приветствия
let usedQuestions = []; // Отслеживаем использованные вопросы
let usedSupport = []; // Отслеживаем использованные фразы поддержки

// Добавление сообщения в чат
function addMessageToChat(message, isUser) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message', isUser ? 'user' : 'ai');

  // Добавляем подпись
  const senderElement = document.createElement('div');
  senderElement.classList.add('sender');
  senderElement.textContent = isUser ? 'Вы' : 'AI-ассистент';

  // Добавляем текст сообщения
  const textElement = document.createElement('div');
  textElement.textContent = message;

  messageElement.appendChild(senderElement);
  messageElement.appendChild(textElement);
  chatBox.appendChild(messageElement);

  // Прокрутка вниз
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Получение следующей фразы AI
function getNextResponse() {
  if (currentContext === "greeting") {
    currentContext = "questions"; // Переходим к вопросам после приветствия
    return aiResponses.greeting;
  }

  if (currentContext === "questions") {
    if (usedQuestions.length >= aiResponses.questions.length) {
      currentContext = "support"; // Если вопросы закончились, переходим к поддержке
    } else {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * aiResponses.questions.length);
      } while (usedQuestions.includes(randomIndex));

      usedQuestions.push(randomIndex); // Добавляем индекс в использованные
      return aiResponses.questions[randomIndex];
    }
  }

  if (currentContext === "support") {
    if (usedSupport.length >= aiResponses.support.length) {
      currentContext = "farewell"; // Если фразы поддержки закончились, завершаем диалог
    } else {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * aiResponses.support.length);
      } while (usedSupport.includes(randomIndex));

      usedSupport.push(randomIndex); // Добавляем индекс в использованные
      return aiResponses.support[randomIndex];
    }
  }

  if (currentContext === "farewell") {
    userInput.disabled = true; // Блокируем ввод
    sendBtn.disabled = true;
    return aiResponses.farewell;
  }
}

// Первое сообщение AI-ассистента
function showWelcomeMessage() {
  const welcomeMessage = getNextResponse();
  addMessageToChat(welcomeMessage, false);
}

// Показываем приветствие при загрузке страницы
window.onload = showWelcomeMessage;

// Обработка отправки сообщения
sendBtn.addEventListener('click', () => {
  const userMessage = userInput.value.trim();
  if (userMessage) {
    addMessageToChat(userMessage, true);
    userInput.value = '';

    // Имитация ответа AI
    setTimeout(() => {
      const aiMessage = getNextResponse();
      addMessageToChat(aiMessage, false);

      // Если это последняя фраза, блокируем ввод
      if (aiMessage === aiResponses.farewell) {
        userInput.disabled = true;
        sendBtn.disabled = true;
      }
    }, 1000);
  }
});

// Отправка по Enter
userInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    sendBtn.click();
  }
});