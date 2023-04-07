async function create_reply_field_to_comment(this_element, comment_id)
{
    this_element.disabled = true;
    
    let comment_container = get_comment_container_by_comment_id(comment_id);
    let source = "Відповідь";
    let error_message = "";
    let where_append = comment_container.getElementsByClassName("comment-reaction-container")[0];
    let error_message_id = "write_reply_to_" + comment_id;

    let article_id = get_article_id();

    var check_authorized = await fetch("/account/login/authorized", {method:"get"});
    if(check_authorized.ok)
    {
        let write_reply_fields_count = document.getElementsByClassName(`write-reply-field`).length;
        if(write_reply_fields_count > 1)
        {
            for(let temp_del_elem of document.getElementsByClassName(`write-reply-field`))
            {
                if(comment_container.nextElementSibling === temp_del_elem)
                    continue;
                    temp_del_elem.remove();
            }
        }
        else if (write_reply_fields_count === 1)
        {
            if(comment_container.nextElementSibling !== document.getElementsByClassName(`write-reply-field`)[0])
                document.getElementsByClassName(`write-reply-field`)[0].remove();
            else
            {
                this_element.disabled = false;
                return;
            }
        }
        if(comment_container)
        {
            create_elements_for_write_reply(comment_container, comment_id, article_id);
        }
    }
    else
    {
        if(check_authorized.status === 401)
        {
            error_message = "Ви неавторизовані. Будь-ласка, авторизуйтеся, щоб мати можливість писати відповіді до коментарів.";
        }
        else
        {
            error_message = "Виникла неочікувана помилка.";
        }
        
    }
    error_message_editor(source, error_message, where_append, error_message_id);
    this_element.disabled = false;
}

function create_elements_for_write_reply(comment_container, comment_id)
{
    let write_reply_field = document.createElement("div");
    write_reply_field.className = `write-reply-field`;
    write_reply_field.style.marginLeft = comment_container.style.marginLeft;

    let write_reply_name_text = document.createElement("span");
    write_reply_name_text.className = `write-reply-name-text`;
    write_reply_name_text.textContent = "Напишить вашу відповіть тут:";

    let write_reply_content = document.createElement("textarea");

    write_reply_content.className = `write-reply-content`;
    write_reply_content.contentEditable = true;
    write_reply_content.maxLength = 2000;

    var submit_write_reply = document.createElement("button");
    submit_write_reply.className = "submit-write-reply";
    submit_write_reply.textContent = "Відправити";
    submit_write_reply.addEventListener("click", function(){submit_write_reply_comment(this, comment_id)});

    var cancel_write_reply = document.createElement("button");
    cancel_write_reply.className = `cancel-write-reply`;
    cancel_write_reply.textContent = "Cancel";
    cancel_write_reply.addEventListener("click", function(){this.parentElement.remove()});

    write_reply_field.appendChild(write_reply_name_text);
    write_reply_field.appendChild(write_reply_content);
    write_reply_field.appendChild(submit_write_reply);
    write_reply_field.appendChild(cancel_write_reply);
    comment_container.after(write_reply_field);
    write_reply_content.focus();
}

