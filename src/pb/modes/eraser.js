class Eraser {
  constructor (x, y, width, height, id=null){
    this.id = id
    this.x = x
    this.y = y
    this.width = width
    this.height = height

  }
  render (ctx){

    ctx.clearRect(this.x, this.y, this.width, this.height)
  }
}




export default function (point_1, point_2){

    let width = point_2.x-point_1.x
    let height =  point_2.y-point_1.y
    this.draw( new Eraser(point_1.x, point_1.y, width, height) )
    this.update()
}
