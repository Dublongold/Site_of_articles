function article_preview_button_function(event)
{
    if(!valid_user_input(event)) return;
    let article_editor_elements = document.getElementById("article_editor_elements");
    article_editor_elements.action = "/article/preview";
    article_editor_elements.target= "_blank";
    if(document.getElementById("validation_errors"))
    {
        document.getElementById("validation_errors").remove();
    }
    if(article_editor_elements)
    {
        submit_article_editor_action(article_editor_elements);
    }
    else
    {
        console.error(article_editor_elements);
    }  
}
function article_create_button_function(event)
{
    if(!valid_user_input(event)) return;
    let article_editor_elements = document.getElementById("article_editor_elements");
    article_editor_elements.action = "/article/create";
    article_editor_elements.target = "_self";
    window.removeEventListener('beforeunload', warning_before_user_unload);
    submit_article_editor_action(article_editor_elements);
}
function article_edit_button_function(event)
{
    if(!valid_user_input(event)) return;
    let article_editor_elements = document.getElementById("article_editor_elements");
    let article_id = event.target.parentElement.getAttribute("article_id");
    article_editor_elements.action = `/article/edit/${article_id}`;
    article_editor_elements.target = "_self";
    window.removeEventListener('beforeunload', warning_before_user_unload);
    submit_article_editor_action(article_editor_elements);
}
function submit_article_editor_action(article_editor_elements)
{
    let hidden_article_content = document.getElementById("hidden_article_content");
    let article_content = document.getElementById("article_content");
    if(hidden_article_content && article_content)
    {
        hidden_article_content.value = article_content.innerHTML;
    }
    let article_title_image_input_src = document.getElementById("article_title_image_input_src");
    let article_title_image = document.getElementsByClassName("article-title-image")[0];
    if(article_title_image_input_src && article_title_image)
    {
        article_title_image_input_src.value = article_title_image.src;
    }
    console.log(article_editor_elements);
    if(article_editor_elements)
    {
        article_editor_elements.submit();
    }
    else
    {
        console.log(`Error in submit_article_create_or_preview(${article_editor_elements})`);
    }
}
function valid_user_input(event)
{
    var invalid = false;
    var article_theme_elem = document.getElementById("article_theme");
    var article_tags_elem = document.getElementById("article_tags");
    var article_content_elem = document.getElementById("article_content");
    var error_messages = document.getElementById("validation_errors");
    if(error_messages)
    {
        error_messages.remove();
    }
    if(article_theme_elem)
    {
        if(!article_theme_elem.value)
        {
            invalid = true;
            create_error_messages_or_add_to_him_content_in_create_article(event, "Ваша стаття має обов'язково містити тему.");
        }
    }
    else
    {
        return false;
    }
    if(article_tags_elem)
    {
        if(article_tags_elem.value)
        {
            for(var c of article_tags_elem.value.replace(/\s/g, ','))
            {
                if(c.toLowerCase() === c.toUpperCase() && c !== "_" && c !== "," && /\d/.test(c) === false)
                {
                    invalid = true;
                    create_error_messages_or_add_to_him_content_in_create_article(event, "Перегляньте правила написання тегів.");
                }
            }
            
        }
    }
    else
    {
        return false;
    }
    if(article_content_elem)
    {
        if(!article_content_elem.innerHTML)
        {
            invalid = true;
            create_error_messages_or_add_to_him_content_in_create_article(event, "Ваша стаття має обов'язково містити зміст.");
        }
    }
    else
    {
        return false;
    }
    if(invalid)
    {
        return false;
    }
    return true;
}