/* Ваш код со стилями и функциями */

// ==UserScript==
// @name         Mirapolis.Helper
// @namespace    zalupa.helper
// @version      228
// @description  Хуле тут забыл
// @match        *://lms.central-ppk.ru/*
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';

    // Функция для загрузки JSON с помощью GM_xmlhttpRequest
    async function loadAnswers() {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: 'https://raw.githubusercontent.com/pipfilm/answer/main/answers.json',
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        resolve(data);
                    } catch (error) {
                        reject(error);
                    }
                },
                onerror: function(err) {
                    reject(err);
                }
            });
        });
    }

    // Основная функция для парсинга страницы и обновления ответов
    async function parsePage() {
        try {
            const answersData = await loadAnswers();

            setInterval(() => {
                // Получаем текст страницы
                const pageText = document.body.innerText;

                // Проходим по вопросам из JSON
                answersData.questions.forEach(questionObj => {
                    const question = questionObj.question;
                    const answers = questionObj.answers;

                    // Проверяем, есть ли на странице вопрос
                    if (pageText.includes(question)) {
                        // Если есть, ищем ответ
                        answers.forEach(answer => {
                            const answerElements = document.querySelectorAll('body *:not(script):not(style)');

                            answerElements.forEach(element => {
                                // Проверяем, есть ли у элемента текстовое содержимое
                                if (element.innerText && element.innerText.includes(answer)) {
                                    // Меняем цвет текста ответа на зеленый
                                    element.style.color = '#DB7224';
                                }
                            });
                        });
                    }
                });
            }, 1000); // Интервал проверки в миллисекундах
        } catch (error) {
            console.error('Ошибка при загрузке ответов:', error);
        }
    }

    // Запуск парсинга после загрузки страницы
    window.onload = parsePage;
})();
