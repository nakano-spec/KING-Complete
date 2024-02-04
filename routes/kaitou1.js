var express = require('express');
var router = express.Router();
const async = require('async');

/* GET users listing. */
router.get('/', function(req, res, next) {
    var name1 = req.query.name;

　　//app.jsの読み込み
      var app = req.app;
      //
      
      //データベース情報を読み込み
      var poolCluster = app.get("pool");
      var pool = poolCluster.of('MASTER')
      //
      //セッション情報の確認
      if(!req.session.student || req.session.studentpage !== 2 || req.session.studentBefore_page !== 1){
            res.render('login.ejs');
      }else{
        req.session.studentpage = 102
        req.session.studentBefore_page = 101;
        req.session.save(function(err){
          if(err){
            console.log(err);
          }
          var sql = "select user_ID from user_table where user_name= ?;";
          pool.getConnection(function(err,connection){
            connection.query(sql,name1,(err,result,field)=>{
              if(err){
                console.log(err);
              }
              var data ={
                name: result[0].user_ID 
              }
              res.render('kaitou.ejs',data);
            })
          })
        })
      }
});

module.exports = router;