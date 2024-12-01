async function fetchContent() {
    const url = document.getElementById('urlInput').value;
    const contentDiv = document.getElementById('content');
    const translatedDiv = document.getElementById('translatedContent');

    try {
        const response = await fetch('http://localhost:3000/proxy?target=' + encodeURIComponent(url));
        const html = await response.text();

        // Парсим HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Извлекаем текстовый контент
        const elements = doc.querySelectorAll('h1, h2, p');
        contentDiv.innerHTML = ''; // Очищаем старый контент
        translatedDiv.innerHTML = ''; // Сбрасываем перевод

        elements.forEach(el => {
        const newEl = document.createElement(el.tagName.toLowerCase());
                newEl.textContent = el.textContent;
                contentDiv.appendChild(newEl);
        });

    } catch (error) {
        console.error('Error fetching content:', error);
            contentDiv.textContent = 'Failed to fetch content. Check the console for more details.';
        }
}

function splitText(text, maxLength = 1000) {
    const paragraphs = text.split('\n'); // Разделяем текст по абзацам
    const chunks = [];
    
    paragraphs.forEach(paragraph => {
        let start = 0;
        while (start < paragraph.length) {
            chunks.push(paragraph.slice(start, start + maxLength));
            start += maxLength;
        }
    });

    return chunks;
}

// Отправка текста частями и сбор перевода
async function translateContent() {
    const contentDiv = document.getElementById('content');
    const translatedDiv = document.getElementById('translatedContent');
    const language = document.getElementById('languageSelector').value;

    const textToTranslate = Array.from(contentDiv.querySelectorAll('h1, h2, p'))
        .map(el => el.textContent)
        .join('\n');

    const chunks = splitText(textToTranslate);
    let translatedText = '';

    for (const chunk of chunks) {
        try {
            const response = await fetch('http://localhost:3000/translate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: chunk,
                    target: language,
                }),
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();
            translatedText += data.translatedText + '\n';
        } catch (error) {
            console.error('Error translating content:', error);
            translatedText += '[Ошибка перевода]\n';
        }
    }

    translatedDiv.textContent = translatedText.trim();
}

function saveContent() {
    const contentDiv = document.getElementById('content');
    const textContent = Array.from(contentDiv.querySelectorAll('h1, h2, p'))
        .map(el => el.textContent)
        .join('\n');
    // Создаем текстовый файл
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    // Создаем ссылку для скачивания
    const a = document.createElement('a');
    a.href = url;
    a.download = 'content.txt';
    a.click();
    // Освобождаем память
    URL.revokeObjectURL(url);
}