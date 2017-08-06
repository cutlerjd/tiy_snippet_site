const express = require('express');
const router = express.Router();
const userModel = require('../models/db.js')

router.get('/',function(req,res,next){
  res.render('login')
})

router.post('/user_login',function(req,res,next){
    userModel.User.authenticate(req.body.username,req.body.password,console.log)
    res.redirect('/login')
})

module.exports = router;