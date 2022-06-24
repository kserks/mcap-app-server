/*
 * Делаем дополнительные кнопки для слоёв
 */
function getlayerBtns(layerIndex, layerID, dataList){
  if(!dataList) return
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



/**
 * INIT LAYER BTNs
 */

const $layerManagerList = document.querySelector('#LayerManagerList')
$layerManagerList.addEventListener('click', function (e){
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