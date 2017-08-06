var express = require('express');
var superagent = require('superagent');
var consolidate = require('consolidate');


var app = express();

//Configure tempate engine
app.engine('html', consolidate.handlebars);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

//Set up static folder
app.use(express.static(__dirname + '/uploads'));

var user = 'azat_co';
var story_slug = 'kazan';

//Paste your values
var api_key = "";
var username = "";
var _token = "";

app.get('/',function(req, res,next){
  //Fetch elements from Storify API
  superagent.get("http://api.storify.com/v1/stories/" + user + "/" + story_slug)
    //superagent.get('http://52.78.222.27/uploads'+"/")
    .query({api_key: api_key,
      username: username,
      _token: _token})
    .set({  Accept: 'application/json' })
    .end(function(e, storifyResponse){
      if (e) next(e);
      //Render template with story object in response body
      return res.render('index',storifyResponse.body.content);
    })

})

app.listen(9000);
