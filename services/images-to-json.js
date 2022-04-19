

const FS = require('fs');
const PATH = require('path');

const constants = {
  DIRECTORY: 'directory',
  FILE: 'file'
}

function safeReadDirSync (path) {
  let dirData = {};
  try {
    dirData = FS.readdirSync(path);
  } catch(ex) {
    if (ex.code == "EACCES" || ex.code == "EPERM") {
      //User does not have permissions, ignore directory
      return null;
    }
    else throw ex;
  }
  return dirData;
}

/**
 * Normalizes windows style paths by replacing double backslahes with single forward slahes (unix style).
 * @param  {string} path
 * @return {string}
 */
function normalizePath(path) {
  return path.replace(/\\/g, '/');
}

/**
 * Tests if the supplied parameter is of type RegExp
 * @param  {any}  regExp
 * @return {Boolean}
 */
function isRegExp(regExp) {
  return typeof regExp === "object" && regExp.constructor == RegExp;
}

/**
 * Collects the files and folders for a directory path into an Object, subject
 * to the options supplied, and invoking optional
 * @param  {String} path
 * @param  {Object} options
 * @param  {function} onEachFile
 * @param  {function} onEachDirectory
 * @return {Object}
 */
function directoryTree (path, options, onEachFile, onEachDirectory) {
  const name = PATH.basename(path);
  options = options || {};
  path = options.normalizePath ? normalizePath(path) : path;
  const item = { path, name };
  let stats;
  let lstat;

  try {
    stats = FS.statSync(path);
    lstat = FS.lstatSync(path);
  }
  catch (e) { return null }

  // Skip if it matches the exclude regex
  if (options.exclude) {
    const excludes =  isRegExp(options.exclude) ? [options.exclude] : options.exclude;
    if (excludes.some((exclusion) => exclusion.test(path))) {
      return null;
    }
  }

  if (lstat.isSymbolicLink()) {
    item.isSymbolicLink = true;
    // Skip if symbolic links should not be followed
    if (options.followSymlinks === false)
      return null;
    // Initialize the symbolic links array to avoid infinite loops
    if (!options.symlinks)
      options = { ...options, symlinks: [] };
    // Skip if a cyclic symbolic link has been found
    if (options.symlinks.find(ino => ino === lstat.ino)) {
      return null;
    } else {
      options.symlinks.push(lstat.ino);
    }
  }

  if (stats.isFile()) {

    const ext = PATH.extname(path).toLowerCase();

    // Skip if it does not match the extension regex
    if (options.extensions && !options.extensions.test(ext))
      return null;


    if (options.attributes) {
      options.attributes.forEach((attribute) => {
        switch (attribute) {
          case 'extension':
            item.extension = ext;
            break;
          case 'type':
            item.type = constants.FILE;
            break;
          default:
            item[attribute] = stats[attribute];
            break;
        }
      });
    }

    if (onEachFile) {
      onEachFile(item, path, stats);
    }
  }
  else if (stats.isDirectory()) {
    let dirData = safeReadDirSync(path);
    if (dirData === null) return null;

    item.children = dirData
      .map(child => directoryTree(PATH.join(path, child), options, onEachFile, onEachDirectory))
      .filter(e => !!e);

    if (options.attributes) {
      options.attributes.forEach((attribute) => {
        switch (attribute) {
          case 'size':
            item.size = item.children.reduce((prev, cur) => prev + cur.size, 0);
            break;
          case 'type':
            item.type = constants.DIRECTORY;
            break;
          case 'extension':
            break;
          default:
            item[attribute] = stats[attribute];
            break;
        }
        
      });
    }

    if (onEachDirectory) {
      onEachDirectory(item, path, stats);
    }
  } else {
    return null; // Or set item.size = 0 for devices, FIFO and sockets ?
  }
  return item;
}


/*
  USERSCRIPT
 */
function imagesToJSON (title, name, pathToDir, callback){
//const title = process.argv[2];

    
    //const name = process.argv[3];
    const TREE = directoryTree(PATH.join(pathToDir, title)).children;

    let DATA = {
      title,
      name,
      chapters: {}
    }
    TREE.map(item=>{
      if(item.children){
          let notSortArray =  item.children.map(ch=>{ 
                return { name: ch.name, index: Number(ch.name.split('.')[0])}
             });
          let sortArray = notSortArray.sort( (a, b)=>a.index-b.index).map(i=>i.name);
          DATA.chapters[item.name] = sortArray;
      }
      else{
        if(!Array.isArray(DATA.chapters) ){
           DATA.chapters = [];
        }

        DATA.chapters.push(item.name);
      }
    })

    try{
      let filePath = PATH.join(pathToDir, '../json', "store.json");
   
      let store;
      try{
        let storeJSON = FS.readFileSync(filePath);
        store = JSON.parse(storeJSON);
      }
      catch(err){
        store = {}
      }
      store[title] = DATA;
      FS.writeFileSync(filePath, JSON.stringify(store), 'utf-8');
      callback();
    }
    catch(err){

      callback(err);
    }

}

module.exports = imagesToJSON;