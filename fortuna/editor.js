// fortuna/editor.js
// Логика редактора для fortuna.html

document.addEventListener('DOMContentLoaded', function () {
  // Маппинг id полей редактора на селекторы элементов
  const fields = [
    { input: 'fortune-title', selector: '.fortune__text-1 p', type: 'text' },
    { input: 'fortune-subtitle', selector: '.fortune__text-2 h2', type: 'text' },
    { input: 'fortune-desc', selector: '.fortune__text-3 p', type: 'text' },
    { input: 'fortune-btn', selector: '.fortune__wheel_button', type: 'text' },
    { input: 'modal-title', selector: '.modal-content__title', type: 'text' },
    { input: 'modal-text', selector: '.modal-content__text', type: 'text' },
    { input: 'modal-btn', selector: '.btn-final', type: 'text' },
    { input: 'main-bg', selector: '.fortune-section', type: 'color', style: 'backgroundColor' },
    { input: 'fortune-bg', selector: '.fortune', type: 'color', style: 'backgroundColor' },
  ];

  fields.forEach(field => {
    const input = document.getElementById(field.input);
    if (!input) return;
    input.addEventListener('input', function () {
      const el = document.querySelector(field.selector);
      if (!el) return;
      if (field.type === 'text') {
        el.textContent = input.value;
      } else if (field.type === 'color') {
        el.style[field.style] = input.value;
      }
    });
  });

  // Изображения на колесе
  const wheelImgs = [
    { input: 'img-1', selector: '.wheel-img-holder:nth-child(1) img' },
    { input: 'img-2', selector: '.wheel-img-holder:nth-child(2) img' },
    { input: 'img-3', selector: '.wheel-img-holder:nth-child(3) img' },
    { input: 'img-4', selector: '.wheel-img-holder:nth-child(4) img' },
  ];
  wheelImgs.forEach((imgField) => {
    const input = document.getElementById(imgField.input);
    if (!input) return;
    input.addEventListener('change', function () {
      const file = input.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function (e) {
        const el = document.querySelector(imgField.selector);
        if (el) el.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  });

  // Ссылки (кнопка выигрыша и переход после вращения)
  const offerInput = document.getElementById('offer-link');
  if (offerInput) {
    offerInput.addEventListener('input', function () {
      window.goToOffer = function () {
        window.location.href = offerInput.value;
      };
    });
  }

  // Кнопка скачать изменённый код
  const downloadBtn = document.getElementById('download-btn');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', async function () {
      // Получаем текущее содержимое fortuna.html
      let htmlContent = document.documentElement.outerHTML;

      // Удаляем панель редактора и кнопку
      htmlContent = htmlContent.replace(/<button class=\"editor-toggle\"[\s\S]*?<\/button>/, '');
      htmlContent = htmlContent.replace(/<div class=\"editor-panel[\s\S]*?<\/div>/, '');
      // Скрываем editor-panel через стиль
      htmlContent = htmlContent.replace(
        /<style>/g,
        '<style>\n.editor-panel { display: none !important; }\n',
      );

      // Создаём zip-архив
      const zip = new JSZip();
      zip.file('fortuna.html', htmlContent);

      // Добавляем css и js файлы
      const files = [
        'editor.css',
        'editor.js',
      ];
      for (const file of files) {
        try {
          const response = await fetch(file);
          const content = await response.text();
          zip.file(file, content);
        } catch (error) {
          console.error(`Error loading file ${file}:`, error);
        }
      }

      // Добавляем изображения с колеса (если были изменены)
      const imgInputs = [
        { input: 'img-1', name: 'img1.png' },
        { input: 'img-2', name: 'img2.png' },
        { input: 'img-3', name: 'img3.png' },
        { input: 'img-4', name: 'img4.png' },
      ];
      for (const img of imgInputs) {
        const input = document.getElementById(img.input);
        if (input && input.files && input.files[0]) {
          zip.file(img.name, input.files[0]);
        }
      }

      // Сохраняем zip
      zip.generateAsync({ type: 'blob' }).then(function (content) {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = 'fortuna-template.zip';
        link.click();
      });
    });
  }

  // --- Переключение панели редактора и текста кнопки ---
  const editorPanel = document.querySelector('.editor-panel');
  const toggleButton = document.querySelector('.editor-toggle');
  if (editorPanel && toggleButton) {
    toggleButton.addEventListener('click', () => {
      editorPanel.classList.toggle('editor-panel--hidden');
      // Меняем текст кнопки в зависимости от состояния панели
      if (editorPanel.classList.contains('editor-panel--hidden')) {
        toggleButton.textContent = 'Показать панель';
      } else {
        toggleButton.textContent = 'Скрыть панель';
      }
    });
    // Устанавливаем начальный текст
    toggleButton.textContent = editorPanel.classList.contains('editor-panel--hidden') ? 'Показать панель' : 'Скрыть панель';
  }

  // --- Цвета секторов колеса ---
  function updateWheelColors() {
    const color1 = document.getElementById('wheel-color-1').value;
    const color2 = document.getElementById('wheel-color-2').value;
    const color3 = document.getElementById('wheel-color-3').value;
    const color4 = document.getElementById('wheel-color-4').value;
    const wheel = document.querySelector('.fortune__wheel');
    if (wheel) {
      wheel.style.background = `conic-gradient(${color1} 0deg 90deg, ${color2} 90deg 180deg, ${color3} 180deg 270deg, ${color4} 270deg 360deg)`;
    }
  }
  ['wheel-color-1','wheel-color-2','wheel-color-3','wheel-color-4'].forEach(id => {
    const input = document.getElementById(id);
    if (input) input.addEventListener('input', updateWheelColors);
  });
  // Инициализация цветов при загрузке
  updateWheelColors();

  // --- Цвет кнопки на колесе ---
  function updateWheelButtonColor() {
    const btnColor = document.getElementById('wheel-btn-color').value;
    const btn = document.querySelector('.fortune__wheel_button');
    if (btn) btn.style.background = btnColor;
  }
  const wheelBtnColorInput = document.getElementById('wheel-btn-color');
  if (wheelBtnColorInput) wheelBtnColorInput.addEventListener('input', updateWheelButtonColor);
  updateWheelButtonColor();

  // --- Замена изображения в модальном окне ---
  const modalImgInput = document.getElementById('modal-img');
  if (modalImgInput) {
    modalImgInput.addEventListener('change', function () {
      const file = modalImgInput.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function (e) {
        const modalImg = document.querySelector('.modal-content img');
        if (modalImg) modalImg.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  // Сброс к базовой версии
  window.resetToBase = function () {
    location.reload();
  };
}); 