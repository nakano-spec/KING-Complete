var express = require('express');
var router = express.Router();


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
     
});

module.exports = router;