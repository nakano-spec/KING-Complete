var express = require('express');
var router = express.Router();
const mysql = require("mysql");
const async = require('async');
//このページに来たら最初に行う処理
/* GET users listing. */
router.get("/", (req, res)=> {
    if(!req.session.user || req.session.page !== 2 || req.session.Before_page !== 1){
            res.render('login.ejs');
      }else{
        res.render('question_additionMethod');
      }
});


module.exports = router;