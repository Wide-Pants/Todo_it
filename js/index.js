//라우팅 기본이 되는 html 뿌리기
function home_render(){
    if(!document.body.children[2].getAttribute(`type`)&&document.body.children[2].getAttribute(`type`)!="text/javascript"){
        document.body.children[2].remove();
    }
    const homeContainer = document.createElement("div");
    homeContainer.setAttribute("id", "home_container");

    // 첫 번째 하위 요소
    const nameTitle = document.createElement("div");
    nameTitle.setAttribute("id", "name_title");
    nameTitle.innerHTML =`<span class="user_name"></span> 님 반가워요`;

    const subTitle = document.createElement("div");
    subTitle.setAttribute("id", "sub_title");
    subTitle.innerText = `오늘의 할 일 리스트에요`
    homeContainer.append(nameTitle,subTitle)

    for(i=0; i<4; i++){
        const hash = i
        const CatBox = document.createElement("div");
        CatBox.classList.add("cat_boxex");

        const NameDiv = document.createElement("div");
        NameDiv.classList.add("main_cat_name");
        
        NameDiv.addEventListener(`click`,()=>{
            history.pushState(null,null,`/cat?page=${hash}`)
            route()
        })

        let cnt = 0;
        const mainToDoBoxUl = document.createElement("ul");
        mainToDoBoxUl.classList.add("main_to_do_box");
        fetch(`/list/${user_id}/${hash}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(response => response.json())
        .then(targetObject => {
            console.log(targetObject)
            targetObject.forEach(element =>{
                console.log(`load list${hash}\n`,`/list/${user_id}/${hash}`, cnt)
                if(element&&cnt<2&&!element.checked){
                    const load_list = list_form(element.checked,element.list_txt,element.list_id,hash);
                    mainToDoBoxUl.append(load_list);
                    cnt++;
                }
            });
        }).catch((error) => {console.error('Error fetching user info:', error)});
        CatBox.append(NameDiv,mainToDoBoxUl);
        homeContainer.append(CatBox)
    }

    homeContainer.children[2].setAttribute("id", "first_cat_box");
    homeContainer.children[3].setAttribute("id", "second_cat_box");
    homeContainer.children[4].setAttribute("id", "third_cat_box");
    homeContainer.children[5].setAttribute("id", "fourth_cat_box");
    homeContainer.children[2].firstChild.setAttribute("id", "first_name");
    homeContainer.children[3].firstChild.setAttribute("id", "second_name");
    homeContainer.children[4].firstChild.setAttribute("id", "third_name");
    homeContainer.children[5].firstChild.setAttribute("id", "fourth_name");
    homeContainer.children[2].firstChild.innerText = `매일 할 일`
    homeContainer.children[3].firstChild.innerText = `마감이 얼마 남지 않은 일`
    homeContainer.children[4].firstChild.innerText = `오늘 해야 할 일`
    homeContainer.children[5].firstChild.innerText = `밀린 일`

    const wishDiv = document.createElement("div");
    wishDiv.setAttribute("id", "wish");
    const wishInfoDiv = document.createElement("div");
    wishInfoDiv.setAttribute("id", "wish_info");
    wishInfoDiv.innerHTML = `<span class="user_name"style="font-weight : 700"></span>님의<br>위시리스트 입니다`
    wishDiv.append(wishInfoDiv);

    const friendsScoreDiv = document.createElement("div");
    friendsScoreDiv.setAttribute("id", "friends_score");
    const fsInfoDiv = document.createElement("div");
    fsInfoDiv.setAttribute("id", "f_s_info");
    fsInfoDiv.textContent = "친구들의 점수에요";
    friendsScoreDiv.append(fsInfoDiv);

    homeContainer.append(wishDiv,friendsScoreDiv);
    document.body.insertBefore(homeContainer,document.body.lastChild);

    Array.from(document.getElementsByClassName(`user_name`)).forEach(element => {
        element.innerText = localStorage.getItem(`user_name`);
    });
  

    return true;
}
let now = new Date();
function cat_render(){
    if(!document.body.children[2].getAttribute(`type`)&&document.body.children[2].getAttribute(`type`)!="text/javascript"){
        document.body.children[2].remove();
    }
    
    const mainContentsZone = document.createElement("div");
    mainContentsZone.setAttribute("id", "main_contents_zone");
    const url = new URL(window.location.href);

    if(parseInt(url.search.substring(6), 10)==2){
        mainContentsZone.classList.add(`add_calender`)
        const calender_zone = document.createElement("div");
        calender_zone.setAttribute("id", "calender_zone");
        const calender_btn = document.createElement("div");

        const date_display = document.createElement("div");
        date_display.setAttribute("id", "date_display");
        const date_dec_btn = document.createElement("div");
        date_dec_btn.setAttribute("id", "dec_date");
        date_dec_btn.innerText = `<<`
        const date_inc_btn = document.createElement("div");
        date_inc_btn.setAttribute("id", "inc_date");
        date_inc_btn.innerText = `>>`

        
        const calender_modal = document.createElement("div");
        calender_modal.setAttribute("id", "calender_modal");
        calender_modal.classList.add(`display_none`)

        calender_btn.append(date_dec_btn,date_display,date_inc_btn);
        calender_zone.append(calender_btn);
        calender_zone.append(calender_modal);
        mainContentsZone.append(calender_zone);

        cal_update(calender_zone)

        date_dec_btn.addEventListener(`click`, ()=>{cal_update(calender_zone, new Date(now.setDate(now.getDate() - 1)));load_list(2);})
        date_inc_btn.addEventListener(`click`, ()=>{cal_update(calender_zone, new Date(now.setDate(now.getDate() + 1)));load_list(2);})

        date_display.addEventListener(`click`,()=>{
            calender_modal.classList.toggle(`display_none`)
            calender_modal.classList.toggle(`display_block`)
        })
    }
    else
        mainContentsZone.classList.add(`no_cal`)

    const mainImogi = document.createElement("div");
    mainImogi.setAttribute("id", "main_imogi");

    const titleDiv = document.createElement("div");
    titleDiv.setAttribute("id", "title");

    const infoDiv = document.createElement("div");
    infoDiv.setAttribute("id", "info");

    const infoTextDiv = document.createElement("div");
    infoTextDiv.setAttribute("id", "info_text");
    infoDiv.append(infoTextDiv);

    const mainContentsBoxDiv = document.createElement("div");
    mainContentsBoxDiv.setAttribute("id", "main_contents_box");

    const toDoListBoxUl = document.createElement("ul");
    toDoListBoxUl.setAttribute("id", "to_do_list_box");

    const addListBtnDiv = document.createElement("div");
    addListBtnDiv.setAttribute("id", "add_list_btn");
    addListBtnDiv.innerText =`+ 리스트를 추가하세요.`

    mainContentsZone.append(mainImogi,titleDiv, infoDiv, mainContentsBoxDiv);
    mainContentsBoxDiv.appendChild(toDoListBoxUl);
    mainContentsBoxDiv.appendChild(addListBtnDiv);
    document.body.insertBefore(mainContentsZone,document.body.lastChild);

    return true;
}

function not_found_render(){
    if(!document.body.children[2].getAttribute(`type`)&&document.body.children[2].getAttribute(`type`)!="text/javascript"){
        document.body.children[2].remove();
    }
    const errContainer = document.createElement("div");
    const err_info = document.createElement(`div`);
    err_info.innerText = `404 Not Found`
    
    const home_btn = document.createElement(`input`);
    home_btn.setAttribute(`type`,`button`);
    home_btn.value = "홈페이지로 이동";
    
    errContainer.append(err_info, home_btn)
    home_btn.addEventListener(`click`,()=>{
        window.history.pushState(null,null,`/home`);
        route();
    })
    document.body.insertBefore(errContainer,document.body.lastChild);
}