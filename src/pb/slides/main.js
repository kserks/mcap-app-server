

import evt from '../lib/emitter.js'
import { board } from '../lib/mode.js'

//import Collection from './Collection.js'
let STORE = {};
export default function (ROOT){
  let url = '/pb/json/store.json'//'http://app.mcap.fun' // Content-Type: plane-text
  fetch(url)
    .then(r=>r.json())
    .then(topics=>{
        STORE = topics;
        init(Object.values(topics), ROOT, 10000);
    })
    .catch(err=>{
      console.error(err)
    })
}


function init(topics, ROOT){
  var flag = false
  topics.map(col=>{
    let $tpl = `<div class="footer__album-list--item" data-id="${col.title}">${col.name}</div>`
    $('.footer__album-list').append($tpl)

  })

  $('.footer__album-list').on('mousedown', '.footer__album-list--item', function (){
      
      let id = $(this).data('id');
      flag = false
      $('.footer__album-list').hide()
      board.setBackground(`/pb/store/${id}/${STORE[id].chapters[0]}`);
      lesson.init(STORE[id].chapters, id)
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




var lesson = {
    collection: null,
    paused: true,
    index: 0,
    tid: null,
    urlImg: '',
    init: function (collection, id, timeStep){
      this.timeStep = timeStep
      this.collection = collection;
      this.index = 0;
      this.id = id;
      this.pause();
      this.render();
    },
    play: function (){
      this.paused = false;
      this.next();
      evt.emit('play');
    },
    pause: function (){
      this.paused = true;
      evt.emit('pause');
    }
}

lesson.render = function (){
    $('.footer__slides').empty();
    this.collection.map( (slide, index)=>{
        let $tpl = $(`<div class='footer__slides--exist' data-url="${slide}" data-index='${index}'>${index+1}</div>`)
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
    let imageName = this.collection[this.index]
    this.urlImg = `/pb/store/${this.id}/`

    board.setBackground( this.urlImg+imageName)

    this.tid = setTimeout(()=>{
      this.index++
      if(this.collection.length===this.index){
        this.paused = true
        evt.emit('pause')

        this.index = 0
        this.currentClass()

        board.setBackground( this.urlImg+imageName )
      }
      else{
        if(!this.paused)
                this.next()
      }

    }, this.timeStep/*this.collection[this.index].pause*1000*/)
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

    board.setBackground(lesson.urlImg+url)
    lesson.currentClass()
    lesson.paused = true
    evt.emit('pause')
})

