<script>
import { onMount } from 'svelte';

import { currentImage,config, playerName, placeId, imageFileType, itemId, eventId, itemData, places } from '../stores.js'

try {
      window.mcefQuery({
          request: "info",
          persistent: true,
          onSuccess: response=>{
              $playerName =  JSON.parse(response).name;
          }
      })
    }
    catch (errorCode) {
        $playerName = false
    }

let updated = false




let IMG = null
onMount(()=>{

function getExt(file){
  if($itemData ){
      return $itemData.ext
  }
  else{
      return file.type.split('/')[1]
  }
}


IMG.addEventListener('change', event=>{

    let file = IMG.files[0]
    let ext = file.type.split('/')[1]
    if(ext==='jpeg'){
          ext = 'jpg';
    }
    let name = `${$placeId}_____${$eventId}_____${$itemId}.${ext}`
    // конструкторы для подготовки изображения для отправки на сервер
    let newFile = new File([file], name, { type: file.type })
    let body = new FormData()
    body.append('file', newFile)

    fetch('/gallery/art/saveImage', { method: 'POST', body })
          .then(data => {
                  // убираем красный клас
                  $places = $places.map(item=>{
                                if(item.text===$itemId){
                                              item.exist = true;
                                }
                                return item;
                            })
                  //показываем загружнное изображение
                  //добавляю немного мусора что бы url отличался и свойство обновлялись
                  let url = `/${config.artDir}/${$placeId}/arh/${$eventId}/${$itemId}.${ext}?v=${new Date().getTime()}`
                  $currentImage.url = url
                  $imageFileType = ext
                  //показываем зеленый клас
                  updated = true
                  setTimeout(()=>{ updated = false; },1000)

          })
          .catch(error => console.error(error) )
})

})



</script>

<div class="component">
  <div class="image-viewer">
      <div class="image" style="background-image: url({$currentImage.url||''})"></div>
  </div>
  {#if !$playerName}
    <div class="btn-wrapper {$itemId?'':'disabled'}">
      
        <div class="image-upload" >
          <label for="file-input">
            <div class="btn {updated?'updated':''}">Загрузить</div>
          </label>

          <input id="file-input" type="file" accept="image/*" bind:this={IMG}/>
        </div>
    </div>
  {/if}

 
</div>

<style scoped>


.component{
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.image-viewer{
  width: 100%;
  height: 85%;
}
.image{
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
}
.btn-wrapper{
  justify-content: flex-end;
}
.btn{
  
}
.image-upload>input {
  display: none;
}
.image-upload label{
 padding: 0;
}

</style>