const express = require('express');
const app = express.Router();
const { join } = require('path')
const fs = require('fs-extra')



app.get('/:title', (req, res)=>{
  res.sendFile(join(appRoot, '/app/manga/index.html'))
})


app.get('/:title/:chapter', (req, res)=>{
  res.sendFile(join(appRoot, '/app/manga/index.html'))
})



module.exports = app;