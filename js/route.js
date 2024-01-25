const route = ()=>{
    const url = new URL(window.location.href);
    console.log(url.pathname)
    const page_length = 5
    if(url.pathname==`/cat`&& url.search.substring(0, 6)==`?page=`){

        const page_num = parseInt(url.search.substring(6), 10);

        if (!isNaN(page_num)) {
            if(page_num<page_length){
                to_do_list_box.innerHTML = '';
                main_contents_zone.style.display = 'grid';
                main_homepage.style.display = 'none';
                chage_page(page_num);
                return;
            }
        }
        console.error('Invalid page number format'); // 또는 다른 오류 처리 방법 사용
        window.alert(`올바르지 않은 접근입니다.`);
        window.history.pushState(null,null,`/home`);
        route;
    }else if(url.pathname==`/home`){
        //홈접속 했을때 라우팅할 것들
    }else{
        console.error('Invalid page number format'); // 또는 다른 오류 처리 방법 사용
        window.alert(`올바르지 않은 접근입니다.`);
        window.history.pushState(null,null,`/home`);
        route;
    }
}
window.addEventListener(`popstate`,route)
