function width_and_height_character_limit(event)
{
    if(event.target.value.length > 4)
    {
        event.target.value = event.target.value.substring(0,4);
    }
}

function create_error_messages_or_add_to_him_content_in_create_article(event, content)
{
    var error_messages = document.getElementById("validation_errors");
    var error_content = document.createElement("li");
    error_content.innerText = content;
    if(error_messages && error_messages.getElementsByTagName("ul")[0])
    {
        var list_of_error_messages = error_messages.getElementsByTagName("ul")[0];
        var not_contains = true;
        for(var b of list_of_error_messages.getElementsByTagName("li"))
        {
            if(b.innerText.includes(error_content.innerText))
            {
                not_contains = false;
            }
        }
        if(not_contains === true)
        {
            list_of_error_messages.appendChild(error_content);
        }
    }
    else
    {
        error_messages = document.createElement("div");
        error_messages.id = "validation_errors";
        var unordered_list = document.createElement("ul");
        unordered_list.appendChild(error_content);
        error_messages.appendChild(unordered_list);
        if(event.target.nextElementSibling)
        {
            event.target.nextElementSibling.after(error_messages);
        }
        else
        {
            event.target.after(error_messages);
        }
    }
}
function warning_before_user_unload(event) 
{
    event.preventDefault();
    event.returnValue = '';
}

function tag_input_only_letter_numbers_commas_and_underscore(event)
{
    var regex = /\s/g;
    event.target.value = event.target.value.replace(regex, ',');
    regex = /[^a-zA-Zа-яА-ЯЇїІі0-9_,]/g;
    event.target.value = event.target.value.replace(regex, '');
}

var images_field_elem = document.getElementById("images_field");

window.addEventListener('beforeunload', warning_before_user_unload);
images_field_elem.getElementsByTagName("input")[0].addEventListener("change", add_new_image_in_article_editor);
let article_create_button = document.getElementById("article_create_button");
let article_edit_button = document.getElementById("article_edit_button");
if(article_create_button)
{
    article_create_button.addEventListener("click", article_create_button_function);
}

if(article_edit_button)
{
    article_edit_button.addEventListener("click", article_edit_button_function);
}
if(document.getElementById("article_preview_button"))
{
    document.getElementById("article_preview_button").addEventListener("click", article_preview_button_function);
}
if(document.getElementById("article_tags"))
{
    document.getElementById("article_tags").addEventListener("input", tag_input_only_letter_numbers_commas_and_underscore);
}
if(document.getElementsByClassName("clear-fonts-in-article-content").length === 1)
{
    document.getElementsByClassName("clear-fonts-in-article-content")[0].addEventListener("click", article_editor_clear_font_in_context);
}