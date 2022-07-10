const express = require('express');
const app = express.Router();
const { join } = require('path')
const fs = require('fs-extra')
const multer  = require('multer')

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


/**
 * SAVE SCREEN_SHOT
 */
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const dir = join(process.env.CAD_DIR, 'screenshots')
       
        cb(null, dir)
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    },
    limits: {
        fileSize: 100000,
    },
});

const upload = multer({ storage: storage });

app.post('/screenshot', upload.single('image'), (req, res)=>{
    
    res
        .status(200)
        .contentType("text/plain")
        .end("File uploaded!")
})


module.exports = app;