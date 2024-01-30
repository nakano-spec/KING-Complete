var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  var name1 = req.query.name;
  console.log(name1);
  var data ={
    name:name1
  }
  res.render('hyouji2.ejs',data);
});

module.exports = router;