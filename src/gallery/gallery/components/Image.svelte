<script>

let data = {
  author: 'Ян Вермеер, 1665',
  name: 'Девушка с жемчужной серёжкой',
  description: 'Художник попытался запечатлеть момент, когда девушка поворачивает голову в сторону зрителя к кому-то, кого она только что заметила'
}

let currentImage = '/gallery/_gallery/images/001/cur/zhemchuzhina.jpg'

function backgroundImage(){
  return `background-image: url(${currentImage});`
}

</script>

<div class="component">
  <div class="image-viewer">
      <div class="image" style="{backgroundImage()}"></div>
  </div>
  <div class="description">
    <p>
      <span>Автор: </span>
      <span>{data.author}</span>
    </p>
    <p>
      <span>Название: </span>
      <span>{data.name}</span>
    </p>
    <p>
      <span>Описание: </span>
      <span>{data.description}</span>
    </p>
  </div>

 
</div>

<style scoped>


.image-viewer{
  width: 100%;
  height: 70%;
}
.image{
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
}

.description{
  padding: 10px;
}

p{
  margin: 0;
  padding-bottom: 5px;
}
p span:last-child{
  color: #889;
}
</style>