var express = require('express');
var router = express.Router();
const async = require('async');
/* GET users listing. */
router.get('/', function(req, res, next) {
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
    var name1 = req.session.user.username;
    var data ={
      name:name1
    }
    res.render('hyouji2.ejs',data);
  }
});

module.exports = router;