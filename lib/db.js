var mysql = require('mysql');         //mysql 모듈을 사용함. 
var db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'111111',
    database:'opentutorials'
  });
  db.connect();
  
  module.exports = db;      //db를 뱉어냄.(author. topic에서 사용)