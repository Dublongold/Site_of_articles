"use strict";
async function load_more_articles(event) {
    const source = "Довантаження статей";
    let error_message = "";
    let where_append = null;
    const error_message_id = "load_more_articles";
    if (event) {
        let this_element = event.currentTarget;
        if (this_element) {
            let last_article_id = this_element.getAttribute("last_article_id");
            if (last_article_id) {
                const load_request = await fetch(`/article/load_more/home/${last_article_id}`);
                if (load_request.ok) {
                    this_element.insertAdjacentHTML("beforebegin", await load_request.text());
                    last_article_id = load_request.headers.get("last-article-id");
                    if (last_article_id)
                        this_element.setAttribute("last_article_id", last_article_id);
                    else
                        this_element.remove();
                }
                else
                    console.log("Bad request");
            }
            else
                console.log("last_article_id not found.");
        }
        else
            console.log("this element not found.");
    }
    else
        console.log("event not found.");
    error_message_editor(source, error_message, where_append, error_message_id);
}
document.addEventListener("DOMContentLoaded", function () {
    let load_more_articles_button = document.getElementById("load_more_articles");
    if (load_more_articles_button) {
        load_more_articles_button.addEventListener("click", load_more_articles);
    }
});
