//  모듈추출
var express = require('express');
var cookiePaser = require('cookiePaser');
//서버생성
var app = express();
// 미들웨어 사용
app.use(cookiePaser());
//라우팅

app.get('/count', function(){
  if(req.cookies.count){
    var count = parseInt(req.cookies.count); // 쿠키값은 문자로오는데 숫자로형변환
  } else {
    var count = 0;
  }
  count = count+1;
  res.cookie('count', count);
  res.send('count : '+ count);
})

app.listen(9000, function(){
  console.log('start server port 9000');
})
