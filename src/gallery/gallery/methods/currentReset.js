/**
 * Копируем изображения из [ cls ] в папку [ cur ]
 */

export default function (id){

    fetch('/gallery/art/cls?placeId='+id)
        .then(r=>{
            console.log(r)
        })
        .catch(e=>console.error(e))
}