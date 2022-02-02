const express = require('express');
const app = express.Router();
const { join } = require('path')
const fs = require('fs-extra')
const config = require('../mcap-config.json')
const request = require('request');

app.get('/art', async (req, res)=>{

let { placeId, eventId } = req.query


let __from = join(appRoot, config.art, placeId, 'arh/', eventId)
let __to = join(appRoot, config.art, placeId, 'cur')


try {
    await fs.emptyDir(__to)
    await fs.copy(__from, __to)
    res.send('success')
} 
catch (err) {
    console.error(err)
    res.sendStatus(500)
}
 
})


const _locations = `http://atlant.mcacademy.ru/reindexer/api/v1/db/mcap_art/namespaces/locations/items`
app.put('/locations',  (req, res)=>{
  req.body.id = 'aaa'
console.log(req.body)
  request.post(_locations, JSON.stringify(req.body), function (error, response, body) {
    console.error('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    console.log('body:', body); // Print the HTML for the Google homepage.
    res.sendStatus(response.statusCode)
  })

})



module.exports = app;