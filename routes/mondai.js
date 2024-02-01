var express = require('express');
const { appendFileSync } = require('fs-extra');
var router = express.Router();
const async = require('async');

/* GET home page. */
router.get('/', function(req, res, next) {
  var app = req.app;
  //const sql = "select question_name from question_table;"  //リスト表示用SQL
  const sql = "select distinct q.question_name,g.qualification_name,g.question_genre,g.question_years from question_table q JOIN genre_table g ON q.question_id = g.question_id;"
  const poolCluster = app.get('pool');
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
    req.session.user.page = 3;
    req.session.user.Before_page = 2;
    req.session.save(function(err){
      if(err){
        console.log(err);
      }
      pool.getConnection(function(err,connection){
        if(err != null){
          console.log(err);
          return;
        }
        pool.query(sql,(err,result1,field)=>{
          if(err){
            console.log(err);
          }
          var data = {
            name:req.session.user.username,
            web:result1
          }
          res.render('mondai2',data);
        });
        connection.release();
      })
    });
  }
});


module.exports = router;