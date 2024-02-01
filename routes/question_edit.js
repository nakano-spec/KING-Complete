var express = require('express');
var router = express.Router();
const async = require('async');
//このページに来たら最初に行う処理
/* GET users listing. */
router.get('/', function(req, res, next) {
  var user_ID = req.query.userID;
  var user_name = req.query.userName;
  var password = req.query.password;
  var app = req.app;
  var poolCluster = app.get('pool');
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
    var sql = 'select t.role_name from user_table u,User_Role t where u.user_type = t.user_type and u.user_ID = ?;';
  pool.getConnection(function(err,connection){
    connection.query(sql,user_ID,(err,result,fields) =>{
        if(err){
            console.log(err);
        }
        var data ={
          user_ID:user_ID,
          user_name:user_name,
          pass_word:password,
          role_name:result[0].role_name
        }
        res.render('account_edit.ejs',data);
       })
       connection.release();
   })
  }  
});

module.exports = router;