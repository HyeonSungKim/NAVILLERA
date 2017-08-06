var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendfile('views/chat.html');
});

io.on('connection', function(socket){
  socket.on('from message', function(msg){
    io.emit('to message', msg);
  });
});

http.listen(9000, function(){
  console.log('listening on *:9000');
});
