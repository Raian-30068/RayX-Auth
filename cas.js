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

    const form = document.querySelector('form');
    const password = document.querySelector('input[name="password"]');
    const confirmPassword = document.querySelector('input[name="confirm_password"]');

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        if (password.value !== confirmPassword.value) {
            alert('Пароли не совпадают! Проверьте ввод.');
            confirmPassword.focus(); 
            return; 
        }

        alert('Поздравляем! Аккаунт RayX успешно создан.');
        form.reset(); 
        autoDetectCountry();
    });
});
