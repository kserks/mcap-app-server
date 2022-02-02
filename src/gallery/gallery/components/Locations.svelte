<script>
import api from '../helpers/api.js'
import { places, placeId, events, placeObj } from '../stores.js'
import currentReset from '../methods/currentReset.js'

$:list = []
let action = false
fetch(api.locations)
    .then(r=>r.json())
    .then(res=>{
         list = res.items.map(item=>{
                    //(item.event==='cls'||item.event==='')?item.active = false:item.active = true
                    
                    return item
                })

    })

function handler (obj, index){
  $places =  obj.map.split(',').map(item=>{
                      return {active: false, text: item}
             })
  $placeId = obj.id

  list.forEach(item=>item.active=false)
  list[index].active = true
  $placeObj = list[index]
  /**
   * 
   */
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
                        //($placeObj.event===item.id)?item.active = true:item.active = false
                        item.active = false
                        return item
                    })
      })

}


</script>

<div class="component">

  <h3>Список залов</h3>

  <ul>
    {#each list as obj, index }
      <li class="{obj.active?'active': ''}" on:mousedown={()=>{  handler(obj, index)}} >{obj.name} </li>
    {/each}
  </ul>  
</div>

<style scoped>

.component{
    height: 50%;
}


</style>