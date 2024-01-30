const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    var app = req.app;
    var QuestionSql = 'SELECT question_name, question_text FROM question_table;';
    var poolCluster = app.get('pool2');
    var pool = poolCluster.of('MASTER');

    //dbと接続できたか
    pool.getConnection(function(err1, connection) {
        if (err1) {
            console.error("DB connection error:", err1);
            res.status(500).send("Database connection error");
            return;
        }

        //表示
        connection.query(QuestionSql,(err2, results) => {
            

            if (err2) {
                console.error("Query error:", err2);
                res.status(500).send("Database query error");
                return;
            }
            // クエリの結果をビューに渡す
            res.render('Question_manage', { questions: results });
        });
        
        //削除

       /* connection.query(QuestionDelete,(err3, results2) => {
            if (err3) {
                console.error("Query error:", err3);
                res.status(500).send("Database query error");
                return;
            }
            
        });*/

        router.post('/delete', (req, res) => {
            var app = req.app;
            var pool = app.get('pool2').of('MASTER');
            var selectedQuestions = req.body.selectedQuestions;
        
            if (!selectedQuestions) {
                return res.redirect('/Question_manage'); // 選択された問題がない場合
            }
            if (typeof selectedQuestions === 'string') {
                selectedQuestions = [selectedQuestions]; // 単一選択の場合、配列に変換
            }
        
            var deleteSql = 'DELETE FROM question_table WHERE question_name IN (?);';
            /*var QuestionDelete = 'DELETE FROM question_table WHERE question_name = selectedQuestions;';
            pool.query(deleteSql, [selectedQuestions], (err3) => {
                if (err3) {
                    console.error("Delete query error:", err3);
                    return res.status(500).send('Database delete query error');
                }
                res.redirect('/Question_manage'); // 削除後に元のページにリダイレクト
            });*/
            var deleteRelatedSql = 'DELETE FROM correct_table WHERE question_ID IN (SELECT question_ID FROM question_table WHERE question_name IN (?));';
            pool.query(deleteRelatedSql, [selectedQuestions], (err) => {
                if (err) {
                    // エラー処理
                    return;
                }
                // 続いて question_table から削除
                pool.query(deleteSql, [selectedQuestions], (err) => {
                    // 削除処理の続き
                });
            });





        });
        
        connection.release(); // コネクションをリリース
    });
});


module.exports = router;