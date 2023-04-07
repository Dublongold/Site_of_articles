"use strict";
function add_event_listeners_for_comments_buttons(comment_container_elements) {
    if (!comment_container_elements) {
        comment_container_elements = document.getElementsByClassName("comment-container");
        for (let temp_elem of Array.from(comment_container_elements)) {
            add_event_listeners_for_comment_buttons(temp_elem);
        }
    }
    else {
        for (let temp_elem of Array.from(comment_container_elements)) {
            add_event_listeners_for_comment_buttons(temp_elem);
        }
    }
}
function add_event_listeners_for_comment_buttons(comment_container) {
    let comment_id = comment_container.getAttribute("comment_id") ?? "";
    let comment_like_button = comment_container.querySelector(".like-button-of-comment");
    let comment_dislike_button = comment_container.querySelector(".dislike-button-of-comment");
    let comment_replies_button = comment_container.querySelector(".replies-button-of-comment");
    let comment_reply_button = comment_container.querySelector(".write-reply-button-of-comment");
    let comment_edit_button = comment_container.querySelector(".edit-button-of-comment");
    let comment_delete_button = comment_container.querySelector(".delete-button-of-comment");
    if (comment_like_button && comment_dislike_button) {
        comment_like_button.addEventListener("click", function () { comment_reaction(comment_like_button, comment_dislike_button, comment_id, true); });
        comment_dislike_button.addEventListener("click", function () { comment_reaction(comment_dislike_button, comment_like_button, comment_id, false); });
    }
    if (comment_replies_button) {
        comment_replies_button.addEventListener("click", function () { replies_controller(this, comment_id); });
    }
    if (comment_reply_button) {
        comment_reply_button.addEventListener("click", function () { create_reply_field_to_comment(this, comment_id); });
    }
    if (comment_delete_button) {
        let delete_comment_temp_function = function (event) { delete_comment(event, comment_id, delete_comment_temp_function); };
        comment_delete_button.addEventListener("click", delete_comment_temp_function);
    }
    if (comment_edit_button) {
        let edit_comment_temp_function = function (event) { edit_comment(event, comment_id, edit_comment_temp_function); };
        comment_edit_button.addEventListener("click", edit_comment_temp_function);
    }
}
document.addEventListener("DOMContentLoaded", function () { add_event_listeners_for_comments_buttons(null); });
