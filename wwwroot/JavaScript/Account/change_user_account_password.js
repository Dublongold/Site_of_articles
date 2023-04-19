"use strict";
function change_user_password(event) {
    if (event) {
        let this_element = event.currentTarget;
        if (this_element) {
            let parent_element = this_element.parentElement;
            if (parent_element) {
                parent_element.textContent = "";
                let enter_user_password_label = document.createElement("label");
                enter_user_password_label.textContent = "Введіть ваш пароль для перевірки:";
                enter_user_password_label.htmlFor = "enter_user_password_input";
                let enter_user_password_input = document.createElement("input");
                enter_user_password_input.id = "enter_user_password_input";
                enter_user_password_input.type = "password";
                let check_entered_by_user_password_buttons = document.createElement("div");
                check_entered_by_user_password_buttons.id = "check_entered_by_user_password_buttons";
                let enter_user_password_submit = document.createElement("button");
                enter_user_password_submit.type = "button";
                enter_user_password_submit.textContent = "Перевірити";
                enter_user_password_submit.id = "enter_user_password_submit";
                enter_user_password_submit.addEventListener("click", check_entered_by_user_password);
                let cancel_enter_user_password = document.createElement("button");
                cancel_enter_user_password.type = "button";
                cancel_enter_user_password.textContent = "Скасувати";
                cancel_enter_user_password.id = "cancel_enter_user_password";
                cancel_enter_user_password.addEventListener("click", remove_change_user_password_elements);
                parent_element.className = "check-user-password";
                check_entered_by_user_password_buttons.appendChild(enter_user_password_submit);
                check_entered_by_user_password_buttons.appendChild(cancel_enter_user_password);
                parent_element.appendChild(enter_user_password_label);
                parent_element.appendChild(enter_user_password_input);
                parent_element.appendChild(check_entered_by_user_password_buttons);
            }
        }
    }
}
function remove_change_user_password_elements() {
    let user_password_container = document.getElementById("user_password_container");
    if (user_password_container) {
        let user_password_text = document.createElement("span");
        user_password_text.textContent = "Пароль:";
        user_password_text.id = "user_password_text";
        let user_password = document.createElement("span");
        user_password.id = "user_password";
        user_password.textContent = "************";
        let change_user_password_button = document.createElement("button");
        change_user_password_button.id = "change_user_password_button";
        change_user_password_button.textContent = "Змінити";
        change_user_password_button.addEventListener("click", change_user_password);
        user_password_container.textContent = "";
        if (user_password_container.hasAttribute("class")) {
            user_password_container.removeAttribute("class");
        }
        user_password_container.appendChild(user_password_text);
        user_password_container.appendChild(user_password);
        user_password_container.appendChild(change_user_password_button);
    }
}
async function check_entered_by_user_password(event) {
    let user_password_container = document.getElementById("user_password_container");
    let error_message_editor = new Error_message_editor("Зміна паролю", user_password_container, "change_user_password");
    if (event) {
        let this_element = event.currentTarget;
        if (this_element) {
            if (user_password_container) {
                error_message_editor.where_append = user_password_container;
                let enter_user_password_input = document.getElementById("enter_user_password_input");
                if (enter_user_password_input) {
                    let password_for_check = enter_user_password_input.value;
                    let user_login = document.getElementById("user_login");
                    let user_login_first_child = user_login.firstElementChild;
                    let login = null;
                    if (user_login_first_child && user_login_first_child.textContent) {
                        login = user_login_first_child.textContent.substring(1);
                    }
                    if (password_for_check && login) {
                        const check_request = await fetch(`/account/check/password/?login=${login}&password=${password_for_check}`, { method: "post" });
                        if (check_request.ok) {
                            user_password_container.className = "change-user-password";
                            let new_user_password_text = document.createElement("label");
                            new_user_password_text.textContent = "Введіть новий пароль:";
                            new_user_password_text.htmlFor = "new_user_password";
                            let new_user_password_confirm_text = document.createElement("label");
                            new_user_password_confirm_text.textContent = "Підтвердіть новий пароль:";
                            new_user_password_confirm_text.htmlFor = "new_user_password_confirm";
                            let new_user_password = document.createElement("input");
                            new_user_password.id = "new_user_password";
                            new_user_password.type = "password";
                            let new_user_password_confirm = document.createElement("input");
                            new_user_password_confirm.id = "new_user_password_confirm";
                            new_user_password_confirm.type = "password";
                            let change_user_password_submit = document.createElement("button");
                            change_user_password_submit.textContent = "Зберегти";
                            change_user_password_submit.type = "button";
                            change_user_password_submit.id = "change_user_password_submit";
                            change_user_password_submit.addEventListener("click", submit_change_user_password);
                            let cancel_change_user_password = document.createElement("button");
                            cancel_change_user_password.type = "button";
                            cancel_change_user_password.textContent = "Скасувати";
                            cancel_change_user_password.id = "cancel_change_user_password";
                            cancel_change_user_password.addEventListener("click", remove_change_user_password_elements);
                            let change_user_password_buttons = document.createElement("div");
                            change_user_password_buttons.id = "change_user_password_buttons";
                            change_user_password_buttons.appendChild(change_user_password_submit);
                            change_user_password_buttons.appendChild(cancel_change_user_password);
                            user_password_container.textContent = "";
                            user_password_container.appendChild(new_user_password_text);
                            user_password_container.appendChild(new_user_password);
                            user_password_container.appendChild(new_user_password_confirm_text);
                            user_password_container.appendChild(new_user_password_confirm);
                            user_password_container.appendChild(change_user_password_buttons);
                        }
                        else {
                            switch (check_request.status) {
                                case 403:
                                    error_message_editor.error_message = "Неправильний пароль.";
                                    break;
                                case 404:
                                    error_message_editor.error_message = `Не знайдено користувача з логіном "${login}}".`;
                                    break;
                                case 400:
                                    error_message_editor.error_message = "Відправлений на сервер пароль або логін виявились пустими.";
                                    break;
                                default:
                                    error_message_editor.error_message = 'Виникла неочікувана помилка з кодом ${check_request.status}.';
                            }
                        }
                    }
                    else if (login)
                        error_message_editor.error_message = "Пароль пустий.";
                    else
                        error_message_editor.error_message = "Неможливо передати логін.";
                }
                else
                    error_message_editor.error_message = "Не вдалося знайти поле, яке містило б пароль для перевірки.";
            }
            else
                error_message_editor.error_message = "Чомусь, батьківський елемент цього елементу відсутній.";
        }
        else
            error_message_editor.error_message = "Неможливо отримати елемент-кнопку, яка запустила цю подію.";
    }
    else
        error_message_editor.error_message = "Помилка з подією в обробнику події.";
    error_message_editor.send();
}
async function submit_change_user_password(event) {
    let user_password_container = document.getElementById("user_password_container");
    let error_message_editor = new Error_message_editor("Зміна паролю", user_password_container, "submit_change_user_password");
    if (event) {
        let this_element = event.currentTarget;
        if (this_element) {
            if (user_password_container) {
                error_message_editor.where_append = user_password_container;
                let new_user_password = document.getElementById("new_user_password");
                let new_user_password_confirm = document.getElementById("new_user_password_confirm");
                if (new_user_password && new_user_password_confirm) {
                    let password = new_user_password.value;
                    let confirm_password = new_user_password_confirm.value;
                    if (medium_password.test(password)) {
                        if (confirm_password === password) {
                            let user_login = document.getElementById("user_login");
                            let user_login_first_child = user_login.firstElementChild;
                            let login = null;
                            if (user_login_first_child && user_login_first_child.textContent) {
                                login = user_login_first_child.textContent.substring(1);
                            }
                            if (login) {
                                const change_password_request = await fetch(`/account/edit/${login}/${password}`, { method: "put", headers: { "operation-with-data": "password" } });
                                if (change_password_request.ok) {
                                    remove_change_user_password_elements();
                                }
                                else {
                                    switch (change_password_request.status) {
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
                                            error_message_editor.error_message = `Виникла неочікувана помилка з кодом ${change_password_request.status}.`;
                                    }
                                }
                            }
                        }
                        else
                            error_message_editor.error_message = "Паролі не співпадають.";
                    }
                    else
                        error_message_editor.error_message = "Пароль занадто простий.";
                }
                else
                    error_message_editor.error_message = "Не вдалося знайти поля, у яких міститься пароль та підтвердження паролю.";
            }
            else
                error_message_editor.error_message = "Чомусь, батьківський елемент цього елементу відсутній.";
        }
        else
            error_message_editor.error_message = "Неможливо отримати елемент-кнопку, яка запустила цю подію.";
    }
    else
        error_message_editor.error_message = "Помилка з подією в обробнику події.";
    if (error_message_editor.error_message)
        error_message_editor.send();
}
document.addEventListener("DOMContentLoaded", function () {
    let change_user_password_button = document.getElementById("change_user_password_button");
    if (change_user_password_button) {
        change_user_password_button.addEventListener("click", change_user_password);
    }
});
