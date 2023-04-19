class Error_message_editor
{
    need_write_source:boolean = true;
    text_color:string = "red";
    error_message : string | null = null;
    constructor(public source : string,
                public where_append : HTMLElement | null,
                public id : string)
    {
        if(!this.error_message)
            this.error_message = "";
    }
    send()
    {
        if (!this.error_message || this.error_message === "")
        {
            let error_message_element = document.getElementById("error_message_".concat(this.id));
            if (error_message_element) 
            {
                error_message_element.remove();
            }
        }
        else
        {
            let result_message = `${this.need_write_source?`Помилка в "${this.source}": `:""}${this.error_message}`;
            if (!this.error_message.charAt(this.error_message.length - 1).match(/[.!?;]/))
                this.error_message += "."
            if (this.where_append)
            {
                let comment_error_message_element:HTMLElement|null = document.getElementById("error_message_".concat(this.id));
                if (!comment_error_message_element)
                {
                    comment_error_message_element = document.createElement("div");
                    comment_error_message_element.id = "error_message_".concat(this.id);
                    comment_error_message_element.className = "error-message";
                    this.where_append.appendChild(comment_error_message_element);
                }
                if(comment_error_message_element)
                {
                    comment_error_message_element.textContent = result_message;
                }
                else
                {
                    console.log(result_message);
                }
            }
            else 
            {
                console.log(result_message);
            }
        }
    }
}