function change_title_image(event)
{
    let article_title_image_input = event.target;
    let file = article_title_image_input.files[0];
    let img_element = document.getElementsByClassName("article-title-image")[0];
    let file_reader = new FileReader();

    file_reader.onloadend = function(event)
    {
        let img_elem = document.getElementsByClassName("article-title-image")[0];
        if(img_elem)
        {
            img_elem.src = file_reader.result;
        }
        else
        {
            console.log(`Not found in "change_title_image"(file_reader.onloadend) element img_elem. His is equals ${img_elem}`);
        }
    };
    if(file)
    {
        file_reader.readAsDataURL(file);
    }
    else
    {
        img_element.src = "/Default_article_photo.png";
    }
}

document.getElementById("article_title_image_input").addEventListener("change", change_title_image);
