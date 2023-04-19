async function load_more_comments(event: Event)
{
    let error_message_editor = new Error_message_editor("Довантаження статей", null, "load_more_comments");
    if(event)
    {
        let this_element = event.currentTarget as HTMLButtonElement;
        if(this_element)
        {
            let last_ten_or_less_comments_id : number[] = new Array(10);
            get_last_ten_or_less_comments_id(last_ten_or_less_comments_id, this_element);
            error_message_editor.where_append = this_element.parentElement;
            this_element.disabled;
            if(last_ten_or_less_comments_id && last_ten_or_less_comments_id.length && last_ten_or_less_comments_id.length <= 10 && article_id)
            {
                const load_request = await fetch(`/comment/load_more/?comment_ids_str=${last_ten_or_less_comments_id.join(",")}&article_id=${article_id}`);
                if(load_request.ok)
                {
                    this_element.insertAdjacentHTML("beforebegin", await load_request.text());
                    add_event_listeners_for_comments_buttons();
                    if(!load_request.headers.get("need-load-more"))
                        this_element.remove();
                }
                else
                    error_message_editor.error_message = "Поганий запит с кодом "+ load_request.status;
            }
            else
            {
                if(!last_ten_or_less_comments_id)
                    error_message_editor.error_message = "last_ten_or_less_comments_id не існує.";
                else if(!last_ten_or_less_comments_id.length)
                    error_message_editor.error_message = "У last_ten_or_less_comments_id немає довжини.";
                else if (last_ten_or_less_comments_id.length > 10)
                    error_message_editor.error_message = "Занадто багато елементів.";
                else if (!article_id)
                    error_message_editor.error_message = "Не знайдено article id.";

            }
            this_element.disabled = false;
        }
        else
            error_message_editor.error_message = "Цей елемент не знайдено.";
    }
    else
        error_message_editor.error_message = "Подію не знайдено.";
    error_message_editor.send();
}

function add_event_listener_for_load_more_comments(load_more_comments_element?:HTMLButtonElement | null | undefined)
{
    if(!load_more_comments_element)
    {
        load_more_comments_element = document.querySelector(".load-more-comments") as HTMLButtonElement | null;
    }
    if(load_more_comments_element)
    {
        load_more_comments_element.addEventListener("click", load_more_comments);
    }
}


function get_last_ten_or_less_comments_id(last_ten_or_less_comments_id:number[], button_element?: HTMLButtonElement)
{
    let take_from = button_element && button_element.parentElement ? button_element.parentElement : document;
    let last_ten_or_less_comments_ids = Array.from(take_from.getElementsByClassName("comment-container")) as HTMLDivElement[];
    for(let i = 0, j = last_ten_or_less_comments_ids.length-1; i < 10 && j > -1; j--)
    {
        if(!last_ten_or_less_comments_ids[j])
            continue;
        if(button_element && button_element.parentElement)
        {
            if(last_ten_or_less_comments_ids[j].parentElement != button_element.parentElement)
                continue;
        }
        else
        {
            let parent_element = last_ten_or_less_comments_ids[j].parentElement;
            if(!parent_element || parent_element.className != "comments-of-article")
            continue;
        }
        last_ten_or_less_comments_id[i] = parseInt(last_ten_or_less_comments_ids[j].getAttribute("comment_id") ?? "");
        i++;
    }
}



document.addEventListener("DOMContentLoaded", function(){
    add_event_listener_for_load_more_comments();
})