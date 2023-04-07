/*
    Шукає коментар по тому айді, який був переданий в цю функцію. Якщо знайде, то відразу його поверне, інакше поверне undefined.
*/
function get_comment_container_by_comment_id(comment_id)
{
    let comments_container = document.getElementsByClassName("comment-container");
    for(let comment_container of comments_container)
    {
        if(comment_container && comment_container.hasAttribute("comment_id") && comment_container.getAttribute("comment_id") == comment_id)
        {
            return comment_container;
        }
    }
    return undefined;
}

function get_article_id()
{
    if(document.getElementById("article_body") && document.getElementById("article_body").hasAttribute("article_id"))
    {
        let article_id = document.getElementById("article_body").getAttribute("article_id");
        if(article_id)
        {
            return article_id;
        }
        else
        {
            return undefined;
        }
    }
    else
    {
        return undefined;
    }
}