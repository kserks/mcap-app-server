<script>
import api from '../helpers/api.js'
import { events, eventId, places, items, itemId, currentImage, placeObj , locations } from '../stores.js'



function eventsHandler (obj, index){

  $itemId = null
  $currentImage.url = ''
  //убираю класс active со всех кнопок
  $events.forEach(item=>item.active=false)
  //добавляю класс active на кнопку по которой кликнули
  $events[index].active = true
  /**
   * Получаю список изображений из базы
   */
  fetch(api.items(obj.id))
      .then(r=>r.json())
      .then(res=>{
         $items = res.items
         $eventId = obj.id
         //переопределяю $places
         isExistItem ($items)
      })
}



/**
 * Определяю существует ли изображения в базе
 * для всеконкретных мест
 */
function isExistItem (__items){
let _places = $places.map(item=>item.text)
let _items = __items.map(item=>item.name)

  $places = _places.map(i=>{

                  if(_items.includes(i)){
                    return { text: i, active: false, exist: true}
                  }
                  return { text: i, active: false, exist: false }
              })
}

</script>

<div class="component">
  <h3>События</h3>

  <ul>
    {#each $events as obj, index}
      <li  class="{obj.active?'active': ''} {obj.current?'currentEvent':''}" on:mousedown={ ()=>{ eventsHandler(obj, index) } }>{obj.name}</li>
    {/each}
  </ul>  
</div>

<style scoped>
.component{
    height: 50%;
}
ul li{
  position: relative;
}
.currentEvent{
  z-index: 1000;
}
.currentEvent:after{
  background-color: darkcyan;
  content: '';
  position: absolute;
  right: 5px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  top: 50%;
  transform: translateY(-50%);
}




</style>