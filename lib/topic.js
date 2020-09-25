var db = require('./db');
var template = require('./template.js');
var url = require('url');
var qs = require('querystring');

exports.home = function(request, response){                   //본문의 첫 화면 구현
    db.query(`SELECT * FROM topic`, function(error,topics){     // 데이터 topic을 구현해서 가져옴.     
        var title = 'Welcome';
        var description = 'Hello, Node.js';
        var list = template.list(topics);                      //template.list메소드를topic를 매개변수로 가져옴. 
        var html = template.HTML(title, list,                 // template.HTML메소를 변수로 가짐
          `<h2>${title}</h2>${description}`,
          `<a href="/create">create</a>`
        );
        response.writeHead(200);
        response.end(html);
    });
}

exports.page = function(request, response){                             
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    db.query(`SELECT * FROM topic`, function(error,topics){
        if(error){
          throw error; //예외 처리
        }
        db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id=?`,[queryData.id], function(error2, topic){
          if(error2){ // author 왼쪽에 topic 붙이고, topic.author_id=author.id와 같다. topic.id는 querydata.id의 배열 값을 받는다. 
            throw error2; 
          }
         var title = topic[0].title;
         var description = topic[0].description;
         var list = template.list(topics);
         var html = template.HTML(title, list,
           `
           <h2>${title}</h2>
           ${description}
           <p>by ${topic[0].name}</p> 
           `,// 해당 topic의 네임
           ` <a href="/create">create</a>
               <a href="/update?id=${queryData.id}">update</a>
               <form action="delete_process" method="post">
                 <input type="hidden" name="id" value="${queryData.id}">
                 <input type="submit" value="delete">
               </form>`
         );
         response.writeHead(200);
         response.end(html);
        })
     });
}

exports.create = function(request, response){   // topic을 생성하는 기능
    db.query(`SELECT * FROM topic`, function(error,topics){       // topic을 열고,
        db.query('SELECT * FROM author', function(error2, authors){ // author를 연다. 
          var title = 'Create';           
          var list = template.list(topics);
          var html = template.HTML(title, list,
            `
            <form action="/create_process" method="post">
              <p><input type="text" name="title" placeholder="title"></p>
              <p>
                <textarea name="description" placeholder="description"></textarea>
              </p>
              <p>
                ${template.authorSelect(authors)}         
              </p>
              <p>
                <input type="submit">
              </p>
            </form>
            `,
            `<a href="/create">create</a>`
          );
          response.writeHead(200);
          response.end(html);
        });
      });
}

exports.create_process = function(request, response){   // topic 생성을 처리하는 기능
    var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);
          db.query(`
            INSERT INTO topic (title, description, created, author_id) 
              VALUES(?, ?, NOW(), ?)`,
            [post.title, post.description, post.author], // topic은 title, decription, created는 now()로 처리, author_id로 구현
            function(error, result){
              if(error){
                throw error;
              }
              response.writeHead(302, {Location: `/?id=${result.insertId}`});//해당 insert id의 값으로 나옴
              response.end();
            }
          )
      });
}

exports.update =function(request,response){               //topic을 수정하는 구현
    var _url = request.url;   
    var queryData = url.parse(_url, true).query;
    db.query('SELECT * FROM topic', function(error, topics){      //topic을 구현하는 기능  
        if(error){
          throw error;
        }
        db.query(`SELECT * FROM topic WHERE id=?`,[queryData.id], function(error2, topic){  //해당 목록을 눌렀을 떄(querydata.id)값으로 눌렀을 때 구현. 
          if(error2){
            throw error2;
          }
          db.query('SELECT * FROM author', function(error3, authors){               // 데이터 베이스 author를 가져옴. 
            var list = template.list(topics);                                      // topics를 매개변수로 가져옴. 
            var html = template.HTML(topic[0].title, list,                         
              `
              <form action="/update_process" method="post">
                <input type="hidden" name="id" value="${topic[0].id}">
                <p><input type="text" name="title" placeholder="title" value="${topic[0].title}"></p>
                <p>
                  <textarea name="description" placeholder="description">${topic[0].description}</textarea>
                </p>
                <p>
                  ${template.authorSelect(authors, topic[0].author_id)}
                </p>
                <p>
                  <input type="submit">
                </p>
              </form>
              `,
              `<a href="/create">create</a> <a href="/update?id=${topic[0].id}">update</a>`
            );
            response.writeHead(200);
            response.end(html);
          });
          
        });
      });  
}

exports.update_process=function(request, response){               //update를 처리하는 기능
    var body = '';
    request.on('data', function(data){
        body = body + data;
    });
    request.on('end', function(){                               //title, description, autho, id를 가지고 옴. 
        var post = qs.parse(body);
        db.query('UPDATE topic SET title=?, description=?, author_id=? WHERE id=?', [post.title, post.description, post.author, post.id], function(error, result){
          response.writeHead(302, {Location: `/?id=${post.id}`});
          response.end();
        })
    });
}

exports.delete_process=function(request,response){        //delete process를 처리함. 
    var body = '';
    request.on('data', function(data){
        body = body + data;
    });
    request.on('end', function(){
        var post = qs.parse(body);
        db.query('DELETE FROM topic WHERE id = ?', [post.id], function(error, result){      //해당 id 값을 불러와서 삭제해버림. 
          if(error){
            throw error;
          }
          response.writeHead(302, {Location: `/`});
          response.end();
        });
    });
}