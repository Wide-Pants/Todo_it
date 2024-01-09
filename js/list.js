const addbutton = document.getElementById(`addlist`);
const todo_list = document.getElementById(`todo_list`);
const dolists = document.querySelectorAll('.do_list');
const list_DB = `{"todo_lists":[
    {"dbsghajt1":[{"id":"wacxas","checked":true,"list_txt":"지금 부터 여기는 에버튼 갤러리다."},
{"id":"wacxa2s","checked":true,"list_txt":"지금 부터 여기는 맨시티 갤러리다."},
{"id":"wacx4as","checked":false,"list_txt":"지금 부터 여기는 족구 갤러리다."}
]},{"ajtwoddl1236":[{"id":"wacxas","checked":true,"list_txt":"지금 부터 여기는 해외축구 갤러리다."},
{"id":"wacxa2s","checked":true,"list_txt":"지금 부터 여기는 맨시티 갤러리다."},
{"id":"wacx4as","checked":false,"list_txt":"지금 부터 여기는 윤하 갤러리다."}
]}]}`

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

function load_todo_lists(user_id){
    const targetKey = user_id;
    const parsed_DB = JSON.parse(list_DB);
    console.log(parsed_DB)
    const targetObject = parsed_DB.todo_lists.find(obj => obj[targetKey]);

    if (targetObject) {
        const targetValue = targetObject[targetKey];
        targetValue.forEach(element =>{
            const load_list = list_form(element.checked,element.list_txt,element.id);
            add_formalevents(load_list);
            todo_list.append(load_list);
        })
    }  
}

load_todo_lists(window.localStorage.getItem(`user_id`))
cnt = 0

function writing_list_txt(list_txt) {
    // 새로운 input 엘리먼트 생성
    const origin_list = list_txt.closest(`.do_list`);
    const input_list_txt = document.createElement('input');
    list_txt.classList.add(`writen`);
    input_list_txt.classList.add(`writen`);
    input_list_txt.setAttribute('type', 'text');
    input_list_txt.setAttribute('name', 'writen');
    input_list_txt.value = list_txt.firstChild.innerText || '';

    const can_mov = origin_list.firstChild;
    const del_btn = origin_list.lastChild;
    del_btn.classList.add('inv');
    can_mov.classList.add('inv');
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
    const new_todo_list = list_form();
    todo_list.append(new_todo_list);
    writing_list_txt(new_todo_list.children[3])
    add_formalevents(new_todo_list)
    cnt++;
}

addbutton.addEventListener('click', () => make_list());

function add_formalevents(todo_list){
    const can_mov_bt = todo_list.children[0];
    const list_txt = todo_list.children[3];
    const del_btn = todo_list.children[4];

    
    del_btn.addEventListener(`click`,(e)=>{
        if(window.confirm(`정말 삭제하시겠습니까?`))
            todo_list.remove()
    })
    can_mov_bt.addEventListener(`mouseover`,()=>{
        can_mov_bt.closest(`.do_list`).setAttribute(`draggable`,`true`)
    })
    can_mov_bt.addEventListener(`mouseout`,()=>{
        can_mov_bt.closest(`.do_list`).setAttribute(`draggable`,`false`)
    })
    list_txt.addEventListener(`dragstart`,(e)=>{
        e.preventDefault();
    })
    list_txt.addEventListener(`dragend`,(e)=>{
        e.preventDefault()
    })
    todo_list.addEventListener(`dragstart`,(e)=>{
        draggedElement = e.target.closest(`.do_list`);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', draggedElement.children[3].firstChild.innerHTML);
        draggedElement.classList.add('dragging');
    })

    todo_list.addEventListener(`dragover`, (e)=>{
            e.preventDefault();
            const dropTarget = e.target.closest('.do_list');
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
    todo_list.addEventListener(`dragleave`,(e)=>{
        const dropTarget = e.target.closest('.do_list');
        dropTarget.classList.remove('drag-over-up', 'drag-over-down');
        if(dropTarget.previousElementSibling)
        dropTarget.previousElementSibling.classList.remove('drag-over-up', 'drag-over-down');
    })
    todo_list.addEventListener(`drop`,(e)=>{
        e.preventDefault();
        const dropTarget = e.target.closest('.do_list');

            if (dropTarget && draggedElement !== dropTarget) {
                // Create a new list item
                const newItem = list_form(draggedElement.children[1].checked,e.dataTransfer.getData('text/plain'))
                
                const rect = dropTarget.getBoundingClientRect();
                const isAbove = e.clientY < rect.top + rect.height / 2;

                if (isAbove) {
                    dropTarget.before(newItem);
                    add_formalevents(newItem)
                } else {
                    dropTarget.after(newItem);
                    add_formalevents(newItem)
                }

                if(newItem.previousElementSibling)
                newItem.previousElementSibling.classList.remove('drag-over-up', 'drag-over-down');
                // Remove the original dragged element
                draggedElement.remove();
            }
            dropTarget.classList.remove('dragging', 'drag-over-up', 'drag-over-down');
            draggedElement.classList.remove('dragging', 'drag-over-up', 'drag-over-down');
            draggedElement = null;
    })
    todo_list.addEventListener('mouseenter', () => {
        if(!list_txt.classList.contains(`writen`)){
            const can_mov = todo_list.firstChild;
            const del_btn = todo_list.lastChild;
            del_btn.classList.remove('inv');
            can_mov.classList.remove('inv');
        }
    });

    todo_list.addEventListener('mouseleave', () => {
        const can_mov = todo_list.firstChild;
        const del_btn = todo_list.lastChild;
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

function list_form(isCheck=false, inText=``, num=cnt++){
    const new_todo_list = document.createElement('li');
    new_todo_list.setAttribute(`class`,`do_list`)
    const can_mov_bt = document.createElement(`div`)
    can_mov_bt.classList.add(`can_mov_bt`,`inv`);//0
    const ch_button = document.createElement(`input`);//1
    ch_button.setAttribute(`type`, `checkbox`);
    ch_button.setAttribute(`id`, `chb_${num}`)
    ch_button.style.display = `none`
    const ch_button_label = document.createElement(`label`)//2
    ch_button_label.setAttribute(`for`,`chb_${num}`);
    ch_button_label.setAttribute(`class`,`ch_button`);
    const list_txt = document.createElement(`div`);//3
    list_txt.setAttribute(`class`,`list_txt`);
    const text_ = document.createElement(`span`)
    text_.innerHTML=inText;
    list_txt.append(text_);
    ch_button.checked=isCheck;
    const del_btn = document.createElement(`div`);//4
    del_btn.classList.add(`del_btn`,`inv`)
    new_todo_list.append(can_mov_bt, ch_button, ch_button_label, list_txt,del_btn)
    return new_todo_list;
}