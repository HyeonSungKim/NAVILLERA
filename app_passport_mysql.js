var app = require('./config/mysql/express')();

var passport = require('./config/mysql/passport')(app);

// app.get('/count', function(req, res){
//   if(req.session.count) {
//     req.session.count++;
//   } else {
//     req.session.count = 1;
//   }
//   res.send('count : '+req.session.count);
// });

app.get('/welcome', function(req, res){
  if(req.user && req.user.displayName) {
    res.send(`
      <h1>Hello, ${req.user.displayName}</h1>
      <a href="/auth/logout">logout</a>
    `);
  } else {
    res.send(`
      <h1>Welcome</h1>
      <ul>
        <li><a href="/auth/login">Login</a></li>
        <li><a href="/auth/register">Register</a></li>
      </ul>
    `);
  }
});

// passport.use(new FacebookStrategy({
//     clientID: '1602353993419626',
//     clientSecret: '232bc1d3aca2199e6a27eb983e602e0b',
//     callbackURL: "/auth/facebook/callback",
//     profileFields:['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified', 'displayName']
//   },
//   function(accessToken, refreshToken, profile, done) {
//     console.log(profile);
//     var authId = 'facebook:'+profile.id;
//     for(var i=0; i<users.length; i++){
//       var user = users[i];
//       if(user.authId === authId){
//         return done(null, user);
//       }
//     }
//     var newuser = {
//       'authId':authId,
//       'displayName':profile.displayName,
//       'email':profile.emails[0].value
//     };
//     users.push(newuser);
//     done(null, newuser);
//   }
// ));

var auth = require('./routes/mysql/auth')(passport);
app.use('/auth/', auth);

app.listen(9000, function(){
  console.log('Connected 9000 port!!!');
});
