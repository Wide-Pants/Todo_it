const add_list_btn = document.getElementById(`add_list_btn`);
const to_do_list_box = document.getElementById(`to_do_list_box`);
const to_do_list = document.querySelectorAll('.to_do_list');

const user_id = window.localStorage.getItem(`user_id`);
let page_num 

async function load_list(num){
    page_num = num
    await fetch(`/list/${user_id}/${num}`,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(response => response.json())
    .then(targetObject => {
        targetObject.forEach(element =>{
            if(element){
                const load_list = list_form(element.checked,element.list_txt,element.id);
                add_formalevents_list(load_list);
                to_do_list_box.append(load_list);
            }
        })
    }).catch((error) => {console.error('Error fetching user info:', error)});
}
cnt = 0

function generateRandomString() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';
  
    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters.charAt(randomIndex);
    }
  
    return randomString;
}

to_do_list.forEach(element => {
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

function writing_list_txt(list_txt) {
    // 새로운 input 엘리먼트 생성
    const origin_list = list_txt.closest(`.to_do_list`);
    const input_list_txt = document.createElement('input');
    list_txt.classList.add(`writen`);
    input_list_txt.classList.add(`writen`);
    input_list_txt.setAttribute('type', 'text');
    input_list_txt.setAttribute('name', 'writen');
    input_list_txt.value = list_txt.firstChild.innerText || '';

    const can_move_btn = origin_list.firstChild;
    const del_btn = origin_list.lastChild;
    del_btn.classList.add('inv');
    can_move_btn.classList.add('inv');
    input_list_txt.style.fontSize = '16px';
    input_list_txt.style.outline = 'none';
    input_list_txt.style.border = 'none';

    list_txt.innerHTML = '';
    list_txt.appendChild(input_list_txt);

    input_list_txt.focus();
    // input 포커스 아웃 이벤트 처리

    input_list_txt.addEventListener('focusout', () => {
        const newText = input_list_txt.value;
        list_txt.innerHTML = `<span>${newText}</span>`;
        list_txt.classList.remove(`writen`);
        fetch(`/list/${user_id}/${page_num}`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },body: JSON.stringify({ 
                id:`${origin_list.children[1].getAttribute('id')}`, checked: origin_list.children[1].checked, list_txt: newText, new_ID: generateRandomString()
            }),
        })
    });

    // Enter 키 눌렀을 때 포커스 아웃 처리
    input_list_txt.addEventListener('keyup', (event) => {
        if (event.code === 'Enter' || event.code === 'NumpadEnter') {
            event.preventDefault();
            input_list_txt.blur();
        }
    });
}

const make_list = () => {
    const new_to_do_list = list_form();
    to_do_list_box.append(new_to_do_list);
    writing_list_txt(new_to_do_list.children[3])
    add_formalevents_list(new_to_do_list)
}

add_list_btn.addEventListener('click', () => make_list());

