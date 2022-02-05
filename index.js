const
  express                     = require('express'),
  bodyParser                  = require('body-parser'),
  fs                          = require('fs-extra'),
  { join, resolve }           = require('path'),
  cors                        = require('cors');
global.appRoot = resolve(__dirname);
const
  _cad                        = require('./routes/cad'),
  _pb                         = require('./routes/pb'),
  _tutor                      = require('./routes/tutor'),
  _manga                      = require('./routes/manga')
  _gallery                    = require('./routes/gallery')

const PORT = require('./mcap-config.json').PORT
const app = express()



app.use(bodyParser.json({limit:'50mb'})); 
app.use(bodyParser.urlencoded({extended:true, limit:'50mb', parameterLimit: 100000})); 
app.use(cors());

app.use(express.static(join(__dirname, '/app')))

/**
 * Routes
 */
app.use('/cad', _cad)
app.use('/pb', _pb)
app.use('/tutor', _tutor)
app.use('/manga', _manga)
app.use('/gallery', _gallery)
/*
 * router
 */
app.get('/', (req, res)=>{
  res.sendFile(join(__dirname,'/app/index.html'))
});


app.listen(PORT, ()=>{
  console.log('[start] http://localhost:'+PORT)
})
