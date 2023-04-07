function delete_images_and_input(event)
{
    event.target.innerText = "Ви впевнені?";
    event.target.removeEventListener("click", delete_images_and_input);
    setTimeout(not_sure_delete_images_and_input, 3000, event);
    event.target.addEventListener("click", sure_delete_images_and_input);

}
function not_sure_delete_images_and_input(event)
{
    if(event && event.target)
    {
        event.target.innerText = "Видалити";
        event.target.removeEventListener("click", sure_delete_images_and_input);
        event.target.addEventListener("click", delete_images_and_input);
    }
}

function sure_delete_images_and_input(event)
{
    var images = document.getElementsByClassName("image-of-article");
    var main_image = event.target.parentElement.getElementsByClassName("image-of-article")[0];
    for(var image of images)
    {
        if(image.src === main_image.src)
        {
            if(image.parentElement.tagName.toLowerCase() === "fieldset")
            {
                image.parentElement.remove();
            }
            else
            {
                image.remove();
            }
        }
    }
    if(event && event.target && event.target.parentElement)
    {
        event.target.parentElement.remove();
    }
}

function apply_changes_of_image(event)
{
    var parent_element = event.target.parentElement.parentElement.parentElement;

    var image_width = parent_element.getElementsByClassName("image-width")[0];
    var image_height = parent_element.getElementsByClassName("image-height")[0];
    var image_align = parent_element.getElementsByClassName("image-align")[0];
    var image_alt = parent_element.getElementsByClassName("image-alt")[0];

    var images = document.getElementsByClassName("image-of-article");
    var main_image = parent_element.getElementsByClassName("image-of-article")[0];
    for(var image of images)
    {
        if(image.src === main_image.src)
        {
            if(image.parentElement.tagName.toLowerCase() !== "fieldset")
            {
                image.style.maxWidth = "revert";
                image.style.maxHeight = "revert";

                if(image_width && image_width.value)
                {
                    image.style.width = image_width.value + "px";
                }
                else
                {
                    image.style.width = "revert";
                }
                if(image_height && image_height.value)
                {
                    image.style.height = image_height.value + "px";
                }
                else
                {
                    image.style.height = "revert";
                }
                if(image_align && image_align.value)
                {
                    image.style.verticalAlign = image_align.value;
                }
                else
                {
                    image.style.verticalAlign = "bottom";
                }
                if(image_alt && image_alt.value)
                {
                    image.alt = image_alt.value;
                }
                else
                {
                    image.alt = parent_element.getElementsByTagName("legend")[0].innerText;
                }
            }
        }
    }
}