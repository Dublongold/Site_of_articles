function sort_article_by(event: Event)
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
                    console.log(window.sessionStorage.getItem("sort-articles-by"));
                    let page_body = document.getElementById("page_body") as HTMLDivElement;
                    if(page_body)
                    {
                        console.log("Ok");
                        /* Потрібно для заборони дій з статтями до тих пір, поки не завантажаться вони після сотрування.
                        let create_test_element = document.createElement("div");

                        create_test_element.className = "block-click-when-load-articles";
                        page_body.appendChild(create_test_element);
                        */
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