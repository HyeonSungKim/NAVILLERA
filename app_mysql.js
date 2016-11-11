var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');
var multer = require('multer');
//var upload = multer({ dest: 'uploads/'});
var _storage = multer.diskStorage({
  destination: function(req, file, cb) {  //목적지
    cb(null, 'uploads/')  //저장되는 경로
  },
  filename: function(req, file, cb) { //파일명
    cb(null, file.originalname);  //저장하는 파일의 고유명으로 저장
  }
})
var upload = multer({ storage: _storage});

var mysql = require('mysql');
var conn = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password : 'w65l46',
  database : 'ex'
});

conn.connect();

app.locals.pretty = true;
app.set('views', './views');
app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/user', express.static('uploads'));

app.get('/upload', function(req, res){
  res.render('upload');
});
app.post('/upload', upload.single('userfile'), function(req, res){ // userfile은 jade파일내에 file type의 name
  console.log(req.file);
  res.send('upload : '+req.file);
});

// 추가
app.get('/topic/add', function(req, res){
  var sql= 'SELECT * FROM topic';
  conn.query(sql, function(err, topics, fields){
      res.render('add', {topics:topics});
  })
})

app.post('/topic/add', function(req, res){
  var title = req.body.title;
  var des = req.body.des;
  var author = req.body.author;
  var sql = 'INSERT INTO topic (title, des, author) VALUES(?, ?, ?)';
  conn.query(sql, [title, des, author], function(err, result, fields) {
   if(err){
     console.log(err);
    res.status(500).send('err');
  }else{
   res.redirect('/topic/'+result.insertId);
  }
 });
})

// 삭제
app.get(['/topic/:id/delete'], function(req, res){
  var sql= 'SELECT id,title FROM topic';
  var id = req.params.id;
  conn.query(sql, function(err, topics, fields){
    var sql= 'SELECT * FROM topic WHERE id=?';
    conn.query(sql, [id], function(err, topic){
      if(err){
        console.log(err);
      }
      else {
        if(topic.length === 0){
          console.log('no id');
        }else {
          res.render('delete', {topics:topics, topic:topic[0]});
        }
      }
    });
  });
});

app.post(['/topic/:id/delete'], function(req, res){
  var id = req.params.id;
  var sql= 'DELETE FROM topic WHERE id=?';
  conn.query(sql, [id], function(err, result){
    res.redirect('/topic/');
  });
});

//수정
app.get(['/topic/:id/edit'], function(req, res){
  var sql= 'SELECT id,title FROM topic';  //db 쿼리문
  conn.query(sql, function(err, topics, fields){
    var id = req.params.id;
    if(id){
      var sql= 'SELECT * FROM topic WHERE id=?';
      conn.query(sql, [id], function(err, topic, fields){ //topic 매개변수는 위의 topics를 덮어서 변수명 다르게
        if(err){
          console.log(err);
        }
        else {
          res.render('edit', {topics:topics, topic:topic[0]}); //[0] 배열의 하나의 값만 가져오기위함
        }
      });
    }
    else {
      consol.log('no id');
    }
})
});

app.post(['/topic/:id/edit'], function(req, res){
  var title = req.body.title;
  var des = req.body.des;
  var author = req.body.author;
  var id = req.params.id;
  var sql = 'UPDATE topic SET title=?, des=?, author=? WHERE id=?';
  conn.query(sql, [title, des, author, id], function(err, result, fields){
    if(err){
      console.log(err);
      res.status(500).send('Internal Server Error');
    } else {
      res.redirect('/topic/'+id);
    }
  });
});

//메인
app.get(['/topic','/topic/:id'], function(req, res){
  var sql= 'SELECT id,title FROM topic';  //db 쿼리문
  conn.query(sql, function(err, topics, fields){
    var id = req.params.id;
    if(id){
      var sql= 'SELECT * FROM topic WHERE id=?';
      conn.query(sql, [id], function(err, topic, fields){ //topic 매개변수는 위의 topics를 덮어서 변수명 다르게
        if(err){
          console.log(err);
        }
        else {
          res.render('view2', {topics:topics, topic:topic[0]}); //[0] 배열의 하나의 값만 가져오기위함
        }
      });
    }
    else {
      res.render('view2', {topics:topics}); //topics 라는 이름으로 topics 매개변수전달
    }
})
});

app.post('/topic', function(req, res){
  var title = req.body.title;
  var des = req.body.des;
  fs.writeFile('data/'+title, des, function(err) {
   if(err){
    res.status(500).send('err');
   }
   res.send('suc');
 });
  //res.send('hi, ' + req.body.title);
})
app.listen(9000, function(){
  console.log('Connected, 9000 port');
})
