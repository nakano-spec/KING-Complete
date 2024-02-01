var express = require('express');
var router = express.Router();
const mysql = require("mysql");
const async = require('async');
//mysqlに接続する際のデータを入れ、接続できるようにする。
/*const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "20021225",
    database: "mydb"
});*/

/* GET users listing. */
router.get('/', function(req, res, next) {
   var data1 = req.query.data
   var app = req.app;
   var poolCluster = app.get("pool");
   var pool = poolCluster.of('MASTER');
   if(!req.session.user || req.session.page !== 2 || req.session.Before_page !== 1){
    var select1 = "select u.user_name from room_table r, user_table u where r.user_ID = u.user_ID;"
    async.waterfall([
      function(callback){
          pool.getConnection(function(err,connection){
            connection.query(select1,(err,result,fields)=>{
              if(err){
                console.log(err);
              }
              callback(null,result);
            })
          });
      }
      ],
      function(err,results){
        res.render('login.ejs',{data:results});
      }); 
  }else{
    var sql4 = "select u.user_name,k.answer from answer_table k,user_table u where u.user_ID = k.user_ID and u.user_ID = ?;"
    pool.getConnection(function(err,connection){
     connection.query(sql4,data1,(err,result,fields) =>{
         var data ={
             user_ID:data1,
             user_name:result[0].user_name,
             answer:result[0].answer
         }
         res.render('hyouji3',data);
        })
        connection.release();
    })
  }
});

module.exports = router;