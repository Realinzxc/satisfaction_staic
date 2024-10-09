const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// Переменная для хранения выбранной категории
let selectedCategory = null;

app.use(express.static(__dirname));
app.use(bodyParser.json());

// Функция для безопасного имени файла
function sanitizeFileName(name) {
    return name.replace(/[^a-zA-Z0-9а-яА-ЯёЁ]/g, '_');
}

// Маршрут для установки категории
app.post('/set_category', (req, res) => {
    selectedCategory = req.body.category || 'Категория не выбрана';
    console.log(`Выбранная категория: ${selectedCategory}`);
    res.json({ message: 'Категория установлена' });
});

// Маршрут для получения текущей категории
app.get('/get_category', (req, res) => {
    res.json({ category: selectedCategory });
});

// Маршрут для сохранения отзыва
app.post('/save_feedback', (req, res) => {
    const feedback = req.body.feedback;
    const category = req.body.category || selectedCategory || 'Общее';
    const date = new Date();

    // Создаём имя файла на основе категории
    const sanitizedCategory = sanitizeFileName(category);
    const fileName = `feedback_${sanitizedCategory}.csv`;
    const filePath = path.join(__dirname, 'feedbacks', fileName);

    // Создаём папку 'feedbacks', если она не существует
    if (!fs.existsSync(path.join(__dirname, 'feedbacks'))) {
        fs.mkdirSync(path.join(__dirname, 'feedbacks'));
    }

    // Используем запятую как разделитель для CSV
    const data = `"${date.toLocaleString()}","${feedback}"\n`;

    // Проверяем, существует ли файл
    if (!fs.existsSync(filePath)) {
        // Если файл не существует, создаём его с BOM и добавляем заголовки
        const bom = '\uFEFF'; // BOM для UTF-8
        const headers = `"Дата и время","Отзыв"\n`;
        fs.writeFileSync(filePath, bom + headers + data, { encoding: 'utf8' });
    } else {
        // Добавляем данные в файл с указанием кодировки
        fs.appendFile(filePath, data, { encoding: 'utf8' }, (err) => {
            if (err) {
                console.error('Ошибка при записи в файл CSV:', err);
                res.status(500).json({ message: 'Ошибка сервера' });
            } else {
                console.log(`Отзыв сохранён в категории "${category}":`, feedback);
                res.json({ message: 'Данные сохранены' });
            }
        });
    }
});

app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});
