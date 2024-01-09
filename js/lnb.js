const hide_button = document.getElementById('fade-in');
const seek_button = document.getElementById('fade-out');
const lnb = document.getElementById('left-menu');
const top_menu = document.getElementById('top-menu');
const id = document.getElementById('Identifier');
const users_json=`{"users":[{"id":"dbsghajt1", "name":"YunHo Kang", "score":64},
{"id":"ajtwoddl1236", "name":"Yu Kang", "score":24}]
}`


function load_name(user_id){
    const parsed_users = JSON.parse(users_json);
    const targetId = user_id;
    console.log(parsed_users)
    const foundUser = parsed_users.users.find(user => user.id === targetId);
if (foundUser) {
    id.innerText = foundUser.name;    
} else {
    id.innerText = `오류입니다.`
}
}

const user_id_input = window.localStorage.getItem(`user_id`)
load_name(user_id_input)

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