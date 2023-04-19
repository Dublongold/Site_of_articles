/// <reference path="../../JavaScript/microsoft/signalr/dist/esm/index.d.ts" />

document.addEventListener("DOMContentLoaded", function(){
    let new_comment_writed_message = document.getElementById("new_comment_writed_message");
    if(new_comment_writed_message)
    {
        let hub_connection = new signalR.HubConnectionBuilder().withUrl("/actions_with_comments").build();

        hub_connection.on("Comment writed", function(){
            if(new_comment_writed_message)
            {
                console.log("Good");
                new_comment_writed_message.textContent = "Хтось написав коментар...";
            }
            else
            {
                console.warn("Not found");
            }
        });
        hub_connection.on("Comment deleted", function(comment_id: string){
            let comment_container = get_comment_container_by_comment_id(comment_id);
            if(comment_container)
            {
                let delete_button = comment_container.querySelector(".delete-button-of-comment") as HTMLButtonElement;
                if(!delete_button || delete_button.disabled === false)
                {
                    let comment_deleted = document.createElement("p");
                    comment_deleted.className = "comment-deleted";
                    comment_deleted.textContent = "Тут був коментар, але його видалили...";
                    comment_container.after(comment_deleted);
                    comment_container.remove();
                }
            }
        });
        hub_connection.onclose(function(){
            if(hub_connection && article_id)
                hub_connection.invoke("End read article", article_id);
        })
        hub_connection.on("Comment edited", function(comment_id: number, new_content : string){
            let comment_container = get_comment_container_by_comment_id(comment_id);
            if(comment_container && !comment_container.getAttribute("deleted_comment"))
            {
                let comment_content_container = comment_container.querySelector(".comment-content-container") as HTMLDivElement;
                if(comment_content_container)
                {
                    comment_content_container.innerHTML = new_content;
                }
            }
        });
        hub_connection.start().then(()=>hub_connection.invoke("Read article", article_id));
    }
});