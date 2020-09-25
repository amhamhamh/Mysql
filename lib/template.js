module.exports = {
  HTML:function(title, list, body, control){   // title, list, body(본문), control을 생성하는 구현기능
    return `
    <!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">WEB</a></h1>
      <a href="/author">author</a>
      ${list}
      ${control}
      ${body}
    </body>
    </html>
    `;
  },list:function(topics){            // topics를 매개 변수로 취함.   
    var list = '<ul>';                    
    var i = 0;
    while(i < topics.length){      
      list = list + `<li><a href="/?id=${topics[i].id}">${topics[i].title}</a></li>`; 
      i = i + 1;          //topics.id(데이터베이스에 의존함). topics.title(데이터베이스에 의존함)   
    }
    list = list+'</ul>';
    return list;
  },authorSelect:function(authors, author_id){ // author, author_id를 매개변수로 가짐
    var tag = '';
    var i = 0;
    while(i < authors.length){              
      var selected = '';
      if(authors[i].id === author_id) {
        selected = ' selected';
      }
      tag += `<option value="${authors[i].id}"${selected}>${authors[i].name}</option>`;
      i++;
    }
    return `
      <select name="author">
        ${tag}
      </select>
    `
  },authorTable:function(authors){ //해당 함수는 표 형식으로 보여주는 함수임.
    var tag = '<table>';
    var i = 0;
    while(i < authors.length){      // 행 순서대로 name, profile, id 값을 가지고 옴. 
        tag += `                   
            <tr>
                <td>${authors[i].name}</td>       
                <td>${authors[i].profile}</td>
                <td><a href="/author/update_process?id=${authors[i].id}">update</a></td>
                <td>
                <form action="/author/delete_process" method="post">
                <input type="hidden" name="id" value="${authors[i].id}">
                <input type="submit" value='delete'>
                </form>                
                </td>
            </tr>
            `
        i++;
    }
    tag += '</table>';
    return tag;
  }
}