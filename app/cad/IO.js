

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
        .then(r=>{
            r.map(fileName=>{
                const el = document.createElement('li')
                el.innerHTML = fileName
                el.addEventListener('mousedown', e=>{
                      document.querySelector('#mcap__filename').value = e.target.innerHTML.split(".dxf")[0]

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
    .then( r => this.hideSaveModal() ) 
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
    loadedData.layers.map(l=>{
      LM.addLayer(l)
    })
    items = loadedData.items.map(item=>{
        const points = item.points.map( p => new Point(p.x, p.y) )
        

        const data = {
          points,
          colour: item.colour,
          layer: item.layer
        }
        if(item.type==='Rectangle'){
          item.type = 'Polyline'
        }
        const shape = new window[item.type](data)

        return shape
    })
   // addToScene(items)
    LM.checkLayers();
    canvas.requestPaint();
  }
  loadFileByUrl(){
    const url = new URL(location.href)
    const fileName = url.searchParams.get('file')
    const userName = url.searchParams.get('user')
    if(fileName){
      fetch(`files/${userName||this.player.name}/${fileName}.json`)
        .then(r=>r.json())
        .then(this.renderItems)
    }
  }

  getFileBody(fileName){
    fetch(`files/${this.player.name}/${fileName}`)
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
    files.map(fileName=>{
              const el = document.createElement('li')
              el.innerHTML = fileName
              el.addEventListener('mousedown', e=>{
                    this.getFileBody(e.target.innerHTML)
                    this.hideLoadModal()
              })
              $html('#load-list__modal').appendChild(el)
    })


  }
}
