const express = require('express');
const app = express.Router();
const { join } = require('path')
const fs = require('fs-extra')


app.get('/dir', (req, res)=>{

  const pathToDir = join(process.env.CAD_DIR, req.query.player)
  const libDir = join(process.env.CAD_DIR, 'common')
  fs.readdir(libDir, (err, libFiles)=>{
      if(err){
        res.send(err)
      }
      fs.readdir(pathToDir, (err, userFiles) => {
          if(err){
            res.send(err)
          }
          res.send({ common: libFiles, user: userFiles })
      });
  })

})
app.post('/save-file', (req, res)=>{


  const pathToFile = join(process.env.CAD_DIR, req.body.playerName, req.body.fileName)

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