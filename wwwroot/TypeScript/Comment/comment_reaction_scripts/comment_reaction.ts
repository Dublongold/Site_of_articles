async function comment_reaction(this_element: HTMLButtonElement, other_element:HTMLButtonElement, comment_id:string, is_like: boolean)
{
    if(this_element)
    {
        this_element.disabled = true;

        let reaction_text_of_this = is_like?"like":"dislike";
        let reaction_text_of_other = !is_like?"like":"dislike";

        const source = `Кнопка "${is_like?"П":"Не п"}одобається"`;
        let error_message = "";
        let this_parent = this_element.parentElement;
        let where_append = this_parent && this_parent.parentElement ? this_parent.parentElement : null;
        const error_message_id = "article_reaction";
        
        let comment_element = get_comment_container_by_comment_id(comment_id);
        if(comment_element)
        {
            let this_count = comment_element.querySelector(`.number-of-comment-${reaction_text_of_this}s`) as HTMLSpanElement;
            let other_count = comment_element.querySelector(`.number-of-comment-${reaction_text_of_other}s`) as HTMLSpanElement;

            if(this_element && other_element && this_count && other_count)
            {
                const result = await fetch(`/comment/reaction/${comment_id}/${article_id}/?reaction_type=${reaction_text_of_this}`,{method:"post"});

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
                    change_comment_color(parseInt((is_like?this_count.textContent:other_count.textContent) ?? "NaN"), parseInt((is_like?other_count.textContent:this_count.textContent) ?? "NaN"), comment_id);
                }
                else
                {
                    if(result.status === 401)
                    {
                        error_message = "Ви неавторизовані. Будь-ласка, авторизуйтесь, щоб мати можливість реагувати на цей коментар.";
                    }
                    else if(result.status === 404)
                    {
                        error_message = "Вибачте, але цього коментаря не існує. Спробуйте оновити сторінку.";
                    }
                    else
                    {
                        error_message = `Виникла неочікувана помилка з кодом ${result.status}.`;
                    }
                }
            }
            else
            {
                error_message = "Проблема зі знаходженням потрібних елементів для виконання цієї дії.";
            }
        }
        error_message_editor(source, error_message, where_append, error_message_id);

        this_element.disabled = false;
    }
}