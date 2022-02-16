const jimp = require("jimp") // https://www.npmjs.com/package/jimp
const https = require('https')
const fs = require('fs');
const client_id = "7c0725d4"
const songFile = fs.createWriteStream("test.mp3")
const COLOR_VALUE_MAX = colorValue(255,255,255)

let raw = JSON.parse(fs.readFileSync("./playlistInfo.json"))
let PlaylistsToPalette = []


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

// min=0, max=3
function colorDifferenceScore(rgb1, rgb2) {
  return (Math.abs(rgb1.r - rgb2.r) + Math.abs(rgb1.g - rgb2.g) + Math.abs(rgb1.b - rgb2.b)) / 255
}


function colorValue(r,g,b) {
  return r + g*256 + b*65536
}

function equalRGB(rgb1, rgb2) {
  return colorDifferenceScore(rgb1, rgb2) <= 0.5
  // ? EXPERIMENTAL value 0.5; Changes in these values result in noticeable changes in song output 
} 


// maxDifference is from 0 to 1 
function comparePalettes(paletteList1, paletteList2, maxDifference = 0.3) {
  let score1 = 0 
  let score2 = 0 
  
  for (let i = 0; i < paletteList1.length; i++) {
    loop1: 
    for (let j = 0; j < paletteList2.length; j++) {
      if (colorDifferenceScore(paletteList1[i], paletteList2[j]) <= maxDifference) {
        score1++; break loop1;
      }
    }

  }

  for (let i = 0; i < paletteList2.length; i++) {
    loop1: 
    for (let j = 0; j < paletteList1.length; j++) {
      if (colorDifferenceScore(paletteList1[j], paletteList2[i]) <= maxDifference) {
        score2++; break loop1
      }
    }

  }

  score1 /= paletteList1.length
  score2 /= paletteList2.length

  return Math.min(score1,score2)  
}


function closestPalette(palette) {
  let paletteScores = []
  for (let i = 0; i < PlaylistsToPalette.length; i++) {
    paletteScores.push({score: comparePalettes(palette, PlaylistsToPalette[i].palette, 0.2), id: PlaylistsToPalette[i].id})  // ? EXPERIMENTAL value -> the comparePalettes 3rd parameter  
  }
  paletteScores.sort((a, b) => b.score - a.score)
  return paletteScores[0].id
}


(function initializePlaylistsToPalette() {
  for (let i = 0; i < raw.length; i++) {
    let rgbArrays = []
    for (let j = 0; j < raw[i].palette.length; j++) 
      rgbArrays.push(new RGB(raw[i].palette[j][0],raw[i].palette[j][1],raw[i].palette[j][2]))
    PlaylistsToPalette.push({ palette: rgbArrays, id: raw[i].id })
  }
})()

GenerateSong("./images/red.png")


async function GenerateSong(file) {
    await jimp.read(file, function (err, image) {
        if (err) throw err
        let avgRed = 0 
        let avgGreen = 0 
        let avgBlue = 0 
        let colorPalette = []
        let colorAndWeight = {}

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
                 if (equalRGB(colorPalette[i], currentPixelRGB)) {
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

        let iterator = 0 
        let organizedPalette = []

        for (const color in colorAndWeight) {
          let colorWeight = parseFloat(((colorAndWeight[color] / pixels)).toFixed(2))
          if (colorWeight >= 0.01) {    // ? EXPERIMENTAL value 0.01; means that some color is 1% or more of an image 
            organizedPalette.push(new RGB( colorPalette[iterator].r, colorPalette[iterator].g, colorPalette[iterator].b ))
          }
          iterator++
        }

        console.log(`Considered Colors: ${organizedPalette.length}`)
        
        avgRed /= pixels; avgBlue /= pixels; avgGreen /= pixels
        console.log({r: Math.round(avgRed), g: Math.round(avgGreen), b: Math.round(avgBlue)})
        console.log(organizedPalette)
     

        let id = closestPalette(organizedPalette)

        const options = {
          hostname: 'api.jamendo.com',
          port: 443,
          path: `/v3.0/playlists/tracks?client_id=${client_id}&id=${id}&limit=200`,
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
            let avgRGBToInt = colorValue(avgRed, avgBlue, avgGreen)
            let selectedIndex = Math.round((avgRGBToInt*(tracks.length - 1))/COLOR_VALUE_MAX)
            let song = tracks[selectedIndex]

            console.log(`ID: ${id}\nPLAYLIST: ${JSON.parse(str).results[0].name}`)
            console.log(`LENGTH: ${tracks.length}`)

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


        
    });
}


