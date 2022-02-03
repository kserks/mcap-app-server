<script>
import api from '../helpers/api.js'
import { events, eventId, places, items } from '../stores.js'

//меняю струкутру events на подходящую мне
//конкретно добавляю свойство active
$:list =  $events.map(item=>{
                        item.active = false
                        return item
                    })


function eventsHandler (obj, index){

  //убираю класс active со всех кнопок
  list.forEach(item=>item.active=false)
  //добавляю класс active на кнопку по которой кликнули
  list[index].active = true
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
                    return { text: i, active: false, exist: true }
                  }
                  return { text: i, active: false, exist: false }
              })
}

</script>

<div class="component">
  <h3>Выставки</h3>

  <ul>
    {#each list as obj, index}
      <li  class="{obj.active?'active': ''}" on:mousedown={ ()=>{ eventsHandler(obj, index) } }>{obj.name}</li>
    {/each}
  </ul>  
</div>

<style scoped>
.component{
    height: 50%;
}
</style>