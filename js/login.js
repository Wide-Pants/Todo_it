const login_id_input = document.getElementById(`ID_login`)
const login_btn = document.getElementById(`login_btn`)
const login_warn = document.getElementById(`login_warn`)


async function login(){
    const userId = login_id_input.value;
    await fetch(`/get-user-info`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId : userId }),
    }).then(async response => await response.json())
    .then(userInfo => {
        console.log(userInfo)
        window.localStorage.setItem(`user_id`, userInfo.id);
        window.localStorage.setItem(`user_name`, userInfo.name);
        window.location.href = `/home`;
        login_warn.style.opacity= 0;
        window.localStorage.setItem(`login`, true);
    })
    .catch((error) => {console.error('Error fetching user info:', error);
    login_warn.innerHTML="존재하지 않는 아이디 입니다.";
    login_warn.style.opacity= 100;});
}

login_btn.addEventListener(`click`,()=> login())

login_id_input.addEventListener(`keyup`,(e)=>{
    if (e.code === 'Enter' || e.code === 'NumpadEnter'){
        login()
    }
})