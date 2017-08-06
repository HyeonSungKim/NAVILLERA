module.exports = function() {



  var express = require('express');
  var session = require('express-session');
  var MySQLStore = require('express-mysql-session')(session);
  var bodyParser = require('body-parser');
   var http = require('http').Server(app);
   var io = require('socket.io')(http);
// var path = require('path')

  var app = express();
  app.set('views','./views/mysql');  // view 파일들은(views) view/mysql 의경로를 따른다
  app.set('view engine','jade');  // view 파일은 jade 형식을 사용한다
  app.use(bodyParser.urlencoded({ extended: false }));
//  app.use(express.static(path.join(__dirname, 'views/mysql/')));
  app.use('/uploads', express.static('uploads'));
  app.use(session({
    secret: '1234DSFs@adf1234!@#$asd',
    resave: false,
    saveUninitialized: true,
    store:new MySQLStore({
      host:'localhost',
      port:3306,
      user:'root',
      password:'w65l46',
      database:'ex'
    })
  }));

  return app;
}
