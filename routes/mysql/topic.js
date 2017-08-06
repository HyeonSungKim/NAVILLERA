module.exports = function() {
//     ul#account
  require('date-utils');
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


  var route = require('express').Router();
  var conn = require('../../config/mysql/db')();
//   var http = require('http').Server(http);
//   var io = require('socket.io')(http);
// var path = require('path')



  route.get('/upload', function(req, res){
    var sql= 'SELECT * FROM topic';
    conn.query(sql, function(err, topics, fields){
      if(err){
        console.log(err);
       res.status(500).send('err');
     }else{
      res.render('topic/upload', {topics:topics, user:req.user});
    }
    })
  });

// 업로드 완료되면 메인페이지로 이동
  route.post('/upload', upload.single('userfile'), function(req, res){ // userfile은 jade파일내에 file type의 name
    console.log(req.file);
    console.log(Date());
    var filename = req.file.originalname;
    var username = req.user.username;
    var dates = new Date();
    var date = dates.toFormat('YYYY-MM-DD HH24:MI');
    var path = req.file.path;
    var size = req.file.size;
    var sql= 'INSERT INTO data (filename, username, date, path, size) VALUES(?, ?, ?, ?, ?)';

    conn.query(sql, [filename, username, date, path, size], function(err, result, fields){
      if(err){
        console.log(err);
       res.status(500).send('err');
     }else{
      res.redirect('/topic');
    }
    })
  });

  route.get('/gallery', function(req, res){
   //var files = fs.readdirSync('uploads/'+file.filename);
     var files = fs.readdirSync('uploads/');
  // var sql2= 'SELECT B.path FROM users A, data B WHERE A.username=B.username';
  // path로 이미지 로딩하므로 files는 사실상 필요없다. 그냥이미지올로딩때 사용
    var sql= 'SELECT B.username,B.filename,B.path FROM users A, data B WHERE A.username=B.username';
     conn.query(sql, function(err, topic, fields){
       console.log(topic);
       res.render('topic/gallery', {imgs:files,  topic:topic,  user:req.user});
   })

  });


  //추가
  route.get('/add', function(req, res){
    var sql= 'SELECT * FROM topic';

    conn.query(sql, function(err, topics, fields){
      var username = req.user.username;
      var sql2 = 'SELECT * FROM users';
        conn.query(sql2, function(err, topic){
          res.render('topic/add', {topics:topics, topic:topic[0],  user:req.user});
        })

    })
  })

  route.post('/add', function(req, res){
    var title = req.body.title;
    var des = req.body.des;
    var author = req.user.username;
    var dates = new Date();
    var date = dates.toFormat('YYYY-MM-DD HH24:MI');
    var sql = 'INSERT INTO topic (title, des, author, date) VALUES(?, ?, ?, ?)';
    conn.query(sql, [title, des, author, date], function(err, result, fields) {
     if(err){
       console.log(err);
      res.status(500).send('err');
    }else{
     res.redirect('/topic/list/');//+result.insertId);
    }
   });
  })

  //메인
   route.get(['/'], function(req, res){
        res.render('topic/main', { user:req.user});
  });

  // 리스트
  route.get(['/list'], function(req, res){
    var sql= 'SELECT * FROM topic order by id desc';  //게시물 관련 정보
    conn.query(sql, function(err, topics, fields){
      var sql = 'SELECT count(*) cnt from topic';
        conn.query(sql, [], function(err, rows){
          if(err){ console.error('err',err); }
          console.log('rows',rows);

          res.render('topic/list', {topics:topics, rows:rows, user:req.user});

        })
    })
  });

  // 삭제
  route.get(['/:id/delete'], function(req, res){
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
            res.render('topic/delete', {topics:topics, topic:topic[0], user:req.user});
          }
        }
      });
    });
  });

  route.post(['/:id/delete'], function(req, res){
    var id = req.params.id;
    var sql= 'DELETE FROM topic WHERE id=?';
    conn.query(sql, [id], function(err, result){
      res.redirect('/topic/');
    });
  });

  //수정
  route.get(['/:id/edit'], function(req, res){
    var sql= 'SELECT id,title FROM topic';  //db 쿼리문
    conn.query(sql, function(err, topics, fields){
      var id = req.params.id;
      var username = req.user.userneme;
      if(id){
        var sql= 'SELECT * FROM topic WHERE id=?';
        conn.query(sql, [id], function(err, topic, fields){ //topic 매개변수는 위의 topics를 덮어서 변수명 다르게
          if(err){
            console.log(err);
          }
          else {
            res.render('topic/edit', {topics:topics, topic:topic[0], user:req.user}); //[0] 배열의 하나의 값만 가져오기위함
          }
        });
      }
      else {
        consol.log('no id');
      }
  })
  });

  route.post(['/:id/edit'], function(req, res){
    var title = req.body.title;
    var des = req.body.des;
    var author = req.user.username;
    var id = req.params.id;
    var dates = new Date();
    var date = dates.toFormat('YYYY-MM-DD HH24:MI');
    var sql = 'UPDATE topic SET title=?, des=?, author=?, date=? WHERE id=?';
    conn.query(sql, [title, des, author, date, id], function(err, result, fields){
      if(err){
        console.log(err);
        res.status(500).send('Internal Server Error');
      } else {
        res.redirect('/topic/'+id+'/view');
      }
    });
  });



// 글보기
  route.get(['/:id/view'], function(req, res){
    var sql = 'SELECT * FROM topic';
      conn.query(sql, function(err, topics){
        var id = req.params.id;
        if(id){
          var sql= 'SELECT * FROM topic WHERE id=?';
          conn.query(sql, [id], function(err, topic){
            if(err){
              console.log(err);
            }
            else {
              res.render('topic/view', {topics:topics, topic:topic[0], user:req.user});
            }
      });
    }
    else {
      consol.log('no id');
    }
  })
});



  return route;
}
