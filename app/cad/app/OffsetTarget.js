/*
 * координаты
 */

class OffsetTarget {
  offsetCoordsFlag = false
  renderMarker = true
  offsetCoords = {x: 0, y: 0}
  objData = null
  $originalCoordsString = $html('#coordLabel')
  $coorsNode = $html('.coords-data__coords')
  constructor () {
    this.рисуемКружокВЦвентреКоординат()
  }
  рисуемКружокВЦвентреКоординат (){
    this.removeOffsetCircleMarker()

    this.addOffsetCircleMarker(0, 0)
  }
  обработкаКликаПоКнопкеНаПанелиИнтсрументов (){
    this.removeOffsetCircleMarker()
    this.offsetCoordsFlag = true
    this.offsetCoords = {x: 0, y: 0}
  }
  обработкаКликаПоХолсту (){
    if(!this.offsetCoordsFlag) {
        return
    }
    this.offsetCoords.x = this.objData.x
    this.offsetCoords.y = this.objData.y  
    this.offsetCoordsFlag = false 
      //sceneControl('Enter', [])
   /* if(this.renderMarker){
       this.addOffsetCircleMarker()
    }*/
  }
  подготовкаОбъектаСДанными (){
    const _dataArr = this.$originalCoordsString
                                    .innerHTML
                                    .replaceAll(',', '')
                                    .split(" ")
    this.objData = {
            x: Math.ceil( Number(mouse.x) - this.offsetCoords.x-1 ),
            y: Math.floor( Number(mouse.y) - this.offsetCoords.y+1 ),
            delta: _dataArr[5],
            ang: _dataArr[7],
    }
    if(__mcap.snap){
      this.objData.x = this.objData.x+1
      this.objData.y = this.objData.y-1
    }
 
  }
  // mousemove
  выводКоординат (){
    this.подготовкаОбъектаСДанными()

    $html('.coords-data__num--x').innerHTML = this.objData.x
    $html('.coords-data__num--y').innerHTML = this.objData.y
    
    if(this.objData.delta){
      $html('.coords-data__item--delta').style.display = 'block'
      $html('.coords-data__num--delta').innerHTML = this.objData.delta
    }
    else{
      $html('.coords-data__item--delta').style.display = 'none'
    }
    if(this.objData.ang){
      $html('.coords-data__item--ang').style.display = 'block'
      $html('.coords-data__num--ang').innerHTML = this.objData.ang
    }
    else{
      $html('.coords-data__item--ang').style.display = 'none'
    }

  }
  
  addOffsetCircleMarker (x, y){

        const x2 = x+20
        const y2 = 0
        const data = {
            points: [ new Point(x, y), new Point(x2, y2) ],
            colour: "BYLAYER",
            layer: LM.getCLayer()
        }
        const circle = new OFFSET_TARGET(data)
        items.push(circle)
        canvas.requestPaint();
  }

  removeOffsetCircleMarker (){
    items = items.filter(el => !(el._id==='offset-target')  )
    canvas.requestPaint();
  }
  /*
  renderOffsetMarker(flag){
    this.renderMarker = flag
    if(flag){
      this.addOffsetCircleMarker(this.offsetCoords.x, this.offsetCoords.y)
    }
    else{
      this.removeOffsetCircleMarker()
    }
  }*/
}


const OT = new OffsetTarget()





$html('.select-target-point').addEventListener('mousedown', e => {
  OT.обработкаКликаПоКнопкеНаПанелиИнтсрументов()
})
$html('#designCanvas').addEventListener('mousedown', e => {
  _io.closeAllModal()
  OT.обработкаКликаПоХолсту()
})
$html('#designCanvas').addEventListener('mousemove', e => {
  OT.выводКоординат()
})

/**
 * Показать маркер ( круг ) смещенных координат
 */
/*
$html('#offset-market-input').addEventListener('change', function (e){
  OT.renderOffsetMarker(this.checked)

})
*/