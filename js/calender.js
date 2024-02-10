
function cal_update(calender_zone, today=new Date()){
    const date_display = calender_zone.children[0].children[1];
    const calender_modal = calender_zone.children[1];
    now=today;
    let year = today.getFullYear(); // 년도
    let month = today.getMonth();  // 월
    let date = today.getDate();  // 날짜
    let date_txt = `${year + '.' + (10>month+1 ? `0`+ (month+1) : (month+1)) + '.' + (10>date ? `0`+date : date)}`
    date_display.innerText = date_txt;
    generateCalendar(calender_modal,year,month,today)
}

function generateCalendar(element, year, month, today) {
    const firstDay = new Date(year, month, 1);
    const previous_last_week = new Date(year, month, 1-firstDay.getDay());
    const lastDay = new Date(year, month + 1, 0);
    const totalDays = lastDay.getDate();

    element.innerHTML = '';
    let last_dates=previous_last_week.getDate();
    let date_cnt = 1;
    const calender=document.createElement(`div`)
    calender.setAttribute(`id`,`calender`)
    const calender_yyyymm=document.createElement(`div`)
    calender_yyyymm.setAttribute(`id`,`calender_year_month`)
    calender_yyyymm.textContent= year+"년  "+(month+1)+"월";

    const days = document.createElement(`div`)
    days.setAttribute(`id`,'days')
    const days_name = "일월화수목금토"
    for(let k = 0; k < 7; k++){
        const sample_div = document.createElement(`div`);
        sample_div.classList.add(`days_name`);
        sample_div.textContent = days_name[k];
        if(k==0) sample_div.style.color = `red`;
        if(k==6) sample_div.style.color = `blue`;
        days.append(sample_div)
    }

    calender.append(calender_yyyymm, days)
    for (let i = 0; i < 6; i++) {
        const week = document.createElement('div');
        week.classList.add('week')
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < firstDay.getDay()) {
                const date = document.createElement('div');
                date.classList.add(`other_month_date`,`date`);
                date.textContent=last_dates;
                date.addEventListener(`click`,()=>{
                    cal_update(element.parentNode, new Date(year,month-1,date.innerText))
                    load_list(2);
                })
                week.appendChild(date);
                last_dates++;
            } else if (date_cnt > totalDays) {
                if(date_cnt <= 6-lastDay.getDay()+totalDays)
                for(let k = 0; k < 6-lastDay.getDay(); k++){
                    const date = document.createElement('div');
                    date.textContent = k+1;
                    date.classList.add(`other_month_date`,`date`);
                    if (year === today.getFullYear() && month === today.getMonth() && date === today.getDate()) {
                        date.classList.add('today');
                    }
                    date.addEventListener(`click`,()=>{
                        cal_update(element.parentNode, new Date(year,month+1,date.innerText))
                        load_list(2);
                    })
                    week.appendChild(date);
                    date_cnt++;
                }
                break;
            } else {
                const date = document.createElement('div');
                date.textContent = date_cnt;
                date.classList.add(`date`);
                if(new Date(year,month,date_cnt).getDay()==0) date.style.color = `red`;
                if(new Date(year,month,date_cnt).getDay()==6) date.style.color = `blue`;
                if (year === today.getFullYear() && month === today.getMonth() && date_cnt === today.getDate()) {
                    date.classList.add('today');
                }
                date.addEventListener(`click`,()=>{
                    cal_update(element.parentNode, new Date(year,month,date.innerText))
                    load_list(2);
                })
                week.appendChild(date);
                date_cnt++;
            }
        }
        calender.appendChild(week);
    }
    element.appendChild(calender)
}