"use strict";
async function validate_register_form(event) {
    let register_user_name = document.getElementById("register_user_name");
    let register_user_surname = document.getElementById("register_user_surname");
    let register_user_login = document.getElementById("register_user_login");
    let register_user_password = document.getElementById("register_user_password");
    let register_user_confirm_password = document.getElementById("register_user_confirm_password");
    let register_user_email = document.getElementById("register_user_email");
    let register_form = document.getElementById("register_form");
    const register_user_data_error_ids = {
        name: "register_user_name_error",
        surname: "register_user_surname_error",
        login: "register_user_login_error",
        password: "register_user_password_error",
        confirm_password: "register_user_confirm_password_error",
        email: "register_user_email_error",
        button: "register_user_error"
    };
    let user_name = "";
    let user_surname = "";
    let user_login = "";
    let user_password = "";
    let user_confirm_password = "";
    let user_email = "";
    if (register_user_name) {
        if (register_user_name.value && register_user_name.value.trim().length > 0) {
            user_name = register_user_name.value.trim();
        }
        else {
            register_field_error_message_editor(register_user_data_error_ids.name, "Введіть Ваше ім'я.");
        }
    }
    else {
        register_field_error_message_editor(register_user_data_error_ids.name, "Поле для вводу імені відсутнє.");
    }
    if (register_user_surname) {
        if (register_user_surname.value && register_user_surname.value.trim().length > 0) {
            user_surname = register_user_surname.value.trim();
        }
        else {
            register_field_error_message_editor(register_user_data_error_ids.surname, "Введіть Ваше прізвище.");
        }
    }
    else {
        register_field_error_message_editor(register_user_data_error_ids.surname, "Поле для вводу прізвища відсутнє.");
    }
    if (register_user_login) {
        if (register_user_login.value && register_user_login.value.trim().length > 0) {
            let login_value = register_user_login.value.trim();
            if (login_value.match(/^[\wа-яА-Яіїє]+$/)) {
                user_login = login_value;
            }
            else {
                register_field_error_message_editor(register_user_data_error_ids.login, "Логін має містити лише букви, числа та символи нижнього підкреслювання.");
            }
        }
        else {
            register_field_error_message_editor(register_user_data_error_ids.login, "Введіть логін.");
        }
    }
    else {
        register_field_error_message_editor(register_user_data_error_ids.login, "Поле для вводу логіну відсутнє.");
    }
    if (register_user_password) {
        if (register_user_password.value && register_user_password.value.trim().length > 0) {
            let password_value = register_user_password.value.trim();
            if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,})/.test(password_value)) {
                register_field_error_message_editor(register_user_data_error_ids.password, "Пароль має мати довжину мінімум 6 символів.");
            }
            else {
                user_password = password_value;
            }
        }
        else {
            register_field_error_message_editor(register_user_data_error_ids.password, "Введіть пароль.");
        }
        if (register_user_confirm_password) {
            if (register_user_confirm_password.value === register_user_password.value) {
                user_confirm_password = register_user_confirm_password.value.trim();
            }
            else {
                register_field_error_message_editor(register_user_data_error_ids.confirm_password, "Паролі не співпадають.");
            }
        }
        else {
            register_field_error_message_editor(register_user_data_error_ids.confirm_password, "Поле для вводу підтвердження паролю відсутнє.");
        }
    }
    else {
        register_field_error_message_editor(register_user_data_error_ids.password, "Поле для вводу паролю відсутнє.");
    }
    if (register_user_email) {
        if (register_user_email.value && register_user_email.value.trim().length > 0) {
            let email_value = register_user_email.value.trim();
            if (email_value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/g)) {
                user_email = email_value;
            }
            else {
                register_field_error_message_editor(register_user_data_error_ids.email, "Пошта, введена вами, не підходить.");
            }
        }
        else {
            register_field_error_message_editor(register_user_data_error_ids.email, "Введіть пошту.");
        }
    }
    else {
        register_field_error_message_editor(register_user_data_error_ids.email, "Поле для вводу пошти відсутнє.");
    }
    if (user_name && user_surname && user_login && user_password && user_confirm_password && user_email) {
        const check_data_request = await fetch("/account/register/check", { method: "get", headers: { "user-login": user_login } });
        if (check_data_request.ok) {
            register_form.submit();
        }
        else {
            const request_text = await check_data_request.text();
            switch (request_text) {
                case "exists":
                    register_field_error_message_editor(register_user_data_error_ids.login, "Користувач с таким логіном вже існує.");
                    break;
                case "login null":
                    register_field_error_message_editor(register_user_data_error_ids.login, "Чомусь ви відправили пустий логін. Можливо, ви не ввели його?");
                    break;
                case "not valid":
                    register_field_error_message_editor(register_user_data_error_ids.button, "Щось не так з даними, які Ви ввели для регістрації.");
                    break;
                default:
                    register_field_error_message_editor(register_user_data_error_ids.button, `Виникла неочікувана помилка з кодом ${check_data_request.status} та текстом "${request_text}".`);
            }
        }
    }
}
function register_field_error_message_editor(where_occurupt, error_message) {
    if (where_occurupt && error_message) {
        if (!error_message.charAt(error_message.length - 1).match(/[.!?;]/))
            error_message += ".";
        error_message = "< " + error_message;
        let error_message_container = document.getElementById(where_occurupt);
        if (error_message_container) {
            error_message_container.textContent = error_message;
        }
    }
    else if (error_message) {
        console.error(error_message);
    }
    else if (where_occurupt) {
        let error_message_container = document.getElementById(where_occurupt);
        if (error_message_container) {
            error_message_container.textContent = "";
        }
    }
}
function clear_register_error_message(error_message_id) {
    let error_message_container = document.getElementById(error_message_id);
    let register_user_error = document.getElementById("register_user_error");
    if (error_message_container) {
        error_message_container.textContent = "";
        register_user_error.textContent = "";
    }
}
function check_password(event) {
    let this_element = event.currentTarget;
    if (this_element) {
        let test_password = this_element.value;
        if (strong_password.test(test_password)) {
            this_element.style.backgroundColor = "green";
        }
        else if (medium_password.test(test_password)) {
            this_element.style.backgroundColor = "yellow";
        }
        else {
            this_element.style.backgroundColor = "red";
        }
    }
}
document.addEventListener("DOMContentLoaded", function () {
    const register_user_data_ids = [
        ["register_user_name", "register_user_name_error"],
        ["register_user_surname", "register_user_surname_error"],
        ["register_user_login", "register_user_login_error"],
        ["register_user_password", "register_user_password_error"],
        ["register_user_confirm_password", "register_user_confirm_password_error"],
        ["register_user_email", "register_user_email_error"]
    ];
    let submit_register_user = document.getElementById("submit_register_user");
    if (submit_register_user) {
        submit_register_user.addEventListener("click", validate_register_form);
    }
    for (let rudei of register_user_data_ids) {
        let rudei_input = document.getElementById(rudei[0]);
        if (rudei_input) {
            rudei_input.addEventListener("input", function () { clear_register_error_message(rudei[1]); });
        }
    }
    let register_user_password = document.getElementById("register_user_password");
    if (register_user_password) {
        register_user_password.addEventListener("change", check_password);
    }
});
let strong_password = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})');
let medium_password = new RegExp('((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,}))|((?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.{8,}))');
