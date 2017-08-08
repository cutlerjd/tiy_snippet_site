const express = require('express');
const router = express.Router();
const userModel = require('../models/db.js')

router.get('/',function(req,res,next){
  res.render('login')
})

router.post('/user_login',function(req,res,next){
    console.log("Posted to user_login")
    userModel.User.authenticate(req.body.username,req.body.password,function(err,result){
        if(result){
            req.session.user = req.body.username
            console.log("Hello",req.session.user)
            res.redirect('/')
        }else{
            console.log("error",err)
            console.log(req.body.username)
            res.redirect('/login')
        }
    })
    
})
router.get("/register",function(req,res,next){
    res.render('register')
})
router.post('/registration',function(req,res,next){
    if(req.body.password === req.body.passwordMatch){
        let user = new userModel.User({"username":req.body.username,"password":req.body.password})
        user.save()
        .then(function (result){
            console.log("User registered",result)
            res.redirect('/login');
        })
        .catch(function(error){
            console.log("Something's wrong",error)
            res.redirect("/register")
        })
    } else {
        res.redirect("register")
    }
})

module.exports = router;