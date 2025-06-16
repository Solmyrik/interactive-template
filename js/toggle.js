const editorPanel = document.querySelector('.editor-panel');
const toggleButton = document.querySelector('.editor-toggle');

toggleButton.addEventListener('click', () => {
  editorPanel.classList.toggle('hidden');
  toggleButton.classList.toggle('hidden');
  toggleButton.textContent = editorPanel.classList.contains('hidden') ? 'Показать панель' : 'Скрыть панель';
});

function resetToBase() {
  if (confirm('Вы уверены, что хотите вернуться к базовой версии? Все изменения будут потеряны.')) {
    localStorage.setItem('templateSettings', '');
    localStorage.removeItem('templateSettings');
    location.reload();
  }
} 