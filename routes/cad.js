const express = require('express');
const app = express.Router();
const { join } = require('path')
const fs = require('fs-extra')


app.get('/dir', (req, res)=>{

  const pathToDir = join(__dirname,'../app/cad/files/',req.query.player)
  fs.readdir(pathToDir, (err, files) => {
      if(err){
        res.send(err)
      }
      res.send(files)
  });
})
app.post('/save-file', (req, res)=>{


  const pathToFile = join(__dirname,'../app/cad/files/', req.body.playerName, req.body.fileName)

  fs.outputFile(pathToFile, JSON.stringify(req.body.data, null, 2), (err, data)=>{
    if(err){
      res.send(err)
    }
    else{
      res.sendStatus(200)
    }
  })

})
module.exports = app;