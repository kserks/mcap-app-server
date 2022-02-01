<script>
import api from '../helpers/api.js'
import { places, placeId, events } from '../stores.js'

$:list = []
let action = false
fetch(api.locations)
    .then(r=>r.json())
    .then(res=>{
         list = res.items

    })

function handler (obj){
  places.set( obj.map.split(',') )
  placeId.set(obj.id)
  fetch(api.events(obj.id))
      .then(r=>r.json())
      .then(res=>{
          events.set(res.items) 
      })

}


</script>

<div class="component">

  <h3>Список залов</h3>

  <ul>
    {#each list as obj, index }
      <li  on:mousedown={()=>{  handler(obj)}} >{obj.name} </li>
    {/each}
  </ul>  
</div>

<style scoped>

.component{
    height: 30%;
}


</style>