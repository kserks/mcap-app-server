const express = require('express');
const app = express.Router();
const { join } = require('path')
const fs = require('fs-extra')
const config = require('../mcap-config.json')


app.get('/art', async (req, res)=>{

let { placeId, eventId } = req.query
console.log(req.query)
  
const location = 'ag1'
const event = 'arh/ia1'
 // let dir = fs.readdirSync();
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





module.exports = app;