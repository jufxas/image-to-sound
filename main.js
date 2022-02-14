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

class RGBW {
  constructor(r, g, b, weight) {
      this.r = r 
      this.g = g 
      this.b = b 
      this.weight = weight / 100
  }
  format() {
      return `rgb(${this.r},${this.g},${this.b})`
  }
}

// v1
// function getRGBIntAverage(paletteList) {
//   let avgR = 0 
//   let avgG = 0
//   let avgB = 0

//   for (let i = 0; i < paletteList.length; i++) {
//       avgR += paletteList[i].r * paletteList[i].weight
//       avgG += paletteList[i].g * paletteList[i].weight
//       avgB += paletteList[i].b * paletteList[i].weight
//   }
//   avgR /= paletteList.length
//   avgG /= paletteList.length
//   avgB /= paletteList.length
//   return Math.round(colorValue(avgR, avgG, avgB))
// }

// v2
// function getRGBIntAverage(paletteList) {
//   let weightedAverage = 0
//   for (let i = 0; i < paletteList.length; i++) {
//     weightedAverage += paletteList[i].weight * (  paletteList[i].rgbValue )
//   }
//   return weightedAverage
// }

// v3
// function getRGBIntAverage(paletteList) {
//   let avgR = 0 
//   let avgG = 0
//   let avgB = 0

//   for (let i = 0; i < paletteList.length; i++) {
//       avgR += paletteList[i].r * paletteList[i].weight
//       avgG += paletteList[i].g * paletteList[i].weight
//       avgB += paletteList[i].b * paletteList[i].weight
//   }
//   return Math.round(colorValue(avgR, avgG, avgB))

// }

// v4
// function getRGBIntAverage(paletteList) {
//   let avgR = 0 
//   let avgG = 0
//   let avgB = 0

//   for (let i = 0; i < paletteList.length; i++) {
//       avgR += paletteList[i].r * paletteList[i].weight
//       avgG += paletteList[i].g * paletteList[i].weight
//       avgB += paletteList[i].b * paletteList[i].weight
//   }
//   return Math.round(avgR + avgG + avgB)
// }

// v5
// function getRGBIntAverage(paletteList) {
//   let avgR = 0 
//   let avgG = 0
//   let avgB = 0

//   for (let i = 0; i < paletteList.length; i++) {
//       avgR += paletteList[i].r * paletteList[i].weight
//       avgG += paletteList[i].g * paletteList[i].weight
//       avgB += paletteList[i].b * paletteList[i].weight
//   }
//   return Math.round(colorValue(avgR, avgG, avgB))
// }

//v6
// function getRGBIntAverage(paletteList) {
//   let avgR = 0 
//   let avgG = 0
//   let avgB = 0

//   for (let i = 0; i < paletteList.length; i++) {
//       avgR += paletteList[i].r
//       avgG += paletteList[i].g
//       avgB += paletteList[i].b
//   }
//   avgR /= paletteList.length
//   avgG /= paletteList.length
//   avgB /= paletteList.length
//   return Math.round(colorValue(avgR, avgG, avgB))
// }

//v7 
// function getRGBIntAverage(paletteList) {
//   let avg = 0 

//   for (let i = 0; i < paletteList.length; i++) {
//       avg += paletteList[i].weight * 
//         colorValue(paletteList[i].r, paletteList[i].g, paletteList[i].b)
//   }

//   return avg
// }

//v8
function getRGBIntAverage(paletteList) {
  let avgR = 0 
  let avgG = 0
  let avgB = 0

  for (let i = 0; i < paletteList.length; i++) {
      avgR += paletteList[i].r * paletteList[i].weight
      avgG += paletteList[i].g * paletteList[i].weight
      avgB += paletteList[i].b * paletteList[i].weight
  }
  return Math.round(avgR + avgG +avgB)
}

GenerateSong("./images/diff.png", 1000)
let rawIdToWeightData = fs.readFileSync("./weights/idToWeightV8.json")
let idToWeight = JSON.parse(rawIdToWeightData)



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

          // CHANGE PALETTE SUM 
        let iterator = 0 
        let weightedPalette = []
        for (const color in colorAndWeight) {
          let colorWeight = parseFloat(((colorAndWeight[color] / pixels) * 100).toFixed(2))
          if (colorWeight >= 1) {
            colorAndWeightList.push({
              color: color, 
              weight: colorWeight
            })
            sum += colorWeight
            weightedPalette.push(new RGBW( colorPalette[iterator].r, colorPalette[iterator].g, colorPalette[iterator].b, colorWeight ))
          }
          iterator++
        }
        
        paletteSum = getRGBIntAverage(weightedPalette)
        

        console.log(colorAndWeightList)
        console.log(sum)
        console.log({r: Math.round(avgRed / pixels), g: Math.round(avgGreen / pixels), b: Math.round(avgBlue / pixels)})

        if (sum < 95) {
          console.log("********REDO*******")
          GenerateSong(file, differenceThreshold*10)
        } else {
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
              console.log(`SUM: ${paletteSum}\nID: ${id}\nPLAYLIST: ${JSON.parse(str).results[0].name}`)
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

