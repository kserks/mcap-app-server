<script>
import api from '../helpers/api.js'
import { places, placeId, events, eventId, items, placeObj, config, currentImage, showMap } from '../stores.js'
import currentReset from '../methods/currentReset.js'

$:list = []
$:updated = false
async function setCurrent (){
  let url = `/gallery/art?placeId=${$placeId}&eventId=${$eventId}`
  let obj = {...$placeObj, event: $eventId}
  delete obj.active
  //(reset==='reset')?obj.event='cls':''
  if($eventId){
    try{
      let res =  await fetch(url)
      let res2 = await fetch(api.updateLocation(obj.id, obj))
      updated = true
      setTimeout(()=>{
        updated = false
      },1000)
    }
    catch(e){
        console.error(e)
    }
  }
  else{
    console.log('[ eventId ] не задан')
  }

}

/**
 * Выбираем место и получаем пусть к текущему изображению
 * Формируюем
 */

function getCurrentItem(name){

  let data = $items.filter(item=>item.name===name)

  if(data.length>0){

    $currentImage.data = data[0]
    let url = `/${config.artDir}/${$placeId}/arh/${$eventId}/${name}.${$currentImage.data.ext}`
    $currentImage.url = url
  }
  else{
    $currentImage.data = null
  }
}

function imageHandler (item, index){

  $places.forEach(item=>item.active=false)
  $places[index].active = true
  if($eventId){
      getCurrentItem(item.text)
  }
  else{
      let url = `/${config.artDir}/${$placeId}/cls/${item.text}.jpg`
      $currentImage.url = url
  }

/*
  let arr = [] 
   for(var i=0; i<$places.length;i++){

      for(let j =0; $items.length;j++){
        if($places[i].name===$items[j].name){
          arr.push({ data: $places[i], index: i })
        }
      }
   }

 console.log(arr)*/

}


function reset (){
  $events = $events.map(item=>{
    item.active=false
    return item
  })
/**
  $places = $placeObj.map.split(',').map(item=>{
                              return {active: false, text: item}
                            })
 */


  $places = $places.map(item=>{
    item.active=false
    return item
  })


  currentReset($placeId)

  $currentImage.url = ''
}

</script>

<div class="component">
  <h3>Места</h3>

  <ul>
    {#each $places as item, index}
      <li class="{item.active?'active': ''}" on:mousedown={()=>{imageHandler(item, index)}}>{ item.text }</li>
    {/each}
  </ul>
  {#if $placeId}
      <div class="btn mb10" on:mousedown={()=>{$showMap=true}} >Карта</div>
      <div class="btn mb10 {!$eventId?'disabled':''}" on:mousedown={reset } >Сбросить</div>
      <div class="btn {updated?'updated':''} {!$eventId?'disabled':''}" on:mousedown={setCurrent}>Применить</div>
  {/if}
</div>

<style scoped>

.component{
  height: 100%;
  justify-content: space-between;
}
.component ul{
  height: 85%;
}
.btn{
  align-self: flex-end;
}
.mb10{
  margin-bottom: 10px;
}
.updated{
  background-color: #11f294;
  color: ghostwhite;
}
</style>