"use strict";
async function load_more_comments(event) {
    let this_element = event.currentTarget;
    if (this_element) {
        let last_comment_id = this_element.getAttribute("last_comment_id");
        if (last_comment_id && article_id) {
            const load_request = await fetch(`/comment/load_more/?comment_id=${last_comment_id}&article_id=${article_id}`);
            if (load_request.ok) {
                this_element.insertAdjacentHTML("beforebegin", await load_request.text());
                last_comment_id = load_request.headers.get("last-comment-id");
                if (last_comment_id) {
                    this_element.setAttribute("last_comment_id", last_comment_id);
                }
                else
                    this_element.remove();
            }
            else
                console.log("bad");
        }
        else {
            console.log("Або last_comment_id немає, або article_id немає.");
        }
    }
}
function add_event_listener_for_load_more_comments() {
    let load_more_comments_element = document.querySelector(".load-more-comments");
    if (load_more_comments_element) {
        load_more_comments_element.addEventListener("click", load_more_comments);
    }
}
document.addEventListener("DOMContentLoaded", function () {
    add_event_listener_for_load_more_comments();
});
