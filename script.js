document.getElementById('satisfied').addEventListener('click', function() {
    sendFeedback('Удовлетворительно');
});

document.getElementById('unsatisfied').addEventListener('click', function() {
    sendFeedback('Неудовлетворительно');
});

function sendFeedback(feedback) {
    fetch('/save_feedback', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ feedback: feedback })
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
    }, 5000);
}

// Скрипт для генерации звезд
for (let i = 0; i < 100; i++) {
    let star = document.createElement('div');
    star.className = 'star';
    star.style.top = Math.random() * window.innerHeight + 'px';
    star.style.left = Math.random() * window.innerWidth + 'px';
    document.body.appendChild(star);
}       