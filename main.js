const hide_button = document.getElementById('fade-in');
const seek_button = document.getElementById('fade-out');
const lnb = document.getElementById('left-menu');
const top_menu = document.getElementById('top-menu');
const id= document.getElementById('Identifier');
const addbutton= document.getElementsByClassName(`addlist`);
const list = document.getElementById(`lists`);

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
hide_button.addEventListener("click",hide_menu)
seek_button.addEventListener("click",find_menu)
const dolists = document.querySelectorAll('.do_list')

dolists.forEach(element => {
    element.addEventListener("mouseover", ()=>{
        element.style.backgroundColor="rgb(151, 151, 151)";
        element.childNodes[1].style.color="white"
        element.childNodes[2].style.color="white"
    })
    element.addEventListener("mouseout", ()=>{
        element.style.backgroundColor="#eeeeee";
        element.childNodes[1].style.color="black"
        element.childNodes[2].style.color="black"
    })
});

function hide_menu(){
    lnb.style.display="none";
    seek_button.style.display="block";
}

function find_menu(){
    lnb.style.display="flex";
    seek_button.style.display="none";
}
addbutton[0].addEventListener(`click`, ()=>{
    new_add_bt= document.createElement(`div`);
    new_add_bt.setAttribute(`class`, `todo_list`);
    new_add_bt.innerText = `+ 리스트를 추가하세요.`
    list.append(new_add_bt)
    console.log("dd")
})