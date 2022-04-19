<script>
import { placeId, showMap }  from '../stores.js'


$:mapImg = ()=>{
  return `background-image: url(/art/${$placeId}/map.jpg);`
}

</script>

<div class="place-map {$showMap?'show':''}">
  <div class="close" on:mousedown={()=>{$showMap=false}}>x</div>
  {#if $placeId}
    <div class="image-container" style="{mapImg()}"></div>
  {/if}

</div>

<style scoped>

.place-map{
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: none;
  z-index: 2000;
}
.show{
  display: flex;
  justify-content: center;
  align-items: center;
}

.image-container{
  width: 100%;
  height: 90%;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
}
.close{
  color: crimson;
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 5px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
}
.close:hover{
  color: red;
}
</style>