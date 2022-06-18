const { Router } = require('express')
const cors = require('cors')
const router = Router()
const config = require('../mcap-config.json')
const fs = require('fs-extra')
const extractZIP = require('extract-zip')
const multer  = require('multer')
const path = require('path')
const bodyParser = require('body-parser');

router.use(bodyParser.json({limit:'1000mb'})); 
router.use(bodyParser.urlencoded({extended:true, limit:'1000mb', parameterLimit: 100000})); 


router.use(cors())



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log(file)
        cb(null, config['vnjson-publish']);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
    limits: {
        fileSize: 20000000,
    },
})

const upload = multer({ storage });

router.post('/vnjson', upload.single('file'), async (req, res)=>{

    const fileName = req.body.fileName;

    /* unzip */
    const src = path.join(config['vnjson-publish'], fileName)
    const dest = path.join(config['vnjson-publish'], fileName.replace('.zip', ''))
    if(fs.existsSync(dest)){
        fs.removeSync(dest)
    }
    try{
        await extractZIP(src, { dir: dest })
        fs.unlink(src, (err) => err&&res.send(err) )
        res.sendStatus(200)
    }
    catch(err){
        console.error(err)
        res.send(err)
    }


    
    
});

module.exports = router