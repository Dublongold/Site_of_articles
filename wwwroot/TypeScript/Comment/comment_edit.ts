
function edit_comment(event : PointerEvent, comment_id:string, reference_to_button_function:EventListenerOrEventListenerObject)
{
    if(event)
    {
        let current_target = event.currentTarget as unknown as HTMLButtonElement;
        
        if(current_target)
        {
            current_target.disabled = true;
            
            let comment_container = get_comment_container_by_comment_id(comment_id);
            if(comment_container)
            {
                let comment_content_container = comment_container.getElementsByClassName("comment-content-container")[0];
                if(comment_content_container && !comment_content_container.hasAttribute("edit_comment_content"))
                {
                    let comment_edited_message = comment_container.querySelector(".comment-edited-message") as HTMLDivElement;
                    if(comment_edited_message)
                    {
                        comment_edited_message.hidden = true;
                    }
                    current_target.removeEventListener("click", reference_to_button_function);
                    let comment_content_text = comment_content_container.textContent ?? "";
                    let edit_comment_temp_function = function(event:PointerEvent){cancel_editing_comment_content(event, comment_content_text, comment_id, edit_comment_temp_function)} as EventListenerOrEventListenerObject;
                    current_target.addEventListener("click", edit_comment_temp_function);
                    current_target.textContent = "Скасувати";

                    let textarea_for_edit_content_of_comment = document.createElement("textarea") as HTMLTextAreaElement;
                    let button_for_save_changes_of_comment_content = document.createElement("button");
                    
                    textarea_for_edit_content_of_comment.className = "textarea-for-edit-content-of-comment";
                    if(comment_content_container.textContent)
                        textarea_for_edit_content_of_comment.value = comment_content_container.textContent;

                    button_for_save_changes_of_comment_content.className = "button-for-save-changes-of-comment-content";
                    button_for_save_changes_of_comment_content.textContent = "Зберегти";
                    button_for_save_changes_of_comment_content.addEventListener("click", function(event:PointerEvent){save_changes_of_comment_content(event, comment_id, edit_comment_temp_function)} as EventListenerOrEventListenerObject);
                    comment_content_container.innerHTML = "";
                    comment_content_container.appendChild(textarea_for_edit_content_of_comment);
                    comment_content_container.appendChild(button_for_save_changes_of_comment_content);
                    comment_content_container.setAttribute("edit_comment_content", "");
                }
            }
            current_target.disabled = false;
        }
    }
}

async function save_changes_of_comment_content(event:PointerEvent, comment_id:string, reference_to_cancel_button_function:EventListenerOrEventListenerObject) : Promise<void>
{
    if(event)
    {
        let current_target = event.currentTarget as unknown as HTMLButtonElement;
        if(current_target)
        {
            current_target.disabled = true;
            let comment_container = get_comment_container_by_comment_id(comment_id);
            let error_message_editor = new Error_message_editor("Редагування: зберегти", null,  "save_edit_content_of_comment_with_id" + comment_id);
            if(comment_container && comment_container.firstElementChild)
                error_message_editor.where_append = comment_container.firstElementChild as HTMLElement;
            
            if(comment_container)
            {
                let comment_content_container = comment_container.getElementsByClassName("comment-content-container")[0] as unknown as HTMLDivElement;
                if(comment_content_container && comment_content_container.hasAttribute("edit_comment_content"))
                {
                    let comment_content_textarea = comment_content_container.getElementsByClassName("textarea-for-edit-content-of-comment")[0] as HTMLTextAreaElement|undefined;
                    if(comment_content_textarea)
                    {
                        let edit_button_of_comment = comment_container.getElementsByClassName("edit-button-of-comment")[0] as unknown as HTMLButtonElement;
                        if(edit_button_of_comment)
                        {
                            if(comment_content_textarea.value && comment_content_textarea.value.replace(/\s/g, "").length > 0)
                            {
                                let comment_content_text = comment_content_textarea.value.replace(/</g, "$lt").replace(/>/g, "$gt").replace(/\n/g, "<br>").replace(/\s/g, "&nbsp");
                                let formated_text = encodeURIComponent(comment_content_text);
                                const edit_request = await fetch(`/comment/edit/${comment_id}/${article_id}/?new_content=${formated_text}`, {method:"put"});
                                if(edit_request.ok)
                                {
                                    let comment_edited_message = comment_container.querySelector(".comment-edited-message") as HTMLDivElement;
                                    if(comment_edited_message)
                                    {
                                        comment_edited_message.hidden = false;
                                    }
                                    cancel_editing_comment_content_function(edit_button_of_comment, comment_id, comment_content_container, comment_content_text, reference_to_cancel_button_function);
                                }
                                else
                                {
                                    switch(edit_request.status)
                                    {
                                        case 404:
                                            error_message_editor.error_message = "Вибачте, але цього коментаря не було знайдено. Можливо, його вже не існує, бо хтось видалив раніше, чим ви встигли відредагувати.";
                                            break;
                                        case 401:
                                            error_message_editor.error_message = "Ви неавторизовані! Будь-ласка, авторизуйтесь, щоб мати можливість редагувати коментарі.";
                                            break;
                                        case 500:
                                            error_message_editor.error_message = `Виникла неочікувана помилка на стороні серверу. Можливо, якісь проблеми з базою даних.`;
                                            break;
                                        default:
                                            error_message_editor.error_message = `Виникла неочікувана помилка з кодом ${edit_request.status}.`;
                                    }
                                }
                            }
                            else
                            {
                                error_message_editor.error_message = "Коментар не має бути пустим або містити лише пробільні символи. Якщо хочете його видалити, то натисніть кнопку \"Видалити\", яка знаходиться там же, де й кнопка \"Редагувати\"";
                            }
                        }
                    }
                }
            }
            error_message_editor.send();
            if(event && current_target)
            {
                current_target.disabled = false;
            }
        }
    }
}

function cancel_editing_comment_content(event:PointerEvent, set_comment_content:string, comment_id:string, reference_to_button_function:EventListenerOrEventListenerObject)
{
    if(event)
    {
        let current_target = event.currentTarget as unknown as HTMLButtonElement;
        if(current_target)
        {
            current_target.disabled = true;
            let comment_container = get_comment_container_by_comment_id(comment_id);
            if(comment_container)
            {
                let comment_edited_message = comment_container.querySelector(".comment-edited-message") as HTMLDivElement;
                if(comment_edited_message)
                {
                    comment_edited_message.hidden = false;
                }
                let comment_content_container = comment_container.querySelector(".comment-content-container") as HTMLDivElement|null;
                if(comment_content_container && comment_content_container.hasAttribute("edit_comment_content"))
                {
                    cancel_editing_comment_content_function(current_target, comment_id, comment_content_container, set_comment_content, reference_to_button_function);
                }
            }
            if(event && current_target)
            {
                current_target.disabled = false;
            }
        }
    }
}

function cancel_editing_comment_content_function(event_target:HTMLElement, comment_id:string, comment_content_container:HTMLDivElement, set_comment_content:string, reference_to_button_function:EventListenerOrEventListenerObject)
{
    if(comment_content_container)
    {
        comment_content_container.innerHTML = "";
        comment_content_container.removeAttribute("edit_comment_content");
        comment_content_container.innerHTML = set_comment_content;
        event_target.removeEventListener("click", reference_to_button_function);
        let edit_comment_temp_function = function(event:PointerEvent){edit_comment(event, comment_id, edit_comment_temp_function)} as EventListenerOrEventListenerObject;
        event_target.addEventListener("click", edit_comment_temp_function);
        event_target.textContent = "Редагувати";
    }
}