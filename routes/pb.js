const express = require('express');
const app = express.Router();
const { join } = require('path')
const fs = require('fs-extra')
const request = require('request');





app.get('/user-images', (req, res)=>{

  const dir = join(__dirname,`../app/pb/images/`, req.query.playerName)

  if(!fs.existsSync(dir)){
        fs.mkdirSync(dir);
  }
  let shared = join(__dirname, `../app/pb/images/shared`)
  if (!fs.existsSync(shared)){
        fs.mkdirSync(shared);
  }

  
  let data = fs.readdirSync(shared).map(f=>{ return { fileName: f, type: 'shared'} })

  fs.readdir(dir, (err, files) => {
      if(err){
        res.sendStatus(500)
      }
      let objData = files.map(f=>{ return { fileName: f, type: req.query.playerName} })
      res.send( JSON.stringify(data.concat( objData ) )  )
  });
})


app.post('/save-image', (req, res)=>{

const fileName = `/${req.body.fileName}.png`
const dir = join(__dirname,`../app/pb/images/`, req.body.type)

if(!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

let base64Image = req.body.img.replace(/^data:image\/png;base64,/, "")

fs.writeFile(dir+fileName, base64Image, { encoding: 'base64' }, function(err) {
    if(err){
      res.sendStatus(500)
    }
    res.sendStatus(200)
});

})




app.post('/upload-image', (req, res) => {
    let { file, playerName }  = req.body
    let fileName = file.split('/')[file.split('/').length-1].replace('*','_')
    let fileDist = join(__dirname,'../app/pb/images/', playerName, fileName)
    
  request({
    url: file,
    encoding: null
  }, 
  (err, resp, buffer) => {
    if (!err && resp.statusCode === 200){
    fs.writeFile(fileDist, resp.body, (err) => {
        if (err){
          console.error(err)
          res.sendStatus(500)
        }
        res.sendStatus(200)
    });

    }
  })

})

app.post('/remove-image', (req, res) => {
  let { fileName, playerName } = req.body

  let filePath = join(__dirname, '../app/pb/images/', playerName , fileName)
 
  fs.unlink(filePath, err=>{
    if(err){
      console.error(500)
      res.sendStatus(500)
    }    
    res.sendStatus(200)

  })
})

app.get('/shared-images', (req, res)=>{
    let shared = join(__dirname, `../app/pb/images/shared`)
    if (!fs.existsSync(shared)){
        fs.mkdirSync(shared);
    }

    let data = fs.readdirSync(shared)
    res.send(data)
})

app.get('/shared-remove', (req, res)=>{
  let shared = join(__dirname, `../app/pb/images/shared`)
  try{
      let dir = fs.readdirSync(shared)
      let reg = new RegExp(req.query.id)
      dir.map(image=>{
          if( reg.test(image) ){
            fs.unlinkSync( join(shared, image) )
          }
      })

      //fs.rmdirSync(shared, { recursive: true })
      res.sendStatus(200)
  }
  catch(err){
    console.error(err)
    res.sendStatus(500)
  }

})
/**
 * Slides
 */




module.exports = app;