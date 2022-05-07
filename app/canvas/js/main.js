window.onerror = function (error, url, line, columnNo, error){
   document.querySelector('body').innerHTML = JSON.stringify(["js-Error",error, url, line, columnNo, error])
   //setTimeout(location.reload, 2000)",
}
function include_html (tpl){
    document.querySelector('body').innerHTML = tpl;
}
function include_style (style){
    document.querySelector('body').innerHTML += `<style>${style}</style>`;
}
fabric.Object.prototype.selectable = false;

const {
  Rect,
  Circle,
  Polyline,
  Polygon,
  Triangle,
  Canvas,
  Text,
  Image,
  Line
} = fabric;

window.onload = function (){
  window.canvas =  new Canvas('screen');
}



const dictonary = {
    "a A": 'а',
    "b B": 'б',
    "v V": 'в',
    "g G": 'г',
    "d D": 'д',
    "e E": 'е',
    "yo jo Yo Jo": 'ё',
    "zh Zh": 'ж',
    "z Z": 'з',
    "i I": 'и',
    "yi ji Yi Ji": 'й',
    "k K": 'к',
    "l L": 'л',
    "m M": 'м',
    "n N": 'н',
    "o O": 'о',
    "p P": 'п',
    "r R": 'р',
    "s S": 'с',
    "t T": 'т',
    "u U": 'у',
    "f F": 'ф',
    "x X": 'х',
    "c C": 'ц',
    "ch Ch": 'ч',
    "sh Sh": 'ш',
    "sch Sch": 'щ',
    "tzn Tzn": 'ъ',
    "jy Jy": 'ы',
    "mzn Mzn": 'ь',
    "ye je Ye Je": 'э',
    "yu ju Yu Ju": 'ю',
    "ya ja Ya Ja": 'я'
}

function textFormat(originalText,  lang){
  let text = originalText
  if(lang==='ru'){
    const sortedArr = Object.keys(dictonary)
                            .sort((a,b)=>{
                                    if(a.length>b.length) return -1;
                                    if(a.length<b.length) return 1;
                                    return 0;
                            })
          sortedArr.map(keyENG=>{
                  let keys = keyENG.split(' ')
                  keys.map(k=>{
                      if(k===k.toUpperCase()){
                        text = text.replaceAll(k, dictonary[keyENG].toUpperCase())  
                      }
                      else{
                        text = text.replaceAll(k, dictonary[keyENG])
                      }
                  })
            })
  }
   canvas.add(new Text(text, options))
}

