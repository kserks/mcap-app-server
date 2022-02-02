<script>
import api from '../helpers/api.js'
import { places, placeId, eventId, items, placeObj, config, currentImage, showMap } from '../stores.js'

$:list = []
/*
fetch(api.locations)
    .then(r=>r.json())
    .then(res=>{
         list = res.items.map(item=>{
                    item.active = false
                    return item
                })

    })*/
async function setCurrent (reset){
  let url = `/gallery/art?placeId=${$placeId}&eventId=${$eventId}`
  let obj = {...$placeObj, event: $eventId}
  delete obj.active
  //(reset==='reset')?obj.event='cls':''
  if($eventId){
    try{
      let res =  await fetch(url)

      console.log(res.status)
      const _locations = `http://atlant.mcacademy.ru/reindexer/api/v1/db/mcap_art/namespaces/locations/items`
      obj.id= 'aaa'
      obj.event = '00000000'



      fetch(_locations, {
              method: 'PUT',
              headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                  'Accept': '*/*',
                  'Access-Control-Allow-Origin': '*'
              },
              body: JSON.stringify(obj)
      })

      .then(r=>{
        console.log(r)
      })
      .catch(e=>{
        console.error(e)
      })
      
    }
    catch(e){
        console.error(e)
    }
  }
  else{
    console.log('[ eventId ] не задан')
  }

}

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

function handler (item, index){
  $places.forEach(item=>item.active=false)
  console.log($places)
  $places[index].active = true
  if($eventId){
      getCurrentItem(item.text)
  }
  else{
      let url = `/${config.artDir}/${$placeId}/cls/${name}.jpg`
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

function showMapHandler(){
  $showMap=true
}
</script>

<div class="component">
  <h3>Места</h3>

  <ul>
    {#each $places as item, index}
      <li class="{item.active?'active': ''}" on:mousedown={()=>{handler(item, index)}}>{ item.text }</li>
    {/each}
  </ul>
  <div class="btn mb10" on:mousedown={showMapHandler}>Карта</div>
  <div class="btn mb10" on:mousedown={()=>{setCurrent('reset')} }>Сбросить</div>
  <div class="btn" on:mousedown={setCurrent}>Применить</div>
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

</style>