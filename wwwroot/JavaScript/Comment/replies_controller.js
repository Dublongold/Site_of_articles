async function replies_controller(this_element, comment_id)
{
    if(this_element.hasAttribute("replies_are_hidened"))
    {
        let article_id = get_article_id();
        this_element.disabled = true;
        
        this_element.disabled = false;
        let replies_count
        let replies_button_of_comment_status_text = this_element.getElementsByClassName("replies-button-of-comment-status-text")[0];
        let count_replies_of_comment = this_element.getElementsByClassName("count-replies-of-comment")[0];
        let comment_container = get_comment_container_by_comment_id(comment_id);
        if(replies_button_of_comment_status_text && count_replies_of_comment)
        {
            if(this_element.getAttribute("replies_are_hidened").toLowerCase() === "true")
            {
                let result = await fetch(`/comment/build_comments/${comment_id}/${article_id}`,{method:"post"});
                if(result.ok)
                {
                    replies_count = result.headers.get("replies-count");
                    replies_button_of_comment_status_text.textContent = "Сховати";
                    this_element.setAttribute("replies_are_hidened", "false");
                    if(document.getElementsByClassName("write-reply-field").length === 1)
                    {
                        document.getElementsByClassName("write-reply-field")[0].insertAdjacentHTML("afterend",await result.text());
                    }
                    else
                    {
                        comment_container.insertAdjacentHTML("afterend",await result.text());
                    }
                    for(let temp_reply_comments of document.getElementsByClassName("reply-comments"))
                    {
                        if(temp_reply_comments.hasAttribute("reply_to_comment") && temp_reply_comments.getAttribute("reply_to_comment") == comment_id)
                        {
                            add_event_listeners_for_comments_buttons(temp_reply_comments.getElementsByClassName("comment-container"));
                            break;
                        }
                    }
                }
                else
                {
                    alert(`Плохой ответ (${result.status})`);
                }
            }
            else
            {
                replies_button_of_comment_status_text.textContent = "Показати";
                this_element.setAttribute("replies_are_hidened", "true");
                let reply_comments_collection = document.getElementsByClassName("reply-comments");
                for(let reply_comments of reply_comments_collection)
                {
                    if(reply_comments.hasAttribute("reply_to_comment") && reply_comments.getAttribute("reply_to_comment") === comment_id)
                    {
                        reply_comments.remove();
                    }
                }
            }
            if(replies_count)
            {
                change_replies_count_by_replies_button_of_comment_text(count_replies_of_comment, replies_count);
            }
        }
    }
}

function change_replies_count_by_comment_id(comment_id, replies_count)
{
    change_replies_count_by_comment_container(get_comment_container_by_comment_id(comment_id), replies_count);
}

function change_replies_count_by_comment_container(comment_container, replies_count)
{
    let count_replies_of_comment = comment_container.getElementsByClassName("count-replies-of-comment")[0];
    change_replies_count_by_replies_button_of_comment_text(count_replies_of_comment, replies_count);
}

function change_replies_count_by_replies_button_of_comment_text(count_replies_of_comment, replies_count)
{
    if(count_replies_of_comment)
    {
        if(replies_count > 0)
        {
            count_replies_of_comment.textContent = replies_count == 1?`відповідь`:`відповіді (${replies_count})`;
        }
        else
        {
            count_replies_of_comment.parentElement.remove();
        }
    }
}

function create_replies_button_of_comment(replies_count, comment_id)
{
    let replies_button_of_comment = document.createElement("button");
    replies_button_of_comment.type = "button";
    replies_button_of_comment.className = "replies-button-of-comment";
    replies_button_of_comment.setAttribute("replies_are_hidened", "false");
    replies_button_of_comment.onclick = function() {replies_controller(this, comment_id)}

    let replies_button_of_comment_status_text = document.createElement("span");
    replies_button_of_comment_status_text.className = "replies-button-of-comment-status-text";
    replies_button_of_comment_status_text.textContent = "Сховати";

    let space_span = document.createElement("span");
    space_span.textContent = " ";

    let count_replies_of_comment = document.createElement("span");
    count_replies_of_comment.className = "count-replies-of-comment";
    if(replies_count && replies_count > 1)
    {
        count_replies_of_comment.textContent = `відповіді(${replies_count})`;
    }
    else
    {
        count_replies_of_comment.textContent = "відповідь";
    }
    replies_button_of_comment.appendChild(replies_button_of_comment_status_text);
    replies_button_of_comment.appendChild(space_span);
    replies_button_of_comment.appendChild(count_replies_of_comment);
    return replies_button_of_comment;
}