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
        const source = "Редагування опису користувача";
        let error_message = "";
        let where_append = user_about ?? this_element.parentElement;
        const error_message_id = "edit_user_about";
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
            error_message = "Не знайдено якийсь із елементів, необхідних для виконання дії цієї кнопки";
        error_message_editor(source, error_message, where_append, error_message_id);
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
function change_user_photo(event) {
    let this_element = event.target;
    let user_profile_photo = document.getElementById("user_profile_photo");
    if (this_element && this_element.files && user_profile_photo) {
        let file = this_element.files[0];
        let file_reader = new FileReader();
        file_reader.addEventListener("loadend", async function () {
            let user_login_element = document.querySelector("#user_login");
            let user_login = "";
            if (user_login_element) {
                let user_login_a_element = user_login_element.firstChild;
                if (user_login_a_element)
                    user_login = user_login_a_element.textContent ?? "";
            }
            if (user_profile_photo && file_reader.result && user_login) {
                let reader_result = file_reader.result.toString();
                let request_address = `/account/edit/${encodeURIComponent(user_login.substring(1))}`;
                const change_photo_request = await fetch(request_address, {
                    method: "put",
                    headers: {
                        'operation-with-data': 'photo',
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify(reader_result)
                });
                if (change_photo_request.ok) {
                    user_profile_photo.src = reader_result;
                }
                else {
                    if (this_element) {
                        error_message_editor("Зміна фото", "Не вдалося змінити фото. Виникла помилка з кодом: " + change_photo_request.status, this_element.parentElement, "change_user_photo");
                    }
                }
            }
        });
        if (file) {
            file_reader.readAsDataURL(file);
        }
    }
}
document.addEventListener("DOMContentLoaded", function () {
    let edit_user_account_full_name = document.getElementById("edit_user_account_full_name");
    let edit_user_account_about = document.getElementById("edit_user_account_about");
    let change_user_photo_input = document.getElementById("change_user_photo_input");
    if (edit_user_account_full_name)
        edit_user_account_full_name.addEventListener("click", create_edit_account_full_name_field);
    if (edit_user_account_about)
        edit_user_account_about.addEventListener("click", create_edit_account_about_field);
    if (change_user_photo_input)
        change_user_photo_input.addEventListener("change", change_user_photo);
});
