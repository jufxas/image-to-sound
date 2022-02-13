const jimp = require("jimp") // https://www.npmjs.com/package/jimp
const https = require('https')
const fs = require('fs');
const client_id = "7c0725d4"
const songFile = fs.createWriteStream("test.mp3")
const COLOR_VALUE_MAX = colorValue(255,255,255)

class RGB {
  constructor(r, g, b) {
    this.r = r 
    this.g = g 
    this.b = b 
  }
  format() {
    return `rgb(${this.r},${this.g},${this.b})`
  }
}



let idToWeight = [
  {"500608898":6660128},
  {"500608471":1332070.65},
  {"500607433":15551374.1},
  {"500342341":8841312},
  {"500606825":1125616.5},
  {"500605606":14625603},
  {"500605176":16760576},
  {"500604904":9355022.5},
  {"500602528":15846048.2},
  {"500599669":8388607.5},
  {"500337324":5070357.1},
  {"500510544":4538157.8},
  {"500509197":33996},
  {"500508615":9457327.5},
  {"500506299":14480885},
  {"500491533":255},
  {"500466416":6210193},
  {"500459477":8355967.5},
  {"500456046":15956734},
  {"500441382":8579602.4},
  {"500440545":14156507.35},
  {"500434220":4045594.2},
  {"500432775":8388735},
  {"500431178":2789.5},
  {"500427847":10747904},
  {"500426279":5537133.75},
  {"500423230":12474072.9},
  {"500414147":9147797},
  {"500405631":16542799.4},
  {"500399624":10598232.5},
  {"500395082":15044761.5},
  {"500390216":11848989.8},
  {"500386475":252801.4},
  {"500382081":24166.2},
  {"500379690":13353215},
  {"500371356":5558110},
  {"500369284":5699782},
  {"500366792":40426.85},
  {"500361729":10354687.6},
  {"500359352":4049951.1},
  {"500356501":4584936},
  {"500351513":5049420.3},
  {"500349856":16775408},
  {"500343359":4613734.4},
  {"500339697":12625146.5},
  {"500332577":104.55},
  {"500330186":15689113.4},
  {"500327838":5906326.8},
  {"500325591":11171395},
  {"500320879":16353368.2},
  {"500317937":9151472.5},
  {"500315543":8483349.42},
  {"500307898":9264145.25},
  {"500294369":6543918.99},
  {"500228504":2645205.25},
  {"500227543":11219191.65},
  {"500224355":4204212.25},
  {"500204816":9481904.4},
  {"500193575":8383239.87},
  {"500199905":5324341},
  {"500168958":5913945.75},
  {"500194396":10351768.6},
  {"500168943":14980228.25},
  {"500180942":9996729},
  {"500176479":1021070.5},
  {"500175269":55627.8},
  {"500170891":16657167.8},
  {"500157248":104.55},
  {"500157769":3404466.7},
]



function colorValue(r,g,b) {
  return r + g*256 + b*65536
}

function equalRGB(rgb1, rgb2, differenceThreshold) {
  return Math.abs(colorValue(rgb1.r, rgb1.g, rgb1.b) - colorValue(rgb2.r, rgb2.g, rgb2.b)) <= differenceThreshold
} 

function closestWeightToID(sum) {
  // sorry for bad variable names! this takes the difference between the sum (given) and all palette sums of the idToWeight list and the one with the lowest sum will return its corresponding jamendo playlist ID 
  let list = []
  for (let i = 0; i < idToWeight.length; i++) {
    let diff = Math.abs( idToWeight[i][ Object.keys(idToWeight[i])]  - sum)
    list.push( {
      id: Object.keys(idToWeight[i])[0],
      diff: diff,
    })
  }
  return list.sort((a, b) => a.diff - b.diff)[0].id
}

GenerateSong("./images/amogus.png", 1000)

