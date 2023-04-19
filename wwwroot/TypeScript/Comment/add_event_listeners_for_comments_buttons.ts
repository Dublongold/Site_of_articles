declare function replies_controller(this_element:HTMLButtonElement, comment_id:string):Promise<void>;
declare function delete_comment(event:PointerEvent, comment_id:string, reference_to_button_function:EventListenerOrEventListenerObject):void;

function add_event_listeners_for_comments_buttons(comment_container_elements?:HTMLCollectionOf<Element>|null)
{
    if(!comment_container_elements)
    {
        comment_container_elements = document.getElementsByClassName("comment-container new");
        for(let temp_elem of Array.from(comment_container_elements))
        {
            add_event_listeners_for_comment_buttons(temp_elem);
        }
    }
    else
    {
        for(let temp_elem of Array.from(comment_container_elements))
        {
            add_event_listeners_for_comment_buttons(temp_elem);
        }
    }
}

function add_event_listeners_for_comment_buttons(comment_container:Element)
{
    let comment_id = comment_container.getAttribute("comment_id") ?? "";
    let comment_like_button = comment_container.querySelector(".like-button-of-comment") as HTMLButtonElement;
    let comment_dislike_button = comment_container.querySelector(".dislike-button-of-comment") as HTMLButtonElement;
    let comment_replies_button = comment_container.querySelector(".replies-button-of-comment") as HTMLButtonElement;
    let comment_reply_button = comment_container.querySelector(".write-reply-button-of-comment") as HTMLButtonElement;
    let comment_edit_button = comment_container.querySelector(".edit-button-of-comment") as HTMLButtonElement;
    let comment_delete_button = comment_container.querySelector(".delete-button-of-comment") as HTMLButtonElement;
    
    if(comment_like_button && comment_dislike_button)
    {
        comment_like_button.addEventListener("click",  function(this:HTMLButtonElement){comment_reaction(comment_like_button, comment_dislike_button, comment_id, true)});
        comment_dislike_button.addEventListener("click",  function(this:HTMLButtonElement){comment_reaction(comment_dislike_button, comment_like_button, comment_id, false)});
    }
    if(comment_replies_button)
    {
        comment_replies_button.addEventListener("click",  function(this:HTMLButtonElement){replies_controller(this, comment_id)});
    }
    if(comment_reply_button)
    {
        comment_reply_button.addEventListener("click", function(this:HTMLButtonElement){create_reply_field_to_comment(this, comment_id)});
    }
    if(comment_delete_button)
    {
        let delete_comment_temp_function = function(event:PointerEvent){delete_comment(event, comment_id, delete_comment_temp_function)} as EventListenerOrEventListenerObject;
        comment_delete_button.addEventListener("click",  delete_comment_temp_function);
    }
    if(comment_edit_button)
    {
        let edit_comment_temp_function = function(event:PointerEvent){edit_comment(event, comment_id, edit_comment_temp_function)} as EventListenerOrEventListenerObject;
        comment_edit_button.addEventListener("click", edit_comment_temp_function);
    }
    comment_container.className = "comment-container";
}
document.addEventListener("DOMContentLoaded", function(){add_event_listeners_for_comments_buttons(null)});
