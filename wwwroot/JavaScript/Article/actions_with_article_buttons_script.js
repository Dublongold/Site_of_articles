"use strict";
function open_article(event, article_id) {
    let this_element = event.currentTarget;
    if (this_element) {
        disable_all_buttons();
        window.location.assign(`/article/read/${article_id}`);
    }
}
function edit_article(event, article_id) {
    let this_element = event.currentTarget;
    if (this_element) {
        this_element.disabled = true;
        window.location.assign(`/article/edit/${article_id}`);
    }
}
function delete_article(event, article_id, event_for_remove) {
    let this_element = event.target;
    if (this_element) {
        this_element.innerText = "Ви впевнені?";
        this_element.removeEventListener("click", event_for_remove);
        let event_for_pass = function () { sure_delete_article(article_id); };
        this_element.addEventListener("click", event_for_pass);
        setTimeout(not_sure_delete_article, 3000, event, article_id, event_for_pass);
    }
}
function not_sure_delete_article(event, article_id, event_for_remove) {
    let this_element = event.target;
    if (this_element) {
        this_element.textContent = "Видалити";
        this_element.removeEventListener("click", event_for_remove);
        let event_for_pass = function (event) { delete_article(event, article_id, event_for_pass); };
        this_element.addEventListener("click", event_for_pass);
    }
}
async function sure_delete_article(article_id) {
    let result = await fetch(`/article/delete/${article_id}`, { method: "post" });
    if (result.ok) {
        disable_all_buttons();
        window.location.reload();
    }
    else {
        alert(`Виникла помилка під час спроби видалити статтю (Код помилки: ${result.status})`);
    }
}
function actions_with_article(event, article_id, event_for_remove) {
    let this_element = event.currentTarget;
    if (this_element) {
        this_element.textContent = "Скасувати";
        this_element.removeEventListener("click", event_for_remove);
        let event_for_pass = function (event) { cancel_actions_with_article(event, article_id, event_for_pass); };
        this_element.addEventListener("click", event_for_pass);
        let array_of_parameters = [{ c: "article-edit-button", f: edit_article, t: "Редагувати" }, { c: "article-delete-button", f: delete_article, t: "Видалити" }];
        for (let parameters_of_button of array_of_parameters) {
            let new_button = document.createElement("button");
            new_button.className = parameters_of_button.c;
            let event_for_pass;
            if (parameters_of_button.f == edit_article) {
                event_for_pass = function (event) { parameters_of_button.f(event, article_id); };
            }
            else {
                event_for_pass = function (event) { parameters_of_button.f(event, article_id, event_for_pass); };
            }
            new_button.addEventListener("click", event_for_pass);
            new_button.innerText = parameters_of_button.t;
            if (this_element.parentElement)
                this_element.parentElement.appendChild(new_button);
            else
                console.log("Not found this_element.parentElement in actions_with_article");
        }
    }
}
function cancel_actions_with_article(event, article_id, event_for_remove) {
    let this_element = event.currentTarget;
    for (let i = 1; i < 3; i++) {
        let next_element = this_element.nextElementSibling;
        if (next_element && (next_element.className === "article-edit-button" || next_element.className === "article-delete-button")) {
            next_element.remove();
        }
    }
    this_element.textContent = "Дії";
    this_element.removeEventListener("click", event_for_remove);
    let event_for_pass = function (event) { actions_with_article(event, article_id, event_for_pass); };
    this_element.addEventListener("click", event_for_pass);
}
function add_interactive_with_new_articles() {
    let preview_article_elements = document.getElementsByClassName("preview-article-container new");
    for (let preview_article_element of Array.from(preview_article_elements)) {
        let article_open_button = preview_article_element.querySelector(".article-open-button");
        let article_actions_button = preview_article_element.querySelector(".article-actions-button");
        if (article_open_button) {
            let article_id = article_open_button.getAttribute("article_id") ?? "";
            if (article_id) {
                article_open_button.removeAttribute("article_id");
                article_open_button.addEventListener("click", function (event) { open_article(event, article_id); });
            }
        }
        if (article_actions_button) {
            let article_id = article_actions_button.getAttribute("article_id") ?? "";
            if (article_id) {
                article_actions_button.removeAttribute("article_id");
                let event_for_pass = function (event) { actions_with_article(event, article_id, event_for_pass); };
                article_actions_button.addEventListener("click", event_for_pass);
            }
        }
        preview_article_element.className = "preview-article-container";
    }
}
document.addEventListener("DOMContentLoaded", function () {
    add_interactive_with_new_articles();
});
