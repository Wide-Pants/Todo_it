const hide_button = document.getElementById('fade-in');
const seek_button = document.getElementById('fade-out');
const lnb = document.getElementById('left-menu');
const top_menu = document.getElementById('top-menu');
const id = document.getElementById('Identifier');
const addbutton = document.getElementById(`addlist`);
const todo_list = document.getElementById(`todo_list`);


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


cnt = 0
addbutton.addEventListener(`click`, ()=>{
    const new_todo_input= document.createElement(`li`);
    new_todo_input.innerHTML = `<div style="margin-left:10px;" class="ch_button"></div><div id="list_txt"><input type="text" id="writen" style="font-size:16px; line-height: 16px; heigth:24px; outline: none; border:none;"></div>`
    todo_list.append(new_todo_input)
    cnt++;
    
    const todo_text = document.getElementById(`writen`)
    todo_text.focus();
        
    todo_text.addEventListener(`focusout`, ()=>{
        thing = todo_text.value
        new_todo= document.createElement(`li`);
        new_todo.innerHTML = `<div class="can_mov_bt inv"></div><input type="checkbox" style="display:none;" id="s${cnt}"><label for="s${cnt}" class="ch_button"></label><div id="list_txt"><span>${thing}</span></div>`
        new_todo_input.remove();
        todo_list.append(new_todo)
        let dd=1
        const list_txt = document.getElementById(`list_txt`)
        list_txt.addEventListener(`mouseover`,(e)=>{
            can_mov = list_txt.parentElement.children[0]
            can_mov.classList.toggle(`inv`)
            list_txt.children[0].style.background = `#EEEEEE`
            list_txt.children[0].style.borderRadius = `2.5px`
        })
        list_txt.addEventListener(`mouseout`,()=>{
            can_mov = list_txt.parentElement.children[0]
            can_mov.classList.toggle(`inv`)
            list_txt.children[0].style.background = `none`
        })
    })
    todo_text.addEventListener("keyup", function (event) {
        if (event.code == 'Enter'|| event.code == 'NumpadEnter') {
            event.preventDefault();
            todo_text.blur();       
    }})
})
