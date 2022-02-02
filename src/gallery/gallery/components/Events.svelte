<script>
import api from '../helpers/api.js'
import { events, eventId, items } from '../stores.js'

$:list =  $events.map(item=>{
                        item.active = false
                        return item
                    })

function handler (obj, index){

  list.forEach(item=>item.active=false)
  list[index].active = true

  fetch(api.items(obj.id))
      .then(r=>r.json())
      .then(res=>{
         $items = res.items
         $eventId = obj.id
      })
}
</script>

<div class="component">
  <h3>Выставки</h3>

  <ul>
    {#each list as obj, index}
      <li  class="{obj.active?'active': ''}" on:mousedown={ ()=>{ handler(obj, index) } }>{obj.name}</li>
    {/each}
  </ul>  
</div>

<style scoped>
.component{
    height: 50%;
}
</style>