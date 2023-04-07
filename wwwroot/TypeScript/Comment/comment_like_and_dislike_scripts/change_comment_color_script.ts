function change_comment_color(like_count: number, dislike_count: number, comment_id: string)
{
    let comment_element = get_comment_container_by_comment_id(comment_id);
    var background_comment_color = [ "#ff000040", "#00ff0040", "#0000ff40" ];
    var comment_color = ["red", "green", "blue" ];
    var subtraction_likes_and_dislikes = like_count - dislike_count;
    var result_color = 0;
    if(subtraction_likes_and_dislikes > 0)
    {
        result_color = 1;
    }
    else if(subtraction_likes_and_dislikes === 0)
    {
        result_color = 2;
    }
    comment_element.style.backgroundColor = `${background_comment_color[result_color]}`;
    comment_element.style.borderLeft = `1px solid ${comment_color[result_color]}`;
    comment_element.style.borderRight = `1px solid ${comment_color[result_color]}`;
    let comment_actions_button_container = comment_element.querySelector(".comment-actions-buttons-container") as unknown as HTMLDivElement;
    if(comment_actions_button_container)
    {
        comment_actions_button_container.style.borderLeft = `1px solid ${comment_color[result_color]}`;
    }
    else
    {
        console.log("In \"change_comment_color_script.js\" not found \".comment-actions_container\"");
    }
}