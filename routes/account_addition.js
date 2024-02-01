var express = require('express');
var router = express.Router();
const async = require('async');

const mysql = require("mysql")
//このページに来たら最初に行う処理
/* GET users listing. */
router.get("/", (req, res)=> {
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
    res.render('account_addition.ejs');
  }
});

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '20010426',
    database: 'mydb2'
  });
  //password
  //matosui122083

//このページに来たら最初に行う処理
/* GET users listing. */
/*router.get('/', function(req, res, next) {
  res.render('account_addition.ejs');
});*/

module.exports = router;