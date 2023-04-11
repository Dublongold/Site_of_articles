async function sort_article_by(event: Event)
{
    const source = "Впорядковування статтей";
    let error_message = "";
    let where_append: HTMLElement | null = null;
    const error_message_id = "sort_article_by";
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
                        let create_test_element = document.createElement("div");

                        create_test_element.className = "block-click-when-load-articles";
                        page_body.appendChild(create_test_element);
                        
                        let name_or_text_of_article: string | null = null;
                        
                        if(window.location.search.indexOf("name_or_text_of_article") != -1)
                        {
                            let name_or_text_of_article_first_part = window.location.search.substring(window.location.search.indexOf("name_or_text_of_article"));
                            name_or_text_of_article = name_or_text_of_article_first_part.substring(name_or_text_of_article_first_part.indexOf("=")+1, name_or_text_of_article_first_part.indexOf("&") != -1? name_or_text_of_article_first_part.indexOf("&"):name_or_text_of_article_first_part.length-1);
                        }
                        let where_sort = encodeURIComponent(window.location.pathname.substring(1));
                        const sort_by_request = await fetch(`/article/sort_by/${where_sort}${name_or_text_of_article?"/" + name_or_text_of_article : ""}`, {headers:{"is-sort-articles-action": "true", "sort-by": sort_by}});
                        if(sort_by_request.ok)
                        {
                            preview_articles_container.remove();
                            body_head_text.insertAdjacentHTML("afterend", await sort_by_request.text());
                            create_test_element.remove();
                            add_event_listeners_for_actions_with_article_buttons();
                            add_event_listener_for_load_more_acticles();
                        }
                        else
                            console.log(sort_by_request.status)
                        /**/
                    }
                }
            }
        }
    }
}

document.addEventListener("DOMContentLoaded", function(){
    window.sessionStorage.setItem("sort-articles-by", "date");
    let sort_articles_by_element = document.getElementById("sort_articles_by");
    if(sort_articles_by_element)
    {
        sort_articles_by_element.addEventListener("change", sort_article_by);
    }
});