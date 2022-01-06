class Rect {
  constructor (x, y, width, height, color, id=null, _board){
    this.id = id
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.color = color
    this.dashed = _board.ctx.dashed
    this.weight = _board.ctx.lineWidth
  }
  render (ctx){
    ctx.save()
    ctx.beginPath()
    ctx.strokeStyle = this.color
    ctx.lineWidth = this.weight
    ctx.setLineDash(this.dashed)
    ctx.strokeRect(this.x, this.y, this.width, this.height)
    ctx.closePath() 
    ctx.restore()
  }
}


export default function (point_1, point_2){
    let width = point_2.x-point_1.x
    let height =  point_2.y-point_1.y
    this.draw(new Rect(point_1.x, point_1.y, width, height, this.color, 'rect', this))
    this.update()
}