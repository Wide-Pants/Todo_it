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


addbutton.addEventListener('click', () => {
    const new_todo_list = document.createElement('li');
    new_todo_list.draggable= `true`;
    const can_mov_bt = document.createElement(`div`)
    can_mov_bt.classList.add(`can_mov_bt`,`inv`);
    can_mov_bt.draggable=`true`
    const ch_button = document.createElement(`input`);
    ch_button.setAttribute(`type`, `checkbox`);
    ch_button.setAttribute(`id`, `chb_${cnt}`)
    ch_button.style.display = `none`
    const ch_button_label = document.createElement(`label`)
    ch_button_label.setAttribute(`for`,`chb_${cnt}`);
    ch_button_label.setAttribute(`class`,`ch_button`);
    const list_txt = document.createElement(`div`)
    list_txt.setAttribute(`class`,`list_txt`);
    new_todo_list.append(can_mov_bt, ch_button, ch_button_label, list_txt)
    todo_list.append(new_todo_list);
    console.log(list_txt.parentElement.firstChild)
    writing_list_txt(list_txt, ``);
    cnt++;
    
    const todo_text = list_txt.firstChild;

    todo_text.addEventListener('focusout', () => {
        new_todo_list.addEventListener(`dragstart`,(e)=>{
            console.log(e.target)
            if(e.target != can_mov_bt) e.preventDefault()
            else new_todo_list.style.background =`#333333`
        })
        new_todo_list.addEventListener(`dragend`,(e)=>{
            new_todo_list.style.background=`none`
        })
        new_todo_list.addEventListener('mouseenter', (e) => {
            const can_mov = new_todo_list.firstChild;
            can_mov.classList.remove('inv');
        });

        new_todo_list.addEventListener('mouseleave', (e) => {
            const can_mov = new_todo_list.firstChild;
            can_mov.classList.add('inv');
        });

        list_txt.addEventListener('mouseover', () => {
            list_txt.firstChild.style.background = '#EEEEEE';
            list_txt.firstChild.style.borderRadius = '2.5px';
        });

        list_txt.addEventListener('mouseout', () => {
            list_txt.firstChild.style.background = 'none';
        });
        list_txt.addEventListener('click', () => {
            const currentText = list_txt.textContent;
            writing_list_txt(list_txt, currentText);
        });
    });

    todo_text.addEventListener('keyup', function (event) {
        if (event.code == 'Enter' || event.code == 'NumpadEnter') {
            event.preventDefault();
            todo_text.blur();
        }
    });
});

function writing_list_txt(list_txt, initialText) {
    // 새로운 input 엘리먼트 생성
    const input_list_txt = document.createElement('input');
    input_list_txt.setAttribute (`type`, `text`)
    input_list_txt.setAttribute(`id`,`writen`)
    input_list_txt.value = initialText;

    const can_mov = list_txt.parentElement.firstChild;
    console.log(can_mov)
    can_mov.classList.add('inv');
    input_list_txt.style.fontSize = '16px';
    input_list_txt.style.outline = 'none';
    input_list_txt.style.border = 'none';

    list_txt.innerHTML = ``;
    list_txt.appendChild(input_list_txt);

    input_list_txt.focus();

    // input 포커스 아웃 이벤트 처리
    input_list_txt.addEventListener('focusout', () => {
        const newText = input_list_txt.value;
        const newSpan = document.createElement('span');
        newSpan.textContent = newText;
        input_list_txt.remove();
        list_txt.append(newSpan);
    });

    // Enter 키 눌렀을 때 포커스 아웃 처리
    input_list_txt.addEventListener('keyup', (event) => {
        if (event.code === 'Enter' || event.code === 'NumpadEnter') {
            event.preventDefault();
            input_list_txt.blur();
        }
    });
}
