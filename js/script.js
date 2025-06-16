const timerElem = document.querySelector('.gape__time');
let totalSeconds = 5 * 60;
let intervalId = null;

// Проверяем, находимся ли мы в режиме редактирования
const isEditMode = document.querySelector('.editor-panel') !== null;

function updateTimer() {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  timerElem.textContent = String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');

  if (totalSeconds > 0) {
    totalSeconds--;
  } else {
    clearInterval(intervalId);
    alert("It's time");
  }
}

// Функция для установки времени из редактора
function setTimerFromEditor(timeStr) {
  const [minutes, seconds] = timeStr.split(':').map(Number);
  totalSeconds = minutes * 60 + seconds;
  timerElem.textContent = timeStr;
}

// Запускаем таймер только если мы не в режиме редактирования
if (!isEditMode) {
  updateTimer();
  intervalId = setInterval(updateTimer, 1000);
}

// Слушаем изменения времени из редактора
if (isEditMode) {
  const timeInput = document.getElementById('game-time');
  if (timeInput) {
    timeInput.addEventListener('input', (e) => {
      const timePattern = /^([0-5][0-9]):([0-5][0-9])$/;
      if (timePattern.test(e.target.value)) {
        setTimerFromEditor(e.target.value);
      }
    });
  }
}

const gameItems = document.querySelectorAll('.game__item');

const popup1 = document.getElementById('popup1');
const popup2 = document.getElementById('popup2');

function openPopup(popup) {
  popup.classList.add('active');
}

function closePopup(popup) {
  popup.classList.remove('active');
}

document.querySelectorAll('.popup-close').forEach((btn) => {
  btn.addEventListener('click', () => {
    closePopup(btn.closest('.popup-overlay'));
  });
});

[popup1, popup2].forEach((popup) => {
  popup.addEventListener('click', (e) => {
    if (e.target === popup) closePopup(popup);
  });
});

let prizeIndex = 0;

gameItems.forEach((item) => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    const isDefaultStep0 = img.src.includes('step0.png');
    const isCustomStep0 = window.step0ImageUrl && img.src === window.step0ImageUrl;
    const isBase64Step0 = img.src.startsWith('data:image');
    if (!isDefaultStep0 && !isCustomStep0 && !isBase64Step0) return;

    if (prizeIndex === 1) {
      img.src = window.step2ImageUrl || 'img/step2.png';
      openPopup(popup2);
      prizeIndex++;
    } else {
      img.src = window.step1ImageUrl || 'img/step1.png';
      openPopup(popup1);
      prizeIndex++;
    }
  });
});
