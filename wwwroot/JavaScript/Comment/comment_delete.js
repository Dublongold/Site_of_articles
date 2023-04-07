 function delete_comment(event, comment_id, reference_to_button_function)
{
    event.target.textContent = "Ви впевнені?";
    event.target.removeEventListener("click", reference_to_button_function);
    let delete_comment_temp_function = function(event) {sure_delete_comment(event.target, comment_id)}
    event.target.addEventListener("click", delete_comment_temp_function);
    setTimeout(not_sure_delete_comment, 3000, event, comment_id, delete_comment_temp_function);
}
async function sure_delete_comment(this_element, comment_id)
{
    this_element.disabled = true;
    this_element.setAttribute("start_delete_comment", "true");
    let article_id = get_article_id();
    let result = await fetch(`/comment/delete/${comment_id}/${article_id}`, {method:"delete"});

    let comment_container = get_comment_container_by_comment_id(comment_id);

    const source = "Кнопка \"Видалити\"";
    let error_message = "";
    let where_append = comment_container.getElementsByClassName("comment-reaction-container")[0];
    const error_message_id = "delete_comment_" + comment_id;

    if(result.ok)
    {
        if(comment_container)
        {
            if(comment_container.getElementsByClassName("replies-button-of-comment").length == 1)
            {
                let replies_button_of_comment = comment_container.getElementsByClassName("replies-button-of-comment")[0];
                if(replies_button_of_comment && replies_button_of_comment.hasAttribute("replies_are_hidened") && replies_button_of_comment.getAttribute("replies_are_hidened") === "false")
                {
                    await replies_controller(replies_button_of_comment, comment_id);
                }
            }
            if(comment_container.parentElement
                && comment_container.parentElement.className === "reply-comments"
                && comment_container.parentElement.hasAttribute("reply_to_comment"))
            {
                let reply_to_comment_id = comment_container.parentElement.getAttribute("reply_to_comment");
                // Під main_comment мається на увазі, що це коментар, на який відповідає коментар, який потрібно видалили. Просто якщо це вказати в змінній, то вийде занадто велика назва.
                let main_comment = get_comment_container_by_comment_id(reply_to_comment_id);
                if(main_comment)
                {
                    let replies_button_of_main_comment = main_comment.getElementsByClassName("replies-button-of-comment")[0];
                    let count_replies_of_main_comment_text = replies_button_of_main_comment.getElementsByClassName("count-replies-of-comment")[0];
                    change_replies_count_by_replies_button_of_comment_text(count_replies_of_main_comment_text, result.headers.get("replies-count"));
                }
            }
            //reply-comments
            comment_container.remove();
            let result_text = await result.text();
            if(result_text === "0")
                document.getElementsByClassName("comments-of-article")[0].insertAdjacentHTML("afterbegin", "<p id=\"comments_not_found\"><em>Коментарів ще немає...</em></p>");
        }
    }
    else 
    {
        switch(result.status)
        {
            case 401:
                error_message = "Ви не авторизовані. Будь-ласка, авторизуйтеся, щоб мати можливість видаляти власні (і не тільки, якщо маєте права) коментарі.";
                break;
            case 403:
                error_message = "Вибачте, але у вас немає доступу до цієї дії.";
                break;
            case 404:
                error_message = "Серверу не вдалося знайти цей коментар. Можливо, його більше не існує? Спробуйте оновити сторінку.";
                break;
            default:
                error_message = "Виникла неочікувана помилка.";
        }
    }
    error_message_editor(source, error_message, where_append, error_message_id);
    this_element.disabled = false;
}

function not_sure_delete_comment(event, comment_id, reference_to_button_function)
{
    if(!event.target.hasAttribute("start_delete_comment") || event.target.getAttribute("start_delete_comment") !== "true")
    {
        event.target.textContent = "Видалити";
        event.target.removeEventListener("click", reference_to_button_function);
        event.target.addEventListener("click", function(event){delete_comment(event, comment_id)});
    }
}