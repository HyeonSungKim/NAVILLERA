module.exports = function(app){

  var conn = require('./db')();
  var bkfd2Password = require("pbkdf2-password");
  var passport = require('passport');
  var LocalStrategy = require('passport-local').Strategy; //자체인증 passport
  //var FacebookStrategy = require('passport-facebook').Strategy;
  var hasher = bkfd2Password();

  app.use(passport.initialize());
  app.use(passport.session());

  //사용자 정보를 Session에 저장
  passport.serializeUser(function(user, done) {
    console.log('serializeUser', user);
    done(null, user.authId);
  });

  // 인증 후, 페이지 접근시 마다 사용자 정보를 Session에서 읽어옴.
  passport.deserializeUser(function(id, done) {
    console.log('deserializeUser', id);
    console.log(Date());
    var sql = 'SELECT * FROM users WHERE authId=?';
    conn.query(sql, [id], function(err, results){
      if(err){
        console.log(err);
        return done('There is no user.');
      } else {
        return done(null, results[0]);
      }
    });
  });
  passport.use(new LocalStrategy(
    function(username, password, done){
      var uname = username;
      var pwd = password;
      var sql = 'SELECT * FROM users WHERE authId=?';
      conn.query(sql, ['local:'+uname], function(err, results){
        if(err){
          return done('There is no user.');
        }
        var user = results[0];
        return hasher({password:pwd, salt:user.salt}, function(err, pass, salt, hash){
          if(hash === user.password){
            console.log('LocalStrategy', user);
            return done(null, user);
          } else {
            return done(null, false);
          }
        });
      });
    }
  ));

  return passport;
}
