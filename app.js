const express = require('express');
const path = require('path'); // path 모듈 추가
const fs = require('fs');

const app = express();
const port = 3000;

// 정적 파일 제공할 디렉토리 설정
app.use(express.static(path.join(__dirname, '/')));
app.use(express.json());

app.get(`/`,(req,res)=>{
    return res.redirect(`/login`)
})

app.get('/home', (req, res) => {
    const filePath = path.join(__dirname, '/main.html'); // 경로 수정
    res.sendFile(filePath);
});
app.get(`/info`,(req,res)=>{
    const filePath = path.join(__dirname, 'json', `info.json`);
    const info_json = fs.readFileSync(filePath);
    const parsed_inf = JSON.parse(info_json);
    const targetObject = parsed_inf.info;
    res.send(targetObject)
})
app.get(`/list/:id`,(req,res)=>{
    const user_id = req.params.id
    const filePath = path.join(__dirname, 'json', `${user_id}_list.json`);
    const list_json = fs.readFileSync(filePath);
    const parsed_list_DB = JSON.parse(list_json);
    const targetObject = parsed_list_DB.categories
    res.send(targetObject)
})
app.get(`/list/:id/:num_of_cat`,(req,res)=>{
    const user_id = req.params.id
    const filePath = path.join(__dirname, 'json', `${user_id}_list.json`);
    const list_json = fs.readFileSync(filePath);
    const parsed_list_DB = JSON.parse(list_json);
    const targetObject = parsed_list_DB.categories[req.params.num_of_cat].list
    res.send(targetObject)
})

app.post(`/list/:id/:num_of_cat`,(req,res)=>{
    const user_id = req.params.id
    const filePath = path.join(__dirname, 'json', `${user_id}_list.json`);
    const list_json = fs.readFileSync(filePath);
    const parsed_list_DB = JSON.parse(list_json);
    const foundListIndex = parsed_list_DB.categories[req.params.num_of_cat].list.findIndex(item => item.id === req.body.id);
    if(foundListIndex == -1){
        add_element = { id: req.body.new_ID, checked: false, list_txt: req.body.list_txt }
        parsed_list_DB.categories[req.params.num_of_cat].list.push(add_element);
    }else 
        parsed_list_DB.categories[req.params.num_of_cat].list[foundListIndex].list_txt = req.body.list_txt;
    fs.writeFileSync(filePath,JSON.stringify(parsed_list_DB, null, 2))
    res.send(`ok`)
})

app.patch(`/list/:id/:num_of_cat`,(req,res)=>{
    const user_id = req.params.id
    const filePath = path.join(__dirname, 'json', `${user_id}_list.json`);
    const list_json = fs.readFileSync(filePath);
    const parsed_list_DB = JSON.parse(list_json);
    const foundListIndex = parsed_list_DB.categories[req.params.num_of_cat].list.findIndex(item => item.id === req.body.id);
    if(req.body.method == `del`){
        if (foundListIndex == -1) {
            return res.status(404)
        }
        parsed_list_DB.categories[req.params.num_of_cat].list.splice(foundListIndex, 1)
        fs.writeFileSync(filePath,JSON.stringify(parsed_list_DB, null, 2))
    }else if(req.body.method == `checked_toggle`){
        if (foundListIndex == -1) {
            return res.status(404)
        }
        parsed_list_DB.categories[req.params.num_of_cat].list[foundListIndex].checked = req.body.check_boolean;
        fs.writeFileSync(filePath,JSON.stringify(parsed_list_DB, null, 2))
    }else if(req.body.method == `chage_order`){
        const switch_element = parsed_list_DB.categories[req.params.num_of_cat].list[foundListIndex]
        parsed_list_DB.categories[req.params.num_of_cat].list.splice(foundListIndex, 1)
        parsed_list_DB.categories[req.params.num_of_cat].list.splice(req.body.index, 0, switch_element)
        fs.writeFileSync(filePath,JSON.stringify(parsed_list_DB, null, 2))
    }
    res.send(list_json)
})

app.get(`/login`,(req,res)=>{
    const filePath = path.join(__dirname, '/login.html'); // 경로 수정
    res.sendFile(filePath);
})

app.post('/get-user-info', (req, res) => {
    // 여기에서 실제로 사용자 정보를 데이터베이스 등에서 가져오는 로직을 수행
    const userId = req.body.userId; // 클라이언트에서 전달한 사용자 ID
    const filePath = path.join(__dirname, 'json', 'users.json');
    const users_json = fs.readFileSync(filePath);
    const parsed_users = JSON.parse(users_json);
    const foundUser = parsed_users.users.find(user => user.id === userId);
    if(foundUser){
        res.json(foundUser)
    }else{
        res.status(500).send('아이디 없음!');
    }
});

app.listen(port, () => {
    console.log(`서버가 실행됩니다. 포트: ${port}`);
});
