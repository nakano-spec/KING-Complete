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
      }
});

module.exports = router;