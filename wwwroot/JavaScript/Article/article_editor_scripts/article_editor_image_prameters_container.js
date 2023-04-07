function article_editor_image_prameters_container(event, parent_element, img_elem)
{
    if(!parent_element.getElementsByTagName("div")[0])
    {
        var main_div_elem = document.createElement("div");
        
        var div_elem_1_1 = document.createElement("div");
        var div_elem_1_2 = document.createElement("div");
        var div_elem_2_1 = document.createElement("div");
        var div_elem_2_2 = document.createElement("div");
        var div_elem_3_1 = document.createElement("div");
        var div_elem_3_2 = document.createElement("div");

        var input_elem_1 = document.createElement("input");
        var input_elem_2 = document.createElement("input");
        var input_elem_3 = document.createElement("input");
        var input_elem_4 = document.createElement("input");
        
        var select_elem = document.createElement("select");

        var select_option_elem_1 = document.createElement("option");
        var select_option_elem_2 = document.createElement("option");
        var select_option_elem_3 = document.createElement("option");

        var delete_button = document.createElement("button");

        var fieldset_elem = document.createElement("fieldset");
        var legend_elem = document.createElement("legend");

        main_div_elem.className = "image-parameters-containter";

        input_elem_2.className = "image-width";
        input_elem_2.type = "number";
        input_elem_2.addEventListener("input", width_and_height_character_limit);
        input_elem_2.placeholder = "за замовчуванням";
        input_elem_2.addEventListener("input",  apply_changes_of_image);
        
        input_elem_3.className = "image-height";
        input_elem_3.type = "number";
        input_elem_3.addEventListener("input", width_and_height_character_limit);
        input_elem_3.placeholder = "за замовчуванням";
        input_elem_3.addEventListener("input",  apply_changes_of_image);

        select_elem.className = "image-align";
        
        select_option_elem_1.innerText = "Вгору";
        select_option_elem_1.value = "top";

        select_option_elem_2.innerText = "По центру";
        select_option_elem_2.value = "middle";

        select_option_elem_3.innerText = "Знизу";
        select_option_elem_3.value = "bottom";
        select_option_elem_3.selected = true;

        select_elem.appendChild(select_option_elem_1);
        select_elem.appendChild(select_option_elem_2);
        select_elem.appendChild(select_option_elem_3);
        select_elem.addEventListener("change", apply_changes_of_image);

        input_elem_4.className = "image-alt";
        input_elem_4.placeholder = "як назва файлу";
        input_elem_4.addEventListener("input", apply_changes_of_image);

        delete_button.innerText = "Видалити";
        delete_button.type = "button";
        delete_button.addEventListener("click", delete_images_and_input);

        div_elem_1_1.innerText = "Розширення:";
        div_elem_2_1.innerText = "Вирівнювання:";
        div_elem_3_1.innerText = "Альтернативний текст:";
        
        div_elem_1_2.appendChild(input_elem_2);
        div_elem_1_2.appendChild(document.createTextNode(" x "));
        div_elem_1_2.appendChild(input_elem_3);
        
        div_elem_2_2.appendChild(select_elem);
        
        div_elem_3_2.appendChild(input_elem_4);


        main_div_elem.appendChild(div_elem_1_1);
        main_div_elem.appendChild(div_elem_1_2);
        main_div_elem.appendChild(div_elem_2_1);
        main_div_elem.appendChild(div_elem_2_2);
        main_div_elem.appendChild(div_elem_3_1);
        main_div_elem.appendChild(div_elem_3_2);

        parent_element.firstChild.after(document.createElement("br"));
        parent_element.firstChild.after(img_elem);
        parent_element.appendChild(document.createElement("br"));
        parent_element.appendChild(main_div_elem);

        legend_elem.innerText = "Завантажте нове зображення тут";
        legend_elem.className = "image-fieldset-legend";
        fieldset_elem.className = "image-fieldset";
        input_elem_1.type = "file";
        input_elem_1.name = "image_file_for_article";
        input_elem_1.id = "image_file_for_article";
        input_elem_1.accept = "image/*";
        input_elem_1.addEventListener("change", add_new_image_in_article_editor);
        fieldset_elem.appendChild(legend_elem);
        fieldset_elem.appendChild(input_elem_1);
        parent_element.after(fieldset_elem);
        event.target.after(delete_button);
        event.target.after(document.createElement("br"));
    }
}