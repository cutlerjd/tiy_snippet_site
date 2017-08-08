const express = require('express');
const router = express.Router();

router.get('/', function (req, res) {
  console.log("index says hello",req.session.user)
  res.render("index", {appType : "Express"});
});

module.exports = router;