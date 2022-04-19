

        
function initSelectionActiveFile(){

      function removeSelection (){
          let nodes = document.querySelectorAll('.file-system__tree li span.file-item');

          nodes.forEach(item=>{
            item.classList.remove('active-item')
          })
      }


      let tree = document.querySelector('.file-system__tree');
      function handler (e){

          if(e.target.classList.contains('file-item')){
              removeSelection ()
              e.target.classList.add('active-item')
          }
      }
      // если обработчик события уже висит мы его удаляем
      // это делается потому что при выборе корневого каталога
      // функция initSelection
      tree.removeEventListener('mousedown', handler);
      tree.addEventListener('mousedown', handler);
         
 


}

