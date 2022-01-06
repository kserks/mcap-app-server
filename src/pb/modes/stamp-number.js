class StampNumber {
  constructor (x, y, width, height, color, data, id=null){
    this.id = id
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.color = color
    this.data = data
  }
  render (ctx){
    ctx.save()
    ctx.beginPath()


    
    ctx.font = "30px serif";

    if(this.data==='✔️'){

        ctx.fillStyle = 'green'
        ctx.fillText(this.data, this.x-10, this.y+11)   
    }
    /*
    else if(this.data==='!'){
        ctx.fillStyle = 'cyan'
        ctx.fillText(this.data, this.x-5, this.y+9)   
        //ctx.fillRect(this.x-this.width/2, this.y-this.height/2, this.width, this.height)
    }
    else if(this.data==='?'){
        ctx.fillStyle = 'orange'
        ctx.fillText(this.data, this.x-5, this.y+9)   
       // ctx.fillRect(this.x-this.width/2, this.y-this.height/2, this.width, this.height)
    }*/
    else{
        ctx.fillStyle = this.color 
        ctx.fillRect(this.x-this.width/2, this.y-this.height/2, this.width, this.height) 
        ctx.fillStyle = '#ffffff'
        ctx.fillText(this.data, this.x-7, this.y+9) 
    }
    
    ctx.closePath() 
    ctx.restore()
  }
}


export default function (point_1, point_2, data){
    let width = 50
    let height = 50
    this.draw(new StampNumber(point_1.x, point_1.y, width, height, this.color, data))
    this.update()
}



