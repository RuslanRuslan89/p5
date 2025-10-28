// script.js

// Обработка формы отправки поста
document.getElementById('postForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    // Получаем данные из формы
    const formData = {
        title: document.getElementById('postTitle').value,
        content: document.getElementById('postContent').value,
        platforms: Array.from(document.querySelectorAll('input[name="platform"]:checked'))
            .map(checkbox => checkbox.value)
    };

    try {
        // Отправляем запрос на сервер
        const response = await fetch('/api/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error(`Ошибка при публикации: ${response.status}`);
        }

        // Очищаем форму и показываем уведомление
        this.reset();
        showAlert('Пост успешно опубликован!', 'success');
        
        // Обновляем статистику
        updateStats();
    } catch (error) {
        console.error(error);
        showAlert('Произошла ошибка при публикации', 'error');
    }
});

// Обновление статистики
async function updateStats() {
    try {
        const response = await fetch('/api/stats');
        const data = await response.json();
        
        // Обновляем показатели для каждой платформы
        Object.entries(data).forEach(([platform, stats]) => {
            document.getElementById(`${platform}Posts`).textContent = stats.posts;
            document.getElementById(`${platform}SuccessRate`).textContent = `${stats.successRate}%`;
        });
    } catch (error) {
        console.error('Ошибка при обновлении статистики:', error);
    }
}

// Функция показа уведомлений
function showAlert(message, type = 'success') {
    const alertElement = document.createElement('div');
    alertElement.className = `alert ${type}`;
    alertElement.textContent = message;
    document.body.appendChild(alertElement);

    // Автоматическое закрытие через 3 секунды
    setTimeout(() => {
        alertElement.remove();
    }, 3000);
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Обновляем статистику при первой загрузке
    updateStats();
});
