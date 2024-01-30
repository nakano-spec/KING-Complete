var express = require('express');
var router = express.Router();
const mysql = require("mysql")
//このページに来たら最初に行う処理
/* GET users listing. */
router.get("/", (req, res)=> {
    const sql = "select u.user_ID,u.user_name,u.log_time,u.user_type from user_table u;"
    var app = req.app;//データベースへのログイン用
    var poolCluster = app.get("pool");
    var pool = poolCluster.of('MASTER');
    pool.getConnection(function(err,connection){
        connection.query(sql, (err, result, fields)=>{
            if(err)throw err;
            console.log(result);
            var r1 = result.length;
                console.log(result);
                console.log(r1);
            res.render("account", {ac:result}); //resultの内容をacに格納後、accountに飛ばしている。　
        })
    })
});

module.exports = router;