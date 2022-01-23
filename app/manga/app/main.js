function $(selector){
  return document.querySelector(selector)
}

class Manga {
  index = 0
  constructor (body, chapterTitle, title){
    this.body = body
    this.title = title
    this.chapterTitle = chapterTitle

  }
  get img (){
    return this.chapter[this.index]
  }
  get chapter (){
    return  this.body[this.chapterTitle]
  }
  get url (){
    return `url(./_store/${this.title}/${this.chapterTitle}/${this.img})`
  }

  render (){
    $('.viewer').style.backgroundImage = this.url
  }
  next (){
    ++this.index
    this.render()
  }
  prev (){
    --this.index
    this.render()
  }
}




const url = new URL(location.href);
const title = url.searchParams.get('m')
const chapter = url.searchParams.get('c')

let manga = null
fetch(location.pathname+`json/${title}.json`)
  .then(r=>r.json())
  .then(body=>{
      manga = new Manga(body, chapter, title)
      manga.render()
  })

$('.prev svg path').addEventListener('click', function (){
  if(manga.chapter.length>0){
      manga.prev()
  }
})

$('.next svg path').addEventListener('click', function (){
  if(manga.index<manga.chapter.length){
      manga.next()
  }
})