


export class Img {
  constructor (id, url){
    this.id = id
    this.url = url//new Image()
    this.img = new Image()
  }
  render (ctx){
    
    this.img.src = new URL('./images/backgrounds/greed.jpg', import.meta.url)
    this.img.onload = ()=>{
      ctx.drawImage(this.img, 0, 0)
    }
  }
}

export default function (id, url){

    this.draw(new Img(id, url))
    this.update()
}