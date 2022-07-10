// https://gist.github.com/Birdie0/78ee79402a4301b1faf412ab5f1cdcf9

class Discord {

  URL = 'screenshot'
  username = ''
  imageName = ''
  extName = 'jpeg'
  $discordWindow = $html('.pop-up-discord')
  constructor(WEB_HOOK, HOST, param) {
    this.WEB_HOOK = WEB_HOOK
    this.HOST = HOST
    this.avatar_url = `${this.HOST}/cad_json/design.png`
    this.content = param.content
  }
  getImageName (){
    this.username = _io.player.name
    return this.username+ '__' + String( new Date().getTime() ) +'.' + this.extName
  }
  async saveImageToServer (){
    this.imageName = this.getImageName()
    const imageBlob = await new Promise(resolve => canvas.cvs.toBlob(resolve, `image/${this.extName}`))
    const formData = new FormData()
    formData.append("image", imageBlob, this.imageName);

    try{
        const res = await fetch(this.URL, {
          method: 'POST',
          body: formData
        })
        //console.log(this.HOST, ' Изображение сохранено')
        this.sendMessage()
    }
    catch(err){
        console.error(err)
    }

  }
  get imageURL (){
    return `${this.HOST}/cad_json/screenshots/${this.imageName}`
  }
  async sendMessage() {
      const body = {
              avatar_url: this.avatar_url,
              content: this.content,
              username: this.username,
              embeds: [
                {
                  description: $html('.pop-up-discord__textarea').value,
                  image: {
                      url: this.imageURL
                  }
                }
              ]
      }

      try{
          const res = await fetch(this.WEB_HOOK, {
            method: 'POST',
            headers: {
              'Content-type': 'application/json'
            },
            body: JSON.stringify(body) 
          })
          $html('.pop-up-discord__textarea').value = ""
      }
      catch(err){
          console.error(err)
      }

  }
  openWindow (){
    this.$discordWindow.style.display = 'flex'
  }
  closeWindow (){
    this.$discordWindow.style.display = 'none'
  }
}

/**
 * START
 */


fetch('config.json')
  .then( r => r.json() )
  .then( config => {

      const PARAMS = {
          avatar_url: '',
          content: '',
          username: '',
          embeds: [
            {
              image: {
                  url: '' 
              }
            }
          ]
      }

      const DS = new Discord(config.WEB_HOOK, config.HOST, PARAMS)

      $html('.discord').addEventListener('mousedown', e => {
          DS.openWindow()
      })

      $html('.pop-up-discord__btn--no').addEventListener('mousedown', e => {
          DS.closeWindow()
      });
      $html('.pop-up-discord__btn--yes').addEventListener('mousedown', e => {
        
          DS.closeWindow()
          DS.saveImageToServer()
      });

  })
  .catch(err => console.error(err))