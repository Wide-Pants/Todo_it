const express = require('express');
const path = require('path'); // path 모듈 추가

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

app.get(`/login`,(req,res)=>{
    const filePath = path.join(__dirname, '/login.html'); // 경로 수정
    res.sendFile(filePath);
})

app.post('/get-user-info', (req, res) => {
    // 여기에서 실제로 사용자 정보를 데이터베이스 등에서 가져오는 로직을 수행
    const userId = req.body.userId; // 클라이언트에서 전달한 사용자 ID
    if(userId=="example"){
        const userInfo = {
            id: userId,
            username: 'example_user',
            email: 'example@email.com',
        };
        res.json(userInfo)
    }else{
        res.status(500).send('아이디 없음!');
    }
});

app.listen(port, () => {
    console.log(`서버가 실행됩니다. 포트: ${port}`);
});
