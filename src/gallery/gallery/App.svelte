<script>

import Halls from './components/Halls.svelte'
import Map from './components/Map.svelte'
import Events from './components/Events.svelte'
import Places from './components/Places.svelte'
import Image from './components/Image.svelte'
import Info from './components/Info.svelte'

</script>

<main>

  <aside class="left">
    <Halls/>
    <Events/>
  </aside>
  <aside class="center">
    
    
    <Places/>
    
  </aside>
  <aside class="right">
    <Image/>
    <Info/>
  </aside>
  <Map/>
</main>

<style>


*{
  box-sizing: border-box;
}

main{
  display: flex;
  width: 1024px;
  height: 768px;
  background-color: #445;
  position: relative;
  font-size: 14px;
}
aside{
  display: flex;
  flex-direction: column;


  margin-right: 5px;
}


.left{
  width: 40%;
}
.center{
  width: 15%;
}
.right{
    width: 45%;
    margin-right: 0;
}


</style>