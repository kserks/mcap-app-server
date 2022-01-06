import './css/main.css'
import './css/font-awesome.css'
import './js/jquery.js'


import canvasToBase64 from './lib/canvas-to-base64.js'
import { selectMode, addMode, setColor, board } from './lib/mode.js'
/**
 * MODEs
 */
import marker from './modes/marker.js'
import rect from './modes/rect.js'
import circle from './modes/circle.js'
import arrow from './modes/arrow.js'
import eraser from './modes/eraser.js'
import stampNumber from './modes/stamp-number.js'
import undo from './modes/undo.js'
import line from './modes/line.js'
import lineWidth from './modes/line-width.js'
/**
 * 
 */
import slides from './slides/main.js'

slides()


addMode('marker', marker)
addMode('rect', rect)
addMode('circle', circle)
addMode('arrow', arrow)
addMode('eraser', eraser)
addMode('stampNumber', stampNumber)
addMode('line', line)
addMode('undo', undo)
addMode('lineWidth', lineWidth)

/*
 * default cofnig
 */
var player = null 
try {
    window.mcefQuery({
      request: "info",
      persistent: true,
      onSuccess:response=>{
        player = JSON.parse(response)
      }
    });
}catch (err) {
    player = {
      name: 'mcap_uknown',
      uuid: new Date().toLocaleString()
    }
             
}




selectMode('marker', 2, '#fc0505')
setColor('#63676b')
board.setBackground('./images/backgrounds/greed.jpg')
/**
 * 
 */
$('.paint-board__tools').on('mousedown', '.tool', function (){
    let tool = $(this).data('id') 
    let param = $(this).data('param')
    console.log(tool, param)
    /**
     * 2 - Отрисовка инструмента после второго клика
     */
    selectMode(tool, 2, param) 
})

$('#undo').on('mousedown', function (){
  selectMode('undo', 0)
})


$('#weight').on('mousedown', function (){

  
})


/**
 * Numbers
 */

$('.number-nav').on('click', '.number-nav__item', function (){

    selectMode('stampNumber', 1, this.innerHTML)

})

/**
 * dashed
 */
board.ctx.dashed = []

var dashedFlag = false
$('#dashed').on('click', function (){
  if(dashedFlag){
    board.ctx.dashed = []
    dashedFlag = false
    $(this).removeClass('active-btn')
  }
  else{
    board.ctx.dashed = [10, 10]
    dashedFlag = true
    $(this).addClass('active-btn')
  }
})

/**
 * Change color
 */
var colorList = [
      "#63676b",
      "#ac725e",
      "#d06b64",
      "#f83a22",
      "#fa573c",
      "#ff7537",
      "#ffad46",
      "#42d692",
      "#16a765",
      "#7bd148",
      "#b3dc6c",
      "#fbe983",
      "#fad165",
      "#92e1c0",
      "#9fe1e7",
      "#9fc6e7",
      "#4986e7",
      "#9a9cff",
      "#b99aff",
      "#c2c2c2",
      "#cabdbf",
      "#cca6ac",
      "#f691b2",
      "#cd74e6",
      "#a47ae2",
      '#11aff2',
      '#f2eb11',
      '#080700',
      '#a40cc9',
      '#f51dee',
      '#2ae7f5',
      '#fa0a0a'
]
colorList.map(color=>{

  let $tpl = $(`<div class="colorpicker__color"></div>`)
      $tpl.css({ background: color })
      $tpl.attr('data-color', color)
  $('#colorpicker').append($tpl)

})

var flag3 = false

$('.colorpicker__current').css('background', '#63676b')

$('.colorpicker__current').on('click', function() {
  if(flag3){
    $('#colorpicker').hide()
    flag3 = false
  }
  else{
      $('#colorpicker').css('display', 'flex')
      flag3 = true
  }


})

$('#colorpicker').on('mousedown', '.colorpicker__color', function() {

  let color = $(this).data('color')
  setColor(color)
  $('.colorpicker__current').css('background', color)
  $('#colorpicker').hide()
  flag3 = false
})
/**
 * weight marker
 */
board.weightMarker = 10
$('#weight-marker').on('mousedown', function (){

    if(board.weightMarker === 10){
      board.weightMarker = 20
    }
    else if(board.weightMarker === 20){
        board.weightMarker = 30
    }
    else if(board.weightMarker === 30){
       board.weightMarker = 10
    }
    this.innerHTML =  board.weightMarker

})


/**
 * Change weight
 */
var flag4 = false
$('.weight__current').on('mousedown', function (){
    if(flag4){
      flag4 = false
      $('.weight__list').hide()
    }
    else{
      flag4 = true
      $('.weight__list').css('display', 'flex')

    }
})

$('.weight__list').on('click', 'div', function (){

  let val = $(this).data('value')
  board.ctx.lineWidth = val
  $('.weight__current').html(val)
  flag4 = false
   $('.weight__list').hide()
})


/**
 * Save
 */
