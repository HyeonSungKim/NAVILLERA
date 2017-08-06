//  모듈추출
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
//서버생성
var app = express();
//미들웨어 사용
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ //session setting
  secret: '123abc!@#',
  resave: false,
  saveUninitialized: true //session id를 실제로 사용하기 전까지 사용하지마라
}));
//라우터
app.get('/count', function(req, res){
  if(req.session.count) {
    req.session.count++;
  } else {
    req.session.count = 1;
  }
  res.send('session count : ', req.session.count);
});

app.get('/auth/logout', function(req, res){
  delete req.session.displayName; //세션 정보를 삭제
  res.redirect('/welcome');
});
app.get('/welcome', function(req, res){
  if(req.session.displayName) {
    res.send(`
      <h1>Hello, ${req.session.displayName}</h1>
      <a href="/auth/logout">logout</a>
    `);
  } else {
    res.send(`
      <h1>Welcome</h1>
      <a href="/auth/login">Login</a>
    `);
  }
});
app.post('/auth/login', function(req, res){
  var user = {
    username:'egoing',
    password:'111',
    displayName:'Egoing'
  };
  var uname = req.body.username;
  var pwd = req.body.password;
  if(uname === user.username && pwd === user.password){
    req.session.displayName = user.displayName;
    res.redirect('/welcome');
  } else {
    res.send('Who are you? <a href="/auth/login">login</a>');
  }
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
  `;
  res.send(output);
});

app.listen(9000, function(){
  console.log('start server port 9000');
})
