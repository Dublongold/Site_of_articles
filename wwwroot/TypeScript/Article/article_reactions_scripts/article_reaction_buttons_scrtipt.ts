async function article_reaction(this_element: HTMLButtonElement, other_element:HTMLButtonElement, is_like: boolean)
{
    if(this_element)
    {
        this_element.disabled = true;

        let reaction_type = is_like?1:2;
        let reaction_text_of_this = is_like?"like":"dislike";
        let reaction_text_of_other = !is_like?"like":"dislike";

        let this_count = document.getElementById(`${reaction_text_of_this}_count_of_article`) as HTMLSpanElement;
        let other_count = document.getElementById(`${reaction_text_of_other}_count_of_article`) as HTMLSpanElement;

        let where_append = this_element.parentElement && this_element.parentElement.parentElement ? this_element.parentElement : null;
        let error_message_editor = new Error_message_editor(`Кнопка "${is_like?"П":"Не п"}одобається"`, where_append, "article_reaction");
        if(this_element && other_element && this_count && other_count)
        {
            var result = await fetch(`/article/reaction/${article_id}/?reaction_type=${reaction_type}`,{method:"post"});

            if(result.ok)
            {
                var result_text = await result.text();
                if(result_text == "a" || result_text == "r" || result_text == "c")
                {
                    this_count.textContent = result.headers.get(`${reaction_text_of_this}-count`);
                        other_count.textContent = result.headers.get(`${reaction_text_of_other}-count`);
                }
                if(result_text == "a")
                {
                    this_element.style.backgroundColor = button_colors[is_like?1:0];
                }
                else if(result_text == "r")
                {
                    this_element.style.backgroundColor = button_colors[2];
                }
                else if(result_text == "c")
                {
                    this_element.style.backgroundColor = button_colors[is_like?1:0];
                    other_element.style.backgroundColor = button_colors[2];
                }
            }
            else
            {
                if(result.status === 401)
                {
                    error_message_editor.error_message = "Ви неавторизовані. Будь-ласка, авторизуйтесь, щоб мати можливість реагувати на цю статтю.";
                }
                else if(result.status === 404)
                {
                    error_message_editor.error_message = "Вибачте, але цієї статті не існує. Спробуйте оновити сторінку або перейти на головну.";
                }
                else
                {
                    error_message_editor.error_message = "Виникла неочікувана помилка.";
                }
            }
        }
        else
        {
            error_message_editor.error_message = "Проблема зі знаходженням потрібних елементів для виконання цієї дії.";
        }
        error_message_editor.send();

        this_element.disabled = false;
    }
}
document.addEventListener("DOMContentLoaded", function(){    
    let like_button_of_article = document.getElementById("like_article") as HTMLButtonElement;
    let dislike_button_of_article = document.getElementById("dislike_article") as HTMLButtonElement;

    if(like_button_of_article && dislike_button_of_article)
    {
        like_button_of_article.addEventListener("click", function(){article_reaction(like_button_of_article, dislike_button_of_article, true)});
        dislike_button_of_article.addEventListener("click", function(){article_reaction(dislike_button_of_article, like_button_of_article, false)});
    }
});