const express                     = require('express');
const app                         = express.Router();
const path                        = require('path');
const fs                          = require('fs-extra');
const extractZIP                  = require('extract-zip');
const multer                      = require('multer');
const imagesToJSON                = require('../services/images-to-json.js');

let ROOT = '/html/';

if(global.DEV){
  ROOT = path.resolve(__dirname, '../html/')
}

// await extractZIP(src, { dir: extractDir })
/*
app.use(bodyParser.json({limit:'50mb'})); 
app.use(bodyParser.urlencoded({extended:true, limit:'50mb', parameterLimit: 100000})); 
app.use(cors());
*/
/**
 * Сохранялка файлов
 */
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(ROOT, 'uploads'));
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    },
    limits: {
        fileSize: 10000000,
    },
});

const upload = multer({ storage });


app.post('/upload-zip', upload.single('file'), async (req, res)=>{
    const fileName = req.body.fileName;
    const dirName = req.body.dirName;
    const paramName = req.body.paramName;
    const checkboxUpdateFlag = req.body.checkboxUpdateFlag;
    const nameWithoutExt = fileName.split('.')[0];
    const src = path.join(ROOT, '/uploads/', fileName);
    const dir = path.join(ROOT, dirName, '/store');
    const destDir = path.join(dir, nameWithoutExt) 
    /**
     * Если не стоит флаг, то удаляем оригинальный каталог
     */
    if(checkboxUpdateFlag==="true" &&fs.existsSync(destDir)){
        fs.removeSync(destDir);
    }

    try{
      // распаковываем архив
      await extractZIP(src, { dir });
      // удаляем архив
      fs.removeSync(src);
      // преобразуем каталоги с изображениями в store.json
      imagesToJSON(nameWithoutExt, paramName, dir, err=>{
          if(err){
            res.send(err);
          }
          res.sendStatus(200);
      });
    }
    catch(err){
      res.send(err);
    }

});
/*
app.get('/json-dir', (req, res)=>{
    fs.readdir(jsonDir, function(err, items) {
      if(err){
        console.error(err);
        res.send(err);
      }
      res.send(items)
    });
});


app.get('/json-file', (req, res)=>{
    let fileName = req.query.fileName;

    fs.readFile(join(__dirname+'/json/'+fileName), 'utf8', function(err, contents) {
        if(err){
          console.error(err);
          res.send(err);
        }
        res.send(contents);

    });
})
*/


module.exports = app;