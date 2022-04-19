

let fileInput = document.querySelector('#file-input');


let dirName = 'pb';
let checkboxUpdateFlag = true;

document
  .querySelector('#select')
  .addEventListener('change', event=>dirName = event.target.value);

let paramName;

const name = document.querySelector('#name')
name.addEventListener('keyup', event=>{
      paramName = event.target.value;

      document.querySelector('.input-file').classList.remove('disabled')
  });


document
  .querySelector('#checkboxUpdate')
  .addEventListener('change', event=>{
      checkboxUpdateFlag = event.target.checked;
      console.log(checkboxUpdateFlag)
  })


let loadBtnText = document.querySelector('.input-file span');

fileInput.addEventListener('change', event=>{

    let file = fileInput.files[0];
    let newFile = new File([file], file.name, { type: 'json' });
    let body = new FormData();
    /**
     * params
     */
    body.append('file', newFile);
    body.append('fileName', file.name);
    body.append('dirName', dirName);
    body.append('paramName', paramName);
    body.append('checkboxUpdateFlag', checkboxUpdateFlag);
    loadBtnText.innerHTML = 'ЗАГРУЗКА...'
    /**
     * query
     */
    fetch('upload-zip', {
            method: 'POST', 
            body
          })
          .then(r=>{
              loadBtnText.innerHTML = 'ЗАГРУЖЕНО';
              loadBtnText.style.color = 'lightgreen';
              setTimeout(()=>{
                 /**
                  * Попытка повторной отправки файла не скрабатывает.
                  * Поэтому такой костыль
                  */
                  location.reload();
              },1500)
              name.value = '';

          })
          .catch(err=>{
            console.error(err);
          })
});

