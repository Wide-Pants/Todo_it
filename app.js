const express = require('express');
const mysql = require('mysql2');
const path = require('path'); // path 모듈 추가
const fs = require('fs');
require("dotenv").config();

const app = express();
const port = 3000;
const DATA_VIEW_Query = `SELECT * FROM list_table WHERE writer='ajtwoddl1236' AND list_relationship=2 ORDER BY order_num`

// 정적 파일 제공할 디렉토리 설정
app.use(express.static(path.join(__dirname, '/')));
app.use(express.json());

const connection = mysql.createConnection({//.env파일 생성후 값 넣기 따옴표 및 등호 사용해야됨 콜론 아님 백틱 안됨
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: 3306
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
    const user_ID = req.params.id; // 클라이언트에서 전달한 사용자 ID
    const query = `SELECT category_table.category_id, category_table.category_name, category_table.category_imogi,COUNT(list_table.list_id) AS data_count
              FROM category_table LEFT JOIN list_table ON category_table.category_id = list_table.list_relationship AND list_table.writer= ?
              GROUP BY category_table.category_id, category_table.category_name ORDER BY category_table.category_id;`

    connection.query(query, [user_ID], (err, results) => {
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

app.get(`/list/:id/:num_of_cat/:date`, (req, res) => {
  const list_id = req.params.num_of_cat;
  const user_Id = req.params.id;
  const date = req.params.date;

  // ORDER BY writen_at을 추가한 쿼리
  const query = `SELECT * FROM list_table WHERE writer = ? AND writen_at = ? AND list_relationship = ? ORDER BY order_num`;
  
  connection.query(query, [user_Id, date, list_id], (err, results) => {
      if (err) {
          console.error('MySQL 쿼리 에러:', err);
          res.status(500).send('Internal Server Error');
      } else {
          res.send(results);
      }
  });
});


app.get(`/list/:id/:num_of_cat`,(req,res)=>{
  const list_id = req.params.num_of_cat;
  const user_Id = req.params.id;

  const query = `SELECT * FROM list_table WHERE writer = ? AND list_relationship = ?`;
  connection.query(query, [user_Id, list_id], (err, results) => {
    if (err) {
      console.error('MySQL 쿼리 에러:', err);
      res.status(500).send('Internal Server Error');
    } else {
          res.send(results);
    }
  });
})

app.post(`/list/:id/:num_of_cat`, (req, res) => {
    const now = new Date();
    const utcYear = now.getUTCFullYear();
    const utcMonth = now.getUTCMonth() + 1;
    const utcDate = now.getUTCDate();
    const list_id = req.body.id;
    const list_order_num = req.body.list_order_num;
    const user_Id = req.params.id;
    const cat_num = req.params.num_of_cat;
    const query = `SELECT * FROM list_table WHERE writer = ? AND list_relationship = ? AND list_id = ?`;
    let finalquery;
  
    // 첫 번째 쿼리 실행
    connection.query(query, [user_Id, cat_num, list_id], (err, results) => {
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
          finalquery = `INSERT INTO list_table (list_id, writer, list_txt, list_relationship, order_num, writen_at)
            VALUES ('${req.body.new_ID}','${user_Id}', '${req.body.list_txt}', ${req.params.num_of_cat}, ${list_order_num}, '${utcYear+"-"+(utcMonth ? `0`+ utcMonth : utcMonth) + '-' + (10>utcDate ? `0`+utcDate : utcDate)}');`;
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
    const category_id = Number(req.params.num_of_cat);
    const user_Id = req.params.id;
    const list_id = req.body.id;
    const list_order_num = req.body.index;
    let params=[list_id];
    let params2;
    let query;
    let query2;
     
    if(req.body.method == `del`){
        query = `DELETE FROM list_table WHERE list_id = ?;`
    }else if(req.body.method == `checked_toggle`){
        query = `UPDATE list_table SET checked = NOT checked WHERE list_id = ?;`
    }else if(req.body.method == `chage_order`){
        query =`UPDATE list_table AS lt1
        JOIN (
            SELECT writen_at
            FROM list_table
            WHERE list_id = ?
        ) AS subquery
        ON lt1.writen_at = subquery.writen_at
        SET lt1.order_num = lt1.order_num + 1
        WHERE lt1.order_num >= ?
        AND lt1.list_relationship = ?;`;

        query2 = `UPDATE list_table
        SET order_num = ?
        WHERE list_id = ?;`

        params = [list_id,list_order_num,category_id];      
        params2 =[list_order_num,list_id];
    }
    console.log(params)
    connection.query(query, params, (err,results) => {
        if (err) {
          console.error('MySQL 쿼리 에러:', err);
          res.status(500).send('Internal Server Error');
        }else if(query2){
          connection.query(query2, params2, (err,results) => {
            if (err) {
              console.error('MySQL 쿼리 에러:', err);
              res.status(500).send('Internal Server Error');
            }else
            connection.query(DATA_VIEW_Query, (err, results) => {
              if (err) {
                  console.error('MySQL 쿼리 에러:', err);
                  res.status(500).send('Internal Server Error');
              } else {
                  console.log(results);
                  res.send(`ok`)
              }
            })
        })
        }else{
          connection.query(DATA_VIEW_Query, (err, results) => {
          if (err) {
              console.error('MySQL 쿼리 에러:', err);
              res.status(500).send('Internal Server Error');
          } else {
              console.log(results);
              res.send(`ok`)
          }
        })
        }
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
