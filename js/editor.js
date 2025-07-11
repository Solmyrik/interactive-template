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
    images: createSection('Настройки изображений (использовать только png)'),
    colors: createSection('Настройки цветов'),
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

    let input;
    // Для полей времени, размеров и цветов используем input, для остальных textarea
    if (
      fieldName === 'game-time' ||
      fieldName === 'logo-size' ||
      fieldName === 'game-item-size' ||
      type === 'color'
    ) {
      input = document.createElement('input');
      input.type = type;
      // Стилизация для размеров
      if (fieldName === 'logo-size' || fieldName === 'game-item-size') {
        input.style.width = '100%';
        input.style.padding = '8px 12px';
        input.style.border = '1px solid #ccc';
        input.style.borderRadius = '4px';
        input.style.background = '#fff';
        input.style.fontSize = '15px';
        input.style.marginTop = '6px';
        input.style.marginBottom = '6px';
        input.style.boxSizing = 'border-box';
      }
    } else {
      input = document.createElement('textarea');
      input.rows = 2;
    }
    input.className = 'editor-input';
    input.id = fieldName;

    // Получаем текущее значение из элемента с соответствующим data-field
    const targetElement = document.querySelector(`[data-field="${fieldName}"]`);
    if (targetElement) {
      input.value = targetElement.textContent.trim().replace(/<br\s*\/?>/gi, '\n');
    }

    input.addEventListener('input', (e) => {
      if (targetElement) {
        if (
          input.tagName === 'TEXTAREA' &&
          fieldName !== 'logo-size' &&
          fieldName !== 'game-item-size' &&
          fieldName !== 'banner-bg-color' &&
          fieldName !== 'background-color'
        ) {
          targetElement.innerHTML = e.target.value.replace(/\n/g, '<br>');
        } else {
          targetElement.textContent = e.target.value;
        }
      }
      updateContent();
    });

    // Для Заголовок баннера добавляем особое оформление
    if (fieldName === 'banner-title') {
      // Контейнер для всех настроек заголовка
      const settingsDiv = document.createElement('div');
      settingsDiv.style.background = '#f8f8fa';
      settingsDiv.style.padding = '16px';
      settingsDiv.style.borderRadius = '8px';
      settingsDiv.style.marginBottom = '16px';
      // Заголовок секции
      const sectionTitle = document.createElement('div');
      sectionTitle.textContent = 'Настройки заголовка баннера';
      sectionTitle.style.fontWeight = 'bold';
      sectionTitle.style.marginBottom = '8px';
      settingsDiv.appendChild(sectionTitle);
      // Текстовое поле
      settingsDiv.appendChild(input);
      // Контейнер для цвет+размер в ряд
      const row = document.createElement('div');
      row.style.display = 'flex';
      row.style.gap = '12px';
      row.style.marginTop = '8px';
      // Цвет
      const colorInput = document.createElement('input');
      colorInput.type = 'color';
      colorInput.title = 'Цвет текста';
      colorInput.value =
        targetElement && targetElement.style.color
          ? rgb2hex(getComputedStyle(targetElement).color)
          : '#222222';
      colorInput.style.flex = '0 0 20px';
      colorInput.style.width = '20px';
      colorInput.style.height = '20px';
      colorInput.style.border = 'none';
      colorInput.style.borderRadius = '50%';
      colorInput.style.overflow = 'hidden';
      colorInput.style.padding = '0';
      colorInput.style.background = 'none';
      // Размер
      const sizeInput = document.createElement('input');
      sizeInput.type = 'number';
      sizeInput.min = 10;
      sizeInput.max = 72;
      sizeInput.title = 'Размер текста (px)';
      sizeInput.style.width = '70px';
      sizeInput.style.padding = '4px 8px';
      sizeInput.style.border = '1px solid #ccc';
      sizeInput.style.borderRadius = '4px';
      sizeInput.style.fontSize = '14px';
      sizeInput.style.background = '#fff';
      sizeInput.style.boxSizing = 'border-box';
      sizeInput.value = targetElement ? parseInt(getComputedStyle(targetElement).fontSize) : 32;
      // Синхронизация
      colorInput.addEventListener('input', (e) => {
        if (targetElement) targetElement.style.color = e.target.value;
        updateContent();
      });
      sizeInput.addEventListener('input', (e) => {
        if (targetElement) targetElement.style.fontSize = e.target.value + 'px';
        updateContent();
      });
      row.appendChild(colorInput);
      row.appendChild(sizeInput);
      settingsDiv.appendChild(row);
      wrapper.appendChild(settingsDiv);
      return wrapper;
    }
    // Для Текст баннера добавляем особое оформление
    if (fieldName === 'banner-text') {
      // Контейнер для всех настроек текста баннера
      const settingsDiv = document.createElement('div');
      settingsDiv.style.background = '#f8f8fa';
      settingsDiv.style.padding = '16px';
      settingsDiv.style.borderRadius = '8px';
      settingsDiv.style.marginBottom = '16px';
      // Заголовок секции
      const sectionTitle = document.createElement('div');
      sectionTitle.textContent = 'Настройки текста баннера';
      sectionTitle.style.fontWeight = 'bold';
      sectionTitle.style.marginBottom = '8px';
      settingsDiv.appendChild(sectionTitle);
      // Текстовое поле
      settingsDiv.appendChild(input);
      // Контейнер для цвет+размер в ряд
      const row = document.createElement('div');
      row.style.display = 'flex';
      row.style.gap = '12px';
      row.style.marginTop = '8px';
      // Цвет
      const colorInput = document.createElement('input');
      colorInput.type = 'color';
      colorInput.title = 'Цвет текста';
      colorInput.value =
        targetElement && targetElement.style.color
          ? rgb2hex(getComputedStyle(targetElement).color)
          : '#222222';
      colorInput.style.flex = '0 0 20px';
      colorInput.style.width = '20px';
      colorInput.style.height = '20px';
      colorInput.style.border = 'none';
      colorInput.style.borderRadius = '50%';
      colorInput.style.overflow = 'hidden';
      colorInput.style.padding = '0';
      colorInput.style.background = 'none';
      // Размер
      const sizeInput = document.createElement('input');
      sizeInput.type = 'number';
      sizeInput.min = 10;
      sizeInput.max = 72;
      sizeInput.title = 'Размер текста (px)';
      sizeInput.style.width = '70px';
      sizeInput.style.padding = '4px 8px';
      sizeInput.style.border = '1px solid #ccc';
      sizeInput.style.borderRadius = '4px';
      sizeInput.style.fontSize = '14px';
      sizeInput.style.background = '#fff';
      sizeInput.style.boxSizing = 'border-box';
      sizeInput.value = targetElement ? parseInt(getComputedStyle(targetElement).fontSize) : 16;
      // Синхронизация
      colorInput.addEventListener('input', (e) => {
        if (targetElement) targetElement.style.color = e.target.value;
        updateContent();
      });
      sizeInput.addEventListener('input', (e) => {
        if (targetElement) targetElement.style.fontSize = e.target.value + 'px';
        updateContent();
      });
      row.appendChild(colorInput);
      row.appendChild(sizeInput);
      settingsDiv.appendChild(row);
      wrapper.appendChild(settingsDiv);
      return wrapper;
    }
    // Для Заголовок игры добавляем особое оформление
    if (fieldName === 'game-title') {
      // Контейнер для всех настроек заголовка игры
      const settingsDiv = document.createElement('div');
      settingsDiv.style.background = '#f8f8fa';
      settingsDiv.style.padding = '16px';
      settingsDiv.style.borderRadius = '8px';
      settingsDiv.style.marginBottom = '16px';
      // Заголовок секции
      const sectionTitle = document.createElement('div');
      sectionTitle.textContent = 'Настройки заголовка игры';
      sectionTitle.style.fontWeight = 'bold';
      sectionTitle.style.marginBottom = '8px';
      settingsDiv.appendChild(sectionTitle);
      // Текстовое поле
      settingsDiv.appendChild(input);
      // Контейнер для цвет+размер в ряд
      const row = document.createElement('div');
      row.style.display = 'flex';
      row.style.gap = '12px';
      row.style.marginTop = '8px';
      // Цвет
      const colorInput = document.createElement('input');
      colorInput.type = 'color';
      colorInput.title = 'Цвет текста';
      colorInput.value =
        targetElement && targetElement.style.color
          ? rgb2hex(getComputedStyle(targetElement).color)
          : '#222222';
      colorInput.style.flex = '0 0 20px';
      colorInput.style.width = '20px';
      colorInput.style.height = '20px';
      colorInput.style.border = 'none';
      colorInput.style.borderRadius = '50%';
      colorInput.style.overflow = 'hidden';
      colorInput.style.padding = '0';
      colorInput.style.background = 'none';
      // Размер
      const sizeInput = document.createElement('input');
      sizeInput.type = 'number';
      sizeInput.min = 10;
      sizeInput.max = 72;
      sizeInput.title = 'Размер текста (px)';
      sizeInput.style.width = '70px';
      sizeInput.style.padding = '4px 8px';
      sizeInput.style.border = '1px solid #ccc';
      sizeInput.style.borderRadius = '4px';
      sizeInput.style.fontSize = '14px';
      sizeInput.style.background = '#fff';
      sizeInput.style.boxSizing = 'border-box';
      sizeInput.value = targetElement ? parseInt(getComputedStyle(targetElement).fontSize) : 24;
      // Синхронизация
      colorInput.addEventListener('input', (e) => {
        if (targetElement) targetElement.style.color = e.target.value;
        updateContent();
      });
      sizeInput.addEventListener('input', (e) => {
        if (targetElement) targetElement.style.fontSize = e.target.value + 'px';
        updateContent();
      });
      row.appendChild(colorInput);
      row.appendChild(sizeInput);
      settingsDiv.appendChild(row);
      wrapper.appendChild(settingsDiv);
      return wrapper;
    }
    // Для Заголовок первого попапа добавляем особое оформление
    if (fieldName === 'popup1-title') {
      const settingsDiv = document.createElement('div');
      settingsDiv.style.background = '#f8f8fa';
      settingsDiv.style.padding = '16px';
      settingsDiv.style.borderRadius = '8px';
      settingsDiv.style.marginBottom = '16px';
      const sectionTitle = document.createElement('div');
      sectionTitle.textContent = 'Настройки заголовка первого попапа';
      sectionTitle.style.fontWeight = 'bold';
      sectionTitle.style.marginBottom = '8px';
      settingsDiv.appendChild(sectionTitle);
      settingsDiv.appendChild(input);
      const row = document.createElement('div');
      row.style.display = 'flex';
      row.style.gap = '12px';
      row.style.marginTop = '8px';
      const colorInput = document.createElement('input');
      colorInput.type = 'color';
      colorInput.title = 'Цвет текста';
      colorInput.value =
        targetElement && targetElement.style.color
          ? rgb2hex(getComputedStyle(targetElement).color)
          : '#222222';
      colorInput.style.flex = '0 0 20px';
      colorInput.style.width = '20px';
      colorInput.style.height = '20px';
      colorInput.style.border = 'none';
      colorInput.style.borderRadius = '50%';
      colorInput.style.overflow = 'hidden';
      colorInput.style.padding = '0';
      colorInput.style.background = 'none';
      const sizeInput = document.createElement('input');
      sizeInput.type = 'number';
      sizeInput.min = 10;
      sizeInput.max = 72;
      sizeInput.title = 'Размер текста (px)';
      sizeInput.style.width = '70px';
      sizeInput.style.padding = '4px 8px';
      sizeInput.style.border = '1px solid #ccc';
      sizeInput.style.borderRadius = '4px';
      sizeInput.style.fontSize = '14px';
      sizeInput.style.background = '#fff';
      sizeInput.style.boxSizing = 'border-box';
      sizeInput.value = targetElement ? parseInt(getComputedStyle(targetElement).fontSize) : 24;
      colorInput.addEventListener('input', (e) => {
        if (targetElement) targetElement.style.color = e.target.value;
        updateContent();
      });
      sizeInput.addEventListener('input', (e) => {
        if (targetElement) targetElement.style.fontSize = e.target.value + 'px';
        updateContent();
      });
      row.appendChild(colorInput);
      row.appendChild(sizeInput);
      settingsDiv.appendChild(row);
      wrapper.appendChild(settingsDiv);
      return wrapper;
    }
    // Для Текст первого попапа добавляем особое оформление
    if (fieldName === 'popup1-text') {
      const settingsDiv = document.createElement('div');
      settingsDiv.style.background = '#f8f8fa';
      settingsDiv.style.padding = '16px';
      settingsDiv.style.borderRadius = '8px';
      settingsDiv.style.marginBottom = '16px';
      const sectionTitle = document.createElement('div');
      sectionTitle.textContent = 'Настройки текста первого попапа';
      sectionTitle.style.fontWeight = 'bold';
      sectionTitle.style.marginBottom = '8px';
      settingsDiv.appendChild(sectionTitle);
      settingsDiv.appendChild(input);
      const row = document.createElement('div');
      row.style.display = 'flex';
      row.style.gap = '12px';
      row.style.marginTop = '8px';
      const colorInput = document.createElement('input');
      colorInput.type = 'color';
      colorInput.title = 'Цвет текста';
      colorInput.value =
        targetElement && targetElement.style.color
          ? rgb2hex(getComputedStyle(targetElement).color)
          : '#222222';
      colorInput.style.flex = '0 0 20px';
      colorInput.style.width = '20px';
      colorInput.style.height = '20px';
      colorInput.style.border = 'none';
      colorInput.style.borderRadius = '50%';
      colorInput.style.overflow = 'hidden';
      colorInput.style.padding = '0';
      colorInput.style.background = 'none';
      const sizeInput = document.createElement('input');
      sizeInput.type = 'number';
      sizeInput.min = 10;
      sizeInput.max = 72;
      sizeInput.title = 'Размер текста (px)';
      sizeInput.style.width = '70px';
      sizeInput.style.padding = '4px 8px';
      sizeInput.style.border = '1px solid #ccc';
      sizeInput.style.borderRadius = '4px';
      sizeInput.style.fontSize = '14px';
      sizeInput.style.background = '#fff';
      sizeInput.style.boxSizing = 'border-box';
      sizeInput.value = targetElement ? parseInt(getComputedStyle(targetElement).fontSize) : 16;
      colorInput.addEventListener('input', (e) => {
        if (targetElement) targetElement.style.color = e.target.value;
        updateContent();
      });
      sizeInput.addEventListener('input', (e) => {
        if (targetElement) targetElement.style.fontSize = e.target.value + 'px';
        updateContent();
      });
      row.appendChild(colorInput);
      row.appendChild(sizeInput);
      settingsDiv.appendChild(row);
      wrapper.appendChild(settingsDiv);
      return wrapper;
    }
    // Для Заголовок второго попапа добавляем особое оформление
    if (fieldName === 'popup2-title') {
      const settingsDiv = document.createElement('div');
      settingsDiv.style.background = '#f8f8fa';
      settingsDiv.style.padding = '16px';
      settingsDiv.style.borderRadius = '8px';
      settingsDiv.style.marginBottom = '16px';
      const sectionTitle = document.createElement('div');
      sectionTitle.textContent = 'Настройки заголовка второго попапа';
      sectionTitle.style.fontWeight = 'bold';
      sectionTitle.style.marginBottom = '8px';
      settingsDiv.appendChild(sectionTitle);
      settingsDiv.appendChild(input);
      const row = document.createElement('div');
      row.style.display = 'flex';
      row.style.gap = '12px';
      row.style.marginTop = '8px';
      const colorInput = document.createElement('input');
      colorInput.type = 'color';
      colorInput.title = 'Цвет текста';
      colorInput.value =
        targetElement && targetElement.style.color
          ? rgb2hex(getComputedStyle(targetElement).color)
          : '#222222';
      colorInput.style.flex = '0 0 20px';
      colorInput.style.width = '20px';
      colorInput.style.height = '20px';
      colorInput.style.border = 'none';
      colorInput.style.borderRadius = '50%';
      colorInput.style.overflow = 'hidden';
      colorInput.style.padding = '0';
      colorInput.style.background = 'none';
      const sizeInput = document.createElement('input');
      sizeInput.type = 'number';
      sizeInput.min = 10;
      sizeInput.max = 72;
      sizeInput.title = 'Размер текста (px)';
      sizeInput.style.width = '70px';
      sizeInput.style.padding = '4px 8px';
      sizeInput.style.border = '1px solid #ccc';
      sizeInput.style.borderRadius = '4px';
      sizeInput.style.fontSize = '14px';
      sizeInput.style.background = '#fff';
      sizeInput.style.boxSizing = 'border-box';
      sizeInput.value = targetElement ? parseInt(getComputedStyle(targetElement).fontSize) : 24;
      colorInput.addEventListener('input', (e) => {
        if (targetElement) targetElement.style.color = e.target.value;
        updateContent();
      });
      sizeInput.addEventListener('input', (e) => {
        if (targetElement) targetElement.style.fontSize = e.target.value + 'px';
        updateContent();
      });
      row.appendChild(colorInput);
      row.appendChild(sizeInput);
      settingsDiv.appendChild(row);
      wrapper.appendChild(settingsDiv);
      return wrapper;
    }
    // Для Подзаголовок второго попапа добавляем особое оформление
    if (fieldName === 'popup2-subtitle') {
      const settingsDiv = document.createElement('div');
      settingsDiv.style.background = '#f8f8fa';
      settingsDiv.style.padding = '16px';
      settingsDiv.style.borderRadius = '8px';
      settingsDiv.style.marginBottom = '16px';
      const sectionTitle = document.createElement('div');
      sectionTitle.textContent = 'Настройки подзаголовка второго попапа';
      sectionTitle.style.fontWeight = 'bold';
      sectionTitle.style.marginBottom = '8px';
      settingsDiv.appendChild(sectionTitle);
      settingsDiv.appendChild(input);
      const row = document.createElement('div');
      row.style.display = 'flex';
      row.style.gap = '12px';
      row.style.marginTop = '8px';
      const colorInput = document.createElement('input');
      colorInput.type = 'color';
      colorInput.title = 'Цвет текста';
      colorInput.value =
        targetElement && targetElement.style.color
          ? rgb2hex(getComputedStyle(targetElement).color)
          : '#222222';
      colorInput.style.flex = '0 0 20px';
      colorInput.style.width = '20px';
      colorInput.style.height = '20px';
      colorInput.style.border = 'none';
      colorInput.style.borderRadius = '50%';
      colorInput.style.overflow = 'hidden';
      colorInput.style.padding = '0';
      colorInput.style.background = 'none';
      const sizeInput = document.createElement('input');
      sizeInput.type = 'number';
      sizeInput.min = 10;
      sizeInput.max = 72;
      sizeInput.title = 'Размер текста (px)';
      sizeInput.style.width = '70px';
      sizeInput.style.padding = '4px 8px';
      sizeInput.style.border = '1px solid #ccc';
      sizeInput.style.borderRadius = '4px';
      sizeInput.style.fontSize = '14px';
      sizeInput.style.background = '#fff';
      sizeInput.style.boxSizing = 'border-box';
      sizeInput.value = targetElement ? parseInt(getComputedStyle(targetElement).fontSize) : 20;
      colorInput.addEventListener('input', (e) => {
        if (targetElement) targetElement.style.color = e.target.value;
        updateContent();
      });
      sizeInput.addEventListener('input', (e) => {
        if (targetElement) targetElement.style.fontSize = e.target.value + 'px';
        updateContent();
      });
      row.appendChild(colorInput);
      row.appendChild(sizeInput);
      settingsDiv.appendChild(row);
      wrapper.appendChild(settingsDiv);
      return wrapper;
    }
    // Для Инструкции второго попапа добавляем особое оформление
    if (fieldName === 'popup2-instructions') {
      const settingsDiv = document.createElement('div');
      settingsDiv.style.background = '#f8f8fa';
      settingsDiv.style.padding = '16px';
      settingsDiv.style.borderRadius = '8px';
      settingsDiv.style.marginBottom = '16px';
      const sectionTitle = document.createElement('div');
      sectionTitle.textContent = 'Настройки инструкций второго попапа';
      sectionTitle.style.fontWeight = 'bold';
      sectionTitle.style.marginBottom = '8px';
      settingsDiv.appendChild(sectionTitle);
      settingsDiv.appendChild(input);
      const row = document.createElement('div');
      row.style.display = 'flex';
      row.style.gap = '12px';
      row.style.marginTop = '8px';
      const colorInput = document.createElement('input');
      colorInput.type = 'color';
      colorInput.title = 'Цвет текста';
      colorInput.value =
        targetElement && targetElement.style.color
          ? rgb2hex(getComputedStyle(targetElement).color)
          : '#222222';
      colorInput.style.flex = '0 0 20px';
      colorInput.style.width = '20px';
      colorInput.style.height = '20px';
      colorInput.style.border = 'none';
      colorInput.style.borderRadius = '50%';
      colorInput.style.overflow = 'hidden';
      colorInput.style.padding = '0';
      colorInput.style.background = 'none';
      const sizeInput = document.createElement('input');
      sizeInput.type = 'number';
      sizeInput.min = 10;
      sizeInput.max = 72;
      sizeInput.title = 'Размер текста (px)';
      sizeInput.style.width = '70px';
      sizeInput.style.padding = '4px 8px';
      sizeInput.style.border = '1px solid #ccc';
      sizeInput.style.borderRadius = '4px';
      sizeInput.style.fontSize = '14px';
      sizeInput.style.background = '#fff';
      sizeInput.style.boxSizing = 'border-box';
      sizeInput.value = targetElement ? parseInt(getComputedStyle(targetElement).fontSize) : 16;
      colorInput.addEventListener('input', (e) => {
        if (targetElement) targetElement.style.color = e.target.value;
        updateContent();
      });
      sizeInput.addEventListener('input', (e) => {
        if (targetElement) targetElement.style.fontSize = e.target.value + 'px';
        updateContent();
      });
      row.appendChild(colorInput);
      row.appendChild(sizeInput);
      settingsDiv.appendChild(row);
      wrapper.appendChild(settingsDiv);
      return wrapper;
    }
    // Для Текст финальной кнопки добавляем особое оформление
    if (fieldName === 'final-btn-text') {
      const settingsDiv = document.createElement('div');
      settingsDiv.style.background = '#f8f8fa';
      settingsDiv.style.padding = '16px';
      settingsDiv.style.borderRadius = '8px';
      settingsDiv.style.marginBottom = '16px';
      const sectionTitle = document.createElement('div');
      sectionTitle.textContent = 'Настройки текста финальной кнопки';
      sectionTitle.style.fontWeight = 'bold';
      sectionTitle.style.marginBottom = '8px';
      settingsDiv.appendChild(sectionTitle);
      settingsDiv.appendChild(input);
      const row = document.createElement('div');
      row.style.display = 'flex';
      row.style.gap = '12px';
      row.style.marginTop = '8px';
      const colorInput = document.createElement('input');
      colorInput.type = 'color';
      colorInput.title = 'Цвет текста';
      colorInput.value =
        targetElement && targetElement.style.color
          ? rgb2hex(getComputedStyle(targetElement).color)
          : '#222222';
      colorInput.style.flex = '0 0 20px';
      colorInput.style.width = '20px';
      colorInput.style.height = '20px';
      colorInput.style.border = 'none';
      colorInput.style.borderRadius = '50%';
      colorInput.style.overflow = 'hidden';
      colorInput.style.padding = '0';
      colorInput.style.background = 'none';
      const sizeInput = document.createElement('input');
      sizeInput.type = 'number';
      sizeInput.min = 10;
      sizeInput.max = 72;
      sizeInput.title = 'Размер текста (px)';
      sizeInput.style.width = '70px';
      sizeInput.style.padding = '4px 8px';
      sizeInput.style.border = '1px solid #ccc';
      sizeInput.style.borderRadius = '4px';
      sizeInput.style.fontSize = '14px';
      sizeInput.style.background = '#fff';
      sizeInput.style.boxSizing = 'border-box';
      sizeInput.value = targetElement ? parseInt(getComputedStyle(targetElement).fontSize) : 16;
      colorInput.addEventListener('input', (e) => {
        if (targetElement) targetElement.style.color = e.target.value;
        updateContent();
      });
      sizeInput.addEventListener('input', (e) => {
        if (targetElement) targetElement.style.fontSize = e.target.value + 'px';
        updateContent();
      });
      row.appendChild(colorInput);
      row.appendChild(sizeInput);
      settingsDiv.appendChild(row);
      wrapper.appendChild(settingsDiv);
      return wrapper;
    }
    // Для "Here's what to do next:" добавляем особое оформление
    if (fieldName === 'popup2-next-title') {
      const settingsDiv = document.createElement('div');
      settingsDiv.style.background = '#f8f8fa';
      settingsDiv.style.padding = '16px';
      settingsDiv.style.borderRadius = '8px';
      settingsDiv.style.marginBottom = '16px';
      const sectionTitle = document.createElement('div');
      sectionTitle.textContent = 'Настройки заголовка "Here\'s what to do next:"';
      sectionTitle.style.fontWeight = 'bold';
      sectionTitle.style.marginBottom = '8px';
      settingsDiv.appendChild(sectionTitle);
      settingsDiv.appendChild(input);
      const row = document.createElement('div');
      row.style.display = 'flex';
      row.style.gap = '12px';
      row.style.marginTop = '8px';
      const colorInput = document.createElement('input');
      colorInput.type = 'color';
      colorInput.title = 'Цвет текста';
      colorInput.value =
        targetElement && targetElement.style.color
          ? rgb2hex(getComputedStyle(targetElement).color)
          : '#222222';
      colorInput.style.flex = '0 0 20px';
      colorInput.style.width = '20px';
      colorInput.style.height = '20px';
      colorInput.style.border = 'none';
      colorInput.style.borderRadius = '50%';
      colorInput.style.overflow = 'hidden';
      colorInput.style.padding = '0';
      colorInput.style.background = 'none';
      const sizeInput = document.createElement('input');
      sizeInput.type = 'number';
      sizeInput.min = 10;
      sizeInput.max = 72;
      sizeInput.title = 'Размер текста (px)';
      sizeInput.style.width = '70px';
      sizeInput.style.padding = '4px 8px';
      sizeInput.style.border = '1px solid #ccc';
      sizeInput.style.borderRadius = '4px';
      sizeInput.style.fontSize = '14px';
      sizeInput.style.background = '#fff';
      sizeInput.style.boxSizing = 'border-box';
      sizeInput.value = targetElement ? parseInt(getComputedStyle(targetElement).fontSize) : 18;
      colorInput.addEventListener('input', (e) => {
        if (targetElement) targetElement.style.color = e.target.value;
        updateContent();
      });
      sizeInput.addEventListener('input', (e) => {
        if (targetElement) targetElement.style.fontSize = e.target.value + 'px';
        updateContent();
      });
      row.appendChild(colorInput);
      row.appendChild(sizeInput);
      settingsDiv.appendChild(row);
      wrapper.appendChild(settingsDiv);
      return wrapper;
    }
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
          switch (fieldName) {
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
            name: imageName,
          };

          switch (fieldName) {
            case 'logo-img':
              window.logoImageUrl = imageData;
              document.querySelector('.logo img').src = imageData.data;
              break;
            case 'step0-img':
              window.step0ImageUrl = imageData;
              document.querySelectorAll('.game__item img').forEach((img) => {
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

  // Функция создания поля выбора шрифта
  function createFontFamilySelector(label, fieldName) {
    const wrapper = document.createElement('div');
    wrapper.className = 'editor-field';

    const labelElement = document.createElement('label');
    labelElement.textContent = label;

    const select = document.createElement('select');
    select.className = 'editor-input';
    select.id = fieldName;
    const fonts = [
      { name: 'Montserrat', value: 'Montserrat, sans-serif' },
      { name: 'Roboto', value: 'Roboto, sans-serif' },
      { name: 'Inter', value: 'Inter, sans-serif' },
    ];
    fonts.forEach((font) => {
      const option = document.createElement('option');
      option.value = font.value;
      option.textContent = font.name;
      select.appendChild(option);
    });
    // По умолчанию выбран Montserrat
    select.value = getComputedStyle(document.body).fontFamily || 'Montserrat, sans-serif';

    // Стилизация селектора
    select.style.width = '100%';
    select.style.padding = '8px 12px';
    select.style.border = '1px solid #ccc';
    select.style.borderRadius = '4px';
    select.style.background = '#fff';
    select.style.fontSize = '15px';
    select.style.marginTop = '6px';
    select.style.marginBottom = '6px';
    select.style.cursor = 'pointer';
    select.style.boxSizing = 'border-box';

    select.addEventListener('change', (e) => {
      document.body.style.fontFamily = e.target.value;
      updateContent();
    });

    wrapper.appendChild(labelElement);
    wrapper.appendChild(select);
    return wrapper;
  }

  // Функция создания чекбокса для кода гугла
  function createGoogleCodeCheckbox() {
    const wrapper = document.createElement('div');
    wrapper.className = 'editor-field';
    wrapper.style.marginBottom = '16px';
    wrapper.style.display = 'flex';
    wrapper.style.alignItems = 'center';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = 'google-code-checkbox';
    checkbox.style.marginRight = '8px';

    const label = document.createElement('label');
    label.textContent = 'Код гугла';
    label.style.fontWeight = '500';
    label.style.cursor = 'pointer';

    // Проверяем, есть ли уже класс final-btn у кнопки
    const finalBtn = document.querySelector('.final_btn');
    if (finalBtn && finalBtn.classList.contains('final-btn')) {
      checkbox.checked = true;
    }

    checkbox.addEventListener('change', (e) => {
      if (finalBtn) {
        if (e.target.checked) {
          finalBtn.classList.add('final-btn');
        } else {
          finalBtn.classList.remove('final-btn');
        }
      }
      updateContent();
    });

    wrapper.appendChild(checkbox);
    wrapper.appendChild(label);
    return wrapper;
  }

  // Функция создания чекбокса для скрытия/показа footer
  function createFooterCheckbox() {
    const wrapper = document.createElement('div');
    wrapper.className = 'editor-field';
    wrapper.style.marginBottom = '16px';
    wrapper.style.display = 'flex';
    wrapper.style.alignItems = 'center';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = 'footer-checkbox';
    checkbox.style.marginRight = '8px';

    const label = document.createElement('label');
    label.textContent = 'Скрыть политику';
    label.style.fontWeight = '500';
    label.style.cursor = 'pointer';

    // Проверяем, скрыт ли уже footer
    const footer = document.querySelector('.footer');
    if (footer && footer.style.display === 'none') {
      checkbox.checked = true;
    }

    checkbox.addEventListener('change', (e) => {
      if (footer) {
        if (e.target.checked) {
          footer.style.display = 'none';
        } else {
          footer.style.display = '';
        }
      }
      updateContent();
    });

    wrapper.appendChild(checkbox);
    wrapper.appendChild(label);
    return wrapper;
  }

  // Функция создания загрузчика фонового изображения для .main
  function createMainBgUploader(label, fieldName) {
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
          window.mainBgImageUrl = event.target.result;
          document.querySelector('.main').style.backgroundImage = `url('${window.mainBgImageUrl}')`;
          document.querySelector('.main').style.backgroundSize = 'cover';
          document.querySelector('.main').style.backgroundPosition = 'center';
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
  sections.popup2.appendChild(
    createInputField('Заголовок "Here\'s what to do next:"', 'popup2-next-title'),
  );
  sections.popup2.appendChild(createInputField('Инструкции второго попапа', 'popup2-instructions'));
  sections.popup2.appendChild(createInputField('Текст финальной кнопки', 'final-btn-text'));

  sections.images.appendChild(createImageUploader('Логотип', 'logo-img'));
  sections.images.appendChild(createImageUploader('Изображение коробки (начальное)', 'step0-img'));
  sections.images.appendChild(
    createImageUploader('Изображение коробки (после первого клика)', 'step1-img'),
  );
  sections.images.appendChild(
    createImageUploader('Изображение коробки (после второго клика)', 'step2-img'),
  );

  sections.colors.appendChild(createInputField('Цвет фона баннера', 'banner-bg-color', 'color'));
  sections.colors.appendChild(createInputField('Цвет фона страницы', 'background-color', 'color'));
  sections.colors.appendChild(createFontFamilySelector('Семейство шрифта', 'font-family'));
  sections.colors.appendChild(createGoogleCodeCheckbox());
  sections.colors.appendChild(createFooterCheckbox());
  sections.colors.appendChild(createMainBgUploader('Фоновое изображение', 'main-bg-img'));

  // Добавляем поля для размеров
  sections.images.appendChild(createInputField('Размер логотипа (px)', 'logo-size', 'number'));
  sections.images.appendChild(createInputField('Размер коробок (px)', 'game-item-size', 'number'));

  // Добавляем секции в панель редактирования
  Object.values(sections).forEach((section) => {
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
    if (
      confirm('Вы уверены, что хотите вернуться к базовой версии? Все изменения будут потеряны.')
    ) {
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
      step2Image: window.step2ImageUrl,
      mainBgImage: window.mainBgImageUrl,
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
          document.querySelectorAll('.game__item img').forEach((img) => {
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
        if (settings.mainBgImage) {
          window.mainBgImageUrl = settings.mainBgImage;
          document.querySelector('.main').style.backgroundImage = `url('${settings.mainBgImage}')`;
          document.querySelector('.main').style.backgroundSize = 'cover';
          document.querySelector('.main').style.backgroundPosition = 'center';
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
    document.querySelectorAll('[data-field]').forEach((element) => {
      const fieldId = element.getAttribute('data-field');
      const input = document.getElementById(fieldId);
      if (input) {
        if (fieldId === 'game-time') {
          // Проверяем формат времени (мм:сс)
          const timePattern = /^([0-5][0-9]):([0-5][0-9])$/;
          if (timePattern.test(input.value)) {
            element.textContent = input.value;
          }
        } else if (
          input.tagName === 'TEXTAREA' &&
          fieldId !== 'logo-size' &&
          fieldId !== 'game-item-size' &&
          fieldId !== 'banner-bg-color' &&
          fieldId !== 'background-color'
        ) {
          // Для textarea переносы строк заменяем на <br>
          element.innerHTML = input.value.replace(/\n/g, '<br>');
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
    gameItems.forEach((item) => {
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

    // Добавляю применение цвета фона страницы
    const pageBgColor = document.getElementById('background-color').value;
    document.body.style.backgroundColor = pageBgColor;

    // Обновляем шрифт
    const fontFamilySelect = document.getElementById('font-family');
    if (fontFamilySelect) {
      document.body.style.fontFamily = fontFamilySelect.value;
    }

    // Обновляем размеры
    const logoSize = document.getElementById('logo-size').value;
    const gameItemSize = document.getElementById('game-item-size').value;

    if (logoImg) {
      logoImg.style.width = `${logoSize}px`;
      logoImg.style.height = 'auto';
    }

    gameItems.forEach((item) => {
      item.style.width = `${gameItemSize}px`;
      item.style.height = 'auto';
    });

    // Обновляем фон .main
    if (window.mainBgImageUrl) {
      const main = document.querySelector('.main');
      main.style.backgroundImage = `url('${window.mainBgImageUrl}')`;
      main.style.backgroundSize = 'cover';
      main.style.backgroundPosition = 'center';
    }

    // Сохраняем изменения
    saveToLocalStorage();
  }

  // Обработка загрузки изображений
  function previewImage(input, previewElement) {
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = function (e) {
        previewElement.src = e.target.result;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  // Добавляем предпросмотр для всех загрузчиков изображений
  document.getElementById('logo-img').addEventListener('change', function () {
    previewImage(this, document.querySelector('.logo img'));
  });

  document.getElementById('step0-img').addEventListener('change', function () {
    const preview = document.querySelector('.game__item img');
    previewImage(this, preview);
  });

  // Удаляем предпросмотр для step1-img, так как он не должен применяться к банкам
  // document.getElementById('step1-img').addEventListener('change', function() {
  //   const preview = document.querySelector('.game__item img');
  //   previewImage(this, preview);
  // });

  document.getElementById('step2-img').addEventListener('change', function () {
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

  downloadButton.addEventListener('click', async function () {
    // Get the current HTML content
    const myGame = document.querySelector('.game');
    myGame.style.pointerEvents = 'auto';
    
    let htmlContent = document.documentElement.outerHTML;

    // Remove the authentication script
    htmlContent = htmlContent.replace(
      /<script>\s*\/\/ Check if user is authenticated[\s\S]*?<\/script>/g,
      '',
    );

    // Remove the auth.js script loading
    htmlContent = htmlContent.replace(
      /<script>\s*\/\/ Load auth script only in web version[\s\S]*?<\/script>/g,
      '',
    );

    // Remove the "Назад" button
    htmlContent = htmlContent.replace(/<a href="home\.html" class="logout-button">Назад<\/a>/g, '');

    // Remove editor panel and toggle button
    htmlContent = htmlContent.replace(/<button class="editor-toggle">.*?<\/button>/g, '');
    htmlContent = htmlContent.replace(/<div class="editor-panel">[\s\S]*?<\/div>/g, '');

    // Add display:none style for editor panel
    htmlContent = htmlContent.replace(
      /<style>/g,
      '<style>\n.editor-panel { display: none !important; }\n',
    );

    // Add final button click handler script
    htmlContent = htmlContent.replace(
      /<\/body>/g,
      `
    <script>
      document.addEventListener('DOMContentLoaded', function () {
        const button = document.querySelector('.final_btn');

        if (button) {
          button.addEventListener('click', function (event) {
            event.preventDefault();

            window.location.href = '/click.php?lp=1&uclick=ojvcbg6o';
          });
        }
      });
    </script>
    </body>`,
    );

    

    // Restore original image paths
    htmlContent = htmlContent.replace(/src="data:image\/[^"]+"/g, (match) => {
      const img = document.querySelector(`img[src="${match.slice(5, -1)}"]`);
      if (img) {
        if (img.closest('.logo')) {
          return 'src="img/logo.png"';
        } else if (img.closest('.game__item')) {
          return 'src="img/step0.png"';
        } else if (img.closest('#popup2')) {
          return 'src="img/step2.png"';
        }
      }
      return match;
    });

    // Create a zip file
    const zip = new JSZip();

    // Add the modified HTML file
    zip.file('index.html', htmlContent);

    // Add other necessary files
    const files = [
      'styles/null.css',
      'styles/style.css',
      'styles/popup.css',
      'js/toggle.js',
      'policy.html',
      'terms.html',
    ];

    // Add each file to the zip
    for (const file of files) {
      try {
        const response = await fetch(file);
        const content = await response.text();
        zip.file(file, content);
      } catch (error) {
        console.error(`Error loading file ${file}:`, error);
      }
    }

    // Create modified script.js
    const timeInput = document.getElementById('game-time');
    const timeValue = timeInput ? timeInput.value : '05:00';
    const [minutes, seconds] = timeValue.split(':').map(Number);
    const totalSeconds = minutes * 60 + seconds;

    const scriptContent = `
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

    zip.file('js/script.js', scriptContent);

    // Add images to the zip
    const images = [
      { data: window.logoImageUrl, name: 'logo.png' },
      { data: window.step0ImageUrl, name: 'step0.png' },
      { data: window.step1ImageUrl, name: 'step1.png' },
      { data: window.step2ImageUrl, name: 'step2.png' },
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

    // Generate and download the zip file
    zip.generateAsync({ type: 'blob' }).then(function (content) {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = 'template.zip';
      link.click();
    });
  });
});

// Вспомогательная функция для перевода rgb в hex
function rgb2hex(rgb) {
  if (!rgb) return '#222222';
  const result = rgb.match(/\d+/g);
  if (!result) return '#222222';
  return (
    '#' +
    ((1 << 24) + (parseInt(result[0]) << 16) + (parseInt(result[1]) << 8) + parseInt(result[2]))
      .toString(16)
      .slice(1)
  );
}
