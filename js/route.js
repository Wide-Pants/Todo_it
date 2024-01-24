const route = ()=>{
    const url = new URL(window.location.href);
    console.log(url.pathname)
    const page_length = 5
    if(url.pathname==`/cat`&& url.search.substring(0, 2)==`?=`){

        const page_num = parseInt(url.search.substring(2), 10);

        if (!isNaN(page_num)) {
            if(page_num<page_length){
                to_do_list_box.innerHTML = '';
                main_contents_zone.style.display = 'grid';
                main_homepage.style.display = 'none';
                load_list(page_num);
                return;
            }
        }
        console.error('Invalid page number format'); // 또는 다른 오류 처리 방법 사용
        return; // 오류가 발생하면 함수 종료
    }
}
window.addEventListener('hashchange', route);
window.addEventListener('DOMContentLoaded', route);
window.addEventListener(`popstate`,route)