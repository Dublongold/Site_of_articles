"use strict";
function login() {
    var login_label_element = document.createElement("label");
    var password_label_element = document.createElement("label");
    var login_textbox_element = document.createElement("input");
    var password_textbox_element = document.createElement("input");
    var form_for_login = document.createElement("form");
    let error_message_login_path = document.createElement("div");
    form_for_login.id = "form_for_login_elements";
    form_for_login.method = "post";
    form_for_login.action = "/account/login";
    login_label_element.innerText = "Логін:";
    password_label_element.innerText = "Пароль:";
    login_textbox_element.name = "Login";
    login_textbox_element.id = "login_path_login";
    password_textbox_element.name = "Password";
    password_textbox_element.id = "login_path_password";
    password_textbox_element.type = "password";
    var login_button = document.createElement("button");
    login_button.id = "login_submit_button";
    login_button.textContent = "Увійти";
    login_button.type = "button";
    login_button.addEventListener("click", submit_login_data);
    var cancel_button = document.createElement("button");
    cancel_button.id = "login_cancel_button";
    cancel_button.textContent = "Скасувати";
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
    /*
    let error_message_container = document.createElement("div") as HTMLDivElement;
    error_message_container.className = "login-path-error-message";

    form_for_login.appendChild(error_message_container);*/
    var div_for_login_path = document.getElementById("div_for_login_path");
    if (div_for_login_path) {
        while (div_for_login_path.firstChild !== null && div_for_login_path.firstChild != undefined) {
            div_for_login_path.removeChild(div_for_login_path.firstChild);
        }
        div_for_login_path.appendChild(form_for_login);
    }
}
async function logout() {
    var result = await fetch(`/account/logout/`, { method: "post" });
    if (result.ok) {
        disable_all_buttons();
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
    let form_for_login = document.getElementById("form_for_login_elements");
    let error_message_editor = new Error_message_editor("Вхід в обліковий запис", form_for_login, "login_path");
    error_message_editor.need_write_source = false;
    let login_texbox_element = document.getElementById("login_path_login");
    let password_texbox_element = document.getElementById("login_path_password");
    if (!login_texbox_element.value || password_texbox_element.value.trim().length === 0 || !password_texbox_element.value || password_texbox_element.value.trim().length === 0) {
        error_message_editor.error_message = "Ви повинні ввести логін та пароль!";
    }
    else {
        const login_request = await fetch(`/account/login/`, { method: "post", body: new FormData(form_for_login) });
        const login_request_text = await login_request.text();
        if (login_request.ok) {
            document.location.reload();
            return;
        }
        else {
            if (login_request_text === "invalid_login") {
                error_message_editor.error_message = `Не знайдено користувача з логіном "${login_texbox_element.value}".`;
            }
            else if (login_request_text === "invalid_password") {
                error_message_editor.error_message = `Неправильний пароль.`;
            }
            else {
                error_message_editor.error_message = `Виникла неочікувана помилка з кодом ${login_request.status}...`;
            }
        }
    }
    if (error_message_editor.error_message)
        error_message_editor.send();
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
    let login_submit_button = document.getElementById("login_submit_button");
    let login_cancel_button = document.getElementById("login_cancel_button");
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
        register_button.addEventListener("click", function () {
            disable_all_buttons();
            document.location.assign("/account/register");
        });
    }
    if (logout_button) {
        logout_button.addEventListener("click", logout);
    }
    if (login_submit_button) {
        login_submit_button.addEventListener("click", submit_login_data);
    }
    if (login_cancel_button) {
        login_cancel_button.addEventListener("click", cancel_login);
    }
});
