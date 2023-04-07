function error_message_editor(source: string, error_message: string, where_append: HTMLElement|null, error_message_id: string) {
    if (!error_message && error_message === "") 
    {
        let error_message_element = document.getElementById("error_message_".concat(error_message_id));
        if (error_message_element) 
        {
            error_message_element.remove();
        }
    }
    else 
    {
        if (!error_message.charAt(error_message.length - 1).match(/[.!?;]/))
                    error_message += "."
        if (where_append) 
        {
            let comment_error_message_element:HTMLElement|null;
            if (!document.getElementById("error_message_".concat(error_message_id))) 
            {
                comment_error_message_element = document.createElement("div");
                comment_error_message_element.id = "error_message_".concat(error_message_id);
                comment_error_message_element.className = "error-message";
                where_append.appendChild(comment_error_message_element);
            }
            else 
            {
                comment_error_message_element = document.getElementById("error_message_".concat(error_message_id));
            }
            if(comment_error_message_element)
            {
                comment_error_message_element.textContent = "Помилка в \"" + source + "\": " + error_message;
            }
            else
            {
                console.log("Помилка в \"" + source + "\": " + error_message);
            }
        }
        else 
        {
            console.log("Помилка в \"" + source + "\": " + error_message);
        }
    }
}
