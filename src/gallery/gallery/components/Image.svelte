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

$:updated = false

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
     
          var file = IMG.files[0]
          var ext = file.type.split('/')[1]
          var name = `${$placeId}_____${$eventId}_____${$itemId}.${ext}`

          let newFile = new File([file], name, { type: file.type })
          let formData = new FormData()
          formData.append('file', newFile)

          fetch('/gallery/art/saveImage', {
                    method: 'POST',
                    body: formData
          })
          .then(data => {
              // убираем красный клас
                $places = $places.map(item=>{
                              if(item.text===$itemId){
                                item.exist = true
                              }

                              return item
                          })
              let url = `/${config.artDir}/${$placeId}/arh/${$eventId}/${$itemId}.${ext}`
             $currentImage.url = url
             $imageFileType = ext
                  updated = true
                  setTimeout(()=>{updated = false},1000)

          })
          .catch(error => {
              console.error(error)
          })
})

})



</script>

<div class="component">
  <div class="image-viewer">
      <div class="image" style="background-image: url({$currentImage.url||''})"></div>
  </div>
  {#if !$playerName}
    <div class="btn-wrapper {$itemId?'':'disabled'}">
      
        <div class="image-upload {updated?'updated':''}" >
          <label for="file-input">
            <div class="btn">Загрузить</div>
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