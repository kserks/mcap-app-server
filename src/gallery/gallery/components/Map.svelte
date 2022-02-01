<script>
import { placeId }  from '../stores.js'


$:mapImg = ()=>{
  return `background-image: url(/art/${$placeId}/map.jpg);`
}

</script>

<div class="component">
  {#if $placeId}
    <div class="image-container" style="{mapImg()}"></div>
  {/if}

 
</div>

<style scoped>

.image-container{
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;

  background-size: contain;
  background-position: center;
}

</style>