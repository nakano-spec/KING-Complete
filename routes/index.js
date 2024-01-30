var express = require('express');
var router = express.Router();
const mysql = require("mysql");
const async = require('async');


/* GET home page. */
router.get('/',function(req, res, next) {
  var app = req.app;
  var poolCluster = app.get('pool');
  var pool = poolCluster.of('MASTER');
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
});

module.exports = router;
