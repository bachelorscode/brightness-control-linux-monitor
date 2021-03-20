const express = require('express')
const cors = require('cors')

const { exec } = require('child_process')
const fs = require('fs')
const { default: axios } = require('axios')

const app = express()
app.use(express.static(__dirname + '/public'))
app.use(cors())

setInterval(async () => {
  await axios.get('http://localhost:4000/get')
}, 3000)


app.get('/get', (req, res) => {
  const value = fs.readFileSync(__dirname + '/value.json')
  const { brightness } = JSON.parse(value.toString())


  exec('xrandr --verbose --current | grep HDMI-0 -A5 | tail -n1', (err, stdout, stderr) => {
    if (!err) {
      const already = stdout.trim().split(' ')[1]
      if (already !== brightness)
        exec(`xrandr --output HDMI-0 --brightness ${brightness}`)
    }
  })


  res.send(brightness)
})

app.get('/set/:value', (req, res) => {
  exec(`xrandr --output HDMI-0 --brightness ${req.params.value}`)
  fs.writeFileSync(__dirname + '/value.json', JSON.stringify({ brightness: req.params.value }))
  res.send('done')
})


app.listen(4000, () => console.log('http://localhost:4000'))