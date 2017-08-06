var app = require('./config/mysql/express')();
//var conn = require('./config/mysql/db')();

//test
// passport 사용하기위해 가져왔다
var passport = require('./config/mysql/passport')(app);
var auth = require('./routes/mysql/auth')(passport);
app.use('/auth/', auth);


var topic = require('./routes/mysql/topic')();
app.use('/topic/',topic);  //topic 이라는 이름으로 들어오는 것들은 모두 라우트 객체에의해처리


// var httpServer =http.createServer(app).listen(9000, function(req,res){
//   console.log('Socket IO server has been started');
// });
app.listen(9000, function(){
  console.log('Connected, 9000 port');
})
