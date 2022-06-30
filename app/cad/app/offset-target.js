/*
 * координаты
 */

class ToolsCoords {
  offsetCoordsFlag = false
  renderMarker = true
  offsetCoords = {x: 0, y: 0}
  objData = null
  $originalCoordsString = $html('#coordLabel')
  $coordsData = $html('.coords-data')
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
    // mouse.x = this.objData.x

/**
    this.objData = {
            x: Math.floor( __mcap.data.x - this.offsetCoords.x-1 ),
            y: Math.floor( __mcap.data.y - this.offsetCoords.y+1 ),
            delta: Math.floor(__mcap.data.len),
            ang: Math.floor(__mcap.data.angle),
    }
 */
  }
  // mousemove
  выводКоординат (){
    this.подготовкаОбъектаСДанными()
    /*
     * Подготовка строки для вывода
     */
    let outputData;
    outputData = `x: <span class="coords-data__num">${this.objData.x} </span>y: <span class="coords-data__num">${this.objData.y} </span>` 
    if(this.objData.delta){
      outputData += `Δ: <span class="coords-data__num">${this.objData.delta}</span>`
    }
    if(this.objData.ang){
      outputData += ` ∠:  <span class="coords-data__num">${this.objData.ang}</span>`
    }
    this.$coordsData.innerHTML = outputData
  }
  
  addOffsetCircleMarker (x, y){
        //const { x, y } = this.offsetCoords
        const x2 = x+20
        const y2 = 0
        const data = {
            points: [ new Point(x, y), new Point(x2, y2) ],
            colour: "BYLAYER",
            layer: LM.getCLayer()
        }
        const circle = new OFFSET_TARGET(data)
        //const circle = new Circle(data)
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


const TC = new ToolsCoords()





$html('.select-target-point').addEventListener('mousedown', e => {
  TC.обработкаКликаПоКнопкеНаПанелиИнтсрументов()
})
$html('#designCanvas').addEventListener('mousedown', e => {
  _io.closeAllModal()
  TC.обработкаКликаПоХолсту()
})
$html('#designCanvas').addEventListener('mousemove', e => {
  TC.выводКоординат()
})

/**
 * Показать маркер ( круг ) смещенных координат
 */
/*
$html('#offset-market-input').addEventListener('change', function (e){
  TC.renderOffsetMarker(this.checked)

})
*/