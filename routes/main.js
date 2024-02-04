var express = require('express');
const { appendFileSync } = require('fs-extra');
var router = express.Router();
const mysql = require("mysql");
const async = require('async');

/* GET home page. */
router.get('/', function(req, res) {
  var app = req.app;
  var poolCluster = app.get('pool');
  var pool = poolCluster.of('MASTER');
  if(!req.session.user || req.session.page !== 2 || req.session.Before_page !== 1){
        res.render('login.ejs');
  }else{
    res.render('main',{name:req.session.user.username});
  }
});


module.exports = router;