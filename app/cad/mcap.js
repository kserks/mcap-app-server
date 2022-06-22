

(function (){

window._io = new IO()
_io.loadFileByUrl()


/**
 * Save
 */
$html('#save-file').addEventListener('click', function (e){
  _io.openSaveModal()

})
$html('#mcap__save-btn').addEventListener('mousedown', e=>{
  e.preventDefault();
  _io.saveJSON()
})
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
  },1000)



}



$html('#foot').style.display = 'none'
document.addEventListener('DOMContentLoaded', mcapAddBtns)




})()

/*
 * Делаем дополнительные кнопки для слоёв
 */
function getlayerBtns(layerIndex, layerID, dataList){
        var listItems = []

/*
              listItems.push({
                    name: "Rename",
                    action: function() {
                        console.log("Rename layer:", LM.getLayerByIndex(layerIndex).name);
                        closePopover();
                        var edit = document.getElementById(layerID)
                        var style = getComputedStyle(document.body);
                        var colour = style.getPropertyValue('--active-colour');
                        edit.style.outline = colour + " solid 1px"
                            // set the focus on the text edit. timer needed as a hack
                        window.setTimeout(function() {
                            edit.focus();
                        }, 0);
                    }
                })
*/
  console.log(LM.getLayerByIndex(layerIndex).name)
             
  //set current        
  listItems.push({
      name: `<svg style="width:24px;height:24px" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" />
            </svg>`,
      action: function(){
          LM.setCLayer(LM.getLayerByIndex(layerIndex).name)
          closePopover()
          loadLayers()
      }
  })
  // copy to
  listItems.push({
      name: `<svg style="width:24px;height:24px" viewBox="0 0 24 24">
                <path fill="currentColor" d="M14,2A8,8 0 0,0 6,10A8,8 0 0,0 14,18A8,8 0 0,0 22,10A8,8 0 0,0 14,2M4.93,5.82C3.08,7.34 2,9.61 2,12A8,8 0 0,0 10,20C10.64,20 11.27,19.92 11.88,19.77C10.12,19.38 8.5,18.5 7.17,17.29C5.22,16.25 4,14.21 4,12C4,11.7 4.03,11.41 4.07,11.11C4.03,10.74 4,10.37 4,10C4,8.56 4.32,7.13 4.93,5.82Z" />
            </svg>`,
      action: function() {
          const { name } = LM.getLayerByIndex(layerIndex)
          copyGeometryToLayer (name)
      }
  })
  // move to
  listItems.push({
      name: `<svg style="width:24px;height:24px" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
            </svg>`,
      action: function() {
          const { name } = LM.getLayerByIndex(layerIndex)
          copyGeometryToLayer (name, true)
      }
  })
  // delete
  listItems.push({
      name: `<svg style="width:24px;height:24px" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" />
            </svg>`,
      action: function() {
          LM.deleteLayer(layerIndex);
          closePopover();
          loadLayers();
          canvas.requestPaint();
      }
  }) 


  if(layerIndex||layerIndex===0){
      var el = document.createElement('div')
      el.className = 'mcap__del-ctx'
      listItems.map(btn=>{
        let btnLayer = document.createElement('span')
        btnLayer.className = 'btn__layer'
        btnLayer.innerHTML = btn.name
        btnLayer.addEventListener('mousedown', e=>{
          btn.action()
        })
        el.appendChild(btnLayer)
      })
      dataList.appendChild(el) 

  }
}



document.querySelector('#LayerManagerList').addEventListener('mousedown', function (e){

  const layerIndex = Number(e.target.parentElement.id)
  const dataList = e.target.parentElement.parentElement.querySelector('.layerManagerListItemDetails')

  if (layerIndex===0) {
    var layerID = '0-layer'
    getlayerBtns(layerIndex, layerID, dataList)
  }
  else if(layerIndex){

    const layerID = e.target.id.split('-layer')[0]
    getlayerBtns(layerIndex, layerID, dataList)
  }

})



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
  let rect = selectedItems[0]
  if(rect&&rect.type==="Rectangle"){


    let a = rect.points[0]
    let b = rect.points[2]

    addLine (a.x, a.y, b.x, a.y)

    addLine (a.x, b.y, b.x, b.y)
    addLine (a.x, a.y, a.x, b.y)
    addLine (b.x, a.y, b.x, b.y)
    setTimeout(()=>{
        items = items.filter(item=>{
                    if(item.type==='Rectangle'&&JSON.stringify(item.points)===JSON.stringify(rect.points)){

                    }
                    else{
                        return true
                    }
                })
    }, 0)

  }
  else{
    
    sceneControl('Enter', ['RTL'] )
  }

}

