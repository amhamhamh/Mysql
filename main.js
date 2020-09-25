var http = require('http');   
var url = require('url');
var topic = require('./lib/topic'); //topic 모듈을 사용함
var author = require('./lib/author'); //author 모듈을 사용함

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    if(pathname === '/'){
      if(queryData.id === undefined){  //★★하기의 객체들은 먼저 topic,author에 접근 후 template에 접근     
        topic.home(request, response);  //topic의 home 객체를 사용-첫 화면
      } else {
        topic.page(request, response);  //topic의 page 객체를 사용-화면을 읽어옴
      }
    } else if(pathname === '/create'){   //topic의 저서를 생성함.
      topic.create(request, response);    
    } else if(pathname === '/create_process'){   //topic의 저서를 처리하는 기능
      topic.create_process(request, response);
    } else if(pathname === '/update'){           //topic의 저서를 update하는 기능 
      topic.update(request, response);
    } else if(pathname === '/update_process'){  //topic의 저서를 update 처리하는 기능
      topic.update_process(request, response);
    } else if(pathname === '/delete_process'){  //topic의 저서를 삭제하는 기능
      topic.delete_process(request, response);
    } else if(pathname === '/author'){          //author의 표 형식으로 구현 및 생성하는 기능
      author.home(request, response);
    } else if(pathname === '/author/create_process'){ //author 추가처리 하는 기능
      author.create_process(request, response);         
    } else if(pathname === '/author/update'){         //author update를 생성하는 기능
      author.update(request, response);
    } else if(pathname === '/author/update_process'){ //author update를 처리하는 기능
      author.update_process(request, response);
    } else if(pathname === '/author/delete_process'){ //author delete를 삭제하는 기능
      author.delete_process(request, response);
    } else {
      response.writeHead(404);
      response.end('Not found');
    }
});
app.listen(3000); 


// 해당 index화면은 topic 읽기, topic 생성, topic 생성처리, topic 수정, topic 수정처리
// author 읽기, author 생성, author 생성처리, author 수정, author 수정처리
//topic.js나 author.js나 기능을 구현했을 떄, 똑같이 처리해야 되기 때문에
// 1.페이지 제목 2. 본문 제목 3. 리스트 4. authorselect or authortable 5. 컨트롤 구현은 동일하다. 