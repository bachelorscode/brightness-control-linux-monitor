const { exec } = require('child_process')
const fs = require('fs')

const getMonitors = () => {
  return new Promise((resolve, reject) => {
    exec('xrandr | grep " connected" | cut -f1 -d " "', (err, stdout) => {
      if (err) reject(err)
      resolve(stdout.trim().split(' '))
    })
  })
}
const getCurrentBrightness = (monitorName) => {
  return new Promise((resolve, reject) => {
    exec(`xrandr --verbose --current | grep ${monitorName} -A5 | tail -n1`, (err, stdout) => {
      if (err) reject(err)
      resolve(stdout.trim().split(' ')[1])
    })
  })
}

const setBrightness = async (monitorName, brightness) => {
  const current = await getCurrentBrightness(monitorName)
  return new Promise((resolve, reject) => {
    if (current * 100 === brightness * 100) {
      return resolve('done')
    }

    exec(`xrandr --output ${monitorName} --brightness ${brightness}`, (err, stdout) => {
      if (err) return reject(`something went wrong. \n ${err}`)
      fs.writeFileSync(__dirname + '/value.json', JSON.stringify({ brightness }))
      return resolve(stdout.trim())
    })
  })
}

module.exports = { getMonitors, setBrightness, getCurrentBrightness }