/**
 * Копируем изображения из [ cls ] в папку [ cur ]
 */
import { config } from '../stores.js'

export default function (id){

    fetch(`/${config.PORT}/gallery/art/cls?placeId=${id}`)
        .then(r=>{
            console.log(r)
        })
        .catch(e=>console.error(e))
}