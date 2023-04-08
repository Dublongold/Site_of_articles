async function load_more_comments(event: PointerEvent)
{
    let this_element = event.currentTarget as HTMLButtonElement;
    if(this_element)
    {
        let last_comment_id = this_element.getAttribute("last_comment_id");
        /* Ця частина коду чомусь була потрібна для цього... Чому? Не знаю, але бажання це писати ще раз у тебе немає.
        let open_at_elements = document.querySelectorAll("meta");
        let open_at: string | null = null;
        for(let meta_elem of Array.from(open_at_elements))
        {
            if(meta_elem)
            {
                let meta_elem_open_at = meta_elem.getAttribute("open-at");
                if(meta_elem_open_at)
                {
                    open_at = meta_elem_open_at;
                }
            }
        }
        if(open_at === null)
        {
            open_at = "01.01.0001 00:00:01";
        }*/
        if(last_comment_id && article_id)
        {
            const load_request = await fetch(`/comment/load_more/?comment_id=${last_comment_id}&article_id=${article_id}`);
            if(load_request.ok)
            {
                this_element.insertAdjacentHTML("beforebegin", await load_request.text());
                last_comment_id = load_request.headers.get("last-comment-id");
                if(last_comment_id)
                {
                    console.log("Try change last_comment_id: " + last_comment_id)
                    this_element.setAttribute("last_comment_id", last_comment_id);
                }
                else
                    this_element.remove();
            }
            else
                console.log("bad");
        }
    }
}

document.addEventListener("DOMContentLoaded", function(){
    let load_more_comments_element = document.querySelector(".load-more-comments");
    if(load_more_comments_element)
    {
        load_more_comments_element.addEventListener("click", load_more_comments as unknown as EventListenerOrEventListenerObject);
    }
})