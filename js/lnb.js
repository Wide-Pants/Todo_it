const hide_button = document.getElementById('fade-in');
const seek_button = document.getElementById('fade-out');
const lnb = document.getElementById('left-menu');
const top_menu = document.getElementById('top-menu');
const id = document.getElementById('Identifier');
const friends_modal = document.getElementById(`friends_modal`)


friends_modal.style.left = `${lnb.offsetWidth+10}px`;
id.innerText = window.localStorage.getItem(`user_id`);

hide_button.addEventListener("mouseover",()=>{
    hide_button.style.color="white";
    hide_button.style.backgroundColor="#eeeeee";
})
hide_button.addEventListener("mouseout",()=>{
    hide_button.style.color="black";
    hide_button.style.backgroundColor="rgb(151, 151, 151)";
})
top_menu.addEventListener("mouseover",()=>{
    id.style.paddingRight="21px";
    top_menu.style.backgroundColor="rgb(151, 151, 151)";
    hide_button.style.display="inline-block"
})
top_menu.addEventListener("mouseout", ()=>{
    id.style.paddingRight="50px";
    top_menu.style.backgroundColor="#eeeeee";
    hide_button.style.display="none"
})
function hide_menu(){
    lnb.style.display="none";
    seek_button.style.display="block";
}

function find_menu(){
    lnb.style.display="flex";
    seek_button.style.display="none";
}
hide_button.addEventListener("click",hide_menu)
seek_button.addEventListener("click",find_menu)
