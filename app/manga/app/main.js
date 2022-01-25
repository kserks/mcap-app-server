(function (){

let pathname = location.pathname.split('/')
const title = pathname[2]
const chapter = pathname[3]

let manga = null

let url = `${location.protocol}//${location.host}/manga/json/${title}.json`
fetch(url)
  .then(r=>r.json())
  .then(body=>{

      manga = new Manga(body, title, chapter)
      window.manga = manga
      manga.render()

  })



$('.prev').addEventListener('click', ()=>{manga.prev()})
$('.next').addEventListener('click', ()=>{manga.next()})

document.addEventListener('keydown', function(event) {
  if(event.code==='ArrowLeft'){
    manga.prev()
  }
  if(event.code==='ArrowRight'){
    manga.next()
  }
})

console.log('768 x 1024')
})()