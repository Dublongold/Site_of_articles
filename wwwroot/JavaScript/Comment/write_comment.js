async function write_comment(event)
{
    let submit_write_comment_button = event.currentTarget;
    submit_write_comment_button.disabled = true;
    let article_id = get_article_id();
    let write_content_of_comment = document.getElementById("write_content_of_comment");
    const source = "Створення коментаря";
    let error_message = "";
    let where_append = submit_write_comment_button;
    const error_message_id = "create_comment_for_article";
    if(article_id && write_content_of_comment && write_content_of_comment.parentElement)
    {
        where_append = write_content_of_comment.parentElement;
        if(write_content_of_comment.value && write_content_of_comment.value.replace(/\s/g, "").length > 0)
        {
            let formated_text = encodeURIComponent(write_content_of_comment.value.trim().replace(/</g, "$lt").replace(/>/g, "$gt").replace(/\n/g, "<br>").replace(/\s/g, "&nbsp"));
            const create_request = await fetch(`/comment/create/${article_id}/?comment_content=${formated_text}`, {method:"post"});
            if(create_request.ok)
            {
                let comments_of_article = document.getElementsByClassName("comments-of-article")[0];
                if(comments_of_article)
                {
                    if(document.getElementById("comments_not_found"))
                    {
                        document.getElementById("comments_not_found").remove();
                    }
                    comments_of_article.insertAdjacentHTML("afterbegin", await create_request.text());
                    if(create_request.headers.has("comment-id"))
                    {
                        add_event_listeners_for_comment_buttons(get_comment_container_by_comment_id(create_request.headers.get("comment-id")));
                    }
                    if(document.getElementById("comments_not_found"))
                    {
                        document.getElementById("comments_not_found").remove();
                    }
                    write_content_of_comment.value = "";
                    write_content_of_comment.style.height = "50px";
                }
                else
                {
                    error_message = "Не можна знайти місце, де можна розмістити написаний комментар. Він вже створений, просто оновіть сторінку.";
                }
            }
            else
            {
                switch(create_request.status)
                {
                    case 404:
                        error_message = "Не знайдено статті, до якоі для якої ви намагаєтесь написати коментар. Можливо, її видалили.";
                        break;
                    case 401:
                        error_message = "Ви неавторизовані. Будь-ласка, авторизуйтеся, щоб мати можливість писати коментарі.";
                        break;
                    case 403:
                        error_message = "Ви не маєте права писати тут коментарі.";
                        break;
                    case 500:
                        error_message = "Виникла помилка на сервері при спробі створити коментар.";
                        break;
                    default:
                        error_message = `Виникла неочікувана помилка з кодом ${create_request.status}.`;
                }
            }
        }
        else
        {
            error_message = "Коментар не має бути пустим або містити лише пробільні символи.";
        }
    }
    error_message_editor(source, error_message, where_append, error_message_id);
    submit_write_comment_button.disabled = false;
}

let submit_write_comment = document.getElementById("submit_write_comment");
if(submit_write_comment)
{
    submit_write_comment.addEventListener("click", write_comment);
}