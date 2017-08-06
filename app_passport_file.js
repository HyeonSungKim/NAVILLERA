var express = require('express');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var bodyParser = require('body-parser');
var bkfd2Password = require("pbkdf2-password");
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
//var FacebookStrategy = require('passport-facebook').Strategy;
var hasher = bkfd2Password();

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: '1234DSFs@adf1234!@#$asd',
  resave: false,
  saveUninitialized: true,
  store:new FileStore()
}));
app.use(passport.initialize());
app.use(passport.session());
app.get('/count', function(req, res){
  if(req.session.count) {
    req.session.count++;
  } else {
    req.session.count = 1;
  }
  res.send('count : '+req.session.count);
});
app.get('/auth/logout', function(req, res){
  req.logout();
  req.session.save(function(){
    res.redirect('/welcome');
  });
});
app.get('/welcome', function(req, res){
  if(req.user && req.user.displayName) {
    res.send(`
      <h1>Hello, ${req.user.displayName}</h1>
      <a href="/auth/logout">logout</a>
    `);
  } else {
    res.send(`
      <h1>Welcome</h1>
      <ul>
        <li><a href="/auth/login">Login</a></li>
        <li><a href="/auth/register">Register</a></li>
      </ul>
    `);
  }
});

//done(null, user); 실행 되었을때 수행되는 콜백함수
passport.serializeUser(function(user, done) {
  console.log('serializeUser', user);
  done(null, user.authId); //user 내에 있는 값중 식별하여 세션에 저장
});
passport.deserializeUser(function(id, done) {
  console.log('deserializeUser', id);
  for(var i=0; i<users.length; i++){
    var user = users[i];
    if(user.authId === id){ //user정보중 현재 로그인한 id에 대한정보라면
      return done(null, user);
    }
  }
  done('There is no user.');
});
//자체인증 미들웨어 설정
passport.use(new LocalStrategy(
  function(username, password, done){ // 인자로 전달되기 때문에
    var uname = username;             // req.body.username 으로 하지않아도 됨
    var pwd = password;
    for(var i=0; i<users.length; i++){
      var user = users[i];
      if(uname === user.username) { //일치하는 이름이 있는가
        return hasher({password:pwd, salt:user.salt}, function(err, pass, salt, hash){
          if(hash === user.password){
            console.log('LocalStrategy', user);
            done(null, user); //로그인 성공
          } else {
            done(null, false); //로그인 실패
          }
        });
      }
    }
    done(null, false);  //일치하는 이름이 없으면
  }
));

// passport.use(new FacebookStrategy({
//     clientID: '1602353993419626',
//     clientSecret: '232bc1d3aca2199e6a27eb983e602e0b',
//     callbackURL: "/auth/facebook/callback",
//     profileFields:['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified', 'displayName']
//   },
//   function(accessToken, refreshToken, profile, done) {
//     console.log(profile);
//     var authId = 'facebook:'+profile.id;
//     for(var i=0; i<users.length; i++){
//       var user = users[i];
//       if(user.authId === authId){
//         return done(null, user);
//       }
//     }
//     var newuser = {
//       'authId':authId,
//       'displayName':profile.displayName,
//       'email':profile.emails[0].value
//     };
//     users.push(newuser);
//     done(null, newuser);
//   }
// ));

app.post(
  '/auth/login',
  passport.authenticate( //passport의 authenticate라는 미들웨어가 받음
    'local',  //자체인증
    {
      successRedirect: '/welcome',  //성공시 경로
      failureRedirect: '/auth/login', //실패시 경로
      failureFlash: false
    }
  )
);
app.get(
  '/auth/facebook',
  passport.authenticate(
    'facebook', //페이스북 인증
    {scope:'email'}
  )
);
app.get(
  '/auth/facebook/callback',  //인증정보가 보유되는곳
  passport.authenticate(
    'facebook',
    {
      successRedirect: '/welcome',
      failureRedirect: '/auth/login'
    }
  )
);
var users = [
  {
    authId:'local:egoing',
    username:'egoing',
    password:'mTi+/qIi9s5ZFRPDxJLY8yAhlLnWTgYZNXfXlQ32e1u/hZePhlq41NkRfffEV+T92TGTlfxEitFZ98QhzofzFHLneWMWiEekxHD1qMrTH1CWY01NbngaAfgfveJPRivhLxLD1iJajwGmYAXhr69VrN2CWkVD+aS1wKbZd94bcaE=',
    salt:'O0iC9xqMBUVl3BdO50+JWkpvVcA5g2VNaYTR5Hc45g+/iXy4PzcCI7GJN5h5r3aLxIhgMN8HSh0DhyqwAp8lLw==',
    displayName:'Egoing'
  }
];
app.post('/auth/register', function(req, res){
  hasher({password:req.body.password}, function(err, pass, salt, hash){
    var user = {
      authId:'local:'+req.body.username,
      username:req.body.username,
      password:hash,
      salt:salt,
      displayName:req.body.displayName
    };
    users.push(user);
    req.login(user, function(err){
      req.session.save(function(){
        res.redirect('/welcome');
      });
    });
  });
});
app.get('/auth/register', function(req, res){
  var output = `
  <h1>Register</h1>
  <form action="/auth/register" method="post">
    <p>
      <input type="text" name="username" placeholder="username">
    </p>
    <p>
      <input type="password" name="password" placeholder="password">
    </p>
    <p>
      <input type="text" name="displayName" placeholder="displayName">
    </p>
    <p>
      <input type="submit">
    </p>
  </form>
  `;
  res.send(output);
});
app.get('/auth/login', function(req, res){
  var output = `
  <h1>Login</h1>
  <form action="/auth/login" method="post">
    <p>
      <input type="text" name="username" placeholder="username">
    </p>
    <p>
      <input type="password" name="password" placeholder="password">
    </p>
    <p>
      <input type="submit">
    </p>
  </form>
  <a href="/auth/facebook">facebook</a>
  `;
  res.send(output);
});
app.listen(9000, function(){
  console.log('Connected 9000 port!!!');
});
