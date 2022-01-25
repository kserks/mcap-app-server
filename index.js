const
  express                     = require('express'),
  bodyParser                  = require('body-parser'),
  fs                          = require('fs-extra'),
  { join, resolve }           = require('path'),
  cors                        = require('cors');

const
  _cad                        = require('./routes/cad'),
  _pb                         = require('./routes/pb'),
  _tutor                      = require('./routes/tutor'),
  _manga                      = require('./routes/manga')

global.appRoot = resolve(__dirname);
const PORT = require('./mcap-config.json').PORT
const app = express()

//body-parser


app.use(express.json({limit: '20mb'}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors());
app.use(express.static(join(__dirname, '/app')))

/**
 * Routes
 */
app.use('/cad', _cad)
app.use('/pb', _pb)
app.use('/tutor', _tutor)
app.use('/manga', _manga)
/*
 * router
 */
app.get('/', (req, res)=>{
  res.sendFile(join(__dirname,'/app/index.html'))
});


app.listen(PORT, ()=>{
  console.log('[start] http://localhost:'+PORT)
})