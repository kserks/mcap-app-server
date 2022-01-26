const express = require('express');
const app = express.Router();
const { join } = require('path')
const fs = require('fs-extra')


const { mangaItemsTpl, mangaChaptersTpl,  mangaViewerTpl } = require('../app/manga/index.js')

app.get('/', (req, res)=>{
  
let mangaItems = fs.readdirSync(join(appRoot, '/app/manga/json'));
 
  res.send(mangaItemsTpl(mangaItems))
})

app.get('/:title', (req, res)=>{
  let title = req.params.title
  let body = require(join(appRoot, '/app/manga/json', title+'.json'))  
  res.send(mangaChaptersTpl(title, body))
})


app.get('/:title/:chapter', (req, res)=>{
  res.send(mangaViewerTpl())
})
module.exports = app;