"use strict";
/*
    Шукає коментар по тому айді, який був переданий в цю функцію. Якщо знайде, то відразу його поверне, інакше поверне null.
*/
function get_comment_container_by_comment_id(comment_id) {
    let comments_container = document.getElementsByClassName("comment-container");
    for (let comment_container of Array.from(comments_container)) {
        if (comment_container && comment_container.hasAttribute("comment_id") && comment_container.getAttribute("comment_id") === comment_id) {
            return comment_container;
        }
    }
    return null;
}
/*
    Знаходить id статті, яка була відкрита. Якщо є можливість знайти, повертає рядок із цим значенням, інакше - null.
 */
function get_article_id() {
    let article_body = document.getElementById("article_body");
    if (article_body) {
        let article_id = article_body.getAttribute("article_id");
        if (article_id)
            return article_id;
        else
            return null;
    }
    else
        return null;
}
