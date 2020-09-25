var db = require('./db');
var template = require('./template.js');
var qs = require('querystring');
var url = require('url');

exports.home = function(request, response){
    db.query(`SELECT * FROM topic`, function(error,topics){  //topic.js에 접근
        db.query(`SELECT * FROM author`, function(error2,authors){  //author.js에 접근
            var title = 'author';
            var list = template.list(topics);              //template.lsit에 topics을 매개변수로 접근
            var html = template.HTML(title, list,          //template.HTML에 접근(title, list, authorTable에 접근)
            `                                                   
            ${template.authorTable(authors)}                
            <style>
                table{
                    border-collapse: collapse;
                }
                td{
                    border:1px solid black;
                }
            </style>
            <form action="/author/create_process" method="post">
                <p>
                    <input type="text" name="name" placeholder="name">
                </p>
                <p>
                    <textarea name="profile" placeholder="description"></textarea>
                </p>
                <p>
                    <input type="submit"  value="create">
                </p>
            </form>
            `,                                          // template.authorTable(메소드)에 접근하여 authors를 매개변수로 가짐.     
            ``
            );
            response.writeHead(200);
            response.end(html);
        });
    });
}

exports.create_process = function(request, response){   // author를 생성 처리하는 기능    
    var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);                 
          db.query(`                                    
            INSERT INTO author (name, profile) 
              VALUES(?, ?)`,
            [post.name, post.profile],              //post형식으로 가져온 author의 name과 profile을 처리함.      
            function(error, result){
              if(error){
                throw error;
              }
              response.writeHead(302, {Location: `/author`});
              response.end();
            }
          )
      });
}

exports.update = function(request, response){                          //author의 update를 처리하는 형식 
    db.query(`SELECT * FROM topic`, function(error,topics){           //데이터 topic을 열고      
        db.query(`SELECT * FROM author`, function(error2,authors){    //데이터 author를 열고  
            var _url = request.url;
            var queryData = url.parse(_url, true).query;
            db.query(`SELECT * FROM author WHERE id=?`,[queryData.id], function(error3,author){  // querydata.id 값으로 가져옴.   
                var title = 'author';
                var list = template.list(topics);            // template.list메소드를 가져옴.
                var html = template.HTML(title, list,        // template.HTML메소드를 가져옴.
                `
                ${template.authorTable(authors)}                
                <style>
                    table{
                        border-collapse: collapse;
                    }
                    td{
                        border:1px solid black;
                    }
                </style>
                <form action="/author/update_process" method="post">
                    <p>
                        <input type="hidden" name="id" value="${queryData.id}">
                    </p>
                    <p>
                        <input type="text" name="name" value="${author[0].name}" placeholder="name">
                    </p>
                    <p>
                        <textarea name="profile" placeholder="description">${author[0].profile}</textarea>
                    </p>
                    <p>
                        <input type="submit" value="update">
                    </p>
                </form>
                `,              //template.authorTable(authors)를 통해서 아래의 스타일대로 표를 만든 다음에 form형식으로 기존 입력값 author name과 profile을 가지고 옴. 그러나 실질적인 구분은 id값
                ``
                );
                response.writeHead(200);
                response.end(html);
            });
            
        });
    });
}

exports.update_process = function(request, response){       //update를 처리하는 기능
    var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);
          db.query(`
            UPDATE author SET name=?, profile=? WHERE id=?`,     //sql 문에서 update를 처리하는 내용. name과 profile를 처리함. 
            [post.name, post.profile, post.id],                   // name, profile, id를 처리함.   
            function(error, result){
              if(error){
                throw error;
              }
              response.writeHead(302, {Location: `/author`});           
              response.end();
            }
          )
      });
}

exports.delete_process=function(request,response){            // 삭제를 구현하는 기능  
    var body = '';
    request.on('data', function(data){
        body = body + data;
    });
    request.on('end', function(){
        var post = qs.parse(body);
        db.query(
            'DELETE FROM topic WHERE author_id = ?', [post.id], function(error1, result1){    // post.id를 구분으로 측정해서, topic을 삭제
          if(error1){
            throw error1;
          };
          db.query('DELETE FROM author WHERE id = ?', [post.id], function(error2, result2){ // post.id를 구분으로 측정해서, author를 삭제
            if(error2){
              throw error2;}
            }); 
          response.writeHead(302, {Location: `/author`});                               //redirection으로 main.author로 돌아감. 
          response.end();
        });
    });
}