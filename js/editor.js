document.addEventListener('DOMContentLoaded', function () {
  const button = document.querySelector('.final_btn');
  if (button) {
    button.addEventListener('click', function (event) {
      event.preventDefault();
      window.location.href = '/click.php?lp=1&uclick=ojvcbg6o';
    });
  }

  function updateContent() {
    document.querySelector('.banner__title').innerHTML = document
      .getElementById('banner-title')
      .value.replace(/\n/g, '<br>');
    document.querySelector('.banner__text').innerHTML = document
      .getElementById('banner-text')
      .value.replace(/\n/g, '<br>');
    document.querySelector('.game__title').innerHTML = document
      .getElementById('game-title')
      .value.replace(/\n/g, '<br>');
    document.querySelector('#popup1 h2').textContent =
      document.getElementById('popup1-title').value;
    document.querySelector('#popup1 p').textContent =
      document.getElementById('popup1-text').value;
    document.querySelector('#popup2 h2').textContent =
      document.getElementById('popup2-title').value;
    document.querySelector('#popup2 h3').innerHTML = document
      .getElementById('popup2-subtitle')
      .value.replace(/\n/g, '<br>');
    document.querySelector('#popup2 .popup__item').innerHTML = document
      .getElementById('popup2-instructions')
      .value.replace(/\n/g, '<br>');
    document.querySelector('.final_btn').textContent =
      document.getElementById('final-btn-text').value;

    // Изменение размеров изображений
    document.querySelector('.logo img').style.width =
      document.getElementById('logo-size').value + 'px';
    document.querySelectorAll('.game__item img').forEach((img) => {
      img.style.width = document.getElementById('game-item-size').value + 'px';
    });

    // Изменение цвета фона баннера
    document.querySelector('.banner').style.backgroundColor =
      document.getElementById('banner-bg-color').value;

    // Обработка загрузки изображений
    const logoFile = document.getElementById('logo-img').files[0];
    if (logoFile) {
      const reader = new FileReader();
      reader.onload = function (e) {
        document.querySelector('.logo img').src = e.target.result;
        window.logoImageUrl = e.target.result;
      };
      reader.readAsDataURL(logoFile);
    }

    const step0File = document.getElementById('step0-img').files[0];
    if (step0File) {
      const reader = new FileReader();
      reader.onload = function (e) {
        window.step0ImageUrl = e.target.result;
        document.querySelectorAll('.game__item img').forEach((img) => {
          img.src = e.target.result;
        });
      };
      reader.readAsDataURL(step0File);
    }

    const step1File = document.getElementById('step1-img').files[0];
    if (step1File) {
      const reader = new FileReader();
      reader.onload = function (e) {
        window.step1ImageUrl = e.target.result;
      };
      reader.readAsDataURL(step1File);
    }

    const step2File = document.getElementById('step2-img').files[0];
    if (step2File) {
      const reader = new FileReader();
      reader.onload = function (e) {
        window.step2ImageUrl = e.target.result;
      };
      reader.readAsDataURL(step2File);
    }

    document.body.style.backgroundColor = document.getElementById('background-color').value;
  }

  const inputs = document.querySelectorAll('.editor-panel input, .editor-panel textarea');
  inputs.forEach((input) => {
    input.addEventListener('input', updateContent);
  });

  document.getElementById('download-btn').addEventListener('click', async function () {
    // Клонируем HTML и удаляем только панель редактирования
    const tempDoc = document.cloneNode(true);
    const editorPanel = tempDoc.querySelector('.editor-panel');
    if (editorPanel) editorPanel.remove();
    const downloadBtn = tempDoc.querySelector('#download-btn');
    if (downloadBtn) downloadBtn.remove();

    // Удаляем скрипт editor.js из HTML
    const editorScript = tempDoc.querySelector('script[src="js/editor.js"]');
    if (editorScript) editorScript.remove();

    // Создаем объект для хранения всех файлов
    const files = {
      'index.html': tempDoc.documentElement.outerHTML,
    };

    // Загружаем содержимое js-файла
    try {
      const jsResponse = await fetch('js/script.js');
      const jsContent = await jsResponse.text();
      files['js/script.js'] = jsContent;
    } catch (error) {
      console.error('Ошибка загрузки js-файла:', error);
      files['js/script.js'] = '// Ошибка загрузки файла';
    }

    // Загружаем содержимое CSS-файлов
    try {
      const styleResponse = await fetch('styles/style.css');
      const styleContent = await styleResponse.text();
      files['styles/style.css'] = styleContent;
    } catch (error) {
      console.error('Ошибка загрузки style.css:', error);
      files['styles/style.css'] = '/* Ошибка загрузки файла */';
    }

    try {
      const popupResponse = await fetch('styles/popup.css');
      const popupContent = await popupResponse.text();
      files['styles/popup.css'] = popupContent;
    } catch (error) {
      console.error('Ошибка загрузки popup.css:', error);
      files['styles/popup.css'] = '/* Ошибка загрузки файла */';
    }

    try {
      const nullResponse = await fetch('styles/null.css');
      const nullContent = await nullResponse.text();
      files['styles/null.css'] = nullContent;
    } catch (error) {
      console.error('Ошибка загрузки null.css:', error);
      files['styles/null.css'] = '/* Ошибка загрузки файла */';
    }

    // Создаем zip-архив
    const zip = new JSZip();

    // Добавляем файлы в архив
    Object.keys(files).forEach((fileName) => {
      zip.file(fileName, files[fileName]);
    });

    // Добавляем изображения
    const images = document.querySelectorAll('img');
    const imagePromises = Array.from(images).map(async (img) => {
      const imgUrl = img.src;
      // Если изображение в формате base64, конвертируем его в blob
      if (imgUrl.startsWith('data:')) {
        const blob = await fetch(imgUrl).then(r => r.blob());
        const imgName = img.getAttribute('alt') + '.png';
        return zip.file(`img/${imgName}`, blob);
      } else {
        const imgName = imgUrl.split('/').pop();
        const blob = await fetch(imgUrl).then(r => r.blob());
        return zip.file(`img/${imgName}`, blob);
      }
    });

    // Добавляем step1.png и step2.png, если они были загружены
    if (window.step1ImageUrl) {
      const step1Blob = await fetch(window.step1ImageUrl).then((r) => r.blob());
      zip.file('img/step1.png', step1Blob);
    }

    if (window.step2ImageUrl) {
      const step2Blob = await fetch(window.step2ImageUrl).then((r) => r.blob());
      zip.file('img/step2.png', step2Blob);
    }

    // Ждем загрузки всех изображений
    await Promise.all(imagePromises);

    // Генерируем и скачиваем zip-архив
    zip.generateAsync({ type: 'blob' }).then((content) => {
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'modified_template.zip';
      a.click();
      URL.revokeObjectURL(url);
    });
  });

  // Обновляем обработчик клика по банкам
  const gameItems = document.querySelectorAll('.game__item');
  let prizeIndex = 0;
  gameItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const isDefaultStep0 = img.src.includes('step0.png');
      const isCustomStep0 = window.step0ImageUrl && img.src === window.step0ImageUrl;
      if (!isDefaultStep0 && !isCustomStep0) return;

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
}); 