const add_formalevents_list = (to_do_list)=>{
    const can_mov_bt = to_do_list.children[0];
    const list_checked = to_do_list.children[1];
    const list_txt = to_do_list.children[3];
    const del_btn = to_do_list.children[4];

    list_checked.addEventListener(`change`, ()=>{
        fetch(`/list/${user_id}/${page_num}`,{
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },body: JSON.stringify({ 
                id:`${to_do_list.children[1].getAttribute('id')}`,
                method : `checked_toggle`,
                check_boolean: list_checked.checked
            }),
        }).then(res => console.log(res))
    })
    del_btn.addEventListener(`click`,()=>{
        if(window.confirm(`정말 삭제하시겠습니까?`)){
            to_do_list.remove()
            console.log(`${to_do_list.children[1].getAttribute('id')}`);
            fetch(`/list/${user_id}/${page_num}`,{
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },body: JSON.stringify({ 
                    id:`${to_do_list.children[1].getAttribute('id')}`,
                    method : `del`
                }),
            })
        }

    })
    can_mov_bt.addEventListener(`mouseover`,()=>{
        can_mov_bt.closest(`.to_do_list`).setAttribute(`draggable`,`true`)
    })
    can_mov_bt.addEventListener(`mouseout`,()=>{
        can_mov_bt.closest(`.to_do_list`).setAttribute(`draggable`,`false`)
    })
    list_txt.addEventListener(`dragstart`,(e)=>{
        e.preventDefault();
    })
    list_txt.addEventListener(`dragend`,(e)=>{
        e.preventDefault()
    })
    to_do_list.addEventListener(`dragstart`,(e)=>{
        draggedElement = e.target.closest(`.to_do_list`);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', draggedElement.children[3].firstChild.innerHTML);
        draggedElement.classList.add('dragging');
    })

    to_do_list.addEventListener(`dragover`, (e)=>{
            e.preventDefault();
            const dropTarget = e.target.closest('.to_do_list');
            if (dropTarget) {
                const rect = dropTarget.getBoundingClientRect();
                const isAbove = e.clientY < rect.top + rect.height / 2;

                dropTarget.classList.remove('drag-over-up', 'drag-over-down');
                if (isAbove) {
                    if(dropTarget!=draggedElement&&dropTarget.previousElementSibling!=draggedElement){
                    if(dropTarget.previousElementSibling)
                    dropTarget.previousElementSibling.classList.add('drag-over-down');
                    else dropTarget.classList.add(`drag-over-up`)
                    }
                } else {
                    if(dropTarget.nextElementSibling!=draggedElement&&dropTarget!=draggedElement){
                        dropTarget.classList.add('drag-over-down');
                        if(dropTarget.previousElementSibling)
                        dropTarget.previousElementSibling.classList.remove('drag-over-up', 'drag-over-down');
                    }
                }
            }
    })
    to_do_list.addEventListener(`dragleave`,(e)=>{
        const dropTarget = e.target.closest('.to_do_list');
        dropTarget.classList.remove('drag-over-up', 'drag-over-down');
        if(dropTarget.previousElementSibling)
        dropTarget.previousElementSibling.classList.remove('drag-over-up', 'drag-over-down');
    })
    to_do_list.addEventListener(`drop`,(e)=>{
        e.preventDefault();
        const dropTarget = e.target.closest('.to_do_list');

            if (dropTarget && draggedElement !== dropTarget) {
                // Create a new list item
                const newItem = list_form(draggedElement.children[1].checked,e.dataTransfer.getData('text/plain'),draggedElement.children[1].getAttribute(`id`))
                
                const rect = dropTarget.getBoundingClientRect();
                const isAbove = e.clientY < rect.top + rect.height / 2;

                if (isAbove) {
                    dropTarget.before(newItem);
                    add_formalevents_list(newItem);
                } else {
                    dropTarget.after(newItem);
                    add_formalevents_list(newItem);
                }
                draggedElement.remove();
                console.log(Array.from(to_do_list_box.childNodes).indexOf(newItem))
                console.log(newItem.children[1].getAttribute('id'))
                fetch(`/list/${user_id}/${page_num}`,{
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },body: JSON.stringify({ 
                        id:`${newItem.children[1].getAttribute('id')}`,
                        method : `chage_order`,
                        index: Array.from(to_do_list_box.childNodes).indexOf(newItem)
                    }),
                })
                if(newItem.previousElementSibling)
                newItem.previousElementSibling.classList.remove('drag-over-up', 'drag-over-down');
                // Remove the original dragged element
                draggedElement.remove();
            }
            dropTarget.classList.remove('dragging', 'drag-over-up', 'drag-over-down');
            draggedElement.classList.remove('dragging', 'drag-over-up', 'drag-over-down');
            draggedElement = null;
    })
    to_do_list.addEventListener('mouseenter', () => {
        if(!list_txt.classList.contains(`writen`)){
            const can_mov = to_do_list.firstChild;
            const del_btn = to_do_list.lastChild;
            del_btn.classList.remove('inv');
            can_mov.classList.remove('inv');
        }
    });

    to_do_list.addEventListener('mouseleave', () => {
        const can_mov = to_do_list.firstChild;
        const del_btn = to_do_list.lastChild;
        del_btn.classList.add('inv');
        can_mov.classList.add('inv');
    });

    list_txt.addEventListener('mouseenter', () => {
        if(!list_txt.classList.contains(`writen`)){
            list_txt.firstChild.style.background = '#EEEEEE';
            list_txt.firstChild.style.borderRadius = '2.5px';
        }
    });

    list_txt.addEventListener('mouseleave', () => {
        list_txt.firstChild.style.background = 'none';
    });
    list_txt.addEventListener('click', (e) => {
        if(e.target.tagName!=`INPUT`&&!list_txt.classList.contains(`writen`)){
            writing_list_txt(list_txt);
        }
    });
}

function list_form(isCheck=false, inText=``, ch_id = generateRandomString()){
    const new_to_do_list = document.createElement('li');
    new_to_do_list.setAttribute(`class`,`to_do_list`)
    const can_mov_bt = document.createElement(`div`)
    can_mov_bt.classList.add(`can_mov_bt`,`inv`);//0
    const ch_button = document.createElement(`input`);//1
    ch_button.setAttribute(`type`, `checkbox`);
    ch_button.setAttribute(`id`, `${ch_id}`)
    ch_button.style.display = `none`
    const ch_button_label = document.createElement(`label`)//2
    ch_button_label.setAttribute(`for`,`${ch_id}`);
    ch_button_label.setAttribute(`class`,`ch_button`);
    const list_txt = document.createElement(`div`);//3
    list_txt.setAttribute(`class`,`list_txt`);
    const text_ = document.createElement(`span`)
    text_.innerHTML=inText;
    list_txt.append(text_);
    ch_button.checked=isCheck;
    const del_btn = document.createElement(`div`);//4
    del_btn.classList.add(`del_btn`,`inv`)
    new_to_do_list.append(can_mov_bt, ch_button, ch_button_label, list_txt,del_btn)

    return new_to_do_list;
}