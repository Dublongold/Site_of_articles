async function sort_article_by(event: Event)
{
    let error_message_editor = new Error_message_editor("Впорядковування статтей", null, "sort_articles_by");
    if(event)
    {
        let this_element = event.currentTarget as HTMLSelectElement;
        if(this_element)
        {
            let sort_by = this_element.value;
            if(sort_by)
            {
                if(sort_by != window.sessionStorage.getItem("sort-articles-by"))
                {
                    window.sessionStorage.setItem("sort-articles-by", sort_by);
                    let page_body = document.getElementById("page_body") as HTMLDivElement;
                    let body_head_text = document.getElementById("body_head_text") as HTMLDivElement;
                    let preview_articles_container = body_head_text.parentElement?body_head_text.parentElement.querySelector(".preview-articles-container"):document.querySelector(".preview-articles-container");
                    if(page_body && body_head_text && preview_articles_container)
                    {
                        /* Потрібно для заборони дій з статтями до тих пір, поки не завантажаться вони після сотрування.*/
                        let block_actions_with_articles_element = document.createElement("div");

                        block_actions_with_articles_element.className = "block-click-when-load-articles";
                        page_body.appendChild(block_actions_with_articles_element);
                        
                        const urlParams = new URLSearchParams(window.location.search);
                        const name_or_text_of_article = urlParams.get("name_or_text_of_article");
                        let where_sort = encodeURIComponent(window.location.pathname.substring(1));
                        const sort_by_request = await fetch(`/article/sort_by/${where_sort}${name_or_text_of_article ? "/" + name_or_text_of_article : ""}`, {headers:{"is-sort-articles-action": "true", "sort-by": sort_by}});
                        if(sort_by_request.ok)
                        {
                            preview_articles_container.remove();
                            body_head_text.insertAdjacentHTML("afterend", await sort_by_request.text());
                            
                            add_interactive_with_new_articles();
                            add_event_listener_for_load_more_acticles();
                            get_last_ten_or_less_articles_id();
                        }
                        else
                            console.log(sort_by_request.status)
                        
                        block_actions_with_articles_element.remove();
                        /**/
                    }
                }
            }
        }
    }
    error_message_editor.send();
}

document.addEventListener("DOMContentLoaded", function(){
    window.sessionStorage.setItem("sort-articles-by", "date");
    let sort_articles_by_element = document.getElementById("sort_articles_by");
    if(sort_articles_by_element)
    {
        sort_articles_by_element.addEventListener("change", sort_article_by);
    }
});