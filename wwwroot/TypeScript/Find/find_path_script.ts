async function check_search_options(event: PointerEvent, checkbox_param: string[])
{
    var checkbox_elem = document.getElementById(checkbox_param[0]) as HTMLInputElement;
    if(checkbox_elem && checkbox_elem.checked !== null && checkbox_elem.checked !== undefined)
    {
        delete_find_error_message();
        await fetch(`/find/options/${checkbox_param[1]}/?option_value=${checkbox_elem.checked}`, {method:"post"});
    }
    else
    {
        let where_append = event.currentTarget !== null && event.currentTarget !== undefined?(event.currentTarget as HTMLInputElement).parentElement:null
        error_message_editor("Критерій пошуку","Виникла помилка під час спроби налаштувати критерій пошуку.", where_append, checkbox_param[1]);
    }
}

function validation_find_form(event: PointerEvent)
{
    const source = "Пошук";
    let error_message  = "";
    let find_input = document.getElementById("find_input") as HTMLInputElement;
    let find_form = document.getElementById("find_form") as HTMLFormElement;
    // find_input || event.target || find_form
    let where_append:HTMLElement|null = null;
    if(find_input)
    {
        where_append = find_input;
    }
    else if(event.target)
    {
        where_append = event.target as HTMLElement;
    }
    else if(find_form)
    {
        where_append = find_form;
    }
    const error_message_id = "find_path";

    
    if(!find_input)
    {
        error_message = "Не можливо знайти find_input...";
    }
    else if (!find_input.value || find_input.value.trim().length === 0)
    {
        error_message = "Будь-ласка, напишіть текст, по якому буде виконуватися пошук.";
    }
    else
    {   
        let find_options = document.getElementsByClassName("find-option");
        let any_find_options_selected = false;
        for(let find_option of Array.from(find_options) as HTMLInputElement[])
        {
            if(find_option.checked)
            {
                any_find_options_selected = true;
            }
        }
        if(any_find_options_selected)
        {
            if(find_form && find_form.submit !== undefined)
            {
                disable_all_buttons();
                find_form.submit();
            }
            else
                error_message = "Не знайдено форми, яка б відправила дані для пошуку ваших статтей";
        }
        else
        {
            error_message = "Хоча б один критерій повинен бути обраним!";
        }
    }
    if(error_message !== "")
    {
        error_message_editor(source, error_message, where_append, error_message_id);
    }
}

function delete_find_error_message()
{
    let find_error_message = document.getElementById("find_error_message");
    if(find_error_message)
    {
        find_error_message.remove();
    }
}
document.addEventListener("DOMContentLoaded", function(){
    let id_and_path_find = [
        ["find_theme","theme"],
        ["find_tags","tags"],
        ["find_description","description"],
        ["find_content","content"],
        ["find_authors","authors"],
        ["find_id","id"]
    ];
    let find_button = document.getElementById("find_button");
    for(let checkbox_param of id_and_path_find)
    {
        let checkbox_elem = document.getElementById(checkbox_param[0]);
        if(checkbox_elem)
            checkbox_elem.addEventListener("click", function(event: PointerEvent){check_search_options(event, checkbox_param);} as EventListener);
    }
    if(find_button)
    {
        find_button.addEventListener("click", validation_find_form as EventListener);
    }
    let find_input = document.getElementById("find_input");
});