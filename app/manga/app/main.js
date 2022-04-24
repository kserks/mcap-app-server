function mangaViewer(body, title, chapter, root){

let manga = new Manga(body, title, chapter, root)
//window.manga = manga
manga.render()

$('.prev').addEventListener('mousedown', ()=>{manga.prev()})
$('.next').addEventListener('mousedown', ()=>{manga.next()})

document.addEventListener('keydown', function(event) {
  if(event.code==='ArrowLeft'){
    manga.prev();
  }
  if(event.code==='ArrowRight'){
    manga.next();
  }
})

console.log('768 x 1024')
}

