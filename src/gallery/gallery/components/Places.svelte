<script>
import { places, placeId, eventId, items, config, currentImage } from '../stores.js'

$:list = []


async function setCurrent (){
  let url = `/gallery/art?placeId=${$placeId}&eventId=${$eventId}`
  if($eventId){
    try{
        let res =  await fetch(url)
        console.log(res.status)
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
    console.log(url)
    $currentImage.url = url
  }
  else{
    $currentImage.data = null
  }

}

function handler (name){

  if($eventId){
      getCurrentItem(name)
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
</script>

<div class="component">
  <h3>Места</h3>

  <ul>
    {#each $places as item}
      <li on:mousedown={()=>{handler(item)}}>{ item }</li>
    {/each}
  </ul>  
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

</style>