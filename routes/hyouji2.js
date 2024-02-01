const express = require("express");
var router = express.Router();
const mysql = require("mysql");
const async = require('async');

/* GET users listing. */
router.get('/', function(req, res, next) {
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
    var sql = 'select u.username,k.kai,k.result from answer_table k,users u where k.user_ID = u.user_ID;'
   var username = req.query.username;
   var sql = 'select room_ID from room_table where user_ID =?;'
   //connection.query(sql,username,(err,results,fields)=>{
    //res.render('hyouji4',{han1:results});
   //})
   pool.getConnection(function(err,connection){
  
   //myoujin
   /*connection.query(s,(err,results,fields)=>{
    res.render('hyouji4',{han1:results});
   })
   connection.release();*/
      async.waterfall([
         function(callback){
            connection.query(sql,username,(err,result,field)=>{
              if(err){
                 console.log(err);
              }
              callback(null,username,result[0].room_ID);
            }) 
         },
         function(username,roomID,callback){ 
             var sql2 = "select question_ID from question_log where room_ID = ? and question_status = 1;";
             connection.query(sql2,roomID,(err,result2,field)=>{
                 if(err){
                     console.log(err);
                 }
                 callback(null,username,roomID,result2[0].question_ID);
             })
         },
         function(username,roomID,questionID,callback){
             console.log(roomID,questionID);
             var sql3 = "select distinct a.user_ID,u.user_name,a.answer,a.result from answer_table a,user_table u,question_log q where a.user_ID = u.user_ID and a.question_ID = q.question_ID and q.room_ID = ? and a.question_ID = ?;";
             connection.query(sql3,[roomID,questionID],(err,result3,field)=>{
                 if(err){
                     console.log(err);
                 }
                 res.render('hyouji4',{han1:result3});
               })
         }
     ],
     function(err){
         res.render('hyouji2');
     })
   })
  }
});

module.exports = router;