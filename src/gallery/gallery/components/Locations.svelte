<script>
import api from '../helpers/api.js'
import { places, placeId, events, itemId, placeObj, currentImage, locations } from '../stores.js'
import currentReset from '../methods/currentReset.js'

$:list = []
let action = false




fetch(api.locations)
    .then(r=>r.json())
    .then(res=>{
         $locations = res.items.map(item=>{
 
                    return item
                })

    })





function handler (obj, index){
  $itemId = null
  $currentImage.url = ''
  $places =  obj.map.split(',').map(item=>{
                      return { active: false, text: item, exist: true }
             })
  $placeId = obj.id

  $locations.forEach(item=>$locations.active=false)
  $locations[index].active = true
  $placeObj = $locations[index]

  /*
    Копируем изображения из [ cls ] в папку [ cur ]
  */

  if($placeObj.event==='cls'){

      currentReset($placeId)
  }

  /**
   * Получаем список событий
   */
  fetch(api.events(obj.id))
      .then(r=>r.json())
      .then(res=>{
          $events = res.items.map(item=>{

                      ($placeObj.event===item.id)?item.current = true:item.current = false
                      
                
                        item.active = false

                        return item
                    })
      })
      .catch(e=>console.error(e))

}


</script>

<div class="component">

  <h3>Залы</h3>

  <ul>
    {#each $locations as obj, index }
      <li class="{obj.active?'active': ''}" on:mousedown={()=>{  handler(obj, index)}} >{obj.name} </li>
    {/each}
  </ul>  
</div>

<style scoped>

.component{
    height: 50%;
}


</style>