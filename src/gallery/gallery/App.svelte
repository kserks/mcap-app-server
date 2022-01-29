<script>

import Halls from './components/Halls.svelte'
import Places from './components/Places.svelte'
import Map from './components/Map.svelte'
import Image from './components/Image.svelte'
import Exhibitions from './components/Exhibitions.svelte'


</script>

<main>

  <aside class="left">
    <Halls/>
    <Places/>
  </aside>
  <aside class="center">
    <Map/>
    <Image/>
  </aside>
  <aside class="right">
      <Exhibitions/>
  </aside>
</main>

<style>


*{
  box-sizing: border-box;
}

main{
  display: flex;
  width: 100vw;
  height: 100vh;
  background-color: #445;
  padding: 10px;
  font-size: 14px;
}
aside{
  display: flex;
  flex-direction: column;

  width: 30%;
  margin-right: 5px;
}
aside:last-child{
  margin-right: 0;
}

.left{

}
.center{
  width: 40%;
}
.right{

}


</style>