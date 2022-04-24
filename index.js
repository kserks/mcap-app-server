
/**
 * DEPS
 */
const express                     = require('express');
const bodyParser                  = require('body-parser');
const fs                          = require('fs-extra');
const { join, resolve }           = require('path');
const cors                        = require('cors');
/**
 * GLOBALS
 */
global.appRoot = resolve(__dirname);
global.DEV = true;

/**
 * ROUTES
 */
const _cad                        = require('./routes/cad');
const _pb                         = require('./routes/pb');
const _tutor                      = require('./routes/tutor');
const _gallery                    = require('./routes/gallery');
const _uploadImages               = require('./routes/upload-images');

/**
 * INIT
 */
const PORT = require('./mcap-config.json').PORT;
const app = express();

app.use(bodyParser.json({limit:'500mb'})); 
app.use(bodyParser.urlencoded({extended:true, limit:'500mb', parameterLimit: 100000})); 
app.use(cors());
/**
 * STATIC
 */
app.use(express.static(join(__dirname, '/app')));

if(global.DEV){
  app.use(express.static(join(__dirname, '/html')));
  console.log('env = DEV')
}
/**
 * REGISTER ROUTES
 */
app.use('/cad', _cad);
app.use('/pb', _pb);
app.use(`/chess_edu`, _tutor);
app.use('/gallery/_gallery', _gallery);
app.use('/upload-images', _uploadImages);
/*
 * home
 */
app.get('/', (req, res)=>{
  res.sendFile(join(__dirname,'/app/index.html'));
});


app.listen(PORT, ()=>{
  console.log('[start] http://localhost:'+PORT);
})
