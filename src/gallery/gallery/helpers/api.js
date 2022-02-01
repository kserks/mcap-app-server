const base = 'http://atlant.mcacademy.ru/reindexer/api/v1/db/mcap_art'


export default {
  locations: `${base}/namespaces/locations/items`,
  events: location=>{
    return `${base}/query?q=select%20%2a%20from%20events%20where%20location%3D%22${location}%22`
  },
  items: event=>{
    return `${base}/query?q=select%20%2a%20from%20items%20where%20event%3D%22${event}%22`
  }
}