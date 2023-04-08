"use strict";
function change_comment_color(like_count, dislike_count, comment_id) {
    let comment_element = get_comment_container_by_comment_id(comment_id);
    if (comment_element) {
        var background_comment_color = ["#ff000040", "#00ff0040", "#0000ff40"];
        var comment_color = ["red", "green", "blue"];
        var subtraction_likes_and_dislikes = like_count - dislike_count;
        var result_color = 0;
        if (subtraction_likes_and_dislikes > 0) {
            result_color = 1;
        }
        else if (subtraction_likes_and_dislikes === 0) {
            result_color = 2;
        }
        comment_element.style.backgroundColor = `${background_comment_color[result_color]}`;
        comment_element.style.borderLeft = `1px solid ${comment_color[result_color]}`;
        comment_element.style.borderRight = `1px solid ${comment_color[result_color]}`;
        let comment_actions_button_container = comment_element.querySelector(".comment-actions-buttons-container");
        if (comment_actions_button_container) {
            comment_actions_button_container.style.borderLeft = `1px solid ${comment_color[result_color]}`;
        }
        else {
            console.log("В \"change_comment_color_script.js\" не знайдено \".comment-actions_container\"");
        }
    }
    else {
        console.log("В \"change_comment_color_script.js\" не знайдено \"comment_element\"");
    }
}
