async function article_has_been_read(event)
{
    let article_body_elem = document.getElementById("article_body");
    if(article_body_elem)
    {
        let article_id = article_body_elem.getAttribute("article_id");
        let user_who_have_read_count = document.getElementById("user_who_have_read_count");
        let login_path_articles_with_have_been_read = document.getElementById("articles_which_user_have_read");
        if(article_id !== NaN && user_who_have_read_count && user_who_have_read_count.hasAttribute("have_read") && user_who_have_read_count.getAttribute("have_read") === "false" && login_path_articles_with_have_been_read)
        {
            let result = await fetch(`/article/has_been_read/${article_id}`, {method:"post"})
            if(result.ok)
            {
                user_who_have_read_count = document.getElementById("user_who_have_read_count");
                login_path_articles_with_have_been_read.innerText = parseInt(login_path_articles_with_have_been_read.innerText) + 1;
                user_who_have_read_count.innerHTML = ("Прочитало: " + await result.text() + " (ви вже прочитали також)");
            }
            else
            {
                console.log("Try add user to users who have read, but failed. Code: " + result.status);
            }
        }
    }
    else
    {
        console.warn("Try get article body element, but failed.");
    }
}

function article_has_been_read_timeout(event)
{
    setTimeout(article_has_been_read, 10000, event);
}

document.addEventListener("DOMContentLoaded", article_has_been_read_timeout);