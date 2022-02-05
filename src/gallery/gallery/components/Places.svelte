<script>
import api from '../helpers/api.js'
import { places, placeId, events, placeObj, eventId, items, itemId, itemData , config, currentImage, showMap, isImgExist, imageFileType } from '../stores.js'
import currentReset from '../methods/currentReset.js'


$:updated = false
async function setCurrent (){
  let url = `/gallery/art?placeId=${$placeId}&eventId=${$eventId}`
  let obj = {...$placeObj, event: $eventId}
  delete obj.active

  if($eventId){
    try{

      $events.map(item=>{
          if($eventId===item.id){
            item.current = true
          }
          else{
            item.current = false
          }
      })
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



function imageHandler (item, index){

  $places.forEach(item=>item.active=false)
  $places[index].active = true
  $itemId = $places[index].text

  if($eventId){
      getCurrentItem(item.text)
  }
  else{
      let url = `/${config.artDir}/${$placeId}/cls/${item.text}.jpg`
      $currentImage.url = url
  }
}

/**
 * Выбираем место и получаем пусть к текущему изображению
 */

function getCurrentItem(name){

  let data = $items.filter(item=>item.name===name)
  $itemData = null
  if(data.length>0){
    $itemData = data[0]
    $imageFileType = $itemData.ext
    $currentImage.data = data[0]
    let url = `/${config.artDir}/${$placeId}/arh/${$eventId}/${name}.${$currentImage.data.ext}`
    $currentImage.url = url
    $isImgExist = true
  }
  else{

    $currentImage = {
              url: '/gallery/_gallery/images/placeholder.jpg',
              data: {
                info1: null,
                info2: null,
                info3: null,
                info4: null,
                descr: null
              }
    }
    $isImgExist = false
  }
}
/**
 * reset currentDIR and ui-state
 */

function resetHandler (){
  $events = $events.map(item=>{
    item.active=false
    return item
  })

  $places = $places.map(item=>{
    item.active=false
    item.exist = true
    return item
  })

  currentReset($placeId)
  $currentImage.url = ''
  fetch(api.updateLocation($placeObj.id, {event: 'cls'}))
  $events.map(item=>{
    item.current = false
  })

}

</script>

<div class="component">
  <h3>Места</h3>

  <ul>
    {#each $places as item, index}
      <li class="{item.active?'active': ''} {(!item.exist&&$eventId)?'not-exist': ''}" on:mousedown={()=>{imageHandler(item, index)}}>{ item.text }</li>
    {/each}
  </ul>
  {#if $placeId}
      <div class="btn mb10" on:mousedown={()=>{$showMap=true}} >Карта</div>
      <div class="btn mb10 {!$eventId?'disabled':''}" on:mousedown={resetHandler } >Сбросить</div>
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

.not-exist{
  background-color: crimson;
  color: white;
  opacity: 0.5;
}
</style>