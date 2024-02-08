function cal_update(element, today=new Date()){
    const calender_zone = element.closest(`#calender_zone`);
    const calender_modal = calender_zone.lastChild;
    let year = today.getFullYear(); // 년도
    let month = today.getMonth();  // 월
    let date = today.getDate();  // 날짜
    let date_txt = `${year + '.' + (10>month+1 ? `0`+ (month+1) : (month+1)) + '.' + (10>date ? `0`+date : date)}`
    element.innerText = date_txt;
    calender_modal.innerText = today;
}