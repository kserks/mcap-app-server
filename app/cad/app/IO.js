const CAD_DIR = '/cad_json'

class IO {
  saveOpen = false
  loadOpen = false
  player = null
  $saveModal = $html('#save__modal')
  constructor() {

    this.getPlayer()
  }
  getPlayer (){
    try {
          window.mcefQuery({
              request: "info",
              persistent: true,
              onSuccess:response=>{
                this.player = JSON.parse(response) 
              }
          })
      } 
      catch (err) {
          this.player = {
              name: 'mcap_uknown',
              uuid: new Date().toLocaleString()
          }
    }
  }
  openSaveModal (){
      this.closeAllModal()
      this.showSaveModal()

      $html('#mcap__filename').focus()
      $html('#save-list__modal').innerHTML = ""
      fetch(`dir?player=${this.player.name}`)
        .then(r=>r.json())
        .then(files=>{
            //console.log(111111111)
            files.user.map(fileName=>{
                const el = document.createElement('li')
                el.innerHTML = fileName
                el.addEventListener('mousedown', e=>{
                      document.querySelector('#mcap__filename').value = e.target.innerHTML.split(".json")[0]

                })
                $html('#save-list__modal').appendChild(el)
            })

        })
        .catch(err=>console.error(err))
  }
  saveJSON() {
    
    const fileName = $html('#mcap__filename').value
    const _items = items.map(item=>{
      return {
        type: item.type,
        points: item.points,
        colour: item.colour,
        layer: item.layer
      }
    })

    const body = {
          playerName: this.player.name,
          fileName: fileName+'.json',
          data: {
            layers: LM.layers,
            items: _items
          } 
    }

    /**
     * Отправляем объекты на сервер
     */
    fetch('save-file', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(body)
    })
    .then( r => { 
      this.hideSaveModal()
      reset()
    }) 
  }
  showSaveModal (){
      this.$saveModal.style.display = 'flex'
      this.saveOpen = true
  }
  hideSaveModal (){
      $html('#save__modal').style.display = 'none'
      $html('#save-list__modal').innerHTML = ''
      this.saveOpen = false
  }
  /**
   * renderItems
   */
  renderItems (loadedData){


    LM.layers = []
    //LM.layers[0].colour = loadedData.layers[0].colour
    //LM.layers[1].colour = loadedData.layers[1].colour
    //LM.layers.slice(2, LM.layers.length-1)
    //loadedData.layers.slice(0, 2)
    loadedData.layers.forEach(l => LM.addLayer(l) )
    
    items = loadedData.items.map(item=>{
        const points = item.points.map( p => new Point(p.x, p.y) )
        

        const data = {
          points,
          colour: item.colour,
          layer: item.layer
        }
        if(item.type==='Rectangle'){
          item.type = 'RECTANGLE_2_RESTORE'
        }
        const shape = new window[item.type](data)

        return shape
    })


    LM.setCLayer(LM.getLayerByIndex(0).name)
    LM.checkLayers();
    reset()
    canvas.requestPaint();
    loadLayers()

  }
  loadFileByUrl(){
    const url = new URL(location.href)
    const fileName = url.searchParams.get('file')
    const userName = url.searchParams.get('user')
    if(fileName){
      fetch(`${CAD_DIR}/${userName||this.player.name}/${fileName}.json`)
        .then(r=>r.json())
        .then(this.renderItems)
    }
  }

  getFileBody(owner, fileName){
    fetch(`${CAD_DIR}/${owner}/${fileName}`)
      .then(r=>r.json())
      .then(r=>{
        this.renderItems(r)
        this.hideLoadModal()
      })  
  }
  hideLoadModal (){
      $html('#load__modal').style.display = 'none'
      $html('#load-list__modal').innerHTML = ''
      this.loadOpen = false
  }
  showLoadModal (){
      $html('#load__modal').style.display = 'block'
      this.loadOpen = true
  }
  closeAllModal (){
      this.hideLoadModal()
      this.hideSaveModal()
  }
  async openLoadModal (){
    this.closeAllModal()
    this.showLoadModal()

    const res = await fetch(`dir?player=${this.player.name}`)
    const files = await res.json()

    const commonFiles = files.common.map(name=>{
                            return { name, dir: 'common' }
                      })
    const userFiles = files.user.map(name=>{
                            return { name, dir: this.player.name }
                      })
    const joinedFiles = [...commonFiles, ...userFiles]

    joinedFiles.forEach(file=>{
              const el = document.createElement('li')
              el.innerHTML = file.name
              el.className = "cad-dir--"+file.dir
              el.addEventListener('mousedown', e=>{
                    this.getFileBody(file.dir, e.target.innerHTML)
                    this.hideLoadModal()
              })
              $html('#load-list__modal').appendChild(el)
    })


  }
}


/*
 * form disable enter
 */
window.addEventListener('keydown',function(e){if(e.keyIdentifier=='U+000A'||e.keyIdentifier=='Enter'||e.keyCode==13){if(e.target.nodeName=='INPUT'&&e.target.type=='text'){e.preventDefault();return false;}}},true);