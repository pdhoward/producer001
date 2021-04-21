
const jpeg = require('jpeg-js');
const jsqr = require('jsqr')
const fs = require('fs')
//const request = require('request')
const fetch = require("node-fetch")

const url = 'https://res.cloudinary.com/stratmachine/image/upload/v1618842818/inventory/xgfxswq1klsllvua9xzr.jpg'
const path = './images/desk.jpg'
const fileType = require('file-type');
const url2 = 'https://res.cloudinary.com/stratmachine/image/upload/v1618866395/inventory/IMG_2203_k2feqz.jpg'
const url3 = 'https://res.cloudinary.com/stratmachine/image/upload/v1618866396/inventory/IMG_2204_oejnr3.jpg'
const url4 = 'https://res.cloudinary.com/stratmachine/image/upload/v1618866395/inventory/IMG_2202_oxhb8m.jpg'

const url5 = 'https://res.cloudinary.com/stratmachine/image/upload/v1618866396/inventory/IMG_2200_npd22i.jpg'
const url6 = 'https://res.cloudinary.com/stratmachine/image/upload/v1618866395/inventory/IMG_2201_lzbgvk.jpg'

// https://smartengines.com/qr-code-localization/
//https://wicg.github.io/shape-detection-api/#barcode-detection-api
// https://codepen.io/miguelao/pen/wgrYjZ?editors=0010
// https://www.npmjs.com/package/barcode-detector


fetch(url6)
    .then(res => res.buffer())
    .then(async (buffer) => {      
      let rawImageData = jpeg.decode(buffer, {useTArray: true}); // return as Uint8Array
      console.log(rawImageData);
      const code = jsqr(rawImageData.data, rawImageData.width, rawImageData.height);
      if (code) {
        console.log("Found QR code", code);
        } else {
        console.log("No QR Code detected")
        }
    })

/*
fetch(url)
    .then(res => res.buffer())
    .then(async (buffer) => await fileType.fromBuffer(buffer))
    .then(type => { console.log(type)});
*/
//https://blobfolio.com/2019/better-binary-batter-mixing-base64-and-uint8array/

/*
const download = (url, path, callback) => {
  request.head(url, (err, res, body) => {
    request(url)
      .pipe(fs.createWriteStream(path))
      .on('close', callback)
  })
}

download(url, path, () => {
  console.log('✅ Download Done!')
  let jpegData = fs.readFileSync('./images/desk.jpg');
  let rawImageData = jpeg.decode(jpegData, {useTArray: true}); // return as Uint8Array
  console.log(rawImageData);
  const code = jsqr(rawImageData.data, rawImageData.width, rawImageData.height);
  if (code) {
    console.log("Found QR code", code);
    } else {
    console.log("No QR Code detected")
    }

})
*/


