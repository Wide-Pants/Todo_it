const hide_btn = document.getElementById('hide_btn');
const seek_btn = document.getElementById('seek_btn');
const LeftMenu = document.getElementById('left-menu');
const user_name_menu = document.getElementById('user_name_menu');
const id = document.getElementById('Identifier');
const friends_modal = document.getElementById(`friends_modal`)
const friend_btn = document.getElementById(`friend_btn`)
const user_name = document.querySelectorAll(`.user_name`)

friends_modal.style.left = `${LeftMenu.offsetWidth+10}px`;
id.innerText = localStorage.getItem(`user_id`)
user_name.forEach(element => {
    element.innerText = localStorage.getItem(`user_id`)
});

hide_btn.addEventListener("mouseover",()=>{
    hide_btn.style.color="white";
    hide_btn.style.backgroundColor="#eeeeee";
})
hide_btn.addEventListener("mouseout",()=>{
    hide_btn.style.color="black";
    hide_btn.style.backgroundColor="rgb(151, 151, 151)";
})
user_name_menu.addEventListener("mouseover",()=>{
    id.style.paddingRight="21px";
    user_name_menu.style.backgroundColor="rgb(151, 151, 151)";
    hide_btn.style.display="inline-block"
})
user_name_menu.addEventListener("mouseout", ()=>{
    id.style.paddingRight="50px";
    user_name_menu.style.backgroundColor="#eeeeee";
    hide_btn.style.display="none"
})
friend_btn.addEventListener("click", ()=>{
    friends_modal.classList.toggle(`inv`)
})
function hide_menu(){
    LeftMenu.style.display="none";
    seek_btn.style.display="block";
}

function find_menu(){
    LeftMenu.style.display="flex";
    seek_btn.style.display="none";
}

hide_btn.addEventListener("click",hide_menu)
seek_btn.addEventListener("click",find_menu)
