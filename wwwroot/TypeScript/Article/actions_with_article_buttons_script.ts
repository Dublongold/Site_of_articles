function open_article(event: PointerEvent, article_id: string)
{
    let this_element = event.currentTarget as HTMLButtonElement;
    if(this_element)
    {
        disable_all_buttons();
        window.location.assign(`/article/read/${article_id}`);
    }
}

function edit_article(event: PointerEvent, article_id: string)
{
    let this_element = event.currentTarget as HTMLButtonElement;
    if(this_element)
    {
        this_element.disabled = true;
        window.location.assign(`/article/edit/${article_id}`);
    }
}

function delete_article(event: PointerEvent, article_id: string, event_for_remove: EventListenerOrEventListenerObject)
{
    let this_element = event.target as HTMLButtonElement;
    if(this_element)
    {
        this_element.innerText = "Ви впевнені?"
        this_element.removeEventListener("click", event_for_remove);
        let event_for_pass = function() {sure_delete_article(article_id)};
        this_element.addEventListener("click", event_for_pass);
        setTimeout(not_sure_delete_article, 3000, event, article_id, event_for_pass);
    }
}

function not_sure_delete_article(event: PointerEvent, article_id: string, event_for_remove: EventListenerOrEventListenerObject)
{
    let this_element = event.target as HTMLButtonElement;
    if(this_element)
    {
        this_element.textContent = "Видалити";
        this_element.removeEventListener("click", event_for_remove);
        let event_for_pass = function(event: PointerEvent) {delete_article(event, article_id, event_for_pass)} as EventListenerOrEventListenerObject;
        this_element.addEventListener("click", event_for_pass);
    }
}

async function sure_delete_article(article_id: string)
{
    let result = await fetch(`/article/delete/${article_id}`, {method:"post"});
    if(result.ok)
    {
        disable_all_buttons();
        window.location.reload();
    }
    else
    {
        alert(`Виникла помилка під час спроби видалити статтю (Код помилки: ${result.status})`);
    }
}

function actions_with_article(event: PointerEvent, article_id: string, event_for_remove: EventListenerOrEventListenerObject)
{
    let this_element = event.currentTarget as HTMLButtonElement;
    if(this_element)
    {
        this_element.textContent = "Скасувати";
        this_element.removeEventListener("click", event_for_remove);
        let event_for_pass = function (event:PointerEvent) {cancel_actions_with_article(event, article_id, event_for_pass)} as EventListenerOrEventListenerObject;
        this_element.addEventListener("click", event_for_pass);
        let array_of_parameters = [{c:"article-edit-button", f:edit_article, t:"Редагувати"}, {c:"article-delete-button", f:delete_article, t:"Видалити"}] as const;
        for(let parameters_of_button of array_of_parameters)
        {
            let new_button = document.createElement("button") as HTMLButtonElement;
            new_button.className = parameters_of_button.c;
            let event_for_pass:any;
            if(parameters_of_button.f == edit_article)
            {
                event_for_pass = function(event:PointerEvent) {(parameters_of_button.f as typeof edit_article)(event, article_id)};
            }
            else
            {
                event_for_pass = function(event:PointerEvent) {parameters_of_button.f(event, article_id, event_for_pass)};
            }
            new_button.addEventListener("click", event_for_pass);
            new_button.innerText = parameters_of_button.t;
            if(this_element.parentElement)
                this_element.parentElement.appendChild(new_button);
            else
                console.log("Not found this_element.parentElement in actions_with_article");
        }
    }
}

function cancel_actions_with_article(event: PointerEvent, article_id: string, event_for_remove: EventListenerOrEventListenerObject)
{
    let this_element = event.currentTarget as HTMLButtonElement;
    for(let i = 1; i < 3; i++)
    {
        let next_element = this_element.nextElementSibling;
        if(next_element && (next_element.className === "article-edit-button" || next_element.className === "article-delete-button"))
        {
            next_element.remove();
        }
    }
    this_element.textContent = "Дії";
    this_element.removeEventListener("click", event_for_remove);
    let event_for_pass = function (event: PointerEvent) {actions_with_article(event, article_id, event_for_pass)} as EventListenerOrEventListenerObject;
    this_element.addEventListener("click", event_for_pass);
}

document.addEventListener("DOMContentLoaded", function()
{
    let article_open_buttons = document.querySelectorAll(".article-open-button");
    let article_actions_buttons = document.querySelectorAll(".article-actions-button");

    if(article_open_buttons.length > 0)
    {
        for(let open_button of Array.from(article_open_buttons))
        {
            let article_id = open_button.getAttribute("article_id") ?? "";
            if(article_id)
            {
                open_button.removeAttribute("article_id");
                open_button.addEventListener("click", function(event: PointerEvent)
                {
                    open_article(event, article_id);
                } as EventListenerOrEventListenerObject);
            }
        }
    }

    if(article_actions_buttons.length > 0)
    {
        for(let actions_button of Array.from(article_actions_buttons))
        {
            if(actions_button.hasAttribute("article_id"))
            {
                let article_id = actions_button.getAttribute("article_id") ?? "";
                if(article_id)
                {
                    actions_button.removeAttribute("article_id");
                    let event_for_pass = function(event: PointerEvent){actions_with_article(event, article_id, event_for_pass);} as EventListenerOrEventListenerObject;
                    actions_button.addEventListener("click", event_for_pass);
                }
            }
        }
    }
});