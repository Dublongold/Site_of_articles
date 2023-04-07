"use strict";
async function account_reaction(this_element, other_element, is_like) {
    if (this_element) {
        this_element.disabled = true;
        const source = `Кнопка "${is_like ? "П" : "Не п"}одобається"`;
        let error_message = "";
        let this_parent = this_element.parentElement;
        let where_append = this_parent && this_parent.parentElement ? this_parent.parentElement : null;
        const error_message_id = "account_reaction";
        let user_login_element = document.querySelector("#user_login");
        let user_login = "";
        if (user_login_element) {
            let user_login_a_element = user_login_element.firstChild;
            if (user_login_a_element) {
                user_login = user_login_a_element.textContent ?? "";
            }
        }
        if (user_login && user_login.length > 5) {
            let reaction_text_of_this = is_like ? "like" : "dislike";
            let reaction_text_of_other = !is_like ? "like" : "dislike";
            let this_count = document.getElementById(`number_of_account_${reaction_text_of_this}s`);
            let other_count = document.getElementById(`number_of_account_${reaction_text_of_other}s`);
            if (this_element && other_element && this_count && other_count) {
                var result = await fetch(`/account/reaction/${user_login.substring(1)}/?reaction_type=${reaction_text_of_this}`, { method: "post" });
                if (result.ok) {
                    var result_text = await result.text();
                    if (result_text == "a" || result_text == "r" || result_text == "c") {
                        this_count.textContent = result.headers.get(`${reaction_text_of_this}-count`);
                    }
                    if (result_text == "a") {
                        this_element.style.backgroundColor = `#${is_like ? "8eff" : "ff8e"}8e`;
                    }
                    else if (result_text == "r") {
                        this_element.style.backgroundColor = "unset";
                    }
                    else if (result_text == "c") {
                        this_element.style.backgroundColor = `#${is_like ? "8eff" : "ff8e"}8e`;
                        other_element.style.backgroundColor = "unset";
                        other_count.textContent = result.headers.get(`${reaction_text_of_other}-count`);
                    }
                }
                else {
                    if (result.status === 401) {
                        error_message = "Ви неавторизовані. Будь-ласка, авторизуйтесь, щоб мати можливість реагувати на цю статтю.";
                    }
                    else if (result.status === 403) {
                        error_message = "Самому собі подобатися можна, але тут цього робити за допомогою цієї кнопки не можна :).";
                    }
                    else if (result.status === 404) {
                        error_message = "Вибачте, але цього користувача не існує. Спробуйте оновити сторінку або перейти на головну.";
                    }
                    else {
                        error_message = "Виникла неочікувана помилка.";
                    }
                }
            }
            else {
                error_message = "Проблема зі знаходженням потрібних елементів для виконання цієї дії.";
            }
        }
        else {
            error_message = "Проблема зі знаходженням логіну користувача.";
        }
        error_message_editor(source, error_message, where_append, error_message_id);
        this_element.disabled = false;
    }
}
document.addEventListener("DOMContentLoaded", function () {
    let account_like_button = document.getElementById("account_like_button");
    let account_dislike_button = document.getElementById("account_dislike_button");
    if (account_like_button && account_dislike_button) {
        account_like_button.addEventListener("click", function () { account_reaction(account_like_button, account_dislike_button, true); });
        account_dislike_button.addEventListener("click", function () { account_reaction(account_dislike_button, account_like_button, false); });
    }
});