function saveUserImage (img, fileName, type){

    fetch('/pb/save-image', {
      mode: 'cors',
      credentials: 'same-origin',
      headers: {
          'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({ img, playerName: player.name, fileName, type })
    })

    .then(r=>{
      if(type==='shared'){
        alert('Изображение добавлено в общий каталог')
      }
      else{
          alert('Изображение сохранено')
      }

    })
    .catch(err=>{
      alert(err)
    })
}

var saveOpen = false
$('#save').on('click', function (){
    flag2 = false
    $('.bg-user__image-list').hide()
  if(saveOpen){
    saveOpen = false
    $('.save__modal').hide()
  }
  else{
    saveOpen = true
    $('.save__modal').css('display', 'flex')
    $('#save__input').focus()
    fetch(`/pb/user-images?playerName=${player.name}`)
      .then(r=>r.json())
      .then(r=>{
        $('.save__files-list').html('')
        r.map(img=>{
          let $tpl = $(`<div class="user-image-item ${img.type}">${img.fileName}</div>`)
          $('.save__files-list').append($tpl)
        })
      })
    
  }

})

 $('.save__files-list').on('click', '.user-image-item', function (){
    $('#save__input').val(this.innerHTML.split('.')[0])
 })

$('#save__btn').on('click', async function (){
  let val = $('#save__input').val()
  if(val.length>2){
      let img = await canvasToBase64(board.canvas, board.ctx, board.background)
      saveUserImage(img, val, player.name)
      $('.save__modal').hide()
      saveOpen = false
  }
})

/**
 * List images
 */
let flag2 = false
$('#bg__user').on('click', function (){
  $('.files-list').html('')
  saveOpen = false
  $('.save__modal').hide()
  if(flag2){
    flag2 = false
    $('.bg-user__image-list').hide()
  }
  else{
    flag2 = true

    fetch(`/pb/user-images?playerName=${player.name}`)
      .then(r=>r.json())
      .then(r=>{


        r.map(img=>{
          let $tpl = $(`<div class="user-image-item ${img.type}">
                          <span class='user-image-item__filename' data-type='${img.type}'>${img.fileName}</span>
                          <span class='user-image-item__remove ${img.type}' data-file="${img.fileName}">x</span>
                      </div>`)
          $('.files-list').append($tpl)
        })
        $('.bg-user__image-list').show()
        $('#load__input').focus()
      })
    
  }

})


$('.files-list').on('click', '.user-image-item__filename', function (){
  let playerName = $(this).data('type')
 let url = `./images/${playerName}/${ $(this).html() }`
  const imgUrl = new URL(url, import.meta.url)
  board.setBackground(imgUrl)
  $('.bg-user__image-list').hide()
  flag2 = false
})
/**
 * Load image by URL
 */

function uploadImage (file){

    fetch('/pb/upload-image', {
      mode: 'cors',
      credentials: 'same-origin',
      headers: {
          'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({file, playerName: player.name })
    })

    .then(r=>{
      console.log(r.status)
    })
    .catch(err=>{
      alert(err)
    })

}




$('#load__btn').on('click', function (){
  let url = $('#load__input').val()
  uploadImage (url)
  $('.bg-user__image-list').hide()
  flag2 = false
  $('#load__input').val('')
})


$('#clipboard__btn').on('click', function (){
  
navigator.clipboard.readText()
  .then(text => {
    $('#load__input').val(text)
    
  })
  .catch(err => {
    // возможно, пользователь не дал разрешение на чтение данных из буфера обмена
    console.log('Something went wrong', err);
  });
})


/**
 * Change background
 */


$('#bg__black').on('click', function (){

  board.setBackground('./images/backgrounds/black.jpg')
})

$('#bg__white').on('click', function (){

    board.setBackground('./images/backgrounds/white.jpg')
})

$('#bg__greed').on('click', function (){

  board.setBackground('./images/backgrounds/greed.jpg')
})

//
/**
 * Remove Image
 */



function removeImage (fileName){

    fetch('/pb/remove-image', {
      mode: 'cors',
      credentials: 'same-origin',
      headers: {
          'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({fileName, playerName: player.name })
    })

    .then(r=>{
      alert('Изображение удалено')
    })
    .catch(err=>{
      alert(err)
    })

}

$('.files-list').on('mousedown', '.user-image-item__remove', function (){

  let fileName = $(this).data('file')
  $('.bg-user__image-list').hide()
  removeImage (fileName)
})
/**
 * Share
 */
let sharedID = new URL(location.href).searchParams.get('id')


if(sharedID){

let $tpl = $(`
              <div class="paint-board__item" id="share"><i class="fa fa-share-alt" style="font-size: 22px;" aria-hidden="true"></i></div>
              <div class="paint-board__item" id="shared__remove"><i class="fa fa-chain-broken" aria-hidden="true"></i></div>
              <div id="url__param"></div>
            `)

$('.paint-board__fs').append($tpl)

$('#url__param').html(sharedID)
$('#share').on('mousedown', function (){
 
      fetch('/pb/shared-images')
        .then(r=>r.json())
        .then(async  files=>{
          
          let img = await canvasToBase64(board.canvas, board.ctx, board.background)
          saveUserImage(img, sharedID+'_'+(files.length+1) , 'shared')
        })
})


$('#shared__remove').on('mousedown', function (){

      fetch(`/pb/shared-remove?id=${sharedID}`)
        .then(files=>{
          alert('Директория [ shared ] очищена')
          
        })

})


}






function alert (msg){
  $('#modal__msg').html(msg)
  $('.modal__alert').fadeIn()
  setTimeout(()=>{

    $('.modal__alert').fadeOut()
    $('#modal__msg').html('')
  }, 1500)

}