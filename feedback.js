// Получаем выбранную категорию с сервера
fetch('/get_category')
    .then(response => response.json())
    .then(data => {
        const category = data.category || 'Категория не выбрана';
        // Устанавливаем заголовок с выбранной категорией
        document.getElementById('category-title').textContent = `Пожалуйста, оцените: ${category}`;

        // Сохраняем категорию в переменную для последующего использования
        window.currentCategory = category;
    })
    .catch((error) => {
        console.error('Ошибка при получении категории:', error);
    });

// Обработчики событий для смайликов
document.getElementById('satisfied').addEventListener('click', function() {
    sendFeedback('Хорошо');
});

document.getElementById('neutral').addEventListener('click', function() {
    sendFeedback('Средне');
});

document.getElementById('unsatisfied').addEventListener('click', function() {
    sendFeedback('Плохо');
});

function sendFeedback(feedback) {
    const category = window.currentCategory;
    fetch('/save_feedback', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ feedback: feedback, category: category })
    })
    .then(response => response.json())
    .then(data => {
        // Показываем модальное окно
        showThankYouModal();
    })
    .catch((error) => {
        console.error('Ошибка:', error);
    });
}

function showThankYouModal() {
    var modal = document.getElementById('thankyouModal');
    modal.style.display = 'block';

    // Закрываем модальное окно через 2 секунды
    setTimeout(function() {
        modal.style.display = 'none';
    }, 2000);
}
