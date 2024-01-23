const route = ()=>{
    const url = new URL(window.location.href);
    console.log(url.pathname)
    if(url.pathname==`/cat`){
        switch(url.search){
            case '?=3':
                to_do_list_box.innerHTML = ``;
                main_contents_zone.style.display = `grid`;
                main_homepage.style.display = `none`;
                load_list(3)
            }
    }
}

window.addEventListener('hashchange', route);
window.addEventListener('DOMContentLoaded', route);