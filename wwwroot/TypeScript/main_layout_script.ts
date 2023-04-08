document.addEventListener("DOMContentLoaded", function(){
    let dublongold_home_button = document.querySelector(".dublongold-home-button");
    if(dublongold_home_button)
    {
        dublongold_home_button.addEventListener("click", function(event){
            disable_all_buttons();
            window.location.assign("/");
        });
    }

})

function disable_all_buttons()
{
    let button_elements = document.querySelectorAll("button");
    for(let button_element of Array.from(button_elements))
    {
        button_element.disabled = true;
    }
}

let button_colors = ["rgb(193, 23, 23)", "rgb(29, 165, 29)", "rgba(52,53,65)"];

let strong_password = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})');
let medium_password = new RegExp('((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,}))|((?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.{8,}))');