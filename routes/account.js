var express = require('express');
var router = express.Router();
const mysql = require("mysql");
const async = require('async');
//このページに来たら最初に行う処理
/* GET users listing. */
router.get("/", (req, res)=> {
    const sql = "select u.user_ID,u.user_name,u.log_time,u.user_type from user_table u;"
    var app = req.app;//データベースへのログイン用
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
        pool.getConnection(function(err,connection){
            connection.query(sql, (err, result, fields)=>{
                if(err)throw err;
                console.log(result);
                var r1 = result.length;
                    console.log(result);
                    console.log(r1);
                res.render("account", {ac:result}); //resultの内容をacに格納後、accountに飛ばしている。　
            })
        })
      }
});

module.exports = router;