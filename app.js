const express = require('express')
const app = express()
const path = require('path')
const mustacheExpress = require('mustache-express');
const indexRouter = require('./routes/indexRoute')
const aboutRouter = require('./routes/aboutRoute')
const loginRouter = require('./routes/loginRoute')
const session = require('express-session')
const bodyParser = require('body-parser')
const passport = require('passport'),
 LocalStrategy = require('passport-local').Strategy;
const dbModel = require('./models/db.js')
const flash = require('express-flash-messages');

//Passport necessary code

//Basic body parser settings

app.use(bodyParser.urlencoded({ extended: false }))

//Rendering with mustache
app.engine('mustache', mustacheExpress());
app.set('views', './views')
app.set('view engine', 'mustache')

//Used for session managment
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

passport.use(new LocalStrategy(
    function(username, password, done) {
        dbModel.User.authenticate(username, password, function(err, user) {
          console.log("Hello")
            if (err) {
                return done(err)
            }
            if (user) {
                return done(null, user)
            } else {
                return done(null, false, {
                    message: "There is no user with that username and password."
                })
            }
        })
    }));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});
//Allows for a static directory for hosting CSS and other files
app.use(express.static(path.join(__dirname, 'static')))



//Use the routes files.
app.use('/',authenticationMiddleware, indexRouter);
app.get('/login/', function(req, res) {
    res.render("login", {
        messages: res.locals.getMessages()
    });
});

app.post('/login/', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login/',
    failureFlash: true
}))
app.use('/about', authenticationMiddleware, aboutRouter);
//app.use('/login', loginRouter);

app.listen(3000, function(){
  console.log("App running on port 3000")
})


function authenticationMiddleware () {  
	return (req, res, next) => {
		console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);

	    if (req.isAuthenticated()) return next();
	    res.redirect('/login')
	}
}