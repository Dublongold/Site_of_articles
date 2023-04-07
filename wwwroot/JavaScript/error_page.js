"use strict";
document.addEventListener("DOMContentLoaded", function () {
    let back_to_home_button = document.getElementById("back_to_home");
    if (back_to_home_button) {
        back_to_home_button.addEventListener("click", function (event) {
            document.location.assign("/home");
        });
    }
});