async function submit_write_reply_comment(this_element, comment_id)
{
    this_element.disabled = true;
    let article_id = get_article_id();
    let write_reply_content_elements = document.getElementsByClassName("write-reply-content");
    let write_reply_name_text_elements = document.getElementsByClassName("write-reply-name-text");
    let submit_write_reply_elements = document.getElementsByClassName("submit-write-reply");
    let cancel_write_reply_elements = document.getElementsByClassName("cancel-write-reply");

    let wrce_n = write_reply_content_elements.length;
    let wrnte_n = write_reply_name_text_elements.length;
    let swre_n = submit_write_reply_elements.length;
    let cwre_n = cancel_write_reply_elements.length;
    
    let comment_container = get_comment_container_by_comment_id(comment_id);

    let source = "Відповідь";
    let error_message = "";
    let where_append = this_element.parentElement;
    let error_message_id = "write_reply_to_" + comment_id;

    if(wrce_n === 1 && wrnte_n === 1 && swre_n === 1 && cwre_n === 1)
    {
        let reply_content_textarea_element = document.getElementsByClassName(`write-reply-content`)[0];

        if(reply_content_textarea_element && reply_content_textarea_element.value && reply_content_textarea_element.value.trim().length > 0)
        {
            let reply_level = comment_container.hasAttribute("reply_level")?parseInt(comment_container.getAttribute("reply_level")) + 1 : 1;
            let formated_text = encodeURIComponent(reply_content_textarea_element.value.trim().replace(/</g, "$lt").replace(/>/g, "$gt").replace(/\n/g, "<br>").replace(/\s/g, "&nbsp"));
            const result = await fetch(`/comment/create/${article_id}/?comment_content=${formated_text}&reply_level=${reply_level}&comment_id=${comment_id}`, {method:"post"});
            
            if(result.ok)
            {
                // Видалення всіх полів для написання коментарів
                for(let write_reply_field of document.getElementsByClassName("write-reply-field"))
                {
                    write_reply_field.remove();
                }
                // Пошук кнопки, яка контролює відповіді(показує або ховає).
                let replies_button_of_comment = comment_container.getElementsByClassName("replies-button-of-comment")[0];
                if(!replies_button_of_comment)
                {
                    replies_button_of_comment = create_replies_button_of_comment(0, comment_id);
                    if(comment_container.getElementsByClassName("dislike-button-of-comment").length === 1)
                    {
                        comment_container.getElementsByClassName("dislike-button-of-comment")[0].after(replies_button_of_comment);
                    }
                }
                // Пошук або створення поля з коментарями-відповідями
                let reply_comments = document.getElementsByClassName(`reply-comments`);
                let reply_comments_element;
                if(reply_comments.length > 0)
                {
                    for(let temp_reply_comments_element of reply_comments)
                    {
                        if(temp_reply_comments_element.hasAttribute("reply_to_comment") && temp_reply_comments_element.getAttribute("reply_to_comment") === comment_id)
                        {
                            reply_comments_element = temp_reply_comments_element;
                        }
                    }
                }
                if(!reply_comments_element)
                {
                    if(replies_button_of_comment.getAttribute("replies_are_hidened") === "true")
                    {
                        await replies_controller(replies_button_of_comment, comment_id);
                        for(let temp_reply_comments_element of reply_comments)
                        {
                            if(temp_reply_comments_element.hasAttribute("reply_to_comment") && temp_reply_comments_element.getAttribute("reply_to_comment") === comment_id)
                            {
                                reply_comments_element = temp_reply_comments_element;
                            }
                        }
                    }
                    if(!reply_comments_element)
                    {
                        reply_comments_element = document.createElement("div");
                        reply_comments_element.className = "reply-comments";
                        reply_comments_element.setAttribute("reply_to_comment", comment_id);
                        comment_container.after(reply_comments_element);
                    }
                }
                // Допиши пізніше.
                if(get_comment_container_by_comment_id(result.headers.get("reply-comment-id")) === undefined)
                {
                    reply_comments_element.insertAdjacentHTML("afterbegin", await result.text());
                    if(reply_comments_element.firstElementChild.hasAttribute("comment_id"))
                    {
                        add_event_listeners_for_comment_buttons(reply_comments_element.firstElementChild);
                    }
                }
                // Пошук кількості відповідей
                let replies_count  = parseInt(result.headers.get("replies-count"));
                if(!replies_count && replies_count === NaN)
                {
                    replies_count = 0;
                }
                // Встановлення кількості відповідей після додавання
                change_replies_count_by_replies_button_of_comment_text(replies_button_of_comment.getElementsByClassName("count-replies-of-comment")[0], replies_count);
            }
            else
            {
                if(result.status === 401)
                {
                    error_message = "Ви неавторизовані. Будь-ласка, авторизуйтеся, щоб мати можливість писати відповіді до коментарів.";
                }
                else if(result.status === 404)
                {
                    error_message = "Коментаря, на який ви хотіли відповісти, більше не існує. Оновіть сторінку, щоб він зник на вашій сторінці.";
                }
                else
                {
                    error_message = "Виникла неочікувана помилка.";
                }
            }
        }
        else
        {
            error_message = "Неможливо створити відповідь, яка пуста або містить лише пробільні символи.";
        }
    }
    else
    {
        error_message = "Знайдено елементів полів для відповідей більше, чем один. Будь-ласка, якщо маєте таку можливість, видаліть зайві поля або скопіюйте текст та оновіть сторінку.";
    }
    error_message_editor(source, error_message, where_append, error_message_id);
    this_element.disabled = false;
}