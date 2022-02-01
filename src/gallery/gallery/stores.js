import { writable } from 'svelte/store'


export let places = writable([])
export let placeId = writable(null)
export let events = writable([])
export let eventId = writable(null)
export let items = writable([])


export let currentImage = writable({
              url: null,
              data: {
                info1: null,
                info2: null,
                info3: null,
                info4: null,
                descr: null
              }
       })


export let config = {
  artDir: 'art',

}

