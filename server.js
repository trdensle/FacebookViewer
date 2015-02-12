var express = require('express');
var session = require('express-session');
var passport = require('passport');
var facebookStrategy = require('passport-facebook').Strategy;

var app = express();


var port = 9998;

//middleware
app.use(session({secret: 'mySecret'}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new facebookStrategy({
  clientID: '812480178807389',
  clientSecret: 'c627ae6d89167edbe1d15f31d30610fa',
  callbackURL: 'http://localhost:9998/auth/facebook/callback'
}, function(token, refreshToken, profile, done) {
  return done(null, profile);
}));



passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


var isAuthed = function(req, res, next) {
	if(!req.isAuthenticated()) {
	return res.redirect('/failure’);
} else {
next();
	}
}


app.get('/me', isAuthed, function(req, res) {
	res.json(req.user);
})

app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback', passport.authenticate('facebook',{
	successRedirect: '/me',
	failureRedirect: '/failure',
	}
))




app.listen(port, function() {
	console.log('Now listening on 9998')