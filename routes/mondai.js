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
  if(req.session.user || req.session.page === 4 || req.session.Before_page === 3){
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
    });
  }else if(!req.session.user || req.session.page !== 3 || req.session.Before_page !== 2){
        res.render('login.ejs');
  }else{
    req.session.page = 4;
    req.session.Before_page = 3;
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