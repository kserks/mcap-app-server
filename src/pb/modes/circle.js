class Circle {
  constructor (x, y, r, color, id=null, _board){
    this.x = x
    this.y = y
    this.r = r
    this.id = id
    this.color = color
    this.dashed = _board.ctx.dashed
    this.weight = _board.ctx.lineWidth
  }
  render (ctx){

    ctx.save()

    ctx.beginPath()
    ctx.strokeStyle = this.color
    ctx.setLineDash(this.dashed)
    ctx.lineWidth = this.weight
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false)
    ctx.closePath()
    ctx.stroke()

    ctx.restore()

  }
}


export default function (point_1, point_2){
    let width = point_2.x-point_1.x
    let height =  point_2.y-point_1.y
    let r = Math.sqrt( Math.pow(width, 2)+Math.pow(height, 2) )
    this.draw( new Circle( point_1.x, point_1.y, r, this.color, 123, this ) )
    this.update()
}