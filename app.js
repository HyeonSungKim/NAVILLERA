var express = require('express');
var app = express();

app.use(express.static('../public'));
app.get('/', function (req, res) {
  res.send('<h1>Hello World!!</h1>');
});

app.get('/hello', function (req, res) {
  res.send('<h1>Hi Hello!</h1>');
});

var server = app.listen(9000, function () {
  var host = server.address().address;
  var port = server.address().port;

 console.log('Listen to host and port',host, port);
});
