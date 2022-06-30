

(function (){

window._io = new IO()
_io.loadFileByUrl()

setTimeout(()=>{
  console.log(tempItems)
}, 3000)
/**
 * Save
 */
$html('#save-file').addEventListener('click', function (e){
  _io.openSaveModal()

})
$html('#mcap__save-btn').addEventListener('mousedown', e=>{
  e.preventDefault();
  _io.saveJSON()
}, false)
/**
 * Load
 */

$html('#load-file').addEventListener('mousedown', function (e){
  _io.openLoadModal()

})

/**
 * close
 */
document.querySelectorAll('.modal__close').forEach(btn=>{
    btn.addEventListener('mousedown', function(e){
         _io.closeAllModal()
    })
})



Canvas.prototype.zoomMC = function (scale) {

  // Convert pinch coordinates to canvas coordinates

  // Zoom at mouse pointer
 // canvas.context.translate(x, y);
  canvas.context.scale(scale, scale)
  canvas.scale = canvas.scale * scale;
  //canvas.context.translate(-(x), -(y));
  //canvas.panX += ((x / scale) - x) * canvas.scale;
  //canvas.panY += ((y / scale) - y) * canvas.scale;

  canvas.requestPaint();


}





/*добавление кнопок в панель инструментов*/
function mcapAddBtns(){


    const mc_tpl_plus = `<button data-id="mc_plus" class="tool tool__keyboard">
                              <svg data-id="mc_plus" style="width:24px;height:24px" viewBox="0 0 24 24">
                                  <path data-id="mc_plus" fill="gray" d="M15.5,14L20.5,19L19,20.5L14,15.5V14.71L13.73,14.43C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.43,13.73L14.71,14H15.5M9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14M12,10H10V12H9V10H7V9H9V7H10V9H12V10Z" />
                            </svg>
                        </button>`
    const mc_tpl_minus = `<button data-id="mc_minus" class="tool tool__keyboard">
                              <svg  data-id="mc_minus" style="width:24px;height:24px" viewBox="0 0 24 24">
                                  <path data-id="mc_minus"  fill="gray" d="M15.5,14H14.71L14.43,13.73C15.41,12.59 16,11.11 16,9.5A6.5,6.5 0 0,0 9.5,3A6.5,6.5 0 0,0 3,9.5A6.5,6.5 0 0,0 9.5,16C11.11,16 12.59,15.41 13.73,14.43L14,14.71V15.5L19,20.5L20.5,19L15.5,14M9.5,14C7,14 5,12 5,9.5C5,7 7,5 9.5,5C12,5 14,7 14,9.5C14,12 12,14 9.5,14M7,9H12V10H7V9Z" />
                              </svg>
                        </button>`

    $html('.tools-2').innerHTML += mc_tpl_plus+mc_tpl_minus
    $html('.tools-2').addEventListener('mousedown', function(e){
        var id = e.target.getAttribute('data-id')
        if(id==='mc_minus'){
            canvas.zoomMC(0.9)
        }
        if(id==='mc_plus'){
            canvas.zoomMC(1.1)
        }
    })


/*Enter, Esc, Space*/

//sceneControl(action, data)

$html('#mc__Enter').addEventListener('mousedown', e=>{
  sceneControl('Enter', [])
})
$html('#mc__Space').addEventListener('mousedown', e=>{
  sceneControl('Enter', [])
})
$html('#mc__Esc').addEventListener('mousedown', e=>{

  sceneControl("RightClick", [])
})


/**
 * Смещение синий полосок на халте
 */

  setTimeout(()=>{
      canvas.context.translate(200, 200); 
      canvas.panX +=200;
      canvas.panY +=200;
      canvas.requestPaint();
  }, 1000)



}



$html('#foot').style.display = 'none'
document.addEventListener('DOMContentLoaded', mcapAddBtns)




})()




/**
 * init mcap tools
 */


/**
 * copyGeometryToLayer
 * копирование слоя
 */

function copyGeometryToLayer (layer, move){
    for (var i = 0; i < selectionSet.length; i++){
        var copyofitem = cloneObject( items[selectionSet[i]] );
        copyofitem.layer = layer
        items.push(copyofitem);
    }
    if(move){
      sceneControl('Enter', ['E'] )
    }
}




/**
 * rectToLines
 */
function rectToLines (){
  const targetRect = selectedItems[0]
  if(targetRect&&targetRect.type==="Rectangle"||targetRect&&targetRect.type==="RECTANGLE_2_RESTORE"){


    const a = targetRect.points[0]
    const b = targetRect.points[2]

    addLine (a.x, a.y, b.x, a.y, targetRect)

    addLine (a.x, b.y, b.x, b.y, targetRect)
    addLine (a.x, a.y, a.x, b.y, targetRect)
    addLine (b.x, a.y, b.x, b.y, targetRect)
    setTimeout(()=>{
        items = items.filter(item=>{
                    if(item.type==='Rectangle'&&JSON.stringify(item.points)===JSON.stringify(targetRect.points)){
                      return false
                    }
                    else if(item.type==='RECTANGLE_2_RESTORE'&&JSON.stringify(item.points)===JSON.stringify(targetRect.points)){
                      return false
                    }
                    else{
                        return true
                    }
                })
    }, 0)
    reset()

  }
  else{
    
    sceneControl('Enter', ['RTL'] )
  }

}




