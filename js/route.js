const route = async ()=>{
    const login = !(!localStorage.getItem('login'))//getItem 존재하면 일단 검증(아직 구현 안함)
    const url = new URL(window.location.href);
    const page_length = 4
    if(document.getElementById(`to_do_catgories`).children.length == 0)
    await load_categories()
    if(url.pathname==`/cat`&& url.search.substring(0, 6)==`?page=`){// /cat에대한 path 라우팅 적용
        const page_num = parseInt(url.search.substring(6), 10);
        console.log(url.search, page_num)
        if (!isNaN(page_num)) {
            if(page_num<page_length){
                await cat_render();
                chage_page(page_num);
                return;
            }
        }
        console.error('Invalid page number format'); // 또는 다른 오류 처리 방법 사용
        not_found_render();
    }else if(url.pathname==`/`){// 일반 패스에 대해 리다이렉팅
        if(login) {window.history.pushState(null,null,`/home`); route();}
        else {window.location.href = `/login`;}
    }else if(url.pathname==`/home`){
        page_num = -1
        home_render();
        console.log(`home loading complete`)
    }
    else{
        console.error('Invalid page number format'); // 또는 다른 오류 처리 방법 사용
        not_found_render();
    }
}

window.addEventListener(`popstate`, ()=>{route(); console.log(`DOM Loaded`)})
window.addEventListener(`DOMContentLoaded`, ()=>{route(); console.log(`DOM Loaded`)})
