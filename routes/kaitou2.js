const express = require("express");
var router = express.Router();
const mysql = require("mysql2");
const async = require('async');
const connection = mysql.createConnection({
host: "localhost",
user: "root",
password: "20010426",
database: "mydb2"
});
connection.connect();

//password: "Bonobo09040425",
//password: "matosui122083",  

router.get("/", (req, res)=>{

//app.jsの読み込み
var app = req.app;
//

//データベース情報を読み込み
var poolCluster = app.get("pool");
var pool = poolCluster.of('MASTER')
//
if(!req.session.student || req.session.studentpage !== 102 || req.session.studentBefore_page !== 101){
          res.render('login.ejs');
    }else{
      req.session.studentpage = 103;
      req.session.studentBefore_page = 102;
      req.session.save(function(err){
            if(err){
                  console.log(err);
            }
            var name = req.query.name;
            pool.getConnection(function(err,connection){
            async.waterfall([
                  function(callback){
                        var sql2 = "select question_ID from question_log where room_ID = ? and question_status = 1;";
                        connection.query(sql2,[req.session.studentroom_ID],(err,result2,fields)=>{
                              if(err){
                                    console.log(err);
                              }
                              callback(null,result2[0].question_ID);
                        })
                  },
                  function(question_ID,callback){
                        var sql3 = "select a.type_name from answer_type a,question_table q where a.type_ID = q.type_ID and q.question_ID = ?;";
                        connection.query(sql3,[question_ID],(err,result3,fields)=>{
                              if(err){
                                    console.log(err);
                              }
                              callback(null,result3[0].type_name,question_ID);
                        })
                  },
                  function(type_name,question_ID,callback){
                  var flag = 0;
                  if(type_name == "選択"){
                        callback(null,flag,question_ID);
                  }else if(type_name == "入力"){
                        flag = 1;
                        callback(null,flag,question_ID);
                  }else{
                        flag = 2;
                        callback(null,flag,question_ID);
                  } 
                  },
                  function(flag,question_ID,callback){
                        if(flag === 0){
                              var sql4 = "select q.question_text,s.select_1,s.select_2,s.select_3,s.select_4 from question_table q,select_table s where s.question_ID = q.question_ID and q.question_ID = ?;";
                              connection.query(sql4,question_ID,(err,result4,fields)=>{
                                    if(err){
                                          console.log(err);
                                    }
                                    var data ={
                                          name:name,
                                          question_text:result4[0].question_text,
                                          select_1:result4[0].select_1,
                                          select_2:result4[0].select_2,
                                          select_3:result4[0].select_3,
                                          select_4:result4[0].select_4
                                    }
                                    res.render('kaitou2.ejs',data);
                              })

                        }else if(flag === 1){
                              var sql4 = "select question_text from question_table where question_ID = ?;";
                              connection.query(sql4,question_ID,(err,result4,fields)=>{
                                    if(err){
                                          console.log(err);
                                    }
                                    var data ={
                                          name:name,
                                          question_text:result4[0].question_text
                                    }
                                    res.render('kaitou4.ejs',data);
                              })
                        }
                  }
            ])
            })
      })
    }
})

module.exports = router;
