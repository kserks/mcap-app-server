class Arrow {
  constructor (fromX, fromY, toX, toY, color, id=null){
      this.fromX = fromX
      this.fromY = fromY
      this.toX = toX
      this.toY = toY
      this.color = color
      this.id = id

  }
  render (ctx){
     let aWidth = 7
     let aLength = 25
     let arrowStart = false
     let arrowEnd = true
     let dx = this.toX - this.fromX;
     let dy = this.toY - this.fromY;
     let angle = Math.atan2(dy, dx);
     let length = Math.sqrt(dx * dx + dy * dy);
     ctx.save()
     ctx.beginPath()
     ctx.lineWidth = 10
     ctx.strokeStyle = this.color
     ctx.translate(this.fromX, this.fromY);
     ctx.rotate(angle);
     ctx.beginPath();
     ctx.moveTo(0, 0);
     ctx.lineTo(length, 0);
     if (arrowStart) {
        ctx.moveTo(aLength, -aWidth);
        ctx.lineTo(0, 0);
        ctx.lineTo(aLength, aWidth);
     }
     if (arrowEnd) {
        ctx.moveTo(length - aLength, -aWidth);
        ctx.lineTo(length, 0);
        ctx.lineTo(length - aLength, aWidth);
     }
     ctx.closePath()
     ctx.stroke();
     ctx.setTransform(1, 0, 0, 1, 0, 0);

     ctx.restore()
  }
}

export default function (point_1, point_2){
  this.draw(new Arrow(point_1.x, point_1.y, point_2.x, point_2.y, this.color) )
  this.update()
}