"use strict";
function login() {
    var login_label_element = document.createElement("label");
    var password_label_element = document.createElement("label");
    var login_textbox_element = document.createElement("input");
    var password_textbox_element = document.createElement("input");
    var error_message = document.createElement("span");
    var form_for_login = document.createElement("form");
    let error_message_login_path = document.createElement("div");
    form_for_login.id = "form_for_login_elements";
    login_label_element.innerText = "Логін:";
    password_label_element.innerText = "Пароль:";
    login_textbox_element.name = "Login";
    login_textbox_element.id = "login_path_login";
    error_message.id = "login_error_message";
    password_textbox_element.name = "Password";
    password_textbox_element.id = "login_path_password";
    password_textbox_element.type = "password";
    var login_button = document.createElement("button");
    login_button.innerText = "Увійти";
    login_button.type = "button";
    login_button.addEventListener("click", submit_login_data);
    var cancel_button = document.createElement("button");
    cancel_button.innerText = "Скасувати";
    cancel_button.type = "button";
    cancel_button.addEventListener("click", cancel_login);
    error_message_login_path.id = "error_message_login_path";
    error_message_login_path.className = "error-message";
    var temp_list = [login_label_element, login_textbox_element, login_button, error_message_login_path,
        password_label_element, password_textbox_element, cancel_button];
    for (let elem of temp_list) {
        let temp_div_elem = document.createElement("div");
        temp_div_elem.appendChild(elem);
        form_for_login.appendChild(temp_div_elem);
    }
    let error_message_container = document.createElement("div");
    error_message_container.className = "login-path-error-message";
    form_for_login.appendChild(error_message_container);
    var div_for_login_path = document.getElementById("div_for_login_path");
    while (div_for_login_path.firstChild !== null && div_for_login_path.firstChild != undefined) {
        div_for_login_path.removeChild(div_for_login_path.firstChild);
    }
    div_for_login_path.appendChild(form_for_login);
}
async function logout() {
    var result = await fetch(`/account/logout/`, { method: "post" });
    if (result.ok) {
        document.location.reload();
    }
}
async function cancel_login() {
    var div_for_login_path = document.getElementById("div_for_login_path");
    if (div_for_login_path) {
        while (div_for_login_path.firstChild !== null && div_for_login_path.firstChild != undefined) {
            div_for_login_path.removeChild(div_for_login_path.firstChild);
        }
        let login_button = document.createElement("button");
        let register_button = document.createElement("button");
        login_button.textContent = "Увійти";
        register_button.textContent = "Зареєструватися";
        login_button.id = "login_button";
        register_button.id = "register_button";
        login_button.addEventListener("click", login);
        register_button.addEventListener("click", function () { document.location.assign("/account/register"); });
        div_for_login_path.appendChild(login_button);
        div_for_login_path.appendChild(document.createTextNode(" "));
        div_for_login_path.appendChild(register_button);
    }
}
async function submit_login_data() {
    const source = "Вхід в обліковий запис";
    let error_message = "";
    let where_append = document.getElementById("form_for_login_elements");
    const error_message_id = "login_path";
    let login_texbox_element = document.getElementById("login_path_login");
    let password_texbox_element = document.getElementById("login_path_password");
    if (!login_texbox_element.value || password_texbox_element.value.trim().length === 0 || !password_texbox_element.value || password_texbox_element.value.trim().length === 0) {
        error_message = "Ви повинні ввести логін та пароль!";
    }
    else {
        const result = await fetch(`/account/login/?login=${login_texbox_element.value}&password=${password_texbox_element.value}`, { method: "post" });
        const result_text = await result.text();
        if (result.ok) {
            document.location.reload();
            return;
        }
        else {
            if (result_text === "invalid_login") {
                error_message = `Не знайдено користувача з логіном "${login_texbox_element.value}".`;
            }
            else if (result_text === "invalid_password") {
                error_message = `Неправильний пароль.`;
            }
            else {
                error_message = `Виникла неочікувана помилка...`;
            }
        }
    }
    error_message_editor(source, error_message, where_append, error_message_id);
}
function follow_to_article_create() {
    document.location.assign("/article/create");
}
function follow_to_user_articles() {
    document.location.assign("/account/articles");
}
document.addEventListener("DOMContentLoaded", function () {
    let follow_to_article_create_button = document.getElementById("follow_to_article_create_button");
    let follow_to_user_articles_button = document.getElementById("follow_to_user_articles_button");
    let login_button = document.getElementById("login_button");
    let register_button = document.getElementById("register_button");
    let logout_button = document.getElementById("logout_button");
    if (follow_to_article_create_button) {
        follow_to_article_create_button.addEventListener("click", follow_to_article_create);
    }
    if (follow_to_user_articles_button) {
        follow_to_user_articles_button.addEventListener("click", follow_to_user_articles);
    }
    if (login_button) {
        login_button.addEventListener("click", login);
    }
    if (register_button) {
        register_button.addEventListener("click", function () { document.location.assign("/account/register"); });
    }
    if (logout_button) {
        logout_button.addEventListener("click", logout);
    }
});
