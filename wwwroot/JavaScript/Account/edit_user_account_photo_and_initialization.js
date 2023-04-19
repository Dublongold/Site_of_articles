"use strict";
async function change_user_photo(event) {
    let this_element = event.target;
    let user_profile_photo = document.getElementById("user_profile_photo");
    if (this_element && this_element.files && this_element.files.length === 1 && user_profile_photo && this_element.files[0].size < 1048576) {
        let file = this_element.files[0];
        let file_reader = new FileReader();
        file_reader.addEventListener("loadend", async function () {
            let user_login_element = document.querySelector("#user_login");
            let user_login = "";
            if (user_login_element) {
                let user_login_a_element = user_login_element.firstChild;
                if (user_login_a_element)
                    user_login = user_login_a_element.textContent ?? "";
            }
            let login_path_user_photo = document.getElementById("login_path_user_photo");
            if (user_profile_photo && login_path_user_photo && file_reader.result && user_login) {
                let result = file_reader.result.toString();
                let request_address = `/account/edit/${encodeURIComponent(user_login.substring(1))}`;
                const change_photo_request = await fetch(request_address, {
                    method: "put",
                    headers: {
                        'operation-with-data': 'photo',
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify(result)
                });
                if (change_photo_request.ok) {
                    user_profile_photo.src = result;
                    login_path_user_photo.src = result;
                }
                else {
                    if (this_element) {
                        let error_message_editor = new Error_message_editor("Зміна фото", this_element.parentElement, "change_user_photo");
                        error_message_editor.need_write_source = false;
                        error_message_editor.error_message = "Не вдалося змінити фото. Виникла помилка з кодом: " + change_photo_request.status;
                        error_message_editor.send();
                    }
                    else {
                        console.log("bad");
                    }
                }
            }
        });
        if (file) {
            file_reader.readAsDataURL(file);
        }
    }
}
document.addEventListener("DOMContentLoaded", function () {
    let edit_user_account_full_name = document.getElementById("edit_user_account_full_name");
    let edit_user_account_about = document.getElementById("edit_user_account_about");
    let change_user_photo_input = document.getElementById("change_user_photo_input");
    let change_user_photo_button = document.getElementById("change_user_photo_button");
    if (edit_user_account_full_name)
        edit_user_account_full_name.addEventListener("click", create_edit_account_full_name_field);
    if (edit_user_account_about)
        edit_user_account_about.addEventListener("click", create_edit_account_about_field);
    if (change_user_photo_input)
        change_user_photo_input.addEventListener("change", change_user_photo);
    if (change_user_photo_button)
        change_user_photo_button.addEventListener("click", function () {
            if (change_user_photo_input) {
                change_user_photo_input.click();
            }
        });
});
