function add_new_image_in_article_editor(event)
{
    var file = event.target.files[0];
    var reader = new FileReader();
    var img_elem;
    var parent_element = event.target.parentElement;
    var image_of_article_element = parent_element.getElementsByClassName("image-of-article")[0];

    if(image_of_article_element)
    {
        img_elem = image_of_article_element;
    }
    else
    {
        img_elem = document.createElement("img");
        img_elem.className = "image-of-article";
        img_elem.ondragend = apply_changes_of_image;
        img_elem.addEventListener("dragend", function(event){(document.getSelection()).removeAllRanges()});
    }

    reader.onloadend = function () {
        var img_elems = document.getElementsByClassName("image-of-article");
        var has_placed = false;
        for(var img_temp of img_elems)
        {
            if(img_temp.parentElement.tagName.toLowerCase() == "fieldset" && img_temp.src == reader.result)
            {
                has_placed = true;
            }
        }
        if(has_placed == false)
        {
            article_editor_image_prameters_container(event, parent_element, img_elem);
            img_elem.src = reader.result;
        }
        else
        {
            event.target.parentElement.getElementsByTagName("legend")[0].innerText = "Завантажте нове зображення тут";
            event.target.value = "";
        }
    }
    
    if (file) 
    {
        event.target.parentElement.getElementsByTagName("legend")[0].innerText = file.name;
        reader.readAsDataURL(file);
    }
}