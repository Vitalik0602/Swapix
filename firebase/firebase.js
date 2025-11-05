// Настройки Telegram
const TELEGRAM_BOT_TOKEN = 'PASTE_YOUR_TELEGRAM_BOT_TOKEN';
const TELEGRAM_CHAT_ID = 'PASTE_YOUR_CHAT_ID';
const TG_API = TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID
  ? `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`
  : null;

// Данные автомобилей
const cars = [
  {
    id: 'audi-q8',
    brand: 'Audi',
    model: 'Q8 3.0 TFSI quattro',
    year: 2019,
    price: 4300000,
    body: 'Кроссовер',
    fuel: 'Бензин',
    trans: 'АКПП',
    power: '340 л.с.',
    drive: 'AWD',
    images: ['img/audi-q8.jpg'],
    badge: 'В наличии',
    km: 45000
  },
  // ... (остальные автомобили остаются без изменений)
];

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
  // Бургер-меню
  const burger = document.querySelector('.burger');
  const navLinks = document.querySelector('.nav-links');
  burger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });

  // Динамическое заполнение поля выбора автомобиля
  const carSelect = document.querySelector('.request select:nth-of-type(2)');
  carSelect.innerHTML = '<option>-- Выберите автомобиль --</option>' + 
    cars.map(car => `<option value="${car.model}">${car.model} (${car.year})</option>`).join('');

  // Отправка формы через Telegram
  const sendBtn = document.querySelector('.request .btn-acc');
  sendBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const form = document.querySelector('.request .panel');
    const inputs = form.querySelectorAll('select, input, textarea');
    let message = '';
    inputs.forEach(input => {
      if (input.value && input.value !== '-- Выберите --' && input.value !== '-- Выберите автомобиль --') {
        const label = input.previousElementSibling?.textContent || input.name;
        message += `<b>${label}</b>: ${input.value}\n`;
      }
    });

    if (TG_API && message) {
      try {
        const response = await fetch(TG_API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: message,
            parse_mode: 'HTML'
          })
        });
        if (response.ok) {
          showToast('Заявка успешно отправлена!');
        } else {
          showToast('Ошибка отправки заявки', true);
        }
      } catch (error) {
        showToast('Ошибка отправки: ' + error.message, true);
      }
    } else {
      showToast('Ошибка: Telegram API не настроен или форма пуста', true);
    }
  });

  // Тост-уведомления
  function showToast(message, isError = false) {
    const toast = document.createElement('div');
    toast.className = `toast ${isError ? 'err' : 'ok'}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
});