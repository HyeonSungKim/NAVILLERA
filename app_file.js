var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');

app.locals.pretty = true;
app.set('views', './views');
app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/topic/new', function(req, res){
  res.render('new');
})
app.get('/topic', function(req, res){
  fs.readdir('data', function(err, files){
   if(err){
    console.log(err);
    res.status(500).send('err');
    }
   res.render('view', {topics:files});
  })
});

app.get('/topic/:id', function(req, res){
  var id = req.params.id;
  fs.readdir('data', function(err, files){
   if(err){
    console.log(err);
    res.status(500).send('err');
  }
  fs.readFile('data/'+id, 'utf-8', function(err, data){
   if(err){
    console.log(err);
    res.status(500).send('err');
   }
   res.render('view',{topics:files, title:id, dec:data});
  })
 })
});

app.post('/topic', function(req, res){
  var title = req.body.title;
  var dec = req.body.dec;
  fs.writeFile('data/'+title, dec, function(err) {
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
