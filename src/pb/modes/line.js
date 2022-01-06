
class Line {
  constructor (fromX, fromY, toX, toY, id=null, _board){
      this.fromX = fromX
      this.fromY = fromY
      this.toX = toX
      this.toY = toY
      this.id = id
      this.color = _board.color
      this.dashed = _board.ctx.dashed
      this.weight = _board.ctx.lineWidth
  }

  render (ctx){
    ctx.save()
    ctx.beginPath()
    ctx.strokeStyle = this.color
    ctx.lineWidth = this.weight
    ctx.lineCap = 'round'
    ctx.moveTo(this.fromX, this.fromY)
    ctx.lineTo(this.toX, this.toY)
    ctx.setLineDash(this.dashed)
    ctx.stroke()
    ctx.restore()
  }
}

export default function (point_1, point_2){
    this.draw(new Line( point_1.x, point_1.y, point_2.x, point_2.y, 0, this ))
    this.update()
}