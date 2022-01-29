

import evt from '../lib/emitter.js'
import { board } from '../lib/mode.js'

//import Collection from './Collection.js'



export default function (){
  let url = 'http://atlant.mcacademy.ru/reindexer/api/v1/db/mcap_slides/query?q=select%20*%20from%20topics'
  fetch(url)
    .then(r=>r.json())
    .then(topics=>{
      console.log(topics.items)
        init(topics.items)
    })
    .catch(err=>{
      console.error(err)
    })
}




function init(topics){
  var flag = false
  topics.map(col=>{
    let $tpl = `<div class="footer__album-list--item" data-id="${col.id}">${col.name}</div>`
    $('.footer__album-list').append($tpl)

  })

  $('.footer__album-list').on('mousedown', '.footer__album-list--item', function (){
      board.setBackground('./images/backgrounds/greed.jpg')
      let id = $(this).data('id')
      flag = false
      $('.footer__album-list').hide()

      collectionInit(id)
  })




  $('.footer__album').on('mousedown', function (){

    if(flag){
      flag = false
      $('.footer__album-list').hide()
    }
    else{
      flag = true
      $('.footer__album-list').css('display', 'flex') 
    }
  })

}



function collectionInit (id){

  let url = `http://atlant.mcacademy.ru/reindexer/api/v1/db/mcap_slides/query?q=select%20%2a%20from%20topics%20where%20id%3D%27${id}%27%20join%20%28select%20%2a%20from%20slides%20where%20hide%3Dfalse%20order%20by%20order%29%20on%20slides.topic%3Dtopics.id`
  fetch(url)
    .then(r=>r.json())
    .then(collection=>{
      let { base, descr, id, name, joined_slides } = collection.items[0]

      lesson.init(joined_slides, id, base)


    })
    .catch(err=>{
      console.error(err)
    })


}



var lesson = {
    collection: null,
    paused: true,
    index: 0,
    pathToImage: null,
    tid: null,
    init: function (collection, id, base){
      console.log(collection)
      this.collection = collection
      this.pathToImage = base
      this.index = 0
      this.pause()
      this.render()
    },
    play: function (){
      this.paused = false
      this.next()
      evt.emit('play')
    },
    pause: function (){
      this.paused = true
      evt.emit('pause')
    }
}

lesson.render = function (){
    $('.footer__slides').empty();
    this.collection.map( (slide, index)=>{
        let $tpl = $(`<div class='footer__slides--exist' data-url="${slide.url}" data-index='${index}'>${index+1}</div>`)
        $('.footer__slides').append($tpl)
    })
}
lesson.currentClass = function (){
    $('.footer__slides--exist').toArray().map(slide=>{
        $(slide).removeClass('footer__slides--active')
    })
    $('.footer__slides--exist').toArray().map(slide=>{
        if(+$(slide).data('index')===this.index ){
          $(slide).addClass('footer__slides--active')
        }
    })
}

lesson.next = function (){
    this.currentClass()
    let pathname = this.collection[this.index].url
    let urlImg = this.pathToImage+pathname
    if(/http/i.test(pathname) ){
      urlImg = pathname
    }
    board.setBackground( urlImg )

    this.tid = setTimeout(()=>{
      this.index++
      if(this.collection.length===this.index){
        this.paused = true
        evt.emit('pause')

        this.index = 0
        this.currentClass()
        board.setBackground( urlImg )
      }
      else{
        if(!this.paused)
                this.next()
      }

    }, this.collection[this.index].pause*1000)
}

/*
 * Control
 */

var pauseFlag = false

evt.on('pause', ()=>{
    pauseFlag = false
    $('.fa-pause').hide()
    $('.fa-play').show()
})
evt.on('play', ()=>{
    pauseFlag = true
    $('.fa-play').hide()
    $('.fa-pause').show()

})


$('.footer__action').on('mousedown', function (){

    if(pauseFlag){
            pauseFlag = false
            lesson.pause()
    }
    else{
            pauseFlag = true
            lesson.play()
    }
})

$('.footer__slides').on('mousedown', '.footer__slides--exist', function (){
    let url = $(this).data('url')
    lesson.index = $(this).data('index')

    board.setBackground(lesson.pathToImage+url)
    lesson.currentClass()
    lesson.paused = true
    evt.emit('pause')
})

