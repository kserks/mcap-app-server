const head = `
<!DOCTYPE html>
<html>
<head>
  <title>manga</title>
  <meta charset="utf-8">
  <link rel="stylesheet" type="text/css" href="/manga/app/css/font-awesome.min.css">
  <link rel="stylesheet" type="text/css" href="/manga/app/css/style.css">
  <script src="/manga/app/Manga.js"></script>
</head>
<body>

`

function mangaChaptersTpl (title, data){



function list (){
  return Object.keys(data).map(item=>{


     return `
          <a href="/manga/${title}/${item}" class="chapter-item">
              <div class="chapter-title">${item}</div> 
          </a>
    `
  }).join('')
}

return `
  
  ${head}

  <div class="app">
    <div class="manga-items">
        ${list()}
    </div>

  </div>

</body>
</html>
`
}

function mangaItemsTpl(data){

function list (){
  return data.map(item=>{
    
    let title = item.split('.json')[0]

     return `
          <a href="/manga/${title}" class="manga-item">
              <div class="manga-cover" style="background-image: url(/manga/_store/${title}/cover.jpg)"></div>
              <div class="manga-title-wrapper">
                <div class="manga-title">${title}</div>
              </div>
          </a>
    `
  }).join('')
}

return `
  
  ${head}

  <div class="app">
    <div class="manga-items">
        ${list()}
    </div>

  </div>

</body>
</html>
`
}

function mangaViewerTpl(data){

return `
  ${head}

  <div class="app">
    <div class="viewer"></div>
    <div class="controls">
        <div class="arrow prev">
          <i class="fa fa-chevron-left" aria-hidden="true"></i>
        </div>
        <div class="progress">
            <div class="progress__data"></div>
        </div>
        <div class="arrow next">
          <i class="fa fa-chevron-right" aria-hidden="true"></i>
        </div>
    </div>
  </div>

<script src="/manga/app/main.js"></script>
</body>
</html>
`
}





module.exports = { mangaItemsTpl, mangaChaptersTpl, mangaViewerTpl }