async function GenerateSong(file, differenceThreshold) {
    await jimp.read(file, function (err, image) {
        if (err) throw err
        let avgRed = 0 
        let avgGreen = 0 
        let avgBlue = 0 
        let colorPalette = []
        let colorAndWeight = {}
        
        let sum = 0 
        let paletteSum = 0 
        const colorAndWeightList = []

        const pixels = image.bitmap.width * image.bitmap.height
        image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
            let red = this.bitmap.data[idx + 0]
            let green = this.bitmap.data[idx + 1]
            let blue = this.bitmap.data[idx + 2]
            let currentPixelRGB = new RGB(red, green, blue) 
            avgRed += red 
            avgGreen += green
            avgBlue += blue 
            
            if (colorPalette.length === 0) {
              colorPalette.push(currentPixelRGB) 
              colorAndWeight[currentPixelRGB.format()] = 1 
            } else  {
              let pass = true
              for (let i = 0; i < colorPalette.length; i++) {
                 if (equalRGB(colorPalette[i], currentPixelRGB, differenceThreshold)) {
                    colorAndWeight[colorPalette[i].format()] += 1 
                    pass = false 
                    break
                 }
              }
              if (pass) {
                colorPalette.push(currentPixelRGB)
                colorAndWeight[currentPixelRGB.format()] = 1 
              }
            }
        })

        
        console.log(`Colors: ${Object.keys(colorAndWeight).length}`)

        if (Object.keys(colorAndWeight).length >= 1000) {
          console.log("********TOO LONG, REDO*******")
          GenerateSong(file, differenceThreshold*10)
          return; 
        }

        let iterator = 0 
        for (const color in colorAndWeight) {
          let colorWeight = parseFloat(((colorAndWeight[color] / pixels) * 100).toFixed(2))
          if (colorWeight >= 1) {
            colorAndWeightList.push({
              color: color, 
              weight: colorWeight
            })
            sum += colorWeight
            paletteSum += (colorWeight/100)*colorValue(colorPalette[iterator].r, colorPalette[iterator].g, colorPalette[iterator].b)
          }
          iterator++
        }
        

        console.log(colorAndWeightList)
        console.log(sum)
        console.log({r: Math.round(avgRed / pixels), g: Math.round(avgGreen / pixels), b: Math.round(avgBlue / pixels)})

        if (sum < 95) {
          console.log("********REDO*******")
          GenerateSong(file, differenceThreshold*10)
        } else {
          console.log(paletteSum)
          let id = closestWeightToID(paletteSum)

          const options = {
            hostname: 'api.jamendo.com',
            port: 443,
            path: `/v3.0/playlists/tracks?client_id=${client_id}&id=${ id }&limit=200`,
            method: 'GET',
          }
          let str = ""
          const req = https.request(options, res => {
            console.log(`statusCode: ${res.statusCode}`)
        
            res.on('data', data => {
              str += data
            })
            res.on('end', () => {
              let tracks = JSON.parse(str).results[0].tracks
              console.log(`PLAYLIST: ${JSON.parse(str).results[0].name}`)
              console.log(`LENGTH: ${tracks.length}`)

              let avgRGBToInt = colorValue(avgRed/pixels, avgBlue/pixels, avgGreen/pixels)
              let selectedIndex = Math.round((avgRGBToInt*(tracks.length - 1))/COLOR_VALUE_MAX)
              let song= tracks[selectedIndex]

              console.log(`SONG: ${song.name}`)

              https.get(song.audiodownload, function(response) {
                let failed = true 
                for (let i = 0; i < response.rawHeaders.length; i++) {
                  if (response.rawHeaders[i].includes("attachment;")) failed = false 
                }
                if (failed) console.log(`Request for ${song.name} failed.`)
                else {
                  console.log(`Request for ${song.name} succeeded.`)
                  response.pipe(songFile);
                }
              });

            })
          })
          req.on('error', error => {
            console.error(error)
          })
          req.end()


        }
    });
}

