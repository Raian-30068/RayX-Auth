document.addEventListener("DOMContentLoaded", function () {
    const phoneInput = document.getElementById("phone");

    async function autoDetectCountry() {
        try {
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            if (data && data.country_calling_code) {
                phoneInput.value = data.country_calling_code + " ";
            }
        } catch (error) {
            console.error(error);
        }
    }

    autoDetectCountry();

    phoneInput.addEventListener("input", function (e) {
        let input = e.target.value;
        let digits = input.replace(/\D/g, ''); 

        if (!digits) {
            e.target.value = "";
            return;
        }

        if (!digits.startsWith('375') && digits.length > 0) {
            if (digits.startsWith('8') || digits.startsWith('7')) {
                digits = '375' + digits.substring(1);
            } else {
                digits = '375' + digits;
            }
        }

        let formatted = "+375";

        if (digits.length > 3) {
            formatted += " (" + digits.substring(3, 5);
        }
        if (digits.length > 5) {
            formatted += ") " + digits.substring(5, 8);
        }
        if (digits.length > 8) {
            formatted += "-" + digits.substring(8, 10);
        }
        if (digits.length > 10) {
            formatted += "-" + digits.substring(10, 12);
        }

        e.target.value = formatted;
    });

    phoneInput.addEventListener("keydown", function (e) {
        if (e.key === "Backspace" && e.target.value.length <= 5) {
            e.target.value = "";
        }
    });

    // ИСПРАВЛЕНО: Объявляем все переменные формы ровно ОДИН раз
    const form = document.querySelector('form');
    const username = document.querySelector('input[name="username"]');
    const email = document.querySelector('input[name="email"]');
    const password = document.querySelector('input[name="password"]');
    const confirmPassword = document.querySelector('input[name="confirm_password"]');

    form.addEventListener('submit', async function (event) { 
        event.preventDefault();

        // 1. Проверка совпадения паролей
        if (password.value !== confirmPassword.value) {
            alert('Пароли не совпадают! Проверьте ввод.');
            confirmPassword.focus(); 
            return; 
        }

        // 2. Автоматически вытаскиваем tg_id из ссылки сайта
        const urlParams = new URLSearchParams(window.location.search);
        const telegramId = urlParams.get('tg_id'); 

        if (!telegramId) {
            alert('Ошибка доступа: Пожалуйста, запустите эту страницу строго через вашего Telegram-бота RayX!');
            return;
        }

        // 3. Собираем чистый объект данных формы
        const userData = {
            tg_id: parseInt(telegramId, 10), 
            username: username.value,
            email: email.value,
            phone: phoneInput.value,
            password: password.value 
        };

        // ИСПРАВЛЕНО: Сюда ты будешь вставлять свою полную временную ссылку из ngrok + путь до эндпоинта FastAPI
        // Пример: "https://ngrok-free.app"
        const fastapiServerUrl = "https://ТВОЙ_АДРЕС_ИЗ_NGROK.ngrok-free.app/v1/auth/register";

        try {
            // Отправляем пакет данных на сервер Lenovo
            const response = await fetch(fastapiServerUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userData)
            });

            if (response.ok) {
                alert(`Поздравляем! Аккаунт RayX успешно создан.\nСистема Нейро активирована для Telegram ID: ${telegramId}`);
                form.reset(); 
                await autoDetectCountry(); // Перезапускаем автокод страны после очистки
            } else {
                alert('Ошибка сервера: Не удалось зарегистрировать аккаунт. Попробуйте позже.');
            }

        } catch (error) {
            console.error("Критический сбой сети:", error);
            alert('Ошибка подключения: Твой сервер Lenovo сейчас выключен или обновилась ссылка ngrok!');
        }
    });
});
