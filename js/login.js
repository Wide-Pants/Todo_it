const login_id_input = document.getElementById(`ID_login`)
const login_btn = document.getElementById(`login_btn`)
const login_warn = document.getElementById(`login_warn`)

//로그인 페이지 검증
async function login() {
    const userId = login_id_input.value;
    try {
        const response = await fetch(`/get-user-info`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: userId }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const userInfo = await response.json();
        if (!userInfo) {
            throw new Error('User information not available');
        }
        console.log(userInfo);
        // Save to localStorage
        window.localStorage.setItem(`user_id`, userInfo.id);
        window.localStorage.setItem(`user_name`, userInfo.name);
        window.localStorage.setItem(`login`, true);
        // Redirect to home page
        window.location.href = `/home`;
        login_warn.style.opacity = 0;

    } catch (error) {
        console.error('Error fetching or processing user info:', error);
        // Display error message
        login_warn.innerHTML = "존재하지 않는 아이디 입니다.";
        login_warn.style.opacity = 100;
    }
}

login_btn.addEventListener(`click`,()=> login())

login_id_input.addEventListener(`keyup`,(e)=>{
    if (e.code === 'Enter' || e.code === 'NumpadEnter'){
        login()
    }
})