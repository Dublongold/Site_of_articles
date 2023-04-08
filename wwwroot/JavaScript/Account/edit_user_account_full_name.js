"use strict";
function create_edit_account_full_name_field(event) {
    let user_full_name = document.getElementById("user_full_name");
    let user_name = document.getElementById("user_name");
    let user_surname = document.getElementById("user_surname");
    if (user_full_name && user_name && user_surname) {
        let edit_user_name = document.createElement("input");
        let edit_user_surname = document.createElement("input");
        let save_edit_user_account_full_name = document.createElement("button");
        let cancel_edit_user_account_full_name = document.createElement("button");
        edit_user_name.id = "edit_user_name";
        edit_user_name.value = user_name.textContent ?? "";
        edit_user_name.placeholder = "Введіть ім'я...";
        edit_user_surname.id = "edit_user_surname";
        edit_user_surname.value = user_surname.textContent ?? "";
        edit_user_surname.placeholder = "Введіть прізвище...";
        edit_user_name.maxLength = edit_user_surname.maxLength = 20;
        save_edit_user_account_full_name.textContent = "Зберегти";
        save_edit_user_account_full_name.type = "button";
        save_edit_user_account_full_name.id = "save_edit_user_full_name_button";
        save_edit_user_account_full_name.addEventListener("click", function (event) { save_edit_account_full_name_field(event); });
        cancel_edit_user_account_full_name.textContent = "Скасувати";
        cancel_edit_user_account_full_name.type = "button";
        cancel_edit_user_account_full_name.id = "cancel_edit_user_full_name_button";
        let old_name = user_name.textContent ?? "";
        let old_surname = user_surname.textContent ?? "";
        cancel_edit_user_account_full_name.addEventListener("click", function () { remove_edit_account_full_name_field(old_name, old_surname); });
        user_full_name.textContent = "";
        user_full_name.appendChild(edit_user_name);
        user_full_name.appendChild(edit_user_surname);
        user_full_name.appendChild(save_edit_user_account_full_name);
        user_full_name.appendChild(cancel_edit_user_account_full_name);
        if (event && event.currentTarget)
            event.currentTarget.remove();
    }
}
async function save_edit_account_full_name_field(event) {
    let this_element = event.currentTarget;
    if (this_element) {
        this_element.disabled = true;
        let user_full_name = document.getElementById("user_full_name");
        let edit_user_name = document.getElementById("edit_user_name");
        let edit_user_surname = document.getElementById("edit_user_surname");
        const source = "Редагування повного імені";
        let error_message = "";
        let where_append = user_full_name ?? this_element.parentElement;
        const error_message_id = "edit_user_full_name";
        let user_login_element = document.querySelector("#user_login");
        let user_login = "";
        if (user_login_element) {
            let user_login_a_element = user_login_element.firstChild;
            if (user_login_a_element)
                user_login = user_login_a_element.textContent ?? "";
        }
        if (user_full_name && edit_user_name && edit_user_surname) {
            if (edit_user_name.value && edit_user_name.value.trim().replace(" ", "").length > 0
                && edit_user_surname.value && edit_user_surname.value.trim().replace(" ", "").length > 0) {
                const request_to_edit = await fetch(`/account/edit/${encodeURI(user_login.substring(1))}/${encodeURI(edit_user_name.value.trim())}/${encodeURI(edit_user_surname.value.trim())}`, {
                    method: "put",
                    headers: new Headers({
                        'operation-with-data': 'full-name'
                    })
                });
                if (request_to_edit.ok) {
                    remove_edit_account_full_name_field(request_to_edit.headers.get("user-name"), request_to_edit.headers.get("user-surname"));
                }
                else {
                    switch (request_to_edit.status) {
                        case 404:
                            error_message = "Вибачте, яле цього користувача немає в базі даних. Можливо, його видалили або просто неправильний логін був переданий в запиті.";
                            break;
                        case 403:
                            error_message = "У вас немає прав редагувати цього користувача!";
                            break;
                        case 401:
                            error_message = "Ви неавторизовані. Будь-ласка, авторизуйтесь, щоб мати можливість реагувати свій обліковий запис.";
                            break;
                        default:
                            error_message = `Виникла неочікувана помилка з кодом ${request_to_edit.status}.`;
                    }
                }
            }
            else
                error_message = "Неможна залишати поля імен пустими! Ви маєте ввести туди хоча б одну букву, цифру або символ нижнього підкреслювання.";
        }
        else
            error_message = "Не знайдено якийсь із елементів, необхідних для виконання дії цієї кнопки";
        error_message_editor(source, error_message, where_append, error_message_id);
        this_element.disabled = false;
    }
}
function remove_edit_account_full_name_field(set_name, set_surname) {
    let user_full_name = document.getElementById("user_full_name");
    // Створення елементів з іменем та прізвищем користувача
    let user_name = document.createElement("span");
    let user_surname = document.createElement("span");
    // Створення кнопки для редагування повного ім'я користувача.
    let edit_user_full_name_button = document.createElement("button");
    let space_between_name_and_surname = document.createTextNode(" ");
    // Налаштування редакторів імені та прізввища користувача.
    user_name.id = "user_name";
    user_surname.id = "user_surname";
    let new_user_name = set_name;
    new_user_name = new_user_name ? decodeURI(new_user_name) : "";
    let new_user_surname = set_surname;
    new_user_surname = new_user_surname ? decodeURI(new_user_surname) : "";
    user_name.textContent = new_user_name;
    user_surname.textContent = new_user_surname;
    // Налаштування кнопки для редагування повного імені користувача.
    edit_user_full_name_button.type = "button";
    edit_user_full_name_button.id = "edit_user_account_full_name";
    edit_user_full_name_button.textContent = "Редагувати";
    edit_user_full_name_button.addEventListener("click", create_edit_account_full_name_field);
    // Очищення елемента, де зберігається повне ім'я користувача, та додавання в нього імені та прізвища (другого імені).
    user_full_name.textContent = "";
    user_full_name.appendChild(user_name);
    user_full_name.appendChild(space_between_name_and_surname);
    user_full_name.appendChild(user_surname);
    // Додавання після елемента, який зберігає повне ім'я користувача, кнопки для його редагування.
    user_full_name.after(edit_user_full_name_button);
}
