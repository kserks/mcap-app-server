const express = require('express');
const app = express.Router();
const { join, resolve } = require('path')
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

app.get('/art/cls', async (req, res)=>{

let { placeId } = req.query



let __from = join(config.art, placeId, 'cls')
let __to = join(config.art, placeId, 'cur')
// path.resolve()

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