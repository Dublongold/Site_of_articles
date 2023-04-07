"use strict";
async function load_more_comments(event) {
    let this_element = event.currentTarget;
    if (this_element) {
        let last_comment_id = this_element.getAttribute("last_comment_id");
        if (last_comment_id !== null) {
            console.log("Спроба довантажити сторінки.");
        }
    }
}
document.addEventListener("DOMContentLoaded", function () {
    let load_more_comments_element = document.getElementById("load_more_comments");
    if (load_more_comments_element) {
        load_more_comments_element.addEventListener("click", load_more_comments);
    }
});
