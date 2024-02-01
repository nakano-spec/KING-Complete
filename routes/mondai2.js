var express = require('express');
var router = express.Router();
const mysql = require("mysql");
const async = require('async');

/* GET users listing. */
router.get('/', function(req, res, next) {
  var by = req.query.byou;
  by = Math.abs(by);
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
    const set_time = "UPDATE question_log SET limit_time  = ? WHERE question_status = 1 AND room_ID = 1;"
    var second1 = parseInt(by);
    var name1 = req.query.name;
    /*const sql1 = "select mon_ID from mondai_LIST where sentaku = '1';"
    const sql2 = "insert into time_LIST(mon_ID,time) values(?,?);"*/
    pool.getConnection(function(err,connection) {
      if(err != null){
        console.log("DB接続" + err);
        return;
      }
      connection.query(set_time,[by],(err,result,fields) =>{
        if(err){
          console.log("時間" + err);
        }
        connection.commit((err) =>{
          if(err){connection.rollback(() =>{throw console.log('error');});}
        })
      })
      console.log("追加しました。");
      connection.release();
    })
    var data1={
      byou1:by
    }
    var data1　={
      second:second1,
      name:name1
    }
    res.render('mondai3.ejs',data1);
  }
}); 

module.exports = router;