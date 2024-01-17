const categories = document.getElementById(`to_do_catgories`)
const main_contents_zone = document.getElementById(`main_contents_zone`)
let info_array

async function load_categories(){
    await fetch(`/info`,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(response => response.json())
    .then(targetObject => {
        info_array = targetObject
    }).catch((error) => {console.error('Error fetching user info:', error)});
    await fetch(`/list/${user_id}/`,{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(response => response.json())
    .then(targetObject => {
        targetObject.forEach(element =>{
            if(element){
                console.log(element.category_imogi,element.category_name,element.list.length)
                add_categories(element.category_imogi,element.category_name,element.list.length);
            }
        })
    }).catch((error) => {console.error('Error fetching user info:', error)});
}

load_categories()

function chage_page(imogi, name, cat_idx){
    const page_imogi = document.getElementById(`main_imogi`);
    const page_name = document.getElementById(`title`);
    const cat_info = document.getElementById(`info_text`)
    page_imogi.innerText = imogi;
    page_name.innerText = name;
    cat_info.innerHTML = info_array[cat_idx]
}

function add_categories(imogi, name, num_of_list){
    const new_category = document.createElement(`li`);
    new_category.setAttribute(`class`, `cat_list`);
    const cat_imogi = document.createElement(`span`);
    cat_imogi.setAttribute(`class`,`imogi`);
    cat_imogi.innerText=imogi;
    const cat_name = document.createElement(`span`);
    cat_name.setAttribute(`class`,`list_name`);
    cat_name.innerText=name;
    const cat_num_of_list = document.createElement(`span`);
    cat_num_of_list.setAttribute(`class`,`numofli`);
    cat_num_of_list.innerText=num_of_list;
    new_category.append(cat_imogi,cat_name,cat_num_of_list)
    categories.append(new_category)
    new_category.addEventListener(`click`, (e)=>{
        main_contents_zone.classList.remove(`not_thispage`)
        const clicked_cat = e.target.closest(`.cat_list`)
        const cat_idx = Array.from(categories.children).indexOf(clicked_cat)
        if(page_num!=cat_idx){
        to_do_list_box.innerHTML = ``;
        load_list(cat_idx)
        chage_page(imogi,name,cat_idx)
        history.pushState({ catIdx: cat_idx },`투두잇 | ${imogi+' '+name}`,`?cat/${cat_idx}`)
        }
    })
    new_category.addEventListener("mouseover", ()=>{
        element.style.backgroundColor="rgb(151, 151, 151)";
        element.childNodes[1].style.color="white"
        element.childNodes[2].style.color="white"
    })
    new_category.addEventListener("mouseout", ()=>{
        element.style.backgroundColor="#eeeeee";
        element.childNodes[1].style.color="black"
        element.childNodes[2].style.color="black"
    })
}