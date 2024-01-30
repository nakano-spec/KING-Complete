const express = require("express");
var router = express.Router();
const mysql = require("mysql");
const { route } = require(".");
const async = require('async');
//mysqlに接続する際のデータを入れ、接続できるようにする。

router.get("/", (req, res)=>{
    var app = req.app;
    var name1 = req.query.name;
    var name1 = req.session.user.username;
    var poolCluster = app.get('pool');
    var pool = poolCluster.of('MASTER');
    /*const sql = "select mon_ID,mondaibun from mondai_LIST where sentaku = '1';"
    const sql2 = "select time from time_LIST where mon_ID = ?"*/
    const sql3 = "select m.question_ID,m.question_text,m.picturename,t.time from mondai_LIST m,time_LIST t where sentaku = '1' and m.mon_ID = t.mon_ID";
    const sql4 = "select question_log.question_ID,question_text,picture_flag from question_table,question_log where question_log.question_ID=question_table.question_ID AND question_status = 1 AND room_ID = 1;"
    const pics_sql = "select pics_name from pics_table WHERE question_ID = ?;"
    /*var bun = 0;
    var name1 = 0;
    var time1 = 0;*/
    //const sql = "select room_ID from login_log where user_ID = ?;";
    pool.getConnection(function(err,connection){
        //connection.query(sql4,(err,result2,fields)=>{
            async.waterfall([
                function(callback){
                    /*for(var i = 0;i < result2.length;i++){
                        if(result2[i].sentaku == 1){
                         connection.query(pics_sql,(err,result,fields)=>{
                         if(err){
                             console.log(err);
                         }
                         res.render('index',{web:result});
                        })
                    }*/
                    connection.query(sql,name1,(err,result,field)=>{
                     if(err){
                        console.log(err);

                     }
                     console.log(result[0].room_ID);
                     callback(null,result[0].room_ID);
                   }) 
                },
                function(roomID,callback){ 
                    var sql2 = "select question_ID from question_log where room_ID = ?;";
                    var sql2 = "select question_ID from question_log where room_ID = ? and question_status = 1;";
                    connection.query(sql2,roomID,(err,result2,field)=>{
                        if(err){
                            console.log(err);
                        }
                        console.log(result2[0].question_ID);
                        callback(null,roomID,result2[0].question_ID);
                        if(result2 && result2.length > 0){
                            console.log(result2[0].question_ID);
                            callback(null,roomID,result2[0].question_ID);
                        }else{
                            res.render('hyouji2');
                        }
                    })
                },
                function(roomID,questionID,callback){
                    var sql3 = "select pics_name from pics_table where question_ID = ?;";
                    connection.query(sql3,questionID,(err,result3,field)=>{
                        if(err){
                            console.log(err);
                        }
                        if(result3.length == 0){
                            var result = 0;
                            callback(null,roomID,questionID,result);
                        }else{
                            var result = result3[0].pics_name;
                            callback(null,roomID,questionID,result);
                        }
                    })
                },
                function(roomID,questionID,result,callback){
                    if(result == 0){
                        var sql4 = "select q.question_text,l.limit_time from question_table q,question_log l where q.question_ID = l.question_ID and l.question_ID = ? and l.room_ID = ?;";
                        connection.query(sql4,[questionID,roomID],(err,result4,field)=>{
                            if(err){
                                console.log(err);
                            }
                            var data ={
                                text:result4[0].question_text,
                                time:result4[0].limit_time,
                                picture:result
                            }
                            res.render('index',data);
                        })
                    }else{
                        var sql4 = "select q.question_text,l.limit_time from question_table q,question_log l where q.question_ID = l.question_ID and l.room_ID = ? and l.question_ID = ?;";
                        connection.query(sql4,[roomID,questionID],(err,result4,field)=>{
                            if(err){
                                console.log(err);
                            }
                            var data ={
                                text:result4[0].question_text,
                                time:result4[0].limit_time,
                                picture:result
                            }
                            res.render('index',data);
                        })
                    }
                }
            ],
            function(err){
                res.render('hyouji2');
            })
            /*for(var i = 0;i < result2.length;i++){
               if(result2[i].sentaku == 1){
                connection.query(sql3,(err,result,fields)=>{
                if(err){
                    console.log(err);
                }
                res.render('index',{web:result});
               })
               }
            }
            res.render('hyouji2');*/
        //})
        //connection.release();
    })
})


module.exports = router;