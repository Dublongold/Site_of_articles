"use strict";
async function load_more_articles(event) {
    const source = "Довантаження статей";
    let error_message = "";
    let where_append = null;
    const error_message_id = "load_more_articles";
    if (event) {
        let this_element = event.currentTarget;
        if (this_element) {
            this_element.disabled = true;
            let last_article_id = this_element.getAttribute("last_article_id");
            let sort_articles_by_element = document.getElementById("sort_articles_by");
            if (last_article_id) {
                let where_load = window.location.pathname.substring(1);
                if (where_load === "") {
                    where_load = "home";
                }
                const load_request = await fetch(`/article/load_more/${where_load}/${last_article_id}`, { headers: { "sort-by": sort_articles_by_element.value } });
                if (load_request.ok) {
                    this_element.insertAdjacentHTML("beforebegin", await load_request.text());
                    last_article_id = load_request.headers.get("last-article-id");
                    if (last_article_id)
                        this_element.setAttribute("last_article_id", last_article_id);
                    else
                        this_element.remove();
                }
                else
                    error_message = "Поганий запит с кодом " + load_request.status;
            }
            else
                error_message = "Атрибут last_article_id не знайдено.";
            this_element.disabled = false;
        }
        else
            error_message = "Цей елемент не знайдено.";
    }
    else
        error_message = "Подію не знайдено.";
    error_message_editor(source, error_message, where_append, error_message_id);
}
function add_event_listener_for_load_more_acticles() {
    let load_more_articles_button = document.getElementById("load_more_articles");
    if (load_more_articles_button) {
        load_more_articles_button.addEventListener("click", load_more_articles);
    }
}
document.addEventListener("DOMContentLoaded", function () {
    add_event_listener_for_load_more_acticles();
});
