const express = require('express');
const mysql = require('mysql2');
const path = require('path'); // path 모듈 추가
const fs = require('fs');

const app = express();
const port = 3000;

// 정적 파일 제공할 디렉토리 설정
app.use(express.static(path.join(__dirname, '/')));
app.use(express.json());

const connection = mysql.createConnection({
    
});

connection.connect((err) => {
    if (err) {
      console.error('MySQL 연결 실패:', err);
    } else {
      console.log('MySQL 연결 성공');
    }
});

app.get(`/info`,(req,res)=>{
    const filePath = path.join(__dirname, 'json', `info.json`);
    const info_json = fs.readFileSync(filePath);
    const parsed_inf = JSON.parse(info_json);
    const targetObject = parsed_inf.info;
    res.send(targetObject)
})
app.get(`/list/:id`,(req,res)=>{
    const userId = req.params.id; // 클라이언트에서 전달한 사용자 ID
    const query = 'SELECT category_table.category_id, category_table.category_name, category_table.category_imogi,COUNT(list_table.list_id) AS data_count FROM category_table LEFT JOIN list_table ON category_table.category_id = list_table.list_relationship GROUP BY category_table.category_id, category_table.category_name ORDER BY category_table.category_id;'

    connection.query(query, (err, results) => {
      if (err) {
        console.error('MySQL 쿼리 에러:', err);
        res.status(500).send('Internal Server Error');
      } else {
        if (results.length > 0) {
            res.send(results);
        } else {
            res.status(500).send('Internal Server Error');
        }
      }
    });
})
app.get(`/list/:id/:num_of_cat`,(req,res)=>{
    const list_id = req.params.num_of_cat; // 클라이언트에서 전달한 사용자 ID
    const query = 'SELECT * FROM list_table WHERE list_relationship = ?';

    connection.query(query, [list_id], (err, results) => {
      if (err) {
        console.error('MySQL 쿼리 에러:', err);
        res.status(500).send('Internal Server Error');
      } else {
        if (results.length>0) {
            res.send(results);
        }
      }
    });
})

app.post(`/list/:id/:num_of_cat`, (req, res) => {
    const list_id = req.body.id;
    const query = `SELECT * FROM list_table WHERE list_relationship = ${req.params.num_of_cat} AND list_id = ?`;
    let finalquery;
  
    // 첫 번째 쿼리 실행
    connection.query(query, [list_id], (err, results) => {
      if (err) {
        console.error('MySQL 쿼리 에러:', err);
        res.status(500).send('뭔에러고');
      } else {
        if (results.length > 0) {
          // 이미 해당 카테고리에 해당하는 리스트가 존재하는 경우 업데이트 쿼리 생성
          finalquery = `UPDATE list_table
            SET list_txt = '${req.body.list_txt}'
            WHERE list_id = '${req.body.id}';`;
        } else {
          // 해당 카테고리에 해당하는 리스트가 없는 경우 삽입 쿼리 생성
          finalquery = `INSERT INTO list_table (list_id, list_txt, list_relationship)
            VALUES ('${req.body.new_ID}', '${req.body.list_txt}', ${req.params.num_of_cat});`;
        }
  
        // 생성된 쿼리 실행
        connection.query(finalquery, (err, results) => {
          if (err) {
            console.error('MySQL 쿼리 에러:', err);
            res.status(500).send('Internal Server Error');
          } else {
            // 쿼리 결과에 따라 적절한 응답을 보내줄 수 있음
            res.send('ok');
          }
        });
      }
    });
  });
  

app.patch(`/list/:id/:num_of_cat`,(req,res)=>{
    const category_id = req.params.num_of_cat

    console.log(req.body.method== `del`)
    let query;
    if(req.body.method == `del`){
        query = `DELETE FROM list_table WHERE list_id = '${req.body.id}';`
    }else if(req.body.method == `checked_toggle`){
        query = `UPDATE list_table SET checked = NOT checked WHERE list_id = '${req.body.id}';`
        console.log(req.body.id)
    }else if(req.body.method == `chage_order`){
        
    }
    console.log(query)
    connection.query(query, (err,results) => {
        if (err) {
          console.error('MySQL 쿼리 에러:', err);
          res.status(500).send('Internal Server Error');
        }else{res.send(`ok`)}
    });
})

app.get(`/login`,(req,res)=>{
    const filePath = path.join(__dirname, '/login.html'); // 경로 수정
    res.sendFile(filePath);
})

app.post('/get-user-info', (req, res) => {
    // 여기에서 실제로 사용자 정보를 데이터베이스 등에서 가져오는 로직을 수행
    const userId = req.body.userId; // 클라이언트에서 전달한 사용자 ID
    const query = 'SELECT * FROM USERS WHERE user_id = ?';

    connection.query(query, [userId], (err, results) => {
      if (err) {
        console.error('MySQL 쿼리 에러:', err);
        res.status(500).send('Internal Server Error');
      } else {
        if (results.length > 0) {
            console.log(JSON.stringify(results[0]));
            res.send(JSON.stringify(results[0]));
        } else {
            res.status(500).send('Internal Server Error');
        }
      }
    });
});

app.get('*', (req, res) => {
    const filePath = path.join(__dirname, `/`,'/main.html'); // 경로 수정
    res.sendFile(filePath);
});

app.listen(port, () => {
    console.log(`서버가 실행됩니다. 포트: ${port}`);
});
