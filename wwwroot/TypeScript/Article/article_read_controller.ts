async function article_has_been_read(event: PointerEvent)
{
    let article_body_elem = document.getElementById("article_body");
    if(article_body_elem)
    {
        let user_who_have_read_count = document.getElementById("user_who_have_read_count");
        let login_path_articles_with_have_been_read = document.getElementById("articles_which_user_have_read");
        if(article_id && user_who_have_read_count && user_who_have_read_count.getAttribute("have_read") === "false" && login_path_articles_with_have_been_read)
        {
            let login_read_count = login_path_articles_with_have_been_read.textContent ?? "0";
            let result = await fetch(`/article/has_been_read/${article_id}`, {method:"post"})
            if(result.ok)
            {
                login_path_articles_with_have_been_read.textContent = (parseInt(login_read_count) + 1).toString();
                user_who_have_read_count.textContent = ("Прочитало: " + await result.text() + " (ви вже прочитали також)");
            }
            else
            {
                console.log("Try add user to users who have read, but failed. Status code: " + result.status);
            }
        }
    }
    else
    {
        console.warn("Try get article body element, but failed.");
    }
}

function article_has_been_read_timeout(event: PointerEvent)
{
    setTimeout(article_has_been_read, 10000, event);
}
let article_id = get_article_id();
document.addEventListener("DOMContentLoaded", article_has_been_read_timeout as EventListenerOrEventListenerObject);