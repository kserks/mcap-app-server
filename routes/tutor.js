const express = require('express');
const app = express.Router();
const { join } = require('path');
const fs = require('fs-extra');







app.post('/save', (req, res)=>{

  const pathToFile = join(__dirname,'../app/chess_edu/'+req.body.playerName+'__fen_store.json')
  fs.writeJson(pathToFile, req.body.data, {spaces: 2}, err => {
    if (err) {
      console.error(err);
      res.sendStatus(500);
    }
    res.sendStatus(200);
  })
})



module.exports = app;