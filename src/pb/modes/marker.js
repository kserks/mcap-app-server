
class Marker {
  constructor (fromX, fromY, toX, toY, color, id=null, _board){
      this.fromX = fromX
      this.fromY = fromY
      this.toX = toX
      this.toY = toY
      this.id = id
      this.color = color
      this.weight = _board.weightMarker
  }

  render (ctx){
    ctx.save()
    ctx.beginPath()
    ctx.strokeStyle = this.color
    ctx.globalAlpha = 0.5
    ctx.lineWidth = this.weight
    ctx.lineCap = 'round'
    ctx.moveTo(this.fromX, this.fromY)
    ctx.lineTo(this.toX, this.fromY)
    ctx.stroke()
    ctx.restore()
  }
}

export default function (point_1, point_2, _color){
    this.draw(new Marker( point_1.x, point_1.y, point_2.x, point_2.y, _color, 0, this ))
    this.update()
}