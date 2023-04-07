"use strict";
document.addEventListener("DOMContentLoaded", function () {
    let dublongold_home_button = document.querySelector(".dublongold-home-button");
    if (dublongold_home_button) {
        dublongold_home_button.addEventListener("click", function (event) {
            window.location.assign("/");
        });
    }
});
