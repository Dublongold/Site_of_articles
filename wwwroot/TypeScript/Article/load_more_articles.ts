async function load_more_articles(event: Event)
{
    let error_message_editor = new Error_message_editor("Довантаження статей", null, "load_more_articles");
    if(event)
    {
        let this_element = event.currentTarget as HTMLButtonElement;
        if(this_element)
        {
            error_message_editor.where_append = this_element.parentElement;
            this_element.disabled = true;
            let sort_articles_by_element = document.getElementById("sort_articles_by") as HTMLSelectElement;
            if(last_ten_or_less_articles_id && last_ten_or_less_articles_id.length && last_ten_or_less_articles_id.length > 0 && last_ten_or_less_articles_id.length <= 10)
            {
                let where_load = window.location.pathname.substring(1);
                if(where_load === "")
                {
                    where_load = "home";
                }
                const urlParams = new URLSearchParams(window.location.search);
                const load_request = await fetch(`/article/load_more/${where_load}/?article_ids_str=${last_ten_or_less_articles_id.join(",")}&name_or_text_of_article=${urlParams.get('name_or_text_of_article')}`, {headers:{"sort-by":sort_articles_by_element.value}});
                if(load_request.ok)
                {
                    this_element.insertAdjacentHTML("beforebegin", await load_request.text());
                    add_interactive_with_new_articles();
                    get_last_ten_or_less_articles_id();

                    if(!load_request.headers.get("need-load-more"))
                        this_element.remove();
                }
                else
                error_message_editor.error_message = "Поганий запит с кодом "+ load_request.status;
            }
            else
                error_message_editor.error_message = "Проблема з last_ten_or_less_articles_id.";
            this_element.disabled = false;
        }
        else
            error_message_editor.error_message = "Цей елемент не знайдено.";
    }
    else
        error_message_editor.error_message = "Подію не знайдено.";
    error_message_editor.send();
}
function add_event_listener_for_load_more_acticles()
{
    let load_more_articles_button = document.getElementById("load_more_articles");
    if(load_more_articles_button)
    {
        load_more_articles_button.addEventListener("click", load_more_articles)
    }
}
function get_last_ten_or_less_articles_id()
{
    let last_ten_or_less_article_ids = Array.from(document.getElementsByClassName("article-id")) as HTMLDivElement[];
    last_ten_or_less_article_ids.splice(0, last_ten_or_less_article_ids.length - 10);
    for(let i in last_ten_or_less_article_ids)
    {
        last_ten_or_less_articles_id[i] = parseInt(last_ten_or_less_article_ids[i].textContent ?? "");
    }
}

let last_ten_or_less_articles_id:number[] = new Array(10);
document.addEventListener("DOMContentLoaded", function(){
    add_event_listener_for_load_more_acticles();
    get_last_ten_or_less_articles_id();
});