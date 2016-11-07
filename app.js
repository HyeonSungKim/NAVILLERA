var express = require('express');
var app = express();

app.locals.pretty = true;
app.set('view engine', 'jade');
app.set('views', './views');

app.use(express.static('../public'));
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/template', function(req, res){
  res.render('temp', {time:Date(), _title:'GF'});
});
app.get('/', function (req, res) {
  res.send('<h1>Hello World!!</h1>');
});
app.get('/hello', function (req, res) {
  res.send('<h1>Hi Hello!</h1>');
});

app.post('/?', function(req, res) {
  var title = req.body.title;
  var dec = req.body.dec;
  res.send(title+','+dec);
});


var server = app.listen(9000, function () {
  var port = server.address().port;
 console.log('Listen to port', port);
});
