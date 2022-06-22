const express = require('express');
const app = express.Router();
const { join, resolve } = require('path')
const fs = require('fs-extra')

//const request = require('request');
const multer  = require('multer')

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
         let name = file.originalname.split("_____")
        //let newDirPath = resolve(__dirname,'../app/uploads/')
        let newDirPath = join(process.env.GALLERY_DIR, name[0], 'arh/', name[1])
        cb(null, newDirPath)
    },
    filename: function(req, file, cb) {
        let name = file.originalname.split("_____")[2]
        cb(null, name);
    },
    limits: {
        fileSize: 1000000,
    },
});

const upload = multer({ storage: storage });










app.get('/art', async (req, res)=>{

let { placeId, eventId } = req.query


let __from = join(config.art, placeId, 'arh/', eventId);
let __to = join(config.art, placeId, 'cur');


try {
    await fs.emptyDir(__to);
    await fs.copy(__from, __to);
    res.send('success');
} 
catch (err) {
    console.error(err);
    res.sendStatus(500);
}
 
})

app.get('/art/cls', async (req, res)=>{

let { placeId } = req.query;

let __from = join(config.art, placeId, 'cls');
let __to = join(config.art, placeId, 'cur');
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


app.post('/art/saveImage', upload.single('file'), (req, res)=>{
    console.log('req')
    res
        .status(200)
        .contentType("text/plain")
        .end("File uploaded!")
})



module.exports = app;