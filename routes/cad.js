const express = require('express');
const app = express.Router();
const { join } = require('path')
const fs = require('fs-extra')


app.get('/dir', (req, res)=>{

  const pathToDir = join(__dirname,'../app/cad/files/',req.query.player)
  fs.readdir(pathToDir, (err, files) => {
      if(err){
        console.error(err)
        res.sendStatus(500)
      }
      res.send(JSON.stringify(files))
  });
})
app.post('/save-file', (req, res)=>{


  const pathToFile = join(__dirname,'../app/cad/files/', req.body.playerName, req.body.fileName)

  fs.outputFile(pathToFile, req.body.data, (err, data)=>{
    if(err){
      console.error(err)
      res.sendStatus(500)
    }
    else{
      console.log(pathToFile)
      res.sendStatus(200)
    }
  })

})
module.exports = app;