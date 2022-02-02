<script>
import api from '../helpers/api.js'
import { currentImage } from '../stores.js'



async function save (){

try{
  let id = $currentImage.data.id
  let body = {
    info1: $currentImage.data.info1,
    info2: $currentImage.data.info2,
    info3: $currentImage.data.info3,
    info4: $currentImage.data.info4,
    descr: $currentImage.data.descr

  }
  let res2 = await fetch(api.updateInfo(id, body))

}
catch (e){
  console.error(e)
}

}

</script>

<div class="component">

  <div class="info">
   
    <div class="info-item">
      <label for="">info1 </label>
      <input type="text" class="info1" bind:value={$currentImage.data.info1}>
    </div>
    <div class="info-item">
      <label for="">info2 </label>
      <input type="text" class="info2" bind:value={$currentImage.data.info2}>
    </div>
    <div class="info-item">
      <label for="">info3 </label>
      <input type="text" class="info3" bind:value={$currentImage.data.info3}>
    </div>
    <div class="info-item">
      <label for="">info4 </label>
      <input type="text" class="info4" bind:value={$currentImage.data.info4}>
    </div>
    <div class="info-item">
      <label for="" class="descr-label">descr </label>
      <textarea bind:value={$currentImage.data.descr}></textarea>
    </div>
   
  </div>  
  <div class="btn-wrapper">
    <div class="info-item">
      <label for="#save"></label>
      <div class="btn" id="save" on:mousedown={save}>Записать</div>
    </div>
  </div>

</div>

<style scoped>

.component{
  justify-content: space-between;
}
.info-item{
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 10px;
}
.info-item label{
  width: 80px;
}
.descr-label{
  align-self: flex-start;
}

.btn-wrapper .info-item{
  margin-bottom: 0;
}



textarea{
  width: 100%;
  height: 150px;
}
</style>