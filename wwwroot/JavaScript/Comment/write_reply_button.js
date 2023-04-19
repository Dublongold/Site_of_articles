"use strict";
async function create_reply_field_to_comment(this_element, comment_id) {
    this_element.disabled = true;
    let comment_container = get_comment_container_by_comment_id(comment_id);
    let error_message_editor = new Error_message_editor("Відповідь", comment_container.querySelector(".comment-reaction-container"), "write_reply_to_" + comment_id);
    var check_authorized = await fetch("/account/login/authorized", { method: "get" });
    if (check_authorized.ok) {
        let write_reply_fields = document.getElementsByClassName(`write-reply-field`);
        let write_reply_fields_count = write_reply_fields.length;
        if (write_reply_fields_count > 1) {
            for (let temp_del_elem of Array.from(write_reply_fields)) {
                if (comment_container.nextElementSibling === temp_del_elem)
                    continue;
                temp_del_elem.remove();
            }
        }
        else if (write_reply_fields_count === 1) {
            let write_reply_field = document.querySelector(".write-reply-field");
            if (comment_container.nextElementSibling !== write_reply_field && write_reply_field !== null)
                write_reply_field.remove();
            else {
                this_element.disabled = false;
                return;
            }
        }
        if (comment_container) {
            create_elements_for_write_reply(comment_container, comment_id);
        }
    }
    else {
        if (check_authorized.status === 401) {
            error_message_editor.error_message = "Ви неавторизовані. Будь-ласка, авторизуйтеся, щоб мати можливість писати відповіді до коментарів.";
        }
        else {
            error_message_editor.error_message = "Виникла неочікувана помилка.";
        }
    }
    error_message_editor.send();
    this_element.disabled = false;
}
function create_elements_for_write_reply(comment_container, comment_id) {
    let write_reply_field = document.createElement("div");
    write_reply_field.className = `write-reply-field`;
    write_reply_field.style.marginLeft = comment_container.style.marginLeft;
    let write_reply_name_text = document.createElement("span");
    write_reply_name_text.className = `write-reply-name-text`;
    write_reply_name_text.textContent = "Напишить вашу відповіть тут:";
    let write_reply_content = document.createElement("textarea");
    write_reply_content.className = `write-reply-content`;
    write_reply_content.contentEditable = "true";
    write_reply_content.maxLength = 2000;
    var submit_write_reply = document.createElement("button");
    submit_write_reply.className = "submit-write-reply";
    submit_write_reply.textContent = "Відправити";
    submit_write_reply.addEventListener("click", function () { submit_write_reply_comment(this, comment_id); });
    var cancel_write_reply = document.createElement("button");
    cancel_write_reply.className = `cancel-write-reply`;
    cancel_write_reply.textContent = "Cancel";
    cancel_write_reply.addEventListener("click", function () {
        let parent_element = cancel_write_reply.parentElement;
        if (parent_element)
            parent_element.remove();
    });
    write_reply_field.appendChild(write_reply_name_text);
    write_reply_field.appendChild(write_reply_content);
    write_reply_field.appendChild(submit_write_reply);
    write_reply_field.appendChild(cancel_write_reply);
    comment_container.after(write_reply_field);
    write_reply_content.focus();
}
async function submit_write_reply_comment(this_element, comment_id) {
    this_element.disabled = true;
    let write_reply_content_elements = document.getElementsByClassName("write-reply-content");
    let write_reply_name_text_elements = document.getElementsByClassName("write-reply-name-text");
    let submit_write_reply_elements = document.getElementsByClassName("submit-write-reply");
    let cancel_write_reply_elements = document.getElementsByClassName("cancel-write-reply");
    let wrce_n = write_reply_content_elements.length;
    let wrnte_n = write_reply_name_text_elements.length;
    let swre_n = submit_write_reply_elements.length;
    let cwre_n = cancel_write_reply_elements.length;
    let comment_container = get_comment_container_by_comment_id(comment_id);
    let error_message_editor = new Error_message_editor("Відповідь", this_element.parentElement, "write_reply_to_" + comment_id);
    if (comment_container) {
        if (wrce_n === 1 && wrnte_n === 1 && swre_n === 1 && cwre_n === 1) {
            let reply_content_textarea_element = document.querySelector(".write-reply-content");
            if (reply_content_textarea_element && reply_content_textarea_element.value && reply_content_textarea_element.value.trim().length > 0) {
                let reply_level_attr = comment_container.getAttribute("reply_level");
                let reply_level = reply_level_attr ? parseInt(reply_level_attr) + 1 : 1;
                let formated_text = encodeURIComponent(reply_content_textarea_element.value.trim().replace(/</g, "$lt").replace(/>/g, "$gt").replace(/\n/g, "<br>").replace(/\s/g, "&nbsp"));
                const result = await fetch(`/comment/create/${article_id}/?comment_content=${formated_text}&reply_level=${reply_level}&comment_id=${comment_id}`, { method: "post" });
                if (result.ok) {
                    // Видалення всіх полів для написання коментарів
                    for (let write_reply_field of Array.from(document.getElementsByClassName("write-reply-field"))) {
                        write_reply_field.remove();
                    }
                    // Пошук кнопки, яка контролює відповіді(показує або ховає).
                    let replies_button_of_comment = comment_container.querySelector(".replies-button-of-comment");
                    if (!replies_button_of_comment) {
                        replies_button_of_comment = create_replies_button_of_comment(0, comment_id);
                        let dislike_button_of_comment = comment_container.querySelector(".dislike-button-of-comment");
                        if (comment_container.getElementsByClassName("dislike-button-of-comment").length === 1 && dislike_button_of_comment) {
                            dislike_button_of_comment.after(replies_button_of_comment);
                        }
                    }
                    // Пошук або створення поля з коментарями-відповідями
                    let reply_comments = document.getElementsByClassName("reply-comments");
                    let reply_comments_element;
                    if (reply_comments.length > 0) {
                        for (let temp_reply_comments_element of Array.from(reply_comments)) {
                            if (temp_reply_comments_element.hasAttribute("reply_to_comment") && temp_reply_comments_element.getAttribute("reply_to_comment") === comment_id) {
                                reply_comments_element = temp_reply_comments_element;
                            }
                        }
                    }
                    if (!reply_comments_element) {
                        if (replies_button_of_comment.getAttribute("replies_are_hidened") === "true") {
                            await replies_controller(replies_button_of_comment, comment_id);
                            for (let temp_reply_comments_element of Array.from(reply_comments)) {
                                if (temp_reply_comments_element.hasAttribute("reply_to_comment") && temp_reply_comments_element.getAttribute("reply_to_comment") === comment_id) {
                                    reply_comments_element = temp_reply_comments_element;
                                }
                            }
                        }
                        if (reply_comments_element === undefined) {
                            reply_comments_element = document.createElement("div");
                            reply_comments_element.className = "reply-comments";
                            reply_comments_element.setAttribute("reply_to_comment", comment_id);
                            comment_container.after(reply_comments_element);
                        }
                    }
                    // 
                    if (get_comment_container_by_comment_id(result.headers.get("reply-comment-id")) === null) {
                        reply_comments_element.insertAdjacentHTML("afterbegin", await result.text());
                        if (reply_comments_element.firstElementChild && reply_comments_element.firstElementChild.hasAttribute("comment_id")) {
                            add_event_listeners_for_comment_buttons(reply_comments_element.firstElementChild);
                        }
                    }
                    // Пошук кількості відповідей
                    let replies_count = parseInt(result.headers.get("replies-count") ?? "");
                    if (isNaN(replies_count) || replies_count < 0) {
                        replies_count = 0;
                    }
                    // Встановлення кількості відповідей після додавання
                    change_replies_count_by_replies_button_of_comment_text(replies_button_of_comment.querySelector(".count-replies-of-comment"), replies_count);
                }
                else {
                    switch (result.status) {
                        case 401:
                            error_message_editor.error_message = "Ви неавторизовані. Будь-ласка, авторизуйтеся, щоб мати можливість писати відповіді до коментарів.";
                            break;
                        case 404:
                            error_message_editor.error_message = "Коментаря, на який ви хотіли відповісти, більше не існує. Оновіть сторінку, щоб він зник на вашій сторінці.";
                            break;
                        default:
                            error_message_editor.error_message = "Виникла неочікувана помилка.";
                    }
                }
            }
            else
                error_message_editor.error_message = "Неможливо створити відповідь, яка пуста або містить лише пробільні символи.";
        }
        else
            error_message_editor.error_message = "Знайдено елементів полів для відповідей більше, чем один. Будь-ласка, якщо маєте таку можливість, видаліть зайві поля або скопіюйте текст та оновіть сторінку.";
    }
    else
        error_message_editor.error_message = "Не знайдено HTML елемент коментаря.";
    error_message_editor.send();
    this_element.disabled = false;
}
