import cursorPosition from './cursor-position.js'
import evt from './emitter.js'
/*
const canvas2 = document.querySelector('.canvas-container #canvas_0')
      canvas2.width = 1024
      canvas2.height = 717
const ctx2 = canvas2.getContext('2d')
    */
export class Board {
  constructor (canvas, ctx){
    this.scene = []
    this.canvas = canvas
    this.ctx = ctx
    this.ctx.lineWidth = 5
    this.color = "red"
    this.point_1 = null
    this.point_2 - null
    this.currentMode = null
    this.mouseSelectPointsInit()
    this.x = 0
    this.y = 0
    this.loadedImages = {}
    this.evt = evt
    this.background = ''

  }
  draw (obj){

    this.scene.push(obj)
    return this
  }
  update (){

    this.clear()
    for(let i=0;i<this.scene.length;i++){
          this.scene[i].render(this.ctx)
    }
   



  }
  clear (){
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }
  mouseSelectPointsInit (){
    
    this.canvas.addEventListener('mousedown', event=>{
      if(this.point_1){
        this.point_2 = cursorPosition( event )
        this.evt.emit('select-point_2')

      }
      else{
        this.point_1 = cursorPosition( event )
        this.evt.emit('select-point_1')
      }  

    })
   
  }
  setBackground(background) {
      this.scene = []
      this.background = background
      this.ctx.globalCompositeOperation = "destination-out";
      this.clear()
      this.canvas.style.background = `url(${background})`;
      this.canvas.style.backgroundSize = "100% 100%";
      this.canvas.style.backgroundPosition = "center";
      this.canvas.style.backgroundRepeat = "no-repeat";
      this.ctx.globalCompositeOperation = "source-over";
   
  }

  preloadImages (){
    /*
    let images = this.scene.filter(obj=>obj.hasOwnProperty('url'))
    let i = 0
    let load = ()=>{
        if(images.length>i){
          let img = new Image()
              img.src =  images[i].url
              img.onload = ()=>{
                this.loadedImages[images[i].id] = img
                i++
                load()         
              }
        }
        else{
          console.log("postload: ", images)
          this.evt.emit('postload')
        }
    }
    if(images.length!==0){
      load()
    }
    else{
      this.evt.emit('postload')
    }*/

  }
}


