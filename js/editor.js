document.addEventListener('DOMContentLoaded', function () {
  // Сохраняем базовый цвет баннера
  const baseBannerColor = document.querySelector('.banner').style.backgroundColor || '#ffffff';
  
  // Очищаем панель редактирования от старых полей
  const editorPanel = document.querySelector('.editor-panel');
  editorPanel.innerHTML = '';
  
  // Стилизуем панель редактирования
  editorPanel.style.padding = '20px';
  editorPanel.style.backgroundColor = '#f5f5f5';
  editorPanel.style.borderRadius = '10px';
  editorPanel.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
  editorPanel.style.maxWidth = '800px';
  editorPanel.style.margin = '20px auto';

  // Создаем секции для группировки элементов
  const sections = {
    banner: createSection('Настройки баннера'),
    game: createSection('Настройки игры'),
    popup1: createSection('Настройки первого попапа'),
    popup2: createSection('Настройки второго попапа'),
    images: createSection('Настройки изображений'),
    colors: createSection('Настройки цветов')
  };

  // Функция создания секции
  function createSection(title) {
    const section = document.createElement('div');
    section.style.marginBottom = '20px';
    section.style.padding = '15px';
    section.style.backgroundColor = 'white';
    section.style.borderRadius = '8px';
    section.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';

    const sectionTitle = document.createElement('h3');
    sectionTitle.textContent = title;
    sectionTitle.style.margin = '0 0 15px 0';
    sectionTitle.style.color = '#333';
    sectionTitle.style.fontSize = '16px';
    sectionTitle.style.fontWeight = '600';

    section.appendChild(sectionTitle);
    return section;
  }

  // Функция создания поля ввода
  function createInputField(label, fieldName, type = 'text') {
    const wrapper = document.createElement('div');
    wrapper.className = 'editor-field';
    
    const labelElement = document.createElement('label');
    labelElement.textContent = label;
    
    const input = document.createElement('input');
    input.type = type;
    input.className = 'editor-input';
    input.id = fieldName;
    
    // Получаем текущее значение из элемента с соответствующим data-field
    const targetElement = document.querySelector(`[data-field="${fieldName}"]`);
    if (targetElement) {
      input.value = targetElement.textContent.trim();
    }
    
    input.addEventListener('input', (e) => {
      if (targetElement) {
        targetElement.textContent = e.target.value;
      }
      updateContent();
    });
    
    wrapper.appendChild(labelElement);
    wrapper.appendChild(input);
    return wrapper;
  }

  // Функция создания загрузчика изображений
  function createImageUploader(label, fieldName) {
    const wrapper = document.createElement('div');
    wrapper.className = 'editor-field';
    
    const labelElement = document.createElement('label');
    labelElement.textContent = label;
    
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.className = 'editor-input';
    input.id = fieldName;
    
    input.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          // Determine the correct image name based on fieldName
          let imageName;
          switch(fieldName) {
            case 'logo-img':
              imageName = 'logo.png';
              break;
            case 'step0-img':
              imageName = 'step0.png';
              break;
            case 'step1-img':
              imageName = 'step1.png';
              break;
            case 'step2-img':
              imageName = 'step2.png';
              break;
          }

          // Store both the image data and its name
          const imageData = {
            data: event.target.result,
            name: imageName
          };

          switch(fieldName) {
            case 'logo-img':
              window.logoImageUrl = imageData;
              document.querySelector('.logo img').src = imageData.data;
              break;
            case 'step0-img':
              window.step0ImageUrl = imageData;
              document.querySelectorAll('.game__item img').forEach(img => {
                img.src = imageData.data;
              });
              break;
            case 'step1-img':
              window.step1ImageUrl = imageData;
              // Не меняем изображения на странице, только сохраняем URL
              break;
            case 'step2-img':
              window.step2ImageUrl = imageData;
              document.querySelector('#popup2 img').src = imageData.data;
              break;
          }
          saveToLocalStorage();
        };
        reader.readAsDataURL(file);
      }
    });
    
    wrapper.appendChild(labelElement);
    wrapper.appendChild(input);
    return wrapper;
  }

  // Добавляем поля в соответствующие секции
  sections.banner.appendChild(createInputField('Заголовок баннера', 'banner-title'));
  sections.banner.appendChild(createInputField('Текст баннера', 'banner-text'));
  sections.banner.appendChild(createInputField('Заголовок игры', 'game-title'));
  sections.banner.appendChild(createInputField('Время игры (мм:сс)', 'game-time'));

  sections.popup1.appendChild(createInputField('Заголовок первого попапа', 'popup1-title'));
  sections.popup1.appendChild(createInputField('Текст первого попапа', 'popup1-text'));

  sections.popup2.appendChild(createInputField('Заголовок второго попапа', 'popup2-title'));
  sections.popup2.appendChild(createInputField('Подзаголовок второго попапа', 'popup2-subtitle'));
  sections.popup2.appendChild(createInputField('Инструкции второго попапа', 'popup2-instructions'));
  sections.popup2.appendChild(createInputField('Текст финальной кнопки', 'final-btn-text'));

  sections.images.appendChild(createImageUploader('Логотип', 'logo-img'));
  sections.images.appendChild(createImageUploader('Изображение банка (начальное)', 'step0-img'));
  sections.images.appendChild(createImageUploader('Изображение банка (после первого клика)', 'step1-img'));
  sections.images.appendChild(createImageUploader('Изображение банка (после второго клика)', 'step2-img'));

  sections.colors.appendChild(createInputField('Цвет фона баннера', 'banner-bg-color', 'color'));
  sections.colors.appendChild(createInputField('Цвет фона страницы', 'background-color', 'color'));

  // Добавляем поля для размеров
  sections.images.appendChild(createInputField('Размер логотипа (px)', 'logo-size', 'number'));
  sections.images.appendChild(createInputField('Размер банков (px)', 'game-item-size', 'number'));

  // Добавляем секции в панель редактирования
  Object.values(sections).forEach(section => {
    editorPanel.appendChild(section);
  });

  // Добавляем кнопку скачивания
  const downloadButton = document.createElement('button');
  downloadButton.className = 'editor-download';
  downloadButton.textContent = 'Скачать шаблон';
  downloadButton.style.width = '100%';
  downloadButton.style.padding = '12px 24px';
  downloadButton.style.backgroundColor = '#4CAF50';
  downloadButton.style.color = 'white';
  downloadButton.style.border = 'none';
  downloadButton.style.borderRadius = '6px';
  downloadButton.style.cursor = 'pointer';
  downloadButton.style.fontSize = '14px';
  downloadButton.style.fontWeight = '500';
  downloadButton.style.marginTop = '20px';
  downloadButton.style.transition = 'background-color 0.2s';

  downloadButton.addEventListener('mouseover', () => {
    downloadButton.style.backgroundColor = '#388E3C';
  });

  downloadButton.addEventListener('mouseout', () => {
    downloadButton.style.backgroundColor = '#4CAF50';
  });

  // Добавляем кнопку сброса к базовой версии
  const resetButton = document.createElement('button');
  resetButton.className = 'editor-reset';
  resetButton.textContent = 'Вернуться к базовой версии';
  resetButton.style.width = '100%';
  resetButton.style.padding = '12px 24px';
  resetButton.style.backgroundColor = '#f44336';
  resetButton.style.color = 'white';
  resetButton.style.border = 'none';
  resetButton.style.borderRadius = '6px';
  resetButton.style.cursor = 'pointer';
  resetButton.style.fontSize = '14px';
  resetButton.style.fontWeight = '500';
  resetButton.style.marginTop = '10px';
  resetButton.style.transition = 'background-color 0.2s';

  resetButton.addEventListener('mouseover', () => {
    resetButton.style.backgroundColor = '#d32f2f';
  });

  resetButton.addEventListener('mouseout', () => {
    resetButton.style.backgroundColor = '#f44336';
  });

  resetButton.addEventListener('click', () => {
    if (confirm('Вы уверены, что хотите вернуться к базовой версии? Все изменения будут потеряны.')) {
      localStorage.setItem('templateSettings', '');
      localStorage.removeItem('templateSettings');
      location.reload();
    }
  });

  editorPanel.appendChild(downloadButton);
  editorPanel.appendChild(resetButton);

  const button = document.querySelector('.final_btn');
  if (button) {
    button.addEventListener('click', function (event) {
      event.preventDefault();
      window.location.href = '/click.php?lp=1&uclick=ojvcbg6o';
    });
  }

  // Функция сохранения в localStorage
  function saveToLocalStorage() {
    const settings = {
      bannerTitle: document.getElementById('banner-title').value,
      bannerText: document.getElementById('banner-text').value,
      gameTitle: document.getElementById('game-title').value,
      gameTime: document.getElementById('game-time').value,
      popup1Title: document.getElementById('popup1-title').value,
      popup1Text: document.getElementById('popup1-text').value,
      popup2Title: document.getElementById('popup2-title').value,
      popup2Subtitle: document.getElementById('popup2-subtitle').value,
      popup2Instructions: document.getElementById('popup2-instructions').value,
      finalBtnText: document.getElementById('final-btn-text').value,
      logoSize: document.getElementById('logo-size').value,
      gameItemSize: document.getElementById('game-item-size').value,
      bannerBgColor: document.getElementById('banner-bg-color').value,
      backgroundColor: document.getElementById('background-color').value,
      logoImage: window.logoImageUrl,
      step0Image: window.step0ImageUrl,
      step1Image: window.step1ImageUrl,
      step2Image: window.step2ImageUrl
    };
    localStorage.setItem('templateSettings', JSON.stringify(settings));
  }

  // Функция загрузки из localStorage
  function loadFromLocalStorage() {
    const savedSettings = localStorage.getItem('templateSettings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        
        // Заполняем все поля
        document.getElementById('banner-title').value = settings.bannerTitle || '';
        document.getElementById('banner-text').value = settings.bannerText || '';
        document.getElementById('game-title').value = settings.gameTitle || '';
        document.getElementById('game-time').value = settings.gameTime || '05:00';
        document.getElementById('popup1-title').value = settings.popup1Title || '';
        document.getElementById('popup1-text').value = settings.popup1Text || '';
        document.getElementById('popup2-title').value = settings.popup2Title || '';
        document.getElementById('popup2-subtitle').value = settings.popup2Subtitle || '';
        document.getElementById('popup2-instructions').value = settings.popup2Instructions || '';
        document.getElementById('final-btn-text').value = settings.finalBtnText || '';
        document.getElementById('logo-size').value = settings.logoSize || '100';
        document.getElementById('game-item-size').value = settings.gameItemSize || '100';
        document.getElementById('banner-bg-color').value = settings.bannerBgColor || '#ffffff';
        document.getElementById('background-color').value = settings.backgroundColor || '#ffffff';
        
        // Восстанавливаем изображения
        if (settings.logoImage) {
          window.logoImageUrl = settings.logoImage;
          document.querySelector('.logo img').src = settings.logoImage.data;
        }
        if (settings.step0Image) {
          window.step0ImageUrl = settings.step0Image;
          document.querySelectorAll('.game__item img').forEach(img => {
            img.src = settings.step0Image.data;
          });
        }
        if (settings.step1Image) {
          window.step1ImageUrl = settings.step1Image;
          // Не применяем step1 к банкам при загрузке
        }
        if (settings.step2Image) {
          window.step2ImageUrl = settings.step2Image;
          document.querySelector('#popup2 img').src = settings.step2Image.data;
        }
        
        // Обновляем контент
        updateContent();
      } catch (error) {
        console.error('Ошибка при загрузке настроек:', error);
      }
    }
  }

  function updateContent() {
    // Обновляем текстовые поля
    document.querySelectorAll('[data-field]').forEach(element => {
      const fieldId = element.getAttribute('data-field');
      const input = document.getElementById(fieldId);
      if (input) {
        if (fieldId === 'game-time') {
          // Проверяем формат времени (мм:сс)
          const timePattern = /^([0-5][0-9]):([0-5][0-9])$/;
          if (timePattern.test(input.value)) {
            element.textContent = input.value;
          }
        } else {
          element.textContent = input.value;
        }
      }
    });

    // Обновляем изображения
    const logoImg = document.querySelector('.logo img');
    const gameItems = document.querySelectorAll('.game__item img');
    const popup2Img = document.querySelector('#popup2 img');

    if (logoImg && window.logoImageUrl) {
      logoImg.src = window.logoImageUrl.data;
    }

    // Обновляем только начальное состояние банков
    gameItems.forEach(item => {
      if (window.step0ImageUrl) {
        item.src = window.step0ImageUrl.data;
      }
    });

    if (popup2Img && window.step2ImageUrl) {
      popup2Img.src = window.step2ImageUrl.data;
    }

    // Обновляем цвета
    const bannerBgColor = document.getElementById('banner-bg-color').value;
    document.querySelector('.banner').style.backgroundColor = bannerBgColor;

    // Обновляем размеры
    const logoSize = document.getElementById('logo-size').value;
    const gameItemSize = document.getElementById('game-item-size').value;

    if (logoImg) {
      logoImg.style.width = `${logoSize}px`;
      logoImg.style.height = 'auto';
    }

    gameItems.forEach(item => {
      item.style.width = `${gameItemSize}px`;
      item.style.height = 'auto';
    });

    // Сохраняем изменения
    saveToLocalStorage();
  }

  // Обработка загрузки изображений
  function previewImage(input, previewElement) {
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = function(e) {
        previewElement.src = e.target.result;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  // Добавляем предпросмотр для всех загрузчиков изображений
  document.getElementById('logo-img').addEventListener('change', function() {
    previewImage(this, document.querySelector('.logo img'));
  });

  document.getElementById('step0-img').addEventListener('change', function() {
    const preview = document.querySelector('.game__item img');
    previewImage(this, preview);
  });

  // Удаляем предпросмотр для step1-img, так как он не должен применяться к банкам
  // document.getElementById('step1-img').addEventListener('change', function() {
  //   const preview = document.querySelector('.game__item img');
  //   previewImage(this, preview);
  // });

  document.getElementById('step2-img').addEventListener('change', function() {
    const preview = document.querySelector('#popup2 img');
    previewImage(this, preview);
  });

  // Загружаем сохраненные настройки при загрузке страницы
  loadFromLocalStorage();

  // Обновляем обработчик клика по банкам
  const gameItems = document.querySelectorAll('.game__item');
  let prizeIndex = 0;
  gameItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      // Проверяем, что текущее изображение - это step0.png
      const isDefaultStep0 = img.src.includes('step0.png');
      const isCustomStep0 = window.step0ImageUrl && img.src === window.step0ImageUrl.data;
      
      if (!isDefaultStep0 && !isCustomStep0) return;

      if (prizeIndex === 1) {
        img.src = window.step2ImageUrl ? window.step2ImageUrl.data : 'img/step2.png';
        openPopup(popup2);
        prizeIndex++;
      } else {
        img.src = window.step1ImageUrl ? window.step1ImageUrl.data : 'img/step1.png';
        openPopup(popup1);
        prizeIndex++;
      }
    });
  });

  downloadButton.addEventListener('click', async () => {
    try {
      const zip = new JSZip();

      // Клонируем документ
      const docClone = document.cloneNode(true);
      
      // Удаляем панель редактирования и кнопку переключения
      const editorPanel = docClone.querySelector('.editor-panel');
      const editorToggle = docClone.querySelector('.editor-toggle');
      if (editorPanel) editorPanel.remove();
      if (editorToggle) editorToggle.remove();

      // Удаляем скрипты редактора
      const scripts = docClone.querySelectorAll('script');
      scripts.forEach(script => {
        if (script.src.includes('editor.js') || script.src.includes('toggle.js')) {
          script.remove();
        }
      });

      // Создаем новый script.js с обновленным таймером
      const timeInput = document.getElementById('game-time');
      const timeValue = timeInput ? timeInput.value : '05:00';
      const [minutes, seconds] = timeValue.split(':').map(Number);
      const totalSeconds = minutes * 60 + seconds;

      const scriptContent = `
// Таймер
const timerElem = document.querySelector('.gape__time');
let totalSeconds = ${totalSeconds};
let intervalId = null;

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

// Запускаем таймер
updateTimer();
intervalId = setInterval(updateTimer, 1000);

// Попапы
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

// Игра
const gameItems = document.querySelectorAll('.game__item');
let prizeIndex = 0;

gameItems.forEach((item) => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    const currentImg = img.src.split('/').pop();
    if (currentImg !== 'step0.png') return;

    if (prizeIndex === 1) {
      img.src = 'img/step2.png';
      openPopup(popup2);
      prizeIndex++;
    } else {
      img.src = 'img/step1.png';
      openPopup(popup1);
      prizeIndex++;
    }
  });
});`;

      // Обновляем пути к изображениям в HTML
      const htmlContent = docClone.documentElement.outerHTML;
      const updatedHtml = htmlContent
        .replace(/src="[^"]+"/g, (match) => {
          const src = match.slice(5, -1);
          if (src.startsWith('data:')) {
            // Для data URL используем имя файла из оригинального изображения
            const originalImg = document.querySelector(`img[src="${src}"]`);
            if (originalImg) {
              let imageData;
              if (window.logoImageUrl && originalImg.src === window.logoImageUrl.data) {
                imageData = window.logoImageUrl;
              } else if (window.step0ImageUrl && originalImg.src === window.step0ImageUrl.data) {
                imageData = window.step0ImageUrl;
              } else if (window.step1ImageUrl && originalImg.src === window.step1ImageUrl.data) {
                imageData = window.step1ImageUrl;
              } else if (window.step2ImageUrl && originalImg.src === window.step2ImageUrl.data) {
                imageData = window.step2ImageUrl;
              }
              if (imageData) {
                return `src="img/${imageData.name}"`;
              }
            }
          }
          // Для обычных путей просто обновляем на относительный путь
          const fileName = src.split('/').pop();
          return `src="img/${fileName}"`;
        })
        .replace(/src="img\/script\.js"/g, 'src="js/script.js"'); // Исправляем путь к script.js

      // Добавляем файлы в zip
      zip.file('index.html', updatedHtml);
      zip.file('js/script.js', scriptContent);

      // Добавляем CSS файлы
      const cssFiles = ['styles/null.css', 'styles/style.css', 'styles/popup.css'];
      for (const cssFile of cssFiles) {
        try {
          const response = await fetch(cssFile);
          if (!response.ok) throw new Error(`Failed to fetch ${cssFile}`);
          const cssContent = await response.text();
          zip.file(cssFile, cssContent);
        } catch (error) {
          console.error(`Error fetching ${cssFile}:`, error);
        }
      }

      // Добавляем изображения
      const images = [
        { data: window.logoImageUrl, name: 'logo.png' },
        { data: window.step0ImageUrl, name: 'step0.png' },
        { data: window.step1ImageUrl, name: 'step1.png' },
        { data: window.step2ImageUrl, name: 'step2.png' }
      ];

      for (const image of images) {
        if (image.data) {
          try {
            const response = await fetch(image.data.data);
            if (!response.ok) throw new Error(`Failed to fetch image ${image.name}`);
            const blob = await response.blob();
            zip.file(`img/${image.name}`, blob);
          } catch (error) {
            console.error(`Error fetching image ${image.name}:`, error);
          }
        }
      }

      // Генерируем и скачиваем zip
      const content = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = 'template.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error creating zip:', error);
      alert('Произошла ошибка при создании архива. Пожалуйста, попробуйте еще раз.');
    }
  });
}); 