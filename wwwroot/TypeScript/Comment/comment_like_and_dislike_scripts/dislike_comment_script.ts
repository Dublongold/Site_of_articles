async function dislike_comment(this_element: HTMLButtonElement, comment_id: string)
{
    this_element.disabled = true;
    let article_id = get_article_id();
    let comment_element = get_comment_container_by_comment_id(comment_id);
    let comment_like_button = comment_element.querySelector(".like-button-of-comment") as HTMLButtonElement;
    let comment_dislike_button = this_element;
    let like_count = comment_element.querySelector(".number-of-comment-likes") as HTMLSpanElement;
    let dislike_count = comment_element.querySelector(".number-of-comment-dislikes") as HTMLSpanElement;

    const source = "Кнопка \"Не подобається\"";
    let error_message = "";
    let where_append = this_element.parentElement;
    const error_message_id = "comment_" + comment_id;

    if(comment_element && comment_like_button && comment_dislike_button && like_count && dislike_count)
    {
        var result = await fetch(`/comment/reaction/${comment_id}/${article_id}/?reaction_type=dislike`,{method:"post"});

        if(result.ok)
        {
            var result_text = await result.text();
            
            if(result_text == "a" || result_text == "r" || result_text == "c")
            {
                dislike_count.textContent = result.headers.get("dislike-count");
            }
            if(result_text == "a")
            {
                comment_dislike_button.style.backgroundColor = "#ff8e8e";
            }
            else if(result_text == "r")
            {
                comment_dislike_button.style.backgroundColor = "unset";
            }
            else if(result_text == "c")
            {
                like_count.textContent = result.headers.get("like-count");
                comment_like_button.style.backgroundColor = "unset";
                comment_dislike_button.style.backgroundColor = "#ff8e8e";
            }

            change_comment_color(parseInt(like_count.textContent ?? "NaN"), parseInt(dislike_count.textContent ?? "NaN"), comment_id);
        }
        else
        {
            if(result.status === 401)
            {
                error_message = "Ви неавторизовані. Будь-ласка, авторизуйтесь, щоб мати можливість реагувати на коментарі.";
            }
            else if(result.status === 404)
            {
                error_message = "Вибачте, але цього коментаря не існує. Спробуйте оновити сторінку.";
            }
            else
            {
                error_message = "Виникла неочікувана помилка.";
            }
        }
    }
    else
    {
        error_message = "Не знайдено коментаря, на який потрібно відреагувати.";
    }
    error_message_editor(source, error_message, where_append, error_message_id);
    this_element.disabled = false;
}