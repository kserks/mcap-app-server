(function (){



function $html(selector){
  return document.querySelector(selector)
}


var player = null
const rndID = new Date().getTime()
try {
      window.mcefQuery({
        request: "info",
        persistent: true,
        onSuccess:response=>{
          player = JSON.parse(response)
        }
      });
 } catch (err) {
      player = {
        name: 'mcap_uknown',
        uuid: new Date().toLocaleString()
      }
}



Canvas.prototype.zoomMC = function (scale) {

  // Convert pinch coordinates to canvas coordinates
  var x =  canvas.scale;
  var y =  canvas.scale;

  // Zoom at mouse pointer
 // canvas.context.translate(x, y);
  canvas.context.scale(scale, scale)
  canvas.scale = canvas.scale * scale;
  //canvas.context.translate(-(x), -(y));
  //canvas.panX += ((x / scale) - x) * canvas.scale;
  //canvas.panY += ((y / scale) - y) * canvas.scale;

  canvas.requestPaint();


}
function loadFileByUrl(){

  const url = new URL(location.href)
  let fileName = url.searchParams.get('file')
  let userName = url.searchParams.get('user')
  if(fileName){
    fetch(`/cad/files/${userName||player.name}/${fileName}.dxf`)
      .then(r=>r.blob())
      .then(readFile)
  }
}

loadFileByUrl()


/*добавление кнопок в панель инструментов*/
function mcapAddBtns(){

    var toolbar = $html('.toolbar')
    var mc_tpl_plus = `<div  class="tooltip">
                          <button data-id="mc_plus" class="tool">
                              <svg data-id="mc_plus" style="width:24px;height:24px" viewBox="0 0 24 24">
                                  <path data-id="mc_plus" fill="gray" d="M15.5,14L20.5,19L19,20.5L14,15.5V14.71L13.73,14.43C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.43,13.73L14.71,14H15.5M9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14M12,10H10V12H9V10H7V9H9V7H10V9H12V10Z" />
                            </svg>
                          </button>
                      </div>`
    var mc_tpl_minus = `<div  class="tooltip">
                            <button data-id="mc_minus" class="tool">
                              <svg  data-id="mc_minus" style="width:24px;height:24px" viewBox="0 0 24 24">
                                  <path data-id="mc_minus"  fill="gray" d="M15.5,14H14.71L14.43,13.73C15.41,12.59 16,11.11 16,9.5A6.5,6.5 0 0,0 9.5,3A6.5,6.5 0 0,0 3,9.5A6.5,6.5 0 0,0 9.5,16C11.11,16 12.59,15.41 13.73,14.43L14,14.71V15.5L19,20.5L20.5,19L15.5,14M9.5,14C7,14 5,12 5,9.5C5,7 7,5 9.5,5C12,5 14,7 14,9.5C14,12 12,14 9.5,14M7,9H12V10H7V9Z" />
                              </svg>
                            </button>
                        </div>`

    toolbar.innerHTML += mc_tpl_plus+mc_tpl_minus
    toolbar.addEventListener('mousedown', function(e){
        var id = e.target.getAttribute('data-id')
        if(id==='mc_minus'){
            canvas.zoomMC(0.9)
        }
        if(id==='mc_plus'){
            canvas.zoomMC(1.1)
        }
    })
/**
 * Save
 */
var saveOpen = false
$html('#save-file').addEventListener('click', function (e){
  $html('#load__modal').style.display = 'none'
  loadOpen = false

  if(saveOpen){
    $html('#save__modal').style.display = 'none'
    saveOpen = false
 
  }
  else{
    $html('#save__modal').style.display = 'flex'
    saveOpen = true
  }
$html('#mcap__filename').focus()
$html('#save-list__modal').innerHTML = ""
fetch(`/cad/dir?player=${player.name}`)
  .then(r=>r.json())
  .then(r=>{
      r.map(fileName=>{

        let el = document.createElement('li')
          el.innerHTML = fileName
          el.addEventListener('mousedown', e=>{
                document.querySelector('#mcap__filename').value = e.target.innerHTML.split(".dxf")[0]

          })
          $html('#save-list__modal').appendChild(el)
      })

  })



$html('#mcap__save-btn').addEventListener('mousedown', e=>{
  var fileName = $html('#mcap__filename').value
var body = {
      playerName: player.name,
      fileName: fileName+'.dxf',
      data:  savedxf()
    }
   

  fetch('/cad/save-file', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(body)
  })
  .then(r=>{
    $html('#save__modal').style.display = 'none'
    saveOpen = false
  })
})


})

/**
 * Load
 */

var loadOpen = false
$html('#load-file').addEventListener('mousedown', function (e){
$html('#save__modal').style.display = 'none'
saveOpen = false
$html('#load-list__modal').innerHTML = ''
fetch(`/cad/dir?player=${player.name}`)
  .then(r=>r.json())
  .then(r=>{
      r.map(fileName=>{

        let el = document.createElement('li')
          el.innerHTML = fileName
          el.addEventListener('mousedown', e=>{
                getFileBody(player.name, e.target.innerHTML)
                $html('#load__modal').style.display = 'none'
                loadOpen = false
          })
          $html('#load-list__modal').appendChild(el)
      })

  })


  if(loadOpen){
    $html('#load__modal').style.display = 'none'
    loadOpen = false
  }
  else{
    $html('#load__modal').style.display = 'block'
    loadOpen = true
  }

function getFileBody(playerName, userFileName){
  fetch(`/cad/files/${player.name}/${userFileName}`)
    .then(r=>r.blob())
    .then(r=>{
      readFile(r)
      $html('#load__modal').style.display = 'none'
      loadOpen = false
    })  
}

})

/**
 * close
 */
document.querySelectorAll('.modal__close').forEach(btn=>{
    btn.addEventListener('mousedown', function(e){
      loadOpen = false
      saveOpen = false
      $html('#load-list__modal').innerHTML = ''
      $html('#save-list__modal').innerHTML = ''
      document.querySelectorAll('.files__modal').forEach(item=>{
        item.style.display = 'none'
      })
    })
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
/*
 * координаты
 */
var tootipElement = document.createElement('div')
    Object.assign(tootipElement.style, {
        'min-width': '100px',
        display: 'inline-flex',
        color: 'gray',
        position: 'absolute',
        right: '20px',
        top: '50%',
        transform: 'translateY(-50%)'
    })
    $html('.toolbar').appendChild(tootipElement)



var coordLabel2 = document.createElement('div')
    coordLabel2.id = 'coordLabel2'
    Object.assign(coordLabel2.style, {
      'white-space': 'nowrap',
      'text-transform': 'lowercase'
    })
    tootipElement.appendChild(coordLabel2)



$html('#designCanvas').addEventListener('mousemove', e=>{
  let data = $html('#coordLabel').innerHTML
  let replaceData = data.replace('X:', '<span">x: </span>')
                        .replace('Y:', '<span">&nbsp;&nbsp;y: </span>')

  $html('#coordLabel2').innerHTML = replaceData
})


/**
 * main cross
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

/**
 * Переопределяем функцию в файле ./js/lib/fileio.js
 * отличие от стандартной в том, что эта функция 
 * возвращает объект { data } на последней строчке
 * остальное без изменений
 */

function savedxf() {

  var data = ""
    data = data.concat(
      //Create Header Data
      "999",
      "\nDXF created from www.Design-App.co.uk",
      "\n0",
      "\nSECTION",
      "\n2",
      "\nHEADER",
      "\n9",
      "\n$ACADVER",
      "\n1",
      "\nAC1009",
      "\n9",
      "\n$CLAYER",
      "\n8",
      "\n" + LM.getCLayer(),
      "\n0",
      "\nENDSEC"
)

    data = data.concat(
      "\n0",
      "\nSECTION",
      "\n2",
      "\nTABLES",
      "\n0",
      "\nTABLE",
      "\n2",
      "\nLAYER",
      "\n70",
      "\n" + LM.layerCount())

    for (var i = 0; i < LM.layerCount(); i++) {
      data = data.concat("\n", LM.getLayerByIndex(i).dxf())
    }

    data = data.concat(
      "\n0",
      "\nENDTAB",
      //"\n0",
      //"\nENDSEC"
    )

    data = data.concat(
      "\n0",
      "\nTABLE",
      "\n2",
      "\nSTYLE",
      "\n70",
      "\n" + SM.styleCount())

    for (var i = 0; i < SM.styleCount(); i++) {
      data = data.concat("\n", SM.getStyleByIndex(i).dxf())
    }

    data = data.concat(
      "\n0",
      "\nENDTAB",
      //"\n0",
      //"\nENDSEC"
    )

    var extents = getSceneExtents() //Scene.canvas.getExtents();

    var width = extents.xmax - extents.xmin;
    var height = extents.ymax - extents.ymin;

  data = data.concat(
      //"\n0",
      //"\nENDTAB",
      //"\n0",
      //"\nSECTION",
      "\n0",
      "\nTABLE",
      "\n2",      //Table Name
      "\nVPORT",
      "\n70",     //Number of entries in table
      "\n1",
      "\n0",
      "\nVPORT",
      "\n2",      
      "\n*ACTIVE",
      "\n70",     //vport flags
      "\n0",  
      "\n10",     //lower left corner x pos
      "\n0.0",
      "\n20",     //lower left corner y pos
      "\n0.0",
      "\n11",     //upper right corner x pos
      "\n1.0",
      "\n21",     //upper right corner y pos    
      "\n1.0",
      "\n12",     //view centre x pos
      "\n" + Number(extents.xmin + width / 2),
      "\n22",     //view centre y pos
      "\n" + Number(extents.ymin + height / 2),
      "\n13",     //snap base point x
      "\n0.0",
      "\n23",     //snap base point y
      "\n0.0",
      "\n14",     //snap spacing x
      "\n10.0",
      "\n24",     //snap spacing y
      "\n10.0",
      "\n15",     //grid spacing x
      "\n10.0",
      "\n25",     //grid spacing y
      "\n10.0",
      "\n16",     //view direction (x) from target point
      "\n0.0",
      "\n26",     //view direction (y) from target point
      "\n0.0",
      "\n 36",    //view direction (z) from target point
      "\n1.0",
      "\n 17",    //view target point x
      "\n0.0",
      "\n 27",    //view target point y
      "\n0.0",
      "\n 37",    //view target point z
      "\n0.0",
      "\n40",     //VPort Height
      "\n" + height,
      "\n41",     //Vport height/width ratio
      "\n" + width / height,
      "\n42",     //Lens Length
      "\n50.0",
      "\n 43",    //Front Clipping Plane
      "\n0.0",
      "\n 44",    //Back Clipping Plane
      "\n0.0",
      "\n 50",    //Snap Rotation Angle
      "\n0.0",
      "\n 51",    //View Twist Angle
      "\n0.0",
      "\n71",     //Viewmode (System Variable)
      "\n0",
      "\n72",     //Cicle sides
      "\n1000",
      "\n73",     //?
      "\n1",
      "\n74",     //UCSICON Setting
      "\n3",
      "\n75",     //?
      "\n 0",
      "\n76",     //?
      "\n 1",
      "\n77",     //?
      "\n 0",
      "\n78",     //?
      "\n0",
      "\n0",
      "\nENDTAB",
      "\n0",
      "\nENDSEC")

    data = data.concat(
      "\n0",
      "\nSECTION",
      //Create Entity Data
      "\n2",
      "\nENTITIES")

    for (var i = 0; i < items.length; i++) {
      data = data.concat("\n", items[i].dxf())
    }

    data = data.concat(
      //End Entity and Close File
      "\n0",
      "\nENDSEC",
      "\n0",
      "\nEOF")

    return data

}
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
       
  

     
             
          
  listItems.push({
      name: "Set Current",
      action: function() {
          console.log("Set Current clicked layer:", layerIndex)
          LM.setCLayer(LM.getLayerByIndex(layerIndex).name);
          closePopover();
          loadLayers();
      }
  })
           listItems.push({
                    name: "Delete",
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

