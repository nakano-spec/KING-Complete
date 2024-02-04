var express = require('express');
var router = express.Router();
const async = require('async');
/* GET users listing. */
router.get('/', function(req, res, next) {
  var app = req.app;
  var poolCluster = app.get('pool');
  var pool = poolCluster.of('MASTER');
  if(!req.session.user || req.session.page !== 4 || req.session.Before_page !== 3){
        res.render('login.ejs');
  }else{
    req.session.user.page = 12;
    req.session.user.Before_page = 11;
    req.session.save(function(err){
      if(err){
        console.log(err)
      }
      var name1 = req.session.user.username;
      var data ={
        name:name1
      }
        res.render('hyouji2.ejs',data);
      })
  }
});

module.exports = router;