var express = require('express');
var router = express.Router();
const mysql = require("mysql")
//このページに来たら最初に行う処理
/* GET users listing. */
router.get("/", (req, res)=> {
    res.render('account_additionMethod.ejs');
});


module.exports = router;