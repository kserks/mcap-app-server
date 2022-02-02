<script>
import { currentImage } from '../stores.js'

$:playerName = null 

    try {
      window.mcefQuery({
          request: "info",
          persistent: true,
          onSuccess: response=>{
              playerName =  JSON.parse(response).name;
          }
      })
    }
    catch (errorCode) {
        playerName = true//false
    }

$:backgroundImage = `background-image: url(${$currentImage.url});`

</script>

<div class="component">
  <div class="image-viewer">
      <div class="image" style="{$currentImage.url?backgroundImage:''}"></div>
  </div>
  {#if playerName}
    <div class="btn-wrapper">
      <div class="btn">Загрузить</div>
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


</style>