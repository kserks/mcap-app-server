const $addText = $html('.coords-data__send')
const $textContainer = $html('.coords-data__input')
const $textRotate = $html('.coords-data__text-rotate-btn')
const $sizeBtn = $html('.coords-data__size')
const $sizesSet = $html('.coords-data__size-set')
const $insBtn = $html('.coords-data__chars')
const $charsSet = $html('.coords-data__chars-set')

class TextControl {
  /**
   * DATA
   */
  enter = false
  angle = 0
  size = 30
  /**
   * UI STATE
   */
  sizeWindowOpenFlag = false
  charsWindowOpenFlag = false
  constructor() {
    // code
  }
  add (string){
        const points = [
                new Point(mouse.x, mouse.y)
        ]
        const data = {
            points,
            colour: "BYLAYER",
            layer: LM.getCLayer(),
            string,
            height: this.size,
            rotation:  - ( this.angle ),
            //horizontalAlignment: 'center',
            //verticalAlignment: 'center',
        }
        const text = new Text(data)
        items.push(text)
        canvas.requestPaint();
  }
  addHandler (){
    if(this.enter){
        this.add($textContainer.value)
        this.reset()
    }
  }
  reset (){
    this.enter = false
    $textContainer.value = ""
    this.angle = -15
    this.rotate()
    this.closeAllWindow()
  }
  rotate (){
    $textRotate.style.transform = `rotate(${this.angle+=15}deg)`
  }
  rotateHandler (){
    this.rotate()
    if(this.angle===360) this.angle = 0
    
  }
  /**
   * Select size
   */
  sizesWindow (){
      this.charsWindowClose()
      if(!this.sizeWindowOpenFlag){
        this.sizesWindowOpen()
      }
      else{
        this.sizesWindowClose()
      }
  }
  sizesWindowOpen (){
    $sizesSet.style.display = 'flex'
    this.sizeWindowOpenFlag = true
  }
  sizesWindowClose (){
    $sizesSet.style.display = 'none'
    this.sizeWindowOpenFlag = false
  }
  setSize (size){
    this.size = size
    $sizeBtn.innerHTML = this.size
    this.sizesWindowClose()
  }
  /**
   * Insert chars
   */
  charsWindow (){
      this.sizesWindowClose()
      if(!this.charsWindowOpenFlag){
        this.charsWindowOpen()
      }
      else{
        this.charsWindowClose()
      }

  }
  charsWindowOpen (){
    $charsSet.style.display = 'flex'
    this.charsWindowOpenFlag = true
  }
  charsWindowClose (){
    $charsSet.style.display = 'none'
    this.charsWindowOpenFlag = false
  }
  setChar (character){

    $textContainer.value += character

    this.charsWindowClose()
  }

  closeAllWindow (){
    this.sizesWindowClose()
    this.charsWindowClose()
  }

}

/**
 * CONTROLS
 */

const _TC = new TextControl()

$addText.addEventListener('mousedown', e => {
  _TC.enter = true
})

$html('#designCanvas').addEventListener('mousedown', e => {
  _TC.addHandler()
})



$html('.coords-data__arrow').addEventListener('mousedown', e => {
  _TC.rotateHandler()

})
/**
 * SELECT SIZE
 */
$sizeBtn.addEventListener('mousedown', e => {

  _TC.sizesWindow()
  
})
$sizesSet.addEventListener('mousedown', e => {
  const isNotTarget = !e.target.className.includes('coords-data__size-item')
  if(isNotTarget) return
  _TC.setSize(Number(e.target.innerHTML))
})

/**
 * SELECT CHARACTERS
 */
$insBtn.addEventListener('mousedown', e => {

  _TC.charsWindow()
  
})
$charsSet.addEventListener('mousedown', e => {

  const isNotTarget =  !e.target.className.includes('coords-data__size-item')

  if(isNotTarget) return
    
  _TC.setChar(e.target.innerHTML)
})

