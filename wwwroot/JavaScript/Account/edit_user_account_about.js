"use strict";
function create_edit_account_about_field(event) {
    let this_element = event.currentTarget;
    let user_about = document.getElementById("user_about");
    let user_about_text = document.getElementById("user_about_text");
    if (user_about && user_about_text && this_element) {
        let edit_user_about = document.createElement("textarea");
        let save_edit_user_account_about = document.createElement("button");
        let cancel_edit_user_account_about = document.createElement("button");
        edit_user_about.value = user_about_text.textContent ?? "";
        edit_user_about.id = "edit_user_about";
        edit_user_about.maxLength = 200;
        save_edit_user_account_about.textContent = "Зберегти";
        save_edit_user_account_about.type = "button";
        save_edit_user_account_about.id = "save_edit_user_account_about";
        save_edit_user_account_about.addEventListener("click", function (event) { save_edit_account_about_field(event); });
        cancel_edit_user_account_about.textContent = "Скасувати";
        cancel_edit_user_account_about.type = "button";
        cancel_edit_user_account_about.id = "cancel_edit_user_account_about";
        cancel_edit_user_account_about.addEventListener("click", function () { remove_edit_account_about_field(user_about_text.textContent); });
        user_about_text.remove();
        this_element.remove();
        user_about.appendChild(edit_user_about);
        user_about.appendChild(save_edit_user_account_about);
        user_about.appendChild(cancel_edit_user_account_about);
        if (this_element)
            this_element.remove();
    }
}
async function save_edit_account_about_field(event) {
    let this_element = event.currentTarget;
    if (this_element) {
        this_element.disabled = true;
        let user_about = document.getElementById("user_about");
        let edit_user_about = document.getElementById("edit_user_about");
        let error_message_editor = new Error_message_editor("Редагування опису користувача", user_about ?? this_element.parentElement, "edit_user_about");
        let user_login_element = document.querySelector("#user_login");
        let user_login = "";
        if (user_login_element) {
            let user_login_a_element = user_login_element.firstChild;
            if (user_login_a_element)
                user_login = user_login_a_element.textContent ?? "";
        }
        if (user_about && edit_user_about) {
            const request_to_edit = await fetch(`/account/edit/${encodeURIComponent(user_login.substring(1))}/${encodeURIComponent(edit_user_about.value.trim())}`, {
                method: "put",
                headers: new Headers({
                    'operation-with-data': 'about'
                })
            });
            if (request_to_edit.ok) {
                remove_edit_account_about_field(decodeURIComponent(request_to_edit.headers.get("user-about") ?? ""));
            }
            else {
                switch (request_to_edit.status) {
                    case 404:
                        error_message_editor.error_message = "Вибачте, яле цього користувача немає в базі даних. Можливо, його видалили або просто неправильний логін був переданий в запиті.";
                        break;
                    case 403:
                        error_message_editor.error_message = "У вас немає прав редагувати цього користувача!";
                        break;
                    case 401:
                        error_message_editor.error_message = "Ви неавторизовані. Будь-ласка, авторизуйтесь, щоб мати можливість реагувати свій обліковий запис.";
                        break;
                    default:
                        error_message_editor.error_message = `Виникла неочікувана помилка з кодом ${request_to_edit.status}.`;
                }
            }
        }
        else
            error_message_editor.error_message = "Не знайдено якийсь із елементів, необхідних для виконання дії цієї кнопки";
        error_message_editor.send();
        this_element.disabled = false;
    }
}
function remove_edit_account_about_field(set_about) {
    // Беремо елемент, який зберігає елементи, де описується користувач.
    let user_about = document.getElementById("user_about");
    // Беремо елементи, які призначені були для редагування.
    let edit_user_about = document.getElementById("edit_user_about");
    let save_edit_user_account_about = document.getElementById("save_edit_user_account_about");
    let cancel_edit_user_account_about = document.getElementById("cancel_edit_user_account_about");
    // Створення елементу з описом користувача.
    let user_about_text = document.createElement("span");
    // Створення кнопки для редагування опису користувача.
    let edit_user_about_button = document.createElement("button");
    // Налаштування елемента, де буде зберігатися опис користувача.
    user_about_text.id = "user_about_text";
    // Беремо текст опису користувача і присвоюємо.
    user_about_text.textContent = set_about;
    // Налаштування кнопки для редагування опису користувача.
    edit_user_about_button.type = "button";
    edit_user_about_button.id = "edit_user_account_about";
    edit_user_about_button.textContent = "Редагувати";
    edit_user_about_button.addEventListener("click", create_edit_account_about_field);
    // Очищення елемента, щоб повернути все назад.
    edit_user_about.remove();
    save_edit_user_account_about.remove();
    cancel_edit_user_account_about.remove();
    // Додавайння елемента, який зберігає текст та кнопки для редагування.
    user_about.appendChild(user_about_text);
    user_about.appendChild(edit_user_about_button);
}
