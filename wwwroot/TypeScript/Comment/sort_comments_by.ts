async function sort_comments_by(event: Event)
{
    let error_message_editor = new Error_message_editor("Впорядковування коментарів", null, "sort_comments_by");
    if(event)
    {
        let this_element = event.currentTarget as HTMLSelectElement;
        if(this_element)
        {
            let sort_by = this_element.value;
            if(sort_by)
            {
                if(sort_by != window.sessionStorage.getItem("sort-comments-by"))
                {
                    window.sessionStorage.setItem("sort-comments-by", sort_by);
                    let submit_write_comment = document.getElementById("submit_write_comment") as HTMLButtonElement;
                    let title_text_of_comments = document.getElementById("title_text_of_comments") as HTMLDivElement;
                    let comments_of_article = title_text_of_comments.parentElement ? title_text_of_comments.parentElement.querySelector(".comments-of-article") : document.querySelector(".comments-of-article");
                    if(title_text_of_comments && comments_of_article)
                    {
                        /* Потрібно для заборони дій з статтями до тих пір, поки не завантажаться вони після сотрування.*/
                        let block_actions_with_comments_element = document.createElement("div");
                        block_actions_with_comments_element.className = "block-click-when-load-comments";

                        if(submit_write_comment)
                            submit_write_comment.disabled = true;

                        title_text_of_comments.before(block_actions_with_comments_element);
                        
                        const sort_by_request = await fetch(`/comment/sort_by/${article_id}`, {headers:{"is-sort-comments-action": "true", "sort-by": sort_by}});
                        if(sort_by_request.ok)
                        {
                            if(title_text_of_comments.nextElementSibling)
                                title_text_of_comments.nextElementSibling.insertAdjacentHTML("afterend", await sort_by_request.text());
                            else
                                title_text_of_comments.insertAdjacentHTML("afterend", await sort_by_request.text());
                            comments_of_article.remove();
                            add_event_listeners_for_comments_buttons();
                            add_event_listener_for_load_more_comments();
                        }
                        else
                            console.log(sort_by_request.status)
                        if(submit_write_comment)
                            submit_write_comment.disabled = false;
                        block_actions_with_comments_element.remove();
                    }
                    else
                    console.log(5);
                }
                else
                console.log(4);
            }
            else
            console.log(3);
        }
        else
        console.log(2);
    }
    else
        console.log(1);
    error_message_editor.send();
}

document.addEventListener("DOMContentLoaded", function(){
    window.sessionStorage.setItem("sort-comments-by", "date");
    let sort_comments_by_element = document.getElementById("sort_comments_by");
    if(sort_comments_by_element)
    {
        sort_comments_by_element.addEventListener("change", sort_comments_by);
    }
});