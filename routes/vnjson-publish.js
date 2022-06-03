const { Router } = require('express')
const cors = require('cors')
const router = Router()
const config = require('../mcap-config.json')
const fs = require('fs-extra')
const extractZIP = require('extract-zip')
const multer  = require('multer')
const path = require('path')


router.use(cors())



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, config['vnjson-publish']);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
    limits: {
        fileSize: 2000000,
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
        console.log(777)
        console.error(err)
        res.send(err)
    }
    
    /*
        const pathToVnjson = path.join(dest)
        const vnjsonTree = fs.readJsonSync(pathToVnjson, 'scenes/vn.json')
        vnjsonTree.$root.package.isbn = isbn;
        fs.writeJsonSync(pathToVnjson, vnjsonTree)
    */

    
    
});

module.exports = router