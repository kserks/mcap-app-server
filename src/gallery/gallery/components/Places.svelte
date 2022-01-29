<script>


  $:list = [
    { id: 'g01f', title: 'g01f' },
    { id: 'g01b', title: 'g01b' },
    { id: 'g01c', title: 'g01c' },
    { id: 'g01d', title: 'g01d' },
    { id: 'g01e', title: 'g01e' },
    { id: 'g01f', title: 'g01f' },
    { id: 'g01b', title: 'g01b' },
    { id: 'g01c', title: 'g01c' },
    { id: 'g01d', title: 'g01d' },
    { id: 'g01e', title: 'g01e' },
    { id: 'g01f', title: 'g01f' },
    { id: 'g01b', title: 'g01b' },
    { id: 'g01c', title: 'g01c' },
    { id: 'g01d', title: 'g01d' },
    { id: 'g01e', title: 'g01e' },
    { id: 'g01f', title: 'g01f' },
    { id: 'g01b', title: 'g01b' },
    { id: 'g01c', title: 'g01c' },
    { id: 'g01d', title: 'g01d' },
    { id: 'g01e', title: 'g01e' },
    { id: 'g01f', title: 'g01f' },
    { id: 'g01b', title: 'g01b' },
    { id: 'g01c', title: 'g01c' },
    { id: 'g01d', title: 'g01d' },
    { id: 'g01e', title: 'g01e' },
  ]
  function handler (obj){

    alert(obj.title)
  }
</script>

<div class="component">
  <h3>Список мест зала</h3>

  <ul>
    {#each list as obj}
      <li on:mousedown={()=>{handler(obj)}}>{obj.title}</li>
    {/each}
  </ul>  
</div>

<style scoped>


</style>