export default function (obj){
  let query = []
  for(let key in obj){
    let value = obj[key]
    if(typeof value==='string'){
      value = `"${value.replace(' ', '%20')}"`
    }
    query.push(`%20${key}%20%3D%20${value}`)
  }
  return query.join(',')
}