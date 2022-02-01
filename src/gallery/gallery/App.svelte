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
    <Map/>
  </aside>
  <aside class="center">
    
    
    <Places/>
    
  </aside>
  <aside class="right">
    <Image/>
    <Info/>
  </aside>
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

  font-size: 14px;
}
aside{
  display: flex;
  flex-direction: column;


  margin-right: 5px;
}
aside:last-child{
  margin-right: 0;
}

.left{
  width: 40%;
}
.center{
  width: 15%;
}
.right{
    width: 45%;
}


</style>