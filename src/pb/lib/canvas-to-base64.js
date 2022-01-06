async function loadImg(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.setAttribute("crossOrigin", "anonymous");
    img.onerror = reject;
    img.onload = () => resolve(img);
    img.src = src;
  });
}

export default async function (canvas1, ctx, background) {
  const width = 1024
  const height = 717
  let canvas2 = document.querySelector('#canvas_2')
      canvas2.width = width
      canvas2.height = height

  let ctx2 = canvas2.getContext('2d')
     
 const img = await loadImg(background)

  ctx2.drawImage(canvas1, 0, 0)
  ctx.clearRect(0, 0, width, height)
  ctx.drawImage(img, 0, 0, width, height)
  ctx.drawImage(canvas2, 0, 0)

  var dataURL = canvas1.toDataURL();

  return dataURL

}



/*

ctx2.drawImage(can1, 0, 0) // paint first canvas onto new canvas
ctx.clearRect(0, 0, width, height) // clear first canvas
ctx.drawImage(background, 0, 0) // draw image on first canvas
ctx.drawImage(can2, 0, 0) //

 */