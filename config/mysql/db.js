module.exports = function() {
var mysql = require('mysql');
var conn = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'w65l46',
  database : 'ex'
});
conn.connect();
return conn;
}
