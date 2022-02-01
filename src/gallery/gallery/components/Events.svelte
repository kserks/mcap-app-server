<script>
import api from '../helpers/api.js'
import { events, eventId, items } from '../stores.js'


function handler (obj){
  fetch(api.items(obj.id))
      .then(r=>r.json())
      .then(res=>{
         items.set(res.items) 
         eventId.set(obj.id)
      })
}
</script>

<div class="component">
  <h3>Выставки</h3>

  <ul>
    {#each $events as obj}
      <li on:mousedown={ ()=>{ handler(obj) } }>{obj.name}</li>
    {/each}
  </ul>  
</div>

<style scoped>
.component{
    height: 30%;
}
</style>