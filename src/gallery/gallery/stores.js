import { writable } from 'svelte/store'

export let locations = writable([])
export let places = writable([])
export let placeId = writable(null)
export let placeObj = writable(null)
export let events = writable([])
export let eventId = writable(null)
export let items = writable([])
export let itemId = writable(null)
export let imageFileType = writable(null)
export let showMap = writable(false)
export let imageItem = writable(null)
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
export let itemData = writable(null)

export let isImgExist = writable(true)

export let playerName = writable(null)

export let config = {
  artDir: 'art',
  PORT: 8080
}

